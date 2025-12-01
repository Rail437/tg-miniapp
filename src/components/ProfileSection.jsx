// src/components/ProfileSection.jsx
import React, { useState, useEffect } from "react";

export const ProfileSection = ({ userId }) => {
    const [referralLink, setReferralLink] = useState("");
    const [referrals, setReferrals] = useState([]);
    const [copied, setCopied] = useState(false);

    useEffect(() => {
        // Пока просто моки, потом сюда подставим реальный API
        const mockUserId = Math.random().toString(36).substring(2, 10);
        setReferralLink(`${window.location.origin}?ref=${mockUserId}`);

        setReferrals([
            { id: 1, name: "Алексей", date: "2025-11-25" },
            { id: 2, name: "Екатерина", date: "2025-11-28" },
        ]);
    }, [userId]);

    const copyToClipboard = () => {
        if (!referralLink) return;
        navigator.clipboard.writeText(referralLink);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    return (
        <div className="space-y-8">
            {/* Блок с реферальной ссылкой */}
            <div className="bg-white rounded-2xl p-6 shadow-lg">
                <h2 className="text-xl font-bold mb-4 text-gray-800">
                    Ваша реферальная ссылка
                </h2>
                <div className="flex gap-3">
                    <input
                        type="text"
                        value={referralLink}
                        readOnly
                        className="flex-1 p-3 border border-gray-300 rounded-xl bg-gray-50 text-sm"
                    />
                    <button
                        onClick={copyToClipboard}
                        className="px-4 py-3 bg-blue-600 text-white rounded-xl font-medium hover:bg-blue-700 transition-colors"
                    >
                        {copied ? "Скопировано!" : "Копировать"}
                    </button>
                </div>
                <p className="text-sm text-gray-500 mt-3">
                    Отправьте эту ссылку друзьям. За каждого зарегистрировавшегося вы
                    получите бонус!
                </p>
            </div>

            {/* Блок с приглашёнными друзьями */}
            <div className="bg-white rounded-2xl p-6 shadow-lg">
                <h2 className="text-xl font-bold mb-4 text-gray-800">
                    Приглашённые друзья
                </h2>
                {referrals.length > 0 ? (
                    <div className="space-y-3">
                        {referrals.map((referral) => (
                            <div
                                key={referral.id}
                                className="flex justify-between items-center p-3 bg-gray-50 rounded-xl"
                            >
                <span className="font-medium text-gray-700">
                  {referral.name}
                </span>
                                <span className="text-sm text-gray-500">
                  {referral.date}
                </span>
                            </div>
                        ))}
                    </div>
                ) : (
                    <p className="text-gray-500 text-center py-4">
                        Вы пока никого не пригласили
                    </p>
                )}
            </div>
        </div>
    );
};
