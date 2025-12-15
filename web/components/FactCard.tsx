"use client";

import {useState} from "react";
import {Fact} from "@/types/fact";
import {useAuth} from "@/context/AuthContext";

interface FactCardProps {
    fact: Fact;
}

export default function FactCard({fact}: FactCardProps) {
    const {token} = useAuth();

    const [score, setScore] = useState(fact.score);
    const [voteStatus, setVoteStatus] = useState<"UP" | "DOWN" | null>(fact.user_vote);
    const [isBookmarked, setIsBookmarked] = useState(fact.is_bookmarked);

    // --- NEW: Expansion Logic ---
    const [isExpanded, setIsExpanded] = useState(false);
    // We consider "Long Text" anything over 200 characters
    const isLongText = fact.content.length > 200;

    const handleBookmark = async () => {
        if (!token) return alert("Please login to bookmark!");

        // Optimistic Update (Instant feedback)
        const previousState = isBookmarked;
        setIsBookmarked(!isBookmarked);

        try {
            const res = await fetch(`http://127.0.0.1:8000/api/facts/feed/${fact.id}/is_bookmarked/`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
            });

            if (!res.ok) throw new Error();

            // Ensure state matches server response
            const data = await res.json();
            setIsBookmarked(data.is_bookmarked);

        } catch (err) {
            // Revert if error
            setIsBookmarked(previousState);
            alert("Failed to bookmark. Please try again.");
        }
    };

    const handleVote = async (type: "UP" | "DOWN") => {
        if (!token) return alert("Please login to vote!");
        if (voteStatus === type) return;

        let change = 0;
        if (voteStatus === null) {
            change = type === "UP" ? 1 : -1;
        } else if (voteStatus !== type) {
            change = type === "UP" ? 2 : -2;
        }

        setScore((prev) => prev + change);
        setVoteStatus(type);

        try {
            const res = await fetch(`http://127.0.0.1:8000/api/reputation/votes/${fact.id}/cast_vote/`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify({vote_type: type}),
            });

            if (!res.ok) throw new Error();
        } catch (err) {
            setScore((prev) => prev - change);
            setVoteStatus(fact.user_vote);
            alert("Vote failed. Please try again.");
        }
    };

    return (
        <div
            className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-md transition-shadow duration-300 group">

            {/* Image Section */}
            {fact.image && (
                <div className="h-64 w-full relative overflow-hidden bg-gray-100 cursor-pointer"
                     onClick={() => setIsExpanded(!isExpanded)}>
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                        src={fact.image}
                        alt={fact.title}
                        className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-700"
                    />
                    <div
                        className="absolute top-4 left-4 bg-white/90 backdrop-blur px-3 py-1.5 rounded-full text-xs font-bold text-blue-700 shadow-sm">
                        {fact.category?.name || "General"}
                    </div>
                </div>
            )}

            <div className="p-6">
                {/* Category Badge (only if no image) */}
                {!fact.image && (
                    <div className="flex justify-between items-center mb-4">
            <span
                className="bg-blue-50 text-blue-600 px-2.5 py-1 rounded-md text-xs font-bold uppercase tracking-wider">
              {fact.category?.name || "General"}
            </span>
                    </div>
                )}

                {/* Title */}
                <h3
                    onClick={() => setIsExpanded(!isExpanded)}
                    className="text-xl font-bold text-gray-900 mb-3 leading-snug group-hover:text-blue-600 transition-colors cursor-pointer"
                >
                    {fact.title}
                </h3>

                {/* --- CONTENT AREA (The Magic Happens Here) --- */}
                <div className="relative">
                    <div
                        className={`text-gray-700 text-[15px] leading-7 transition-all duration-500 ease-in-out ${
                            isExpanded ? "max-h-[1000px] opacity-100" : "max-h-24 overflow-hidden opacity-90"
                        }`}
                    >
                        {/* We map paragraphs to make it readable if there are newlines */}
                        {fact.content.split('\n').map((paragraph, idx) => (
                            <p key={idx} className="mb-3">{paragraph}</p>
                        ))}
                    </div>

                    {/* Gradient Overlay (Only show if collapsed and text is long) */}
                    {!isExpanded && isLongText && (
                        <div
                            className="absolute bottom-0 left-0 right-0 h-16 bg-gradient-to-t from-white via-white/80 to-transparent pointer-events-none"/>
                    )}
                </div>

                {/* Read More Button */}
                {isLongText && (
                    <button
                        onClick={() => setIsExpanded(!isExpanded)}
                        className="mt-1 text-blue-600 font-semibold text-sm hover:text-blue-800 transition-colors flex items-center gap-1 focus:outline-none"
                    >
                        {isExpanded ? "Show Less" : "Read More"}
                        <svg
                            className={`w-4 h-4 transition-transform duration-300 ${isExpanded ? "rotate-180" : ""}`}
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                        >
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7"/>
                        </svg>
                    </button>
                )}

                {/* Footer */}
                <div className="flex items-center justify-between pt-6 mt-2 border-t border-gray-50">
                    <div className="flex items-center gap-3">
                        <div
                            className="w-9 h-9 rounded-full bg-gradient-to-br from-blue-100 to-indigo-100 flex items-center justify-center text-sm font-bold text-blue-600">
                            {fact.author?.username?.[0].toUpperCase()}
                        </div>
                        <div className="flex flex-col">
              <span className="text-sm font-semibold text-gray-900">
                {fact.author?.username}
              </span>
                            <span className="text-xs text-gray-400 font-medium">
                {new Date(fact.created_at).toLocaleDateString(undefined, {month: 'short', day: 'numeric'})}
              </span>
                        </div>
                    </div>

                    {/* Voting */}
                    <div className="flex items-center bg-gray-50 rounded-xl p-1 gap-1 border border-gray-100">
                        <button
                            onClick={() => handleVote("UP")}
                            className={`p-2 rounded-lg transition-all active:scale-90 ${
                                voteStatus === "UP" ? "bg-white text-orange-500 shadow-sm" : "text-gray-400 hover:text-gray-600 hover:bg-gray-200"
                            }`}
                        >
                            <svg className="w-5 h-5" fill={voteStatus === "UP" ? "currentColor" : "none"}
                                 viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7"/>
                            </svg>
                        </button>

                        <span className={`text-sm font-bold w-8 text-center ${
                            score > 0 ? "text-gray-900" : "text-gray-500"
                        }`}>
              {score}
            </span>

                        <button
                            onClick={() => handleVote("DOWN")}
                            className={`p-2 rounded-lg transition-all active:scale-90 ${
                                voteStatus === "DOWN" ? "bg-white text-blue-600 shadow-sm" : "text-gray-400 hover:text-gray-600 hover:bg-gray-200"
                            }`}
                        >
                            <svg className="w-5 h-5" fill={voteStatus === "DOWN" ? "currentColor" : "none"}
                                 viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7"/>
                            </svg>
                        </button>
                        {/* Bookmark Button */}
                        <button
                            onClick={handleBookmark}
                            className={`p-2 rounded-full transition-colors ${
                                isBookmarked
                                    ? "text-yellow-500 bg-yellow-50 hover:bg-yellow-100"
                                    : "text-gray-400 hover:text-gray-600 hover:bg-gray-100"
                            }`}
                            title="Bookmark this fact"
                        >
                            <svg
                                className="w-6 h-6"
                                fill={isBookmarked ? "currentColor" : "none"}
                                viewBox="0 0 24 24"
                                stroke="currentColor"
                            >
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                                      d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z"/>
                            </svg>
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}