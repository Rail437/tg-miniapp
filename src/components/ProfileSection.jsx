// src/components/ProfileSection.jsx
import React, {useEffect, useState} from "react";
import {apiClient} from "../api/apiClient";
import {AnimatePresence, motion} from "framer-motion";
import {useTranslation} from "../i18n";

export const ProfileSection = ({userId}) => {
    const {t, lang} = useTranslation();
    const [referralLink, setReferralLink] = useState("");
    const [referrals, setReferrals] = useState([]);
    const [lastResult, setLastResult] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(false);
    const [showTypeModal, setShowTypeModal] = useState(false);

    const locale = lang === "ru" ? "ru-RU" : "en-US";

    useEffect(() => {
        if (!userId) {
            setLoading(false);
            return;
        }

        async function loadData() {
            try {
                setLoading(true);
                setError(false);

                const [refData, invited, result] = await Promise.all([
                    apiClient.getMyReferral(userId),
                    apiClient.getMyInvited(userId),
                    apiClient.getLastResult(userId),
                ]);

                setReferralLink(refData.link);
                setReferrals(invited);
                setLastResult(result?.[lang]);
            } catch (e) {
                console.error("ProfileSection load error", e);
                setError(true);
            } finally {
                setLoading(false);
            }
        }

        loadData();
    }, [userId]);

    const copyToClipboard = () => {
        if (!referralLink) return;
        navigator.clipboard.writeText(referralLink);
    };

    if (!userId) {
        return (
            <div className="text-sm text-gray-500">
                {t("profile.initText")}
            </div>
        );
    }

    return (
        <>
            <div className="space-y-6">
                {/* Блок с психотипом */}
                <div className="bg-white/80 rounded-2xl p-5 shadow-md border border-white/80">
                    <h2 className="text-lg font-bold mb-3 text-gray-900">
                        {t("profile.typeTitle")}
                    </h2>

                    {loading ? (
                        <div className="text-sm text-gray-500">
                            {t("profile.loading")}
                        </div>
                    ) : error ? (
                        <div className="text-sm text-red-500">
                            {t("profile.loadError")}
                        </div>
                    ) : lastResult ? (
                        <button
                            type="button"
                            onClick={() => setShowTypeModal(true)}
                            className="w-full text-left flex items-start gap-3 group"
                        >
                            <div
                                className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-500 to-purple-500 flex items-center justify-center text-white text-xl shadow-md">
                                🧠
                            </div>
                            <div className="flex-1">
                                <div className="font-semibold text-gray-900 flex items-center gap-2">
                                    <span>{lastResult.label}</span>
                                    <span
                                        className="text-[10px] px-2 py-0.5 rounded-full bg-blue-50 text-blue-600 uppercase tracking-wide">
                                        {t("profile.badgeDetailed")}
                                    </span>
                                </div>
                                <div className="text-sm text-gray-600 mt-1 line-clamp-2">
                                    {lastResult.description}
                                </div>
                                <div className="mt-2 text-xs text-gray-400">
                                    {t("profile.resultFrom")}{" "}
                                    {new Date(lastResult.createdAt).toLocaleDateString(locale)}
                                </div>
                                <div className="mt-2 text-xs text-blue-500 group-hover:underline">
                                    {t("profile.clickToRead")}
                                </div>
                            </div>
                        </button>
                    ) : (
                        <div className="text-sm text-gray-500">
                            {t("profile.noTestYet")}
                        </div>
                    )}
                </div>

                {/* Блок с реферальной ссылкой */}
                <div className="bg-white/80 rounded-2xl p-5 shadow-md border border-white/80">
                    <h2 className="text-lg font-bold mb-3 text-gray-900">
                        {t("profile.referralTitle")}
                    </h2>
                    {loading && !referralLink ? (
                        <div className="text-sm text-gray-500">
                            {t("profile.loading")}
                        </div>
                    ) : (
                        <>
                            <div className="flex gap-2">
                                <input
                                    type="text"
                                    readOnly
                                    value={referralLink}
                                    className="flex-1 p-2.5 rounded-xl border border-gray-200 bg-gray-50 text-xs text-gray-700"
                                />
                                <button
                                    onClick={copyToClipboard}
                                    className="px-3 py-2 rounded-xl bg-blue-600 text-white text-xs font-medium hover:bg-blue-700 transition-colors"
                                >
                                    {t("profile.referralCopy")}
                                </button>
                            </div>
                            <p className="text-xs text-gray-500 mt-2">
                                {t("profile.referralHint")}
                            </p>
                        </>
                    )}
                </div>

                {/* Блок с приглашёнными */}
                <div className="bg-white/80 rounded-2xl p-5 shadow-md border border-white/80">
                    <h2 className="text-lg font-bold mb-3 text-gray-900">
                        {t("profile.invitedTitle")}
                    </h2>
                    {loading && referrals.length === 0 ? (
                        <div className="text-sm text-gray-500">
                            {t("profile.loading")}
                        </div>
                    ) : referrals.length === 0 ? (
                        <p className="text-sm text-gray-500">
                            {t("profile.invitedNone")}
                        </p>
                    ) : (
                        <div className="space-y-2">
                            {referrals.map((item, idx) => (
                                <div
                                    key={idx}
                                    className="flex justify-between items-center bg-gray-50 rounded-xl px-3 py-2 text-xs"
                                >
                                    <div className="flex flex-col">
                                        <span className="font-medium text-gray-800">
                                            {t("profile.invitedUserPrefix")}{" "}
                                            {item.invitedUserId.slice(0, 6)}…
                                        </span>
                                        {item.resultLabel && (
                                            <span className="text-gray-500">
                                                {item.resultLabel}
                                            </span>
                                        )}
                                    </div>
                                    <span className="text-gray-400">
                                        {new Date(item.joinedAt).toLocaleDateString(locale)}
                                    </span>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>

            {/* Модалка с подробным описанием психотипа */}
            <AnimatePresence>
                {showTypeModal && lastResult && (
                    <motion.div
                        className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 px-4"
                        initial={{opacity: 0}}
                        animate={{opacity: 1}}
                        exit={{opacity: 0}}
                    >
                        <motion.div
                            className="bg-white/95 backdrop-blur-2xl rounded-3xl p-6 w-full max-w-md shadow-2xl border border-white/80"
                            initial={{scale: 0.9, opacity: 0, y: 20}}
                            animate={{scale: 1, opacity: 1, y: 0}}
                            exit={{scale: 0.9, opacity: 0, y: 20}}
                            transition={{duration: 0.25}}
                        >
                            <div className="flex justify-between items-start mb-4">
                                <div>
                                    <div className="text-xs uppercase tracking-wide text-blue-500 mb-1">
                                        {t("profile.modalTag")}
                                    </div>
                                    <h3 className="text-xl font-bold text-gray-900">
                                        {lastResult.label}
                                    </h3>
                                    <div className="text-xs text-gray-400 mt-1">
                                        {t("profile.modalDeterminedAt")}{" "}
                                        {new Date(lastResult.createdAt).toLocaleDateString(locale)}
                                    </div>
                                </div>
                                <button
                                    onClick={() => setShowTypeModal(false)}
                                    className="text-gray-400 hover:text-gray-600 text-2xl leading-none"
                                >
                                    &times;
                                </button>
                            </div>

                            <div
                                className="w-12 h-12 rounded-2xl bg-gradient-to-br from-blue-500 to-purple-500 flex items-center justify-center text-white text-2xl mb-4">
                                🧠
                            </div>

                            <p className="text-sm text-gray-700 mb-4">
                                {lastResult.description}
                            </p>

                            {/* Заглушки под будущие "сильные стороны / риски" */}
                            <div className="space-y-3 text-sm">
                                <div>
                                    <div className="font-semibold text-gray-900 mb-1">
                                        {t("profile.modalWhatGives")}
                                    </div>
                                    <ul className="list-disc list-inside text-gray-700 space-y-1">
                                        <li>{t("profile.modalBullet1")}</li>
                                        <li>{t("profile.modalBullet2")}</li>
                                        <li>{t("profile.modalBullet3")}</li>
                                    </ul>
                                </div>
                            </div>

                            <button
                                onClick={() => setShowTypeModal(false)}
                                className="mt-6 w-full py-2.5 rounded-2xl bg-gray-100 text-gray-700 text-sm font-medium hover:bg-gray-200 transition-colors"
                            >
                                {t("profile.modalClose")}
                            </button>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </>
    );
};
