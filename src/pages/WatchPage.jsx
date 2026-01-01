import React, { useEffect, useMemo, useRef, useState } from "react";
import { Helmet } from "react-helmet";
import { useLocation, useParams, Navigate } from "react-router-dom";
import VerticalVideoFeed from "@/components/VerticalVideoFeed";
import api from "@/api/homieshub";

// helpers
const safeArray = (v) => (Array.isArray(v) ? v : []);

const mapCreator = (creator) => ({
  id: creator?._id || creator?.id,
  name: creator?.name || creator?.fullName || creator?.username || "User",
  username: creator?.username || "user",
  avatar: creator?.avatarUrl || creator?.avatar || "",
  verified: !!creator?.verified,
});

const mapVideoToFeedPost = (v) => {
  const id = v?._id || v?.id;
  const creator = mapCreator(v?.creator);

  return {
    id,
    type: "clip",
    kind: "video",
    muxPlaybackId: v?.muxPlaybackId || null,
    videoUrl: v?.videoUrl || "",

    thumbnail: v?.thumbnailUrl || v?.thumbnail || "",
    title: v?.title || "",
    description: v?.description || v?.caption || "",

    user: creator,

    engagement: {
      likes: v?.stats?.likes ?? 0,
      comments: v?.stats?.comments ?? 0,
      shares: v?.stats?.shares ?? 0,
      saves: v?.stats?.saves ?? 0,
    },

    tags: safeArray(v?.tags),
    timestamp: v?.createdAt || v?.updatedAt || new Date().toISOString(),

    isNSFW: !!v?.isNSFW,
    isSubscriberOnly: !!v?.isSubscriberOnly,
  };
};

const mapReelToFeedPost = (r) => {
  const id = r?._id || r?.id;
  const creator = mapCreator(r?.creator);

  return {
    id,
    type: "clip",
    kind: "reel",
    muxPlaybackId: r?.muxPlaybackId || null,
    videoUrl: r?.videoUrl || "",

    thumbnail: r?.thumbnailUrl || r?.thumbnail || "",
    title: r?.title || "",
    description: r?.caption || "",

    user: creator,

    engagement: {
      likes: r?.stats?.likes ?? 0,
      comments: r?.stats?.comments ?? 0,
      shares: r?.stats?.shares ?? 0,
      saves: r?.stats?.saves ?? 0,
    },

    tags: safeArray(r?.tags),
    timestamp: r?.createdAt || r?.updatedAt || new Date().toISOString(),

    isNSFW: !!r?.isNSFW,
    isSubscriberOnly: !!r?.isSubscriberOnly,
  };
};

const WatchPage = ({ onLoginRequest }) => {
  const { postId } = useParams();
  const location = useLocation();

  // We will pass this when user clicks a video on profile page
  const username = location?.state?.username || null;

  const [loading, setLoading] = useState(true);
  const [posts, setPosts] = useState([]);
  const [initialIndex, setInitialIndex] = useState(0);

  // If someone hits /watch/:id directly without state, redirect home (or you can show an error)
  if (!username) {
    return <Navigate to="/" replace />;
  }

  useEffect(() => {
    let cancelled = false;

    const loadProfileContent = async () => {
      try {
        setLoading(true);

        // ✅ Use your existing profile content endpoint
        // (same one UserProfilePage uses)
        const resp = await api.get(`/profile/${username}/content`, {
          params: { page: 1, limit: 100 },
        });

        const result = resp?.data?.result || {};
        const videos = safeArray(result?.videos);
        const reels = safeArray(result?.reels);

        const mapped = [
          ...videos.map(mapVideoToFeedPost),
          ...reels.map(mapReelToFeedPost),
        ]
          .filter((p) => p?.id)
          .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());

        if (cancelled) return;

        setPosts(mapped);

        // Start feed at clicked postId if exists
        const idx = mapped.findIndex((p) => String(p.id) === String(postId));
        setInitialIndex(idx >= 0 ? idx : 0);
      } catch (e) {
        console.error("WatchPage: failed to load profile content", e);
        if (!cancelled) setPosts([]);
      } finally {
        if (!cancelled) setLoading(false);
      }
    };

    loadProfileContent();

    return () => {
      cancelled = true;
    };
  }, [username, postId]);

  const title = useMemo(() => `Watch @${username} - The Homies Hub`, [username]);

  return (
    <>
      <Helmet>
        <title>{title}</title>
      </Helmet>

      <div className="flex flex-col h-full bg-black relative">
        {/* No stories header here; just the watch feed */}
        <div className="flex-1 min-h-0 w-full bg-black relative overflow-hidden">
          <VerticalVideoFeed
            posts={posts}
            onLoginRequest={onLoginRequest}
            aspectRatio="vertical"
            initialIndex={initialIndex} // ✅ if your VerticalVideoFeed supports it
          />
        </div>
      </div>
    </>
  );
};

export default WatchPage;
