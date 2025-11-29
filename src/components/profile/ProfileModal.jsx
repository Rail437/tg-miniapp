// src/components/profile/ProfileModal.jsx

import React from "react";

export function ProfileModal({ onClose }) {
    return (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center">
            <div className="bg-white rounded-3xl p-6 w-full max-w-md shadow-xl">
                <h2 className="text-xl font-semibold mb-4">Профиль</h2>

                <p className="mb-4">Здесь будет информация о пользователе.</p>

                <button
                    onClick={onClose}
                    className="w-full py-2 rounded-2xl bg-blue-600 text-white"
                >
                    Закрыть
                </button>
            </div>
        </div>
    );
}
