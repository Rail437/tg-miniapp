// src/components/test/TestResultModal.jsx

import React from "react";
import {motion} from "framer-motion";

export function TestResultModal({resultText, onRestart}) {
    return (
        <motion.div
            initial={{opacity: 0}}
            animate={{opacity: 1}}
            exit={{opacity: 0}}
            className="fixed inset-0 bg-black/40 backdrop-blur flex items-center justify-center p-4 z-50"
        >
            <motion.div
                initial={{scale: 0.9, opacity: 0}}
                animate={{scale: 1, opacity: 1}}
                exit={{scale: 0.9, opacity: 0}}
                className="bg-white rounded-3xl w-full max-w-md p-6 shadow-xl text-center"
            >
                <div
                    className="w-16 h-16 bg-green-500 rounded-full flex items-center justify-center text-white text-2xl mx-auto mb-4">
                    ✓
                </div>

                <h2 className="text-2xl font-bold mb-2">Тест завершён!</h2>

                <div className="text-lg font-semibold text-blue-600 mb-4">
                    {resultText}
                </div>

                <p className="text-gray-600 mb-6">
                    Спасибо за прохождение теста! Ваши результаты помогут лучше понять
                    себя.
                </p>

                <button
                    onClick={onRestart}
                    className="w-full py-3 bg-blue-500 text-white rounded-xl hover:bg-blue-600 transition-colors"
                >
                    Закрыть
                </button>
            </motion.div>
        </motion.div>
    );
}
