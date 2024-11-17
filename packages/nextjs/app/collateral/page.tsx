"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
// Para manejar la navegación
import CollateralButton from "~~/components/CollateralButton";

const CollateralPage = () => {
  const [value, setValue] = useState(""); // Valor inicial del input
  const [isLoading, setIsLoading] = useState(false); // Estado para manejar la carga
  const router = useRouter(); // Instancia del router

  const handleConfirmCollateral = async () => {
    if (!value || isNaN(Number(value)) || Number(value) <= 0) {
      alert("Please enter a valid collateral amount in USD.");
      return;
    }

    setIsLoading(true); // Mostrar indicador de carga
    try {
      // Simular una función de conexión (reemplaza esto con tu lógica real)
      const isConnected = await connectWalletAndConfirmCollateral(Number(value));
      if (isConnected) {
        router.push("/expedition/wait"); // Redirige a la página de espera
      } else {
        alert("Failed to connect. Please try again.");
      }
    } catch (error) {
      console.error("Error connecting:", error);
      alert("An error occurred. Please try again.");
    } finally {
      setIsLoading(false); // Ocultar indicador de carga
    }
  };

  // Simulación de una función de conexión (reemplaza con tu lógica real)
  const connectWalletAndConfirmCollateral = (value: number): Promise<boolean> => {
    return new Promise(resolve => {
      setTimeout(() => resolve(true), 1500); // Simula una respuesta exitosa después de 1.5s
    });
  };

  return (
    <div className="flex flex-col items-center justify-center from-gray-900 mt-14 via-gray-800 to-black text-white px-4">
      <h1 className="text-4xl font-extrabold mb-8 text-center text-blue-400 drop-shadow-lg">
        Stake Collateral to Enter the Game
      </h1>

      {/* Input para el colateral */}
      <div className="w-full max-w-md mb-6">
        <label htmlFor="collateral" className="block text-lg font-medium mb-2">
          Enter Collateral Amount (USD):
        </label>
        <input
          id="collateral"
          type="number"
          value={value}
          onChange={e => setValue(e.target.value)}
          className="w-full px-4 py-2 border border-gray-600 rounded-lg bg-gray-800 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
          placeholder="e.g., 50"
          min="0"
        />
      </div>

      {/* Botón */}
      <CollateralButton value={value} onClick={handleConfirmCollateral} />

      {/* Indicador de carga */}
      {isLoading && <p className="mt-4 text-blue-400 animate-pulse">Processing your transaction...</p>}
    </div>
  );
};

export default CollateralPage;
