// Stage1Selection.jsx
import React from "react";
import { motion, AnimatePresence } from "framer-motion";

export const Stage1Selection = ({
                                    allValues,
                                    selectedValues,
                                    onSelectValue,
                                    onContinue,
                                    lang
                                }) => {
    return (
        <div className="mb-8">
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
                <AnimatePresence>
                    {allValues.map((value) => {
                        const isSelected = selectedValues.some(v => v.id === value.id);

                        return (
                            <motion.button
                                key={value.id}
                                layout
                                initial={{ opacity: 0, scale: 0.9 }}
                                animate={{ opacity: 1, scale: 1 }}
                                exit={{ opacity: 0, scale: 0.9 }}
                                whileHover={{ scale: 1.03 }}
                                whileTap={{ scale: 0.97 }}
                                onClick={() => onSelectValue(value)}
                                className={`
                                    p-4 rounded-2xl border-2 transition-all duration-200 text-center
                                    ${isSelected
                                    ? 'bg-gradient-to-br from-green-50 to-emerald-50 border-green-300 text-green-800 shadow-sm'
                                    : 'bg-white/70 border-gray-200 text-gray-700 hover:border-gray-300'
                                }
                                    ${selectedValues.length >= 10 && !isSelected ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}
                                `}
                                disabled={selectedValues.length >= 10 && !isSelected}
                            >
                                <div className="flex flex-col items-center">
                                    <span className="text-xl mb-1">{value.icon}</span>
                                    <span className="font-medium">{value.text}</span>
                                    {isSelected && (
                                        <motion.div
                                            initial={{ scale: 0 }}
                                            animate={{ scale: 1 }}
                                            className="mt-2 w-6 h-6 rounded-full bg-green-500 flex items-center justify-center"
                                        >
                                            <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                                            </svg>
                                        </motion.div>
                                    )}
                                </div>
                            </motion.button>
                        );
                    })}
                </AnimatePresence>
            </div>

            {/* Кнопка продолжения */}
            {selectedValues.length === 10 && (
                <div className="mt-8 flex justify-center">
                    <motion.button
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={onContinue}
                        className="bg-gradient-to-r from-amber-500 to-orange-500 text-white px-8 py-3 rounded-xl font-medium text-lg shadow-lg"
                    >
                        {lang === "ru" ? "Продолжить →" : "Continue →"}
                    </motion.button>
                </div>
            )}
        </div>
    );
};