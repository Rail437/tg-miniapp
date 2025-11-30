import React from "react";
import { motion } from "framer-motion";

export const TestQuestionModal = ({ test, currentQuestionIndex, onAnswer, onClose }) => (
    <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black/50 flex items-center justify-center z-50"
    >
        <motion.div
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.95, opacity: 0 }}
            className="bg-white rounded-3xl p-6 w-full max-w-md shadow-2xl"
        >
            <div className="flex justify-between items-center mb-2">
                <h2 className="text-lg font-semibold text-gray-800">{test.name}</h2>
                <button
                    onClick={onClose}
                    className="text-gray-400 hover:text-gray-600 text-2xl"
                >
                    &times;
                </button>
            </div>
            <p className="text-sm text-blue-600 mb-4">
                Вопрос {currentQuestionIndex + 1} из {test.questions.length}
            </p>
            <p className="text-lg mb-6 text-gray-800">{test.questions[currentQuestionIndex]}</p>
            <div className="flex gap-3 mb-4">
                <button
                    onClick={() => onAnswer(true)}
                    className="flex-1 py-3 rounded-2xl bg-blue-600 text-white font-medium shadow-md hover:bg-blue-700 transition-colors"
                >
                    Скорее да
                </button>
                <button
                    onClick={() => onAnswer(false)}
                    className="flex-1 py-3 rounded-2xl bg-gray-100 text-gray-700 font-medium shadow-md hover:bg-gray-200 transition-colors"
                >
                    Скорее нет
                </button>
            </div>
        </motion.div>
    </motion.div>
);