// src/components/MainScreen.jsx

import React from "react";
import { motion } from "framer-motion";

export function MainScreen({ onStartTests }) {
    return (
        // Основной контейнер экрана
        <main className="flex-1 flex items-center justify-center px-6">
            <div className="flex flex-col items-center text-center">

                {/* === БЛОК С МОЗГОМ === */}
                {/* Обёртка нужна, чтобы отдельно анимировать мозг и подсветку */}
                <div className="relative mb-8">
                    {/* Glow / подсветка под мозгом */}
                    <motion.div
                        className="absolute inset-0 blur-2xl rounded-full"
                        style={{
                            background:
                                "radial-gradient(circle, rgba(59,130,246,0.5), transparent 60%)",
                        }}
                        // Лёгкое пульсирование подсветки
                        animate={{
                            opacity: [0.6, 1, 0.6],
                            scale: [0.9, 1.05, 0.9],
                        }}
                        transition={{
                            duration: 3.2,
                            repeat: Infinity,
                            ease: "easeInOut",
                        }}
                    />

                    {/* Сам мозг 🧠 */}
                    <motion.div
                        className="relative w-24 h-24 rounded-full flex items-center justify-center text-4xl shadow-xl bg-gradient-to-r from-blue-500 to-purple-500 text-white"
                        // keyframes-анимация
                        animate={{
                            // лёгкое плавание вверх-вниз
                            y: [0, -10, 0],
                            // лёгкое покачивание
                            rotate: [0, -4, 3, 0],
                            // пульсирование размера
                            scale: [1, 1.06, 1],
                        }}
                        transition={{
                            duration: 3,
                            repeat: Infinity,
                            ease: "easeInOut",
                        }}
                        // реакция на hover/tap
                        whileHover={{
                            scale: 1.08,
                            y: -4,
                            boxShadow: "0 20px 40px rgba(59,130,246,0.45)",
                        }}
                        whileTap={{
                            scale: 0.97,
                            y: 2,
                        }}
                    >
                        🧠
                    </motion.div>
                </div>

                {/* Заголовок и текст */}
                <motion.h1
                    className="text-3xl font-bold mb-4"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.1 }}
                >
                    ПсихоТесты
                </motion.h1>

                <motion.p
                    className="text-lg text-gray-600 mb-8 max-w-md"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.2 }}
                >
                    Откройте новые грани своей личности с помощью психологических тестов
                </motion.p>

                {/* Кнопка "Начать тестирование" */}
                <motion.button
                    onClick={onStartTests}
                    className="px-6 py-3 rounded-full bg-blue-600 text-white text-lg font-semibold shadow-lg"
                    // лёгкий «breathing»-эффект
                    animate={{
                        scale: [1, 1.03, 1],
                    }}
                    transition={{
                        duration: 2,
                        repeat: Infinity,
                        ease: "easeInOut",
                    }}
                    whileHover={{
                        scale: 1.07,
                        boxShadow: "0 18px 35px rgba(37,99,235,0.55)",
                    }}
                    whileTap={{
                        scale: 0.96,
                        y: 1,
                    }}
                >
                    Начать тестирование
                </motion.button>
            </div>
        </main>
    );
}
