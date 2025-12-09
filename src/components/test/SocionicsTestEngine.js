// src/domain/SocionicsTestEngine.js

/**
 * Движок адаптивного соционического теста.
 *
 * Использование (пример):
 *
 * import answerScale from "../data/answerScale.json";
 * import questionSets from "../data/questionSets.json";
 * import testFlow from "../data/testFlow.json";
 * import allTypes from "../data/allTypes.json";
 *
 * const engine = new SocionicsTestEngine({
 *   answerScale,
 *   questionSets,
 *   testFlow,
 *   allTypes,
 * });
 *
 * const firstQuestion = engine.start();
 * engine.answer("strong_yes"); // или число 2
 */

export class SocionicsTestEngine {
    constructor({answerScale, questionSets, testFlow, allTypes}) {
        // Нормализуем шкалу ответов в единый формат: массив [{id, score, label?}]
        this.answerScale = this._normalizeAnswerScale(answerScale);
        this.rawQuestionSets = questionSets || {};
        this.testFlow = testFlow || {};
        this.allTypes = allTypes || {};

        // Индексируем шкалу ответов: id -> score
        this.answerScoreById = {};
        this.answerScale.forEach((opt) => {
            if (opt && opt.id != null) {
                this.answerScoreById[opt.id] =
                    typeof opt.score === "number" ? opt.score : 0;
            }
        });

        // Индекс стадий по id
        this.stageById = {};
        (this.testFlow.stages || []).forEach((stage) => {
            if (stage && stage.id) {
                this.stageById[stage.id] = stage;
            }
        });

        // Глобальные настройки адаптивности
        this.flowConfig = {
            initialQuestionsPerPole: 2,
            extraQuestionsPerPole: 2,
            maxQuestionsPerPole: 6,
            decisionThreshold: 3,
            ...(this.testFlow.config || {}),
        };

        // Предобработка наборов вопросов: сортируем по priority
        this.questionSets = {};
        for (const [setId, set] of Object.entries(this.rawQuestionSets)) {
            const cloned = {
                ...set,
                questions: {},
            };
            if (set && set.questions) {
                for (const [pole, arr] of Object.entries(set.questions)) {
                    cloned.questions[pole] = (arr || [])
                        .slice()
                        .sort((a, b) => {
                            const pa = a.priority ?? 999;
                            const pb = b.priority ?? 999;
                            return pa - pb;
                        });
                }
            }
            this.questionSets[setId] = cloned;
        }

        this.reset();
    }

    /**
     * Получаем базовый результат теста
     * @returns {{leadingCode: null, jp: *, rationality: (string), ie: *, base: *}|null}
     */
    getBaseSummary() {
        const jp = this.path.JP;    // J / P
        const base = this.path.Base; // N / S / T / F
        const ie = this.path.IE;    // E / I

        if (!jp || !base || !ie) {
            return null;
        }

        const rationality = jp === "J" ? "rational" : "irrational";

        let leadingCode = null;

        if (jp === "P") {
            if (base === "N") leadingCode = ie === "E" ? "Ne" : "Ni";
            if (base === "S") leadingCode = ie === "E" ? "Se" : "Si";
        } else {
            if (base === "T") leadingCode = ie === "E" ? "Te" : "Ti";
            if (base === "F") leadingCode = ie === "E" ? "Fe" : "Fi";
        }

        return {
            jp,
            base,
            ie,
            rationality,
            leadingCode,
        };
    }

    /**
     * Старт второй части теста
     * @param baseSummary
     * @returns {{questionSetId, meta: {totalAnswered: *}, id: *, text: *, pole: *, dimension, stageId: *}|null}
     */
    startFromBaseSummary(baseSummary) {
        this.reset();

        if (!baseSummary) {
            throw new Error("No base summary provided");
        }

        this.path.JP = baseSummary.jp;
        this.path.Base = baseSummary.base;
        this.path.IE = baseSummary.ie;

        const jp = baseSummary.jp;
        const base = baseSummary.base;
        const ie = baseSummary.ie;

        let nextStageId = null;

        if (jp === "P") {
            const ieStage = this.stageById["IE_Irrational"];
            if (ieStage && ieStage.nextByContext) {
                const key = `${base}_${ie}`; // N_E, N_I, S_E, S_I
                nextStageId = ieStage.nextByContext[key] || null;
            }
        } else if (jp === "J") {
            const ieStage = this.stageById["IE_Rational"];
            if (ieStage && ieStage.nextByContext) {
                const key = `${base}_${ie}`; // T_E, T_I, F_E, F_I
                nextStageId = ieStage.nextByContext[key] || null;
            }
        }

        if (!nextStageId) {
            // если по какой-то причине не нашли — просто завершаем тест
            this._finalizeType();
            this.finished = true;
            this.currentQuestion = null;
            return null;
        }

        this.currentStageId = nextStageId;
        this.currentQuestion = this._selectNextQuestionForStage(this.currentStageId);
        return this.getCurrentQuestion();
    }


