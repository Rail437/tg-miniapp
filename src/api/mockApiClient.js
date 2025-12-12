// src/api/mockApiClient.js
// import {TYPE_RESULTS} from "../data/typeResults";

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
            };
        }
        return JSON.parse(raw);
    } catch {
        return {
            users: [],
            sessions: [],
            results: [],
            referrals: [],
            referralUses: [],
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