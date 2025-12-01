// src/components/layout/TabNavigation.jsx
import React from "react";

export function TabNavigation({ activeTab, setActiveTab, hasMore }) {
    const tabs = [
        { id: "tests", name: "Тесты", icon: "🧠" },
        { id: "profile", name: "Кабинет", icon: "👤" },
    ];

    // Третий таб показываем только если человек уже прошёл тест
    if (hasMore) {
        tabs.push({ id: "more", name: "Дополнительно", icon: "✨" });
    }

    return (
        <nav className="mb-4">
            <div className="rounded-2xl bg-white/70 backdrop-blur-xl border border-white/60 px-2 py-1.5 overflow-x-auto">
                <div className="flex space-x-1 min-w-max">
                    {tabs.map((tab) => (
                        <button
                            key={tab.id}
                            onClick={() => setActiveTab(tab.id)}
                            className={`flex items-center gap-1.5 px-3 py-1.5 text-xs sm:text-sm rounded-full whitespace-nowrap transition-all ${
                                activeTab === tab.id
                                    ? "bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-md"
                                    : "text-gray-600 hover:bg-gray-100/80"
                            }`}
                        >
                            <span>{tab.icon}</span>
                            <span className="font-medium">{tab.name}</span>
                        </button>
                    ))}
                </div>
            </div>
        </nav>
    );
}
