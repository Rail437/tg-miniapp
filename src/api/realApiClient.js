// src/api/realApiClient.js
import {API_BASE_URL} from "../config/apiConfig";
// Храним JWT-токен в модуле
let authToken = null;

export function setAuthToken(token) {
    authToken = token;
}

// Вспомогательная функция
async function request(path, options = {}) {
    console.log("[API REQUEST]", `${API_BASE_URL}${path}`, options);

    const headers = {
        "Content-Type": "application/json",
        ...(options.headers || {}),
    };

    if (authToken) {
        headers["Authorization"] = `Bearer ${authToken}`;
    }

    const res = await fetch(`${API_BASE_URL}${path}`, {
        ...options,
        headers,
    });

    console.log("[API RESPONSE STATUS]", path, res.status);

    if (!res.ok) {
        const text = await res.text().catch(() => "");
        console.error("[API ERROR BODY]", path, text);
        throw new Error(`API error: ${res.status}`);
    }

    // ✅ читаем тело один раз как текст
    const text = await res.text().catch(() => "");

    // если тела нет вовсе — возвращаем null
    if (!text || !text.trim()) {
        console.log("[API RESPONSE EMPTY BODY]", path);
        return null;
    }

    // пробуем распарсить JSON
    try {
        const data = JSON.parse(text);
        console.log("[API RESPONSE DATA]", path, data);
        return data;
    } catch (e) {
        console.error("[API JSON PARSE ERROR]", path, text);
        throw e;
    }
}


// ================== API-методы ==================

// Авторизация через Telegram
export async function authTelegram(initData) {
    const isTelegram = !!window.Telegram?.WebApp;
    const data = await request("/auth/telegram", {
        method: "POST",
        body: JSON.stringify({initData}),
    });

    // Если бэк вернул токен — сохраняем его
    if (data.token) {
        console.log("[AUTH] got JWT token");
        setAuthToken(data.token);
    }

    return data;
}

// Начать основной тест
export async function startMainTest(userId) {
    return request("/tests/main/start", {
        method: "POST",
        body: JSON.stringify({userId}),
    });
}

// Ответ на вопрос теста
export async function answerMainTest({sessionId, questionIndex, answerValue}) {
    return request("/tests/main/answer", {
        method: "POST",
        body: JSON.stringify({sessionId, questionIndex, answerValue}),
    });
}

// Получить состояние сессии теста
export async function getTestSession(sessionId) {
    return request(`/tests/main/session/${sessionId}`, {
        method: "GET",
    });
}

// Завершить тест и получить результат
export async function completeMainTest(sessionId) {
    return request("/tests/main/complete", {
        method: "POST",
        body: JSON.stringify({sessionId}),
    });
}

export async function saveTestResult(userId, result) {
    // result здесь — твой "богатый" объект из finalize:
    // { typeId, ru, en, createdAt }

    const payload = {
        userId,
        typeId: result.typeId,
        // сюда можно потом положить что-то важное:
        // пути по дереву, сырые ответы, JP/Base/IE и т.п.
        result: {}, // пока пусто, но поле уже есть в контракте
        createdAt: result.createdAt,
    };

    return request("/tests/main/result", {
        method: "POST",
        body: JSON.stringify(payload),
    });
}

// Получить последний результат пользователя

export async function getLastResult(userId) {
    return request(`/tests/main/last-result?userId=${userId}`, {
        method: "GET",
    });
}

// Моя реферальная ссылка
export async function getMyReferral(userId) {
    return request(`/referral/my?userId=${userId}`, {
        method: "GET",
    });
}

// Зарегистрировать использование реферального кода
export async function registerReferralUse({code, invitedUserId}) {
    return request("/referral/use", {
        method: "POST",
        body: JSON.stringify({code, invitedUserId}),
    });
}

// Список приглашённых по моей рефке
export async function getMyInvited(userId) {
    return request(`/referral/invited?userId=${userId}`, {
        method: "GET",
    });
}
//Историю отправляем
export async function submitStory({ userId, text }) {
    return request("/stories", {
        method: "POST",
        body: JSON.stringify({ userId, text }),
    });
}

// получение данных клиента
export async function getClientProfile(userId) {
    return request(`/client/profile?userId=${userId}`, {
        method: "GET",
    });
}
