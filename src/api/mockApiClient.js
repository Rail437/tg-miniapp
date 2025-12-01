// src/api/mockApiClient.js

// Простой "стораж" в localStorage
const STORAGE_KEY = "innercode_mock_db";

function loadDb() {
    try {
        const raw = localStorage.getItem(STORAGE_KEY);
        if (!raw) return { users: [], sessions: [], referrals: [], referralUses: [], results: [] };
        return JSON.parse(raw);
    } catch {
        return { users: [], sessions: [], referrals: [], referralUses: [], results: [] };
    }
}

function saveDb(db) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(db));
}

function delay(ms = 300) {
    return new Promise((resolve) => setTimeout(resolve, ms));
}

function generateId(prefix = "id") {
    return `${prefix}_${Math.random().toString(36).slice(2, 10)}`;
}

/**
 * Мок авторизации через Telegram
 * В реале ты сюда будешь отправлять initData, парсить его на бэке,
 * а тут мы просто создаём "псевдо-юзера" и возвращаем его id.
 */
export async function authTelegram(initDataMock) {
    await delay();

    const db = loadDb();

    // Пока просто один "локальный" пользователь
    let user = db.users[0];
    if (!user) {
        user = {
            id: generateId("user"),
            telegramId: "mock_telegram_id",
            createdAt: new Date().toISOString(),
        };
        db.users.push(user);
        saveDb(db);
    }

    // Ищем его последний результат (если есть)
    const lastResult = db.results.find((r) => r.userId === user.id) || null;

    return {
        userId: user.id,
        lastResult, // { typeId, label, description, createdAt } | null
    };
}

/**
 * Начать прохождение основного теста
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
        answers: [], // массив { questionIndex, answerValue }
    };

    db.sessions.push(session);
    saveDb(db);

    return {
        sessionId,
        currentStep: 0,
        totalSteps: 20, // например, 20 вопросов – потом синхронизируешь с реальным тестом
    };
}

/**
 * Ответ на вопрос
 */
export async function answerMainTest({ sessionId, questionIndex, answerValue }) {
    await delay();

    const db = loadDb();
    const session = db.sessions.find((s) => s.id === sessionId);
    if (!session) throw new Error("Session not found");

    session.answers = session.answers.filter((a) => a.questionIndex !== questionIndex);
    session.answers.push({ questionIndex, answerValue });

    // Обновляем текущий шаг
    const nextStep = questionIndex + 1;
    session.currentStep = nextStep;
    session.updatedAt = new Date().toISOString();

    saveDb(db);

    const totalSteps = 20; // должен совпадать с реальным количеством вопросов

    if (nextStep >= totalSteps) {
        return {
            status: "COMPLETED",
            nextStep: totalSteps,
        };
    }

    return {
        status: "IN_PROGRESS",
        nextStep,
    };
}

/**
 * Получить состояние сессии (например, чтобы продолжить тест после перезагрузки)
 */
export async function getTestSession(sessionId) {
    await delay();

    const db = loadDb();
    const session = db.sessions.find((s) => s.id === sessionId);
    if (!session) throw new Error("Session not found");

    return {
        sessionId: session.id,
        currentStep: session.currentStep,
        totalSteps: 20,
        status: session.status,
        answers: session.answers,
    };
}

/**
 * Завершить тест — тут считаем результат на основе ответов
 * Пока примитивно: считаем сумму ответов и мапим к типу.
 * Когда сделаешь реальный алгоритм на бэке — просто повторишь ту же сигнатуру.
 */
export async function completeMainTest(sessionId) {
    await delay();

    const db = loadDb();
    const session = db.sessions.find((s) => s.id === sessionId);
    if (!session) throw new Error("Session not found");

    // Простейший скоринг (заглушка)
    const sum = session.answers.reduce(
        (acc, a) => acc + (typeof a.answerValue === "number" ? a.answerValue : 0),
        0
    );

    // Псевдо-определение типа по сумме
    let result = {
        typeId: "ILE",
        label: "Исследователь возможностей",
        description:
            "Вы быстро видите новые идеи и возможности, любите эксперименты и интеллектуальные разговоры.",
    };

    if (sum < 20) {
        result = {
            typeId: "SEI",
            label: "Хранитель комфорта",
            description:
                "Вы цените уют, стабильность и тёплые отношения, умеете создавать вокруг себя комфортную атмосферу.",
        };
    }

    const resultRecord = {
        id: generateId("result"),
        userId: session.userId,
        sessionId: session.id,
        ...result,
        createdAt: new Date().toISOString(),
    };

    db.results = db.results.filter((r) => r.userId === session.userId);
    db.results.push(resultRecord);

    session.status = "COMPLETED";
    session.resultType = result.typeId;
    session.updatedAt = new Date().toISOString();

    saveDb(db);

    return resultRecord;
}

/**
 * Получить последний результат пользователя
 */
export async function getLastResult(userId) {
    await delay();

    const db = loadDb();
    const result = db.results.find((r) => r.userId === userId) || null;
    return result;
}

/**
 * Получить/создать мою реферальную ссылку
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

/**
 * Зарегистрировать использование реферальной ссылки
 */
export async function registerReferralUse({ code, invitedUserId }) {
    await delay();

    const db = loadDb();
    const referral = db.referrals.find((r) => r.code === code);
    if (!referral) return { ok: false };

    // Не считаем, если человек сам себя пригласил
    if (referral.userId === invitedUserId) return { ok: false };

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

    return { ok: true };
}

/**
 * Получить список приглашённых
 */
export async function getMyInvited(userId) {
    await delay();

    const db = loadDb();
    const myReferral = db.referrals.find((r) => r.userId === userId);
    if (!myReferral) return [];

    const uses = db.referralUses.filter((u) => u.referralId === myReferral.id);

    // Можно обогатить данными о результатах
    const invited = uses.map((u) => {
        const result = db.results.find((r) => r.userId === u.invitedUserId);
        return {
            invitedUserId: u.invitedUserId,
            joinedAt: u.createdAt,
            resultType: result?.typeId || null,
            resultLabel: result?.label || null,
        };
    });

    return invited;
}