    /**
     * Приводим answerScale к массиву [{id, score, label?}].
     * Поддерживаем 2 формата:
     * 1) уже массив
     * 2) объект вида { ru: { options: [...] }, en: { options: [...] } }
     *    как в твоём answerScale.json для модалки.
     * @private
     */
    _normalizeAnswerScale(raw) {
        if (!raw) return [];

        // Уже массив — ничего не делаем
        if (Array.isArray(raw)) return raw;

        // Пробуем форматы вида { options: [...] } или { ru: { options: [...] }, en: ... }
        const options =
            raw.options ||
            raw.ru?.options ||
            raw.en?.options ||
            [];

        return options.map((opt) => ({
            id: opt.id ?? String(opt.value),
            score:
                typeof opt.score === "number"
                    ? opt.score
                    : typeof opt.value === "number"
                        ? opt.value
                        : 0,
            // label нам в движке почти не нужен, но пусть будет
            label:
                typeof opt.label === "string"
                    ? {ru: opt.label, en: opt.label}
                    : opt.label || {},
        }));
    }


    /**
     * Полный сброс состояния движка.
     */
    reset() {
        this.currentStageId = this._getFirstStageId();
        this.finished = false;

        // Состояние по каждой стадии (дихотомии / мини-блоку)
        this.stageState = {};
        // Путь по ключевым измерениям (по названиям dimension в testFlow)
        this.path = {
            JP: null,       // J / P
            Base: null,     // N / S / T / F
            IE: null,       // E / I
            Creative: null, // Ti / Fi / Te / Fe / Ni / Si / Ne / Se
        };

        this.currentQuestion = null;
        this.finalTypeId = null;
        this.finalType = null;
        this.totalAnswered = 0;
    }

    /**
     * Возвращает id первой стадии (берём первый stage, который не terminal).
     * @private
     */
    _getFirstStageId() {
        const stages = this.testFlow.stages || [];
        const first = stages.find((s) => s && s.type !== "terminal");
        return first ? first.id : null;
    }

    /**
     * Старт теста: сбрасывает состояние и отдаёт первый вопрос.
     * @returns {Object|null} вопрос
     */
    start() {
        this.reset();
        if (!this.currentStageId) {
            throw new Error("SocionicsTestEngine: testFlow.stages пустой или невалидный");
        }
        this.currentQuestion = this._selectNextQuestionForStage(this.currentStageId);
        return this.getCurrentQuestion();
    }

    /**
     * Текущий вопрос (для UI).
     * Возвращаем объект с минимально необходимой инфой.
     */
    getCurrentQuestion() {
        if (!this.currentQuestion) return null;

        const stage = this.stageById[this.currentQuestion.stageId];
        return {
            id: this.currentQuestion.id,
            text: this.currentQuestion.text, // {ru, en}
            pole: this.currentQuestion.pole, // к какому полюсу относится
            stageId: this.currentQuestion.stageId,
            dimension: stage?.dimension || null,
            questionSetId: stage?.questionSetId || null,
            // немного служебной инфы
            meta: {
                totalAnswered: this.totalAnswered,
            },
        };
    }

