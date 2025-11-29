// src/components/layout/Header.jsx

import React from "react";

// Простой хедер сверху.
// Принимает проп onProfileClick — функция, которую зовёт при клике на кнопку.

export function Header({ onProfileClick }) {
    return (
        <header className="h-16 flex items-center justify-end px-4">
            <button
                onClick={onProfileClick}
                className="px-4 py-2 bg-white rounded-2xl shadow-lg flex items-center gap-2 hover:scale-105 transition-transform"
            >
        <span className="w-6 h-6 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center text-white text-sm">
          👤
        </span>
                Профиль
            </button>
        </header>
    );
}
