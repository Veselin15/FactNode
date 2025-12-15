// web/components/Feed.tsx
"use client";

import { useEffect, useState } from "react";
import { Fact, PaginatedResponse } from "@/types/fact";
import FactCard from "@/components/FactCard";
import { useAuth } from "@/context/AuthContext";

interface FeedProps {
  apiEndpoint: string;
  title: string;
  emptyMessage?: string;
}

export default function Feed({ apiEndpoint, title, emptyMessage = "No facts found." }: FeedProps) {
  const { token } = useAuth();
  const [facts, setFacts] = useState<Fact[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchFacts = async () => {
      setLoading(true);
      try {
        const headers: HeadersInit = { "Content-Type": "application/json" };
        if (token) headers["Authorization"] = `Bearer ${token}`;

        const res = await fetch(apiEndpoint, { headers, cache: "no-store" });

        if (res.ok) {
          const data: PaginatedResponse = await res.json();
          setFacts(data.results || []);
        } else {
          setFacts([]);
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchFacts();
  }, [token, apiEndpoint]);

  return (
    <div className="flex-1 max-w-2xl min-w-0">
      <div className="mb-6 mt-2">
        <h1 className="text-2xl font-bold text-gray-900">{title}</h1>
      </div>

      {loading ? (
        <div className="space-y-4">
          {[1, 2, 3].map((i) => <div key={i} className="h-48 bg-white rounded-2xl animate-pulse" />)}
        </div>
      ) : (
        <div className="flex flex-col gap-6 pb-20">
          {facts.map((fact) => <FactCard key={fact.id} fact={fact} />)}
          {facts.length === 0 && (
            <div className="text-center py-20 bg-white rounded-2xl border border-dashed border-gray-300 text-gray-500">
              {emptyMessage}
            </div>
          )}
        </div>
      )}
    </div>
  );
}