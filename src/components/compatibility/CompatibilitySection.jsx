import React, { useEffect, useMemo, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { useTranslation } from "../../i18n";
import { compatibilityTexts } from "../../i18n.compatibility";
import { apiClient } from "../../api/apiClient";
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

function Pill({ active, onClick, children }) {
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

function WheelPicker({ lang, selectedId, onSelect }) {
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

export function CompatibilitySection({ userId, lastResult, compatibilityEnabled }) {
    const { lang } = useTranslation();
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

    useEffect(() => {
        if (!open) setInitialized(false);
    }, [open]);

    const completedInvited = useMemo(
        () => invited.filter((item) => item?.completed),
        [invited]
    );

    const localizedResult = useMemo(() => {
        if (!lastResult) return null;
        return lastResult[lang] || lastResult.ru || lastResult.en || null;
    }, [lastResult, lang]);

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

    const priceLabel = useMemo(() => (price ? `${price.priceStars ?? 0}` : ""), [price]);

    const handlePurchase = async () => {
        if (!userId || !selectedTargetId) return;

        setIsBuying(true);
        setPurchaseError(null);

        const targetType = targetMode === "invited" ? "invited" : "type";
        const targetId = selectedTargetId;

        try {
            // Создаём инвойс на бэкенде
            const invoice = await apiClient.createCompatibilityInvoice({
                userId,
                targetType,
                targetId,
            });

            if (!invoice?.telegramInvoiceLink) throw new Error("Invoice link missing");

            // Открываем Telegram Stars invoice
            Telegram.WebApp.openInvoice(invoice.telegramInvoiceLink);

            const handleInvoiceClosed = async (event) => {
                Telegram.WebApp.offEvent("invoiceClosed", handleInvoiceClosed);

                if (event.status === "paid") {
                    setToast(t.toastPurchased);
                    setTimeout(() => setToast(null), 2200);

                    // Обновляем историю покупок
                    try {
                        const updatedPurchases = await apiClient.getCompatibilityPurchases(userId);
                        setPurchases(updatedPurchases || []);
                    } catch (e) {
                        console.error("update purchases error", e);
                    }
                } else {
                    setToast(t.toastCancelled || "Платёж отменён");
                    setTimeout(() => setToast(null), 2200);
                }
            };

            Telegram.WebApp.onEvent("invoiceClosed", handleInvoiceClosed);
        } catch (e) {
            console.error("purchase error", e);
            setPurchaseError(t.purchaseError);
        } finally {
            setIsBuying(false);
        }
    };

    const openPurchaseResult = async (purchaseId) => {
        try {
            const res = await apiClient.getCompatibilityResult(purchaseId);
            if (res?.result) setActiveResult({ purchaseId, result: res.result });
        } catch (e) {
            console.error("open result error", e);
        }
    };

    const disabled = !selectedTargetId || !price || isBuying;

    return (
        <>
            {/* Кнопка открытия секции */}
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
                        <div className="font-semibold text-gray-900 text-sm">{t.title}</div>
                        <div className="text-xs text-gray-500">
                            {compatibilityEnabled ? t.subtitle : t.locked}
                        </div>
                    </div>
                </div>
            </button>

            {/* Тут идёт твоя остальная разметка секции: выбор target, список покупок, результаты и тосты */}
            {/* Используем handlePurchase для кнопки Buy */}

            <button
                type="button"
                disabled={disabled}
                onClick={handlePurchase}
                className={`w-full py-3 rounded-xl text-sm font-semibold transition-all ${
                    disabled
                        ? "bg-gray-200 text-gray-500 cursor-not-allowed"
                        : "bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-md hover:shadow-lg"
                }`}
            >
                {price ? t.ctaBuy.replace("{{price}}", priceLabel) : t.ctaDisabled}
            </button>
        </>
    );
}
