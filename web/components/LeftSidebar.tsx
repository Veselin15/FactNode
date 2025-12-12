import Link from "next/link";
import { Category } from "@/types/fact";

async function getCategories(): Promise<Category[]> {
  try {
    const res = await fetch("http://127.0.0.1:8000/api/facts/categories/", {
      next: { revalidate: 3600 }, // Cache for 1 hour
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
    <aside className="hidden md:flex flex-col w-64 shrink-0 sticky top-20 h-[calc(100vh-6rem)] gap-8">
      {/* Main Navigation */}
      <div className="flex flex-col gap-2">
        <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider px-3 mb-1">
          Menu
        </h3>
        <NavItem href="/" icon="🏠" label="Home Feed" active />
        <NavItem href="/popular" icon="🔥" label="Popular" />
        <NavItem href="/latest" icon="✨" label="Newest" />
        <NavItem href="/bookmarks" icon="🔖" label="Bookmarks" />
      </div>

      {/* Categories Dynamic List */}
      <div className="flex flex-col gap-2 overflow-y-auto pr-2 custom-scrollbar">
        <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider px-3 mb-1">
          Topics
        </h3>
        {categories.map((cat) => (
          <Link
            key={cat.name}
            href={`/topic/${cat.name}`}
            className="flex items-center gap-3 px-3 py-2 rounded-lg text-gray-600 hover:bg-white hover:shadow-sm transition-all group"
          >
            <span className="text-lg bg-gray-100 group-hover:bg-blue-50 w-8 h-8 flex items-center justify-center rounded-md transition-colors">
              {/* You can map icon_name to real icons later */}
              #
            </span>
            <span className="font-medium group-hover:text-blue-600">
              {cat.name}
            </span>
          </Link>
        ))}
      </div>
    </aside>
  );
}

function NavItem({ href, icon, label, active = false }: any) {
  return (
    <Link
      href={href}
      className={`flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all ${
        active
          ? "bg-blue-600 text-white shadow-md shadow-blue-600/20"
          : "text-gray-600 hover:bg-gray-100"
      }`}
    >
      <span className="text-xl">{icon}</span>
      <span className="font-medium">{label}</span>
    </Link>
  );
}