
import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet';
import { motion } from 'framer-motion';
import { Library, Upload, Plus, Lock, Radio, Film, MessageSquare, BarChart2, MapPin, Calendar, Heart, Bookmark } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { useContent } from '@/contexts/ContentContext';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import FeedItem from '@/components/FeedItem';
import { cn } from '@/lib/utils';
import { useNavigate } from 'react-router-dom';

const EmptyTabState = ({ icon: Icon, title, description, onAction, actionLabel }) => (
  <motion.div 
    initial={{ opacity: 0, scale: 0.95 }} 
    animate={{ opacity: 1, scale: 1 }}
    className="flex flex-col items-center justify-center py-12 text-center border border-dashed border-muted-foreground/25 rounded-xl bg-muted/5"
  >
      <div className="bg-muted/50 p-6 rounded-full mb-6 ring-1 ring-border">
          <Icon className="h-10 w-10 text-muted-foreground/70" />
      </div>
      <h3 className="text-xl font-bold mb-2 text-foreground">{title}</h3>
      <p className="text-muted-foreground max-w-sm mx-auto mb-6 text-sm">
          {description}
      </p>
      {actionLabel && (
        <Button onClick={onAction} size="lg" className="bg-primary text-primary-foreground hover:bg-primary/90 font-bold min-w-[160px]">
            {actionLabel}
        </Button>
      )}
  </motion.div>
);

const LibraryPage = ({ onLoginRequest }) => {
  const { user } = useAuth();
  const { verticalPosts, communityPosts, likedPostIds, savedPostIds } = useContent();
  const [isLoading, setIsLoading] = useState(true);
  const [likedPosts, setLikedPosts] = useState([]);
  const [savedPosts, setSavedPosts] = useState([]);
  const navigate = useNavigate();
  
  useEffect(() => {
    if (!user) {
      setLikedPosts([]);
      setSavedPosts([]);
      setIsLoading(false);
      return;
    }

    const fetchLibraryContent = async () => {
        setIsLoading(true);
        // Simulate brief loading for better UX
        await new Promise(resolve => setTimeout(resolve, 400));
        
        // Normalize vertical posts to have a type 'clip' if missing and ensure content object exists
        const normalizedVertical = verticalPosts.map(p => ({
            ...p, 
            type: p.type || 'clip',
            content: p.content || { 
                text: p.description || p.title || '',
                title: p.title || ''
            }
        }));
        const allContent = [...normalizedVertical, ...communityPosts];

        // Filter for Liked
        const liked = allContent.filter(p => likedPostIds.includes(String(p.id)));
        // Filter for Saved
        const saved = allContent.filter(p => savedPostIds.includes(String(p.id)));

        // Sort by 'recent' (using random for mock, in real app use timestamp)
        setLikedPosts(liked);
        setSavedPosts(saved);
        setIsLoading(false);
    };

    fetchLibraryContent();
  }, [user, verticalPosts, communityPosts, likedPostIds, savedPostIds]);

  const goToExplore = () => navigate('/explore');

  const renderTabContent = (category, icon, title, description, emptyActionLabel) => {
      if (isLoading) {
          return (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 pt-6">
                {[1,2,3].map(i => <Skeleton key={i} className="h-64 rounded-xl" />)}
            </div>
          );
      }

      // Filter displayed posts based on category
      // If 'all', show all liked posts
      let displayPosts = likedPosts;
      if (category === 'livestream') {
          // Mock filtering for livestreams or events that might be streams
          displayPosts = likedPosts.filter(p => p.type === 'livestream' || p.type === 'event'); 
      } else if (category !== 'all') {
          displayPosts = likedPosts.filter(p => p.type === category);
      }

      if (displayPosts.length === 0) {
          return (
              <div className="pt-8">
                <EmptyTabState 
                    icon={icon}
                    title={title}
                    description={description}
                    onAction={goToExplore}
                    actionLabel={emptyActionLabel}
                />
              </div>
          );
      }

      return (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 pt-6">
             {displayPosts.map(post => (
                 <FeedItem key={post.id} post={post} onLoginRequest={onLoginRequest} />
             ))}
          </div>
      );
  };

  return (
    <>
      <Helmet>
        <title>My Library - The Homies Hub</title>
        <meta name="description" content="View your liked and saved content." />
      </Helmet>
      <div className="p-6 lg:p-8 max-w-7xl mx-auto space-y-6">
        <div className="flex items-center justify-between mb-2">
            <div>
                <h1 className="text-3xl font-bold tracking-tight flex items-center gap-3">
                    <Library className="h-8 w-8 text-primary" />
                    My Library
                </h1>
                <p className="text-muted-foreground mt-2 text-sm">
                    Your collection of liked videos, posts, and saved moments.
                </p>
            </div>
            <div className="flex gap-2 text-sm text-muted-foreground bg-muted/30 px-3 py-1 rounded-full border border-border/50">
                 <Heart className="h-4 w-4 fill-red-500 text-red-500" /> 
                 <span className="font-semibold text-foreground">{likedPosts.length}</span> Liked
                 <span className="mx-1">•</span>
                 <Bookmark className="h-4 w-4 fill-yellow-500 text-yellow-500" /> 
                 <span className="font-semibold text-foreground">{savedPosts.length}</span> Saved
            </div>
        </div>

        <Tabs defaultValue="all" className="w-full">
            <TabsList className="bg-muted/50 p-1 h-12 w-full justify-start overflow-x-auto no-scrollbar">
                <TabsTrigger value="all" className="px-4 h-10">All Liked</TabsTrigger>
                <TabsTrigger value="livestream" className="px-4 h-10">Livestreams</TabsTrigger>
                <TabsTrigger value="clip" className="px-4 h-10">Reels</TabsTrigger>
                <TabsTrigger value="thread" className="px-4 h-10">Threads</TabsTrigger>
                <TabsTrigger value="poll" className="px-4 h-10">Polls</TabsTrigger>
                <TabsTrigger value="trip" className="px-4 h-10">Trips</TabsTrigger>
            </TabsList>

            <TabsContent value="all" className="min-h-[400px]">
                 {renderTabContent('all', Heart, "No Liked Content", "Items you like across the app will appear here.", "Explore Content")}
            </TabsContent>
            <TabsContent value="livestream" className="min-h-[400px]">
                 {renderTabContent('livestream', Radio, "No Liked Livestreams", "Past streams you've enjoyed will show up here.", "Find Streams")}
            </TabsContent>
            <TabsContent value="clip" className="min-h-[400px]">
                 {renderTabContent('clip', Film, "No Liked Reels", "Like short videos to save them to your library.", "Watch Reels")}
            </TabsContent>
            <TabsContent value="thread" className="min-h-[400px]">
                 {renderTabContent('thread', MessageSquare, "No Liked Threads", "Interesting conversations you like will be saved here.", "Read Threads")}
            </TabsContent>
             <TabsContent value="poll" className="min-h-[400px]">
                 {renderTabContent('poll', BarChart2, "No Liked Polls", "Polls you engage with can be found here.", "Find Polls")}
            </TabsContent>
             <TabsContent value="trip" className="min-h-[400px]">
                 {renderTabContent('trip', MapPin, "No Liked Trips", "Trip itineraries you like will be collected here.", "Discover Trips")}
            </TabsContent>
        </Tabs>
      </div>
    </>
  );
};

export default LibraryPage;
