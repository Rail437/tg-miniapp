// WheelOfLife.jsx
import React, {useEffect, useMemo, useState} from "react";
import {AnimatePresence, motion} from "framer-motion";
import {useTranslation} from "../../i18n";
import {apiClient} from "../../api/apiClient";
import {TileScale} from "./TileScale";
import {WheelChart} from "./WheelChart";

const clamp = (v, min, max) => Math.max(min, Math.min(max, v));

const tilesVariants = {
    enter: (direction) => ({
        x: direction > 0 ? 90 : -90,
        rotate: direction > 0 ? 10 : -10,
        opacity: 0,
        scale: 0.985,
        transformOrigin: "50% 88%",
    }),
    center: {
        x: 0,
        rotate: 0,
        opacity: 1,
        scale: 1,
        transition: {type: "spring", stiffness: 260, damping: 24},
    },
    exit: (direction) => ({
        x: direction > 0 ? -90 : 90,
        rotate: direction > 0 ? -10 : 10,
        opacity: 0,
        scale: 0.985,
        transition: {duration: 0.18},
        transformOrigin: "50% 88%",
    }),
};

export function WheelOfLife({userId, onBack, initialData}) {
    const {lang} = useTranslation();

    const spheres = useMemo(() => {
        const ru = [
            ["health", "Здоровье", "❤️"],
            ["career", "Карьера", "💼"],
            ["finance", "Финансы", "💰"],
            ["relationships", "Отношения", "🤝"],
            ["family", "Семья", "🏡"],
            ["friends", "Друзья", "🫂"],
            ["growth", "Саморазвитие", "📚"],
            ["meaning", "Смысл жизни", "✨"],
        ];
        const en = [
            ["health", "Health", "❤️"],
            ["career", "Career", "💼"],
            ["finance", "Finance", "💰"],
            ["relationships", "Relationships", "🤝"],
            ["family", "Family", "🏡"],
            ["friends", "Friends", "🫂"],
            ["growth", "Self-development", "📚"],
            ["meaning", "Meaning of life", "✨"],
        ];
        return (lang === "ru" ? ru : en).map(([key, label, emoji]) => ({
            key,
            label,
            emoji,
        }));
    }, [lang]);

    const keys = useMemo(() => spheres.map((s) => s.key), [spheres]);

    const storageKey = useMemo(
        () => (userId ? `innercode_live_wheel_${userId}` : "innercode_live_wheel"),
        [userId]
    );

    const emptyValues = useMemo(() => {
        const v = {};
        spheres.forEach((s) => (v[s.key] = null));
        return v;
    }, [spheres]);

    // Инициализируем значения из initialData если есть
    const [values, setValues] = useState(() => {
        if (initialData?.values) {
            const initialValues = {...emptyValues};
            spheres.forEach((s) => {
                if (typeof initialData.values[s.key] === 'number') {
                    initialValues[s.key] = clamp(initialData.values[s.key], 1, 10);
                }
            });
            return initialValues;
        }
        return emptyValues;
    });

    const [step, setStep] = useState(0);
    const [currentPick, setCurrentPick] = useState(5);
    const [direction, setDirection] = useState(1);
    const [done, setDone] = useState(() => {
        // Если есть initialData и все значения заполнены - сразу показываем колесо
        if (initialData?.values) {
            return spheres.every(s => typeof initialData.values[s.key] === 'number');
        }
        return false;
    });
    const [isSending, setIsSending] = useState(false);
    const [sentOk, setSentOk] = useState(() => {
        // Если есть initialData, значит уже сохранено на бэкенде
        if (initialData) return true;

        // Проверим, есть ли данные в localStorage как fallback
        try {
            const raw = localStorage.getItem(storageKey);
            if (!raw) return false;
            const parsed = JSON.parse(raw);
            // Если все сферы заполнены в localStorage, считаем сохранённым локально
            if (parsed && typeof parsed === "object") {
                const allFilled = spheres.every((s) => typeof parsed[s.key] === "number");
                return allFilled;
            }
            return false;
        } catch {
            return false;
        }
    });
    const [wheelId, setWheelId] = useState(initialData?.id || null);

    // Загрузка из localStorage (fallback)
    useEffect(() => {
        // Если уже есть данные из бэкенда, не загружаем из localStorage
        if (initialData) return;

        try {
            const raw = localStorage.getItem(storageKey);
            if (!raw) return;
            const parsed = JSON.parse(raw);
            if (!parsed || typeof parsed !== "object") return;

            const next = {...emptyValues};
            spheres.forEach((s) => {
                const pv = parsed[s.key];
                if (pv === null || pv === undefined) return;
                const num = Number(pv);
                if (!Number.isNaN(num)) next[s.key] = clamp(num, 1, 10);
            });

            setValues(next);

            const firstKey = spheres[0]?.key;
            if (firstKey && next[firstKey]) setCurrentPick(next[firstKey]);

            const allFilled = spheres.every((s) => typeof next[s.key] === "number");
            if (allFilled) {
                setDone(true);
                setSentOk(true); // Если загрузили из localStorage, значит сохранено
            }
        } catch {
            // ignore
        }
    }, [storageKey, spheres, emptyValues, initialData]);

    useEffect(() => {
        if (done) return;
        const k = spheres[step]?.key;
        if (!k) return;
        const v = values[k];
        setCurrentPick(typeof v === "number" ? v : 5);
    }, [step, done, spheres, values]);

    const reset = () => {
        setValues(emptyValues);
        setStep(0);
        setDirection(-1);
        setDone(false);
        setIsSending(false);
        setCurrentPick(5);
        setWheelId(null);
        // При сбросе ставим sentOk в false только если удаляем localStorage
        try {
            localStorage.removeItem(storageKey);
            setSentOk(false);
        } catch {
        }
    };

    const saveLocal = (nextValues) => {
        try {
            localStorage.setItem(storageKey, JSON.stringify(nextValues));
            // Проверим, все ли значения заполнены
            const allFilled = spheres.every((s) => typeof nextValues[s.key] === "number");
            if (allFilled) {
                setSentOk(true); // Установим статус сохранения
            }
        } catch {
        }
    };

    const onStepBack = () => {
        if (done) return;
        if (step <= 0) return;
        setDirection(-1);
        setStep((s) => s - 1);
    };

    const onSave = async () => {
        if (done) return;

        const currentKey = spheres[step].key;
        const nextValues = {...values, [currentKey]: clamp(currentPick, 1, 10)};
        setValues(nextValues);
        saveLocal(nextValues);

        const last = step === spheres.length - 1;

        if (!last) {
            setDirection(1);
            setStep((s) => s + 1);
            return;
        }

        // Отправка на бэкенд (только если не было отправлено ранее)
        if (!sentOk) {
            setIsSending(true);
            try {
                const payload = {
                    userId,
                    values: nextValues,
                    spheres: spheres.map(s => s.key),
                    completedAt: new Date().toISOString(),
                    metadata: {
                        lang,
                        version: '1.0'
                    }
                };

                const response = await apiClient.submitLiveWheel(payload);

                if (response?.ok && response.data?.id) {
                    setWheelId(response.data.id);
                    setSentOk(true);
                } else {
                    setSentOk(false);
                }

                setDone(true);
            } catch (error) {
                console.error('Error saving wheel:', error);
                setSentOk(false);
                setDone(true);
            } finally {
                setIsSending(false);
            }
        } else {
            // Если уже сохранено, просто показываем колесо
            setDone(true);
        }
    };

    const currentSphere = spheres[step];

    const completion = useMemo(() => {
        const filled = spheres.reduce(
            (acc, s) => acc + (typeof values[s.key] === "number" ? 1 : 0),
            0
        );
        return Math.round((filled / spheres.length) * 100);
    }, [values, spheres]);

    return (
        <div className="space-y-4">
            {/* верх с кнопкой "Назад" */}
            <div className="flex items-start justify-between gap-3">
                <div>
                    <h2 className="text-xl font-bold text-gray-900">Live - Колесо баланса</h2>
                    <p className="text-sm text-gray-600 mt-1">
                        {lang === "ru"
                            ? "Оцените сферы жизни по шкале от 1 до 10."
                            : "Rate your life areas from 1 to 10."}
                    </p>
                </div>

                <motion.button
                    whileTap={{scale: 0.97}}
                    onClick={onBack}
                    type="button"
                    className="shrink-0 px-3 py-2 rounded-2xl bg-white/70 border border-white/80 text-xs text-gray-700 shadow-sm"
                >
                    {lang === "ru" ? "Назад" : "Back"}
                </motion.button>
            </div>

            {/* прогресс */}
            {!done && (
                <div className="bg-white/60 border border-white/70 rounded-2xl px-4 py-3">
                    <div className="flex items-center justify-between mb-2">
                        <div className="text-xs text-gray-500">
                            {lang === "ru" ? "Заполнено" : "Completion"}
                        </div>
                        <div className="text-xs font-semibold text-gray-700">
                            {step + 1}/{spheres.length} • {completion}%
                        </div>
                    </div>
                    <div className="w-full h-2 bg-gray-100 rounded-full overflow-hidden">
                        <motion.div
                            className="h-full bg-gradient-to-r from-blue-600 to-purple-600"
                            initial={{width: 0}}
                            animate={{width: `${completion}%`}}
                            transition={{duration: 0.35}}
                        />
                    </div>
                </div>
            )}

            {/* контент */}
            {!done ? (
                <motion.div
                    className="bg-white/70 border border-white/80 rounded-3xl p-5 shadow-sm"
                    initial={{opacity: 0, y: 10}}
                    animate={{opacity: 1, y: 0}}
                    transition={{duration: 0.2}}
                >
                    {/* хедер сферы + назад */}
                    <div className="flex items-center justify-between mb-4">
                        <div>
                            <div className="text-xs uppercase tracking-wide text-gray-400">
                                {lang === "ru" ? "Сфера" : "Area"}
                            </div>
                            <div className="text-lg font-bold text-gray-900 leading-tight">
                                <AnimatePresence mode="wait" initial={false}>
                                    <motion.span
                                        key={currentSphere?.key}
                                        initial={{opacity: 0, y: 6}}
                                        animate={{opacity: 1, y: 0}}
                                        exit={{opacity: 0, y: -6}}
                                        transition={{duration: 0.18}}
                                        className="inline-block"
                                    >
                                        {currentSphere?.label}
                                    </motion.span>
                                </AnimatePresence>
                            </div>
                        </div>

                        <motion.button
                            whileTap={{scale: 0.97}}
                            onClick={onStepBack}
                            disabled={step === 0}
                            type="button"
                            className={[
                                "px-3 py-2 rounded-2xl text-xs shadow-sm border",
                                step === 0
                                    ? "bg-gray-50 text-gray-300 border-gray-100 cursor-not-allowed"
                                    : "bg-white/70 text-gray-700 border-white/80",
                            ].join(" ")}
                            aria-label="back"
                        >
                            ← {lang === "ru" ? "Назад" : "Back"}
                        </motion.button>
                    </div>

                    {/* шкала плиток */}
                    <div className="mt-2">
                        <AnimatePresence mode="wait" custom={direction} initial={false}>
                            <motion.div
                                key={currentSphere?.key}
                                custom={direction}
                                variants={tilesVariants}
                                initial="enter"
                                animate="center"
                                exit="exit"
                            >
                                <TileScale value={currentPick} onPick={setCurrentPick}/>
                            </motion.div>
                        </AnimatePresence>
                    </div>

                    {/* сохранить */}
                    <motion.button
                        whileTap={{scale: 0.98}}
                        whileHover={{y: -1}}
                        onClick={onSave}
                        disabled={isSending}
                        type="button"
                        className={[
                            "relative overflow-hidden mt-5 w-full py-3 rounded-2xl font-semibold shadow-md transition-all",
                            "text-white bg-gradient-to-r from-blue-600 to-purple-600",
                            isSending ? "opacity-80" : "opacity-100",
                        ].join(" ")}
                    >
                        {/* shimmer */}
                        {!isSending && (
                            <motion.div
                                aria-hidden="true"
                                className="absolute inset-0 -translate-x-full"
                                animate={{x: ["-120%", "120%"]}}
                                transition={{duration: 1.15, repeat: Infinity, ease: "easeInOut"}}
                                style={{
                                    background:
                                        "linear-gradient(110deg, rgba(255,255,255,0) 20%, rgba(255,255,255,0.22) 45%, rgba(255,255,255,0) 70%)",
                                }}
                            />
                        )}

                        <span className="relative z-10 inline-flex items-center justify-center gap-2">
                            {isSending
                                ? lang === "ru" ? "Отправляем…" : "Sending…"
                                : lang === "ru" ? "Сохранить" : "Save"}

                            {!isSending && (
                                <motion.span
                                    aria-hidden="true"
                                    initial={false}
                                    animate={{x: [0, 4, 0]}}
                                    transition={{duration: 1.0, repeat: Infinity, ease: "easeInOut"}}
                                    className="text-white/90"
                                >
                                    →
                                </motion.span>
                            )}
                        </span>
                    </motion.button>

                    <div className="mt-3 text-[11px] text-gray-400">
                        {lang === "ru"
                            ? "Нажмите на плитку, чтобы выбрать уровень. Цвет меняется от красного к зелёному."
                            : "Tap a tile to choose the level. Color shifts from red to green."}
                    </div>
                </motion.div>
            ) : (
                <motion.div
                    key="done"
                    initial={{opacity: 0, y: 14}}
                    animate={{opacity: 1, y: 0}}
                    className="space-y-4"
                >
                    <div className="bg-white/70 border border-white/80 rounded-3xl p-5 shadow-sm">
                        {/* Заголовок и статус в одной строке */}
                        <div className="flex flex-wrap items-center justify-between gap-3 mb-3">
                            <div>
                                <div className="text-xs uppercase tracking-wide text-gray-400">
                                    {lang === "ru" ? "Готово" : "Done"}
                                </div>
                                <div className="text-lg font-bold text-gray-900">
                                    {lang === "ru"
                                        ? "Ваше колесо баланса"
                                        : "Your wheel of life"}
                                </div>
                            </div>

                            <div className="flex items-center gap-2">
                                <span
                                    className={[
                                        "px-2 py-1 rounded-full text-xs font-medium",
                                        sentOk
                                            ? "bg-emerald-50 text-emerald-700"
                                            : "bg-amber-50 text-amber-700",
                                    ].join(" ")}
                                >
                                    {sentOk
                                        ? lang === "ru" ? "✓ Сохранено" : "✓ Saved"
                                        : lang === "ru" ? "⚠ Не сохранено" : "⚠ Not saved"}
                                </span>
                            </div>
                        </div>

                        {/* Описание */}
                        <div className="text-sm text-gray-600 mb-4">
                            {lang === "ru"
                                ? "Посмотрите на общую картину — где сильные зоны, а на что нужно обратить внимание."
                                : "See the big picture: strong areas and where you may want to improve."}
                        </div>

                        {/* Кнопка сброса отдельно */}
                        <div className="flex justify-end">
                            <motion.button
                                whileTap={{scale: 0.97}}
                                onClick={reset}
                                type="button"
                                className="px-4 py-2 rounded-xl bg-white border border-gray-200 text-sm text-gray-700 shadow-sm hover:bg-gray-50 transition-colors font-medium"
                            >
                                {lang === "ru" ? "Сбросить всё" : "Reset all"}
                            </motion.button>
                        </div>
                    </div>
                    <WheelChart spheres={spheres} values={values}/>
                </motion.div>
            )}
        </div>
    );
}