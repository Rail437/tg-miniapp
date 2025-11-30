import React, {useState} from "react";
import {AnimatePresence, motion} from "framer-motion";
import {availableTests} from "./data/availableTests";
import {useTestEngine} from "./hooks/useTestEngine";
import {TestSelectionModal} from "./components/test/TestSelectionModal";
import {TestQuestionModal} from "./components/test/TestQuestionModal";
import {TestResultModal} from "./components/test/TestResultModal";
import {ProfileSection} from "./components/ProfileSection";
import {StoriesSection} from "./components/StoriesSection";
import {PsychologistSection} from "./components/PsychologistSection";

export default function App() {
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
    } = useTestEngine();

    const [activeTab, setActiveTab] = useState("tests");
    const [showProfile, setShowProfile] = useState(false);

    const tabs = [
        {id: "tests", name: "Тесты", icon: "🧠"},
        {id: "profile", name: "Кабинет", icon: "👤"},
        {id: "stories", name: "Истории", icon: "📖"},
        {id: "about", name: "О психологе", icon: "👩‍⚕️"},
    ];

    return (
        <div className="relative w-full min-h-screen bg-gradient-to-br from-blue-50 to-purple-50">
            {/* Header — стал ниже */}
            <header
                className="h-12 flex items-center justify-between px-4 sticky top-0 bg-white/80 backdrop-blur-sm shadow-sm z-40">
                <div className="flex items-center gap-2">
                    <div
                        className="w-7 h-7 bg-gradient-to-r from-blue-500 to-purple-500 rounded-lg flex items-center justify-center text-white text-xs font-bold">
                        IC
                    </div>
                    <h1 className="text-lg font-bold text-gray-800">INNER CODE</h1>
                </div>
                <button
                    onClick={() => setShowProfile(true)}
                    className="p-1.5 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
                >
                    👤
                </button>
            </header>

            {/* Navigation — стала ниже и компактнее */}
            <nav className="flex overflow-x-auto px-4 py-1.5 bg-white/60 backdrop-blur-sm border-b border-gray-200">
                <div className="flex space-x-1 min-w-max">
                    {tabs.map((tab) => (
                        <button
                            key={tab.id}
                            onClick={() => setActiveTab(tab.id)}
                            className={`flex items-center gap-1.5 px-3 py-1.5 text-sm rounded-lg whitespace-nowrap transition-colors ${
                                activeTab === tab.id
                                    ? "bg-blue-600 text-white shadow"
                                    : "text-gray-600 hover:bg-gray-100"
                            }`}
                        >
                            <span>{tab.icon}</span>
                            <span className="font-medium">{tab.name}</span>
                        </button>
                    ))}
                </div>
            </nav>

            {/* Main Content */}
            <main className="flex-1 p-4 pb-24">
                <AnimatePresence mode="wait">
                    {activeTab === "tests" && (
                        <motion.div
                            key="tests"
                            initial={{opacity: 0, y: 20}}
                            animate={{opacity: 1, y: 0}}
                            exit={{opacity: 0, y: -20}}
                            transition={{duration: 0.3}}
                            className="max-w-2xl mx-auto"
                        >
                            <div className="text-center mb-8">
                                <h2 className="text-2xl font-bold mb-2 text-gray-800">Психологические тесты</h2>
                                <p className="text-gray-600">Узнайте больше о себе и своём состоянии</p>
                            </div>

                            <div className="bg-white rounded-2xl p-6 shadow-lg">
                                <div className="grid grid-cols-1 gap-4">
                                    {availableTests.map((test) => (
                                        <div
                                            key={test.id}
                                            className="border border-gray-200 rounded-2xl p-4 hover:shadow-md transition-shadow"
                                        >
                                            <h3 className="font-semibold text-lg text-gray-800 mb-2">{test.name}</h3>
                                            <p className="text-gray-600 text-sm mb-4">{test.description}</p>
                                            <button
                                                onClick={() => startTest(test)}
                                                className="w-full py-2.5 bg-blue-600 text-white rounded-xl font-medium hover:bg-blue-700 transition-colors"
                                            >
                                                Начать тест
                                            </button>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </motion.div>
                    )}

                    {activeTab === "profile" && (
                        <motion.div
                            key="profile"
                            initial={{opacity: 0, y: 20}}
                            animate={{opacity: 1, y: 0}}
                            exit={{opacity: 0, y: -20}}
                            transition={{duration: 0.3}}
                        >
                            <ProfileSection/>
                        </motion.div>
                    )}

                    {activeTab === "stories" && (
                        <motion.div
                            key="stories"
                            initial={{opacity: 0, y: 20}}
                            animate={{opacity: 1, y: 0}}
                            exit={{opacity: 0, y: -20}}
                            transition={{duration: 0.3}}
                        >
                            <StoriesSection/>
                        </motion.div>
                    )}

                    {activeTab === "about" && (
                        <motion.div
                            key="about"
                            initial={{opacity: 0, y: 20}}
                            animate={{opacity: 1, y: 0}}
                            exit={{opacity: 0, y: -20}}
                            transition={{duration: 0.3}}
                        >
                            <PsychologistSection/>
                        </motion.div>
                    )}
                </AnimatePresence>
            </main>

            {/* Footer */}
            <div
                className="h-16 bg-white/50 backdrop-blur-sm sticky bottom-0 left-0 right-0 flex items-center justify-center border-t border-gray-200">
                <p className="text-sm text-gray-500">© {new Date().getFullYear()} INNER CODE</p>
            </div>

            {/* Modals */}
            <AnimatePresence>
                {showTests && (
                    <TestSelectionModal
                        tests={availableTests}
                        onSelectTest={startTest}
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
                        className="fixed inset-0 bg-black/50 flex items-center justify-center z-50"
                    >
                        <motion.div
                            initial={{scale: 0.9, opacity: 0}}
                            animate={{scale: 1, opacity: 1}}
                            exit={{scale: 0.9, opacity: 0}}
                            className="bg-white rounded-3xl p-6 w-full max-w-md shadow-2xl"
                        >
                            <div className="flex justify-between items-center mb-4">
                                <h2 className="text-xl font-bold text-gray-800">Личный кабинет</h2>
                                <button
                                    onClick={() => setShowProfile(false)}
                                    className="text-gray-400 hover:text-gray-600 text-2xl"
                                >
                                    &times;
                                </button>
                            </div>
                            <ProfileSection/>
                            <button
                                onClick={() => setShowProfile(false)}
                                className="w-full mt-6 py-2.5 rounded-2xl bg-gray-100 text-gray-700 font-medium"
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