import React from "react";
import { motion } from "framer-motion";

export const TestResultModal = ({ resultText, onRestart }) => (
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
            className="bg-white rounded-3xl p-6 w-full max-w-md shadow-2xl text-center"
        >
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl">✓</span>
            </div>
            <h2 className="text-2xl font-bold mb-2 text-gray-800">Тест завершён!</h2>
            <p className="text-lg mb-6 text-gray-700">{resultText}</p>
            <button
                onClick={onRestart}
                className="w-full py-3 rounded-2xl bg-blue-600 text-white font-semibold shadow-md hover:bg-blue-700 transition-colors"
            >
                Пройти другой тест
            </button>
        </motion.div>
    </motion.div>
);