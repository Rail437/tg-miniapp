// src/components/test/TestResultModal.jsx
import React from "react";
import {motion} from "framer-motion";
import {useTranslation} from "../../i18n";

export function TestResultModal({result, resultText, onClose}) {
    const {t, lang} = useTranslation();

    // Локализуем заголовок
    let localizedLabel = null;
    let localizedDescription = null;

    if (result) {
        if (lang === "ru") {
            localizedLabel = result.label || result.label_ru || result.label_en;
            localizedDescription =
                result.description || result.description_ru || result.description_en;
        } else {
            localizedLabel = result.label_en || result.label || result.label_ru;
            localizedDescription =
                result.description_en ||
                result.description ||
                result.description_ru;
        }
    }

    const title = localizedLabel || t("result.title");
    const description =
        localizedDescription || resultText || t("result.subtitle");

    return (
        <motion.div
            className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 px-4"
            initial={{opacity: 0}}
            animate={{opacity: 1}}
            exit={{opacity: 0}}
        >
            <motion.div
                className="bg-white/95 backdrop-blur-2xl rounded-3xl p-6 w-full max-w-md shadow-2xl border border-white/80"
                initial={{scale: 0.9, opacity: 0, y: 20}}
                animate={{scale: 1, opacity: 1, y: 0}}
                exit={{scale: 0.9, opacity: 0, y: 20}}
                transition={{duration: 0.25}}
            >
                {/* хедер */}
                <div className="flex justify-between items-start mb-4">
                    <div>
                        <div className="text-xs uppercase tracking-wide text-blue-500 mb-1">
                            {t("result.title")}
                        </div>
                        <h3 className="text-xl font-bold text-gray-900">{title}</h3>
                    </div>
                    <button
                        onClick={onClose}
                        className="text-gray-400 hover:text-gray-600 text-2xl leading-none"
                    >
                        &times;
                    </button>
                </div>

                {/* плашка типа */}
                {result?.typeId && (
                    <div
                        className="mb-3 inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-blue-50 text-blue-700 text-xs font-medium">
                <span
                    className="w-6 h-6 rounded-full bg-blue-600 text-white flex items-center justify-center text-[11px] font-bold">
                 {result.typeId}
                </span>
                        <span>{t("result.typeLabel")}</span>
                    </div>
                )}

                {/* описание */}
                <p className="text-sm text-gray-700 mb-4">{result.description}</p>

                <button
                    onClick={onClose}
                    className="w-full py-2.5 rounded-2xl bg-gray-100 text-gray-800 text-sm font-semibold hover:bg-gray-200 transition-colors"
                >
                    {t("result.buttonClose")}
                </button>
            </motion.div>
        </motion.div>
    );
}
