// src/components/InsightsSection.jsx
import React, {useState} from "react";
import {AnimatePresence, motion} from "framer-motion";
import {useTranslation} from "../i18n";
import {PsychologistSection} from "./PsychologistSection";
import {StoriesSection} from "./StoriesSection";
import {CompatibilitySection} from "./compatibility/CompatibilitySection";

export default function InsightsSection({lastResult, userId, compatibilityEnabled}) {
    const {t} = useTranslation();

    const [showStoryModal, setShowStoryModal] = useState(false);
    const [showAuthorModal, setShowAuthorModal] = useState(false);

    return (
        <div className="space-y-3">
            {compatibilityEnabled && (
                <CompatibilitySection
                    userId={userId}
                    lastResult={lastResult}
                    compatibilityEnabled={compatibilityEnabled}
                />
            )}

            {/* Истории */}
            <button
                onClick={() => setShowStoryModal(true)}
                className="w-full p-4 rounded-2xl bg-white/70 backdrop-blur-md shadow-md text-left"
            >
                <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-emerald-500 to-teal-500 flex items-center justify-center text-white text-lg">
                        ✍️
                    </div>
                    <div>
                        <div className="font-semibold text-gray-900 text-sm">
                            {t("insights.stories.title")}
                        </div>
                        <div className="text-xs text-gray-500">
                            {t("insights.stories.button")}
                        </div>
                    </div>
                </div>
            </button>

            {/* Об авторе */}
            <motion.button
                type="button"
                whileHover={{y: -2, scale: 1.01}}
                whileTap={{scale: 0.98}}
                onClick={() => setShowAuthorModal(true)}
                className="w-full text-left bg-white/80 backdrop-blur-md rounded-2xl px-4 py-3 shadow-sm hover:shadow-md transition-all"
            >
                <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-orange-500 to-pink-500 flex items-center justify-center text-white text-lg">
                        👤
                    </div>
                    <div>
                        <div className="font-semibold text-gray-900 text-sm">
                            {t("insights.author.title")}
                        </div>
                        <div className="text-xs text-gray-500">
                            {t("insights.author.description")}
                        </div>
                    </div>
                </div>
            </motion.button>

            {/* === МОДАЛКА ИСТОРИЙ: ИСПОЛЬЗУЕМ StoriesSection === */}
            <AnimatePresence>
                {showStoryModal && (
                    <motion.div
                        className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 px-4"
                        initial={{opacity: 0}}
                        animate={{opacity: 1}}
                        exit={{opacity: 0}}
                    >
                        <motion.div
                            className="bg-white rounded-2xl p-4 shadow-lg w-full max-w-lg max-h-[80vh] flex flex-col"
                            initial={{y: 40, opacity: 0}}
                            animate={{y: 0, opacity: 1}}
                            exit={{y: 40, opacity: 0}}
                        >
                            <div className="flex justify-between items-center mb-2">
                                <h3 className="text-lg font-bold text-gray-900">
                                    {t("insights.stories.title")}
                                </h3>
                                <button
                                    onClick={() => setShowStoryModal(false)}
                                    className="text-gray-400 hover:text-gray-600 text-2xl leading-none"
                                >
                                    &times;
                                </button>
                            </div>

                            <div className="flex-1 overflow-y-auto pt-2">
                                <StoriesSection userId={userId}/>
                            </div>

                            <button
                                onClick={() => setShowStoryModal(false)}
                                className="w-full mt-3 py-2 rounded-xl bg-gray-200 font-semibold"
                            >
                                {t("insights.modals.close")}
                            </button>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* === МОДАЛКА ОБ АВТОРЕ (PsychologistSection) === */}
            <AnimatePresence>
                {showAuthorModal && (
                    <motion.div
                        className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 px-4"
                        initial={{opacity: 0}}
                        animate={{opacity: 1}}
                        exit={{opacity: 0}}
                    >
                        <motion.div
                            className="bg-white rounded-2xl p-4 shadow-lg w-full max-w-lg max-h-[80vh] flex flex-col"
                            initial={{y: 40, opacity: 0}}
                            animate={{y: 0, opacity: 1}}
                            exit={{y: 40, opacity: 0}}
                        >
                            <div className="flex justify-between items-center mb-2">
                                <h3 className="text-lg font-bold text-gray-900">
                                    {t("insights.author.title")}
                                </h3>
                                <button
                                    onClick={() => setShowAuthorModal(false)}
                                    className="text-gray-400 hover:text-gray-600 text-2xl leading-none"
                                >
                                    &times;
                                </button>
                            </div>

                            <div className="flex-1 overflow-y-auto pt-2">
                                <PsychologistSection/>
                            </div>

                            <button
                                onClick={() => setShowAuthorModal(false)}
                                className="w-full mt-3 py-2 rounded-xl bg-gray-200 font-semibold"
                            >
                                {t("insights.modals.close")}
                            </button>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}
