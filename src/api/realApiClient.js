// src/api/realApiClient.js
import { API_BASE_URL } from "../config/apiConfig";

// Вспомогательная функция
async function request(path, options = {}) {
    const res = await fetch(`${API_BASE_URL}${path}`, {
        headers: {
            "Content-Type": "application/json",
            ...(options.headers || {}),
        },
        ...options,
    });

    if (!res.ok) {
        throw new Error(`API error: ${res.status}`);
    }
    return res.json();
}

export async function authTelegram(initData) {
    return request("/auth/telegram", {
        method: "POST",
        body: JSON.stringify({ initData }),
    });
}

export async function startMainTest(userId) {
    return request("/tests/main/start", {
        method: "POST",
        body: JSON.stringify({ userId }),
    });
}

export async function answerMainTest({ sessionId, questionIndex, answerValue }) {
    return request("/tests/main/answer", {
        method: "POST",
        body: JSON.stringify({ sessionId, questionIndex, answerValue }),
    });
}

export async function getTestSession(sessionId) {
    return request(`/tests/main/session/${sessionId}`, {
        method: "GET",
    });
}

export async function completeMainTest(sessionId) {
    return request("/tests/main/complete", {
        method: "POST",
        body: JSON.stringify({ sessionId }),
    });
}

export async function getLastResult(userId) {
    return request(`/tests/main/last-result?userId=${userId}`, {
        method: "GET",
    });
}

export async function getMyReferral(userId) {
    return request(`/referral/my?userId=${userId}`, {
        method: "GET",
    });
}

export async function registerReferralUse({ code, invitedUserId }) {
    return request("/referral/use", {
        method: "POST",
        body: JSON.stringify({ code, invitedUserId }),
    });
}

export async function getMyInvited(userId) {
    return request(`/referral/invited?userId=${userId}`, {
        method: "GET",
    });
}
