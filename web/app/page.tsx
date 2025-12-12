import { Fact, PaginatedResponse } from "@/types/fact";
import Navbar from "@/components/Navbar";
import FactCard from "@/components/FactCard";
import LeftSidebar from "@/components/LeftSidebar";
import RightSidebar from "@/components/RightSidebar";

async function getFacts(): Promise<Fact[]> {
  const res = await fetch("http://127.0.0.1:8000/api/facts/feed/", {
    cache: "no-store",
  });

  if (!res.ok) return [];

  const data: PaginatedResponse = await res.json();
  return data.results || [];
}

export default async function Home() {
  const facts = await getFacts();

  return (
    <div className="min-h-screen bg-[#F8F9FA]">
      <Navbar />

      <main className="max-w-7xl mx-auto pt-20 px-4 sm:px-6 lg:px-8">
        <div className="flex gap-8 justify-center">

          {/* Left Column: Navigation (Hidden on mobile) */}
          <LeftSidebar />

          {/* Middle Column: The Feed */}
          <div className="flex-1 max-w-2xl min-w-0">
            {/* Mobile Header (Visible only on mobile) */}
            <div className="md:hidden mb-6">
              <h1 className="text-2xl font-bold text-gray-900">Home Feed</h1>
              <p className="text-sm text-gray-500">Latest updates from the community</p>
            </div>

            <div className="flex flex-col gap-6 pb-20">
              {facts.map((fact) => (
                <FactCard key={fact.id} fact={fact} />
              ))}

              {facts.length === 0 && (
                <div className="flex flex-col items-center justify-center py-20 bg-white rounded-2xl shadow-sm border border-gray-100 text-center px-4">
                  <div className="w-16 h-16 bg-blue-50 rounded-full flex items-center justify-center mb-4 text-3xl">
                    📝
                  </div>
                  <h3 className="text-lg font-bold text-gray-900">No facts yet</h3>
                  <p className="text-gray-500 mt-1 max-w-xs mx-auto">
                    The database is empty. Be the first one to share knowledge!
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* Right Column: Trending (Hidden on tablet/mobile) */}
          <RightSidebar />

        </div>
      </main>
    </div>
  );
}