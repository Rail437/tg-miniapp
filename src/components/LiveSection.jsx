// LiveSection.jsx
import React, {useEffect, useState} from "react";
import {motion} from "framer-motion";
import {useTranslation} from "../i18n";
import {WheelOfLife} from "./live/WheelOfLife";
import {apiClient} from "../api/apiClient";

export const LiveSection = ({userId}) => {
    const {lang} = useTranslation();
    const [activeFeature, setActiveFeature] = useState(null);
    const [wheelData, setWheelData] = useState(null);
    const [isLoading, setIsLoading] = useState(true);

    // Загружаем последние данные колеса баланса при открытии
    useEffect(() => {
        const loadWheelData = async () => {
            if (!userId) {
                setIsLoading(false);
                return;
            }

            try {
                setIsLoading(true);
                const response = await apiClient.getLastLiveWheel(userId);

                if (response?.data) {
                    setWheelData(response.data);
                } else {
                    setWheelData(null); // Нет сохраненных данных
                }
            } catch (error) {
                console.error("Error loading wheel data:", error);
                setWheelData(null);
            } finally {
                setIsLoading(false);
            }
        };

        loadWheelData();
    }, [userId]);

    // Список фич/инструментов в разделе Live
    const features = [
        {
            id: 'wheel',
            title: lang === "ru" ? "Колесо баланса" : "Wheel of Life",
            description: lang === "ru"
                ? "Оцените ваши жизненные сферы по шкале от 1 до 10"
                : "Rate your life areas from 1 to 10",
            icon: "📊",
            color: "from-blue-500 to-purple-500",
            stats: wheelData
                ? (lang === "ru" ? `Ваш балл: ${calculateAverage(wheelData.values)}/10`
                    : `Your score: ${calculateAverage(wheelData.values)}/10`)
                : (lang === "ru" ? "8 сфер для оценки" : "8 areas to rate"),
            hasData: !!wheelData
        },
        {
            id: 'coming-soon-1',
            title: lang === "ru" ? "Ценности" : "Values",
            description: lang === "ru"
                ? "Определите свои жизненные ценности"
                : "Define your life values",
            icon: "💎",
            color: "from-amber-500 to-orange-500",
            stats: lang === "ru" ? "Скоро" : "Coming soon",
            disabled: true
        },
        {
            id: 'coming-soon-2',
            title: lang === "ru" ? "Цели на неделю" : "Weekly Goals",
            description: lang === "ru"
                ? "Ставьте и отслеживайте цели"
                : "Set and track your goals",
            icon: "🎯",
            color: "from-amber-500 to-orange-500",
            stats: lang === "ru" ? "Скоро" : "Coming soon",
            disabled: true
        }
    ];

    // Функция для расчета среднего балла
    const calculateAverage = (values) => {
        if (!values) return 0;
        const numbers = Object.values(values).filter(v => typeof v === 'number');
        if (numbers.length === 0) return 0;
        const sum = numbers.reduce((acc, val) => acc + val, 0);
        return (sum / numbers.length).toFixed(1);
    };

    if (activeFeature === 'wheel') {
        return <WheelOfLife
            userId={userId}
            onBack={() => setActiveFeature(null)}
            initialData={wheelData} // Передаем начальные данные
        />;
    }

    // Показываем загрузку
    if (isLoading) {
        return (
            <div className="space-y-4">
                <div className="flex items-start justify-between gap-3">
                    <div>
                        <h2 className="text-xl font-bold text-gray-900">Live</h2>
                        <p className="text-sm text-gray-600 mt-1">
                            {lang === "ru"
                                ? "Инструменты для отслеживания вашего состояния и прогресса"
                                : "Tools to track your well-being and progress"}
                        </p>
                    </div>
                </div>
                <div
                    className="bg-white/70 border border-white/80 rounded-3xl p-10 shadow-sm flex items-center justify-center">
                    <div className="text-center">
                        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
                        <p className="mt-4 text-gray-600">
                            {lang === "ru" ? "Загружаем данные..." : "Loading data..."}
                        </p>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="space-y-4">
            {/* верх */}
            <div className="flex items-start justify-between gap-3">
                <div>
                    <h2 className="text-xl font-bold text-gray-900">Live</h2>
                    <p className="text-sm text-gray-600 mt-1">
                        {lang === "ru"
                            ? "Инструменты для отслеживания вашего состояния и прогресса"
                            : "Tools to track your well-being and progress"}
                    </p>
                </div>
            </div>

            {/* сетка плашек */}
            <div className="grid grid-cols-1 gap-3">
                {features.map((feature) => (
                    <motion.div
                        key={feature.id}
                        whileHover={!feature.disabled ? {y: -2, scale: 1.005} : {}}
                        whileTap={!feature.disabled ? {scale: 0.995} : {}}
                        onClick={() => !feature.disabled && setActiveFeature(feature.id)}
                        className={`
                            bg-white/70 border border-white/80 rounded-3xl p-5 shadow-sm
                            ${!feature.disabled ? 'cursor-pointer' : 'cursor-not-allowed opacity-60'}
                        `}
                    >
                        <div className="flex items-start justify-between gap-3">
                            <div className="flex-1 min-w-0">
                                <div className="flex items-center gap-2 mb-2">
                                    <span className="text-2xl">{feature.icon}</span>
                                    <h3 className="text-lg font-bold text-gray-900 truncate">
                                        {feature.title}
                                    </h3>
                                    {feature.hasData && (
                                        <span className="text-xs px-2 py-1 bg-green-100 text-green-700 rounded-full">
                                            {lang === "ru" ? "Есть данные" : "Has data"}
                                        </span>
                                    )}
                                </div>

                                <p className="text-sm text-gray-600 mb-3">
                                    {feature.description}
                                </p>

                                <div className="flex items-center justify-between">
                                    <span className="text-xs text-gray-500">
                                        {feature.stats}
                                    </span>

                                    {!feature.disabled && (
                                        <motion.span
                                            className={`text-xs font-medium bg-gradient-to-r bg-clip-text text-transparent ${feature.color}`}
                                        >
                                            {lang === "ru" ? "Открыть →" : "Open →"}
                                        </motion.span>
                                    )}
                                </div>
                            </div>

                            {feature.disabled && (
                                <span className="text-xs px-2 py-1 bg-gray-100 text-gray-500 rounded-full">
                                    {lang === "ru" ? "Скоро" : "Soon"}
                                </span>
                            )}
                        </div>

                        {/* Градиентная полоска внизу */}
                        {!feature.disabled && (
                            <div className={`mt-4 h-1 rounded-full bg-gradient-to-r ${feature.color}`}/>
                        )}
                    </motion.div>
                ))}
            </div>

            {/* подсказка */}
            <div className="bg-white/60 border border-white/70 rounded-2xl px-4 py-3">
                <p className="text-xs text-gray-500 text-center">
                    {lang === "ru"
                        ? "Выберите инструмент для работы. Новые инструменты добавляются регулярно."
                        : "Choose a tool to work with. New tools are added regularly."}
                </p>
            </div>
        </div>
    );
};