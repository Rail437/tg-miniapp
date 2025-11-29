import React from "react";

import { useState } from "react";
import { motion } from "framer-motion";

export default function App() {
  const [showMarket, setShowMarket] = useState(false);
  const [showOwned, setShowOwned] = useState(false);
  const [owned, setOwned] = useState([]);

  const properties = [
    { id: 1, name: "Россия", income: 0.1, price: 5 },
    { id: 2, name: "Грузия", income: 0.5, price: 15 },
    { id: 3, name: "Дубай", income: 2.0, price: 45 }
  ];

  const buy = (p) => setOwned((o) => [...o, p]);

  return (
    <div className="relative w-full h-screen bg-blue-100 overflow-hidden flex items-center justify-center">
      <div className="flex flex-col items-center select-none">
        <motion.img
          src="https://i.imgur.com/p6JpR4q.png"
          className="w-40 h-40 object-contain drop-shadow-xl"
          animate={{ scale: [1, 1.05, 1] }}
          transition={{ duration: 2, repeat: Infinity }}
        />
        <div className="mt-2 text-lg font-bold">Привет!</div>
      </div>

      <button
        onClick={() => setShowMarket(true)}
        className="absolute top-10 left-1/2 -translate-x-1/2 px-4 py-2 bg-white rounded-2xl shadow-lg"
      >
        🏠 Магазин
      </button>

      <button
        onClick={() => setShowOwned(true)}
        className="absolute bottom-10 left-10 px-4 py-2 bg-white rounded-2xl shadow-lg"
      >
        📦 Объекты
      </button>

      <button
        className="absolute bottom-10 right-10 px-4 py-2 bg-white rounded-2xl shadow-lg"
      >
        👤 Профиль
      </button>

      {showMarket && (
        <div className="absolute inset-0 bg-black/40 backdrop-blur flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl w-full max-w-sm p-4 shadow-xl">
            <h2 className="text-xl font-bold mb-3">Магазин недвижимости</h2>
            <div className="space-y-3 max-h-80 overflow-y-auto">
              {properties.map((p) => (
                <div key={p.id} className="p-3 bg-gray-100 rounded-xl flex justify-between items-center">
                  <div>
                    <div className="font-bold">{p.name}</div>
                    <div className="text-sm text-gray-500">Доход: {p.income}/сек</div>
                    <div className="text-sm text-gray-500">Цена: {p.price}⭐</div>
                  </div>
                  <button onClick={() => buy(p)} className="px-3 py-1 bg-blue-500 text-white rounded-xl">
                    Купить
                  </button>
                </div>
              ))}
            </div>
            <button
              onClick={() => setShowMarket(false)}
              className="mt-4 w-full py-2 bg-red-400 text-white rounded-xl"
            >
              Закрыть
            </button>
          </div>
        </div>
      )}

      {showOwned && (
        <div className="absolute inset-0 bg-black/40 backdrop-blur flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl w-full max-w-sm p-4 shadow-xl">
            <h2 className="text-xl font-bold mb-3">Ваши объекты</h2>
            {owned.length === 0 ? (
              <div className="text-gray-500">Нет купленной недвижимости</div>
            ) : (
              <div className="space-y-2 max-h-80 overflow-y-auto">
                {owned.map((o, idx) => (
                  <div key={idx} className="p-3 bg-gray-100 rounded-xl">
                    {o.name} — доход {o.income}/сек
                  </div>
                ))}
              </div>
            )}
            <button
              onClick={() => setShowOwned(false)}
              className="mt-4 w-full py-2 bg-red-400 text-white rounded-xl"
            >
              Закрыть
            </button>
          </div>
        </div>
      )}
    </div>
  );
}