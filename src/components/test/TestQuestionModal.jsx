// src/components/test/TestQuestionModal.jsx

import React from "react";
import { motion } from "framer-motion";

export function TestQuestionModal({
                                      test,
                                      currentQuestionIndex,
                                      onAnswer,
                                      onClose,
                                  }) {
    const total = test.questions.length;
    const current = currentQuestionIndex + 1;
    const progress = (current / total) * 100;

    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/40 backdrop-blur flex items-center justify-center p-4 z-50"
        >
            <motion.div
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.9, opacity: 0 }}
                className="bg-white rounded-3xl w-full max-w-md p-6 shadow-xl"
            >
                <div className="flex justify-between items-center mb-6">
                    <h2 className="text-xl font-bold">{test.name}</h2>
                    <div className="text-sm text-gray-500">
                        {current}/{total}
                    </div>
                </div>

                <div className="mb-3">
                    <div className="w-full bg-gray-200 rounded-full h-2">
                        <div
                            className="bg-blue-500 h-2 rounded-full transition-all"
                            style={{ width: `${progress}%` }}
                        />
                    </div>
                </div>

                <h3 className="text-lg font-semibold mb-6 text-center">
                    {test.questions[currentQuestionIndex]}
                </h3>

                <div className="space-y-3">
                    <button
                        onClick={() => onAnswer(true)}
                        className="w-full py-4 bg-green-500 text-white rounded-xl hover:bg-green-600 transition-colors font-semibold"
                    >
                        Да, согласен
                    </button>
                    <button
                        onClick={() => onAnswer(false)}
                        className="w-full py-4 bg-red-500 text-white rounded-xl hover:bg-red-600 transition-colors font-semibold"
                    >
                        Нет, не согласен
                    </button>
                </div>

                <button
                    onClick={onClose}
                    className="mt-4 w-full py-2.5 text-sm text-gray-500 hover:text-gray-700"
                >
                    Выйти из теста
                </button>
            </motion.div>
        </motion.div>
    );
}
