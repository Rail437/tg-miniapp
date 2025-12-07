// src/config/apiConfig.js

// "mock" или "real". В Vite это переменные окружения вида VITE_*
export const API_MODE = import.meta.env.VITE_API_MODE || "real";

// базовый URL реального бэка (на будущее)
export const API_BASE_URL =
    import.meta.env.VITE_API_BASE_URL || "http://176.108.246.242/api";
