// src/i18n.jsx
import React, {createContext, useContext, useState} from "react";

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
        },
        insights: {
            compatibility: {
                title: "Совместимость по типам",
                description:
                    "Позже здесь появится персональная совместимость по вашему типу." +
                    "\nПока можно пригласить друзей и увидеть их типы и совместимость в кабинете.",
            },
            stories: {
                title: "Истории",
                button: "Поделиться историей",
                send: "Отправить",
                success: "Спасибо! История отправлена.",
            },
            author: {
                title: "Об авторе",
                description: "Узнайте, кто стоит за INNER CODE и подходом к работе с психикой.",
            },
            modals: {
                close: "Закрыть",
            },
        },
        psychologist: {
            name: "Мария Юнусова",
            title: "Психолог и коуч",
            intro:
                "Практикующий психолог и коуч. Помогаю находить внутренние ресурсы, проживать сложные состояния и строить более устойчивую, гармоничную жизнь.",
            block1Title: "О подходе",
            block1Text:
                "В работе опираюсь на бережность, экологичность и глубокое уважение к вашим границам. Для меня важно не просто «убрать симптом», а помочь вам выстроить опору на себя и свою систему ценностей.",
            block2Title: "С чем могу помочь",
            block2Item1: "Переживание кризисов, потерь и изменений в жизни.",
            block2Item2: "Тема самооценки, самоценности и уверенности в себе.",
            block2Item3: "Отношения: партнёрские, семейные, рабочие конфликты.",
            block3Title: "Формат работы",
            block3Text:
                "Сессии проходят онлайн, в комфортном для вас темпе. Мы вместе формулируем запрос и двигаемся маленькими шагами, чтобы изменения были устойчивыми и экологичными.",
            contactsTitle: "Как со мной связаться",
            contactsSubtitle:
                "Если вы чувствуете, что пришло время обратиться за поддержкой — можно написать в мессенджер и задать свой вопрос.",
            telegramCta: "Telegram",
            vkCta: "VK Podcasts",
        },
        storiesSection: {
            title: "Поделиться своей историей",
            subtitle:
                "Расскажите, через какие состояния, отношения или кризисы вы проходили. Это анонимно и может помочь другим людям почувствовать, что они не одни.",
            placeholder:
                "Опишите вашу историю, что вы проживали, что было самым сложным и что помогло вам справиться...",
            button: "Отправить анонимно",
            success: "Спасибо! История отправлена. Это правда важно.",
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
        },
        insights: {
            compatibility: {
                title: "Compatibility by types",
                description:
                    "Soon you'll see personal compatibility based on your type here. " +
                    "\nFor now, invite friends and see their types and compatibility in your profile.",
            },
            stories: {
                title: "Stories",
                button: "Share your story",
                send: "Send",
                success: "Thanks! Your story has been sent.",
            },
            author: {
                title: "About author",
                description: "Find out who is behind the INNER CODE and the approach to working with the psyche.",
            },
            modals: {
                close: "Close",
            },
        },
        psychologist: {
            name: "Maria Yunusova",
            title: "Psychologist and coach",
            intro:
                "Practicing psychologist and coach. I help people reconnect with their inner resources, live through difficult states and build a more stable, fulfilling life.",
            block1Title: "My approach",
            block1Text:
                "My work is based on gentleness, ecological attitude and deep respect for your boundaries. I’m not focused on “fixing a symptom”, but on helping you rely on yourself and your own values.",
            block2Title: "What I can help with",
            block2Item1: "Life crises, transitions and losses.",
            block2Item2: "Self-esteem, self-worth and confidence issues.",
            block2Item3: "Relationships: romantic, family and work conflicts.",
            block3Title: "Format of work",
            block3Text:
                "Sessions are held online, at a pace that feels comfortable for you. Together we clarify your request and move in small, sustainable steps.",
            contactsTitle: "How to contact me",
            contactsSubtitle:
                "If you feel it’s time to ask for support, you can write a short message and describe your request.",
            telegramCta: "Telegram",
            vkCta: "VK.com",
        },
        storiesSection: {
            title: "Share your story",
            subtitle:
                "Tell about states, relationships or crises you have been through. It’s anonymous and may help others feel less alone.",
            placeholder:
                "Describe your story, what you went through, what was the hardest part and what helped you cope...",
            button: "Send anonymously",
            success: "Thank you! Your story has been sent. It really matters.",
        },

    },
};

const LanguageContext = createContext({
    lang: "ru",
    setLang: () => {},
    t: (key) => key,
});

export const LanguageProvider = ({children}) => {
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
        <LanguageContext.Provider value={{lang, setLang, t}}>
            {children}
        </LanguageContext.Provider>
    );
};

export const useTranslation = () => useContext(LanguageContext);
