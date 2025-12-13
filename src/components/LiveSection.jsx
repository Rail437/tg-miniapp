import React, {useEffect, useMemo, useState} from "react";
import {AnimatePresence, motion} from "framer-motion";
import {useTranslation} from "../i18n";
import {apiClient} from "../api/apiClient";

const clamp = (v, min, max) => Math.max(min, Math.min(max, v));

function tileColor(level) {
    switch (level) {
        case 1:
            return "bg-red-600";
        case 2:
            return "bg-red-500";
        case 3:
            return "bg-orange-500";
        case 4:
            return "bg-amber-400";
        case 5:
            return "bg-lime-400";     // 👈 уже “норм”
        case 6:
            return "bg-lime-500";     // 👈 уже зелёный
        case 7:
            return "bg-green-400";
        case 8:
            return "bg-green-500";
        case 9:
            return "bg-emerald-500";
        case 10:
            return "bg-emerald-600";
        default:
            return "bg-gray-300";
    }
}


function TileScale({value, onPick}) {
    // value 1..10

    const activeColor = tileColor(value); // 👈 один цвет для всех заполненных

    const widthPctForLevel = (level) => {
        // 1 узкая -> 10 широкая (клин)
        // 1: 55%, 10: 100%
        return 55 + (level - 1) * 5;
    };

    return (
        <div className="relative select-none">
            <div className="flex items-center justify-between text-[11px] text-gray-400 mb-2">
                <span>10</span>
                <span>1</span>
            </div>

            <div className="flex flex-col gap-2">
                {Array.from({length: 10}).map((_, i) => {
                    const level = 10 - i;
                    const active = value >= level;

                    return (
                        <motion.button
                            key={level}
                            type="button"
                            whileTap={{scale: 0.98}}
                            onClick={() => onPick(level)}
                            className={[
                                "h-10 rounded-2xl border shadow-sm transition-all",
                                "flex items-center justify-center",
                                active
                                    ? `${activeColor} border-white/60 shadow-[0_0_14px_rgba(34,197,94,0.28)]`
                                    : "bg-gray-100 border-gray-200",
                            ].join(" ")}
                            style={{
                                width: `${widthPctForLevel(level)}%`, // 👈 клин
                                marginLeft: "auto",
                                marginRight: "auto",
                            }}
                        >
                            <motion.div
                                initial={false}
                                animate={{
                                    opacity: active ? 1 : 0.65,
                                    scale: active ? 1 : 0.995,
                                }}
                                transition={{type: "spring", stiffness: 320, damping: 22}}
                                className={[
                                    "text-sm font-semibold",
                                    active ? "text-white" : "text-gray-500",
                                ].join(" ")}
                            >
                                {level}
                            </motion.div>
                        </motion.button>
                    );
                })}
            </div>
        </div>
    );
}


// --- колесо (итоговый экран) ---
function buildPolygonPoints(keys, values, maxR, cx, cy) {
    const n = keys.length;
    const pts = keys.map((k, i) => {
        const angle = (-90 + (360 / n) * i) * (Math.PI / 180);
        const r = ((values[k] ?? 1) / 10) * maxR;
        const x = cx + r * Math.cos(angle);
        const y = cy + r * Math.sin(angle);
        return `${x.toFixed(2)},${y.toFixed(2)}`;
    });
    return pts.join(" ");
}

function gridPolygon(n, lvl, maxR, cx, cy) {
    const r = (lvl / 10) * maxR;
    const pts = Array.from({length: n}).map((_, i) => {
        const angle = (-90 + (360 / n) * i) * (Math.PI / 180);
        const x = cx + r * Math.cos(angle);
        const y = cy + r * Math.sin(angle);
        return `${x.toFixed(2)},${y.toFixed(2)}`;
    });
    return pts.join(" ");
}

