export default function RightSidebar() {
  return (
    <aside className="hidden lg:flex flex-col w-80 shrink-0 sticky top-24 h-fit gap-6">

      {/* 1. Trending Facts Box */}
      <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100">
        <h3 className="font-bold text-gray-900 mb-4 flex items-center gap-2">
          📈 Trending Now
        </h3>
        <div className="space-y-5">
          <TrendingItem rank={1} title="The James Webb Telescope new discovery" votes="12.5k" />
          <TrendingItem rank={2} title="How Roman Concrete heals itself" votes="8.2k" />
          <TrendingItem rank={3} title="The psychology of color in UI" votes="6.1k" />
        </div>
      </div>

      {/* 2. Top Scholars (Leaderboard) */}
      <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100">
        <h3 className="font-bold text-gray-900 mb-4">Top Scholars 🏆</h3>
        <div className="flex flex-wrap gap-2">
          {['@science_guy', '@history_buff', '@tech_guru', '@astro_girl'].map(user => (
            <span key={user} className="bg-gray-50 text-gray-600 px-3 py-1 rounded-full text-xs font-medium border border-gray-200 cursor-pointer hover:bg-blue-50 hover:text-blue-600 hover:border-blue-200 transition-colors">
              {user}
            </span>
          ))}
        </div>
      </div>

      {/* 3. Footer */}
      <div className="flex flex-wrap gap-x-4 gap-y-2 text-xs text-gray-400 px-2">
        <a href="#" className="hover:text-gray-600">About</a>
        <a href="#" className="hover:text-gray-600">Privacy</a>
        <a href="#" className="hover:text-gray-600">Terms</a>
        <span>© 2025 FactNode</span>
      </div>
    </aside>
  );
}

function TrendingItem({ rank, title, votes }: any) {
  return (
    <div className="flex items-start gap-3 cursor-pointer group">
      <span className="text-gray-300 font-black text-lg italic opacity-50">0{rank}</span>
      <div>
        <p className="text-sm font-semibold text-gray-800 group-hover:text-blue-600 leading-snug transition-colors">
          {title}
        </p>
        <p className="text-xs text-gray-400 mt-1 font-medium">{votes} upvotes</p>
      </div>
    </div>
  );
}