// src/data/socionicsMapping.js
import allTypes from "./allTypes.json";
import typeDescriptionsRu from "./typeDescriptions_ru.json";
import typeDescriptionsEn from "./typeDescriptions_en.json";

export function mapBackendResultToViewModel(backendResult, lang) {
    if (!backendResult || !backendResult.typeId) return null;

    const typeId = backendResult.typeId;
    const meta = allTypes[typeId];

    const descMap = lang === "ru" ? typeDescriptionsRu : typeDescriptionsEn;
    const desc = descMap[typeId];

    if (!meta || !desc) {
        console.warn("Unknown socionics typeId:", typeId);
        return {
            typeId,
            label: typeId,
            description: "",
            createdAt: backendResult.createdAt,
        };
    }

    return {
        typeId,
        createdAt: backendResult.createdAt,

        // базовые поля из allTypes.json
        codeRu: meta.codeRu,
        nickname: meta.nickname?.[lang],
        quadra: meta.quadra,
        rationality: meta.rationality,
        attitude: meta.attitude,
        leading: meta.leading,
        creative: meta.creative,
        activation: meta.activation,

        // “человеческий” заголовок и описание
        label: desc.label ?? desc.title ?? meta.nickname?.[lang] ?? typeId,
        description: desc.description ?? "",
    };
}
