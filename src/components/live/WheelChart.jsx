// components/WheelChart.jsx
import React, { useMemo } from "react";
import { motion } from "framer-motion";

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

export function WheelChart({ spheres, values }) {
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