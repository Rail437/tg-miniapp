// src/components/test/TestQuestionModal.jsx
import React from "react";
import { motion } from "framer-motion";
import { useTranslation } from "../../i18n";
import answerScale from "../../data/answerScale.json";

export function TestQuestionModal({
                                      test,
                                      question,
                                      currentQuestionIndex,
                                      totalQuestions,
                                      onAnswer,
                                      onClose,
                                  }) {
    const { lang } = useTranslation();

    if (!question) return null;

    const title =
        test?.name?.[lang] ??
        test?.name?.ru ??
        (lang === "ru"
            ? "Тест по соционике"
            : "Socionics test");

    const text =
        question.text?.[lang] ??
        question.text?.ru ??
        "";

    const scale = answerScale[lang] ?? answerScale.ru;

    const progress =
        totalQuestions > 0
            ? Math.min(
                100,
                Math.round(
                    ((currentQuestionIndex + 1) / totalQuestions) * 100
                )
            )
            : 0;

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
                {/* Хедер */}
                <div className="flex justify-between items-start mb-4">
                    <div>
                        <div className="text-xs uppercase text-blue-500 mb-1">
                            {lang === "ru" ? "Вопрос" : "Question"}{" "}
                            {currentQuestionIndex + 1}
                            {totalQuestions
                                ? ` / ${totalQuestions}`
                                : ""}
                        </div>
                        <h3 className="text-sm font-semibold text-gray-900">
                            {title}
                        </h3>
                    </div>

                    <button
                        onClick={onClose}
                        className="text-gray-400 hover:text-gray-600 text-2xl leading-none"
                    >
                        ×
                    </button>
                </div>

                {/* Прогресс-бар */}
                <div className="w-full h-1.5 bg-gray-100 rounded-full mb-4 overflow-hidden">
                    <div
                        className="h-full bg-gradient-to-r from-blue-500 to-purple-500"
                        style={{ width: `${progress}%` }}
                    />
                </div>

                {/* Текст вопроса */}
                <p className="text-sm text-gray-800 mb-6">{text}</p>

                {/* 4 варианта ответа из answerScale */}
                <div className="flex flex-col gap-2">
                    {scale.options.map((opt) => (
                        <button
                            key={opt.id}
                            onClick={() => onAnswer(opt.value)}
                            className="w-full py-2.5 px-3 rounded-2xl border border-gray-100 bg-gray-50/70 hover:bg-gray-100 text-sm text-gray-800 text-left transition-all"
                        >
                            <div className="font-medium">
                                {opt.label}
                            </div>
                            {opt.description && (
                                <div className="text-xs text-gray-500 mt-0.5">
                                    {opt.description}
                                </div>
                            )}
                        </button>
                    ))}
                </div>
            </motion.div>
        </motion.div>
    );
}
