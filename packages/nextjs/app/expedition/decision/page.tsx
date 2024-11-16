"use client";

import React, { useEffect, useState } from "react";

const DecisionPage = () => {
  const [loading, setLoading] = useState(false);
  const [selectedAction, setSelectedAction] = useState<string | null>(null);
  const [hasVoted, setHasVoted] = useState(false);
  const [turnInfo, setTurnInfo] = useState<{ timeRemaining: number; canVote: boolean }>({
    timeRemaining: 10,
    canVote: true,
  });

  const walletAddress = "0xYourWalletAddress"; // Reemplaza con lógica para obtener el wallet.

  // Obtener información del turno
  useEffect(() => {
    const fetchTurnInfo = async () => {
      setLoading(true);
      try {
        const response = await fetch(`/api/expedition/turn-info?wallet=${walletAddress}`);
        const data = await response.json();

        setTurnInfo({
          timeRemaining: data.timeRemaining, // Tiempo restante para votar
          canVote: data.canVote, // Si puede votar o no
        });
        setHasVoted(!data.canVote); // Si no puede votar, asumimos que ya votó
      } catch (error) {
        console.error("Error fetching turn info:", error);
        alert("Failed to fetch turn information. Please refresh the page.");
      } finally {
        setLoading(false);
      }
    };

    fetchTurnInfo();
  }, [walletAddress]);

  // Manejar la decisión del usuario
  const handleDecision = async (action: string) => {
    if (!turnInfo.canVote) {
      alert("You cannot vote right now.");
      return;
    }

    setLoading(true);
    setSelectedAction(action);

    try {
      const response = await fetch("/api/expedition/decision", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          wallet: walletAddress,
          decision: action,
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to save decision");
      }

      const data = await response.json();
      setHasVoted(true); // Marcar como votado
      setTurnInfo(prev => ({ ...prev, canVote: false })); // Actualizar información del turno
      alert(`Decision saved successfully: ${data.message}`);
    } catch (error) {
      console.error("Error saving decision:", error);
      alert("An error occurred while saving your decision. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}m ${secs}s`;
  };

  return (
    <div className="flex flex-col items-center justify-center text-white px-4 pt-20">
      <h1 className="text-4xl font-extrabold mb-6 text-blue-400 drop-shadow-lg">Choose Your Action</h1>

      {turnInfo.canVote && turnInfo.timeRemaining > 0 ? (
        <p className="text-lg mb-4 text-center">You have {formatTime(turnInfo.timeRemaining)} to make your decision.</p>
      ) : (
        <p className="text-lg mb-4 text-center text-red-400">
          {hasVoted ? "You have already voted." : "You cannot vote at this time."}
        </p>
      )}

      {/* Botones de decisión */}
      <div className="flex space-x-6">
        <button
          onClick={() => handleDecision("cooperate")}
          disabled={loading || hasVoted || !turnInfo.canVote}
          className={`px-6 py-3 rounded-lg text-white font-semibold shadow-md transition-transform duration-200 ${
            selectedAction === "cooperate" ? "bg-green-600" : "bg-green-500 hover:bg-green-600"
          } ${loading || hasVoted || !turnInfo.canVote ? "opacity-50 cursor-not-allowed" : "active:scale-95"}`}
        >
          Cooperate
        </button>
        <button
          onClick={() => handleDecision("betray")}
          disabled={loading || hasVoted || !turnInfo.canVote}
          className={`px-6 py-3 rounded-lg text-white font-semibold shadow-md transition-transform duration-200 ${
            selectedAction === "betray" ? "bg-red-600" : "bg-red-500 hover:bg-red-600"
          } ${loading || hasVoted || !turnInfo.canVote ? "opacity-50 cursor-not-allowed" : "active:scale-95"}`}
        >
          Betray
        </button>
      </div>

      {/* Mensaje de carga */}
      {loading && <p className="mt-6 text-yellow-400 animate-pulse">Processing your decision...</p>}
    </div>
  );
};

export default DecisionPage;
