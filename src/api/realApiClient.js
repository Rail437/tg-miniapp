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

    if (res.status === 204) return null;

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
    const data = await request("/auth/telegram", {
        method: "POST",
        body: JSON.stringify({initData}),
    });

    // Если бэк вернул токен — сохраняем его
    if (data?.token) {
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

// Сохранить результат теста
export async function saveTestResult(userId, result) {
    const payload = {
        userId,
        typeId: result.typeId,
        result: {},
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

// Отправить историю
export async function submitStory({userId, text}) {
    return request("/stories", {
        method: "POST",
        body: JSON.stringify({userId, text}),
    });
}

// Получение данных клиента
export async function getClientProfile(userId) {
    return request(`/client/profile?userId=${userId}`, {
        method: "GET",
    });
}

// Отправить колесо жизненного баланса
export async function submitLiveWheel(payload) {
    const formattedPayload = {
        userId: payload.userId,
        values: payload.values,
        spheres: payload.spheres || Object.keys(payload.values),
        completedAt: payload.completedAt || new Date().toISOString(),
        metadata: payload.metadata || {
            lang: payload.metadata?.lang || 'ru',
            version: '1.0',
            platform: 'web'
        }
    };

    return request("/live/wheel", {
        method: "POST",
        body: JSON.stringify(formattedPayload),
    });
}

// Получить последнее колесо жизненного баланса
export async function getLastLiveWheel(userId) {
    try {
        const response = await request(`/live/wheel/last?userId=${encodeURIComponent(userId)}`, {
            method: "GET",
        });

        // Если 204 No Content
        if (!response) {
            return null;
        }

        // Проверяем структуру ответа
        if (response.success === false || !response.data) {
            console.warn(`Invalid response format for userId: ${userId}`, response);
            return null;
        }

        return response.data;

    } catch (error) {
        // Если 204 или 404 - это нормально (нет данных)
        if (error.message.includes('204') || error.message.includes('404')) {
            return null;
        }
        console.error(`Error fetching wheel data for userId: ${userId}`, error);
        throw error;
    }
}

// ================== ЦЕННОСТИ ==================

// Получение всех ценностей
export async function getValues(lang = 'ru') {
    return request(`/values`, {
        method: "GET",
    });
}

// Старый метод для совместимости
export async function getInitialValues() {
    return getValues('ru');
}

// Сохранение пользовательских ценностей
export async function saveUserValues(userId, values, sessionData = null) {
    const payload = {
        userId,
        values: values.map(item => ({
            valueId: item.valueId,
            priority: item.priority
        })),
        sessionData,
        totalTimeSeconds: Math.floor(Math.random() * 600) + 120
    };

    return request("/user/values", {
        method: "POST",
        body: JSON.stringify(payload),
    });
}

// Получение сохраненных ценностей пользователя
export async function getUserValues(userId) {
    return request(`/user/values/${userId}`, {
        method: "GET",
    });
}

// Старый метод для совместимости
export async function saveFinalValues({userId, values}) {
    const newValues = values.map((value, index) => ({
        valueId: value.id,
        priority: index + 1
    }));

    return saveUserValues(userId, newValues, null);
}

// Старый метод для совместимости
export async function getSavedValues(userId) {
    try {
        const result = await getUserValues(userId);

        if (result && result.savedValues) {
            return {
                success: true,
                data: {
                    values: result.savedValues.map(v => ({
                        id: v.valueCode,
                        text: v.textRu,
                        icon: v.icon,
                        actions: v.actionsRu,
                        savedAt: v.savedAt
                    })),
                    savedAt: result.savedAt
                }
            };
        }

        return {
            success: true,
            data: {
                values: [],
                savedAt: null
            }
        };
    } catch (error) {
        console.error('[REAL] Error getting saved values:', error);
        return {
            success: false,
            error: error.message,
            data: null
        };
    }
}

// ================== СОВМЕСТИМОСТЬ ==================

export async function getCompatibilityPrice() {
    return request("/compatibility/price", {method: "GET"});
}

export async function getCompatibilityPurchases(userId) {
    return request(`/compatibility/purchases?userId=${userId}`, {method: "GET"});
}

export async function createCompatibilityInvoice(payload) {
    return request("/compatibility/invoice", {
        method: "POST",
        body: JSON.stringify(payload),
    });
}

export async function confirmCompatibilityPayment(payload) {
    return request("/compatibility/confirm", {
        method: "POST",
        body: JSON.stringify(payload),
    });
}

export async function getCompatibilityResult(purchaseId) {
    return request(`/compatibility/result?purchaseId=${purchaseId}`, {
        method: "GET",
    });
}