import React, { useState } from "react";
import { useTranslation } from "../i18n";

export const StoriesSection = () => {
    const { t } = useTranslation();
    const [story, setStory] = useState("");
    const [submitted, setSubmitted] = useState(false);

    const handleSubmit = (e) => {
        e.preventDefault();
        if (story.trim()) {
            setSubmitted(true);
            setStory("");
            setTimeout(() => setSubmitted(false), 2000);
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
                        />
                        <button
                            type="submit"
                            disabled={!story.trim()}
                            className="w-full mt-3 py-2.5 bg-blue-600 text-white rounded-xl text-sm font-semibold hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {t("storiesSection.button")}
                        </button>
                    </form>
                )}
            </div>
        </div>
    );
};
