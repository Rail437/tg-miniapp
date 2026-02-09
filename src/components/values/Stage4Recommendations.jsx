// Stage4Recommendations.jsx
import React from "react";
import { motion } from "framer-motion";

export { Stage4Recommendations };
const Stage4Recommendations = ({
                                   stepThreeValues,
                                   onFinish,
                                   onSave,
                                   isSaving,
                                   lang,
                                   hasSavedValues = false,
                                   onRestart,
                                   savedValuesData = null
                               }) => {
    const selectedFinalValues = stepThreeValues.filter(v => v.selected);

    // Проверяем, есть ли действия у ценностей
    const hasActions = selectedFinalValues.some(value =>
        value.actions && Array.isArray(value.actions) && value.actions.length > 0
    );

    return (
        <div className="mb-8">
            <div className="bg-gradient-to-br from-green-50 to-emerald-50 border border-green-200 rounded-3xl p-6 mb-8">
                <h2 className="text-2xl font-bold text-gray-900 mb-4 text-center">
                    {lang === "ru" ? "🎉 Ваши ключевые ценности!" : "🎉 Your Key Values!"}
                </h2>

                <div className="flex flex-wrap justify-center gap-3 mb-8">
                    {selectedFinalValues.map((value, index) => (
                        <motion.div
                            key={value.id}
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ delay: index * 0.1 }}
                            className="flex items-center gap-2 bg-white px-4 py-3 rounded-xl border border-green-300 shadow-sm"
                        >
                            <span className="text-2xl">{value.icon}</span>
                            <span className="font-bold text-gray-900">{value.text}</span>
                            <span className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded-full">
                                #{index + 1}
                            </span>
                        </motion.div>
                    ))}
                </div>

                <p className="text-gray-700 text-center mb-2">
                    {lang === "ru"
                        ? "Эти ценности отражают то, что действительно важно для вас. Интегрируйте их в свою повседневную жизнь с помощью предложенных действий."
                        : "These values reflect what's truly important to you. Integrate them into your daily life using the suggested actions."}
                </p>
            </div>

            {hasActions ? (
                <>
                    <h3 className="text-xl font-bold text-gray-900 mb-6 text-center">
                        {lang === "ru" ? "Рекомендованные действия" : "Recommended Actions"}
                    </h3>

                    <div className="space-y-6">
                        {selectedFinalValues.map((value, valueIndex) => (
                            <motion.div
                                key={value.id}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: valueIndex * 0.1 }}
                                className="bg-white border border-gray-200 rounded-2xl p-5 shadow-sm"
                            >
                                <div className="flex items-start gap-3 mb-4">
                                    <div className="bg-gradient-to-br from-blue-100 to-indigo-100 w-12 h-12 rounded-xl flex items-center justify-center">
                                        <span className="text-2xl">{value.icon}</span>
                                    </div>
                                    <div>
                                        <h4 className="text-lg font-bold text-gray-900">{value.text}</h4>
                                        <p className="text-sm text-gray-600 mt-1">
                                            {lang === "ru"
                                                ? "Конкретные действия для развития этой ценности:"
                                                : "Specific actions to develop this value:"}
                                        </p>
                                    </div>
                                </div>

                                {value.actions && value.actions.length > 0 ? (
                                    <div className="space-y-2">
                                        {value.actions.map((action, actionIndex) => (
                                            <motion.div
                                                key={actionIndex}
                                                initial={{ opacity: 0, x: -20 }}
                                                animate={{ opacity: 1, x: 0 }}
                                                transition={{ delay: valueIndex * 0.1 + actionIndex * 0.05 }}
                                                className="flex items-start gap-3 p-3 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl"
                                            >
                                                <div className="mt-1">
                                                    <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                                                </div>
                                                <span className="text-gray-800">{action}</span>
                                            </motion.div>
                                        ))}
                                    </div>
                                ) : (
                                    <div className="text-gray-500 italic text-sm p-4 bg-gray-50 rounded-xl">
                                        {lang === "ru"
                                            ? "Для этой ценности пока нет конкретных действий"
                                            : "No specific actions for this value yet"}
                                    </div>
                                )}
                            </motion.div>
                        ))}
                    </div>
                </>
            ) : (
                <div className="bg-yellow-50 border border-yellow-200 rounded-2xl p-6 mb-8">
                    <h3 className="text-xl font-bold text-gray-900 mb-4 text-center">
                        {lang === "ru" ? "🛠️ Разработайте свои действия" : "🛠️ Develop Your Actions"}
                    </h3>
                    <p className="text-gray-700 text-center mb-4">
                        {lang === "ru"
                            ? "У выбранных ценностей пока нет конкретных действий. Вы можете создать свои:"
                            : "The selected values don't have specific actions yet. You can create your own:"}
                    </p>
                    <ul className="space-y-2 text-gray-700 max-w-2xl mx-auto">
                        <li className="flex items-start gap-2">
                            <span className="text-yellow-600 mt-1">•</span>
                            <span>
                                {lang === "ru"
                                    ? "Подумайте, как можно проявлять эту ценность в повседневной жизни"
                                    : "Think about how you can express this value in daily life"}
                            </span>
                        </li>
                        <li className="flex items-start gap-2">
                            <span className="text-yellow-600 mt-1">•</span>
                            <span>
                                {lang === "ru"
                                    ? "Начните с малого - одного простого действия в день"
                                    : "Start small - one simple action per day"}
                            </span>
                        </li>
                        <li className="flex items-start gap-2">
                            <span className="text-yellow-600 mt-1">•</span>
                            <span>
                                {lang === "ru"
                                    ? "Записывайте свои идеи в блокнот или приложение для заметок"
                                    : "Write down your ideas in a notebook or notes app"}
                            </span>
                        </li>
                    </ul>
                </div>
            )}

            {/* Дополнительные рекомендации */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 }}
                className="mt-8 bg-gradient-to-r from-amber-50 to-orange-50 border border-amber-100 rounded-2xl p-5"
            >
                <h4 className="font-bold text-gray-900 mb-3 flex items-center gap-2">
                    <span>💡</span>
                    {lang === "ru" ? "Советы по интеграции" : "Integration Tips"}
                </h4>
                <ul className="space-y-2 text-gray-700">
                    <li className="flex items-start gap-2">
                        <span className="text-amber-600">•</span>
                        {lang === "ru"
                            ? "Выберите 1-2 действия из каждой ценности для начала"
                            : "Choose 1-2 actions from each value to start with"}
                    </li>
                    <li className="flex items-start gap-2">
                        <span className="text-amber-600">•</span>
                        {lang === "ru"
                            ? "Запланируйте конкретное время для выполнения действий"
                            : "Schedule specific time to perform the actions"}
                    </li>
                    <li className="flex items-start gap-2">
                        <span className="text-amber-600">•</span>
                        {lang === "ru"
                            ? "В конце дня отмечайте, какие действия удалось выполнить"
                            : "At the end of the day, note which actions you managed to complete"}
                    </li>
                    <li className="flex items-start gap-2">
                        <span className="text-amber-600">•</span>
                        {lang === "ru"
                            ? "Раз в месяц пересматривайте свои ценности и прогресс"
                            : "Review your values and progress once a month"}
                    </li>
                </ul>
            </motion.div>

            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.7 }}
                className="mt-8 bg-gradient-to-r from-purple-50 to-indigo-50 border border-purple-100 rounded-2xl p-5"
            >
                <h4 className="font-bold text-gray-900 mb-3 flex items-center gap-2">
                    <span>🛡️</span>
                    {lang === "ru" ? "Как использовать ценности в кризисные моменты" : "How to use values in crisis moments"}
                </h4>
                <div className="space-y-3 text-gray-700">
                    <p className="text-sm">
                        {lang === "ru"
                            ? "Когда сталкиваетесь с трудностями, обратитесь к своим ценностям как к компасу:"
                            : "When facing difficulties, turn to your values as a compass:"}
                    </p>
                    <ul className="space-y-2 text-sm">
                        <li className="flex items-start gap-2">
                            <span className="text-purple-600 mt-1">•</span>
                            <span>
                                {lang === "ru"
                                    ? "Спросите: \"Какая из моих ценностей наиболее актуальна в этой ситуации?\""
                                    : "Ask: 'Which of my values is most relevant in this situation?'"}
                            </span>
                        </li>
                        <li className="flex items-start gap-2">
                            <span className="text-purple-600 mt-1">•</span>
                            <span>
                                {lang === "ru"
                                    ? "Используйте конкретные действия из рекомендаций как практические шаги"
                                    : "Use specific actions from recommendations as practical steps"}
                            </span>
                        </li>
                        <li className="flex items-start gap-2">
                            <span className="text-purple-600 mt-1">•</span>
                            <span>
                                {lang === "ru"
                                    ? "Помните: кризисы - это проверка и укрепление ценностей, а не их отмена"
                                    : "Remember: crises test and strengthen values, they don't cancel them"}
                            </span>
                        </li>
                    </ul>
                </div>
            </motion.div>

            {/* Кнопки завершения */}
            <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-4">
                {/* Показываем кнопку сохранения только если еще не сохранено */}
                {!hasSavedValues && onSave && (
                    <motion.button
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={onSave}
                        disabled={isSaving}
                        className={`bg-gradient-to-r from-green-500 to-emerald-600 text-white px-8 py-3 rounded-xl font-bold shadow-lg ${
                            isSaving ? 'opacity-70 cursor-not-allowed' : ''
                        }`}
                    >
                        {isSaving ? (
                            <div className="flex items-center gap-2">
                                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                                {lang === "ru" ? "Сохранение..." : "Saving..."}
                            </div>
                        ) : (
                            lang === "ru" ? "✅ Сохранить результат" : "✅ Save Results"
                        )}
                    </motion.button>
                )}

                {/* Кнопка "Пройти заново" */}
                {typeof onRestart === 'function' && (
                    <motion.button
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={onRestart}
                        className="bg-gradient-to-r from-amber-500 to-orange-500 text-white px-6 py-3 rounded-xl font-medium shadow-sm"
                    >
                        {lang === "ru" ? "🔄 Пройти заново" : "🔄 Start Over"}
                    </motion.button>
                )}

                {/* Кнопка "Назад к Live" */}
                <motion.button
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={onFinish}
                    className="bg-gradient-to-r from-blue-500 to-indigo-500 text-white px-6 py-3 rounded-xl font-medium shadow-sm"
                >
                    {lang === "ru" ? "← Назад к Live" : "← Back to Live"}
                </motion.button>
            </div>

            {/* Информация о сохранении */}
            {hasSavedValues && savedValuesData && (
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="mt-6 text-center text-sm text-gray-500"
                >
                    {lang === "ru"
                        ? "✅ Ваши ценности сохранены"
                        : "✅ Your values have been saved"}
                    {savedValuesData.savedAt && (
                        <div className="mt-1">
                            {new Date(savedValuesData.savedAt).toLocaleDateString()}
                        </div>
                    )}
                </motion.div>
            )}
        </div>
    );
};