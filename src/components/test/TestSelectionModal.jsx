// src/components/test/TestSelectionModal.jsx
import React from "react";
import { motion } from "framer-motion";
import { useTranslation } from "../../i18n";

export function TestSelectionModal({ tests, onSelect, onClose }) {
    const { lang } = useTranslation();

    return (
        <motion.div
            className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 px-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
        >
            <motion.div
                className="bg-white/95 backdrop-blur-2xl rounded-3xl p-6 w-full max-w-md shadow-2xl border border-white/80 max-h-[80vh] overflow-y-auto"
                initial={{ scale: 0.9, opacity: 0, y: 20 }}
                animate={{ scale: 1, opacity: 1, y: 0 }}
                exit={{ scale: 0.9, opacity: 0, y: 20 }}
                transition={{ duration: 0.25 }}
            >
                <div className="flex justify-between items-start mb-4">
                    <h3 className="text-lg font-bold text-gray-900">
                        {lang === "ru" ? "Выбор теста" : "Choose a test"}
                    </h3>
                    <button
                        onClick={onClose}
                        className="text-gray-400 hover:text-gray-600 text-2xl leading-none"
                    >
                        &times;
                    </button>
                </div>

                <div className="space-y-3">
                    {tests.map((test) => {
                        const title = test.name[lang] ?? test.name.ru;
                        const desc = test.description[lang] ?? test.description.ru;

                        return (
                            <button
                                key={test.id}
                                onClick={() => onSelect(test)}
                                className="w-full text-left bg-white/80 border border-white/80 rounded-2xl px-4 py-3 shadow-sm hover:shadow-md transition-all"
                            >
                                <div className="font-semibold text-gray-900 text-sm mb-1">
                                    {title}
                                </div>
                                <div className="text-xs text-gray-600">{desc}</div>
                            </button>
                        );
                    })}
                </div>
            </motion.div>
        </motion.div>
    );
}