    /**
     * Ответ пользователя.
     * @param {string|number} answerIdOrScore - id варианта (из answerScale.json) или числовой балл
     *
     * @returns {{
     *   question: Object|null,
     *   stageCompleted: boolean,
     *   stageResult: { dimension: string|null, pole: string|null } | null,
     *   testCompleted: boolean,
     *   finalType: Object|null
     * }}
     */
    answer(answerIdOrScore) {
        if (this.finished) {
            return {
                question: null,
                stageCompleted: false,
                stageResult: null,
                testCompleted: true,
                finalType: this.finalType,
            };
        }

        if (!this.currentQuestion || !this.currentStageId) {
            throw new Error("SocionicsTestEngine: нет активного вопроса");
        }

        const stageId = this.currentStageId;
        const stage = this.stageById[stageId];
        if (!stage) {
            throw new Error(`SocionicsTestEngine: неизвестная стадия ${stageId}`);
        }

        const score = this._resolveScore(answerIdOrScore);
        const question = this.currentQuestion;

        // Обновляем состояние стадии
        const st = this._ensureStageState(stageId, stage);
        const pole = question.pole;

        if (!(pole in st.scores)) {
            st.scores[pole] = 0;
            st.askedCount[pole] = 0;
        }

        st.scores[pole] += score;
        st.askedCount[pole] += 1;
        st.askedQuestions.add(question.id);
        st.totalAsked += 1;
        this.totalAnswered += 1;

        // Проверяем, можно ли уже принять решение по этой стадии
        const {decided, resultPole} = this._checkStageDecision(stageId, stage, st);

        let stageCompleted = false;
        let stageResult = null;

        if (decided) {
            stageCompleted = true;
            st.decided = true;
            st.resultPole = resultPole;

            // Записываем в path по dimension стадии (если оно есть)
            if (stage.dimension) {
                // Особый случай: креативная функция
                if (stage.dimension === "Creative") {
                    this.path.Creative = resultPole;
                } else if (stage.dimension === "JP") {
                    this.path.JP = resultPole;
                } else if (stage.dimension === "Base") {
                    this.path.Base = resultPole;
                } else if (stage.dimension === "IE") {
                    this.path.IE = resultPole;
                } else {
                    // На будущее — любые другие dimension
                    this.path[stage.dimension] = resultPole;
                }
            }

            stageResult = {
                dimension: stage.dimension || null,
                pole: resultPole,
            };

            // Выбираем следующую стадию по конфигу
            const nextStageId = this._resolveNextStageId(stage, resultPole);

            if (!nextStageId) {
                // Нет явного next — завершаем тест
                this._finalizeType();
                this.finished = true;
                this.currentQuestion = null;

                return {
                    question: null,
                    stageCompleted,
                    stageResult,
                    testCompleted: true,
                    finalType: this.finalType,
                };
            }

            const nextStage = this.stageById[nextStageId];

            if (!nextStage || nextStage.type === "terminal") {
                // Терминальная стадия — считаем финальный тип
                this._finalizeType();
                this.finished = true;
                this.currentQuestion = null;

                return {
                    question: null,
                    stageCompleted,
                    stageResult,
                    testCompleted: true,
                    finalType: this.finalType,
                };
            }

            // Переходим к следующей стадии
            this.currentStageId = nextStageId;
            this.currentQuestion = this._selectNextQuestionForStage(this.currentStageId);

            // Если в следующей стадии нет вопросов — тест завершаем.
            if (!this.currentQuestion) {
                this._finalizeType();
                this.finished = true;

                return {
                    question: null,
                    stageCompleted,
                    stageResult,
                    testCompleted: true,
                    finalType: this.finalType,
                };
            }
        } else {
            // Стадия ещё не завершена — берём следующий вопрос в той же стадии
            this.currentQuestion = this._selectNextQuestionForStage(this.currentStageId);
            // Если вопросов больше нет, принудительно завершаем стадию и пересчитываем
            if (!this.currentQuestion) {
                const forced = this._forceFinishStage(stageId, stage, st);
                stageCompleted = true;
                stageResult = {
                    dimension: stage.dimension || null,
                    pole: forced.resultPole,
                };

                const nextStageId = this._resolveNextStageId(stage, forced.resultPole);
                if (!nextStageId) {
                    this._finalizeType();
                    this.finished = true;
                    return {
                        question: null,
                        stageCompleted,
                        stageResult,
                        testCompleted: true,
                        finalType: this.finalType,
                    };
                }

                const nextStage = this.stageById[nextStageId];
                if (!nextStage || nextStage.type === "terminal") {
                    this._finalizeType();
                    this.finished = true;
                    return {
                        question: null,
                        stageCompleted,
                        stageResult,
                        testCompleted: true,
                        finalType: this.finalType,
                    };
                }

                this.currentStageId = nextStageId;
                this.currentQuestion = this._selectNextQuestionForStage(this.currentStageId);

                if (!this.currentQuestion) {
                    this._finalizeType();
                    this.finished = true;

                    return {
                        question: null,
                        stageCompleted,
                        stageResult,
                        testCompleted: true,
                        finalType: this.finalType,
                    };
                }
            }
        }

        return {
            question: this.getCurrentQuestion(),
            stageCompleted,
            stageResult,
            testCompleted: this.finished,
            finalType: this.finalType,
        };
    }

