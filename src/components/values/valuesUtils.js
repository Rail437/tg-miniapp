// values/valuesUtils.js
import { apiClient } from "../../api/apiClient";

// Экспортируем ВСЕ функции которые использует ValuesSection.jsx

// 1. Функция загрузки начальных значений
export const loadInitialValues = async (lang) => {
    try {
        // Пробуем получить данные из нового API
        if (apiClient.hasNewApi && apiClient.hasNewApi()) {
            const response = await apiClient.getValues(lang);

            if (response.success && response.data) {
                // Преобразуем ответ API в формат фронтенда
                const values = response.data.map(item => ({
                    id: item.id,
                    code: item.code,
                    text: lang === "ru" ? item.textRu : item.textEn,
                    icon: item.icon,
                    actions: lang === "ru" ? item.actionsRu : item.actionsEn,
                    textRu: item.textRu,
                    textEn: item.textEn,
                    actionsRu: item.actionsRu,
                    actionsEn: item.actionsEn
                }));

                return [...values].sort(() => Math.random() - 0.5);
            }
        }

        // Fallback: статические данные
        const { getValuesWithActions } = await import('../../data/valuesData');
        return getValuesWithActions(lang);

    } catch (error) {
        console.error('Error loading values:', error);
        const { getValuesWithActions } = await import('../../data/valuesData');
        return getValuesWithActions(lang);
    }
};

// 2. Функция получения инструкции по этапу (ВАЖНО: её не было в новом коде!)
export const getStageInstruction = (step, lang, data = {}) => {
    const instructions = {
        1: {
            ru: "Просмотрите список ценностей и выберите 10, которые наиболее важны для вас. Не задумывайтесь слишком долго — доверьтесь первой реакции.",
            en: "Browse the list of values and choose 10 that are most important to you. Don't overthink — trust your first reaction."
        },
        2: {
            ru: `Из выбранных 10 ценностей удалите 4, без которых вы можете обойтись. Удалено: ${data.removedCount || 0}/4`,
            en: `From the 10 selected values, remove 4 that you can live without. Removed: ${data.removedCount || 0}/4`
        },
        3: {
            ru: `Выберите 3 самые важные ценности из оставшихся 6. Выбрано: ${data.selectedCount || 0}/3`,
            en: `Choose the 3 most important values from the remaining 6. Selected: ${data.selectedCount || 0}/3`
        }
    };

    return instructions[step]?.[lang] || "";
};

// 3. Форматирование значений для сохранения
export const formatValuesForSave = (selectedValues, lang) => {
    return selectedValues.map((value, index) => ({
        valueCode: value.code || value.id.toString(),
        priority: index + 1
    }));
};

// 4. Сохранение через API
export const saveUserValuesToApi = async (userId, values, sessionData = null) => {
    if (apiClient.hasNewApi && apiClient.hasNewApi()) {
        return await apiClient.saveUserValues(userId, values, sessionData);
    }

    // Fallback
    const formattedValues = values.map(item => ({
        id: item.valueCode,
        text: item.valueCode,
        icon: "⭐",
        actions: [],
        savedAt: new Date().toISOString()
    }));

    return await apiClient.saveFinalValues({
        userId,
        values: formattedValues
    });
};

// 5. Получение сохраненных значений
export const getSavedUserValues = async (userId, lang) => {
    if (apiClient.hasNewApi && apiClient.hasNewApi()) {
        const response = await apiClient.getUserValues(userId);
        if (response.success && response.data) {
            return transformApiResponse(response.data, lang);
        }
    }

    // Fallback
    const response = await apiClient.getSavedValues(userId);
    if (response.success && response.data) {
        return transformOldResponse(response.data, lang);
    }

    return null;
};

// 6. Вспомогательные функции (не экспортируем, используем внутри)
const transformApiResponse = (apiData, lang) => {
    if (!apiData || !apiData.savedValues) return null;

    return {
        sessionId: apiData.sessionId,
        userId: apiData.userId,
        savedAt: apiData.savedAt,
        values: apiData.savedValues.map(item => ({
            id: item.id,
            code: item.valueCode,
            text: lang === "ru" ? item.textRu : item.textEn,
            icon: item.icon,
            actions: lang === "ru" ? item.actionsRu : item.actionsEn,
            priority: item.priority,
            selected: true
        }))
    };
};

const transformOldResponse = (oldData, lang) => {
    if (!oldData || !oldData.values) return null;

    return {
        sessionId: oldData.id || Date.now(),
        userId: 'unknown',
        savedAt: oldData.savedAt,
        values: oldData.values.map((item, index) => ({
            id: item.id,
            code: item.id,
            text: item.text,
            icon: item.icon,
            actions: item.actions || [],
            priority: index + 1,
            selected: true
        }))
    };
};

// 7. Экспорт по умолчанию (опционально)
export default {
    loadInitialValues,
    getStageInstruction,
    formatValuesForSave,
    saveUserValuesToApi,
    getSavedUserValues
};