// src/hooks/useTestEngine.js

import { useState } from "react";

// Это "кастомный хук" — просто функция, которая использует useState
// и возвращает тебе набор переменных и функций.
// Его задача — инкапсулировать всю логику работы с тестами: состояние и бизнес-правила.

export function useTestEngine() {
    // Показать ли модалку выбора теста
    const [showTests, setShowTests] = useState(false);

    // Показать ли модалку с результатами
    const [showResults, setShowResults] = useState(false);

    // Текущий выбранный тест (объект из availableTests или null)
    const [currentTest, setCurrentTest] = useState(null);

    // Индекс текущего вопроса в тесте
    const [currentQuestion, setCurrentQuestion] = useState(0);

    // Ответы пользователя — массив из true/false
    const [answers, setAnswers] = useState([]);

    // Начать прохождение конкретного теста
    const startTest = (test) => {
        setCurrentTest(test);
        setCurrentQuestion(0);
        setAnswers([]);
        setShowTests(false);   // прячем модалку выбора теста
        setShowResults(false); // и модалку результата, если она была
    };

    // Пользователь ответил на вопрос (answer: true/false)
    const answerQuestion = (answer) => {
        const newAnswers = [...answers, answer];
        setAnswers(newAnswers);

        // Если ещё есть вопросы — идём к следующему
        if (currentTest && currentQuestion + 1 < currentTest.questions.length) {
            setCurrentQuestion(currentQuestion + 1);
        } else {
            // Иначе тест завершён, показываем результаты
            setShowResults(true);
        }
    };

    // Сбросить тест полностью (например, при выходе или начале заново)
    const resetTest = () => {
        setShowResults(false);
        setCurrentTest(null);
        setAnswers([]);
        setCurrentQuestion(0);
    };

    // Посчитать результат теста в виде текста
    const getTestResult = () => {
        if (!currentTest) return "";

        // Простейшая "метрика": считаем количество ответов true
        const score = answers.reduce(
            (sum, answer) => sum + (answer ? 1 : 0),
            0
        );

        if (currentTest.id === 1) {
            // Тест "Интроверт vs Экстраверт"
            if (score >= 3) return "Вы - Экстраверт";
            else if (score >= 2) return "Вы - Амбиверт";
            else return "Вы - Интроверт";
        } else if (currentTest.id === 2) {
            // Тест "Уровень стресса"
            if (score >= 3) return "Высокий уровень стресса";
            else if (score >= 2) return "Средний уровень стресса";
            else return "Низкий уровень стресса";
        }

        // На будущее: для неизвестных тестов можно вернуть что-то нейтральное
        return "Результат теста готов";
    };

    // Всё, что мы возвращаем отсюда, будет доступно в App.jsx
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
