import React, { useState } from "react";
import { useTranslation } from "../i18n";
import { apiClient } from "../api/apiClient";

export const StoriesSection = ({ userId }) => {
    const { t } = useTranslation();
    const [story, setStory] = useState("");
    const [submitted, setSubmitted] = useState(false);
    const [isSending, setIsSending] = useState(false);
    const [error, setError] = useState("");

    const handleSubmit = async (e) => {
        e.preventDefault();

        const text = story.trim();
        if (!text) return;

        try {
            setIsSending(true);
            setError("");

            // ✅ ВОТ ТУТ РЕАЛЬНЫЙ ВЫЗОВ ОТПРАВКИ НА БЭК
            await apiClient.submitStory({ userId, text });

            setSubmitted(true);
            setStory("");
            setTimeout(() => setSubmitted(false), 2000);
        } catch (err) {
            console.error("submitStory error", err);
            setError(t("storiesSection.error") || "Не удалось отправить историю. Попробуйте ещё раз.");
        } finally {
            setIsSending(false);
        }
    };

    return (
        <div className="max-w-xl mx-auto">
            <div className="bg-white rounded-2xl p-5 shadow-lg">
                <h2 className="text-lg font-bold text-gray-900 mb-1">
                    {t("storiesSection.title")}
                </h2>
                <p className="text-xs text-gray-500 mb-4">
                    {t("storiesSection.subtitle")}
                </p>

                {error && (
                    <div className="mb-3 text-xs text-red-600">
                        {error}
                    </div>
                )}

                {submitted ? (
                    <div className="text-center text-green-600 font-semibold text-sm py-6">
                        {t("storiesSection.success")}
                    </div>
                ) : (
                    <form onSubmit={handleSubmit}>
            <textarea
                value={story}
                onChange={(e) => setStory(e.target.value)}
                placeholder={t("storiesSection.placeholder")}
                className="w-full h-40 p-3 border border-gray-300 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                disabled={isSending}
            />
                        <button
                            type="submit"
                            disabled={!story.trim() || isSending}
                            className="w-full mt-3 py-2.5 bg-blue-600 text-white rounded-xl text-sm font-semibold hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {isSending ? (t("storiesSection.sending") || "Отправляем…") : t("storiesSection.button")}
                        </button>
                    </form>
                )}
            </div>
        </div>
    );
};
