import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet';
import { useSearchParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Search, Film, MessageSquare, BarChart2, MapPin } from 'lucide-react';
import { mockCommunityPosts } from '@/data/mockCommunityPosts';
import { mockPosts as mockVideoPosts } from '@/components/Feed';
import FeedItem from '@/components/FeedItem';
import VideoPost from '@/components/VideoPost';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

const SearchResultsPage = () => {
    const [searchParams] = useSearchParams();
    const query = searchParams.get('q') || '';
    const [videoResults, setVideoResults] = useState([]);
    const [communityResults, setCommunityResults] = useState([]);

    useEffect(() => {
        if (query) {
            const lowerCaseQuery = query.toLowerCase();

            const filteredVideos = mockVideoPosts.filter(post =>
                post.title.toLowerCase().includes(lowerCaseQuery) ||
                post.user.name.toLowerCase().includes(lowerCaseQuery)
            );

            const filteredCommunity = mockCommunityPosts.filter(post =>
                post.content.text?.toLowerCase().includes(lowerCaseQuery) ||
                (post.type === 'poll' && post.content.poll.question.toLowerCase().includes(lowerCaseQuery)) ||
                (post.type === 'trip' && post.content.trip.title.toLowerCase().includes(lowerCaseQuery)) ||
                post.user.name.toLowerCase().includes(lowerCaseQuery)
            );
            
            setVideoResults(filteredVideos);
            setCommunityResults(filteredCommunity);
        } else {
            setVideoResults([]);
            setCommunityResults([]);
        }
    }, [query]);

    const allResults = [...videoResults.map(v => ({...v, postType: 'video'})), ...communityResults];
    const threadResults = communityResults.filter(p => p.type === 'thread' || p.type === 'text');
    const pollResults = communityResults.filter(p => p.type === 'poll');
    const tripResults = communityResults.filter(p => p.type === 'trip');

    return (
        <>
            <Helmet>
                <title>Search Results for "{query}" - The Homies Hub</title>
            </Helmet>
            <div className="max-w-7xl mx-auto px-4 py-8">
                <motion.header 
                    initial={{ opacity: 0, y: -20 }} 
                    animate={{ opacity: 1, y: 0 }} 
                    transition={{ duration: 0.5 }}
                    className="mb-8"
                >
                    <h1 className="text-3xl font-bold tracking-tight">Search Results</h1>
                    <p className="text-muted-foreground mt-1">Showing results for: <span className="font-semibold text-primary">{query}</span></p>
                </motion.header>

                <Tabs defaultValue="all">
                    <TabsList className="mb-6">
                        <TabsTrigger value="all"><Search className="mr-2 h-4 w-4" /> All ({allResults.length})</TabsTrigger>
                        <TabsTrigger value="videos"><Film className="mr-2 h-4 w-4" /> Videos ({videoResults.length})</TabsTrigger>
                        <TabsTrigger value="threads"><MessageSquare className="mr-2 h-4 w-4" /> Threads ({threadResults.length})</TabsTrigger>
                        <TabsTrigger value="polls"><BarChart2 className="mr-2 h-4 w-4" /> Polls ({pollResults.length})</TabsTrigger>
                        <TabsTrigger value="trips"><MapPin className="mr-2 h-4 w-4" /> Trips ({tripResults.length})</TabsTrigger>
                    </TabsList>
                    
                    <TabsContent value="all">
                        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                            {allResults.map((post, index) => (
                                <motion.div key={`${post.id}-${index}`} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: index * 0.05 }}>
                                    {post.postType === 'video' ? <VideoPost post={post} /> : <FeedItem post={post} />}
                                </motion.div>
                            ))}
                        </div>
                    </TabsContent>
                    <TabsContent value="videos">
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-x-4 gap-y-8">
                            {videoResults.map((post, index) => (
                                <motion.div key={post.id} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: index * 0.05 }}>
                                    <VideoPost post={post} />
                                </motion.div>
                            ))}
                        </div>
                    </TabsContent>
                    <TabsContent value="threads">
                         <div className="max-w-4xl mx-auto space-y-6">
                            {threadResults.map((post, index) => (
                                <motion.div key={post.id} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: index * 0.05 }}>
                                    <FeedItem post={post} />
                                </motion.div>
                            ))}
                        </div>
                    </TabsContent>
                    <TabsContent value="polls">
                        <div className="max-w-4xl mx-auto space-y-6">
                            {pollResults.map((post, index) => (
                                <motion.div key={post.id} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: index * 0.05 }}>
                                    <FeedItem post={post} />
                                </motion.div>
                            ))}
                        </div>
                    </TabsContent>
                    <TabsContent value="trips">
                        <div className="max-w-4xl mx-auto space-y-6">
                            {tripResults.map((post, index) => (
                                <motion.div key={post.id} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: index * 0.05 }}>
                                    <FeedItem post={post} />
                                </motion.div>
                            ))}
                        </div>
                    </TabsContent>
                </Tabs>
                {allResults.length === 0 && (
                    <motion.div 
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="text-center py-20"
                    >
                        <Search className="mx-auto h-16 w-16 text-muted-foreground" />
                        <h2 className="mt-6 text-2xl font-semibold">No results found</h2>
                        <p className="mt-2 text-muted-foreground">Try searching for something else.</p>
                    </motion.div>
                )}
            </div>
        </>
    );
};

export default SearchResultsPage;