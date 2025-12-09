// src/components/test/TestQuestionModal.jsx
import React from "react";
import {motion} from "framer-motion";
import {useTranslation} from "../../i18n";
import answerScale from "../../data/answerScale.json";

export function TestQuestionModal(
    {
        test,
        question,
        currentQuestionIndex,
        totalQuestions, // сейчас не используется, можешь позже удалить из пропсов
        onAnswer,
        onClose,
    }) {
    const {lang} = useTranslation();

    if (!question) return null;

    const text =
        question.text?.[lang] ??
        question.text?.ru ??
        "";

    const scale = answerScale[lang] ?? answerScale.ru;

    // Прогресс по этапам дерева:
    // JP → Base_* → IE_* → Creative_*
    const stageId = question.stageId || "";

    let progress = 10; // дефолтное начальное значение

    if (stageId === "JP") {
        progress = 10;
    } else if (stageId.startsWith("Base")) {
        progress = 35;
    } else if (stageId.startsWith("IE")) {
        progress = 65;
    } else if (stageId.startsWith("Creative")) {
        progress = 90;
    } else {
        // на всякий случай fallback
        progress = 50;
    }

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
                {/* Прогресс-бар по этапам (без цифр) */}
                <div className="w-full h-1.5 bg-gray-100 rounded-full mb-4 overflow-hidden">
                    <div
                        className="h-full bg-gradient-to-r from-blue-500 to-purple-500 transition-all duration-300"
                        style={{width: `${progress}%`}}
                    />
                </div>

                {/* Текст вопроса */}
                <p className="text-sm text-gray-800 mb-6">
                    {text}
                </p>

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
