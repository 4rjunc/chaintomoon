"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
// Para manejar la navegación
import CollateralButton from "~~/components/CollateralButton";
import SliderComponent from "~~/components/SliderComponent";

const CollateralPage = () => {
  const [value, setValue] = useState(10); // Valor inicial del slider
  const [isLoading, setIsLoading] = useState(false); // Estado para manejar la carga
  const router = useRouter(); // Instancia del router

  const handleConfirmCollateral = async () => {
    setIsLoading(true); // Mostrar indicador de carga
    try {
      // Simular una función de conexión (reemplaza esto con tu lógica real)
      const isConnected = await connectWalletAndConfirmCollateral(value);
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
        Purchase Oxygen or Stake Collateral
      </h1>

      {/* Slider */}
      <div className="w-full max-w-md mb-6">
        <SliderComponent value={value} onChange={setValue} />
      </div>

      {/* Botón */}
      <CollateralButton value={value} onClick={handleConfirmCollateral} />

      {/* Indicador de carga */}
      {isLoading && <p className="mt-4 text-blue-400 animate-pulse">Processing your transaction...</p>}
    </div>
  );
};

export default CollateralPage;
