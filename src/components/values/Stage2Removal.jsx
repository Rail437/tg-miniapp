// Stage2Removal.jsx
import React from "react";
import { motion, AnimatePresence } from "framer-motion";

export const Stage2Removal = ({
                                  stepTwoValues,
                                  removedValues,
                                  onRemoveValue,
                                  onRestoreValue,
                                  onContinue,
                                  lang
                              }) => {
    return (
        <div className="mb-8">
            <AnimatePresence>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                    {stepTwoValues.map((value) => (
                        <motion.button
                            key={value.id}
                            layout
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.9, x: 100 }}
                            whileHover={{ scale: 1.03 }}
                            whileTap={{ scale: 0.97 }}
                            onClick={() => onRemoveValue(value)}
                            className="p-4 rounded-2xl border-2 border-amber-200 bg-gradient-to-br from-amber-50 to-orange-50 text-amber-800 text-center cursor-pointer hover:border-amber-300 transition-colors"
                        >
                            <div className="flex flex-col items-center">
                                <span className="text-xl mb-1">{value.icon}</span>
                                <span className="font-medium">{value.text}</span>
                                <div className="mt-2 text-xs text-amber-600">
                                    {lang === "ru" ? "Нажмите, чтобы удалить" : "Click to remove"}
                                </div>
                            </div>
                        </motion.button>
                    ))}
                </div>
            </AnimatePresence>

            {/* Показываем удаленные значения */}
            {removedValues.length > 0 && (
                <div className="mt-8">
                    <h3 className="text-lg font-medium text-gray-700 mb-3">
                        {lang === "ru" ? "Удаленные ценности" : "Removed values"} ({removedValues.length}/4)
                    </h3>
                    <div className="flex flex-wrap gap-2">
                        {removedValues.map((value, index) => (
                            <motion.div
                                key={value.id}
                                initial={{ opacity: 0, scale: 0.8 }}
                                animate={{ opacity: 0.5, scale: 1 }}
                                className="px-3 py-2 bg-gray-100 text-gray-500 rounded-full text-sm flex items-center gap-1"
                            >
                                <span>{value.text}</span>
                                <span className="text-xs">({index + 1})</span>
                            </motion.div>
                        ))}
                    </div>
                </div>
            )}

            {/* Кнопка восстановления */}
            {removedValues.length > 0 && (
                <div className="mt-4">
                    <button
                        onClick={onRestoreValue}
                        className="flex items-center gap-2 text-sm text-amber-600 hover:text-amber-700"
                    >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h10a8 8 0 018 8v2M3 10l6 6m-6-6l6-6" />
                        </svg>
                        {lang === "ru"
                            ? `Вернуть последнюю удаленную ценность (${removedValues[removedValues.length - 1]?.text})`
                            : `Restore last removed value (${removedValues[removedValues.length - 1]?.text})`}
                    </button>
                </div>
            )}

            {/* Кнопка продолжения */}
            {removedValues.length === 4 && (
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