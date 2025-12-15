import Navbar from "@/components/Navbar";
import LeftSidebar from "@/components/LeftSidebar";
import RightSidebar from "@/components/RightSidebar";
import Feed from "@/components/Feed";

export default function BookmarksPage() {
  return (
    <div className="min-h-screen bg-[#F0F2F5]">
      <Navbar />
      <main className="max-w-7xl mx-auto pt-24 px-4 sm:px-6 lg:px-8">
        <div className="flex gap-8 justify-center">
          <LeftSidebar />
          <Feed
            apiEndpoint="http://127.0.0.1:8000/api/facts/feed/bookmarks/"
            title="Your Bookmarks"
            emptyMessage="You haven't bookmarked any facts yet."
          />
          <RightSidebar />
        </div>
      </main>
    </div>
  );
}