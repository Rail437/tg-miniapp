// src/App.jsx
import React, { useState } from "react";

// Данные тестов
import { availableTests } from "./data/tests";

// Логика тестов
import { useTestEngine } from "./hooks/useTestEngine";

// Компоненты UI
import { Header } from "./components/layout/Header";
import { MainScreen } from "./components/MainScreen";
import { TestSelectionModal } from "./components/test/TestSelectionModal";
import { TestQuestionModal } from "./components/test/TestQuestionModal";
import { TestResultModal } from "./components/test/TestResultModal";
import { ProfileModal } from "./components/profile/ProfileModal";

export default function App() {
    // Логика тестов живёт в отдельном хуке
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

    // Отдельно управляем только профилем
    const [showProfile, setShowProfile] = useState(false);

    return (
        <div className="relative w-full h-screen bg-gradient-to-br from-blue-50 to-purple-50 overflow-hidden flex flex-col">
            {/* Хедер сверху с кнопкой профиля */}
            <Header onProfileClick={() => setShowProfile(true)} />

            {/* Главный экран */}
            <MainScreen onStartTests={() => setShowTests(true)} />

            {/* Модалка выбора теста */}
            {showTests && (
                <TestSelectionModal
                    tests={availableTests}
                    onSelectTest={startTest}
                    onClose={() => setShowTests(false)}
                />
            )}

            {/* Модалка с вопросами текущего теста */}
            {currentTest && !showResults && (
                <TestQuestionModal
                    test={currentTest}
                    currentQuestionIndex={currentQuestion}
                    onAnswer={answerQuestion}
                    onClose={resetTest}
                />
            )}

            {/* Модалка с результатами */}
            {showResults && (
                <TestResultModal
                    resultText={getTestResult()}
                    onRestart={() => {
                        resetTest();
                        setShowTests(true); // после результата показываем выбор теста
                    }}
                />
            )}

            {/* Модалка профиля */}
            {showProfile && (
                <ProfileModal onClose={() => setShowProfile(false)} />
            )}
        </div>
    );
}