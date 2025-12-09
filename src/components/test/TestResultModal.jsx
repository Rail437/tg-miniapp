// src/components/test/TestResultModal.jsx
import React from "react";
import { motion } from "framer-motion";
import { useTranslation } from "../../i18n";

// Подробные описания типов
import typeDescriptionsRu from "../../data/typeDescriptions_ru.json";
import typeDescriptionsEn from "../../data/typeDescriptions_en.json";

export function TestResultModal({ result, onClose }) {
    const { t, lang } = useTranslation();

    if (!result) return null;

    const locale = lang === "ru" ? "ru-RU" : "en-US";

    // локализованный блок из результата (то, что вернул движок)
    const localizedBlock =
        result[lang] ?? result.ru ?? result.en ?? null;

    const typeId = result.typeId;

    // Заголовок: пробуем взять из словаря, потом из результата, потом fallback
    const dictionaryLabel =
        lang === "ru"
            ? typeDescriptionsRu[typeId]?.label
            : typeDescriptionsEn[typeId]?.label;

    const title =
        dictionaryLabel ||
        localizedBlock?.label ||
        t("result.title");

    // Подробное описание из словаря, если есть
    const detailedDescription =
        (lang === "ru"
            ? typeDescriptionsRu[typeId]?.description
            : typeDescriptionsEn[typeId]?.description) ||
        localizedBlock?.description ||
        "";

    const createdAtText = result.createdAt
        ? new Date(result.createdAt).toLocaleString(locale, {
            dateStyle: "medium",
            timeStyle: "short",
        })
        : "";

    console.log("TestResultModal result:", result);

    return (
        <motion.div
            className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 px-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
        >
            <motion.div
                className="
                    bg-white/95
                    rounded-3xl
                    shadow-2xl
                    border border-white/80
                    w-full
                    max-w-md
                    max-h-[85vh]
                    overflow-hidden
                    flex
                    flex-col
                "
                initial={{ scale: 0.9, opacity: 0, y: 20 }}
                animate={{ scale: 1, opacity: 1, y: 0 }}
                exit={{ scale: 0.9, opacity: 0, y: 20 }}
                transition={{ duration: 0.25 }}
            >
                {/* Заголовок */}
                <div className="flex items-start justify-between p-5 shrink-0">
                    <div>
                        <div className="text-xs uppercase tracking-wide text-blue-500 mb-1">
                            {t("result.modalTag")}
                        </div>
                        <h3 className="text-xl font-bold text-gray-900">
                            {title}
                        </h3>
                        {createdAtText && (
                            <div className="text-xs text-gray-400 mt-1">
                                {t("result.modalDeterminedAt")}{" "}
                                {createdAtText}
                            </div>
                        )}
                    </div>

                    <button
                        onClick={onClose}
                        className="text-gray-400 hover:text-gray-600 text-2xl leading-none ml-4"
                    >
                        &times;
                    </button>
                </div>

                {/* Скроллируемый контент */}
                <div className="overflow-y-auto px-5 pb-5 space-y-4">
                    <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-blue-500 to-purple-500 flex items-center justify-center text-white text-2xl mx-auto mb-2">
                        🧠
                    </div>

                    {/* Основное описание типа */}
                    <p className="text-sm text-gray-700 whitespace-pre-line">
                        {detailedDescription}
                    </p>

                    {/* Блок “что даёт знание типа” — можно переиспользовать тексты из i18n */}
                    <div className="space-y-3 text-sm">
                        <div>
                            <div className="font-semibold text-gray-900 mb-1">
                                {t("profile.modalWhatGives")}
                            </div>
                            <ul className="list-disc list-inside text-gray-700 space-y-1">
                                <li>{t("profile.modalBullet1")}</li>
                                <li>{t("profile.modalBullet2")}</li>
                                <li>{t("profile.modalBullet3")}</li>
                            </ul>
                        </div>
                    </div>
                </div>

                {/* Кнопка закрытия снизу */}
                <div className="p-5 border-t border-gray-200 shrink-0">
                    <button
                        onClick={onClose}
                        className="w-full py-2.5 rounded-2xl bg-gray-100 text-gray-800 text-sm font-semibold hover:bg-gray-200 transition-colors"
                    >
                        {t("result.buttonClose")}
                    </button>
                </div>
            </motion.div>
        </motion.div>
    );
}