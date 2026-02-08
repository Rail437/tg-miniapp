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
export async function submitStory({userId, text}) {
    return request("/stories", {
        method: "POST",
        body: JSON.stringify({userId, text}),
    });
}

// получение данных клиента
export async function getClientProfile(userId) {
    return request(`/client/profile?userId=${userId}`, {
        method: "GET",
    });
}

// realApiClient.js
export async function submitLiveWheel(payload) {
    // Формируем payload в правильном формате
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

//ценности
// Получение начальных ценностей
/*export async function getInitialValues() {
    return request("/api/values/initial", {
        method: "GET",
    });
}

// Сохранение финальных ценностей
export async function saveFinalValues({ userId, values }) {
    console.log("[REAL API] Saving final values, userId:", userId);
    console.log("[REAL API] Values to save:", values);
    console.log("[REAL API] JSON stringified:", JSON.stringify({ values }));

    try {
        const response = await request(`/api/users/${userId}/values`, {
            method: "POST",
            body: JSON.stringify({ values }),
        });

        console.log("[REAL API] Save successful:", response);
        return response;
    } catch (error) {
        console.error("[REAL API] Save failed:", error);
        throw error;
    }
}
export async function getSavedValues(userId) {
    return request(`/api/users/${userId}/values/saved`, {
        method: "GET",
    });
}*/

export async function getInitialValues() {
    console.log("[MOCK] Getting initial values");

    // Имитируем задержку сети
    await new Promise(resolve => setTimeout(resolve, 500));

    return {
        success: true,
        data: [] // Пустой массив, компонент будет использовать статические данные
    };
}

// mockApiClient.js - добавим логирование автосохранения
// mockApiClient.js - в функции saveFinalValues
export async function saveFinalValues({ userId, values }) {
    console.log("[MOCK] Saving values for userId:", userId);

    // Имитируем задержку
    await new Promise(resolve => setTimeout(resolve, 800));

    try {
        const key = `user_${userId}_values`;
        const existingDataStr = localStorage.getItem(key);
        let allValuesData = {};

        if (existingDataStr) {
            try {
                allValuesData = JSON.parse(existingDataStr);
            } catch (e) {
                allValuesData = {};
            }
        }

        const newEntry = {
            id: Date.now(),
            values: values,
            savedAt: new Date().toISOString(),
            version: "1.0",
            saveMethod: "on_continue_button" // Добавляем метку
        };

        if (!allValuesData.history) {
            allValuesData.history = [];
        }

        allValuesData.history.push(newEntry);
        allValuesData.latest = newEntry;
        allValuesData.userId = userId;
        allValuesData.lastUpdated = newEntry.savedAt;
        allValuesData.totalSaves = allValuesData.history.length;

        localStorage.setItem(key, JSON.stringify(allValuesData));

        console.log("[MOCK] Saved via continue button:", newEntry.savedAt);

        return {
            success: true,
            message: 'Values saved successfully',
            data: newEntry
        };

    } catch (error) {
        console.error("[MOCK] Error saving values:", error);
        return {
            success: false,
            error: 'Failed to save values'
        };
    }
}
// Дополнительный метод для получения сохраненных значений
export async function getSavedValues(userId) {
    console.log("[MOCK] Getting saved values for userId:", userId);

    await new Promise(resolve => setTimeout(resolve, 300));

    try {
        // Сначала проверяем основной ключ
        const key = `user_${userId}_values`;
        const dataStr = localStorage.getItem(key);

        if (dataStr) {
            const data = JSON.parse(dataStr);
            const latestData = data.latest || (data.history && data.history[data.history.length - 1]);

            if (latestData) {
                return {
                    success: true,
                    data: latestData,
                    fullData: data,
                    message: 'Found saved values'
                };
            }
        }

        // Если нет в основном ключе, проверяем fallback
        const fallbackKey = `user_${userId}_values_fallback`;
        const fallbackStr = localStorage.getItem(fallbackKey);

        if (fallbackStr) {
            const fallbackData = JSON.parse(fallbackStr);
            return {
                success: true,
                data: fallbackData,
                message: 'Found fallback saved values'
            };
        }

        // Если ничего не найдено
        return {
            success: true,
            data: null,
            message: 'No saved values found'
        };

    } catch (error) {
        console.error("[MOCK] Error getting saved values:", error);
        return {
            success: false,
            error: 'Failed to retrieve values',
            data: null
        };
    }
}

// --- Совместимость ---
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
