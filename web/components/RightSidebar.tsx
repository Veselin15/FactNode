export default function RightSidebar() {
  return (
    <aside className="hidden lg:flex flex-col w-80 shrink-0 sticky top-20 h-fit gap-6">

      {/* Trending Box */}
      <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100">
        <h3 className="font-bold text-gray-900 mb-4 flex items-center gap-2">
          📈 Trending Now
        </h3>
        <div className="space-y-4">
          <TrendingItem rank={1} title="The James Webb Telescope just found..." votes="12.5k" />
          <TrendingItem rank={2} title="History of the Roman Concrete" votes="8.2k" />
          <TrendingItem rank={3} title="Why cats actually purr" votes="6.1k" />
        </div>
        <button className="w-full mt-4 py-2 text-sm text-blue-600 font-semibold hover:bg-blue-50 rounded-lg transition">
          Show More
        </button>
      </div>

      {/* Top Contributors */}
      <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100">
        <h3 className="font-bold text-gray-900 mb-4">Top Scholars 🏆</h3>
        <div className="flex flex-wrap gap-2">
          {['@science_guy', '@history_buff', '@tech_guru'].map(user => (
            <span key={user} className="bg-gray-100 text-gray-600 px-3 py-1 rounded-full text-xs font-medium cursor-pointer hover:bg-gray-200">
              {user}
            </span>
          ))}
        </div>
      </div>

      {/* Footer Links */}
      <div className="flex flex-wrap gap-x-4 gap-y-2 text-xs text-gray-400 px-2">
        <a href="#" className="hover:underline">About</a>
        <a href="#" className="hover:underline">Guidelines</a>
        <a href="#" className="hover:underline">Privacy</a>
        <span>© 2025 FactNode</span>
      </div>
    </aside>
  );
}

function TrendingItem({ rank, title, votes }: any) {
  return (
    <div className="flex items-start gap-3 cursor-pointer group">
      <span className="text-gray-300 font-bold text-lg">{rank}</span>
      <div>
        <p className="text-sm font-medium text-gray-800 group-hover:text-blue-600 leading-snug">
          {title}
        </p>
        <p className="text-xs text-gray-400 mt-0.5">{votes} upvotes</p>
      </div>
    </div>
  );
}