// src/components/test/TestResultModal.jsx

import React from "react";

export function TestResultModal({ resultText, onRestart }) {
    return (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center">
            <div className="bg-white rounded-3xl p-6 w-full max-w-md shadow-xl text-center">
                <h2 className="text-2xl font-semibold mb-4">Результат</h2>

                <p className="text-lg mb-6">{resultText}</p>

                <button
                    onClick={onRestart}
                    className="w-full py-2 rounded-2xl bg-blue-600 text-white mb-3"
                >
                    Пройти другой тест
                </button>
            </div>
        </div>
    );
}
