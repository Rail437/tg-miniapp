// src/api/mockApiClient.js
// import {TYPE_RESULTS} from "../data/typeResults";
import allTypes from "../data/allTypes.json";

const STORAGE_KEY = "innercode_mock_db";

function loadDb() {
    try {
        const raw = localStorage.getItem(STORAGE_KEY);
        if (!raw) {
            return {
                users: [],
                sessions: [],
                results: [],
                referrals: [],
                referralUses: [],
                compatibilityPurchases: [],
                wheelResults: [],
            };
        }
        const data = JSON.parse(raw);
        if (!Array.isArray(data.compatibilityPurchases)) {
            data.compatibilityPurchases = [];
        }
        return data;
    } catch {
        return {
            users: [],
            sessions: [],
            results: [],
            referrals: [],
            referralUses: [],
            compatibilityPurchases: [],
            wheelResults: [],
        };
    }
}

function saveDb(db) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(db));
}

function delay(ms = 200) {
    return new Promise((resolve) => setTimeout(resolve, ms));
}

function generateId(prefix = "id") {
    return `${prefix}_${Math.random().toString(36).slice(2, 10)}`;
}

// Количество вопросов в нашем единственном тесте
const TOTAL_STEPS = 4;
const DEFAULT_COMPAT_PRICE = 50;

function formatTypeLabel(typeId, lang = "ru") {
    const meta = allTypes[typeId] || {};
    if (lang === "ru") {
        return meta.nickname?.ru || meta.codeRu || typeId || "—";
    }
    return meta.nickname?.en || typeId || "—";
}

function buildCompatibilityResult({userTypeId, targetTypeId, targetLabel}) {
    const userRu = formatTypeLabel(userTypeId, "ru");
    const userEn = formatTypeLabel(userTypeId, "en");
    const targetRu = targetLabel?.ru || formatTypeLabel(targetTypeId, "ru");
    const targetEn = targetLabel?.en || formatTypeLabel(targetTypeId, "en");

    return {
        title: {
            ru: `Совместимость: ${userRu} + ${targetRu}`,
            en: `Compatibility: ${userEn} + ${targetEn}`,
        },
        summary: {
            ru: `Как взаимодействуют ${userRu} и ${targetRu}.`,
            en: `How ${userEn} and ${targetEn} interact.`,
        },
        strengths: [
            {
                ru: `Сильные стороны пары: ${userRu} усиливает ${targetRu} в ключевых решениях, а ${targetRu} добавляет гибкости.`,
                en: `Strengths: ${userEn} brings structure while ${targetEn} adds flexibility.`,
            },
            {
                ru: `Высокий потенциал доверия и обмена идеями.`,
                en: `High potential for trust and idea exchange.`,
            },
        ],
        risks: [
            {
                ru: `Возможны разные темпы и ожидания: важно договариваться о приоритетах.`,
                en: `Different pace and expectations — align on priorities early.`,
            },
        ],
        advice: [
            {
                ru: `Заранее обсуждайте, кто за что отвечает, чтобы снизить трение.`,
                en: `Clarify responsibilities upfront to reduce friction.`,
            },
            {
                ru: `Поддерживайте регулярную обратную связь и фиксируйте договорённости.`,
                en: `Keep regular feedback loops and document agreements.`,
            },
        ],
    };
}

/**
 * Мок-авторизация через Telegram
 */
export async function authTelegram(initDataMock) {
    await delay();
    const db = loadDb();

    // Берём ?u= из адресной строки, чтобы различать "юзеров" в одном браузере
    const params = new URLSearchParams(window.location.search);
    const userKey = params.get("u") || "default";

    // Ищем пользователя по "telegramId"
    let user = db.users.find((u) => u.telegramId === userKey);
    if (!user) {
        user = {
            id: generateId("user"),
            telegramId: userKey,
            createdAt: new Date().toISOString(),
        };
        db.users.push(user);
        saveDb(db);
    }

    const lastResult = db.results.find((r) => r.userId === user.id) || null;

    return {
        userId: user.id,
        lastResult,
    };
}

/**
 * Начать основной тест
 */
export async function startMainTest(userId) {
    await delay();
    const db = loadDb();

    const sessionId = generateId("session");

    const session = {
        id: sessionId,
        userId,
        testId: "main_socionic",
        status: "IN_PROGRESS",
        currentStep: 0,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        answers: [], // { questionIndex, answerValue }
    };

    db.sessions.push(session);
    saveDb(db);

    return {
        sessionId,
        currentStep: 0,
        totalSteps: TOTAL_STEPS,
    };
}

