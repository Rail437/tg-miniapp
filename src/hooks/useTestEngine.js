// src/hooks/useTestEngine.js
import {useState} from "react";
import {apiClient} from "../api/apiClient";

export function useTestEngine(userId) {
    const [showTests, setShowTests] = useState(false);
    const [showResults, setShowResults] = useState(false);

    const [currentTest, setCurrentTest] = useState(null);
    const [currentQuestion, setCurrentQuestion] = useState(0);
    const [sessionId, setSessionId] = useState(null);
    const [resultData, setResultData] = useState(null);

    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);

    const startTest = async (test) => {
        if (!userId) {
            setError("Пользователь ещё не инициализирован. Попробуйте через пару секунд.");
            return;
        }

        setIsLoading(true);
        setError(null);

        try {
            const res = await apiClient.startMainTest(userId);
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

    const answerQuestion = async (answer) => {
        if (!sessionId || !currentTest) return;

        setIsLoading(true);
        setError(null);

        try {
            const answerValue = answer;

            const res = await apiClient.answerMainTest({
                sessionId,
                questionIndex: currentQuestion,
                answerValue,
            });

            if (res.status === "COMPLETED") {
                const result = await apiClient.completeMainTest(sessionId);
                setResultData(result);
                setShowResults(true);
            } else {
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

    const resetTest = () => {
        setShowTests(false);
        setShowResults(false);
        setCurrentTest(null);
        setCurrentQuestion(0);
        setSessionId(null);
        setResultData(null);
        setError(null);
    };

    const getTestResult = () => {
        if (!resultData) return "";
        const label = resultData.label || "Ваш результат";
        const desc = resultData.description ? ` — ${resultData.description}` : "";
        return `${label}${desc}`;
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
        resultData, // 👈 добавили наружу
    };
}
