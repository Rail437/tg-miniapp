import React from "react";
import { motion } from "framer-motion";

export const TestSelectionModal = ({ tests, onSelectTest, onClose }) => (
    <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black/50 flex items-center justify-center z-50"
    >
        <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            className="bg-white rounded-3xl p-6 w-full max-w-md shadow-2xl"
        >
            <h2 className="text-xl font-semibold mb-4 text-center">Выберите тест</h2>
            <div className="space-y-3 mb-4">
                {tests.map((test) => (
                    <button
                        key={test.id}
                        onClick={() => onSelectTest(test)}
                        className="w-full text-left border border-gray-200 rounded-2xl p-4 hover:bg-blue-50 transition-colors"
                    >
                        <div className="font-medium text-gray-800">{test.name}</div>
                        <div className="text-sm text-gray-500 mt-1">{test.description}</div>
                    </button>
                ))}
            </div>
            <button
                onClick={onClose}
                className="w-full py-2.5 rounded-2xl bg-gray-100 text-gray-700 font-medium"
            >
                Отмена
            </button>
        </motion.div>
    </motion.div>
);