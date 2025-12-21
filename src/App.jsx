// src/App.jsx
import React, {useEffect, useState} from "react";
import {AnimatePresence, motion} from "framer-motion";
import {availableTests} from "./data/availableTests";
import {TestSelectionModal} from "./components/test/TestSelectionModal";
import {TestQuestionModal} from "./components/test/TestQuestionModal";
import {TestResultModal} from "./components/test/TestResultModal";
import {ProfileSection} from "./components/profile/ProfileSection";
import {TopHeader} from "./components/layout/TopHeader";
import {TabNavigation} from "./components/layout/TabNavigation";
import InsightsSection from "./components/InsightsSection";
import {LanguageProvider, useTranslation} from "./i18n";
import {apiClient} from "./api/apiClient";
import {useSocionicsEngine} from "./hooks/useSocionicsEngine";
import {LiveSection} from "./components/LiveSection";

function AppInner() {
    const [activeTab, setActiveTab] = useState("tests");
    const [user, setUser] = useState(null);
    const {t, lang} = useTranslation();
    const [clientProfile, setClientProfile] = useState(null);

    const {
        showTests,
        setShowTests,
        showResults,
        currentTest,
        currentQuestion,
        currentQuestionIndex,
        totalQuestions,
        startTest,
        startFromSavedBase,
        answerQuestion,
        resetTest,
        resultData,
        baseCompleted,
    } = useSocionicsEngine(user?.userId);


    // Инициализация пользователя + реферальный код из URL (?ref=...)
    useEffect(() => {
        const init = async () => {
            try {
                const tg = window.Telegram?.WebApp;
                const initData =
                    tg?.initData && tg.initData.length > 0
                        ? tg.initData                      // реальное initData
                        : "user=test_user";                // dev-режим для браузера

                // 1. Авторизация на бэке
                const authResponse = await apiClient.authTelegram(initData);
                const {userId, token, lastResult: authLastResult} = authResponse;

                // 2. Сохраняем токен, если предусмотрен в apiClient
                if (token && typeof apiClient.setAuthToken === "function") {
                    apiClient.setAuthToken(token);
                }

                // 3. Подтягиваем последний результат, если он есть
                let lastResult = authLastResult ?? null;
                if (!lastResult && userId != null && typeof apiClient.getLastResult === "function") {
                    try {
                        lastResult = await apiClient.getLastResult(userId);
                    } catch (e) {
                        console.error("getLastResult failed", e);
                    }
                }

                // 4. Сохраняем пользователя с lastResult
                setUser({
                    ...authResponse,
                    userId,
                    lastResult: lastResult || null,
                });

                // 👇 получаем профиль клиента
                try {
                    const profile = await apiClient.getClientProfile(userId);
                    setClientProfile(profile);
                } catch (e) {
                    console.error("getClientProfile error", e);
                }

                // 5. Проверяем реферальный код в URL и регистрируем использование
                const params = new URLSearchParams(window.location.search);
                const refCode = params.get("ref");
                if (refCode && userId != null && typeof apiClient.registerReferralUse === "function") {
                    try {
                        await apiClient.registerReferralUse({
                            code: refCode,
                            invitedUserId: userId,
                        });
                    } catch (e) {
                        console.error("Failed to register referral use", e);
                    }
                }
            } catch (e) {
                console.error("Auth init failed", e);
            }
        };

        init();
    }, []);

    // Если получили resultData после прохождения теста — обновляем user.lastResult,
    // чтобы сразу появилась вкладка "Дополнительно" и было что показывать
    useEffect(() => {
        if (resultData) {
            setUser((prev) =>
                prev
                    ? {
                        ...prev,
                        lastResult: resultData,
                    }
                    : prev
            );
        }
    }, [resultData]);

    return (
        <div className="relative w-full min-h-screen bg-gradient-to-br from-slate-50 via-indigo-50 to-purple-100">
            {/* Центрируем всё приложение и задаём “рамку” максимальной ширины */}
            <div className="max-w-3xl mx-auto min-h-screen flex flex-col py-4 px-3">
                {/* HEADER — стеклянная шапка */}
                <TopHeader onOpenProfile={() => setActiveTab("profile")}/>

                {/* Навигация */}
                <TabNavigation
                    activeTab={activeTab}
                    setActiveTab={setActiveTab}
                    hasMore={!!user?.lastResult}
                    hasLive={!!clientProfile?.flags?.live}
                />

                {/* MAIN SHELL — общая стеклянная карточка для контента табов */}
                <main className="flex-1 mb-4">
                    <div
                        className="bg-white/65 backdrop-blur-2xl border border-white/70 rounded-3xl shadow-xl p-5 sm:p-6">
                        <AnimatePresence mode="wait">
                            {/* ТАБ: ТЕСТЫ */}
                            {activeTab === "tests" && (
                                <motion.div
                                    key="tests"
                                    initial={{opacity: 0, y: 20}}
                                    animate={{opacity: 1, y: 0}}
                                    exit={{opacity: 0, y: -20}}
                                    transition={{duration: 0.3}}
                                    className="space-y-6"
                                >
                                    {/* Hero-секция с мозгом */}
                                    <div className="flex flex-col md:flex-row items-center md:items-start gap-6">
                                        <div className="relative">
                                            {/* Glow под мозгом */}
                                            <motion.div
                                                className="absolute inset-0 blur-2xl rounded-full"
                                                style={{
                                                    background:
                                                        "radial-gradient(circle, rgba(59,130,246,0.45), transparent 60%)",
                                                }}
                                                animate={{
                                                    opacity: [0.6, 1, 0.6],
                                                    scale: [0.9, 1.05, 0.9],
                                                }}
                                                transition={{
                                                    duration: 3.2,
                                                    repeat: Infinity,
                                                    ease: "easeInOut",
                                                }}
                                            />
                                            {/* Сам мозг */}
                                            <motion.div
                                                className="relative w-20 h-20 sm:w-24 sm:h-24 rounded-3xl bg-gradient-to-br from-blue-500 to-purple-500 flex items-center justify-center text-3xl sm:text-4xl text-white shadow-2xl"
                                                animate={{
                                                    y: [0, -8, 0],
                                                    rotate: [0, -3, 2, 0],
                                                    scale: [1, 1.04, 1],
                                                }}
                                                transition={{
                                                    duration: 3,
                                                    repeat: Infinity,
                                                    ease: "easeInOut",
                                                }}
                                            >
                                                🧠
                                            </motion.div>
                                        </div>

                                        <div className="text-center md:text-left space-y-2">
                                            <h2 className="text-2xl sm:text-3xl font-bold text-gray-900">
                                                {t("tests.mainTitle")}
                                            </h2>
                                            <p className="text-sm sm:text-base text-gray-600 max-w-md">
                                                {t("tests.mainDescription")}
                                            </p>
                                        </div>
                                    </div>

                                    {/* Карточки тестов в стиле glass */}
                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                        {availableTests.map((test) => {
                                            const title = test.name?.[lang] ?? test.name?.ru ?? "";
                                            const desc =
                                                test.description?.[lang] ??
                                                test.description?.ru ??
                                                "";

                                            return (
                                                <motion.button
                                                    key={test.id}
                                                    onClick={() => startTest(test)}
                                                    whileHover={{y: -4, scale: 1.01}}
                                                    whileTap={{scale: 0.98, y: 0}}
                                                    className="text-left bg-white/80 border border-white/80 rounded-2xl p-4 shadow-sm hover:shadow-lg transition-all flex flex-col justify-between"
                                                >
                                                    <div>
                                                        <h3 className="font-semibold text-base sm:text-lg text-gray-900 mb-1.5">
                                                            {title}
                                                        </h3>
                                                        <p className="text-sm text-gray-600">{desc}</p>
                                                    </div>
                                                    <span
                                                        className="mt-3 inline-flex items-center gap-1 text-sm font-medium text-blue-600">
                                                        {lang === "ru" ? "Начать тест" : "Start test"}
                                                        <span>→</span>
                                                    </span>
                                                </motion.button>
                                            );
                                        })}
                                    </div>
                                </motion.div>
                            )}

                            {/* ТАБ: КАБИНЕТ */}
                            {activeTab === "profile" && (
                                <motion.div
                                    key="profile"
                                    initial={{opacity: 0, y: 20}}
                                    animate={{opacity: 1, y: 0}}
                                    exit={{opacity: 0, y: -20}}
                                    transition={{duration: 0.3}}
                                >
                                    <ProfileSection userId={user?.userId}/>
                                </motion.div>
                            )}
                            {activeTab === "live" && (
                                <motion.div
                                    key="live"
                                    initial={{opacity: 0, y: 20}}
                                    animate={{opacity: 1, y: 0}}
                                    exit={{opacity: 0, y: -20}}
                                    transition={{duration: 0.3}}
                                >
                                    <LiveSection userId={user?.userId}/>
                                </motion.div>
                            )}
                            {/* ТАБ: ДОПОЛНИТЕЛЬНО */}
                            {activeTab === "more" && (
                                <motion.div
                                    key="more"
                                    initial={{opacity: 0, y: 20}}
                                    animate={{opacity: 1, y: 0}}
                                    exit={{opacity: 0, y: -20}}
                                    transition={{duration: 0.3}}
                                >
                                    <InsightsSection
                                        lastResult={user?.lastResult}
                                        userId={user?.userId}
                                        compatibilityEnabled={!!clientProfile?.flags?.compatibility}
                                    />
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </div>
                </main>

                {/* FOOTER — аккуратный, стеклянный */}
                <footer className="mt-auto">
                    <div
                        className="h-14 rounded-2xl bg-white/60 backdrop-blur-xl border border-white/70 flex items-center justify-center text-xs sm:text-sm text-gray-500 shadow-sm">
                        © {new Date().getFullYear()} INNER CODE
                    </div>
                </footer>
            </div>

            {/* МОДАЛКИ поверх всего */}
            <AnimatePresence>
                {showTests && (
                    <TestSelectionModal
                        key="test-selection"
                        tests={availableTests}
                        onSelect={startTest}
                        onClose={() => setShowTests(false)}
                    />
                )}

                {baseCompleted && !showResults && (
                    <div key="base-completed" className="base-complete-message">
                        Основная часть теста пройдена! Осталось совсем немного — уточним детали и определим ваш точный
                        психотип.
                    </div>
                )}

                {currentTest && currentQuestion && !showResults && (
                    <TestQuestionModal
                        key="test-question"
                        test={currentTest}
                        question={currentQuestion}
                        currentQuestionIndex={currentQuestionIndex}
                        totalQuestions={totalQuestions}
                        onAnswer={answerQuestion}
                        onClose={resetTest}
                    />
                )}

                {showResults && (
                    <TestResultModal
                        key="test-result"
                        result={resultData}
                        onClose={() => {
                            resetTest();
                            // остаёмся на текущей вкладке
                        }}
                    />
                )}
            </AnimatePresence>
        </div>
    );
}

export default function App() {
    return (
        <LanguageProvider>
            <AppInner/>
        </LanguageProvider>
    );
}