    /**
     * Определяет итоговый тип по path и allTypes.
     * @private
     */
    _finalizeType() {
        // Если уже посчитан
        if (this.finalType) return this.finalType;

        const jp = this.path.JP; // J / P
        const base = this.path.Base; // N / S / T / F
        const ie = this.path.IE; // E / I
        const creativeCode = this.path.Creative; // например "Ti" / "Fi"

        if (!jp || !base || !ie) {
            this.finalType = null;
            this.finalTypeId = null;
            return null;
        }

        const rationality = jp === "J" ? "rational" : "irrational";

        // Вычисляем код ведущей функции по base + IE + J/P
        let leadingCode = null;

        if (jp === "P") {
            // Иррационалы: базовая — интуиция или сенсорика
            if (base === "N") {
                leadingCode = ie === "E" ? "Ne" : "Ni";
            } else if (base === "S") {
                leadingCode = ie === "E" ? "Se" : "Si";
            }
        } else {
            // Рационалы: базовая — логика или этика
            if (base === "T") {
                leadingCode = ie === "E" ? "Te" : "Ti";
            } else if (base === "F") {
                leadingCode = ie === "E" ? "Fe" : "Fi";
            }
        }

        if (!leadingCode) {
            this.finalType = null;
            this.finalTypeId = null;
            return null;
        }

        const allTypesArray = Object.values(this.allTypes || {});

        // Ищем тип по ведущей, рациональности и творческой функции (если есть)
        const found = allTypesArray.find((t) => {
            if (!t || !t.leading || !t.leading.code) return false;
            if (t.rationality && t.rationality !== rationality) return false;
            if (t.leading.code !== leadingCode) return false;

            if (creativeCode && t.creative && t.creative.code) {
                return t.creative.code === creativeCode;
            }
            return true;
        });

        if (found) {
            this.finalType = found;
            this.finalTypeId = found.id;
        } else {
            this.finalType = null;
            this.finalTypeId = null;
        }

        return this.finalType;
    }

    /**
     * Получить числовой балл по id варианта ответа или напрямую по числу.
     * @private
     */
    _resolveScore(answerIdOrScore) {
        if (typeof answerIdOrScore === "number") {
            return answerIdOrScore;
        }
        const score = this.answerScoreById[answerIdOrScore];
        if (typeof score !== "number") {
            throw new Error(`SocionicsTestEngine: неизвестный вариант ответа ${answerIdOrScore}`);
        }
        return score;
    }

    /**
     * Инициализация состояния стадии.
     * @private
     */
    _ensureStageState(stageId, stage) {
        if (!this.stageState[stageId]) {
            const st = {
                scores: {},
                askedCount: {},
                askedQuestions: new Set(),
                totalAsked: 0,
                decided: false,
                resultPole: null,
            };

            const poles = stage.poles || [];
            poles.forEach((p) => {
                st.scores[p] = 0;
                st.askedCount[p] = 0;
            });

            this.stageState[stageId] = st;
        }
        return this.stageState[stageId];
    }

    /**
     * Выбор следующего вопроса для указанной стадии.
     * @private
     */
    _selectNextQuestionForStage(stageId) {
        const stage = this.stageById[stageId];
        if (!stage || !stage.questionSetId) return null;

        const set = this.questionSets[stage.questionSetId];
        if (!set || !set.questions) return null;

        const st = this._ensureStageState(stageId, stage);
        const poles = stage.poles || [];

        const maxPerPole = this.flowConfig.maxQuestionsPerPole;

        // Попытка балансировать по минимальному количеству заданных вопросов на полюс
        const candidates = poles
            .map((p) => ({
                pole: p,
                asked: st.askedCount[p] || 0,
            }))
            .filter((c) => c.asked < maxPerPole);

        if (candidates.length === 0) {
            return null;
        }

        // Берём полюс, по которому меньше всего задано
        candidates.sort((a, b) => a.asked - b.asked);

        for (const cand of candidates) {
            const pole = cand.pole;
            const questions = set.questions[pole] || [];
            const used = st.askedQuestions;

            const q = questions.find((q) => !used.has(q.id));
            if (q) {
                return {
                    ...q,
                    pole,
                    stageId,
                };
            }
        }

        // Вопросов больше нет
        return null;
    }

