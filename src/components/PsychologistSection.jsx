import React from "react";
import { useTranslation } from "../i18n";

export const PsychologistSection = () => {
    const { t, lang } = useTranslation();

    return (
        <div className="max-w-3xl mx-auto">
            <div className="bg-white rounded-2xl p-6 shadow-lg text-center">
                <div className="w-32 h-32 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-full flex items-center justify-center mx-auto mb-6 text-white text-4xl">
                    👩‍⚕️
                </div>

                <h2 className="text-2xl font-bold mb-2 text-gray-800">
                    {t("psychologist.name")}
                </h2>
                <p className="text-sm text-gray-500 mb-4">
                    {t("psychologist.title")}
                </p>

                <p className="text-gray-600 mb-6 max-w-2xl mx-auto text-sm leading-relaxed">
                    {t("psychologist.intro")}
                </p>

                <div className="space-y-5 text-left">
                    {/* Блок 1 — О подходе */}
                    <div>
                        <h3 className="text-base font-semibold text-gray-800 mb-1">
                            {t("psychologist.block1Title")}
                        </h3>
                        <p className="text-sm text-gray-600 leading-relaxed">
                            {t("psychologist.block1Text")}
                        </p>
                    </div>

                    {/* Блок 2 — С чем работаю */}
                    <div>
                        <h3 className="text-base font-semibold text-gray-800 mb-1">
                            {t("psychologist.block2Title")}
                        </h3>
                        <ul className="list-disc list-inside text-sm text-gray-600 space-y-1">
                            <li>{t("psychologist.block2Item1")}</li>
                            <li>{t("psychologist.block2Item2")}</li>
                            <li>{t("psychologist.block2Item3")}</li>
                        </ul>
                    </div>

                    {/* Блок 3 — Формат работы */}
                    <div>
                        <h3 className="text-base font-semibold text-gray-800 mb-1">
                            {t("psychologist.block3Title")}
                        </h3>
                        <p className="text-sm text-gray-600 leading-relaxed">
                            {t("psychologist.block3Text")}
                        </p>
                    </div>

                    {/* Контакты */}
                    <div className="pt-3 border-t border-gray-100 mt-2">
                        <h3 className="text-base font-semibold text-gray-800 mb-1 text-center">
                            {t("psychologist.contactsTitle")}
                        </h3>
                        <p className="text-xs text-gray-500 mb-3 text-center">
                            {t("psychologist.contactsSubtitle")}
                        </p>

                        <div className="flex flex-wrap justify-center gap-2">
                            <a
                                href="https://t.me/mary_yunes"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-semibold hover:bg-blue-700 transition-colors"
                            >
                                {t("psychologist.telegramCta")}
                            </a>
                            <a
                                href="https://vk.com/club212397789"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-semibold hover:bg-blue-700 transition-colors"
                            >
                                {t("psychologist.vkCta")}
                            </a>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};
