# 📂 FACTNODE: Master Project Context (v2)

## 1. Project Vision
FactNode is a cross-platform (Web & Mobile) application where users consume bite-sized knowledge (facts), engage with a community (vote, comment, review), and gamify their learning process.
    Core Loop: Scroll -> Read -> Rate/Review -> Earn Reputation -> Rank Up
    Architecture: Django (Backend) + Next.js (Web) + React Native (Mobile)

## 2. Tech Stack
    Backend: Django 5 + DRF
        Auth: SimpleJWT
        Database: SQLite (Dev) / PostgreSQL (Prod)
    Web: Next.js 15 (App Router) + Tailwind CSS v4
    Mobile: React Native (Expo) - Planned Phase 4
    DevOps: Docker Compose

---

## 3. Data Architecture Status
    Implemented Models:
        [x] User
        [x] Profile
        [x] Fact
        [x] Category
        [x] Vote
        [x] Bookmark
    To Be Implemented:
        [ ] Comment (For reviews/discussions)
        [ ] Quiz, Question, UserQuizResult (For learning)

---

## 4. Development Roadmap

### Phase 1: Foundation (Done)
    [x] Basic CRUD for Facts
    [x] Auth System (Login/Signup)
    [x] Feed & Voting Logic
    [x] Bookmarking (Fixed)

### Phase 2: Engagement & Social (Current Focus)
    [ ] Backend Comments: Add Comment model and API endpoints
    [ ] Frontend Comments: Create a CommentSection component in Next.js
    [ ] Rich Profiles: Show "Rank" (e.g., Scholar) on the Fact Card next to the username
    [ ] Filtering: Add tabs for "Newest", "Top Rated", "Controversial"

### Phase 3: Gamification
    [ ] Reputation Engine: Ensure users get XP for approved facts and upvotes
    [ ] Badges: Visual rewards for hitting milestones (e.g., "100 Votes")
    [ ] Notifications: Alerts for replies and rank-ups

### Phase 4: Mobile App (Expo)
    [ ] Initialize Expo project sharing the Django API
    [ ] Port FactCard to React Native

---

## 5. Current Immediate To-Do List
(This is what we work on right now)

    [x] Fix Bookmark URL: (Completed)
    [ ] backend/facts/models.py: Add the Comment model class
    [ ] backend/facts/serializers.py: Create CommentSerializer
    [ ] backend/facts/views.py: Add CommentViewSet (or nested logic)
    [ ] web/components: Build the UI to display and post comments