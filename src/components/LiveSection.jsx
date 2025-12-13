import React from "react";

export const LiveSection = () => {
    return (
        <div className="space-y-4">
            <h2 className="text-xl font-bold text-gray-900">
                Live
            </h2>

            <div className="bg-white/80 border border-white/80 rounded-2xl p-4 text-sm text-gray-700">
                Этот раздел доступен ограниченному кругу пользователей.
                <br />
                В ближайшее время здесь появится live-контент.
            </div>
        </div>
    );
};