// valuesUtils.js
import { getValuesWithActions } from '../../data/valuesData';

// Функция для перемешивания массива
export const shuffleArray = (array) => {
    return [...array].sort(() => Math.random() - 0.5);
};

// Получение инструкции для этапа
export const getStageInstruction = (step, lang, data = {}) => {
    switch(step) {
        case 1:
            return lang === "ru"
                ? "Выберите 10 ценностей, которые наиболее важны для вас"
                : "Choose 10 values that are most important to you";
        case 2:
            const toRemove = 4 - (data.removedCount || 0);
            return lang === "ru"
                ? `Уберите ${toRemove} ${getRussianWordForm(toRemove, ['ценность', 'ценности', 'ценностей'])} без которых вы могли бы прожить`
                : `Remove ${toRemove} value${toRemove !== 1 ? 's' : ''} you could live without`;
        case 3:
            const selectedCount = data.selectedCount || 0;
            const remaining = 3 - selectedCount;
            return lang === "ru"
                ? `Выберите ${remaining} ${getRussianWordForm(remaining, ['ценность', 'ценности', 'ценностей'])} без которых вам было бы очень тяжело`
                : `Choose ${remaining} value${remaining !== 1 ? 's' : ''} you couldn't live without`;
        case 4:
            return lang === "ru"
                ? "Ваши ключевые ценности и рекомендации для интеграции в жизнь"
                : "Your key values and recommendations for integration into life";
        default:
            return "";
    }
};

// Функция для правильного склонения русских слов
const getRussianWordForm = (number, forms) => {
    number = Math.abs(number) % 100;
    const lastDigit = number % 10;

    if (number > 10 && number < 20) return forms[2];
    if (lastDigit === 1) return forms[0];
    if (lastDigit >= 2 && lastDigit <= 4) return forms[1];
    return forms[2];
};

// Загрузка начальных ценностей
export const loadInitialValues = async (lang) => {
    try {
        const valuesWithActions = getValuesWithActions(lang);
        return shuffleArray(valuesWithActions);
    } catch (error) {
        console.error("Error loading values:", error);
        return getValuesWithActions(lang);
    }
};