// Для совместимости с apiClient.setAuthToken
export function setAuthToken(token) {
    // в моках ничего не делаем
}

/**
 * Ответ на вопрос
 */
export async function answerMainTest({sessionId, questionIndex, answerValue}) {
    await delay();
    const db = loadDb();

    const session = db.sessions.find((s) => s.id === sessionId);
    if (!session) throw new Error("Session not found");

    session.answers = session.answers.filter(
        (a) => a.questionIndex !== questionIndex
    );
    session.answers.push({questionIndex, answerValue});

    const nextStep = questionIndex + 1;
    session.currentStep = nextStep;
    session.updatedAt = new Date().toISOString();

    saveDb(db);

    if (nextStep >= TOTAL_STEPS) {
        return {
            status: "COMPLETED",
            nextStep: TOTAL_STEPS,
        };
    }

    return {
        status: "IN_PROGRESS",
        nextStep,
    };
}

/**
 * Получить состояние сессии (на будущее, если будем продолжать тест)
 */
export async function getTestSession(sessionId) {
    await delay();
    const db = loadDb();

    const session = db.sessions.find((s) => s.id === sessionId);
    if (!session) throw new Error("Session not found");

    return {
        sessionId: session.id,
        currentStep: session.currentStep,
        totalSteps: TOTAL_STEPS,
        status: session.status,
        answers: session.answers,
    };
}

/**
 * Завершить тест — считаем результат по соционике (упрощённо)
 * ТЕПЕРЬ: возвращаем результат с полями RU + EN
 */
export async function completeMainTest(sessionId) {
    await delay();
    const db = loadDb();

    const session = db.sessions.find((s) => s.id === sessionId);
    if (!session) {
        throw new Error("Session not found");
    }

    // Суммируем "да"
    const sumYes = session.answers.reduce(
        (acc, a) => acc + (typeof a.answerValue === "number" ? a.answerValue : 0),
        0
    );

    // Логика определения
    // const baseResult = sumYes <= 2 ? TYPE_RESULTS.SEI : TYPE_RESULTS.ILE;

    const now = new Date().toISOString();

    const resultRecord = {
        id: generateId("result"),
        userId: session.userId,
        sessionId: session.id,
        typeId: baseResult.typeId,
        ru: baseResult.ru,
        en: baseResult.en,
        createdAt: now,
    };

    // Сохраняем только свежий результат пользователя
    db.results = db.results.filter((r) => r.userId !== session.userId);
    db.results.push(resultRecord);

    session.status = "COMPLETED";
    session.resultType = baseResult.typeId;
    session.updatedAt = now;

    saveDb(db);

    return resultRecord;
}

export async function saveTestResult(userId, result) {
    console.log("MOCK saveTestResult", {userId, result});

    const db = loadDb();

    // минимальная запись, близкая к тому, что будет в БД
    const record = {
        id: generateId("result"),
        userId,
        typeId: result.typeId,
        createdAt: result.createdAt,
        result: {}, // сюда можешь потом что-нибудь добавить
    };

    // удаляем старый результат пользователя, если был
    db.results = db.results.filter((r) => r.userId !== userId);
    db.results.push(record);

    saveDb(db);

    // для фронта всё равно вернём "ок"
    return {ok: true};
}

/**
 * Последний результат пользователя
 */
export async function getLastResult(userId) {
    await delay();
    const db = loadDb();
    return db.results.find((r) => r.userId === userId) || null;
}

/**
 * Рефералка — как раньше (минимально для MVP)
 */
export async function getMyReferral(userId) {
    await delay();
    const db = loadDb();

    let referral = db.referrals.find((r) => r.userId === userId);
    if (!referral) {
        referral = {
            id: generateId("ref"),
            userId,
            code: Math.random().toString(36).slice(2, 8),
            createdAt: new Date().toISOString(),
        };
        db.referrals.push(referral);
        saveDb(db);
    }

    const link = `${window.location.origin}?ref=${referral.code}`;

    return {
        code: referral.code,
        link,
    };
}

export async function registerReferralUse({code, invitedUserId}) {
    await delay();
    const db = loadDb();

    const referral = db.referrals.find((r) => r.code === code);
    if (!referral) return {ok: false};
    if (referral.userId === invitedUserId) return {ok: false};

    const exists = db.referralUses.some(
        (u) => u.referralId === referral.id && u.invitedUserId === invitedUserId
    );
    if (!exists) {
        db.referralUses.push({
            id: generateId("refuse"),
            referralId: referral.id,
            invitedUserId,
            createdAt: new Date().toISOString(),
        });
        saveDb(db);
    }

    return {ok: true};
}

