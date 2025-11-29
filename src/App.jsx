// src/App.jsx

import React, {useState} from "react";

import {availableTests} from "./data/tests";
import {useTestEngine} from "./hooks/useTestEngine";

import {Header} from "./components/layout/Header";
import {MainScreen} from "./components/MainScreen";
import {TestSelectionModal} from "./components/test/TestSelectionModal";
import {TestQuestionModal} from "./components/test/TestQuestionModal";
import {TestResultModal} from "./components/test/TestResultModal";
import {ProfileModal} from "./components/profile/ProfileModal";

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

    const [showProfile, setShowProfile] = useState(false);

    return (
        <div
            className="
      relative w-full h-screen
      bg-gradient-to-br from-blue-50 to-purple-50
      overflow-hidden flex flex-col
      pt-24
    "
        >
            <Header onProfileClick={() => setShowProfile(true)} />

            <MainScreen onStartTests={() => setShowTests(true)} />

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
                        setShowTests(true);
                    }}
                />
            )}

            {showProfile && (
                <ProfileModal onClose={() => setShowProfile(false)} />
            )}
        </div>
    );
}
