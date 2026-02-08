// Stage3FinalSelection.jsx
import React from "react";
import { motion } from "framer-motion";

export const Stage3FinalSelection = ({
                                         stepThreeValues,
                                         onSelectFinalValue,
                                         onContinue,
                                         lang,
                                         isSaving = false
                                     }) => {
    const selectedCount = stepThreeValues.filter(v => v.selected).length;
    const isComplete = selectedCount === 3;

    return (
        <div className="mb-8">
            {/* Баннер завершения выбора */}
            {isComplete && (
                <motion.div
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="mb-6 bg-gradient-to-r from-green-50 to-emerald-50 border border-green-200 rounded-2xl p-4"
                >
                    <div className="flex items-center gap-3">
                        <div className="bg-green-100 p-2 rounded-xl">
                            <span className="text-xl">🎯</span>
                        </div>
                        <div>
                            <h3 className="font-medium text-gray-900">
                                {lang === "ru" ? "Отлично! Вы выбрали 3 ключевые ценности" : "Great! You've selected 3 key values"}
                            </h3>
                            <p className="text-sm text-gray-600">
                                {lang === "ru"
                                    ? "Нажмите 'Продолжить', чтобы сохранить результат и посмотреть рекомендации"
                                    : "Click 'Continue' to save the results and view recommendations"}
                            </p>
                        </div>
                    </div>
                </motion.div>
            )}

            <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                {stepThreeValues.map((value) => {
                    const isSelected = value.selected;

                    return (
                        <motion.button
                            key={value.id}
                            whileHover={{ scale: isComplete && !isSelected ? 1 : 1.03 }}
                            whileTap={{ scale: isComplete && !isSelected ? 1 : 0.97 }}
                            onClick={() => onSelectFinalValue(value)}
                            className={`
                                p-4 rounded-2xl border-2 transition-all duration-200 text-center relative
                                ${isSelected
                                ? 'bg-gradient-to-br from-blue-50 to-indigo-50 border-blue-300 text-blue-800 shadow-md'
                                : 'bg-white/70 border-gray-200 text-gray-700 hover:border-gray-300'
                            }
                                ${isComplete && !isSelected ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}
                            `}
                            disabled={isComplete && !isSelected}
                        >
                            <div className="flex flex-col items-center">
                                <span className="text-xl mb-1">{value.icon}</span>
                                <span className="font-medium">{value.text}</span>
                                {isSelected && (
                                    <motion.div
                                        initial={{ scale: 0 }}
                                        animate={{ scale: 1 }}
                                        className="mt-2 w-8 h-8 rounded-full bg-gradient-to-r from-blue-500 to-indigo-600 flex items-center justify-center"
                                    >
                                        <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                                        </svg>
                                    </motion.div>
                                )}
                            </div>

                            {/* Индикатор выбора */}
                            {isSelected && (
                                <div className="absolute -top-2 -right-2 w-6 h-6 rounded-full bg-blue-500 text-white flex items-center justify-center text-xs font-bold">
                                    {stepThreeValues
                                        .filter(v => v.selected)
                                        .findIndex(v => v.id === value.id) + 1}
                                </div>
                            )}
                        </motion.button>
                    );
                })}
            </div>

            {/* Счетчик выбора */}
            <div className="mt-6 flex items-center justify-center">
                <div className="bg-gray-100 rounded-xl px-4 py-2">
                    <span className="text-gray-700">
                        {lang === "ru" ? "Выбрано: " : "Selected: "}
                        <span className={`font-bold ${isComplete ? 'text-green-600' : 'text-blue-600'}`}>
                            {selectedCount}/3
                        </span>
                    </span>
                </div>
            </div>

            {/* Кнопка для перехода к рекомендациям */}
            {isComplete && (
                <div className="mt-8 flex justify-center">
                    <motion.button
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={onContinue}
                        disabled={isSaving}
                        className={`bg-gradient-to-r from-blue-500 to-indigo-600 text-white px-8 py-3 rounded-xl font-medium text-lg shadow-lg flex items-center gap-2 ${
                            isSaving ? 'opacity-70 cursor-not-allowed' : ''
                        }`}
                    >
                        {isSaving ? (
                            <>
                                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                                <span>{lang === "ru" ? "Сохранение..." : "Saving..."}</span>
                            </>
                        ) : (
                            <>
                                <span>{lang === "ru" ? "Сохранить и продолжить" : "Save and continue"}</span>
                                <span>→</span>
                            </>
                        )}
                    </motion.button>
                </div>
            )}
        </div>
    );
};