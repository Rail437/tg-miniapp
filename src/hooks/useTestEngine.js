// src/hooks/useTestEngine.js
import { useState } from "react";
import { apiClient } from "../api/apiClient";

// Хук теперь принимает userId, чтобы знать,
// от имени какого пользователя работать
export function useTestEngine(userId) {
    const [showTests, setShowTests] = useState(false);
    const [showResults, setShowResults] = useState(false);

    const [currentTest, setCurrentTest] = useState(null);
    const [currentQuestion, setCurrentQuestion] = useState(0);
    const [sessionId, setSessionId] = useState(null);
    const [resultData, setResultData] = useState(null);

    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);

    // Запуск теста: создаём сессию на "бэке" (пока моки),
    // запоминаем sessionId и стартовый шаг
    const startTest = async (test) => {
        if (!userId) {
            setError("Пользователь ещё не инициализирован. Попробуйте через пару секунд.");
            return;
        }

        setIsLoading(true);
        setError(null);

        try {
            // В моках это apiClient.startMainTest(userId),
            // в реале — тот же вызов, только на настоящий бэк
            const res = await apiClient.startMainTest(userId);
            // ожидаем { sessionId, currentStep, totalSteps }
            setSessionId(res.sessionId);
            setCurrentTest(test);
            setCurrentQuestion(res.currentStep ?? 0);
            setShowTests(false);
            setShowResults(false);
            setResultData(null);
        } catch (e) {
            console.error("startTest error", e);
            setError("Не удалось начать тест. Попробуйте ещё раз.");
        } finally {
            setIsLoading(false);
        }
    };

    // Отправка ответа на вопрос
    const answerQuestion = async (answer) => {
        if (!sessionId || !currentTest) return;

        setIsLoading(true);
        setError(null);

        try {
            // тут маппим true/false → число, чтобы и моки, и бэк могли одинаково считать
            const answerValue = answer ? 1 : 0;

            const res = await apiClient.answerMainTest({
                sessionId,
                questionIndex: currentQuestion,
                answerValue,
            });
            // ожидаем { status: "IN_PROGRESS" | "COMPLETED", nextStep }

            if (res.status === "COMPLETED") {
                // Завершаем тест и получаем результат
                const result = await apiClient.completeMainTest(sessionId);
                // ожидаем примерно: { typeId, label, description, ... }
                setResultData(result);
                setShowResults(true);
            } else {
                // Переходим к следующему вопросу
                setCurrentQuestion(
                    typeof res.nextStep === "number"
                        ? res.nextStep
                        : currentQuestion + 1
                );
            }
        } catch (e) {
            console.error("answerQuestion error", e);
            setError("Ошибка при отправке ответа. Попробуйте ещё раз.");
        } finally {
            setIsLoading(false);
        }
    };

    // Сброс состояния теста
    const resetTest = () => {
        setShowTests(false);
        setShowResults(false);
        setCurrentTest(null);
        setCurrentQuestion(0);
        setSessionId(null);
        setResultData(null);
        setError(null);
    };

    // Преобразуем результат в строку для старого интерфейса TestResultModal
    const getTestResult = () => {
        if (!resultData) return "";

        // Если есть label/description — красиво склеиваем,
        // чтобы не пришлось прямо сейчас переписывать модалку результата
        const label = resultData.label || "Ваш результат";
        const desc = resultData.description
            ? ` — ${resultData.description}`
            : "";

        return `${label}${desc}`;
    };

    return {
        // состояние показа модалок
        showTests,
        setShowTests,
        showResults,

        // текущий тест и шаг
        currentTest,
        currentQuestion,

        // действия
        startTest,
        answerQuestion,
        resetTest,
        getTestResult,

        // доп. состояния (на будущее)
        isLoading,
        error,
    };
}