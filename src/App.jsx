// src/App.jsx
import React, {useEffect, useState} from "react";
import {AnimatePresence, motion} from "framer-motion";
import {availableTests} from "./data/availableTests";
import {useTestEngine} from "./hooks/useTestEngine";
import {TestSelectionModal} from "./components/test/TestSelectionModal";
import {TestQuestionModal} from "./components/test/TestQuestionModal";
import {TestResultModal} from "./components/test/TestResultModal";
import {ProfileSection} from "./components/ProfileSection";
import {TopHeader} from "./components/layout/TopHeader";
import {TabNavigation} from "./components/layout/TabNavigation";
import {InsightsSection} from "./components/InsightsSection";
import {apiClient} from "./api/apiClient";

export default function App() {
    const [activeTab, setActiveTab] = useState("tests");
    const [showProfile, setShowProfile] = useState(false);
    const [user, setUser] = useState(null);

    const {
        showTests,
        setShowTests,
        showResults,
        currentTest,
        currentQuestion,
        startTest,
        answerQuestion,
        resetTest,
        getTestResult,
    } = useTestEngine(user?.userId);

    const tabs = [
        {id: "tests", name: "Тесты", icon: "🧠"},
        {id: "profile", name: "Кабинет", icon: "👤"},
        {id: "stories", name: "Истории", icon: "📖"},
        {id: "about", name: "О психологе", icon: "👩‍⚕️"},
    ];
    useEffect(() => {
        async function init() {
            // потом сюда подставишь реальный initData из Telegram.WebApp.initData
            const initDataMock = "dummy";
            const res = await apiClient.authTelegram(initDataMock);
            setUser(res); // { userId, lastResult }
        }

        init();
    }, []);

    return (
        <div className="relative w-full min-h-screen bg-gradient-to-br from-slate-50 via-indigo-50 to-purple-100">
            {/* Центрируем всё приложение и задаём “рамку” максимальной ширины */}
            <div className="max-w-3xl mx-auto min-h-screen flex flex-col py-4 px-3">
                {/* HEADER — стеклянная шапка */}
                <TopHeader onOpenProfile={() => setShowProfile(true)}/>

                {/* Навигация */}
                <TabNavigation
                    activeTab={activeTab}
                    setActiveTab={setActiveTab}
                    hasMore={!!user?.lastResult}
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
                                                Психологические тесты
                                            </h2>
                                            <p className="text-sm sm:text-base text-gray-600 max-w-md">
                                                Узнай свой психотип, пойми, как устроен твой внутренний
                                                код, и посмотри, как вы с другими людьми усиливаете
                                                друг друга.
                                            </p>
                                        </div>
                                    </div>

                                    {/* Карточки тестов в стиле glass */}
                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                        {availableTests.map((test) => (
                                            <motion.button
                                                key={test.id}
                                                onClick={() => startTest(test)}
                                                whileHover={{y: -4, scale: 1.01}}
                                                whileTap={{scale: 0.98, y: 0}}
                                                className="text-left bg-white/80 border border-white/80 rounded-2xl p-4 shadow-sm hover:shadow-lg transition-all flex flex-col justify-between"
                                            >
                                                <div>
                                                    <h3 className="font-semibold text-base sm:text-lg text-gray-900 mb-1.5">
                                                        {test.name}
                                                    </h3>
                                                    <p className="text-sm text-gray-600">
                                                        {test.description}
                                                    </p>
                                                </div>
                                                <span
                                                    className="mt-3 inline-flex items-center gap-1 text-sm font-medium text-blue-600">
                          Начать тест
                          <span>→</span>
                        </span>
                                            </motion.button>
                                        ))}
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

                            {activeTab === "more" && (
                                <motion.div
                                    key="more"
                                    initial={{opacity: 0, y: 20}}
                                    animate={{opacity: 1, y: 0}}
                                    exit={{opacity: 0, y: -20}}
                                    transition={{duration: 0.3}}
                                >
                                    <InsightsSection lastResult={user?.lastResult}/>
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
                        tests={availableTests}
                        onSelect={startTest}
                        onClose={() => setShowTests(false)}
                    />
                )}

                {currentTest && !showResults && (
                    <TestQuestionModal
                        test={currentTest}
                        currentQuestionIndex={currentQuestion}
                        onAnswer={answerQuestion}
                        onClose={resetTest}
                    />
                )}

                {showResults && (
                    <TestResultModal
                        resultText={getTestResult()}
                        onRestart={() => {
                            resetTest();
                            setActiveTab("tests");
                        }}
                    />
                )}

                {showProfile && (
                    <motion.div
                        initial={{opacity: 0}}
                        animate={{opacity: 1}}
                        exit={{opacity: 0}}
                        className="fixed inset-0 bg-black/40 flex items-center justify-center z-50"
                    >
                        <motion.div
                            initial={{scale: 0.9, opacity: 0}}
                            animate={{scale: 1, opacity: 1}}
                            exit={{scale: 0.9, opacity: 0}}
                            className="bg-white/90 backdrop-blur-2xl rounded-3xl p-6 w-full max-w-md shadow-2xl border border-white/70"
                        >
                            <div className="flex justify-between items-center mb-4">
                                <h2 className="text-xl font-bold text-gray-900">
                                    Личный кабинет
                                </h2>
                                <button
                                    onClick={() => setShowProfile(false)}
                                    className="text-gray-400 hover:text-gray-600 text-2xl leading-none"
                                >
                                    &times;
                                </button>
                            </div>
                            <ProfileSection userId={user?.userId}/>
                            <button
                                onClick={() => setShowProfile(false)}
                                className="w-full mt-6 py-2.5 rounded-2xl bg-gray-100 text-gray-700 font-medium hover:bg-gray-200 transition-colors"
                            >
                                Закрыть
                            </button>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}
