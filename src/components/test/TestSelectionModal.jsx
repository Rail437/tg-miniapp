// src/components/test/TestSelectionModal.jsx

import React from "react";
import { motion } from "framer-motion";

export function TestSelectionModal({ tests, onSelectTest, onClose }) {
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
                <h2 className="text-2xl font-bold mb-4 text-center">
                    Выберите тест
                </h2>

                <div className="space-y-4 max-h-80 overflow-y-auto">
                    {tests.map((test) => (
                        <motion.div
                            key={test.id}
                            whileHover={{ scale: 1.02 }}
                            className="p-4 bg-gray-50 rounded-xl border-2 border-transparent hover:border-blue-300 cursor-pointer transition-all"
                            onClick={() => onSelectTest(test)}
                        >
                            <div className="font-bold text-lg text-gray-800">
                                {test.name}
                            </div>
                            <div className="text-sm text-gray-600 mt-1">
                                {test.description}
                            </div>
                            <div className="text-xs text-gray-500 mt-2">
                                {test.questions.length} вопросов
                            </div>
                        </motion.div>
                    ))}
                </div>

                <button
                    onClick={onClose}
                    className="mt-6 w-full py-3 bg-gray-100 text-gray-600 rounded-xl hover:bg-gray-200 transition-colors"
                >
                    Назад
                </button>
            </motion.div>
        </motion.div>
    );
}