export async function getMyInvited(userId) {
    await delay();
    const db = loadDb();

    const myReferral = db.referrals.find((r) => r.userId === userId);
    if (!myReferral) return [];

    const uses = db.referralUses.filter((u) => u.referralId === myReferral.id);

    const invited = uses.map((u) => {
        const result = db.results.find((r) => r.userId === u.invitedUserId);

        // Пытаемся достать имя из "users" (если ты его там хранишь)
        const invitedUser = db.users.find((usr) => usr.id === u.invitedUserId);

        return {
            invitedUserId: u.invitedUserId,
            joinedAt: u.createdAt,

            // новое поле имя (может быть null)
            name: invitedUser?.name || null,

            // новый флаг: тест пройден или нет
            completed: !!result,   // true, если у пользователя уже есть результат

            // старые поля – можно оставить, если где-то ещё используются
            resultType: result?.typeId || null,
            resultLabel: result?.label || null,
        };
    });

    return invited;
}

export async function submitStory({userId, text}) {
    console.log("userId:" + userId)
    console.log("text:" + text)
}

/**
 * Профиль клиента (фича-флаги)
 */
export async function getClientProfile(userId) {
    await delay();
    const liveEnabled = true;
    const compatibilityEnabled = true;

    return {
        userId,
        flags: {
            live: liveEnabled,
            compatibility: compatibilityEnabled,
        },
    };
}

// В mockApiClient.js ДОБАВЛЯЕМ/ОБНОВЛЯЕМ следующие функции:
export async function submitLiveWheel(payload) {
    await delay();

    const db = loadDb();

    // Сохраняем результат колеса
    const wheelResult = {
        id: generateId("wheel"),
        userId: payload.userId,
        values: payload.values,
        spheres: payload.spheres || Object.keys(payload.values || {}),
        metadata: payload.metadata || {},
        completedAt: payload.completedAt || new Date().toISOString(),
        createdAt: new Date().toISOString()
    };

    // Сохраняем в базу
    if (!db.wheelResults) {
        db.wheelResults = [];
    }

    // Удаляем старый результат пользователя, если есть
    db.wheelResults = db.wheelResults.filter(w => w.userId !== payload.userId);
    db.wheelResults.push(wheelResult);

    saveDb(db);

    return {
        ok: true,
        data: {
            id: wheelResult.id,
            values: wheelResult.values,
            createdAt: wheelResult.createdAt
        }
    };
}

export async function getLastLiveWheel(userId) {
    await delay();

    const db = loadDb();

    if (!db.wheelResults || !Array.isArray(db.wheelResults)) {
        return null; // Нет данных
    }

    // Ищем последний результат пользователя
    const lastResult = db.wheelResults
        .filter(w => w.userId === userId)
        .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))[0];

    if (!lastResult) {
        return null; // Нет результатов
    }

    return {
        success: true,
        data: {
            id: lastResult.id,
            values: lastResult.values,
            createdAt: lastResult.createdAt,
            spheres: lastResult.spheres
        }
    };
}

//ценности
import { getValuesWithActions } from '../data/valuesData';

// Старые методы (оставляем для совместимости)
export async function getInitialValues() {
    console.log("[MOCK] Getting initial values");
    await new Promise(resolve => setTimeout(resolve, 500));
    return {
        success: true,
        data: [] // Пустой массив, компонент будет использовать статические данные
    };
}

// НОВЫЙ МЕТОД: Получение всех ценностей из БД
export async function getValues(lang = 'ru') {
    console.log("[MOCK] Getting all values for lang:", lang);

    await new Promise(resolve => setTimeout(resolve, 300));

    try {
        // Используем статические данные из valuesData.js
        const staticValues = getValuesWithActions(lang);

        // Преобразуем в формат, аналогичный API
        const formattedValues = staticValues.map(value => ({
            id: value.id,
            code: value.text.toLowerCase().replace(/\s+/g, '_'), // генерируем code из текста
            textRu: value.id <= 37 ? value.text : '', // только для русских названий
            textEn: value.id <= 37 ? value.text : '', // для английских - такой же текст в моке
            icon: value.icon,
            actionsRu: lang === 'ru' ? value.actions : [],
            actionsEn: lang !== 'ru' ? value.actions : []
        }));

        return {
            success: true,
            data: formattedValues
        };

    } catch (error) {
        console.error("[MOCK] Error getting values:", error);
        return {
            success: false,
            error: 'Failed to get values',
            data: []
        };
    }
}

