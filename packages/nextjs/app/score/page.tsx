"use client";

import React, { useState } from "react";

// Datos ficticios
const mockData = [
  { wallet: "0x123...abcd", score: 120 },
  { wallet: "0x456...efgh", score: 95 },
  { wallet: "0x789...ijkl", score: 150 },
  { wallet: "0xabc...mnop", score: 80 },
  { wallet: "0xdef...qrst", score: 110 },
];

const ScorePage = () => {
  const [data] = useState(mockData); // Reemplaza esto con una llamada a tu backend en el futuro

  const handleClaimYield = () => {
    alert("Yield claimed!");
  };

  const handleClaimCollateral = () => {
    alert("Collateral claimed!");
  };

  return (
    <div className="flex flex-col items-center justify-start px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">Game Scoreboard</h1>

      {/* Tabla de puntajes */}
      <table className="table-auto w-full max-w-4xl border-collapse border border-gray-300">
        <thead>
          <tr>
            <th className="border border-gray-300 px-4 py-2">#</th>
            <th className="border border-gray-300 px-4 py-2">Wallet Address</th>
            <th className="border border-gray-300 px-4 py-2">Score</th>
          </tr>
        </thead>
        <tbody>
          {data.map((entry, index) => (
            <tr key={index} className="text-center">
              <td className="border border-gray-300 px-4 py-2">{index + 1}</td>
              <td className="border border-gray-300 px-4 py-2">{entry.wallet}</td>
              <td className="border border-gray-300 px-4 py-2">{entry.score}</td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Botones de reclamo */}
      <div className="flex space-x-4 mt-6">
        <button
          onClick={handleClaimYield}
          className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 active:scale-95 transition-transform"
        >
          Claim Your Yield
        </button>
        <button
          onClick={handleClaimCollateral}
          className="bg-green-500 text-white px-4 py-2 rounded-md hover:bg-green-600 active:scale-95 transition-transform"
        >
          Claim Your Collateral
        </button>
      </div>
    </div>
  );
};

export default ScorePage;
