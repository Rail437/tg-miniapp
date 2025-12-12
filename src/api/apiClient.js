// src/api/apiClient.js
import { API_MODE } from "../config/apiConfig";
import * as mockApi from "./mockApiClient";
import * as realApi from "./realApiClient";
import allTypes from "../data/allTypes.json";
import typeDescriptionsRu from "../data/typeDescriptions_ru.json";
import typeDescriptionsEn from "../data/typeDescriptions_en.json";

// Выбираем реализацию в зависимости от режима
const impl = API_MODE === "real" ? realApi : mockApi;

// Маппер сырых данных бэка → формат, который ждут компоненты
function mapSocionicsResult(raw) {
    if (!raw || !raw.typeId) return null;

    const typeId = raw.typeId;
    const meta = allTypes[typeId];

    const ruDesc = typeDescriptionsRu[typeId] || {};
    const enDesc = typeDescriptionsEn[typeId] || {};

    const nicknameRu = meta?.nickname?.ru;
    const nicknameEn = meta?.nickname?.en;

    return {
        typeId,
        createdAt: raw.createdAt,

        ru: {
            // красивый заголовок по-русски
            label:
                ruDesc.label ||
                ruDesc.title ||
                [meta?.codeRu, nicknameRu].filter(Boolean).join(" — ") ||
                typeId,
            description: ruDesc.description || "",
            // доп. поля, если вдруг пригодятся
            code: meta?.codeRu,
            nickname: nicknameRu,
            quadra: meta?.quadra,
            rationality: meta?.rationality,
            attitude: meta?.attitude,
            leading: meta?.leading,
            creative: meta?.creative,
            activation: meta?.activation,
        },

        en: {
            label:
                enDesc.label ||
                enDesc.title ||
                nicknameEn ||
                typeId,
            description: enDesc.description || "",
            code: typeId,
            nickname: nicknameEn,
            quadra: meta?.quadra,
            rationality: meta?.rationality,
            attitude: meta?.attitude,
            leading: meta?.leading,
            creative: meta?.creative,
            activation: meta?.activation,
        },
    };
}
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

    //история
    submitStory: impl.submitStory,
};