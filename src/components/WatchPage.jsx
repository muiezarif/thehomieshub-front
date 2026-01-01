import React from 'react';
import { useParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ThumbsUp, ThumbsDown, Share2, ListPlus } from 'lucide-react';
import VideoPost from '@/components/VideoPost';
import { useToast } from '@/components/ui/use-toast';

const mockPosts = [
  { id: 1, user: { name: 'Alex Nomad', avatar: 'AN' }, title: 'Exploring the hidden waterfalls of Bali', thumbnail: 'A vibrant green jungle with a cascading waterfall', views: '1.2M', timestamp: '2 days ago', duration: '12:34' },
  { id: 2, user: { name: 'Benny Travels', avatar: 'BT' }, title: 'Tokyo Night Market Street Food Tour!', thumbnail: 'A bustling Tokyo street at night with neon signs and food stalls', views: '890K', timestamp: '5 days ago', duration: '08:52' },
  { id: 3, user: { name: 'Carlos Jetsetter', avatar: 'CJ' }, title: 'My Top 5 Travel Hacks for 2025', thumbnail: 'A flat lay of travel essentials like a passport, camera, and map on a wooden table', views: '2.5M', timestamp: '1 week ago', duration: '15:01' },
  { id: 4, user: { name: 'David Roams', avatar: 'DR' }, title: 'Hiking the Patagonia trails - A solo journey', thumbnail: 'A stunning mountain landscape in Patagonia with a lone hiker', views: '750K', timestamp: '2 weeks ago', duration: '22:18' },
  { id: 5, user: { name: 'Ethan Quest', avatar: 'EQ' }, title: 'Santorini Sunsets are Unreal', thumbnail: 'A classic Santorini sunset over the white buildings and blue domes', views: '3.1M', timestamp: '3 weeks ago', duration: '05:45' },
  { id: 6, user: { name: 'Frank Wanderer', avatar: 'FW' }, title: 'A Week in Iceland: Ring Road Adventure', thumbnail: 'The Northern Lights over a snowy Icelandic landscape', views: '1.9M', timestamp: '1 month ago', duration: '35:20' },
  { id: 7, user: { name: 'George Hops', avatar: 'GH' }, title: 'NYC Food Guide: Best Eats Under $20', thumbnail: 'A close up of a delicious looking slice of New York pizza', views: '950K', timestamp: '1 month ago', duration: '11:11' },
  { id: 8, user: { name: 'Henry Jetlag', avatar: 'HJ' }, title: 'The Ultimate Italian Riviera Drone Shots', thumbnail: 'A breathtaking drone shot of the colorful houses of Cinque Terre, Italy', views: '2.2M', timestamp: '2 months ago', duration: '04:30' },
];

const mockComments = [
    { id: 1, user: { name: 'TravelerTom', avatar: 'TT' }, text: 'Wow, this is incredible! Adding Bali to my bucket list right now.', timestamp: '1 day ago' },
    { id: 2, user: { name: 'Wanderlust_Jane', avatar: 'WJ' }, text: 'Amazing shots! What drone did you use for this?', timestamp: '22 hours ago' },
    { id: 3, user: { name: 'FoodieFrank', avatar: 'FF' }, text: 'I was just there last month! Did you try the Nasi Goreng at the local warung?', timestamp: '15 hours ago' },
];

