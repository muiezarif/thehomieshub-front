import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { mockCommunityPosts } from '@/data/mockCommunityPosts';
import FeedItem from '@/components/FeedItem';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Image, Video, BarChart2, MapPin, Search } from 'lucide-react';
import { useToast } from "@/components/ui/use-toast";


const CommunitiesPage = () => {
    const { toast } = useToast();
    const [searchTerm, setSearchTerm] = useState('');

    const handlePost = () => {
        toast({
            title: "Post Submitted!",
            description: "Your post is now live for the community to see.",
        })
    };

    const filteredPosts = mockCommunityPosts.filter(post => {
        if (searchTerm === '') return true;
        const lowerCaseSearch = searchTerm.toLowerCase();
        const textMatch = post.content.text?.toLowerCase().includes(lowerCaseSearch);
        const userMatch = post.user.name.toLowerCase().includes(lowerCaseSearch) || post.user.username.toLowerCase().includes(lowerCaseSearch);
        return textMatch || userMatch;
    });

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
          placeholder="Search communities by keyword or #hashtag..."
          className="pl-12 h-12 text-base"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      <div className="mb-8 p-4 bg-card border border-border rounded-lg">
        <div className="flex space-x-4">
            <Avatar>
                <AvatarImage src="https://avatar.vercel.sh/current-user.png" />
                <AvatarFallback>ME</AvatarFallback>
            </Avatar>
            <div className="w-full">
                <Textarea 
                    placeholder="What's happening, traveler?"
                    className="bg-background border-input text-base resize-none"
                />
                <div className="flex justify-between items-center mt-3">
                    <div className="flex space-x-3 text-muted-foreground">
                        <Button variant="ghost" size="icon" onClick={() => toast({ description: "🚧 Feature not implemented" })}><Image className="h-5 w-5"/></Button>
                        <Button variant="ghost" size="icon" onClick={() => toast({ description: "🚧 Feature not implemented" })}><Video className="h-5 w-5"/></Button>
                        <Button variant="ghost" size="icon" onClick={() => toast({ description: "🚧 Feature not implemented" })}><BarChart2 className="h-5 w-5"/></Button>
                        <Button variant="ghost" size="icon" onClick={() => toast({ description: "🚧 Feature not implemented" })}><MapPin className="h-5 w-5"/></Button>
                    </div>
                    <Button onClick={handlePost}>Post</Button>
                </div>
            </div>
        </div>
      </div>

      <div className="space-y-6">
        {filteredPosts.map((post, index) => (
          <motion.div
            key={post.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: index * 0.1 }}
          >
            <FeedItem post={post} />
          </motion.div>
        ))}
      </div>
    </div>
  );
};

export default CommunitiesPage;