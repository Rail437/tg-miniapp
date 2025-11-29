// src/components/test/TestSelectionModal.jsx

import React from "react";

export function TestSelectionModal({ tests, onSelectTest, onClose }) {
    return (
        // Полупрозрачный фон
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center">
            {/* Само модальное окно */}
            <div className="bg-white rounded-3xl p-6 w-full max-w-md shadow-xl">
                <h2 className="text-xl font-semibold mb-4">Выберите тест</h2>

                <div className="space-y-3 mb-4">
                    {tests.map((test) => (
                        <button
                            key={test.id}
                            onClick={() => onSelectTest(test)}
                            className="w-full text-left border rounded-2xl p-3 hover:bg-gray-50"
                        >
                            <div className="font-medium">{test.name}</div>
                            <div className="text-sm text-gray-500">
                                {test.description}
                            </div>
                        </button>
                    ))}
                </div>

                <button
                    onClick={onClose}
                    className="w-full py-2 rounded-2xl bg-gray-100 text-gray-700"
                >
                    Отмена
                </button>
            </div>
        </div>
    );
}