function WheelChart({spheres, values}) {
    // На мобилках длинные подписи часто не влезают, поэтому:
    // 1) на самом колесе показываем только эмодзи;
    // 2) под колесом — легенда с полными названиями и значениями.
    const keys = spheres.map((s) => s.key);
    const labels = spheres.map((s) => s.label);
    const emojis = spheres.map((s) => s.emoji);

    const size = 380;
    const cx = size / 2;
    const cy = size / 2;
    const maxR = 120;
    const n = keys.length;

    const polygon = useMemo(
        () => buildPolygonPoints(keys, values, maxR, cx, cy),
        [keys, values]
    );

    const axisLines = useMemo(() => {
        return keys.map((_, i) => {
            const angle = (-90 + (360 / n) * i) * (Math.PI / 180);
            const x = cx + maxR * Math.cos(angle);
            const y = cy + maxR * Math.sin(angle);
            return {x, y};
        });
    }, [keys, n]);

    const labelPoints = useMemo(() => {
        const labelR = maxR + 40;
        return keys.map((_, i) => {
            const angle = (-90 + (360 / n) * i) * (Math.PI / 180);
            const x = cx + labelR * Math.cos(angle);
            const y = cy + labelR * Math.sin(angle);
            return {x, y};
        });
    }, [keys, n]);

    // больше не дробим подписи — в svg будут только эмодзи

    const avg = useMemo(() => {
        const sum = keys.reduce((acc, k) => acc + (values[k] ?? 1), 0);
        return Math.round((sum / keys.length) * 10) / 10;
    }, [keys, values]);

    return (
        <div className="w-full">
            <div className="flex items-center justify-between mb-2">
                <div className="text-xs text-gray-500">Среднее</div>
                <div className="text-sm font-semibold text-gray-800">{avg}/10</div>
            </div>

            <div className="bg-white/70 border border-white/80 rounded-3xl shadow-sm p-4">
                <svg width="100%" viewBox={`0 0 ${size} ${size}`} className="block">
                    <defs>
                        <linearGradient id="wheelStroke" x1="0" y1="0" x2="1" y2="1">
                            <stop offset="0%" stopColor="rgba(59,130,246,0.95)"/>
                            <stop offset="45%" stopColor="rgba(168,85,247,0.95)"/>
                            <stop offset="100%" stopColor="rgba(16,185,129,0.9)"/>
                        </linearGradient>

                        <radialGradient id="wheelFill" cx="50%" cy="45%" r="65%">
                            <stop offset="0%" stopColor="rgba(59,130,246,0.22)"/>
                            <stop offset="55%" stopColor="rgba(168,85,247,0.16)"/>
                            <stop offset="100%" stopColor="rgba(16,185,129,0.10)"/>
                        </radialGradient>

                        <filter id="wheelGlow" x="-30%" y="-30%" width="160%" height="160%">
                            <feDropShadow dx="0" dy="10" stdDeviation="10" floodOpacity="0.14"/>
                        </filter>
                    </defs>
                    {[2, 4, 6, 8, 10].map((lvl) => (
                        <polygon
                            key={lvl}
                            points={gridPolygon(n, lvl, maxR, cx, cy)}
                            fill="none"
                            stroke="rgba(107,114,128,0.18)"
                            strokeWidth="1"
                        />
                    ))}

                    {axisLines.map((p, idx) => (
                        <line
                            key={idx}
                            x1={cx}
                            y1={cy}
                            x2={p.x}
                            y2={p.y}
                            stroke="rgba(107,114,128,0.18)"
                            strokeWidth="1"
                        />
                    ))}

                    <motion.polygon
                        points={polygon}
                        initial={{opacity: 0, scale: 0.985}}
                        animate={{opacity: 1, scale: 1}}
                        transition={{duration: 0.25}}
                        fill="url(#wheelFill)"
                        stroke="url(#wheelStroke)"
                        strokeWidth="2.5"
                        filter="url(#wheelGlow)"
                    />

                    {labelPoints.map((p, i) => {
                        const anchor =
                            p.x < cx - 10 ? "end" : p.x > cx + 10 ? "start" : "middle";
                        return (
                            <text
                                key={keys[i]}
                                x={p.x}
                                y={p.y}
                                textAnchor={anchor}
                                dominantBaseline="middle"
                                fontSize={14}
                                fill="rgba(17,24,39,0.8)"
                            >
                                {emojis[i] ?? "•"}
                            </text>
                        );
                    })}
                </svg>
            </div>

            {/* Легенда — полные названия */}
            <div className="mt-3 grid grid-cols-2 gap-2">
                {spheres.map((s) => (
                    <div
                        key={s.key}
                        className="flex items-center justify-between gap-2 bg-white/70 border border-white/80 rounded-2xl px-3 py-2 text-xs text-gray-700"
                    >
                        <div className="flex items-center gap-2 min-w-0">
                            <span className="text-base">{s.emoji}</span>
                            <span className="truncate">{s.label}</span>
                        </div>
                        <span className="font-semibold tabular-nums">{values[s.key]}/10</span>
                    </div>
                ))}
            </div>
        </div>
    );
}

