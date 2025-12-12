
export interface Author {
  username: string;
  is_verified: boolean;
}

export interface Category {
  name: string;
  icon_name: string;
}

export interface Fact {
  id: number;
  title: string;
  content: string;
  image: string | null;
  author: Author;
  category: Category;
  score: number;
  user_vote: "UP" | "DOWN" | null; // <--- The new field
  created_at: string;
}

export interface PaginatedResponse {
  count: number;
  next: string | null;
  previous: string | null;
  results: Fact[];
}