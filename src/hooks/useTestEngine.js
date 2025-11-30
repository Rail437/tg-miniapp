import { useState } from "react";
import { availableTests } from "../data/availableTests";

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
        const newAnswers = [...answers, answer];
        setAnswers(newAnswers);

        if (currentTest && currentQuestion + 1 < currentTest.questions.length) {
            setCurrentQuestion(currentQuestion + 1);
        } else {
            setShowResults(true);
        }
    };

    const resetTest = () => {
        setShowResults(false);
        setCurrentTest(null);
        setAnswers([]);
        setCurrentQuestion(0);
    };

    const getTestResult = () => {
        if (!currentTest) return "";

        const score = answers.reduce((sum, answer) => sum + (answer ? 1 : 0), 0);

        if (currentTest.id === 1) {
            if (score >= 3) return "Вы - Экстраверт";
            else if (score >= 2) return "Вы - Амбиверт";
            else return "Вы - Интроверт";
        } else if (currentTest.id === 2) {
            if (score >= 3) return "Высокий уровень стресса";
            else if (score >= 2) return "Средний уровень стресса";
            else return "Низкий уровень стресса";
        }

        return "Результат теста готов";
    };

    return {
        showTests,
        setShowTests,
        showResults,
        currentTest,
        currentQuestion,
        answers,
        startTest,
        answerQuestion,
        resetTest,
        getTestResult,
    };
}