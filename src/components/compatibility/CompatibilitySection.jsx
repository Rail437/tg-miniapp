import React, {useEffect, useMemo, useState, useCallback} from "react";
import {AnimatePresence, motion} from "framer-motion";
import {useTranslation} from "../../i18n";
import {compatibilityTexts} from "../../i18n.compatibility";
import {apiClient} from "../../api/apiClient";
import allTypes from "../../data/allTypes.json";

const typeOptions = Object.keys(allTypes).map((key) => {
    const meta = allTypes[key] || {};
    return {
        typeId: key,
        nickname: meta.nickname?.ru || meta.codeRu || key,
        nicknameEn: meta.nickname?.en || key,
    };
});

function formatTypeLabel(option, lang) {
    if (!option) return "";
    return lang === "ru" ? option.nickname : option.nicknameEn || option.nickname;
}

function Pill({active, onClick, children}) {
    return (
        <button
            type="button"
            onClick={onClick}
            className={`px-3 py-1.5 rounded-full text-xs font-medium transition-all ${
                active
                    ? "bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-sm"
                    : "bg-gray-100 text-gray-600 hover:bg-gray-200"
            }`}
        >
            {children}
        </button>
    );
}

function WheelPicker({lang, selectedId, onSelect}) {
    return (
        <div className="relative">
            <div className="absolute inset-x-0 top-0 h-8 bg-gradient-to-b from-white via-white/40 to-transparent pointer-events-none rounded-t-2xl" />
            <div className="absolute inset-x-0 bottom-0 h-8 bg-gradient-to-t from-white via-white/40 to-transparent pointer-events-none rounded-b-2xl" />
            <div className="max-h-56 overflow-y-auto rounded-2xl border border-gray-100 bg-white/80 shadow-inner px-2 py-3 space-y-2">
                {typeOptions.map((opt) => {
                    const active = opt.typeId === selectedId;
                    return (
                        <button
                            key={opt.typeId}
                            type="button"
                            onClick={() => onSelect(opt.typeId)}
                            className={`w-full text-left px-3 py-2 rounded-xl transition-all ${
                                active
                                    ? "bg-blue-50 border border-blue-200 text-blue-700 shadow-sm"
                                    : "hover:bg-gray-50 text-gray-800"
                            }`}
                        >
                            <div className="text-sm font-semibold">{formatTypeLabel(opt, lang)}</div>
                            <div className="text-[11px] text-gray-500">{opt.typeId}</div>
                        </button>
                    );
                })}
            </div>
        </div>
    );
}

