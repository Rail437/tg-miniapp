// values/valuesUtils.js
import { apiClient } from "../../api/apiClient";

// Экспортируем ВСЕ функции которые использует ValuesSection.jsx

// 1. Функция загрузки начальных значений
// values/valuesUtils.js - исправленная функция loadInitialValues
export const loadInitialValues = async (lang) => {
    try {
        console.log(`Loading values for language: ${lang}`);

        // Получаем данные из API
        const response = await apiClient.getValues(lang);
        console.log('Full API response:', response);

        let valuesData = null;

        // Вариант 1: API возвращает просто массив (наш случай)
        if (Array.isArray(response)) {
            console.log(`Received ${response.length} values directly as array`);
            valuesData = response;
        }
        // Вариант 2: Старый формат с оберткой {success, data}
        else if (response && response.success === true && Array.isArray(response.data)) {
            console.log('Using wrapped format (success/data)');
            valuesData = response.data;
        }
        // Вариант 3: Объект с другим названием поля
        else if (response && Array.isArray(response.values)) {
            console.log('Using values property format');
            valuesData = response.values;
        }
        else {
            console.warn('Unexpected API response format:', response);
            throw new Error('Unexpected API response format');
        }

        if (valuesData && valuesData.length > 0) {
            console.log(`Processing ${valuesData.length} values from API`);

            // Преобразуем данные в формат фронтенда
            const values = valuesData.map(item => {
                // Дополнительная проверка структуры
                if (!item.id && !item.code) {
                    console.warn('Invalid value item:', item);
                }

                return {
                    id: item.id || item.code || Date.now() + Math.random(),
                    code: item.code || item.id || '',
                    text: lang === "ru"
                        ? (item.textRu || item.text || '')
                        : (item.textEn || item.text || ''),
                    icon: item.icon || '⭐',
                    actions: lang === "ru"
                        ? (item.actionsRu || item.actions || [])
                        : (item.actionsEn || item.actions || []),
                    textRu: item.textRu || item.text || '',
                    textEn: item.textEn || item.text || '',
                    actionsRu: item.actionsRu || item.actions || [],
                    actionsEn: item.actionsEn || item.actions || []
                };
            });

            console.log(`Successfully processed ${values.length} values`);

            // Перемешиваем значения
            const shuffledValues = [...values].sort(() => Math.random() - 0.5);
            return shuffledValues;
        } else {
            console.warn('No valid data found in API response');
            throw new Error('No data received from API');
        }

    } catch (error) {
        console.error('Error loading values from API:', error);

        // Fallback: статические данные
        try {
            console.log('Using fallback static data');
            const valuesData = await import('../../data/valuesData');
            const staticValues = valuesData.getValuesWithActions(lang);
            console.log(`Loaded ${staticValues.length} static values`);
            return [...staticValues].sort(() => Math.random() - 0.5);
        } catch (fallbackError) {
            console.error('Fallback also failed:', fallbackError);
            return [];
        }
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