import React from "react";

export const PsychologistSection = () => {
    return (
        <div className="max-w-3xl mx-auto">
            <div className="bg-white rounded-2xl p-6 shadow-lg text-center">
                <div className="w-32 h-32 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center mx-auto mb-6 text-white text-4xl">
                    👩‍⚕️
                </div>
                <h2 className="text-2xl font-bold mb-4 text-gray-800">Мария Юнусова</h2>
                <p className="text-gray-600 mb-6 max-w-2xl mx-auto">
                    Практикующий психолог и коуч. Помогаю находить внутренние ресурсы и строить гармоничную жизнь.
                </p>

                <div className="space-y-4">
                    <div>
                        <h3 className="font-semibold text-gray-800 mb-2">Подкаст</h3>
                        <a
                            href="#"
                            className="inline-block px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                        >
                            Слушать в Яндекс.Музыке
                        </a>
                    </div>

                    <div>
                        <h3 className="font-semibold text-gray-800 mb-2">Социальные сети</h3>
                        <div className="flex justify-center gap-4">
                            <a
                                href="#"
                                className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
                            >
                                Telegram
                            </a>
                            <a
                                href="#"
                                className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
                            >
                                Instagram
                            </a>
                            <a
                                href="#"
                                className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
                            >
                                VK
                            </a>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};