import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Card, CardContent } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Search, Compass, Tv, Video, FileText, BarChart2 } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Dialog, DialogContent, DialogTrigger } from '@/components/ui/dialog';
import { Skeleton } from '@/components/ui/skeleton';
import VerticalVideoFeed from '@/components/VerticalVideoFeed';
import FeedItem from '@/components/FeedItem';
import { useContent } from '@/contexts/ContentContext';
import { useAuth } from '@/contexts/AuthContext';
import FilterBar from '@/components/FilterBar';

const ExplorePage = ({ onLoginRequest }) => {
  const { verticalPosts, communityPosts, users } = useContent();
  const [selectedVideo, setSelectedVideo] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [activeFilter, setActiveFilter] = useState('all');
  
  const trendingMoments = verticalPosts.slice(0, 8); // Renamed from trendingReels
  const popularUsers = Object.values(users).slice(0, 5);

  useEffect(() => {
    const timer = setTimeout(() => setIsLoading(false), 1200);
    return () => clearTimeout(timer);
  }, []);

  const handleVideoClick = (video) => {
    setSelectedVideo(video);
  };
  
  const closeVideoModal = () => {
    setSelectedVideo(null);
  };

  const getFilteredCommunityPosts = () => {
    if (activeFilter === 'all') return communityPosts;
    if (activeFilter === 'moments') return []; // Moments are separate section
    if (activeFilter === 'tweets') return communityPosts.filter(p => p.type === 'text' || p.type === 'thread');
    if (activeFilter === 'videos') return communityPosts.filter(p => p.type === 'clip');
    if (activeFilter === 'polls') return communityPosts.filter(p => p.type === 'poll');
    if (activeFilter === 'trips') return communityPosts.filter(p => p.type === 'trip');
    if (activeFilter === 'events') return communityPosts.filter(p => p.type === 'event');
    return communityPosts;
  };

  const filteredPosts = getFilteredCommunityPosts();

  return (
    <>
      <Helmet>
        <title>Explore - The Homies Hub</title>
        <meta name="description" content="Discover trending Moments, community posts, and popular creators." />
      </Helmet>

      <div className="max-w-7xl mx-auto p-4 md:p-6 space-y-6">
        {/* Adjusted top position for sticky header to account for Main Header height on mobile */}
        <header className="space-y-4 sticky bg-background/95 backdrop-blur z-40 pb-4 pt-2 -mt-2 top-[3.5rem] md:top-0">
          <div className="space-y-2">
            <h1 className="text-4xl font-bold tracking-tight text-primary flex items-center gap-3">
                <Compass className="h-10 w-10" />
                Explore
            </h1>
            <p className="text-muted-foreground">Discover new content and creators.</p>
          </div>
          
          <div className="relative max-w-lg">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Search posts, Moments, or users..." 
              className="w-full pl-10"
              // Removed erroneous onFocus blur which prevented typing
            />
          </div>

          <FilterBar 
            activeFilter={activeFilter} 
            onFilterChange={setActiveFilter} 
            className="px-0"
          />
        </header>

        {/* Moments Section - Only show if All or Moments */}
        {(activeFilter === 'all' || activeFilter === 'moments') && (
            <section>
            <div className="flex items-center justify-between mb-4">
                <h2 className="text-2xl font-bold flex items-center gap-2"><Tv className="h-6 w-6 text-primary" /> Trending Moments</h2>
            </div>
            
            {isLoading ? (
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-4 gap-4">
                {Array.from({ length: 8 }).map((_, i) => (
                    <Skeleton key={i} className="aspect-[9/16] rounded-lg w-full" />
                ))}
                </div>
            ) : (
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-4 gap-4">
                {trendingMoments.map((moment) => ( // Renamed from reel to moment
                    <Dialog key={moment.id} onOpenChange={(isOpen) => !isOpen && closeVideoModal()}>
                    <DialogTrigger asChild>
                        <motion.div
                        onClick={() => handleVideoClick(moment)}
                        className="aspect-[9/16] rounded-lg overflow-hidden relative cursor-pointer group"
                        whileHover={{ scale: 1.05 }}
                        transition={{ type: 'spring', stiffness: 300 }}
                        >
                        <div className="w-full h-full relative">
                            {moment.videoUrl && !moment.thumbnail && moment.isNew ? (
                                <video src={moment.videoUrl} className="w-full h-full object-cover" muted />
                            ) : (
                                <img className="w-full h-full object-cover" alt={moment.description} src={moment.thumbnail || "https://images.unsplash.com/photo-1531144393295-da4685b0964c"} />
                            )}
                        </div>
                        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
                        <div className="absolute bottom-2 left-2 text-white p-1">
                            <p className="font-bold text-base line-clamp-1">{moment.title}</p>
                            <p className="text-sm opacity-90 line-clamp-1">@{moment.user.username}</p>
                        </div>
                        </motion.div>
                    </DialogTrigger>
                    {selectedVideo && selectedVideo.id === moment.id && ( // Renamed from reel to moment
                        <DialogContent className="p-0 border-0 bg-black w-full h-full max-w-full sm:max-w-md sm:h-[90vh] sm:rounded-xl overflow-hidden">
                        <VerticalVideoFeed
                            posts={trendingMoments} // Renamed from trendingReels
                            onLoginRequest={onLoginRequest}
                            initialPostId={selectedVideo.id}
                            aspectRatio="vertical"
                            />
                        </DialogContent>
                    )}
                    </Dialog>
                ))}
                </div>
            )}
            </section>
        )}

        {activeFilter !== 'moments' && (
            <section>
            <Tabs defaultValue="community" className="w-full">
                <TabsList className="grid w-full grid-cols-2 mb-4">
                <TabsTrigger value="community">Community</TabsTrigger>
                <TabsTrigger value="popular-users">Popular Users</TabsTrigger>
                </TabsList>
                <TabsContent value="community">
                {isLoading ? (
                    <div className="space-y-4 max-w-4xl mx-auto">
                    {Array.from({ length: 3 }).map((_, i) => (
                        <Skeleton key={i} className="h-48 w-full rounded-lg" />
                    ))}
                    </div>
                ) : (
                    <div className="space-y-4 max-w-4xl mx-auto">
                        {filteredPosts.length > 0 ? (
                             filteredPosts.map(post => <FeedItem key={post.id} post={post} onLoginRequest={onLoginRequest} />)
                        ) : (
                            <div className="text-center py-10 text-muted-foreground">No posts found for this category.</div>
                        )}
                    </div>
                )}
                </TabsContent>
                <TabsContent value="popular-users">
                {isLoading ? (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                    {Array.from({ length: 5 }).map((_, i) => (
                        <div key={i} className="p-4 border rounded-lg flex items-center gap-4">
                        <Skeleton className="w-16 h-16 rounded-full" />
                        <div className="space-y-2 flex-1">
                            <Skeleton className="h-4 w-3/4" />
                            <Skeleton className="h-3 w-1/2" />
                        </div>
                        </div>
                    ))}
                    </div>
                ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                    {popularUsers.map(user => (
                        <Link to={`/profile/${user.username}`} key={user.id}>
                        <Card className="hover:bg-accent transition-colors">
                            <CardContent className="p-4 flex items-center gap-4">
                            <img className="w-16 h-16 rounded-full object-cover" alt={user.name} src={user.avatar} />
                            <div>
                                <h3 className="font-bold">{user.name}</h3>
                                <p className="text-muted-foreground">@{user.username}</p>
                            </div>
                            </CardContent>
                        </Card>
                        </Link>
                    ))}
                    </div>
                )}
                </TabsContent>
            </Tabs>
            </section>
        )}
      </div>
    </>
  );
};

export default ExplorePage;