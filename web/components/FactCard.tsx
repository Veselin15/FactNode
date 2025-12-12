"use client";

import { useState } from "react";
import { Fact } from "@/types/fact";
import { useAuth } from "@/context/AuthContext";

interface FactCardProps {
  fact: Fact;
}

export default function FactCard({ fact }: FactCardProps) {
  const { token } = useAuth();
  const [score, setScore] = useState(fact.score);
  // Simple state to prevent spamming votes locally
  const [voteStatus, setVoteStatus] = useState<"up" | "down" | null>(null);

  const handleVote = async (type: "UP" | "DOWN") => {
    if (!token) return alert("Please login to vote!");

    // 1. Optimistic UI Update (Instant feedback)
    const change = type === "UP" ? 1 : -1;
    setScore((prev) => prev + change);
    setVoteStatus(type === "UP" ? "up" : "down");

    // 2. API Call
    try {
      const res = await fetch(`http://127.0.0.1:8000/api/reputation/votes/${fact.id}/cast_vote/`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ vote_type: type }),
      });

      if (!res.ok) throw new Error();
    } catch (err) {
      // Revert on error
      setScore((prev) => prev - change);
      setVoteStatus(null);
      alert("Vote failed. Please try again.");
    }
  };

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-xl hover:border-blue-100 transition-all duration-300 group">

      {/* Image Header */}
      {fact.image && (
        <div className="h-56 w-full relative overflow-hidden bg-gray-100">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={fact.image}
            alt={fact.title}
            className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-500"
          />
          <div className="absolute top-3 left-3 bg-white/90 backdrop-blur px-3 py-1 rounded-full text-xs font-bold text-blue-700 shadow-sm">
            {fact.category?.name || "General"}
          </div>
        </div>
      )}

      <div className="p-5">
        {/* Author Header (if no image, show category here) */}
        {!fact.image && (
          <div className="flex justify-between items-center mb-3">
            <span className="bg-blue-50 text-blue-600 px-2 py-1 rounded text-xs font-bold uppercase tracking-wider">
              {fact.category?.name || "General"}
            </span>
          </div>
        )}

        <h3 className="text-xl font-bold text-gray-900 mb-2 leading-tight group-hover:text-blue-600 transition-colors">
          {fact.title}
        </h3>

        <p className="text-gray-600 text-sm leading-relaxed line-clamp-3 mb-4">
          {fact.content}
        </p>

        {/* Footer: User & Actions */}
        <div className="flex items-center justify-between pt-4 border-t border-gray-50">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-gray-200 to-gray-300 flex items-center justify-center text-xs font-bold text-gray-600">
              {fact.author?.username?.[0].toUpperCase()}
            </div>
            <div className="flex flex-col">
              <span className="text-xs font-semibold text-gray-900">
                {fact.author?.username}
              </span>
              <span className="text-[10px] text-gray-400">
                {new Date(fact.created_at).toLocaleDateString()}
              </span>
            </div>
          </div>

          {/* Voting Buttons */}
          <div className="flex items-center bg-gray-50 rounded-lg p-1 gap-1">
            <button
              onClick={() => handleVote("UP")}
              className={`p-1.5 rounded-md transition ${
                voteStatus === "up" ? "bg-orange-100 text-orange-600" : "hover:bg-gray-200 text-gray-500"
              }`}
            >
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" />
              </svg>
            </button>

            <span className={`text-sm font-bold w-6 text-center ${
              score > 0 ? "text-orange-600" : "text-gray-700"
            }`}>
              {score}
            </span>

            <button
              onClick={() => handleVote("DOWN")}
              className={`p-1.5 rounded-md transition ${
                voteStatus === "down" ? "bg-blue-100 text-blue-600" : "hover:bg-gray-200 text-gray-500"
              }`}
            >
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}