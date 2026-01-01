
# The Homies Hub - Developer Documentation

Welcome to The Homies Hub! This guide provides a focused overview of the core systems, particularly the video feed architecture, messaging, and admin tools to help new developers get up to speed quickly without breaking critical functionality.

## 1. Core Pages & Architecture

*   **Home Feed (`src/pages/HomePage.jsx`):** The main entry point. It wraps `VerticalVideoFeed`. It relies on `App.jsx` to define the available viewport height (`calc(100vh - header)`).
*   **Vertical Video Feed (`src/components/VerticalVideoFeed.jsx`):** A scroll-snap container.
    *   **Crucial Rule:** Each feed item MUST be `h-full` (not `100vh`) to fit strictly within the calculated content area, ensuring UI overlays (like/comment buttons) are visible and not cut off by the browser bottom bar or navigation.
*   **Mint a Moment:** The flow for converting content into digital collectibles. Found in `PostModal.jsx` and `MintedCollectibleModal.jsx`.
*   **Upload Reel:** Handled via `UploadReelModal.jsx`. Supports file selection and preview before posting.
*   **Creator Studio (`src/pages/CreatorStudioPage.jsx`):** Dashboard for analytics and monetization settings.
*   **AI Assistant (`src/pages/MyAIPage.jsx`):** An interactive AI chatbot providing travel and general knowledge, with predictive text bubbles and an FAQ section.
*   **Communities (`src/pages/CommunitiesPage.jsx`):** A social feed where users can create posts with text, images, videos, polls, and location tags.
*   **Subscriptions (`src/pages/SubscriptionsPage.jsx`):** Displays content from creators a user is subscribed to, including search functionality.
*   **My Library (`src/pages/LibraryPage.jsx`):** A centralized hub for all liked and saved content (videos, posts, livestreams, images, polls, trips).

## 2. Messaging System (New)

A complete DM system is implemented using `MessageContext`.

*   **Inbox (`/inbox`):**
    *   **Desktop:** Split view with thread list on left, chat on right.
    *   **Mobile:** Adaptive layout. Shows thread list initially, transitions to full-screen chat when a thread is selected.
*   **Requests:** Messages from unknown users are filtered into a "Requests" tab in the Inbox sidebar. Users can "Accept" or "Archive" them.
*   **Search:** Integrated user search within the Inbox sidebar to start new conversations.
*   **Context:** `MessageContext.jsx` handles state management and `localStorage` persistence for threads and requests.
*   **Notification Center:** The bell icon in the header now opens a tabbed popover consolidating Notifications, Messages, and System Alerts.

## 3. Video System & Reposting

The video playback system is designed to be robust across different aspect ratios while maintaining a unified UI.

*   **Components:** `VerticalVideo.jsx` (Player), `VideoPost.jsx` (Preview).
*   **TikTok-style Repost:**
    *   Located in the `ShareDialog` (Share button on video).
    *   **"Save with Watermark":** Simulates downloading the video content overlaid with The Homies Hub branding, allowing users to share content cross-platform while retaining attribution.

## 4. Admin Tools

*   **Dashboard:** Located at `/admin/dashboard`.
*   **Gift Points:** Admins can manually gift "Homie Points" to users via the dashboard using the "Gift Points" dialog.
*   **User Management:** Ban/Unban users, view active users.
*   **Content Moderation:** Delete posts, terminate live streams.

## 5. Wallet & Minting

*   **Wallet Scope (`WalletContext.jsx`):** Manages "Homie Points" and "Badges". Internal ledger system simulating crypto-wallet UX.
*   **Location Verification:** Used for "Place" based minting.
*   **Minting:** "Locking" a post to create a unique ID. Simulates blockchain permanence.

---

## 6. Backend/Database Requirements & API Endpoints

This application is currently frontend-only, leveraging `localStorage` for some persistence and mock data for demonstrations. For a production environment, a robust backend is essential. Supabase is the recommended solution.

### General Backend Design Principles:
*   **Authentication:** User authentication and authorization (login, registration, session management, role-based access control for admin/moderator features).
*   **Data Storage:** Persistent storage for user data, posts, media, messages, likes, subscriptions, etc.
*   **Real-time Capabilities:** For live streams, chat, and notifications.
*   **File Storage:** For user avatars, post images/videos, and other media.

### Feature-Specific Requirements:

#### a) User Management & Authentication
*   **Data:** Users (ID, username, email, password_hash, avatar, bio, tier, roles, joined_date, social_links).
*   **API Endpoints:**
    *   `POST /auth/register`
    *   `POST /auth/login`
    *   `POST /auth/logout`
    *   `GET /users/{id}`
    *   `GET /users/search?q={query}`
    *   `PUT /users/{id}` (Update profile)
    *   `POST /users/{id}/follow`
    *   `DELETE /users/{id}/follow`
    *   `POST /admin/users/{id}/ban`
    *   `DELETE /admin/users/{id}/ban`
*   **Database Tables (Supabase):**
    *   `profiles`: Stores user details, linked to `auth.users`.
    *   `follows`: `follower_id`, `following_id`.

#### b) Content (Posts, Videos, Lives, Communities, AI)
*   **Data:**
    *   Posts (ID, user_id, type (text, clip, thread, poll, trip, event, mint), content_text, media_urls[], poll_data, location, timestamp, engagement_counts (likes, comments, shares), NSFW_flag, subscriber_only_flag).
    *   Videos (ID, user_id, video_url, thumbnail_url, title, description, duration, engagement_counts, NSFW_flag, subscriber_only_flag).
    *   Live Streams (ID, user_id, stream_key, title, status, start_time, end_time, viewer_count, chat_messages).
    *   AI Chat History (user_id, messages[]).
*   **API Endpoints:**
    *   `GET /posts` (fetch all posts, with filters/pagination)
    *   `GET /posts/{id}`
    *   `POST /posts` (create post)
    *   `PUT /posts/{id}`
    *   `DELETE /posts/{id}`
    *   `GET /videos`
    *   `GET /videos/{id}`
    *   `POST /videos` (upload video)
    *   `GET /live` (active streams)
    *   `GET /live/{id}`
    *   `POST /live/start`
    *   `POST /live/{id}/end`
    *   `POST /ai/chat` (send message to AI)
*   **Database Tables (Supabase):**
    *   `posts`: Main content table.
    *   `post_media`: Stores media URLs (one-to-many from `posts`).
    *   `polls`: Stores poll questions and options (one-to-one from `posts`).
    *   `videos`: Stores video-specific metadata.
    *   `live_streams`: Stores live stream details.
    *   `ai_chat_sessions`: Stores AI conversation history for users.
    *   `storage.buckets`: For storing video and image files.

#### c) Engagement (Likes, Comments, Shares)
*   **Data:**
    *   Likes (user_id, post_id, video_id).
    *   Comments (ID, post_id, user_id, text, timestamp, likes_count).
*   **API Endpoints:**
    *   `POST /posts/{id}/like`
    *   `DELETE /posts/{id}/like`
    *   `GET /posts/{id}/comments`
    *   `POST /posts/{id}/comments`
    *   `DELETE /comments/{id}`
*   **Database Tables (Supabase):**
    *   `likes`: `user_id`, `post_id` (or `video_id`), composite primary key.
    *   `comments`: `id`, `post_id` (or `video_id`), `user_id`, `text`, `created_at`.

#### d) Subscriptions & Monetization
*   **Data:** Subscriptions (subscriber_id, creator_id, start_date, end_date, tier_id).
*   **API Endpoints:**
    *   `GET /users/{id}/subscriptions` (creator's subscriptions)
    *   `POST /users/{id}/subscribe` (initiate subscription, e.g., via Stripe webhook)
    *   `GET /subscriptions/{id}/content` (subscriber-only content)
*   **Database Tables (Supabase):**
    *   `subscriptions`: `subscriber_id`, `creator_id`, `tier_id`, `status`.
    *   `tiers`: `id`, `name`, `price`, `description`, `features`.

#### e) Messaging
*   **Data:** Messages (ID, sender_id, receiver_id, content, timestamp, read_status).
*   **API Endpoints:**
    *   `GET /messages/threads`
    *   `GET /messages/threads/{id}` (messages in a thread)
    *   `POST /messages` (send new message)
*   **Database Tables (Supabase):**
    *   `messages`: `id`, `sender_id`, `receiver_id`, `content`, `created_at`, `read_at`.
    *   `conversations`: `id`, `participant1_id`, `participant2_id`, `last_message_id`.

#### f) Library / Saved Content
*   **Data:** Saved/Liked items (user_id, content_id, content_type, saved_date).
*   **API Endpoints:**
    *   `GET /users/{id}/library`
    *   `POST /users/{id}/library` (save/like an item)
    *   `DELETE /users/{id}/library/{item_id}` (remove item)
*   **Database Tables (Supabase):**
    *   `user_library`: `user_id`, `post_id`, `video_id`, `saved_type` (e.g., 'like', 'bookmark'), `created_at`.

## 7. Setup Instructions for Developers

1.  **Clone the Repository:**
    