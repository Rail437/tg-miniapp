import React, { useState } from "react";

export const StoriesSection = () => {
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
        <div className="max-w-2xl mx-auto">
            <div className="bg-white rounded-2xl p-6 shadow-lg">
                <h2 className="text-2xl font-bold mb-4 text-center text-gray-800">Поделитесь своей историей</h2>
                <p className="text-gray-600 text-center mb-6">
                    Расскажите о важном для вас событии. Ваша история может помочь другим почувствовать, что они не одни.
                </p>

                {submitted ? (
                    <div className="text-center py-8">
                        <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                            <span className="text-2xl">✓</span>
                        </div>
                        <p className="text-lg text-gray-700">Спасибо! Ваша история отправлена анонимно.</p>
                    </div>
                ) : (
                    <form onSubmit={handleSubmit}>
            <textarea
                value={story}
                onChange={(e) => setStory(e.target.value)}
                placeholder="Напишите здесь свою историю..."
                className="w-full h-48 p-4 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
            />
                        <button
                            type="submit"
                            disabled={!story.trim()}
                            className="w-full mt-4 py-3 bg-blue-600 text-white rounded-xl font-semibold shadow-md hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            Отправить анонимно
                        </button>
                    </form>
                )}
            </div>
        </div>
    );
};