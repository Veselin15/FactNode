import { Fact, PaginatedResponse } from "@/types/fact";
import Navbar from "@/components/Navbar";
import FactCard from "@/components/FactCard";

async function getFacts(): Promise<Fact[]> {
  // Note: We use 'force-cache' or 'no-store' depending on needs.
  // For a feed, 'no-store' is safer to see new votes.
  const res = await fetch("http://127.0.0.1:8000/api/facts/feed/", {
    cache: "no-store",
  });

  if (!res.ok) {
    // Ideally handle 404 or 500 specifically
    return [];
  }

  const data: PaginatedResponse = await res.json();
  return data.results || [];
}

export default async function Home() {
  const facts = await getFacts();

  return (
    <div className="min-h-screen bg-[#F3F4F6]">
      <Navbar />

      <main className="pt-24 pb-12 px-4 sm:px-6">
        <div className="max-w-2xl mx-auto">

          <div className="mb-8 text-center sm:text-left">
            <h1 className="text-3xl font-extrabold text-gray-900 tracking-tight">
              Discover Knowledge
            </h1>
            <p className="mt-2 text-gray-500">
              Curated facts from the community, verified by experts.
            </p>
          </div>

          <div className="grid gap-6">
            {facts.map((fact) => (
              <FactCard key={fact.id} fact={fact} />
            ))}

            {facts.length === 0 && (
              <div className="text-center py-20 bg-white rounded-2xl border border-dashed border-gray-300">
                <p className="text-gray-500">No facts found yet.</p>
                <p className="text-sm text-gray-400 mt-1">Be the first to post one!</p>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}