// --- анимация “прокрутки” между сферами ---
const tilesVariants = {
    enter: (direction) => ({
        x: direction > 0 ? 90 : -90,
        rotate: direction > 0 ? 10 : -10,
        opacity: 0,
        scale: 0.985,
        transformOrigin: "50% 88%", // 👈 якорь ближе к кнопке "Сохранить"
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


export const LiveSection = ({userId}) => {
    const {lang} = useTranslation();

    // 8 сфер: убрали Отдых и Среда
    const spheres = useMemo(() => {
        // Эмодзи — чтобы подписи на колесе не вылезали за рамки.
        // Полные названия показываем в легенде под колесом.
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

    // значения по умолчанию: null (чтобы понимать “не заполнено”)
    const emptyValues = useMemo(() => {
        const v = {};
        spheres.forEach((s) => (v[s.key] = null));
        return v;
    }, [spheres]);

    const [values, setValues] = useState(emptyValues);
    const [step, setStep] = useState(0);
    const [currentPick, setCurrentPick] = useState(5);
    const [direction, setDirection] = useState(1);

    const [done, setDone] = useState(false);
    const [isSending, setIsSending] = useState(false);
    const [sentOk, setSentOk] = useState(false);
    const [saveFx, setSaveFx] = useState(0); // триггер микро-анимации кнопки "Сохранить"

    useEffect(() => {
        let cancelled = false;

        async function loadLast() {
            if (!userId) return;

            try {
                const res = await apiClient.getLastLiveWheel(userId);

                // mock может вернуть null
                if (!res) return;

                // real: если 204 — твой request() сейчас кинет ошибку (см. ниже)
                if (cancelled) return;

                if (res?.values && typeof res.values === "object") {
                    setValues(res.values);
                    setDone(true);      // сразу показываем колесо
                    setSentOk(true);    // можно считать “сохранено”
                }
            } catch (e) {
                // если 204 у тебя превращается в ошибку — просто игнорируем
                // console.log(e)
            }
        }

        loadLast();
        return () => { cancelled = true; };
    }, [userId]);

    // restore
    useEffect(() => {
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

            // если для первой сферы уже было значение — подставим в выбор
            const firstKey = spheres[0]?.key;
            if (firstKey && next[firstKey]) setCurrentPick(next[firstKey]);

            // если всё заполнено — сразу показываем колесо
            const allFilled = spheres.every((s) => typeof next[s.key] === "number");
            if (allFilled) setDone(true);
        } catch {
            // ignore
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [storageKey, spheres.length]);

    // sync currentPick when step changes
    useEffect(() => {
        if (done) return;
        const k = spheres[step]?.key;
        if (!k) return;
        const v = values[k];
        setCurrentPick(typeof v === "number" ? v : 5);
    }, [step, done, spheres, values]);

    // reset
    const reset = () => {
        setValues(emptyValues);
        setStep(0);
        setDirection(-1);
        setDone(false);
        setSentOk(false);
        setIsSending(false);
        setCurrentPick(5);
        try {
            localStorage.removeItem(storageKey);
        } catch {
        }
    };

    const saveLocal = (nextValues) => {
        try {
            localStorage.setItem(storageKey, JSON.stringify(nextValues));
        } catch {
        }
    };

    const onBack = () => {
        if (done) return;
        if (step <= 0) return;
        setDirection(-1);
        setStep((s) => s - 1);
    };

    const onSave = async () => {
        if (done) return;

        // микрофидбек на нажатие
        setSaveFx((x) => x + 1);

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

        // последний шаг — отправка на бэк и показываем колесо
        setIsSending(true);
        setSentOk(false);

        try {
            await apiClient.submitLiveWheel({
                userId,
                values: nextValues,
                createdAt: new Date().toISOString(),
            });
            setSentOk(true);
        } catch (e) {
            console.error("submitLiveWheel error", e);
            // даже если бэк упал — покажем колесо, но без OK
            setSentOk(false);
        } finally {
            setIsSending(false);
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
            {/* верх */}
            <div className="flex items-start justify-between gap-3">
                <div>
                    <h2 className="text-xl font-bold text-gray-900">Live</h2>
                    <p className="text-sm text-gray-600 mt-1">
                        {lang === "ru"
                            ? "Колесо баланса: оцените сферы жизни по шкале от 1 до 10."
                            : "Wheel of life: rate your life areas from 1 to 10."}
                    </p>
                </div>

                <motion.button
                    whileTap={{scale: 0.97}}
                    onClick={reset}
                    type="button"
                    className="shrink-0 px-3 py-2 rounded-2xl bg-white/70 border border-white/80 text-xs text-gray-700 shadow-sm"
                >
                    {lang === "ru" ? "Сбросить" : "Reset"}
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
                            onClick={onBack}
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
                        <div className="flex items-center justify-between gap-3">
                            <div>
                                <div className="text-xs uppercase tracking-wide text-gray-400">
                                    {lang === "ru" ? "Готово" : "Done"}
                                </div>
                                <div className="text-lg font-bold text-gray-900">
                                    {lang === "ru"
                                        ? "Ваше колесо баланса"
                                        : "Your wheel of life"}
                                </div>
                                <div className="text-sm text-gray-600 mt-1">
                                    {lang === "ru"
                                        ? "Посмотрите на общую картину — где сильные зоны, а где хочется усиления."
                                        : "See the big picture: strong areas and where you may want to improve."}
                                </div>
                            </div>

                            <div className="text-xs">
                  <span
                      className={[
                          "px-2 py-1 rounded-full",
                          sentOk
                              ? "bg-emerald-50 text-emerald-700"
                              : "bg-gray-50 text-gray-500",
                      ].join(" ")}
                  >
                    {sentOk
                        ? lang === "ru"
                            ? "сохранено"
                            : "saved"
                        : lang === "ru"
                            ? "не сохранено"
                            : "not saved"}
                  </span>
                            </div>
                        </div>
                    </div>

                    <WheelChart spheres={spheres} values={values}/>
                </motion.div>
            )}
        </div>
    );
};