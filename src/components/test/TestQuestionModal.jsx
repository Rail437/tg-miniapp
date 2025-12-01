// src/components/test/TestQuestionModal.jsx
import React from "react";
import { motion } from "framer-motion";
import { useTranslation } from "../../i18n";

export function TestQuestionModal({
                                      test,
                                      currentQuestionIndex,
                                      onAnswer,
                                      onClose,
                                  }) {
    const { lang } = useTranslation();

    // Берём вопросы прямо из объекта теста
    const questions = test.questions?.[lang] ?? test.questions?.ru ?? [];
    const total = questions.length || 1;
    const question = questions[currentQuestionIndex] ?? "";

    const progress = Math.round(((currentQuestionIndex + 1) / total) * 100);

    return (
        <motion.div
            className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 px-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
        >
            <motion.div
                className="bg-white/95 backdrop-blur-2xl rounded-3xl p-6 w-full max-w-md shadow-2xl border border-white/80"
                initial={{ scale: 0.9, opacity: 0, y: 20 }}
                animate={{ scale: 1, opacity: 1, y: 0 }}
                exit={{ scale: 0.9, opacity: 0, y: 20 }}
                transition={{ duration: 0.25 }}
            >
                <div className="flex justify-between items-start mb-4">
                    <div>
                        <div className="text-xs uppercase text-blue-500 mb-1">
                            {lang === "ru" ? "Вопрос" : "Question"} {currentQuestionIndex + 1} / {total}
                        </div>
                    </div>

                    <button
                        onClick={onClose}
                        className="text-gray-400 hover:text-gray-600 text-2xl leading-none"
                    >
                        ×
                    </button>
                </div>

                <div className="w-full h-1.5 bg-gray-100 rounded-full mb-4 overflow-hidden">
                    <div
                        className="h-full bg-gradient-to-r from-blue-500 to-purple-500"
                        style={{ width: `${progress}%` }}
                    />
                </div>

                <p className="text-sm text-gray-800 mb-6">{question}</p>

                <div className="flex flex-col sm:flex-row gap-3">
                    <button
                        onClick={() => onAnswer(true)}
                        className="flex-1 py-2.5 rounded-2xl bg-blue-600 text-white font-semibold"
                    >
                        {lang === "ru" ? "Да" : "Yes"}
                    </button>
                    <button
                        onClick={() => onAnswer(false)}
                        className="flex-1 py-2.5 rounded-2xl bg-gray-100 text-gray-700 font-semibold"
                    >
                        {lang === "ru" ? "Нет" : "No"}
                    </button>
                </div>
            </motion.div>
        </motion.div>
    );
}
