// src/config/apiConfig.js

// "mock" или "real". В Vite это переменные окружения вида VITE_*
export const API_MODE = "real"//import.meta.env.VITE_API_MODE || "mock";

// базовый URL реального бэка (на будущее)
export const API_BASE_URL =
    import.meta.env.VITE_API_BASE_URL || "http://localhost:8090/api";
