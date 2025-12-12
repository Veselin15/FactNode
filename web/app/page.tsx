"use client";

import { useEffect, useState } from "react";
import { Fact, PaginatedResponse } from "@/types/fact";
import Navbar from "@/components/Navbar";
import FactCard from "@/components/FactCard";
import LeftSidebar from "@/components/LeftSidebar";
import RightSidebar from "@/components/RightSidebar";
import { useAuth } from "@/context/AuthContext";

export default function Home() {
  const { token } = useAuth(); // Get the token to send to backend
  const [facts, setFacts] = useState<Fact[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchFacts = async () => {
      try {
        const headers: HeadersInit = {
          "Content-Type": "application/json",
        };

        // Important: If logged in, attach the token!
        if (token) {
          headers["Authorization"] = `Bearer ${token}`;
        }

        const res = await fetch("http://127.0.0.1:8000/api/facts/feed/", {
          headers: headers,
          cache: "no-store",
        });

        if (res.ok) {
          const data: PaginatedResponse = await res.json();
          setFacts(data.results || []);
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchFacts();
  }, [token]); // Re-fetch if token changes (login/logout)

  return (
    <div className="min-h-screen bg-[#F0F2F5]">
      <Navbar />

      <main className="max-w-7xl mx-auto pt-24 px-4 sm:px-6 lg:px-8">
        <div className="flex gap-8 justify-center">

          {/* Left Sidebar - Now hidden on small screens */}
          <div className="hidden md:block">
            {/* We need to wrap Server Components if using them inside Client Components,
                but for simplicity let's hide it or make LeftSidebar a client component too
                if it has simple links. For now, we render it directly. */}
           <LeftSidebarWrapper />
          </div>

          {/* MIDDLE COLUMN (Feed) */}
          <div className="flex-1 max-w-2xl min-w-0">

            <div className="md:hidden mb-6 mt-2">
              <h1 className="text-2xl font-bold text-gray-900">Your Feed</h1>
            </div>

            {loading ? (
              <div className="space-y-4">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="h-48 bg-white rounded-2xl animate-pulse" />
                ))}
              </div>
            ) : (
              <div className="flex flex-col gap-6 pb-20">
                {facts.map((fact) => (
                  <FactCard key={fact.id} fact={fact} />
                ))}

                {facts.length === 0 && (
                  <div className="flex flex-col items-center justify-center py-20 bg-white rounded-2xl shadow-sm border border-gray-100 text-center px-4">
                    <div className="w-16 h-16 bg-blue-50 rounded-full flex items-center justify-center mb-4 text-3xl">
                      🌍
                    </div>
                    <h3 className="text-lg font-bold text-gray-900">No facts found</h3>
                    <p className="text-gray-500 mt-1 max-w-xs mx-auto">
                       Facts must be <strong>APPROVED</strong> in the Admin Panel to appear here.
                    </p>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Right Sidebar */}
          <div className="hidden lg:block">
             <RightSidebar />
          </div>

        </div>
      </main>
    </div>
  );
}

// Wrapper to handle the async sidebar in a client component
// (Since LeftSidebar was async, we need to treat it carefully or convert it)
import { Category } from "@/types/fact";

function LeftSidebarWrapper() {
    const [categories, setCategories] = useState<Category[]>([]);

    useEffect(() => {
        fetch("http://127.0.0.1:8000/api/facts/categories/")
            .then(res => res.json())
            .then(data => setCategories(data))
            .catch(() => []);
    }, []);

    return (
        <aside className="flex flex-col w-64 shrink-0 sticky top-24 h-[calc(100vh-6rem)] gap-8 overflow-y-auto custom-scrollbar">
            <div className="flex flex-col gap-2">
                <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider px-3 mb-2">Discover</h3>
                <a href="/" className="flex items-center gap-3 px-3 py-2.5 rounded-xl bg-blue-50 text-blue-600 font-medium">🏠 Home Feed</a>
                <a href="/popular" className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-gray-600 hover:bg-gray-100">🔥 Popular</a>
            </div>
            <div className="flex flex-col gap-2">
                <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider px-3 mb-2">Topics</h3>
                {categories.map((cat) => (
                    <a key={cat.name} href={`/topic/${cat.name}`} className="flex items-center gap-3 px-3 py-2 rounded-lg text-gray-600 hover:bg-white hover:shadow-sm transition-all group">
                         <span className="text-sm bg-gray-100 w-8 h-8 flex items-center justify-center rounded-md">#</span>
                         <span className="font-medium capitalize">{cat.name}</span>
                    </a>
                ))}
            </div>
        </aside>
    );
}