import React from "react";
import { useState, useEffect } from "react";
import { motion } from "framer-motion";

export default function App() {
    const [showTests, setShowTests] = useState(false);
    const [showResults, setShowResults] = useState(false);
    const [showProfile, setShowProfile] = useState(false);
    const [currentTest, setCurrentTest] = useState(null);
    const [currentQuestion, setCurrentQuestion] = useState(0);
    const [answers, setAnswers] = useState([]);

    const availableTests = [
        {
            id: 1,
            name: "Интроверт vs Экстраверт",
            description: "Определите свой тип личности",
            questions: [
                "Я предпочитаю проводить время в одиночестве",
                "Мне нравится быть в центре внимания",
                "Большие компании меня утомляют",
                "Я легко знакомлюсь с новыми людьми"
            ]
        },
        {
            id: 2,
            name: "Уровень стресса",
            description: "Оцените ваше текущее состояние",
            questions: [
                "Я часто чувствую напряжение",
                "Мне трудно расслабиться",
                "Я хорошо справляюсь со стрессом",
                "Мне снятся тревожные сны"
            ]
        }
    ];

    const startTest = (test) => {
        setCurrentTest(test);
        setCurrentQuestion(0);
        setAnswers([]);
        setShowTests(false);
    };

    const answerQuestion = (answer) => {
        const newAnswers = [...answers, answer];
        setAnswers(newAnswers);

        if (currentQuestion + 1 < currentTest.questions.length) {
            setCurrentQuestion(currentQuestion + 1);
        } else {
            // Тест завершен
            setShowResults(true);
        }
    };

    const getTestResult = () => {
        if (!currentTest) return "";

        const score = answers.reduce((sum, answer) => sum + (answer ? 1 : 0), 0);

        if (currentTest.id === 1) {
            // Тест на интроверсию/экстраверсию
            if (score >= 3) return "Вы - Экстраверт";
            else if (score >= 2) return "Вы - Амбиверт";
            else return "Вы - Интроверт";
        } else {
            // Тест на стресс
            if (score >= 3) return "Высокий уровень стресса";
            else if (score >= 2) return "Средний уровень стресса";
            else return "Низкий уровень стресса";
        }
    };

    return (
        <div className="relative w-full h-screen bg-gradient-to-br from-blue-50 to-purple-50 overflow-hidden flex items-center justify-center">
            {/* Кнопка профиля в правом верхнем углу */}
            <button
                onClick={() => setShowProfile(true)}
                className="absolute top-6 right-6 px-4 py-2 bg-white rounded-2xl shadow-lg flex items-center gap-2 hover:scale-105 transition-transform"
            >
        <span className="w-6 h-6 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center text-white text-sm">
          👤
        </span>
                Профиль
            </button>

            {/* Главный экран */}
            <div className="flex flex-col items-center select-none text-center px-6">
                <motion.div
                    className="relative mb-8"
                    animate={{
                        y: [0, -10, 0],
                        rotate: [0, 5, -5, 0]
                    }}
                    transition={{ duration: 4, repeat: Infinity }}
                >
                    <div className="w-24 h-24 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center text-white text-4xl shadow-xl">
                        🧠
                    </div>
                </motion.div>

                <motion.h1
                    className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-4"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                >
                    ПсихоТесты
                </motion.h1>

                <motion.p
                    className="text-lg text-gray-600 mb-8 max-w-md"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.4 }}
                >
                    Откройте новые грани своей личности с помощью профессиональных психологических тестов
                </motion.p>

                <motion.button
                    onClick={() => setShowTests(true)}
                    className="px-8 py-4 bg-gradient-to-r from-blue-500 to-purple-500 text-white rounded-2xl shadow-lg hover:shadow-xl transition-all hover:scale-105 text-lg font-semibold"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.6 }}
                >
                    Начать тестирование
                </motion.button>

                <motion.div
                    className="mt-8 text-gray-500 flex gap-6"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.8 }}
                >
                    <div className="text-center">
                        <div className="text-2xl font-bold text-blue-500">10+</div>
                        <div className="text-sm">тестов</div>
                    </div>
                    <div className="text-center">
                        <div className="text-2xl font-bold text-purple-500">95%</div>
                        <div className="text-sm">точность</div>
                    </div>
                    <div className="text-center">
                        <div className="text-2xl font-bold text-green-500">5 мин</div>
                        <div className="text-sm">время</div>
                    </div>
                </motion.div>
            </div>

            {/* Модальное окно выбора тестов */}
            {showTests && (
                <div className="absolute inset-0 bg-black/40 backdrop-blur flex items-center justify-center p-4">
                    <motion.div
                        className="bg-white rounded-3xl w-full max-w-md p-6 shadow-xl"
                        initial={{ scale: 0.9, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                    >
                        <h2 className="text-2xl font-bold mb-4 text-center">Выберите тест</h2>

                        <div className="space-y-4 max-h-80 overflow-y-auto">
                            {availableTests.map((test) => (
                                <motion.div
                                    key={test.id}
                                    className="p-4 bg-gray-50 rounded-xl border-2 border-transparent hover:border-blue-300 cursor-pointer transition-all"
                                    whileHover={{ scale: 1.02 }}
                                    onClick={() => startTest(test)}
                                >
                                    <div className="font-bold text-lg text-gray-800">{test.name}</div>
                                    <div className="text-sm text-gray-600 mt-1">{test.description}</div>
                                    <div className="text-xs text-gray-500 mt-2">{test.questions.length} вопросов</div>
                                </motion.div>
                            ))}
                        </div>

                        <button
                            onClick={() => setShowTests(false)}
                            className="mt-6 w-full py-3 bg-gray-100 text-gray-600 rounded-xl hover:bg-gray-200 transition-colors"
                        >
                            Назад
                        </button>
                    </motion.div>
                </div>
            )}

            {/* Окно прохождения теста */}
            {currentTest && !showResults && (
                <div className="absolute inset-0 bg-black/40 backdrop-blur flex items-center justify-center p-4">
                    <motion.div
                        className="bg-white rounded-3xl w-full max-w-md p-6 shadow-xl"
                        initial={{ scale: 0.9, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                    >
                        <div className="flex justify-between items-center mb-6">
                            <h2 className="text-xl font-bold">{currentTest.name}</h2>
                            <div className="text-sm text-gray-500">
                                {currentQuestion + 1}/{currentTest.questions.length}
                            </div>
                        </div>

                        <div className="mb-2">
                            <div className="w-full bg-gray-200 rounded-full h-2">
                                <div
                                    className="bg-blue-500 h-2 rounded-full transition-all"
                                    style={{ width: `${((currentQuestion + 1) / currentTest.questions.length) * 100}%` }}
                                ></div>
                            </div>
                        </div>

                        <h3 className="text-lg font-semibold mb-6 text-center">
                            {currentTest.questions[currentQuestion]}
                        </h3>

                        <div className="space-y-3">
                            <button
                                onClick={() => answerQuestion(true)}
                                className="w-full py-4 bg-green-500 text-white rounded-xl hover:bg-green-600 transition-colors font-semibold"
                            >
                                Да, согласен
                            </button>
                            <button
                                onClick={() => answerQuestion(false)}
                                className="w-full py-4 bg-red-500 text-white rounded-xl hover:bg-red-600 transition-colors font-semibold"
                            >
                                Нет, не согласен
                            </button>
                        </div>
                    </motion.div>
                </div>
            )}

            {/* Окно результатов */}
            {showResults && (
                <div className="absolute inset-0 bg-black/40 backdrop-blur flex items-center justify-center p-4">
                    <motion.div
                        className="bg-white rounded-3xl w-full max-w-md p-6 shadow-xl text-center"
                        initial={{ scale: 0.9, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                    >
                        <div className="w-16 h-16 bg-green-500 rounded-full flex items-center justify-center text-white text-2xl mx-auto mb-4">
                            ✓
                        </div>

                        <h2 className="text-2xl font-bold mb-2">Тест завершен!</h2>
                        <div className="text-lg font-semibold text-blue-600 mb-4">
                            {getTestResult()}
                        </div>

                        <p className="text-gray-600 mb-6">
                            Спасибо за прохождение теста! Ваши результаты помогут лучше понять себя.
                        </p>

                        <button
                            onClick={() => {
                                setShowResults(false);
                                setCurrentTest(null);
                            }}
                            className="w-full py-3 bg-blue-500 text-white rounded-xl hover:bg-blue-600 transition-colors"
                        >
                            Пройти другой тест
                        </button>
                    </motion.div>
                </div>
            )}

            {/* Модальное окно профиля */}
            {showProfile && (
                <div className="absolute inset-0 bg-black/40 backdrop-blur flex items-center justify-center p-4">
                    <motion.div
                        className="bg-white rounded-3xl w-full max-w-sm p-6 shadow-xl"
                        initial={{ scale: 0.9, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                    >
                        <h2 className="text-2xl font-bold mb-4 text-center">Профиль</h2>

                        <div className="space-y-4">
                            <div className="flex justify-center">
                                <div className="w-20 h-20 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center text-white text-2xl">
                                    👤
                                </div>
                            </div>

                            <div className="bg-gray-50 rounded-xl p-4 space-y-3">
                                <div className="flex justify-between">
                                    <span className="text-gray-600">Пройдено тестов:</span>
                                    <span className="font-bold">2</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-gray-600">Последний тест:</span>
                                    <span className="font-bold">Сегодня</span>
                                </div>
                            </div>
                        </div>

                        <button
                            onClick={() => setShowProfile(false)}
                            className="mt-6 w-full py-3 bg-gray-100 text-gray-600 rounded-xl hover:bg-gray-200 transition-colors"
                        >
                            Закрыть
                        </button>
                    </motion.div>
                </div>
            )}
        </div>
    );
}