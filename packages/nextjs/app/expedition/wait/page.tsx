"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

const ExpeditionWaitPage = () => {
  const [timeRemaining, setTimeRemaining] = useState<number>(0);
  const [loading, setLoading] = useState(true);
  const router = useRouter(); // Para manejar la navegación

  useEffect(() => {
    const fetchExpeditionTime = async () => {
      try {
        // Llama a la API para obtener el timestamp de inicio
        const response = await fetch("https://api.juki.app/chain2moon/timestamp");
        const data = await response.json();

        if (data.success) {
          const startTime = parseInt(data.content.timestamp) * 1000; // Convertir de segundos a milisegundos
          const currentTime = Date.now();
          const remainingTime = Math.max(0, startTime - currentTime);
          console.log({ startTime });
          console.log({ currentTime });

          setTimeRemaining(remainingTime);
          setLoading(false);

          // Actualizar el contador cada segundo
          const interval = setInterval(() => {
            const updatedRemaining = Math.max(0, startTime - Date.now());
            setTimeRemaining(updatedRemaining);

            if (updatedRemaining === 0) {
              clearInterval(interval); // Detener el contador al llegar a 0
            }
          }, 1000);

          return () => clearInterval(interval);
        } else {
          throw new Error("Failed to fetch valid timestamp");
        }
      } catch (error) {
        console.error("Failed to fetch expedition start time:", error);
        setLoading(false);
      }
    };

    fetchExpeditionTime();
  }, []);

  const formatTime = (ms: number) => {
    const seconds = Math.floor((ms / 1000) % 60);
    const minutes = Math.floor((ms / 1000 / 60) % 60);
    const hours = Math.floor(ms / 1000 / 60 / 60);

    return `${hours > 0 ? `${hours}h ` : ""}${minutes}m ${seconds}s`;
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center text-white">
        <h1 className="text-4xl font-extrabold text-blue-400 drop-shadow-lg">Loading Expedition Details...</h1>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center justify-center text-white px-4 mt-20">
      <h1 className="text-4xl font-extrabold mb-4 text-blue-400 drop-shadow-lg">Expedition Countdown</h1>
      {timeRemaining > 0 ? (
        <>
          <p className="text-lg mb-6 text-center">The expedition will start in:</p>
          <div className="text-3xl font-bold text-yellow-400 animate-pulse">{formatTime(timeRemaining)}</div>
        </>
      ) : (
        <>
          <p className="text-lg mb-6 text-center text-green-400">The expedition is ready to begin!</p>
          <button
            className="mt-6 px-6 py-3 bg-green-500 rounded-lg text-white font-semibold shadow-md hover:bg-green-600 active:scale-95 transition-transform"
            onClick={() => router.push("/expedition/decision")}
          >
            Start Game
          </button>
        </>
      )}
    </div>
  );
};

export default ExpeditionWaitPage;
