// web/data/mockData.ts
import { Fact } from '../types';

export const MOCK_FACTS: Fact[] = [
  {
    id: 1,
    title: "Honey never spoils",
    slug: "honey-never-spoils",
    content: "Archaeologists have found pots of honey in ancient Egyptian tombs that are over 3,000 years old and still perfectly edible.",
    image: "https://images.unsplash.com/photo-1587049352846-4a222e784d38?auto=format&fit=crop&w=800",
    author: { id: 1, username: "HistoryBuff", reputation_score: 1500, rank_title: "Professor" },
    category: { name: "History", slug: "history" },
    score: 342,
    user_vote: "UP",
    is_bookmarked: true,
    comment_count: 12,
    created_at: "2023-11-01T10:00:00Z"
  },
  {
    id: 2,
    title: "Octopuses have three hearts",
    slug: "octopuses-three-hearts",
    content: "Two hearts pump blood to the gills, while a third circulates it to the rest of the body. When they swim, the systemic heart stops beating.",
    image: "https://images.unsplash.com/photo-1545671913-b89ac1b4ac10?auto=format&fit=crop&w=800",
    author: { id: 2, username: "BioNerd", reputation_score: 45, rank_title: "Curious Mind" },
    category: { name: "Biology", slug: "biology" },
    score: 89,
    user_vote: null,
    is_bookmarked: false,
    comment_count: 5,
    created_at: "2023-11-02T14:30:00Z"
  }
];