    /**
     * Проверка, можно ли завершить стадию на основе текущих баллов.
     * @private
     */
    _checkStageDecision(stageId, stage, st) {
        const poles = stage.poles || [];
        if (poles.length < 2) {
            return { decided: true, resultPole: poles[0] || null };
        }

        const [p1, p2] = poles;

        const s1 = st.scores[p1] || 0;
        const s2 = st.scores[p2] || 0;
        const diff = s1 - s2;

        const threshold = this.flowConfig.decisionThreshold || 3;
        const maxPerPole = this.flowConfig.maxQuestionsPerPole || 6;
        const minPerPole = this.flowConfig.initialQuestionsPerPole || 2;

        const asked1 = st.askedCount[p1] || 0;
        const asked2 = st.askedCount[p2] || 0;

        const allAtMax = asked1 >= maxPerPole && asked2 >= maxPerPole;
        const enoughAskedInitially = asked1 >= minPerPole && asked2 >= minPerPole;

        // ⛔ Минимум 2 на каждый полюс ещё не задано — решение нельзя принимать
        if (!enoughAskedInitially && !allAtMax) {
            return { decided: false, resultPole: null };
        }

        // ✔ Достаточно вопросов + достаточная разница
        if (Math.abs(diff) >= threshold || allAtMax) {
            let resultPole = null;

            if (diff > 0) resultPole = p1;
            else if (diff < 0) resultPole = p2;
            else resultPole = p1; // ничья → первый полюс, как fallback

            return { decided: true, resultPole };
        }

        // ❌ Пока недостаточно разницы — продолжаем
        return { decided: false, resultPole: null };
    }

    /**
     * Принудительное завершение стадии, если вопросы закончились до достижения порога.
     * @private
     */
    _forceFinishStage(stageId, stage, st) {
        const poles = stage.poles || [];
        if (poles.length < 2) {
            const only = poles[0] || null;
            st.decided = true;
            st.resultPole = only;
            return {resultPole: only};
        }

        const [p1, p2] = poles;
        const s1 = st.scores[p1] || 0;
        const s2 = st.scores[p2] || 0;
        const diff = s1 - s2;

        let resultPole = null;
        if (diff > 0) resultPole = p1;
        else if (diff < 0) resultPole = p2;
        else resultPole = p1; // при равенстве — первый

        st.decided = true;
        st.resultPole = resultPole;

        // Запишем в path, если dimension есть
        if (stage.dimension) {
            if (stage.dimension === "Creative") {
                this.path.Creative = resultPole;
            } else if (stage.dimension === "JP") {
                this.path.JP = resultPole;
            } else if (stage.dimension === "Base") {
                this.path.Base = resultPole;
            } else if (stage.dimension === "IE") {
                this.path.IE = resultPole;
            } else {
                this.path[stage.dimension] = resultPole;
            }
        }

        return {resultPole};
    }

    /**
     * Определяем следующую стадию на основании результата и описания в testFlow.
     * Поддерживает:
     *  - stage.next[pole]
     *  - stage.next["*"]
     *  - stage.nextByContext["BasePole_CurrentPole"] (если есть stage.contextDimension)
     * @private
     */
    _resolveNextStageId(stage, resultPole) {
        if (!stage) return null;

        // Сначала nextByContext — для случаев, когда нужно учесть предыдущий результат
        if (stage.nextByContext && stage.contextDimension) {
            const ctxDim = stage.contextDimension;
            const ctxVal = this.path[ctxDim];
            if (ctxVal && resultPole) {
                const key = `${ctxVal}_${resultPole}`;
                if (stage.nextByContext[key]) {
                    return stage.nextByContext[key];
                }
            }
        }

        // Обычный переход по next[pole] или next["*"]
        if (stage.next) {
            if (resultPole && stage.next[resultPole]) {
                return stage.next[resultPole];
            }
            if (stage.next["*"]) {
                return stage.next["*"];
            }
        }

        return null;
    }
}