const WatchPage = () => {
  const { id } = useParams();
  const { toast } = useToast();
  const video = mockPosts.find(p => p.id.toString() === id);
  const suggestedVideos = mockPosts.filter(p => p.id.toString() !== id);

  if (!video) {
    return <div className="p-8 text-center">Video not found!</div>;
  }
  
  const handleInteraction = (feature) => {
    toast({
      title: `🚧 ${feature} Feature In Progress`,
      description: "This feature isn't implemented yet—but don't worry! You can request it in your next prompt! 🚀",
    });
  };

  return (
    <div className="flex flex-col lg:flex-row gap-8 p-4 sm:p-6 lg:p-8">
      <div className="flex-grow lg:w-2/3">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
          <div className="relative aspect-video w-full bg-black rounded-xl overflow-hidden shadow-2xl">
            <img  className="w-full h-full object-contain" alt={video.thumbnail} src="https://images.unsplash.com/photo-1690821993717-5098551df483" />
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="w-20 h-20 bg-black/50 rounded-full flex items-center justify-center backdrop-blur-sm">
                <svg xmlns="http://www.w3.org/2000/svg" width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round" className="text-white/80"><circle cx="12" cy="12" r="10"></circle><polygon points="10 8 16 12 10 16 10 8"></polygon></svg>
              </div>
            </div>
          </div>

          <h1 className="text-2xl font-bold mt-4">{video.title}</h1>
          
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mt-4">
            <div className="flex items-center space-x-4">
              <Avatar className="h-12 w-12">
                <AvatarImage src={`https://avatar.vercel.sh/${video.user.name.replace(' ', '')}.png`} alt={video.user.name} />
                <AvatarFallback>{video.user.avatar}</AvatarFallback>
              </Avatar>
              <div>
                <p className="font-semibold">{video.user.name}</p>
                <p className="text-sm text-muted-foreground">1.2M Subscribers</p>
              </div>
              <Button variant="secondary" onClick={() => handleInteraction('Subscribe')}>Subscribe</Button>
            </div>
            
            <div className="flex items-center space-x-2 mt-4 sm:mt-0">
              <Button variant="ghost" onClick={() => handleInteraction('Like')}>
                <ThumbsUp className="mr-2 h-5 w-5" /> 15K
              </Button>
              <Button variant="ghost" onClick={() => handleInteraction('Dislike')}>
                <ThumbsDown className="h-5 w-5" />
              </Button>
              <Button variant="ghost" onClick={() => handleInteraction('Share')}>
                <Share2 className="mr-2 h-5 w-5" /> Share
              </Button>
              <Button variant="ghost" onClick={() => handleInteraction('Save')}>
                <ListPlus className="mr-2 h-5 w-5" /> Save
              </Button>
            </div>
          </div>

          <div className="bg-muted/50 rounded-xl p-4 mt-4">
            <p className="font-semibold">{video.views} views • {video.timestamp}</p>
            <p className="mt-2 text-sm">
              Join me on an epic adventure as we explore the breathtaking hidden waterfalls of Bali. This was one of the most magical experiences of my life! #travel #bali #waterfall
            </p>
          </div>

          <div className="mt-8">
            <h2 className="text-xl font-bold mb-4">3 Comments</h2>
            <div className="flex items-start space-x-4 mb-6">
              <Avatar>
                <AvatarImage src="https://avatar.vercel.sh/me.png" alt="Your avatar" />
                <AvatarFallback>ME</AvatarFallback>
              </Avatar>
              <Input placeholder="Add a comment..." />
            </div>
            <div className="space-y-6">
              {mockComments.map(comment => (
                <div key={comment.id} className="flex items-start space-x-4">
                  <Avatar>
                    <AvatarImage src={`https://avatar.vercel.sh/${comment.user.name}.png`} alt={comment.user.name} />
                    <AvatarFallback>{comment.user.avatar}</AvatarFallback>
                  </Avatar>
                  <div>
                    <div className="flex items-center space-x-2">
                      <p className="font-semibold text-sm">{comment.user.name}</p>
                      <p className="text-xs text-muted-foreground">{comment.timestamp}</p>
                    </div>
                    <p>{comment.text}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </motion.div>
      </div>

      <aside className="lg:w-1/3 lg:max-w-sm flex-shrink-0">
        <h2 className="text-xl font-bold mb-4">Up next</h2>
        <div className="space-y-4">
          {suggestedVideos.map(sv => (
            <motion.div key={sv.id} initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.5 }}>
              <VideoPost post={sv} />
            </motion.div>
          ))}
        </div>
      </aside>
    </div>
  );
};

export default WatchPage;