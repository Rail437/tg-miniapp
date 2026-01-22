// src/config/apiConfig.js

// "mock" или "real". В Vite это переменные окружения вида VITE_*
export const API_MODE = import.meta.env.VITE_API_MODE || "real";

// базовый URL реального бэка (на будущее)
export const API_BASE_URL =
    // import.meta.env.VITE_API_BASE_URL || "https://api.inner-code.ru/api";
    import.meta.env.VITE_API_BASE_URL || "http://local-host:8090/api";