// src/api/apiClient.js
import { API_MODE } from "../config/apiConfig";
import * as mockApi from "./mockApiClient";
import * as realApi from "./realApiClient";

// Выбираем реализацию в зависимости от режима
const impl = API_MODE === "real" ? realApi : mockApi;

// Экспортируем единый интерфейс
export const apiClient = {
    // Авторизация через Telegram / получение юзера
    authTelegram: impl.authTelegram,

    // Тест
    startMainTest: impl.startMainTest,
    answerMainTest: impl.answerMainTest,
    getTestSession: impl.getTestSession,
    completeMainTest: impl.completeMainTest,
    getLastResult: impl.getLastResult,

    // Рефералки
    getMyReferral: impl.getMyReferral,
    registerReferralUse: impl.registerReferralUse,
    getMyInvited: impl.getMyInvited,
};