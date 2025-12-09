// src/hooks/useSocionicsEngine.js
import { useRef, useState } from "react";
import { SocionicsTestEngine } from "../components/test/SocionicsTestEngine";

import testFlow from "../data/testFlow.json";
import answerScale from "../data/answerScale.json";
import allTypes from "../data/allTypes.json";

// База (JP / NS / TF / IE)
import baseQuestionSets from "../data/questionSets.json";
// Креативные блоки (Creative_*)
import creativeQuestionSets from "../data/questionSets_creative_translated.json";

// Объединяем наборы вопросов в один объект для движка
const mergedQuestionSets = {
    ...baseQuestionSets,
    ...creativeQuestionSets,
};

const BASE_STORAGE_KEY = "socionicsBaseResult";

export function useSocionicsEngine(userId) {
    const engineRef = useRef(null);

    const [showTests, setShowTests] = useState(false);
    const [showResults, setShowResults] = useState(false);

    const [currentTest, setCurrentTest] = useState(null);
    const [currentQuestion, setCurrentQuestion] = useState(null);
    const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
    const [totalQuestions, setTotalQuestions] = useState(0);

    const [resultData, setResultData] = useState(null);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);

    // Флаг: базовая часть (JP + Base + IE) завершена
    const [baseCompleted, setBaseCompleted] = useState(false);

    const ensureEngine = () => {
        if (!engineRef.current) {
            engineRef.current = new SocionicsTestEngine({
                answerScale,
                questionSets: mergedQuestionSets,
                testFlow,
                allTypes,
            });
        }
        return engineRef.current;
    };

    // Полный запуск теста с нуля (1-я + 2-я часть)
    const startTest = (test) => {
        setError(null);
        setBaseCompleted(false);

        const engine = ensureEngine();
        engine.reset();

        const firstQuestion = engine.start();
        console.log("ENGINE firstQuestion:", firstQuestion);

        setCurrentTest(test || { id: "socionics_full" });
        setCurrentQuestion(firstQuestion);
        setCurrentQuestionIndex(0);

        // Грубая оценка количества вопросов
        const stagesCount = (testFlow.stages || []).filter(
            (s) => s.type !== "terminal"
        ).length;
        const maxPerPole = testFlow.config?.maxQuestionsPerPole ?? 6;
        setTotalQuestions(stagesCount * maxPerPole);

        setShowTests(false);
        setShowResults(false);
        setResultData(null);
    };

    // Ответ на текущий вопрос
    const answerQuestion = async (answerValue) => {
        if (!currentQuestion) return;

        setIsLoading(true);
        setError(null);

        try {
            const engine = ensureEngine();
            const res = engine.answer(answerValue);

            console.log("ENGINE answer result:", res);

            // Если завершена стадия IE → базовая часть готова
            if (res.stageCompleted && res.stageResult?.dimension === "IE") {
                const baseSummary = engine.getBaseSummary?.();
                if (baseSummary) {
                    const payload = {
                        ...baseSummary,
                        createdAt: new Date().toISOString(),
                    };

                    try {
                        localStorage.setItem(BASE_STORAGE_KEY, JSON.stringify(payload));
                        console.log("Saved base result to localStorage:", payload);
                        setBaseCompleted(true);
                    } catch (e) {
                        console.warn("Failed to save base result", e);
                    }
                }
            }

            // Если тест завершен — отправляем финальный результат
            if (res.testCompleted) {
                await finalize(res.finalType);
                return;
            }

            // Тест НЕ завершён → показываем следующий вопрос
            setCurrentQuestion(res.question);
            setCurrentQuestionIndex((prev) => prev + 1);

        } catch (e) {
            console.error("Socionics answerQuestion error", e);
            setError("Ошибка при обработке ответа. Попробуйте ещё раз.");
        } finally {
            setIsLoading(false);
        }
    };

    // Запуск только 2-й части по сохранённой базе
    const startFromSavedBase = () => {
        setError(null);
        setBaseCompleted(true); // мы уже знаем, что база была пройдена ранее

        let saved = null;
        try {
            const raw = localStorage.getItem(BASE_STORAGE_KEY);
            if (raw) saved = JSON.parse(raw);
        } catch (e) {
            console.warn("Failed to read base result from localStorage", e);
        }

        if (!saved) {
            setError("Нет сохранённого базового результата теста.");
            return;
        }

        const engine = ensureEngine();

        let firstQuestion = null;
        try {
            firstQuestion = engine.startFromBaseSummary(saved);
        } catch (e) {
            console.error("startFromBaseSummary error", e);
        }

        if (!firstQuestion) {
            setError("Не удалось возобновить вторую часть теста.");
            return;
        }

        setCurrentTest({ id: "socionics_creative" });
        setCurrentQuestion(firstQuestion);
        setCurrentQuestionIndex(0);
        setShowTests(false);
        setShowResults(false);
        setResultData(null);
    };

    const resetTest = () => {
        setShowTests(false);
        setShowResults(false);
        setCurrentTest(null);
        setCurrentQuestion(null);
        setCurrentQuestionIndex(0);
        setTotalQuestions(0);
        setResultData(null);
        setError(null);
        setBaseCompleted(false);
        // движок при следующем старте сам себя сбросит через reset()
    };

    async function finalize(finalType) {
        if (!finalType) {
            console.warn("No finalType passed to finalize()");
            return;
        }

        const result = {
            typeId: finalType.id,
            ru: {
                label: finalType.nickname?.ru || finalType.codeRu || finalType.id,
                description: finalType.descriptionRu || "",
            },
            en: {
                label: finalType.nickname?.en || finalType.id,
                description: finalType.descriptionEn || "",
            },
            createdAt: new Date().toISOString(),
        };

        // 1. Сохраняем локально
        try {
            localStorage.setItem("socionicsFinalResult", JSON.stringify(result));
            console.log("Saved local result");
        } catch (e) {
            console.warn("Failed to save localResult:", e);
        }

        // 2. Сохраняем на сервер
        try {
            if (userId) {
                await apiClient.saveTestResult(userId, result);
                console.log("Result saved to backend");
            } else {
                console.warn("Cannot save to backend — no userId");
            }
        } catch (e) {
            console.warn("Failed to send result to backend:", e);
        }

        // 3. Отображаем
        setResultData(result);
        setShowResults(true);
        setCurrentQuestion(null);
    }

    return {
        showTests,
        setShowTests,
        showResults,

        currentTest,
        currentQuestion,
        currentQuestionIndex,
        totalQuestions,

        startTest,
        startFromSavedBase,
        answerQuestion,
        resetTest,

        resultData,
        isLoading,
        error,

        baseCompleted,
    };
}
