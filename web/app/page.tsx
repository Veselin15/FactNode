import { Fact, PaginatedResponse } from "@/types/fact";

// 1. The Fetch Function
async function getFacts(): Promise<Fact[]> {
  const res = await fetch("http://127.0.0.1:8000/api/facts/feed/", {
    cache: "no-store",
  });

  if (!res.ok) {
    throw new Error("Failed to fetch facts");
  }

  // Parse the paginated response
  const data: PaginatedResponse = await res.json();

  // Return ONLY the list of facts (the 'results' key)
  return data.results;
}
// 2. Page Component
export default async function Home() {
  const facts = await getFacts();

  return (
    <main className="min-h-screen bg-gray-100 p-8">
      <div className="max-w-2xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">FactNode Feed</h1>

        <div className="space-y-6">
          {facts.map((fact) => (
            <div
              key={fact.id}
              className="bg-white rounded-xl shadow-sm overflow-hidden hover:shadow-md transition-shadow"
            >
              {/* Image Section */}
              {fact.image && (
                <div className="h-64 w-full relative">
                  {/* We use standard img tag for simplicity until you configure Next.js Image */}
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={fact.image}
                    alt={fact.title}
                    className="w-full h-full object-cover"
                  />
                </div>
              )}

              {/* Content Section */}
              <div className="p-6">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-semibold text-blue-600 bg-blue-50 px-3 py-1 rounded-full">
                    {fact.category?.name || "General"}
                  </span>
                  <span className="text-xs text-gray-500">
                    {new Date(fact.created_at).toLocaleDateString()}
                  </span>
                </div>

                <h2 className="text-xl font-bold text-gray-800 mb-2">
                  {fact.title}
                </h2>
                <p className="text-gray-600 leading-relaxed mb-4">
                  {fact.content}
                </p>

                {/* Footer: Author & Score */}
                <div className="flex items-center justify-between border-t pt-4 mt-4">
                  <div className="flex items-center space-x-2">
                    <div className="w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center">
                      <span className="text-sm font-bold text-gray-600">
                        {fact.author?.username.charAt(0).toUpperCase()}
                      </span>
                    </div>
                    <span className="text-sm font-medium text-gray-700">
                      {fact.author?.username}
                    </span>
                  </div>

                  <div className="flex items-center space-x-1 text-orange-500 font-bold">
                    <span>▲</span>
                    <span>{fact.score}</span>
                  </div>
                </div>
              </div>
            </div>
          ))}

          {facts.length === 0 && (
            <div className="text-center py-10">
              <p className="text-gray-500 text-lg">No facts found.</p>
              <p className="text-sm text-gray-400">Make sure you have APPROVED facts in the backend.</p>
            </div>
          )}
        </div>
      </div>
    </main>
  );
}