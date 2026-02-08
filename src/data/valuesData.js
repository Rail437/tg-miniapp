// valuesData.js
export const getValuesWithActions = (lang) => {
    const values = [
        {
            id: 1,
            text: lang === "ru" ? "Принятие" : "Acceptance",
            icon: "🙏",
            actions: lang === "ru"
                ? [
                    "Ежедневно практиковать благодарность за то, что есть, вместо фокуса на недостатках",
                    "В сложных ситуациях спрашивать себя: 'Что я могу принять в этой ситуации прямо сейчас?'",
                    "Разрешать себе и другим совершать ошибки, видя в них возможности для роста"
                ]
                : [
                    "Practice daily gratitude for what you have instead of focusing on shortcomings",
                    "In difficult situations, ask yourself: 'What can I accept about this situation right now?'",
                    "Allow yourself and others to make mistakes, seeing them as opportunities for growth"
                ]
        },
        {
            id: 2,
            text: lang === "ru" ? "Приключения" : "Adventure",
            icon: "🗺️",
            actions: lang === "ru"
                ? [
                    "Каждую неделю пробовать что-то новое, даже если это небольшое изменение в рутине",
                    "В моменты застоя сознательно выходить из зоны комфорта",
                    "Видеть в жизненных трудностях вызов и возможность для внутреннего роста"
                ]
                : [
                    "Try something new every week, even a small change in routine",
                    "Consciously step out of your comfort zone during periods of stagnation",
                    "See life's difficulties as challenges and opportunities for internal growth"
                ]
        },
        {
            id: 3,
            text: lang === "ru" ? "Уважение своих потребностей" : "Respect for one's needs",
            icon: "💪",
            actions: lang === "ru"
                ? [
                    "Ежедневно выделять хотя бы 30 минут только для себя без чувства вины",
                    "В кризисные моменты первым делом спрашивать: 'Что мне сейчас действительно нужно?'",
                    "Учиться говорить 'нет' тому, что истощает, и 'да' тому, что наполняет"
                ]
                : [
                    "Daily dedicate at least 30 minutes just for yourself without guilt",
                    "In crisis moments, first ask: 'What do I really need right now?'",
                    "Learn to say 'no' to what drains you and 'yes' to what fills you"
                ]
        },
        {
            id: 4,
            text: lang === "ru" ? "Искренность" : "Sincerity",
            icon: "💖",
            actions: lang === "ru"
                ? [
                    "Каждый день говорить хотя бы одну правду, которую обычно скрываешь",
                    "В трудных разговорах использовать 'Я-сообщения' вместо обвинений",
                    "Принимать решения, основываясь на своих истинных ценностях, а не на ожиданиях других"
                ]
                : [
                    "Every day speak at least one truth you usually hide",
                    "In difficult conversations, use 'I-messages' instead of accusations",
                    "Make decisions based on your true values, not others' expectations"
                ]
        },
        {
            id: 5,
            text: lang === "ru" ? "Сочувствие" : "Sympathy",
            icon: "🤗",
            actions: lang === "ru"
                ? [
                    "При встрече с чужим страхом сначала слушать, не пытаясь сразу решить проблему",
                    "В конфликтах практиковать 'ментальную прогулку' в чужих ботинках",
                    "Относиться к собственным ошибкам с той же добротой, как к ошибкам друга"
                ]
                : [
                    "When meeting others' pain, first listen without immediately trying to solve the problem",
                    "In conflicts, practice 'mental walking in others' shoes'",
                    "Treat your own mistakes with the same kindness as a friend's mistakes"
                ]
        },
        {
            id: 6,
            text: lang === "ru" ? "Связь" : "Connection",
            icon: "🔗",
            actions: lang === "ru"
                ? [
                    "Во время общения убирать телефон и полностью присутствовать",
                    "В кризисные моменты сознательно искать поддержку, а не изолироваться",
                    "Создавать ритуалы глубокого общения с близкими хотя бы раз в неделю"
                ]
                : [
                    "Put away your phone and be fully present during conversations",
                    "In crisis moments, consciously seek support instead of isolating yourself",
                    "Create rituals of deep communication with loved ones at least once a week"
                ]
        },
        {
            id: 7,
            text: lang === "ru" ? "Вклад и щедрость" : "Contribution and generosity",
            icon: "🎁",
            actions: lang === "ru"
                ? [
                    "Находить способы делиться тем, что у тебя есть в избытке (время, внимание, знания)",
                    "В трудные времена помнить, что даже маленькая помощь имеет значение",
                    "Фокусироваться на том, что можешь дать, а не на том, что получаешь"
                ]
                : [
                    "Find ways to share what you have in abundance (time, attention, knowledge)",
                    "In difficult times, remember that even small help matters",
                    "Focus on what you can give, not what you receive"
                ]
        },
        {
            id: 8,
            text: lang === "ru" ? "Сотрудничество" : "Cooperation",
            icon: "🤝",
            actions: lang === "ru"
                ? [
                    "В сложных проектах искать win-win решения вместо конкуренции",
                    "При разногласиях фокусироваться на общей цели, а не на различиях",
                    "Развивать навыки активного слушания и конструктивной обратной связи"
                ]
                : [
                    "In complex projects, seek win-win solutions instead of competition",
                    "In disagreements, focus on common goals rather than differences",
                    "Develop skills of active listening and constructive feedback"
                ]
        },
        {
            id: 9,
            text: lang === "ru" ? "Смелость" : "Courage",
            icon: "🦁",
            actions: lang === "ru"
                ? [
                    "Каждый день делать один маленький шаг в сторону страха",
                    "В кризисных ситуациях действовать, даже когда нет полной уверенности",
                    "Различать здоровые риски, ведущие к росту, и безрассудные поступки"
                ]
                : [
                    "Take one small step toward fear every day",
                    "In crisis situations, act even when you're not completely sure",
                    "Distinguish healthy risks that lead to growth from reckless actions"
                ]
        },
        {
            id: 10,
            text: lang === "ru" ? "Творчество" : "Creativity",
            icon: "🎨",
            actions: lang === "ru"
                ? [
                    "Выделять время для свободного творчества без цели и оценки результата",
                    "В тупиковых ситуациях использовать мозговой штурм для поиска неочевидных решений",
                    "Видеть в ограничениях не препятствия, а новые возможности для творческого подхода"
                ]
                : [
                    "Set aside time for free creativity without goals or evaluation of results",
                    "In dead-end situations, use brainstorming to find non-obvious solutions",
                    "See limitations not as obstacles but as new opportunities for creative approaches"
                ]
        },
        {
            id: 11,
            text: lang === "ru" ? "Любопытство" : "Curiosity",
            icon: "🔍",
            actions: lang === "ru"
                ? [
                    "Задавать вопросы вместо предположений в неясных ситуациях",
                    "В конфликтах интересоваться: 'Что стоит за позицией другого человека?'",
                    "Подходить к собственным ошибкам с любопытством: 'Чему я могу научиться?'"
                ]
                : [
                    "Ask questions instead of making assumptions in unclear situations",
                    "In conflicts, wonder: 'What lies behind the other person's position?'",
                    "Approach your own mistakes with curiosity: 'What can I learn from this?'"
                ]
        },
        {
            id: 12,
            text: lang === "ru" ? "Воодушевление" : "Inspiration",
            icon: "✨",
            actions: lang === "ru"
                ? [
                    "Замечать и отмечать маленькие победы в себе и других",
                    "В трудные времена сознательно искать истории преодоления и надежды",
                    "Создавать вокруг себя среду, которая питает душу и разум"
                ]
                : [
                    "Notice and celebrate small victories in yourself and others",
                    "In difficult times, consciously seek stories of overcoming and hope",
                    "Create an environment around yourself that nourishes soul and mind"
                ]
        },
        {
            id: 13,
            text: lang === "ru" ? "Увлечение" : "Passion",
            icon: "🔥",
            actions: lang === "ru"
                ? [
                    "Находить 'состояние потока' в ежедневных делах, а не ждать особых случаев",
                    "В кризисные периоды вспоминать то, что зажигало тебя раньше",
                    "Защищать время для своих увлечений как важную инвестицию в себя"
                ]
                : [
                    "Find 'flow state' in daily activities, don't wait for special occasions",
                    "In crisis periods, remember what ignited you before",
                    "Protect time for your passions as an important investment in yourself"
                ]
        },
        {
            id: 14,
            text: lang === "ru" ? "Справедливость" : "Justice",
            icon: "⚖️",
            actions: lang === "ru"
                ? [
                    "Замечать и исправлять собственные предубеждения и автоматические суждения",
                    "В конфликтах стремиться понять все стороны, а не занимать одну позицию",
                    "Защищать тех, кто не может защитить себя, даже когда это неудобно"
                ]
                : [
                    "Notice and correct your own biases and automatic judgments",
                    "In conflicts, strive to understand all sides rather than taking one position",
                    "Stand up for those who cannot defend themselves, even when it's inconvenient"
                ]
        },
        {
            id: 15,
            text: lang === "ru" ? "Хорошее здоровье" : "Good health",
            icon: "💊",
            actions: lang === "ru"
                ? [
                    "Слушать сигналы тела и вовремя давать ему то, что нужно (отдых, движение, питание)",
                    "В стрессовые периоды усиливать заботу о базовых потребностях",
                    "Видеть здоровье как баланс физического, эмоционального и ментального благополучия"
                ]
                : [
                    "Listen to your body's signals and give it what it needs in time (rest, movement, nutrition)",
                    "During stressful periods, increase care for basic needs",
                    "See health as a balance of physical, emotional, and mental well-being"
                ]
        },
        {
            id: 16,
            text: lang === "ru" ? "Гибкость" : "Flexibility",
            icon: "🌀",
            actions: lang === "ru"
                ? [
                    "При неудаче плана А сразу переходить к плану Б, не застревая в разочаровании",
                    "В меняющихся условиях фокусироваться на том, что можно контролировать",
                    "Развивать способность менять перспективу и видеть ситуацию с разных сторон"
                ]
                : [
                    "When plan A fails, immediately move to plan B without getting stuck in disappointment",
                    "In changing conditions, focus on what you can control",
                    "Develop the ability to change perspective and see situations from different angles"
                ]
        },
        {
            id: 17,
            text: lang === "ru" ? "Прощение" : "Forgiveness",
            icon: "🕊️",
            actions: lang === "ru"
                ? [
                    "Освобождать место в сердце, отпуская старые обиды, которые больше не служат",
                    "Разделять человека и его поступок, осуждая действие, но сохраняя уважение к человеку",
                    "Начинать с прощения себя, чтобы научиться прощать других"
                ]
                : [
                    "Make room in your heart by letting go of old grievances that no longer serve you",
                    "Separate the person from their actions, condemning the action but maintaining respect for the person",
                    "Start with forgiving yourself to learn how to forgive others"
                ]
        },
        {
            id: 18,
            text: lang === "ru" ? "Свобода и независимость" : "Freedom and independence",
            icon: "🗽",
            actions: lang === "ru"
                ? [
                    "Осознанно выбирать свои обязательства, а не принимать их по умолчанию",
                    "В моменты давления сохранять внутреннее пространство для самостоятельного решения",
                    "Балансировать между свободой и ответственностью, понимая их взаимосвязь"
                ]
                : [
                    "Consciously choose your commitments rather than accepting them by default",
                    "Under pressure, maintain inner space for independent decision-making",
                    "Balance freedom and responsibility, understanding their interconnection"
                ]
        },
        {
            id: 19,
            text: lang === "ru" ? "Дружелюбие" : "Friendliness",
            icon: "😊",
            actions: lang === "ru"
                ? [
                    "Начинать взаимодействие с открытого, позитивного настроя, даже в формальных ситуациях",
                    "В напряженной обстановке использовать юмор и теплоту для снижения напряжения",
                    "Быть тем человеком, с которым приятно иметь дело, независимо от обстоятельств"
                ]
                : [
                    "Start interactions with an open, positive attitude, even in formal situations",
                    "In tense environments, use humor and warmth to reduce tension",
                    "Be someone who is pleasant to deal with, regardless of circumstances"
                ]
        },
        {
            id: 20,
            text: lang === "ru" ? "Юмор и веселье" : "Humor and fun",
            icon: "😂",
            actions: lang === "ru"
                ? [
                    "Находить моменты легкомыслия даже в серьезных ситуациях",
                    "Использовать юмор как лекарство от стресса и способ переосмыслить трудности",
                    "Создавать ритуалы радости и веселья в повседневной жизни"
                ]
                : [
                    "Find moments of levity even in serious situations",
                    "Use humor as medicine for stress and a way to reframe difficulties",
                    "Create rituals of joy and fun in everyday life"
                ]
        },
        {
            id: 21,
            text: lang === "ru" ? "Благодарность" : "Gratitude",
            icon: "🙌",
            actions: lang === "ru"
                ? [
                    "Замечать и ценить маленькие моменты красоты и доброты каждый день",
                    "В трудные времена сознательно искать то, за что можно быть благодарным",
                    "Выражать благодарность не только словами, но и действиями"
                ]
                : [
                    "Notice and appreciate small moments of beauty and kindness every day",
                    "In difficult times, consciously look for things to be grateful for",
                    "Express gratitude not only in words but also through actions"
                ]
        },
        {
            id: 22,
            text: lang === "ru" ? "Честность" : "Honesty",
            icon: "🤥",
            actions: lang === "ru"
                ? [
                    "Говорить правду с добротой, учитывая время, место и уместность",
                    "Быть честным с собой в первую очередь, особенно в отношении мотивов и чувств",
                    "Создавать пространство, где другие тоже могут быть честными"
                ]
                : [
                    "Speak truth with kindness, considering timing, place, and appropriateness",
                    "Be honest with yourself first, especially about motives and feelings",
                    "Create space where others can also be honest"
                ]
        },
        {
            id: 23,
            text: lang === "ru" ? "Предприимчивость" : "Enterprise",
            icon: "💼",
            actions: lang === "ru"
                ? [
                    "Видеть возможности там, где другие видят проблемы",
                    "В кризисные времена фокусироваться на решении, а не на жалости к себе",
                    "Доводить начатое до конца, развивая дисциплину и последовательность"
                ]
                : [
                    "See opportunities where others see problems",
                    "In crisis times, focus on solutions rather than self-pity",
                    "Follow through on what you start, developing discipline and consistency"
                ]
        },
        {
            id: 24,
            text: lang === "ru" ? "Близость" : "Intimacy",
            icon: "💑",
            actions: lang === "ru"
                ? [
                    "Создавать безопасное пространство для уязвимости в отношениях",
                    "В сложные периоды отношений сознательно инвестировать время и внимание",
                    "Быть готовым показывать свое истинное 'я', а не только социальную маску"
                ]
                : [
                    "Create a safe space for vulnerability in relationships",
                    "During difficult periods in relationships, consciously invest time and attention",
                    "Be willing to show your true self, not just a social mask"
                ]
        },
        {
            id: 25,
            text: lang === "ru" ? "Доброта" : "Kindness",
            icon: "💝",
            actions: lang === "ru"
                ? [
                    "Совершать маленькие акты доброты без ожидания благодарности или признания",
                    "Быть особенно добрым к себе в периоды неудач и разочарований",
                    "Распространять доброту как на знакомых, так и на незнакомцев"
                ]
                : [
                    "Perform small acts of kindness without expecting gratitude or recognition",
                    "Be especially kind to yourself during periods of failure and disappointment",
                    "Extend kindness to both acquaintances and strangers"
                ]
        },
        {
            id: 26,
            text: lang === "ru" ? "Любовь" : "Love",
            icon: "❤️",
            actions: lang === "ru"
                ? [
                    "Выражать любовь на языке, понятном получателю (слова, время, помощь, подарки, прикосновения)",
                    "В трудные времена отношений фокусироваться на том, что объединяет, а не разделяет",
                    "Любить без условий, но с границами, уважая себя и другого"
                ]
                : [
                    "Express love in a language understandable to the receiver (words, time, help, gifts, touch)",
                    "During difficult times in relationships, focus on what unites rather than divides",
                    "Love without conditions but with boundaries, respecting yourself and the other"
                ]
        },
        {
            id: 27,
            text: lang === "ru" ? "Осознанность" : "Mindfulness",
            icon: "🧘",
            actions: lang === "ru"
                ? [
                    "Практиковать 'остановки' в течение дня для проверки своего состояния",
                    "В стрессовых ситуациях дышать и возвращаться в настоящее, а не в катастрофические сценарии",
                    "Замечать автоматические реакции и сознательно выбирать ответ"
                ]
                : [
                    "Practice 'stops' during the day to check your state",
                    "In stressful situations, breathe and return to the present instead of catastrophic scenarios",
                    "Notice automatic reactions and consciously choose your response"
                ]
        },
        {
            id: 28,
            text: lang === "ru" ? "Порядок" : "Order",
            icon: "🗂️",
            actions: lang === "ru"
                ? [
                    "Создавать системы и ритуалы, которые освобождают ум для важных решений",
                    "В хаотичные периоды начинать с наведения порядка в маленькой области",
                    "Балансировать между структурой и спонтанностью для гармоничной жизни"
                ]
                : [
                    "Create systems and rituals that free the mind for important decisions",
                    "During chaotic periods, start by bringing order to a small area",
                    "Balance structure and spontaneity for a harmonious life"
                ]
        },
        {
            id: 29,
            text: lang === "ru" ? "Упорство и настойчивость" : "Perseverance and persistence",
            icon: "🏋️",
            actions: lang === "ru"
                ? [
                    "Разбивать большие цели на маленькие шаги и праздновать каждый прогресс",
                    "В моменты усталости и желания сдаться вспоминать 'зачем' ты начал",
                    "Быть гибким в методах, но стойким в намерениях"
                ]
                : [
                    "Break big goals into small steps and celebrate every progress",
                    "In moments of fatigue and desire to give up, remember 'why' you started",
                    "Be flexible in methods but steadfast in intentions"
                ]
        },
        {
            id: 30,
            text: lang === "ru" ? "Уважение" : "Respect",
            icon: "🙇",
            actions: lang === "ru"
                ? [
                    "Относиться к другим так, как хочешь, чтобы относились к тебе, даже при разногласиях",
                    "Уважать чужие границы и четко обозначать свои собственные",
                    "Проявлять уважение не только к людям, но и к своим обязательствам, времени, ресурсам"
                ]
                : [
                    "Treat others as you want to be treated, even in disagreements",
                    "Respect others' boundaries and clearly mark your own",
                    "Show respect not only to people but also to your commitments, time, resources"
                ]
        },
        {
            id: 31,
            text: lang === "ru" ? "Ответственность" : "Responsibility",
            icon: "✅",
            actions: lang === "ru"
                ? [
                    "Принимать ответственность за свои выборы, реакции и последствия действий",
                    "В конфликтах искать свою роль и вклад в ситуацию, а не только винить других",
                    "Быть тем, на кого можно положиться в важных и неважных делах"
                ]
                : [
                    "Take responsibility for your choices, reactions, and consequences of actions",
                    "In conflicts, look for your role and contribution to the situation, not just blame others",
                    "Be someone who can be relied upon in both important and unimportant matters"
                ]
        },
        {
            id: 32,
            text: lang === "ru" ? "Защита и безопасность" : "Protection and safety",
            icon: "🛡️",
            actions: lang === "ru"
                ? [
                    "Создавать физическое и эмоциональное безопасное пространство для себя и близких",
                    "В угрожающих ситуациях сначала обеспечивать базовую безопасность, затем решать проблемы",
                    "Учиться различать реальные угрозы и мнимые страхи, чтобы действовать адекватно"
                ]
                : [
                    "Create physically and emotionally safe space for yourself and loved ones",
                    "In threatening situations, first ensure basic safety, then solve problems",
                    "Learn to distinguish real threats from imaginary fears to act appropriately"
                ]
        },
        {
            id: 33,
            text: lang === "ru" ? "Чувственность и удовольствие" : "Sensuality and pleasure",
            icon: "🌹",
            actions: lang === "ru"
                ? [
                    "Сознательно замечать красоту и удовольствие в повседневных моментах",
                    "В напряженные периоды находить маленькие способы наполнить себя радостью",
                    "Балансировать между немедленными удовольствиями и долгосрочным благополучием"
                ]
                : [
                    "Consciously notice beauty and pleasure in everyday moments",
                    "During tense periods, find small ways to fill yourself with joy",
                    "Balance immediate pleasures with long-term well-being"
                ]
        },
        {
            id: 34,
            text: lang === "ru" ? "Сексуальность" : "Sexuality",
            icon: "💋",
            actions: lang === "ru"
                ? [
                    "Относиться к своей сексуальности с уважением и принятием, без стыда",
                    "В отношениях открыто и уважительно обсуждать сексуальные потребности и границы",
                    "Понимать сексуальность как часть целостной личности, а не только физический аспект"
                ]
                : [
                    "Treat your sexuality with respect and acceptance, without shame",
                    "In relationships, openly and respectfully discuss sexual needs and boundaries",
                    "Understand sexuality as part of a whole personality, not just a physical aspect"
                ]
        },
        {
            id: 35,
            text: lang === "ru" ? "Мастерство" : "Mastery",
            icon: "🔧",
            actions: lang === "ru"
                ? [
                    "Ежедневно посвящать время развитию навыков, даже по 15 минут",
                    "В обучении фокусироваться на процессе, а не только на результате",
                    "Делиться своими знаниями с другими, что углубляет собственное понимание"
                ]
                : [
                    "Daily dedicate time to skill development, even just 15 minutes",
                    "In learning, focus on the process, not just the result",
                    "Share your knowledge with others, which deepens your own understanding"
                ]
        },
        {
            id: 36,
            text: lang === "ru" ? "Готовность помочь" : "Willingness to help",
            icon: "🤲",
            actions: lang === "ru"
                ? [
                    "Предлагать помощь, когда видишь потребность, а не ждать просьбы",
                    "В помощи другим сохранять границы, чтобы не истощать себя",
                    "Быть открытым к принятию помощи, когда сам в ней нуждаешься"
                ]
                : [
                    "Offer help when you see a need, don't wait to be asked",
                    "When helping others, maintain boundaries to avoid exhausting yourself",
                    "Be open to receiving help when you need it yourself"
                ]
        },
        {
            id: 37,
            text: lang === "ru" ? "Надежность" : "Reliability",
            icon: "🤝",
            actions: lang === "ru"
                ? [
                    "Делать то, что обещал, даже когда это становится неудобным",
                    "В кризисных ситуациях быть тем, на кого можно положиться",
                    "Сообщать заранее, если не можешь выполнить обещание, и предлагать альтернативу"
                ]
                : [
                    "Do what you promised, even when it becomes inconvenient",
                    "In crisis situations, be someone who can be relied upon",
                    "Notify in advance if you can't keep a promise and offer an alternative"
                ]
        }
    ];

    // Перемешиваем массив для случайного порядка
    return [...values].sort(() => Math.random() - 0.5);
};