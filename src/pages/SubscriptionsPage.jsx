
import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet';
import { motion } from 'framer-motion';
import { Clapperboard, Compass, UserCheck, Search } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import VideoPost from '@/components/VideoPost';
import { Link } from 'react-router-dom';
import { Skeleton } from '@/components/ui/skeleton';
import { useAuth } from '@/contexts/AuthContext';

const SubscriptionsPage = () => {
  const { user } = useAuth();
  const [subscriptions, setSubscriptions] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    const fetchSubscriptions = async () => {
        setIsLoading(true);
        
        // Simulate API delay
        await new Promise(resolve => setTimeout(resolve, 800));

        // Mock Data for Subscriptions
        const mockData = [
            {
                id: 'sub-1',
                title: 'Hidden Waterfalls of Bali: Secret Spots Guide',
                thumbnail: 'https://images.unsplash.com/photo-1596395819057-d37f71ca8eb5?w=800&auto=format&fit=crop',
                videoUrl: 'https://assets.mixkit.co/videos/preview/mixkit-waterfall-in-forest-2213-large.mp4',
                user: { name: 'Alex Nomad', username: 'alexnomad', avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&h=150&fit=crop&crop=faces' },
                views: '12K',
                timestamp: '2 hours ago',
                isSubscriberOnly: true,
                isNSFW: false
            },
            {
                id: 'sub-2',
                title: 'Street Food Tour in Osaka - Must Eats!',
                thumbnail: 'https://images.unsplash.com/photo-1580411440870-17070dca2555?w=800&auto=format&fit=crop',
                videoUrl: 'https://assets.mixkit.co/videos/preview/mixkit-people-eating-at-a-street-food-market-4348-large.mp4',
                user: { name: 'Benny Travels', username: 'bennytravels', avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=faces' },
                views: '45K',
                timestamp: '5 hours ago',
                isSubscriberOnly: false,
                isNSFW: false
            },
            {
                id: 'sub-3',
                title: 'Cinematic Drone Shots: Swiss Alps',
                thumbnail: 'https://images.unsplash.com/photo-1530122037265-a5f1f91d3b99?w=800&auto=format&fit=crop',
                videoUrl: 'https://assets.mixkit.co/videos/preview/mixkit-aerial-view-of-green-mountains-and-a-lake-3498-large.mp4',
                user: { name: 'Drone Pilot Dave', username: 'dronedave', avatar: 'https://images.unsplash.com/photo-1557862921-37829c790f19?w=150&h=150&fit=crop&crop=faces' },
                views: '8.2K',
                timestamp: '1 day ago',
                isSubscriberOnly: false,
                isNSFW: false
            },
            {
                id: 'sub-4',
                title: 'Living in a Van: The Reality vs Instagram',
                thumbnail: 'https://images.unsplash.com/photo-1523987355523-c7b5b0dd90a7?w=800&auto=format&fit=crop',
                videoUrl: 'https://assets.mixkit.co/videos/preview/mixkit-man-driving-a-camper-van-through-the-forest-4375-large.mp4',
                user: { name: 'Frank Wanderer', username: 'frankwanderer', avatar: 'https://images.unsplash.com/photo-1566753323558-f4e0952af115?w=150&h=150&fit=crop&crop=faces' },
                views: '150K',
                timestamp: '2 days ago',
                isSubscriberOnly: true,
                isNSFW: false
            },
            {
                id: 'sub-5',
                title: 'Luxury Hotel Review: Burj Al Arab',
                thumbnail: 'https://images.unsplash.com/photo-1582719508461-905c673771fd?w=800&auto=format&fit=crop',
                videoUrl: 'https://assets.mixkit.co/videos/preview/mixkit-luxury-hotel-room-with-a-view-4217-large.mp4',
                user: { name: 'Carlos Jetsetter', username: 'carlosjet', avatar: 'https://images.unsplash.com/photo-1599566150163-29194dcaad36?w=150&h=150&fit=crop&crop=faces' },
                views: '92K',
                timestamp: '3 days ago',
                isSubscriberOnly: false,
                isNSFW: false
            },
            {
                id: 'sub-6',
                title: 'Solo Travel Safety Tips for 2025',
                thumbnail: 'https://images.unsplash.com/photo-1488646953014-85cb44e25828?w=800&auto=format&fit=crop',
                videoUrl: 'https://assets.mixkit.co/videos/preview/mixkit-young-woman-traveler-walking-on-a-wooden-bridge-4368-large.mp4',
                user: { name: 'Sarah Ventures', username: 'sarahv', avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&h=150&fit=crop&crop=faces' },
                views: '33K',
                timestamp: '4 days ago',
                isSubscriberOnly: false,
                isNSFW: false
            }
        ];

        setSubscriptions(mockData);
        setIsLoading(false);
    };

    fetchSubscriptions();
  }, [user]);

  const filteredSubscriptions = subscriptions.filter(sub => {
    const term = searchQuery.toLowerCase();
    return sub.title.toLowerCase().includes(term) || sub.user.name.toLowerCase().includes(term);
  });

  return (
    <>
      <Helmet>
        <title>Subscriptions - The Homies Hub</title>
        <meta name="description" content="Catch up on the latest videos from creators you're subscribed to on The Homies Hub." />
      </Helmet>
      <div className="p-4 sm:p-6 lg:p-8 space-y-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.5 }}>
                <h1 className="text-3xl sm:text-4xl font-bold tracking-tight flex items-center">
                    <Clapperboard className="h-8 w-8 mr-4 text-primary" />
                    Subscriptions
                </h1>
                <p className="text-muted-foreground mt-2">The latest from your favorite creators.</p>
            </motion.div>

            <motion.div 
                initial={{ opacity: 0, x: 20 }} 
                animate={{ opacity: 1, x: 0 }} 
                transition={{ duration: 0.5 }}
                className="w-full md:w-auto min-w-[300px]"
            >
                <div className="relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input 
                        placeholder="Search videos or creators..." 
                        className="pl-9 bg-background border-border focus-visible:ring-primary"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                    />
                </div>
            </motion.div>
        </div>

        {isLoading ? (
           <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-x-4 gap-y-8">
              {Array.from({ length: 8 }).map((_, i) => (
                <div key={i} className="space-y-3">
                  <Skeleton className="h-[200px] w-full rounded-xl" />
                  <div className="flex gap-3 mt-3">
                      <Skeleton className="h-9 w-9 rounded-full shrink-0" />
                      <div className="space-y-2 w-full">
                         <Skeleton className="h-4 w-3/4" />
                         <Skeleton className="h-3 w-1/2" />
                      </div>
                  </div>
                </div>
              ))}
           </div>
        ) : filteredSubscriptions.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-x-4 gap-y-8">
            {filteredSubscriptions.map((post, index) => (
              <motion.div
                key={post.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.05 }}
              >
                <VideoPost post={post} />
              </motion.div>
            ))}
          </div>
        ) : (
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }} 
            animate={{ opacity: 1, scale: 1 }} 
            transition={{ duration: 0.5 }}
            className="flex flex-col items-center justify-center text-center py-20 bg-muted/20 border border-dashed rounded-xl"
          >
            {searchQuery ? (
                 <>
                    <div className="bg-muted p-6 rounded-full mb-4">
                        <Search className="h-10 w-10 text-muted-foreground" />
                    </div>
                    <h2 className="text-xl font-bold">No matches found</h2>
                    <p className="text-muted-foreground mt-2">
                        We couldn't find any videos matching "{searchQuery}" in your subscriptions.
                    </p>
                 </>
            ) : (
                <>
                    <div className="bg-primary/10 p-6 rounded-full mb-6">
                        <UserCheck className="h-12 w-12 text-primary" />
                    </div>
                    <h2 className="text-2xl font-bold">No subscriptions yet</h2>
                    <p className="text-muted-foreground mt-2 max-w-md mb-6">
                    Subscribe to creators to see their latest videos here. Unlock exclusive content and support your favorite homies.
                    </p>
                    <Button asChild size="lg">
                    <Link to="/explore">
                        <Compass className="mr-2 h-4 w-4" />
                        Discover Creators
                    </Link>
                    </Button>
                </>
            )}
          </motion.div>
        )}
      </div>
    </>
  );
};

export default SubscriptionsPage;
