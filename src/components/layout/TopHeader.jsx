// src/components/layout/TopHeader.jsx
import React from "react";
import {useTranslation} from "../../i18n";

export function TopHeader({onOpenProfile}) {
    const {t, lang, setLang} = useTranslation();

    const toggleLang = () => {
        setLang(lang === "ru" ? "en" : "ru");
    };

    return (
        <header className="mb-4 flex items-center justify-between">
            <div className="flex items-center gap-3">
                {/* лого IC как у тебя было */}
                <div
                    className="w-10 h-10 rounded-2xl bg-gradient-to-br from-purple-500 to-indigo-500 flex items-center justify-center text-white font-bold text-sm shadow-lg">
                    IC
                </div>
                <div>
                    <div className="text-sm font-semibold text-gray-900">
                        {t("header.title")}
                    </div>
                    <div className="text-[11px] text-gray-500">
                        {t("header.subtitle")}
                    </div>
                </div>
            </div>

            <div className="flex items-center gap-2">
                {/* кнопка смены языка */}
                <button
                    onClick={toggleLang}
                    className="px-2 py-1 rounded-xl bg-white/60 border border-white/80 text-xs text-gray-700 hover:bg-white shadow-sm"
                >
                    {lang === "ru" ? "EN" : "RU"}
                </button>

                {/* кнопка кабинета как у тебя было */}
                <button
                    onClick={onOpenProfile}
                    className="px-3 py-1.5 rounded-xl bg-white/70 border border-white/80 text-xs text-gray-700 shadow-sm hover:bg-white"
                >
                    👤
                </button>
            </div>
        </header>
    );
}
