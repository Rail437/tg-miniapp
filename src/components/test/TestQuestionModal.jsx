// src/components/test/TestQuestionModal.jsx

import React from "react";

export function TestQuestionModal({
                                      test,
                                      currentQuestionIndex,
                                      onAnswer,
                                      onClose,
                                  }) {
    const question = test.questions[currentQuestionIndex];
    const isLast = currentQuestionIndex === test.questions.length - 1;

    return (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center">
            <div className="bg-white rounded-3xl p-6 w-full max-w-md shadow-xl">
                <h2 className="text-xl font-semibold mb-2">{test.name}</h2>
                <p className="text-sm text-gray-500 mb-4">
                    Вопрос {currentQuestionIndex + 1} из {test.questions.length}
                </p>

                <p className="text-lg mb-6">{question}</p>

                <div className="flex gap-3 mb-4">
                    <button
                        onClick={() => onAnswer(true)}
                        className="flex-1 py-2 rounded-2xl bg-blue-600 text-white"
                    >
                        Скорее да
                    </button>
                    <button
                        onClick={() => onAnswer(false)}
                        className="flex-1 py-2 rounded-2xl bg-gray-100 text-gray-700"
                    >
                        Скорее нет
                    </button>
                </div>

                <button
                    onClick={onClose}
                    className="w-full py-2 rounded-2xl bg-gray-100 text-gray-700 text-sm"
                >
                    Прервать тест
                </button>
            </div>
        </div>
    );
}
