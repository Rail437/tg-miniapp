// src/api/apiClient.js
import { API_MODE } from "../config/apiConfig";
import * as mockApi from "./mockApiClient";
import * as realApi from "./realApiClient";

// Выбираем реализацию в зависимости от режима
const impl = API_MODE === "real" ? realApi : mockApi;

// Экспортируем единый интерфейс
export const apiClient = {
    // Установка токена (для realApi есть, для mock — просто заглушка)
    setAuthToken: impl.setAuthToken ? impl.setAuthToken : () => {},

    // Авторизация через Telegram / получение юзера
    authTelegram: impl.authTelegram,

    // Тест
    startMainTest: impl.startMainTest,
    answerMainTest: impl.answerMainTest,
    getTestSession: impl.getTestSession,
    // 👇 Оборачиваем: сырое → нормализованное
    completeMainTest: async (sessionId) => {
        const raw = await impl.completeMainTest(sessionId);
        return mapSocionicsResult(raw);
    },

    getLastResult: async (userId) => {
        const raw = await impl.getLastResult(userId);
        return mapSocionicsResult(raw);
    },
    // Новый метод — сохранить результат
    saveTestResult: impl.saveTestResult,

    // Рефералки
    getMyReferral: impl.getMyReferral,
    registerReferralUse: impl.registerReferralUse,
    getMyInvited: impl.getMyInvited,
};