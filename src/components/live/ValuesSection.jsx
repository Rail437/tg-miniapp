// ValuesSection.jsx
import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { useTranslation } from "../../i18n";
import { apiClient } from "../../api/apiClient";
import { getStageInstruction, loadInitialValues } from "../values/valuesUtils";
import { Stage1Selection } from "../values/Stage1Selection";
import { Stage2Removal } from "../values/Stage2Removal";
import { Stage3FinalSelection } from "../values/Stage3FinalSelection";
import { Stage4Recommendations } from "../values/Stage4Recommendations";

export const ValuesSection = ({ userId, onBack }) => {
    const { lang } = useTranslation();

    // Состояния
    const [step, setStep] = useState(1);
    const [allValues, setAllValues] = useState([]);
    const [selectedValues, setSelectedValues] = useState([]);
    const [stepTwoValues, setStepTwoValues] = useState([]);
    const [stepThreeValues, setStepThreeValues] = useState([]);
    const [removedValues, setRemovedValues] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isSaving, setIsSaving] = useState(false);
    const [hasSavedValues, setHasSavedValues] = useState(false);
    const [savedValuesData, setSavedValuesData] = useState(null);
    const [saveError, setSaveError] = useState(null);

    // Загружаем данные
    useEffect(() => {
        const loadData = async () => {
            try {
                setIsLoading(true);
                const values = await loadInitialValues(lang);
                setAllValues(values);

                // Проверяем сохраненные значения
                if (userId) {
                    try {
                        const savedResponse = await apiClient.getSavedValues(userId);
                        if (savedResponse?.success && savedResponse.data) {
                            setHasSavedValues(true);
                            setSavedValuesData(savedResponse.data);

                            if (savedResponse.data.values && Array.isArray(savedResponse.data.values)) {
                                const formattedValues = savedResponse.data.values.map(value => ({
                                    ...value,
                                    selected: true
                                }));
                                setStepThreeValues(formattedValues);
                                setStep(4);
                            }
                        }
                    } catch (savedError) {
                        console.log("No saved values found:", savedError);
                    }
                }
            } catch (error) {
                console.error("Error loading data:", error);
            } finally {
                setIsLoading(false);
            }
        };

        loadData();
    }, [lang, userId]);

    // Сброс и начало заново
    const handleRestart = () => {
        setStep(1);
        setSelectedValues([]);
        setStepTwoValues([]);
        setStepThreeValues([]);
        setRemovedValues([]);
        setHasSavedValues(false);
        setSavedValuesData(null);
        setSaveError(null);

        const shuffledValues = [...allValues].sort(() => Math.random() - 0.5);
        setAllValues(shuffledValues);
    };

    // Этап 1: Выбор 10 ценностей
    const handleSelectValue = (value) => {
        const isAlreadySelected = selectedValues.some(v => v.id === value.id);

        if (isAlreadySelected) {
            setSelectedValues(selectedValues.filter(v => v.id !== value.id));
        } else if (selectedValues.length < 10) {
            setSelectedValues([...selectedValues, value]);
        }
    };

    const handleGoToStep2 = () => {
        if (selectedValues.length === 10) {
            setStepTwoValues([...selectedValues]);
            setStep(2);
        }
    };

    // Этап 2: Удаление 4 ценностей
    const handleRemoveValue = (value) => {
        setRemovedValues([...removedValues, value]);
        setStepTwoValues(stepTwoValues.filter(v => v.id !== value.id));
    };

    const handleRestoreValue = () => {
        if (removedValues.length > 0) {
            const lastRemoved = removedValues[removedValues.length - 1];
            setStepTwoValues([...stepTwoValues, lastRemoved]);
            setRemovedValues(removedValues.slice(0, -1));
        }
    };

    const handleGoToStep3 = () => {
        if (stepTwoValues.length === 6) {
            const valuesForStep3 = stepTwoValues.map(v => ({ ...v, selected: false }));
            setStepThreeValues(valuesForStep3);
            setStep(3);
        }
    };

    // Этап 3: Выбор финальных 3 ценностей
    const handleSelectFinalValue = (value) => {
        const isAlreadySelected = value.selected;
        const selectedCount = stepThreeValues.filter(v => v.selected).length;

        if (selectedCount >= 3 && !isAlreadySelected) return;

        const updatedValues = stepThreeValues.map(v => {
            if (v.id === value.id) {
                return { ...v, selected: !isAlreadySelected };
            }
            return v;
        });

        setStepThreeValues(updatedValues);
    };

    // Сохранение и переход к этапу 4
    const handleSaveAndContinue = async () => {
        const finalValues = stepThreeValues
            .filter(v => v.selected)
            .map(({ id, text, icon, actions }) => ({
                id,
                text,
                icon,
                actions,
                savedAt: new Date().toISOString()
            }));

        if (finalValues.length !== 3) {
            setSaveError(lang === "ru"
                ? "Выберите 3 ценности для сохранения"
                : "Select 3 values to save");
            return;
        }

        try {
            setIsSaving(true);
            setSaveError(null);

            const response = await apiClient.saveFinalValues({
                userId,
                values: finalValues
            });

            if (response?.success) {
                // Обновляем состояние
                setHasSavedValues(true);
                setSavedValuesData(response.data);

                // Переходим к этапу 4
                setStep(4);
            } else {
                throw new Error(response?.error || 'Save failed');
            }

        } catch (error) {
            console.error("Error saving values:", error);
            setSaveError(lang === "ru"
                ? "Ошибка сохранения. Попробуйте еще раз."
                : "Save error. Please try again.");

            // Fallback: сохраняем в localStorage
            try {
                const fallbackData = {
                    userId,
                    values: finalValues,
                    savedAt: new Date().toISOString(),
                    savedViaFallback: true
                };

                localStorage.setItem(`user_${userId}_values_fallback`, JSON.stringify(fallbackData));
                setHasSavedValues(true);
                setSavedValuesData(fallbackData);
                setStep(4); // Все равно переходим к рекомендациям

            } catch (fallbackError) {
                console.error("Fallback save also failed:", fallbackError);
            }
        } finally {
            setIsSaving(false);
        }
    };

    // Сохранение результатов (ручное, если нужно на этапе 4)
    const handleSaveResults = async () => {
        const finalValues = stepThreeValues
            .filter(v => v.selected)
            .map(({ id, text, icon, actions }) => ({
                id,
                text,
                icon,
                actions,
                savedAt: new Date().toISOString()
            }));

        try {
            setIsSaving(true);

            const response = await apiClient.saveFinalValues({
                userId,
                values: finalValues
            });

            if (response?.success) {
                setHasSavedValues(true);
                setSavedValuesData(response.data);

                if (lang === "ru") {
                    alert("🎉 Результаты сохранены!");
                } else {
                    alert("🎉 Results saved!");
                }
            } else {
                throw new Error(response?.error || 'Save failed');
            }

        } catch (error) {
            console.error("Error saving values:", error);

            try {
                const fallbackData = {
                    userId,
                    values: finalValues,
                    savedAt: new Date().toISOString(),
                    savedViaFallback: true
                };

                localStorage.setItem(`user_${userId}_values_fallback`, JSON.stringify(fallbackData));
                setHasSavedValues(true);
                setSavedValuesData(fallbackData);

                if (lang === "ru") {
                    alert("⚠️ Данные сохранены локально");
                } else {
                    alert("⚠️ Data saved locally");
                }

            } catch (fallbackError) {
                console.error("Fallback save also failed:", fallbackError);

                if (lang === "ru") {
                    alert("❌ Ошибка при сохранении");
                } else {
                    alert("❌ Save error");
                }
            }
        } finally {
            setIsSaving(false);
        }
    };

    // Завершение
    const handleFinish = () => {
        onBack();
    };

    // Получение данных для инструкции
    const getInstructionData = () => {
        switch (step) {
            case 1:
                return { selectedCount: selectedValues.length };
            case 2:
                return { removedCount: removedValues.length };
            case 3:
                return { selectedCount: stepThreeValues.filter(v => v.selected).length };
            default:
                return {};
        }
    };

    // Отображение ошибки сохранения
    const SaveErrorDisplay = () => {
        if (!saveError) return null;

        return (
            <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="mb-4"
            >
                <div className="bg-red-50 border border-red-200 rounded-xl p-3 flex items-center gap-2">
                    <span className="text-red-600">⚠️</span>
                    <span className="text-sm text-red-700">{saveError}</span>
                </div>
            </motion.div>
        );
    };

    // Отображение загрузки
    if (isLoading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-amber-600 mx-auto"></div>
                    <p className="mt-4 text-gray-600">
                        {lang === "ru" ? "Загружаем..." : "Loading..."}
                    </p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen p-4 max-w-4xl mx-auto">
            {/* Шапка */}
            <div className="flex items-center justify-between mb-6">
                <button
                    onClick={onBack}
                    className="flex items-center gap-2 text-gray-600 hover:text-gray-900 transition-colors p-2"
                >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                    </svg>
                    <span>{lang === "ru" ? "Назад" : "Back"}</span>
                </button>

                {step !== 4 && (
                    <div className="flex items-center gap-2">
                        {[1, 2, 3, 4].map((num) => (
                            <div
                                key={num}
                                className={`w-8 h-8 rounded-full flex items-center justify-center font-medium ${
                                    step === num
                                        ? 'bg-gradient-to-r from-amber-500 to-orange-500 text-white'
                                        : step > num
                                            ? 'bg-green-100 text-green-700'
                                            : 'bg-gray-200 text-gray-500'
                                }`}
                            >
                                {num}
                            </div>
                        ))}
                        <span className="ml-2 text-sm text-gray-600">
                            {lang === "ru" ? `Этап ${step}` : `Step ${step}`}
                        </span>
                    </div>
                )}

                {step === 4 && hasSavedValues && (
                    <button
                        onClick={handleRestart}
                        className="flex items-center gap-2 text-amber-600 hover:text-amber-700 px-4 py-2 border border-amber-200 rounded-xl hover:bg-amber-50 transition-colors"
                    >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                        </svg>
                        {lang === "ru" ? "Пройти заново" : "Start over"}
                    </button>
                )}
            </div>

            {/* Ошибка сохранения */}
            <SaveErrorDisplay />

            {/* Инструкция */}
            {step !== 4 && (
                <div className="bg-gradient-to-r from-amber-50 to-orange-50 border border-amber-100 rounded-2xl p-5 mb-6">
                    <h2 className="text-xl font-bold text-gray-900 mb-2">
                        {lang === "ru" ? "Определение жизненных ценностей" : "Defining Life Values"}
                    </h2>
                    <p className="text-gray-700">
                        {getStageInstruction(step, lang, getInstructionData())}
                    </p>

                    {/* Прогресс-бары */}
                    {step === 1 && (
                        <div className="mt-4">
                            <div className="flex justify-between text-sm text-gray-600 mb-1">
                                <span>{lang === "ru" ? "Выбрано" : "Selected"}: {selectedValues.length}/10</span>
                                <span>
                                    {selectedValues.length === 10
                                        ? (lang === "ru" ? "Готово!" : "Ready!")
                                        : (lang === "ru" ? "Выберите еще" : "Select more")}
                                </span>
                            </div>
                            <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                                <motion.div
                                    className="h-full bg-gradient-to-r from-green-500 to-emerald-600"
                                    initial={{ width: 0 }}
                                    animate={{ width: `${(selectedValues.length / 10) * 100}%` }}
                                    transition={{ duration: 0.5 }}
                                />
                            </div>
                        </div>
                    )}

                    {step === 2 && (
                        <div className="mt-4">
                            <div className="flex justify-between text-sm text-gray-600 mb-1">
                                <span>{lang === "ru" ? "Удалено" : "Removed"}: {removedValues.length}/4</span>
                                <span>
                                    {removedValues.length === 4
                                        ? (lang === "ru" ? "Готово!" : "Ready!")
                                        : (lang === "ru" ? "Удалите еще" : "Remove more")}
                                </span>
                            </div>
                            <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                                <motion.div
                                    className="h-full bg-gradient-to-r from-amber-500 to-orange-500"
                                    initial={{ width: 0 }}
                                    animate={{ width: `${(removedValues.length / 4) * 100}%` }}
                                    transition={{ duration: 0.5 }}
                                />
                            </div>
                        </div>
                    )}

                    {step === 3 && (
                        <div className="mt-4">
                            <div className="flex justify-between text-sm text-gray-600 mb-1">
                                <span>{lang === "ru" ? "Выбрано" : "Selected"}: {stepThreeValues.filter(v => v.selected).length}/3</span>
                                <span>
                                    {stepThreeValues.filter(v => v.selected).length === 3
                                        ? (lang === "ru" ? "Готово!" : "Ready!")
                                        : (lang === "ru" ? "Выберите еще" : "Select more")}
                                </span>
                            </div>
                            <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                                <motion.div
                                    className="h-full bg-gradient-to-r from-blue-500 to-indigo-600"
                                    initial={{ width: 0 }}
                                    animate={{ width: `${(stepThreeValues.filter(v => v.selected).length / 3) * 100}%` }}
                                    transition={{ duration: 0.5 }}
                                />
                            </div>
                        </div>
                    )}
                </div>
            )}

            {/* Рендер этапов */}
            {step === 1 && (
                <Stage1Selection
                    allValues={allValues}
                    selectedValues={selectedValues}
                    onSelectValue={handleSelectValue}
                    onContinue={handleGoToStep2}
                    lang={lang}
                />
            )}

            {step === 2 && (
                <Stage2Removal
                    stepTwoValues={stepTwoValues}
                    removedValues={removedValues}
                    onRemoveValue={handleRemoveValue}
                    onRestoreValue={handleRestoreValue}
                    onContinue={handleGoToStep3}
                    lang={lang}
                />
            )}

            {step === 3 && (
                <Stage3FinalSelection
                    stepThreeValues={stepThreeValues}
                    onSelectFinalValue={handleSelectFinalValue}
                    onContinue={handleSaveAndContinue}
                    lang={lang}
                    isSaving={isSaving}
                />
            )}

            {step === 4 && (
                <Stage4Recommendations
                    stepThreeValues={stepThreeValues}
                    onFinish={handleFinish}
                    onSave={hasSavedValues ? undefined : handleSaveResults}
                    isSaving={isSaving}
                    lang={lang}
                    hasSavedValues={hasSavedValues}
                    onRestart={handleRestart}
                    savedValuesData={savedValuesData}
                />
            )}
        </div>
    );
};