// НОВЫЙ МЕТОД: Сохранение пользовательских ценностей
export async function saveUserValues(userId, values, sessionData = null) {
    console.log("[MOCK] Saving user values:", { userId, values, sessionData });

    await new Promise(resolve => setTimeout(resolve, 800));

    try {
        const key = `user_${userId}_values_new`; // Новый ключ для новой структуры
        const now = new Date().toISOString();

        // Форматируем данные в новом формате
        const saveData = {
            sessionId: Date.now(),
            userId,
            savedAt: now,
            savedValues: values.map(item => ({
                id: Date.now() + Math.random(),
                valueCode: item.valueCode,
                valueId: item.valueCode, // дублируем для совместимости
                priority: item.priority,
                savedAt: now,
                // Добавляем фиктивные данные для отображения
                textRu: getValueText(item.valueCode, 'ru'),
                textEn: getValueText(item.valueCode, 'en'),
                icon: getValueIcon(item.valueCode),
                actionsRu: [],
                actionsEn: []
            })),
            metadata: {
                version: "2.0",
                saveMethod: "api_save",
                sessionData
            }
        };

        // Сохраняем в localStorage
        localStorage.setItem(key, JSON.stringify(saveData));

        console.log("[MOCK] Saved via new API");

        return {
            success: true,
            data: saveData
        };

    } catch (error) {
        console.error("[MOCK] Error saving user values:", error);
        return {
            success: false,
            error: 'Failed to save values'
        };
    }
}

// Вспомогательная функция для получения текста значения
function getValueText(code, lang) {
    // Простая заглушка
    const texts = {
        'health': { ru: 'Здоровье', en: 'Health' },
        'family': { ru: 'Семья', en: 'Family' },
        'freedom': { ru: 'Свобода', en: 'Freedom' },
        'growth': { ru: 'Развитие', en: 'Growth' },
        'creativity': { ru: 'Творчество', en: 'Creativity' }
    };
    return texts[code]?.[lang] || code;
}

function getValueIcon(code) {
    const icons = {
        'health': '💪',
        'family': '👨‍👩‍👧‍👦',
        'freedom': '🕊️',
        'growth': '📈',
        'creativity': '🎨'
    };
    return icons[code] || '⭐';
}

// НОВЫЙ МЕТОД: Получение сохраненных ценностей пользователя
export async function getUserValues(userId) {
    console.log("[MOCK] Getting user values for:", userId);

    await new Promise(resolve => setTimeout(resolve, 300));

    try {
        // Пробуем новую структуру
        const newKey = `user_${userId}_values_new`;
        const newDataStr = localStorage.getItem(newKey);

        if (newDataStr) {
            const data = JSON.parse(newDataStr);
            return {
                success: true,
                data
            };
        }

        // Пробуем старую структуру
        const oldKey = `user_${userId}_values`;
        const oldDataStr = localStorage.getItem(oldKey);

        if (oldDataStr) {
            const oldData = JSON.parse(oldDataStr);
            const latest = oldData.latest || (oldData.history && oldData.history[oldData.history.length - 1]);

            if (latest) {
                // Конвертируем старый формат в новый
                const convertedData = convertOldToNewFormat(latest, userId);
                return {
                    success: true,
                    data: convertedData
                };
            }
        }

        // Ничего не найдено
        return {
            success: true,
            data: null
        };

    } catch (error) {
        console.error("[MOCK] Error getting user values:", error);
        return {
            success: false,
            error: 'Failed to get user values',
            data: null
        };
    }
}

// Конвертер из старого формата в новый
function convertOldToNewFormat(oldData, userId) {
    if (!oldData || !oldData.values) return null;

    return {
        sessionId: oldData.id || Date.now(),
        userId,
        savedAt: oldData.savedAt || new Date().toISOString(),
        savedValues: oldData.values.map((value, index) => ({
            id: value.id || Date.now() + index,
            valueCode: value.id || `value_${index + 1}`,
            valueId: value.id || `value_${index + 1}`,
            priority: index + 1,
            textRu: value.text || '',
            textEn: value.text || '',
            icon: value.icon || '⭐',
            actionsRu: value.actions || [],
            actionsEn: value.actions || []
        }))
    };
}

// Старые методы оставляем для совместимости
export async function saveFinalValues({ userId, values }) {
    console.log("[MOCK] Saving final values (legacy)");
    return saveUserValues(userId,
        values.map(v => ({ valueCode: v.id, priority: 1 })), // Дефолтный priority
        null
    );
}

