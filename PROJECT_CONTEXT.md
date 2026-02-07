📂 FACTNODE: Master Project Context & Roadmap
1. Project Vision
FactNode is a cross-platform (Web & Mobile) application where users consume bite-sized knowledge (facts), engage with a community (vote, comment, review), and gamify their learning process (ranks, points, quizzes).

Core Loop: Scroll -> Read -> Rate/Review -> Earn Reputation -> Rank Up.

Future Goal: User-generated Quizzes and Spaced Repetition Learning.

2. Tech Stack (The "Holy Trinity")
Backend: Django 5 + Django REST Framework (DRF).

Database: SQLite (Dev) / PostgreSQL (Prod).

Auth: JWT (SimpleJWT).

Web Frontend: Next.js 15 (App Router) + Tailwind CSS v4.

Mobile App: React Native (Expo). Shared logic with Web.

Infrastructure: Docker Compose.

3. Data Architecture (Current & Planned)
Users: Custom Auth, Profile (Avatar, Bio, Links).

Reputation: ReputationLog (Audit trail of points), Rank (Calculated from points).

Content:

Fact (Title, Content, Image, Category, Status).

Vote (Up/Down).

Comment (Nested threading for reviews/discussions).

Bookmark (Save for later).

FactSource (URLs for verification).

Quizzes (Planned): Quiz, Question, Answer, UserQuizResult.

4. Development Roadmap
✅ Phase 1: The Foundation (Current Status)
[x] Backend Setup: Django project initialized, Dockerized.

[x] Core Models: User, Profile, Fact, Category, Vote.

[x] API: Basic CRUD endpoints for feed and facts.

[x] Web Setup: Next.js initialized with Tailwind.

[ ] Action: Add Comment model to Backend (Crucial for "Reviews").

[ ] Action: Connect Frontend to Backend using Environment Variables.

🚀 Phase 2: The "Lovable" UI & Engagement
[ ] Mock Data Mode: Create mockFacts.ts and types/index.ts to allow UI design without backend connection.

[ ] UI Overhaul: Redesign FactCard to look like a modern social card (Instagram/Reddit style).

[ ] Comment Section: Build the UI for users to leave reviews/discussions on facts.

[ ] Rank Display: Visually show "Novice", "Scholar", "Professor" badges next to usernames.

[ ] Filter/Search: Allow sorting by "Most Controversial", "Top Rated", "Newest".

⚡ Phase 3: Gamification & "Sticky" Features
[ ] Daily Streaks: (Idea) Reward users for opening the app 7 days in a row.

[ ] Verification Ticks: (Idea) Facts with 3+ Verified Sources get a "Green Check."

[ ] Badges System: (Idea) Awards for specific actions (e.g., "Biology Buff" for reading 50 Biology facts).

[ ] Notifications: User gets alerted when:

Someone replies to their comment.

Their fact gets 100 upvotes.

They rank up.

📱 Phase 4: Mobile Expansion (React Native/Expo)
[ ] Init Expo Project: Set up the mobile repo sharing the same API types.

[ ] Port Components: Adapt the FactCard logic from React (Web) to React Native.

[ ] Gestures: Implement "Swipe Left/Right" to vote (Tinder style for facts).

🧠 Phase 5: The Learning Engine (Quizzes)
[ ] Quiz Models: Create Backend models for Quizzes linked to Categories.

[ ] AI Generation: (Idea) Use OpenAI API to auto-generate a 3-question quiz based on a Fact's content.

[ ] "Did I Learn?" Button: After 5 facts, prompt a quick pop-up quiz for bonus points.

5. Unique Feature Ideas (The "Secret Sauce")
"Explain Like I'm 5" (AI Integration):

Add a button on complex facts that uses AI to simplify the text for younger readers.

Audio Facts (Accessibility):

Text-to-Speech button so users can listen to facts while driving/walking (Podcast mode).

Fact Battles:

Put two contradicting facts side-by-side (or common misconceptions vs. reality) and let users vote on the truth.

Spaced Repetition:

If a user bookmarks a fact, resurface it in their feed 3 days later to reinforce memory.

6. Current Immediate Tasks (To-Do List)
[ ]
