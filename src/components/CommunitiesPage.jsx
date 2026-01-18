import React, { useEffect, useMemo, useState } from "react";
import { motion } from "framer-motion";
import FeedItem from "@/components/FeedItem";
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";
import { useContent } from "@/contexts/ContentContext";
import CommunityPostCreator from "@/components/CommunityPostCreator"; // use your existing creator flow

const CommunitiesPage = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const { communityPosts, loadCommunityPosts } = useContent();

  useEffect(() => {
    loadCommunityPosts?.();
  }, [loadCommunityPosts]);

  const filteredPosts = useMemo(() => {
    const posts = Array.isArray(communityPosts) ? communityPosts : [];
    if (!searchTerm.trim()) return posts;

    const q = searchTerm.toLowerCase();
    return posts.filter((p) => {
      const text = (p?.content?.text || "").toLowerCase();
      const name = (p?.user?.name || "").toLowerCase();
      const username = (p?.user?.username || "").toLowerCase();
      return text.includes(q) || name.includes(q) || username.includes(q);
    });
  }, [communityPosts, searchTerm]);

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <header className="mb-8">
        <h1 className="text-4xl font-bold tracking-tight">Communities</h1>
        <p className="text-muted-foreground mt-2">
          Discussions, tips, and stories from the Homies Hub community.
        </p>
      </header>

      <div className="relative mb-6">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
        <Input
          placeholder="Search posts by keyword or #hashtag..."
          className="pl-12 h-12 text-base"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      {/* ✅ Post creation: uses your real PostModal flows (thread/poll/trip/event) */}
      <div className="mb-8">
        <CommunityPostCreator />
      </div>

      <div className="space-y-6">
        {filteredPosts.map((post, index) => (
          <motion.div
            key={post.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.35, delay: index * 0.03 }}
          >
            <FeedItem post={post} />
          </motion.div>
        ))}
      </div>
    </div>
  );
};

export default CommunitiesPage;
