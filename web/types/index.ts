// web/types/index.ts

export interface UserProfile {
  id: number;
  username: string;
  avatar?: string;
  reputation_score: number;
  rank_title: string; // e.g., "Scholar", "Novice" (Matches your Django Profile model)
}

export interface Comment {
  id: number;
  content: string;
  author: UserProfile;
  created_at: string;
  replies?: Comment[];
}

export interface Fact {
  id: number;
  title: string;
  slug: string;
  content: string;
  image?: string;
  author: UserProfile;
  category: { name: string; slug: string };
  score: number;       // Calculated from your Vote model
  user_vote: "UP" | "DOWN" | null;
  is_bookmarked: boolean;
  comment_count: number;
  created_at: string;
}