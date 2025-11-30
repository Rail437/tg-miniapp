// src/components/layout/TopHeader.jsx
import React from "react";

export function TopHeader({ onOpenProfile }) {
    return (
        <header className="mb-3">
            <div className="flex items-center justify-between rounded-2xl bg-white/70 backdrop-blur-xl border border-white/60 shadow-sm px-4 py-2.5">

                {/* Логотип + текст */}
                <div className="flex items-center gap-2">
                    <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-500 rounded-xl flex items-center justify-center text-white text-xs font-bold shadow-md">
                        IC
                    </div>

                    <div className="flex flex-col">
                        <span className="text-sm font-semibold text-gray-900">INNER CODE</span>
                        <span className="text-[11px] text-gray-500">узнавай код своей личности</span>
                    </div>
                </div>

                {/* Кнопка профиля */}
                <button
                    onClick={onOpenProfile}
                    className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/80 border border-white/70 shadow-sm text-sm text-gray-700 hover:shadow-md hover:-translate-y-0.5 transition-all"
                >
          <span className="w-6 h-6 rounded-full bg-gradient-to-r from-blue-500 to-purple-500 flex items-center justify-center text-white text-xs">
            👤
          </span>
                    <span className="hidden sm:inline font-medium">Профиль</span>
                </button>

            </div>
        </header>
    );
}
