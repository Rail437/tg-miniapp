// src/hooks/useTestEngine.js

import { useState } from "react";

export function useTestEngine() {
    const [showTests, setShowTests] = useState(false);
    const [showResults, setShowResults] = useState(false);
    const [currentTest, setCurrentTest] = useState(null);
    const [currentQuestion, setCurrentQuestion] = useState(0);
    const [answers, setAnswers] = useState([]);

    const startTest = (test) => {
        setCurrentTest(test);
        setCurrentQuestion(0);
        setAnswers([]);
        setShowTests(false);
        setShowResults(false);
    };

    const answerQuestion = (answer) => {
        if (!currentTest) return;

        const newAnswers = [...answers, answer];
        setAnswers(newAnswers);

        if (currentQuestion + 1 < currentTest.questions.length) {
            setCurrentQuestion(currentQuestion + 1);
        } else {
            // Тест закончился — показываем результат
            setShowResults(true);
        }
    };

    const resetTest = () => {
        setShowTests(false);
        setShowResults(false);
        setCurrentTest(null);
        setCurrentQuestion(0);
        setAnswers([]);
    };

    const getTestResult = () => {
        if (!currentTest) return "";

        const score = answers.reduce(
            (sum, answer) => sum + (answer ? 1 : 0),
            0
        );

        // Пока простая логика, как раньше
        if (currentTest.id === 1) {
            if (score >= 3) return "Вы — Экстраверт";
            if (score >= 2) return "Вы — Амбиверт";
            return "Вы — Интроверт";
        }

        if (currentTest.id === 2) {
            if (score >= 3) return "Высокий уровень стресса";
            if (score >= 2) return "Средний уровень стресса";
            return "Низкий уровень стресса";
        }

        // Заглушка для будущих тестов
        return "Результат будет скоро доступен";
    };

    return {
        showTests,
        setShowTests,
        showResults,
        currentTest,
        currentQuestion,
        startTest,
        answerQuestion,
        resetTest,
        getTestResult,
    };
}
