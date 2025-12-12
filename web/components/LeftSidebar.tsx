import Link from "next/link";
import { Category } from "@/types/fact";

async function getCategories(): Promise<Category[]> {
  try {
    // We disable pagination in the backend earlier, so this returns a clean array!
    const res = await fetch("http://127.0.0.1:8000/api/facts/categories/", {
      next: { revalidate: 3600 }, // Cache for 1 hour for speed
    });
    if (!res.ok) return [];
    return await res.json();
  } catch (err) {
    return [];
  }
}

export default async function LeftSidebar() {
  const categories = await getCategories();

  return (
    <aside className="hidden md:flex flex-col w-64 shrink-0 sticky top-24 h-[calc(100vh-6rem)] gap-8 overflow-y-auto custom-scrollbar">

      {/* 1. Main Menu */}
      <div className="flex flex-col gap-2">
        <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider px-3 mb-2">
          Discover
        </h3>
        <NavItem href="/" icon="🏠" label="Home Feed" active />
        <NavItem href="/popular" icon="🔥" label="Popular" />
        <NavItem href="/latest" icon="✨" label="Newest" />
        <NavItem href="/bookmarks" icon="🔖" label="Bookmarks" />
      </div>

      {/* 2. Topics (From DB) */}
      <div className="flex flex-col gap-2">
        <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider px-3 mb-2">
          Knowledge Base
        </h3>
        {categories.map((cat) => (
          <Link
            key={cat.name}
            href={`/topic/${cat.name}`}
            className="flex items-center gap-3 px-3 py-2 rounded-lg text-gray-600 hover:bg-white hover:shadow-sm hover:text-blue-600 transition-all group"
          >
            <span className="text-sm bg-gray-100 group-hover:bg-blue-50 w-8 h-8 flex items-center justify-center rounded-md transition-colors">
              #
            </span>
            <span className="font-medium capitalize">
              {cat.name}
            </span>
          </Link>
        ))}
      </div>
    </aside>
  );
}

// Helper Component for Menu Items
function NavItem({ href, icon, label, active = false }: any) {
  return (
    <Link
      href={href}
      className={`flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all ${
        active
          ? "bg-gradient-to-r from-blue-600 to-blue-500 text-white shadow-md shadow-blue-500/20"
          : "text-gray-600 hover:bg-gray-100"
      }`}
    >
      <span className="text-xl">{icon}</span>
      <span className="font-medium">{label}</span>
    </Link>
  );
}