export async function getSavedValues(userId) {
    console.log("[MOCK] Getting saved values (legacy)");
    const result = await getUserValues(userId);

    if (result.success && result.data) {
        // Конвертируем новый формат в старый для совместимости
        return {
            success: true,
            data: {
                values: result.data.savedValues.map(v => ({
                    id: v.valueCode,
                    text: v.textRu,
                    icon: v.icon,
                    actions: v.actionsRu,
                    savedAt: v.savedAt
                })),
                savedAt: result.data.savedAt
            }
        };
    }

    return result;
}




// --- Совместимость: моковая реализация ---
export async function getCompatibilityPrice() {
    await delay();
    return {
        priceStars: DEFAULT_COMPAT_PRICE,
        currency: "stars",
        description: "Compatibility insight",
    };
}

export async function getCompatibilityPurchases(userId) {
    await delay();
    const db = loadDb();
    return (db.compatibilityPurchases || [])
        .filter((p) => p.userId === userId)
        .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
}

export async function createCompatibilityInvoice({userId, targetType, targetId}) {
    await delay();
    const db = loadDb();
    const price = await getCompatibilityPrice();

    let targetTypeId = targetType === "type" ? targetId : null;
    let displayNameRu = "";
    let displayNameEn = "";

    if (targetType === "invited") {
        const invitedResult = db.results.find((r) => r.userId === targetId);
        targetTypeId = invitedResult?.typeId || targetTypeId || "UNKNOWN";
        const invitedUser = db.users.find((u) => u.id === targetId);
        displayNameRu =
            invitedUser?.name ||
            `${targetId?.slice(0, 6) ?? "user"}…`;
        displayNameEn = displayNameRu;
    } else {
        displayNameRu = formatTypeLabel(targetId, "ru");
        displayNameEn = formatTypeLabel(targetId, "en");
    }

    const invoiceId = generateId("invoice");
    const purchaseId = generateId("compat");
    const now = new Date().toISOString();

    db.compatibilityPurchases.push({
        id: purchaseId,
        invoiceId,
        userId,
        targetType,
        targetId,
        targetTypeId,
        displayName: displayNameRu,
        displayNameRu,
        displayNameEn,
        status: "created",
        createdAt: now,
        result: null,
    });

    saveDb(db);

    return {
        invoiceId,
        purchaseId,
        status: "created",
        priceStars: price.priceStars,
    };
}

export async function confirmCompatibilityPayment({invoiceId, paymentStatus}) {
    await delay();
    const db = loadDb();
    const purchase = (db.compatibilityPurchases || []).find((p) => p.invoiceId === invoiceId);
    if (!purchase) throw new Error("invoice not found");

    const status = paymentStatus === "paid" ? "paid" : "pending";
    purchase.status = status;

    if (status === "paid") {
        const userResult = db.results.find((r) => r.userId === purchase.userId);
        const userTypeId = userResult?.typeId || "UNKNOWN";
        const result = buildCompatibilityResult({
            userTypeId,
            targetTypeId: purchase.targetTypeId || purchase.targetId,
            targetLabel: {
                ru: purchase.displayNameRu || purchase.displayName,
                en: purchase.displayNameEn || purchase.displayName || purchase.displayNameRu,
            },
        });
        purchase.result = result;
    }

    saveDb(db);

    return {
        status: purchase.status,
        purchaseId: purchase.id,
        result: purchase.result || null,
    };
}

export async function getCompatibilityResult(purchaseId) {
    await delay();
    const db = loadDb();
    const purchase = (db.compatibilityPurchases || []).find((p) => p.id === purchaseId);
    if (!purchase) throw new Error("purchase not found");

    if (!purchase.result) {
        const userResult = db.results.find((r) => r.userId === purchase.userId);
        const userTypeId = userResult?.typeId || "UNKNOWN";
        purchase.result = buildCompatibilityResult({
            userTypeId,
            targetTypeId: purchase.targetTypeId || purchase.targetId,
            targetLabel: {
                ru: purchase.displayNameRu || purchase.displayName,
                en: purchase.displayNameEn || purchase.displayName || purchase.displayNameRu,
            },
        });
        saveDb(db);
    }

    return {
        purchaseId: purchase.id,
        result: purchase.result,
        status: purchase.status,
        targetType: purchase.targetType,
        displayName: purchase.displayNameRu || purchase.displayName,
        displayNameRu: purchase.displayNameRu || purchase.displayName,
        displayNameEn: purchase.displayNameEn || purchase.displayName,
        createdAt: purchase.createdAt,
    };
}