export function CompatibilitySection({userId, lastResult, compatibilityEnabled}) {
    const {lang} = useTranslation();
    const t = compatibilityTexts[lang] || compatibilityTexts.ru;

    const [open, setOpen] = useState(false);
    const [initialized, setInitialized] = useState(false);
    const [price, setPrice] = useState(null);
    const [priceError, setPriceError] = useState(false);
    const [invited, setInvited] = useState([]);
    const [loadingInvited, setLoadingInvited] = useState(false);
    const [purchases, setPurchases] = useState([]);
    const [loadingPurchases, setLoadingPurchases] = useState(false);
    const [targetMode, setTargetMode] = useState("invited");
    const [selectedTargetId, setSelectedTargetId] = useState(null);
    const [isBuying, setIsBuying] = useState(false);
    const [activeResult, setActiveResult] = useState(null);
    const [toast, setToast] = useState(null);
    const [purchaseError, setPurchaseError] = useState(null);
    const [purchaseRefresh, setPurchaseRefresh] = useState(0);

    useEffect(() => {
        if (!open) {
            setInitialized(false);
            setPurchaseError(null);
        }
    }, [open]);

    const completedInvited = useMemo(
        () => invited.filter((item) => item?.completed),
        [invited],
    );

    const localizedResult = useMemo(() => {
        if (!lastResult) return null;
        if (lastResult[lang]) return lastResult[lang];
        if (lastResult.ru) return lastResult.ru;
        if (lastResult.en) return lastResult.en;
        return null;
    }, [lastResult, lang]);

    const loadPurchases = useCallback(async () => {
        if (!userId) return;

        try {
            setLoadingPurchases(true);
            const purchasesData = await apiClient.getCompatibilityPurchases(userId);

            console.log("Loaded purchases from API:", purchasesData); // Отладка

            // Проверяем и нормализуем данные
            const normalizedPurchases = Array.isArray(purchasesData)
                ? purchasesData.map(p => ({
                    id: p.id || p._id,
                    userId: p.userId,
                    targetType: p.targetType,
                    targetId: p.targetId,
                    status: p.status || 'pending',
                    displayName: p.displayName,
                    displayNameRu: p.displayNameRu,
                    displayNameEn: p.displayNameEn,
                    createdAt: p.createdAt || p.purchaseDate,
                    resultReady: p.resultReady || false
                }))
                : [];

            setPurchases(normalizedPurchases);
        } catch (e) {
            console.error("load purchases error", e);
            setPurchaseError(t.purchaseLoadError || "Ошибка загрузки покупок");
        } finally {
            setLoadingPurchases(false);
        }
    }, [userId, t]);

    useEffect(() => {
        if (!open || !compatibilityEnabled || !userId) return;

        const loadAllData = async () => {
            try {
                setPriceError(false);
                setLoadingInvited(true);

                // Загружаем параллельно только price и invited
                const [priceData, invitedData] = await Promise.all([
                    apiClient.getCompatibilityPrice(),
                    apiClient.getMyInvited(userId),
                ]);

                setPrice(priceData);
                setInvited(invitedData || []);

                // Отдельно загружаем покупки
                await loadPurchases();

                if (!initialized) {
                    const hasCompleted = invitedData?.some((i) => i.completed);
                    if (hasCompleted && !selectedTargetId) {
                        const firstCompleted = invitedData.find((i) => i.completed);
                        if (firstCompleted) {
                            setTargetMode("invited");
                            setSelectedTargetId(firstCompleted.invitedUserId);
                        }
                    } else if (!hasCompleted) {
                        setTargetMode("type");
                        setSelectedTargetId(typeOptions[0]?.typeId || null);
                    }
                    setInitialized(true);
                }
            } catch (e) {
                console.error("load compatibility data error", e);
                setPriceError(true);
            } finally {
                setLoadingInvited(false);
            }
        };

        loadAllData();
    }, [open, compatibilityEnabled, userId, initialized, loadPurchases]); // Добавил loadPurchases в зависимости

    useEffect(() => {
        if (targetMode === "type") {
            const exists = typeOptions.some((opt) => opt.typeId === selectedTargetId);
            if (!exists) {
                setSelectedTargetId(typeOptions[0]?.typeId || null);
            }
        } else if (targetMode === "invited") {
            const exists = completedInvited.some((item) => item.invitedUserId === selectedTargetId);
            if (!exists) {
                setSelectedTargetId(completedInvited[0]?.invitedUserId || null);
            }
        }
    }, [targetMode, selectedTargetId, completedInvited]);

    useEffect(() => {
        if (!open || !compatibilityEnabled || !userId) return;

        const load = async () => {
            try {
                setPriceError(false);
                setLoadingPurchases(true);
                setLoadingInvited(true);

                const [priceData, invitedData, purchasesData] = await Promise.all([
                    apiClient.getCompatibilityPrice(),
                    apiClient.getMyInvited(userId),
                    apiClient.getCompatibilityPurchases(userId),
                ]);

                setPrice(priceData);
                setInvited(invitedData || []);
                setPurchases(purchasesData || []);

                if (!initialized) {
                    const hasCompleted = invitedData?.some((i) => i.completed);
                    if (hasCompleted && !selectedTargetId) {
                        const firstCompleted = invitedData.find((i) => i.completed);
                        if (firstCompleted) {
                            setTargetMode("invited");
                            setSelectedTargetId(firstCompleted.invitedUserId);
                        }
                    } else if (!hasCompleted) {
                        setTargetMode("type");
                        setSelectedTargetId(typeOptions[0]?.typeId || null);
                    }
                    setInitialized(true);
                }
            } catch (e) {
                console.error("load compatibility data error", e);
                setPriceError(true);
            } finally {
                setLoadingPurchases(false);
                setLoadingInvited(false);
            }
        };

        load();
    }, [open, compatibilityEnabled, userId, initialized]);

    const priceLabel = useMemo(() => {
        if (!price) return "";
        const value = price.priceStars ?? 0;
        return `${value}`;
    }, [price]);

    const handlePurchase = async () => {
        if (!userId || !selectedTargetId || !price) return;

        setIsBuying(true);
        setPurchaseError(null);

        // Определяем targetType и targetId
        const targetType = targetMode === "invited" ? "invited" : "type";
        let targetId = selectedTargetId;

        // Для типа личности получаем typeId
        if (targetType === "type") {
            const selectedType = typeOptions.find(opt => opt.typeId === selectedTargetId);
            if (!selectedType) {
                setPurchaseError("Выбранный тип не найден");
                setIsBuying(false);
                return;
            }
            targetId = selectedType.typeId;
        }
        // Для приглашенного пользователя проверяем, что он существует
        else if (targetType === "invited") {
            const invitedUser = completedInvited.find(item => item.invitedUserId === selectedTargetId);
            if (!invitedUser) {
                setPurchaseError("Выбранный пользователь не найден");
                setIsBuying(false);
                return;
            }
            targetId = invitedUser.invitedUserId;
        }

        // Логируем отправляемые данные для отладки
        console.log("Sending purchase request:", {
            userId,
            targetType,
            targetId,
            price: price.priceStars
        });

        try {
            // 1. Создаем инвойс в системе
            const invoice = await apiClient.createCompatibilityInvoice({
                userId,
                targetType, // Убедимся, что это не null
                targetId,   // Убедимся, что это не null
            });

            if (!invoice?.purchaseId) {
                throw new Error("Не удалось создать счет");
            }

            const currentPurchaseId = invoice.purchaseId;

            // 2. Проверяем, находимся ли мы в Telegram WebApp
            const isTelegramWebApp = window.Telegram?.WebApp;
            const webApp = window.Telegram?.WebApp;

            if (isTelegramWebApp && webApp) {
                console.log("В Telegram WebApp, используем встроенные методы");

                // Всегда используем openLink для открытия внутри Telegram
                if (invoice.telegramInvoiceLink || invoice.invoice_url) {
                    const paymentUrl = invoice.telegramInvoiceLink || invoice.invoice_url;

                    // Открываем во встроенном браузере Telegram
                    if (webApp.openInvoice) {
                        webApp.openInvoice(paymentUrl, (status) => {
                            console.log("Invoice status:", status);
                            if (status === "paid") {
                                startPaymentPolling(currentPurchaseId);
                            }
                        });
                    } else {
                        webApp.openLink(paymentUrl);
                    }

                    // Показываем инструкции
                    setToast(t.paymentOpened || "Открываем страницу оплаты...");

                    // Начинаем отслеживать статус
                    startPaymentPolling(currentPurchaseId);

                } else {
                    throw new Error("Нет ссылки для оплаты");
                }

            } else {
                // Не в Telegram - открываем в новом окне
                console.log("Не в Telegram, открываем в новом окне");

                const paymentUrl = invoice.telegramInvoiceLink || invoice.invoice_url;
                if (paymentUrl) {
                    // Открываем в новом окне
                    const newWindow = window.open(paymentUrl, "_blank");
                    if (!newWindow) {
                        setPurchaseError(t.popupBlocked ||
                            "Разрешите всплывающие окна для этого сайта или скопируйте ссылку: " + paymentUrl);
                        setIsBuying(false);
                        return;
                    }

                    showPaymentInstructions();
                    startPaymentPolling(currentPurchaseId);
                } else {
                    throw new Error("Нет ссылки для оплаты");
                }
            }

        } catch (e) {
            console.error("purchase compatibility error", e);

            // Определяем тип ошибки
            if (e.message.includes("недостаточно") || e.message.includes("insufficient")) {
                setPurchaseError(t.insufficientStars || "Недостаточно звезд");
            } else if (e.message.includes("уже куплено") || e.message.includes("already purchased")) {
                setPurchaseError(t.alreadyPurchased || "Вы уже покупали эту совместимость");
            } else if (e.message.includes("targetType") || e.message.includes("null")) {
                setPurchaseError("Ошибка: тип цели не указан. Попробуйте еще раз.");
            } else {
                setPurchaseError(e.message || t.purchaseError || "Ошибка при покупке");
            }

            setIsBuying(false);
        }
    };

    // Вспомогательные функции (вынести из handlePurchase для читаемости)
    const handleSuccessfulPayment = async (purchaseId) => {
        setToast(t.paymentProcessing || "Обработка платежа...");
        await pollPurchaseStatus(purchaseId);
    };

    const showPaymentInstructions = () => {
        setPurchaseError(t.paymentInstructions ||
            "Откройте Telegram для завершения оплаты. После оплаты результат появится в истории покупок.");
    };

    const startPaymentPolling = (purchaseId) => {
        // Запускаем опрос статуса через 3 секунды
        setTimeout(() => pollPurchaseStatus(purchaseId), 3000);
    };

    const pollPurchaseStatus = async (purchaseId) => {
        let attempts = 0;
        const maxAttempts = 30; // 60 секунд максимум (каждые 2 сек)
        let purchaseConfirmed = false;

        while (attempts < maxAttempts && !purchaseConfirmed) {
            await new Promise(resolve => setTimeout(resolve, 2000));
            attempts++;

            try {
                const updatedPurchases = await apiClient.getCompatibilityPurchases(userId);
                const currentPurchase = updatedPurchases?.find(p => p.id === purchaseId);

                if (currentPurchase?.status === "paid" || currentPurchase?.resultReady) {
                    purchaseConfirmed = true;

                    // Обновляем список покупок
                    setPurchases(updatedPurchases);

                    // Пытаемся получить результат
                    try {
                        const resultData = await apiClient.getCompatibilityResult(purchaseId);
                        if (resultData?.result) {
                            setActiveResult({
                                purchaseId: purchaseId,
                                result: resultData.result,
                            });
                            setToast(t.toastPurchased);
                            setTimeout(() => setToast(null), 3000);
                        }
                    } catch (resultError) {
                        console.warn("Could not load result, but purchase is paid:", resultError);
                        setToast(t.purchaseSuccessNoResult || "Покупка завершена, результат готовится");
                        setTimeout(() => setToast(null), 3000);
                    }

                    break;
                }

                // Прогресс для пользователя (каждые 10 секунд)
                if (attempts % 5 === 0) {
                    setToast(`${t.paymentProcessing || "Обработка платежа..."} (${attempts * 2} сек)`);
                }

            } catch (e) {
                console.warn("Проверка статуса покупки:", e);
            }
        }

        if (!purchaseConfirmed) {
            await loadPurchases();
            setToast(t.paymentProcessingSlow ||
                "Платеж обрабатывается. Обновите историю покупок через несколько минут.");
            setTimeout(() => setToast(null), 5000);
        }

        setIsBuying(false);
    };

    const fallbackPayment = async (invoice, purchaseId) => {
        // Fallback метод оплаты
        if (window.Telegram?.WebApp?.openLink) {
            window.Telegram.WebApp.openLink(invoice.telegramInvoiceLink || invoice.invoice_url);
        } else {
            window.open(invoice.telegramInvoiceLink || invoice.invoice_url, "_blank");
        }
        showPaymentInstructions();
        startPaymentPolling(purchaseId);
    };

    const openPurchaseResult = async (purchaseId) => {
        try {
            const res = await apiClient.getCompatibilityResult(purchaseId);
            if (res?.result) {
                setActiveResult({purchaseId, result: res.result});
                // Обновляем список покупок после открытия
                await loadPurchases();
            }
        } catch (e) {
            console.error("open result error", e);
            setPurchaseError(t.resultLoadError || "Ошибка загрузки результата");
        }
    };

    const renderPurchaseList = () => {
        if (loadingPurchases && purchases.length === 0) {
            return (
                <div className="flex flex-col items-center justify-center py-4">
                    <div className="w-6 h-6 border-2 border-blue-600 border-t-transparent rounded-full animate-spin mb-2"></div>
                    <div className="text-xs text-gray-500">{t.loading}</div>
                </div>
            );
        }

        console.log("All purchases:", purchases); // Добавьте для отладки

        // Фильтруем покупки - показываем все, но с разными статусами
        const validPurchases = purchases || [];

        if (validPurchases.length === 0) {
            return <div className="text-xs text-gray-500">{t.purchaseNone}</div>;
        }

        // Сортируем по дате (новые сверху)
        const sortedPurchases = [...validPurchases].sort((a, b) =>
            new Date(b.createdAt) - new Date(a.createdAt)
        );

        return (
            <div className="space-y-2">
                {sortedPurchases.map((p) => {
                    // Определяем статус покупки
                    const isPaid = p.status === "paid" || p.status === "completed" || p.resultReady;
                    const isPending = p.status === "pending" || !p.status;
                    const isFailed = p.status === "failed" || p.status === "canceled";

                    // Получаем отображаемое имя
                    let displayName = p.targetId;

                    // Если это тип личности, находим его данные
                    if (p.targetType === "type") {
                        const typeData = typeOptions.find(opt => opt.typeId === p.targetId);
                        if (typeData) {
                            displayName = formatTypeLabel(typeData, lang);
                        }
                    }
                    // Если это приглашенный пользователь
                    else if (p.targetType === "invited" && p.displayName) {
                        displayName = p.displayName;
                    }

                    return (
                        <div
                            key={p.id}
                            className="flex items-center justify-between rounded-xl border border-gray-100 bg-gray-50 px-3 py-2"
                        >
                            <div className="flex-1 min-w-0">
                                <div className="text-sm font-semibold text-gray-900 truncate">
                                    {displayName}
                                    {p.targetType === "type" && (
                                        <span className="text-xs text-gray-400 ml-1">
                                        ({p.targetId})
                                    </span>
                                    )}
                                </div>
                                <div className="text-[11px] text-gray-500">
                                    {new Date(p.createdAt).toLocaleDateString(lang === "ru" ? "ru-RU" : "en-US", {
                                        day: 'numeric',
                                        month: 'short',
                                        year: 'numeric'
                                    })}
                                    {p.status && ` • ${getStatusText(p.status, t)}`}
                                </div>
                            </div>
                            <div className="flex items-center gap-2 flex-shrink-0">
                            <span className={`text-[11px] px-2 py-1 rounded-full whitespace-nowrap ${
                                isPaid ? "bg-emerald-50 text-emerald-600" :
                                    isPending ? "bg-yellow-50 text-yellow-600" :
                                        "bg-red-50 text-red-600"
                            }`}>
                                {isPaid ? t.purchasePaid :
                                    isPending ? (t.purchasePending || "Ожидание") :
                                        (t.purchaseFailed || "Ошибка")}
                            </span>
                                {isPaid && (
                                    <button
                                        type="button"
                                        onClick={() => openPurchaseResult(p.id)}
                                        className="text-xs font-semibold text-blue-600 hover:underline whitespace-nowrap"
                                    >
                                        {t.purchaseOpen}
                                    </button>
                                )}
                            </div>
                        </div>
                    );
                })}
            </div>
        );
    };

// Вспомогательная функция для перевода статусов
    const getStatusText = (status, t) => {
        const statusMap = {
            'pending': t.purchasePending || 'В ожидании',
            'paid': t.purchasePaid || 'Оплачено',
            'completed': t.purchaseCompleted || 'Завершено',
            'failed': t.purchaseFailed || 'Ошибка',
            'canceled': t.purchaseCanceled || 'Отменено'
        };
        return statusMap[status] || status;
    };

    const renderTargetSelector = () => {
        if (targetMode === "invited") {
            if (loadingInvited) {
                return <div className="text-xs text-gray-500">{t.loading}</div>;
            }
            if (!completedInvited.length) {
                return (
                    <div className="text-xs text-gray-500 space-y-1">
                        <div>{t.inviteCompletedOnly}</div>
                        <div>{t.inviteEmpty}</div>
                    </div>
                );
            }
            return (
                <div className="space-y-2">
                    {completedInvited.map((item) => {
                        const active = selectedTargetId === item.invitedUserId;
                        return (
                            <button
                                key={item.invitedUserId}
                                type="button"
                                onClick={() => setSelectedTargetId(item.invitedUserId)}
                                className={`w-full text-left px-3 py-2 rounded-xl border transition-all ${
                                    active
                                        ? "border-blue-300 bg-blue-50 text-blue-700"
                                        : "border-gray-100 bg-white hover:bg-gray-50"
                                }`}
                            >
                                <div className="text-sm font-semibold">
                                    {item.name ||
                                        `${item.invitedUserId?.slice(0, 6) ?? ""}…`}
                                </div>
                                <div className="text-[11px] text-gray-500">
                                    {t.purchasePaid}
                                </div>
                            </button>
                        );
                    })}
                </div>
            );
        }

        return (
            <div className="space-y-3">
                <div className="text-xs text-gray-500">{t.typePickerHint}</div>
                <WheelPicker
                    lang={lang}
                    selectedId={selectedTargetId || typeOptions[0]?.typeId}
                    onSelect={(id) => setSelectedTargetId(id)}
                />
            </div>
        );
    };

    const disabled = !selectedTargetId || !price || isBuying;

    return (
        <>
            <button
                onClick={() => setOpen(true)}
                className="w-full p-4 rounded-2xl bg-white/70 backdrop-blur-md shadow-md text-left"
                disabled={!compatibilityEnabled}
            >
                <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-blue-500 to-purple-500 flex items-center justify-center text-white text-lg">
                        🤝
                    </div>
                    <div>
                        <div className="font-semibold text-gray-900 text-sm">
                            {t.title}
                        </div>
                        <div className="text-xs text-gray-500">
                            {compatibilityEnabled ? t.subtitle : t.locked}
                        </div>
                        {compatibilityEnabled && price && (
                            <div className="text-xs text-blue-600 font-semibold mt-1">
                                {priceLabel} ⭐
                            </div>
                        )}
                    </div>
                </div>
            </button>

            <AnimatePresence>
                {open && (
                    <motion.div
                        className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 px-4"
                        initial={{opacity: 0}}
                        animate={{opacity: 1}}
                        exit={{opacity: 0}}
                    >
                        <motion.div
                            className="bg-white rounded-2xl p-5 shadow-lg w-full max-w-lg max-h-[80vh] flex flex-col"
                            initial={{y: 40, opacity: 0}}
                            animate={{y: 0, opacity: 1}}
                            exit={{y: 40, opacity: 0}}
                        >
                            <div className="flex justify-between items-start gap-2">
                                <div>
                                    <h3 className="text-lg font-bold text-gray-900">
                                        {t.title}
                                    </h3>
                                    <p className="text-sm text-gray-600">{t.subtitle}</p>
                                    {localizedResult && (
                                        <p className="text-xs text-gray-500 mt-1">
                                            {lang === "ru" ? "Ваш тип: " : "Your type: "}
                                            <span className="font-semibold text-gray-800">
                                                {localizedResult.label}
                                            </span>
                                        </p>
                                    )}
                                </div>
                                <button
                                    onClick={() => setOpen(false)}
                                    className="text-gray-400 hover:text-gray-600 text-xl leading-none"
                                >
                                    ×
                                </button>
                            </div>

                            {!compatibilityEnabled ? (
                                <div className="mt-4 text-sm text-gray-600">{t.locked}</div>
                            ) : (
                                <div className="flex-1 overflow-y-auto mt-4 space-y-4 pr-1">
                                    <div className="space-y-2">
                                        <div className="text-xs font-semibold text-gray-700">
                                            {t.chooseMode}
                                        </div>
                                        <div className="flex gap-2">
                                            <Pill
                                                active={targetMode === "invited"}
                                                onClick={() => setTargetMode("invited")}
                                            >
                                                {t.modeInvited}
                                            </Pill>
                                            <Pill
                                                active={targetMode === "type"}
                                                onClick={() => setTargetMode("type")}
                                            >
                                                {t.modeType}
                                            </Pill>
                                        </div>
                                        <div className="mt-3 space-y-1">
                                            <div className="text-sm font-semibold text-gray-800">
                                                {targetMode === "invited"
                                                    ? t.inviteListTitle
                                                    : t.typePickerTitle}
                                            </div>
                                            {renderTargetSelector()}
                                        </div>
                                    </div>

                                    {/* Сообщения об ошибках */}
                                    {purchaseError && (
                                        <div className="text-xs text-red-500 bg-red-50 p-2 rounded-lg">
                                            {purchaseError}
                                        </div>
                                    )}

                                    {/* Кнопка покупки с информацией о цене */}
                                    <div className="space-y-2">
                                        <div className="flex justify-between items-center text-sm">
                                            <span className="text-gray-600">
                                                {lang === "ru" ? "Стоимость:" : "Price:"}
                                            </span>
                                            <span className="font-semibold text-yellow-600">
                                                {priceLabel} ⭐
                                            </span>
                                        </div>
                                        <button
                                            type="button"
                                            disabled={disabled}
                                            onClick={handlePurchase}
                                            className={`w-full py-3 rounded-xl text-sm font-semibold transition-all flex items-center justify-center gap-2 ${
                                                disabled
                                                    ? "bg-gray-200 text-gray-500 cursor-not-allowed"
                                                    : "bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-md hover:shadow-lg hover:from-blue-700 hover:to-purple-700"
                                            }`}
                                        >
                                            {isBuying ? (
                                                <>
                                                    <span
                                                        className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
                                                    {t.buying || "Покупка..."}
                                                </>
                                            ) : price ? (
                                                t.ctaBuy.replace("{{price}}", priceLabel)
                                            ) : (
                                                t.ctaDisabled
                                            )}
                                        </button>
                                        <p className="text-xs text-gray-500 text-center">
                                            {lang === "ru"
                                                ? "Оплата через Telegram Stars"
                                                : "Payment via Telegram Stars"}
                                        </p>
                                    </div>

                                    <div className="border-t border-gray-100 pt-3 space-y-2">
                                        <div className="flex justify-between items-center">
                                            <div className="text-sm font-semibold text-gray-800">
                                                {t.purchasesTitle}
                                            </div>
                                            <button
                                                type="button"
                                                onClick={loadPurchases}
                                                disabled={loadingPurchases}
                                                className="text-xs text-blue-600 hover:text-blue-800 disabled:text-gray-400 flex items-center gap-1"
                                            >
                                                {loadingPurchases ? (
                                                    <>
                                                        <span
                                                            className="w-3 h-3 border-2 border-blue-600 border-t-transparent rounded-full animate-spin"></span>
                                                        {t.loading}
                                                    </>
                                                ) : (
                                                    <>
                                                        ↻ {t.refresh || "Обновить"}
                                                    </>
                                                )}
                                            </button>
                                        </div>
                                        {renderPurchaseList()}
                                    </div>
                                </div>
                            )}
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Модальное окно с результатом */}
            <AnimatePresence>
                {activeResult && (
                    <motion.div
                        className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 px-4"
                        initial={{opacity: 0}}
                        animate={{opacity: 1}}
                        exit={{opacity: 0}}
                    >
                        <motion.div
                            className="bg-white rounded-2xl p-5 shadow-lg w-full max-w-lg max-h-[80vh] flex flex-col"
                            initial={{y: 40, opacity: 0}}
                            animate={{y: 0, opacity: 1}}
                            exit={{y: 40, opacity: 0}}
                        >
                            <div className="flex justify-between items-start gap-2 mb-2">
                                <div>
                                    <div className="text-sm uppercase tracking-wide text-gray-400">
                                        {t.resultTitle}
                                    </div>
                                    <h3 className="text-lg font-bold text-gray-900">
                                        {activeResult.result?.title?.[lang] ||
                                            activeResult.result?.title?.ru ||
                                            t.resultTitle}
                                    </h3>
                                </div>
                                <button
                                    onClick={() => setActiveResult(null)}
                                    className="text-gray-400 hover:text-gray-600 text-xl leading-none"
                                >
                                    ×
                                </button>
                            </div>
                            <div className="flex-1 overflow-y-auto pr-1 space-y-3">
                                {activeResult.result ? (
                                    <>
                                        <p className="text-sm text-gray-700">
                                            {activeResult.result.summary?.[lang] ||
                                                activeResult.result.summary?.ru ||
                                                ""}
                                        </p>
                                        {activeResult.result.strengths && (
                                            <div>
                                                <div className="text-xs font-semibold text-gray-500 mb-1">
                                                    {lang === "ru" ? "Сильные стороны" : "Strengths"}
                                                </div>
                                                <ul className="space-y-1">
                                                    {activeResult.result.strengths.map((s, idx) => (
                                                        <li
                                                            key={idx}
                                                            className="text-sm text-gray-700 bg-gray-50 rounded-lg px-3 py-2"
                                                        >
                                                            {s[lang] || s.ru || s}
                                                        </li>
                                                    ))}
                                                </ul>
                                            </div>
                                        )}
                                        {activeResult.result.risks && (
                                            <div>
                                                <div className="text-xs font-semibold text-gray-500 mb-1">
                                                    {lang === "ru" ? "Риски" : "Risks"}
                                                </div>
                                                <ul className="space-y-1">
                                                    {activeResult.result.risks.map((s, idx) => (
                                                        <li
                                                            key={idx}
                                                            className="text-sm text-gray-700 bg-gray-50 rounded-lg px-3 py-2"
                                                        >
                                                            {s[lang] || s.ru || s}
                                                        </li>
                                                    ))}
                                                </ul>
                                            </div>
                                        )}
                                        {activeResult.result.advice && (
                                            <div>
                                                <div className="text-xs font-semibold text-gray-500 mb-1">
                                                    {lang === "ru" ? "Рекомендации" : "Advice"}
                                                </div>
                                                <ul className="space-y-1">
                                                    {activeResult.result.advice.map((s, idx) => (
                                                        <li
                                                            key={idx}
                                                            className="text-sm text-gray-700 bg-gray-50 rounded-lg px-3 py-2"
                                                        >
                                                            {s[lang] || s.ru || s}
                                                        </li>
                                                    ))}
                                                </ul>
                                            </div>
                                        )}
                                    </>
                                ) : (
                                    <div className="text-sm text-gray-600">{t.resultEmpty}</div>
                                )}
                            </div>
                            <button
                                type="button"
                                onClick={() => setActiveResult(null)}
                                className="mt-4 w-full py-2 rounded-xl bg-gray-200 font-semibold text-gray-800 hover:bg-gray-300 transition-colors"
                            >
                                {t.close}
                            </button>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Toast уведомление */}
            <AnimatePresence>
                {toast && (
                    <motion.div
                        initial={{opacity: 0, y: 20}}
                        animate={{opacity: 1, y: 0}}
                        exit={{opacity: 0, y: 20}}
                        className="fixed bottom-6 left-1/2 -translate-x-1/2 bg-gray-900 text-white text-sm px-4 py-2 rounded-xl shadow-lg z-50"
                    >
                        {toast}
                    </motion.div>
                )}
            </AnimatePresence>
        </>
    );
}