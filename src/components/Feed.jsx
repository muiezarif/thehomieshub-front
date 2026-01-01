import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import VideoPost from '@/components/VideoPost';
import { Skeleton } from '@/components/ui/skeleton';

export const mockPosts = [
  {
    id: 1,
    user: { name: 'Alex Nomad', avatar: 'AN', username: 'alexnomad' },
    title: 'Exploring the hidden waterfalls of Bali',
    thumbnail: 'A vibrant green jungle with a cascading waterfall',
    views: '1.2M',
    timestamp: '2 days ago',
    duration: '12:34',
  },
  {
    id: 2,
    user: { name: 'Benny Travels', avatar: 'BT', username: 'bennytravels' },
    title: 'Tokyo Night Market Street Food Tour!',
    thumbnail: 'A bustling Tokyo street at night with neon signs and food stalls',
    views: '890K',
    timestamp: '5 days ago',
    duration: '08:52',
  },
  {
    id: 3,
    user: { name: 'Carlos Jetsetter', avatar: 'CJ', username: 'carlosjet' },
    title: 'My Top 5 Travel Hacks for 2025',
    thumbnail: 'A flat lay of travel essentials like a passport, camera, and map on a wooden table',
    views: '2.5M',
    timestamp: '1 week ago',
    duration: '15:01',
  },
  {
    id: 4,
    user: { name: 'David Roams', avatar: 'DR', username: 'davidroams' },
    title: 'Hiking the Patagonia trails - A solo journey',
    thumbnail: 'A stunning mountain landscape in Patagonia with a lone hiker',
    views: '750K',
    timestamp: '2 weeks ago',
    duration: '22:18',
  },
   {
    id: 5,
    user: { name: 'Ethan Quest', avatar: 'EQ', username: 'ethanquest' },
    title: 'Santorini Sunsets are Unreal',
    thumbnail: 'A classic Santorini sunset over the white buildings and blue domes',
    views: '3.1M',
    timestamp: '3 weeks ago',
    duration: '05:45',
  },
  {
    id: 6,
    user: { name: 'Frank Wanderer', avatar: 'FW', username: 'frankwanderer' },
    title: 'A Week in Iceland: Ring Road Adventure',
    thumbnail: 'The Northern Lights over a snowy Icelandic landscape',
    views: '1.9M',
    timestamp: '1 month ago',
    duration: '35:20',
  },
  {
    id: 7,
    user: { name: 'George Hops', avatar: 'GH', username: 'georgehops' },
    title: 'NYC Food Guide: Best Eats Under $20',
    thumbnail: 'A close up of a delicious looking slice of New York pizza',
    views: '950K',
    timestamp: '1 month ago',
    duration: '11:11',
  },
  {
    id: 8,
    user: { name: 'Henry Jetlag', avatar: 'HJ', username: 'henryjetlag' },
    title: 'The Ultimate Italian Riviera Drone Shots',
    thumbnail: 'A breathtaking drone shot of the colorful houses of Cinque Terre, Italy',
    views: '2.2M',
    timestamp: '2 months ago',
    duration: '04:30',
  },
];

const Feed = () => {
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 1500);
    return () => clearTimeout(timer);
  }, []);

  if (isLoading) {
    return (
      <div className="p-4 sm:p-6 lg:p-8">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-x-4 gap-y-8">
          {Array.from({ length: 8 }).map((_, i) => (
            <div key={i} className="space-y-3">
              <Skeleton className="h-48 w-full rounded-xl" />
              <div className="space-y-2">
                <Skeleton className="h-4 w-3/4" />
                <Skeleton className="h-4 w-1/2" />
                <div className="flex items-center gap-2 pt-2">
                  <Skeleton className="h-8 w-8 rounded-full" />
                  <Skeleton className="h-4 w-20" />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="p-4 sm:p-6 lg:p-8">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-x-4 gap-y-8">
        {mockPosts.map((post, index) => (
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
    </div>
  );
};

export default Feed;