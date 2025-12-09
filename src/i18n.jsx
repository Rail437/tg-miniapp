// src/i18n.jsx
import React, { createContext, useContext, useState } from "react";

const translations = {
    ru: {
        header: {
            title: "INNER CODE",
            subtitle: "Тесты, психотипы и совместимость",
        },
        tabs: {
            tests: "Тесты",
            profile: "Кабинет",
            more: "Дополнительно",
        },
        tests: {
            mainTitle: "Психологические тесты",
            mainDescription:
                "Узнай свой психотип, пойми, как устроен твой внутренний код, и посмотри, как вы с другими людьми усиливаете друг друга.",
        },
        result: {
            title: "Ваш результат",
            subtitle: "Это ваш текущий психотип по INNER CODE.",
            typeLabel: "Психотип",
            buttonClose: "Готово",
        },
        profile: {
            initText:
                "Инициализация профиля... Откройте вкладку «Тесты» и пройдите тест.",
            typeTitle: "Ваш психотип",
            loading: "Загрузка...",
            loadError: "Не удалось загрузить данные кабинета.",
            noTestYet:
                "Вы ещё не прошли тест. Перейдите во вкладку «Тесты» и пройдите основной тест по соционике.",
            referralTitle: "Ваша реферальная ссылка",
            referralCopy: "Копировать",
            referralHint:
                "Отправьте ссылку друзьям и партнёрам. После прохождения теста вы сможете видеть их психотип и совместимость.",
            invitedTitle: "Приглашённые по вашей ссылке",
            invitedNone: "Пока никто не прошёл тест по вашей ссылке.",
            invitedUserPrefix: "Пользователь",
            badgeDetailed: "подробно",
            resultFrom: "Результат от",
            clickToRead: "Нажмите, чтобы прочитать подробнее →",
            modalTag: "Ваш психотип",
            modalDeterminedAt: "Определён",
            modalWhatGives: "Что этот тип даёт вам:",
            modalBullet1: "Лучшее понимание вашего стиля мышления и поведения.",
            modalBullet2:
                "Подсказки, в каких сферах вы естественно чувствуете себя сильнее.",
            modalBullet3:
                "Осознание того, какие люди вас дополняют, а какие могут напрягать.",
            modalClose: "Понятно, вернуться в кабинет",

            // новые ключи для приглашённых
            invitedLastCardTitle: "Последний приглашённый",
            invitedLastCardSubtitle:
                "Нажмите, чтобы посмотреть всех, кто пришёл по вашей ссылке.",
            invitedStatusCompleted: "Тест пройден",
            invitedStatusPending: "Ещё не прошёл тест",
            invitedUnknown: "Неизвестный пользователь",
            invitedModalTitle: "Приглашённые по вашей ссылке",
            invitedModalSubtitle:
                "Список людей, которые пришли по вашей ссылке. Здесь вы увидите, кто уже прошёл тест.",
            invitedModalClose: "Закрыть список",
        },
    },
    en: {
        header: {
            title: "INNER CODE",
            subtitle: "Tests, types and compatibility",
        },
        tabs: {
            tests: "Tests",
            profile: "Profile",
            more: "More",
        },
        tests: {
            mainTitle: "Psychological tests",
            mainDescription:
                "Discover your personality type, understand your inner code, and see how you and others amplify each other.",
        },
        result: {
            title: "Your result",
            subtitle: "This is your current INNER CODE personality type.",
            typeLabel: "Personality type",
            buttonClose: "Done",
        },
        profile: {
            initText:
                "Initializing profile... Open the “Tests” tab and take the test.",
            typeTitle: "Your personality type",
            loading: "Loading...",
            loadError: "Failed to load profile data.",
            noTestYet:
                "You haven't taken the test yet. Go to the “Tests” tab and take the main socionics test.",
            referralTitle: "Your referral link",
            referralCopy: "Copy",
            referralHint:
                "Send this link to friends and partners. After they take the test, you'll see their type and compatibility.",
            invitedTitle: "Invited via your link",
            invitedNone: "Nobody has completed the test via your link yet.",
            invitedUserPrefix: "User",
            badgeDetailed: "details",
            resultFrom: "Result from",
            clickToRead: "Click to read more →",
            modalTag: "Your personality type",
            modalDeterminedAt: "Determined",
            modalWhatGives: "What this type gives you:",
            modalBullet1:
                "A better understanding of your way of thinking and behavior.",
            modalBullet2:
                "Hints about areas where you naturally feel stronger.",
            modalBullet3:
                "Awareness of which people complement you and which may feel stressful.",
            modalClose: "Got it, back to profile",

            // new keys for invited
            invitedLastCardTitle: "Latest invited person",
            invitedLastCardSubtitle:
                "Tap to see everyone who used your referral link.",
            invitedStatusCompleted: "Test completed",
            invitedStatusPending: "Hasn’t taken the test yet",
            invitedUnknown: "Unknown user",
            invitedModalTitle: "Invited via your link",
            invitedModalSubtitle:
                "People who came via your link. Here you can see who has already completed the test.",
            invitedModalClose: "Close list",
        },
    },
};

const LanguageContext = createContext({
    lang: "ru",
    setLang: () => {},
    t: (key) => key,
});

export const LanguageProvider = ({ children }) => {
    const [lang, setLang] = useState("ru");

    const t = (key) => {
        const parts = key.split(".");
        let value = translations[lang];
        for (const p of parts) {
            if (!value || typeof value !== "object") return key;
            value = value[p];
        }
        return typeof value === "string" ? value : key;
    };

    return (
        <LanguageContext.Provider value={{ lang, setLang, t }}>
            {children}
        </LanguageContext.Provider>
    );
};

export const useTranslation = () => useContext(LanguageContext);
