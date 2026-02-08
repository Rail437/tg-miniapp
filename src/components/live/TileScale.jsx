// components/TileScale.jsx
import React from "react";
import { motion } from "framer-motion";

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
            return "bg-lime-400";
        case 6:
            return "bg-lime-500";
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

export function TileScale({ value, onPick }) {
    const activeColor = tileColor(value);

    const widthPctForLevel = (level) => {
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
                                width: `${widthPctForLevel(level)}%`,
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