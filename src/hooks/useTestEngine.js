// src/hooks/useTestEngine.js
import { useState } from "react";
import { apiClient } from "../api/apiClient";
import { testTexts } from "../data/testTexts";

export function useTestEngine(userId) {
    const [showTests, setShowTests] = useState(false);
    const [showResults, setShowResults] = useState(false);

    const [currentTest, setCurrentTest] = useState(null);
    const [currentQuestion, setCurrentQuestion] = useState(0);
    const [totalQuestions, setTotalQuestions] = useState(0);

    const [sessionId, setSessionId] = useState(null);
    const [resultData, setResultData] = useState(null);

    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);

    // --- Вспомогательное: для главного теста считаем кол-во вопросов ---
    function calcTotalQuestions(test) {
        if (!test) return 0;

        // Берём ru как "каноничный" язык — длина массивов в ru/en одинаковая
        const ruBlock = testTexts["ru"]?.[test.i18nKey];
        if (ruBlock && Array.isArray(ruBlock.questions)) {
            return ruBlock.questions.length;
        }

        // fallback: попробуем взять из самого теста
        const ruFromTest = test.questions?.ru;
        if (Array.isArray(ruFromTest)) {
            return ruFromTest.length;
        }

        return 0;
    }

    // --- Старт теста ---
    const startTest = async (test) => {
        setCurrentTest(test);
        setCurrentQuestion(0);
        setShowResults(false);
        setResultData(null);
        setError(null);

        const questionsCount = calcTotalQuestions(test);
        setTotalQuestions(questionsCount);

        // Если это наш главный тест и есть userId — создаём сессию на бэке
        if (test.id === "main_socionic" && userId) {
            try {
                setIsLoading(true);
                const res = await apiClient.startMainTest(userId);
                // ожидаем что бэк вернёт sessionId
                setSessionId(res.sessionId);
            } catch (e) {
                console.error("startMainTest error", e);
                setError("Не удалось начать тест. Попробуйте ещё раз.");
            } finally {
                setIsLoading(false);
            }
        }

        setShowTests(false);
    };

    // --- Ответ на вопрос ---
    const answerQuestion = async (answer) => {
        if (!currentTest) return;

        const isLastQuestion =
            totalQuestions > 0 && currentQuestion >= totalQuestions - 1;

        setIsLoading(true);
        setError(null);

        try {
            // Если хотим всё же слать ответы по ходу теста — шлём, но
            // ответ БЭКА ПОЛНОСТЬЮ ИГНОРИРУЕМ
            if (currentTest.id === "main_socionic" && sessionId) {
                try {
                    await apiClient.answerMainTest({
                        sessionId,
                        questionIndex: currentQuestion,
                        answerValue: answer ? 1 : 0,
                    });
                } catch (e) {
                    // Логируем, но не ломаем UX
                    console.error("answerMainTest error (ignored)", e);
                }
            }

            if (isLastQuestion) {
                // ❗️Вот тут наша новая логика:
                // тест закончился -> отправляем запрос на сохранение результата
                let result = null;

                if (currentTest.id === "main_socionic" && sessionId) {
                    try {
                        result = await apiClient.completeMainTest(sessionId);
                    } catch (e) {
                        console.error("completeMainTest error", e);
                        setError(
                            "Не удалось сохранить результат. Попробуйте позже."
                        );
                    }
                }

                if (result) {
                    setResultData(result);
                }

                setShowResults(true);
            } else {
                // Просто идём на следующий вопрос, никакой проверки ответа бэка
                setCurrentQuestion((q) => q + 1);
            }
        } finally {
            setIsLoading(false);
        }
    };

    // --- Получение последнего результата (для профиля и т.п.) ---
    const getTestResult = async () => {
        if (!userId) return null;
        try {
            setIsLoading(true);
            const res = await apiClient.getLastResult(userId);
            setResultData(res);
            return res;
        } catch (e) {
            console.error("getLastResult error", e);
            setError("Не удалось загрузить результат.");
            return null;
        } finally {
            setIsLoading(false);
        }
    };

    // --- Сброс ---
    const resetTest = () => {
        setShowTests(false);
        setShowResults(false);
        setCurrentTest(null);
        setCurrentQuestion(0);
        setTotalQuestions(0);
        setSessionId(null);
        setResultData(null);
        setError(null);
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
        isLoading,
        error,
        resultData,
    };
}