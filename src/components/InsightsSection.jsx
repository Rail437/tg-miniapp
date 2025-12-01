// src/components/InsightsSection.jsx
import React, { useState } from "react";
import { StoriesSection } from "./StoriesSection";
import { PsychologistSection } from "./PsychologistSection";
import { motion, AnimatePresence } from "framer-motion";

export const InsightsSection = ({ lastResult }) => {
    const [activeModal, setActiveModal] = useState(null); // "compatibility" | "story" | "about" | null

    const closeModal = () => setActiveModal(null);

    return (
        <>
            <div className="space-y-4">
                <h2 className="text-xl font-bold text-gray-900 mb-2">
                    Дополнительные возможности
                </h2>
                <p className="text-sm text-gray-600 mb-4">
                    Здесь собраны опции, которые помогут глубже понять себя, поделиться
                    опытом и узнать больше об авторе проекта.
                </p>

                <div className="space-y-3">
                    {/* Карточка: Совместимость */}
                    <motion.button
                        type="button"
                        whileHover={{ y: -2, scale: 1.01 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={() => setActiveModal("compatibility")}
                        className="w-full text-left bg-white/80 border border-white/80 rounded-2xl px-4 py-3 shadow-sm hover:shadow-md transition-all flex items-center justify-between"
                    >
                        <div className="flex items-center gap-3">
                            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-blue-500 to-purple-500 flex items-center justify-center text-white text-lg">
                                🤝
                            </div>
                            <div>
                                <div className="font-semibold text-gray-900 text-sm">
                                    Совместимость
                                </div>
                                <div className="text-xs text-gray-500">
                                    Узнайте, как ваш психотип сочетается с другими людьми.
                                </div>
                            </div>
                        </div>
                        <div className="text-gray-400 text-lg">›</div>
                    </motion.button>

                    {/* Карточка: Поделиться историей */}
                    <motion.button
                        type="button"
                        whileHover={{ y: -2, scale: 1.01 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={() => setActiveModal("story")}
                        className="w-full text-left bg-white/80 border border-white/80 rounded-2xl px-4 py-3 shadow-sm hover:shadow-md transition-all flex items-center justify-between"
                    >
                        <div className="flex items-center gap-3">
                            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-emerald-500 to-teal-500 flex items-center justify-center text-white text-lg">
                                ✍️
                            </div>
                            <div>
                                <div className="font-semibold text-gray-900 text-sm">
                                    Поделиться историей
                                </div>
                                <div className="text-xs text-gray-500">
                                    Расскажите, как вы проживаете свои состояния или отношения.
                                </div>
                            </div>
                        </div>
                        <div className="text-gray-400 text-lg">›</div>
                    </motion.button>

                    {/* Карточка: Об авторе */}
                    <motion.button
                        type="button"
                        whileHover={{ y: -2, scale: 1.01 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={() => setActiveModal("about")}
                        className="w-full text-left bg-white/80 border border-white/80 rounded-2xl px-4 py-3 shadow-sm hover:shadow-md transition-all flex items-center justify-between"
                    >
                        <div className="flex items-center gap-3">
                            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-orange-500 to-pink-500 flex items-center justify-center text-white text-lg">
                                👤
                            </div>
                            <div>
                                <div className="font-semibold text-gray-900 text-sm">
                                    Об авторе
                                </div>
                                <div className="text-xs text-gray-500">
                                    Узнайте, кто стоит за INNER CODE и подходом к работе с психикой.
                                </div>
                            </div>
                        </div>
                        <div className="text-gray-400 text-lg">›</div>
                    </motion.button>
                </div>
            </div>

            {/* МОДАЛКИ */}
            <AnimatePresence>
                {/* Модалка: Совместимость */}
                {activeModal === "compatibility" && (
                    <motion.div
                        className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 px-4"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                    >
                        <motion.div
                            className="bg-white/95 backdrop-blur-2xl rounded-3xl p-6 w-full max-w-md shadow-2xl border border-white/80"
                            initial={{ scale: 0.9, opacity: 0, y: 20 }}
                            animate={{ scale: 1, opacity: 1, y: 0 }}
                            exit={{ scale: 0.9, opacity: 0, y: 20 }}
                            transition={{ duration: 0.25 }}
                        >
                            <div className="flex justify-between items-start mb-4">
                                <div>
                                    <div className="text-xs uppercase tracking-wide text-blue-500 mb-1">
                                        Совместимость
                                    </div>
                                    <h3 className="text-xl font-bold text-gray-900">
                                        Совместимость по психотипу
                                    </h3>
                                </div>
                                <button
                                    onClick={closeModal}
                                    className="text-gray-400 hover:text-gray-600 text-2xl leading-none"
                                >
                                    &times;
                                </button>
                            </div>

                            {lastResult ? (
                                <>
                                    <p className="text-sm text-gray-700 mb-3">
                                        Ваш текущий психотип:{" "}
                                        <span className="font-semibold">{lastResult.label}</span>.
                                    </p>
                                    <p className="text-sm text-gray-600 mb-3">
                                        В следующих версиях вы сможете отправить ссылку партнёру,
                                        другу или коллеге, чтобы он прошёл тест, и увидеть, как ваши
                                        типы сочетаются: где вы усиливаете друг друга, а где могут
                                        возникать напряжения.
                                    </p>
                                    <p className="text-sm text-gray-600 mb-3">
                                        Уже сейчас вы можете:
                                    </p>
                                    <ul className="list-disc list-inside text-sm text-gray-700 space-y-1 mb-4">
                                        <li>
                                            Отправить вашу реферальную ссылку из раздела «Кабинет»
                                            нужному человеку.
                                        </li>
                                        <li>
                                            После прохождения теста — видеть его психотип у себя в
                                            списке приглашённых.
                                        </li>
                                        <li>
                                            В будущем — получать детальный разбор совместимости.
                                        </li>
                                    </ul>
                                    <p className="text-xs text-gray-400">
                                        Функция совместимости сейчас в стадии настройки, но
                                        фундамент уже заложен.
                                    </p>
                                </>
                            ) : (
                                <p className="text-sm text-gray-600">
                                    Чтобы увидеть блок совместимости, сначала пройдите основной
                                    тест во вкладке «Тесты». После этого здесь появится больше
                                    информации о вашем типе и взаимодействии с другими людьми.
                                </p>
                            )}

                            <button
                                onClick={closeModal}
                                className="mt-6 w-full py-2.5 rounded-2xl bg-gray-100 text-gray-700 text-sm font-medium hover:bg-gray-200 transition-colors"
                            >
                                Понятно
                            </button>
                        </motion.div>
                    </motion.div>
                )}

                {/* Модалка: Поделиться историей */}
                {activeModal === "story" && (
                    <motion.div
                        className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 px-4"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                    >
                        <motion.div
                            className="bg-white/95 backdrop-blur-2xl rounded-3xl p-6 w-full max-w-md shadow-2xl border border-white/80 max-h-[80vh] overflow-y-auto"
                            initial={{ scale: 0.9, opacity: 0, y: 20 }}
                            animate={{ scale: 1, opacity: 1, y: 0 }}
                            exit={{ scale: 0.9, opacity: 0, y: 20 }}
                            transition={{ duration: 0.25 }}
                        >
                            <div className="flex justify-between items-start mb-4">
                                <div>
                                    <div className="text-xs uppercase tracking-wide text-emerald-500 mb-1">
                                        История
                                    </div>
                                    <h3 className="text-xl font-bold text-gray-900">
                                        Поделиться своей историей
                                    </h3>
                                </div>
                                <button
                                    onClick={closeModal}
                                    className="text-gray-400 hover:text-gray-600 text-2xl leading-none"
                                >
                                    &times;
                                </button>
                            </div>

                            <StoriesSection />

                            <button
                                onClick={closeModal}
                                className="mt-4 w-full py-2.5 rounded-2xl bg-gray-100 text-gray-700 text-sm font-medium hover:bg-gray-200 transition-colors"
                            >
                                Закрыть
                            </button>
                        </motion.div>
                    </motion.div>
                )}

                {/* Модалка: Об авторе */}
                {activeModal === "about" && (
                    <motion.div
                        className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 px-4"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                    >
                        <motion.div
                            className="bg-white/95 backdrop-blur-2xl rounded-3xl p-6 w-full max-w-md shadow-2xl border border-white/80 max-h-[80vh] overflow-y-auto"
                            initial={{ scale: 0.9, opacity: 0, y: 20 }}
                            animate={{ scale: 1, opacity: 1, y: 0 }}
                            exit={{ scale: 0.9, opacity: 0, y: 20 }}
                            transition={{ duration: 0.25 }}
                        >
                            <div className="flex justify-between items-start mb-4">
                                <div>
                                    <div className="text-xs uppercase tracking-wide text-orange-500 mb-1">
                                        Об авторе
                                    </div>
                                    <h3 className="text-xl font-bold text-gray-900">
                                        Кто стоит за INNER CODE
                                    </h3>
                                </div>
                                <button
                                    onClick={closeModal}
                                    className="text-gray-400 hover:text-gray-600 text-2xl leading-none"
                                >
                                    &times;
                                </button>
                            </div>

                            <PsychologistSection />

                            <button
                                onClick={closeModal}
                                className="mt-4 w-full py-2.5 rounded-2xl bg-gray-100 text-gray-700 text-sm font-medium hover:bg-gray-200 transition-colors"
                            >
                                Закрыть
                            </button>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </>
    );
};
