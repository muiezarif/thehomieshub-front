import React, { useState, useMemo } from 'react';
import { Plus } from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { useAuth } from '@/contexts/AuthContext';
import { useContent } from '@/contexts/ContentContext';
import { cn } from '@/lib/utils';
import StoryViewer from '@/components/StoryViewer';
import UploadStoryModal from '@/components/UploadStoryModal';

const StoryFeed = () => {
  const { user } = useAuth();
  const { stories } = useContent();
  const [viewingStoryIndex, setViewingStoryIndex] = useState(null);
  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);

  // Memoize the ordered stories list to ensure consistent navigation
  // Order: Current User (if exists) -> All Other Users
  const orderedStories = useMemo(() => {
    if (!user) return stories;
    
    const myStory = stories.find(s => s.username === user.username);
    const otherStories = stories.filter(s => s.username !== user.username);
    
    return myStory ? [myStory, ...otherStories] : otherStories;
  }, [stories, user]);

  const handleStoryClick = (story) => {
    const index = orderedStories.findIndex(s => s.username === story.username);
    if (index !== -1) {
        setViewingStoryIndex(index);
    }
  };

  const handleMyStoryClick = () => {
      const myStory = stories.find(s => s.username === user?.username);
      if (myStory && myStory.items.length > 0) {
          handleStoryClick(myStory);
      } else {
          setIsUploadModalOpen(true);
      }
  };

  const myStory = user ? stories.find(s => s.username === user.username) : null;
  const otherStories = user ? stories.filter(s => s.username !== user.username) : stories;

  return (
    <>
      <div className="w-full flex gap-4 overflow-x-auto px-4 py-3 no-scrollbar border-b border-white/10 bg-black/40 backdrop-blur-md z-40 relative select-none">
        {/* Your Story */}
        <div className="flex flex-col items-center gap-1 min-w-[72px] cursor-pointer" onClick={handleMyStoryClick}>
            <div className="relative">
                <div className={cn(
                    "p-[3px] rounded-full",
                    myStory ? "bg-gradient-to-tr from-yellow-400 via-orange-500 to-red-500" : "bg-transparent border border-white/20"
                )}>
                    <Avatar className="h-16 w-16 border-2 border-black">
                        <AvatarImage src={user?.avatar} alt="Your Story" />
                        <AvatarFallback>Me</AvatarFallback>
                    </Avatar>
                </div>
                {!myStory && (
                    <div className="absolute bottom-0 right-0 bg-blue-500 rounded-full p-1 border-2 border-black">
                        <Plus className="h-3 w-3 text-white" strokeWidth={4} />
                    </div>
                )}
            </div>
            <span className="text-xs text-white/90 truncate max-w-[72px]">Your Story</span>
        </div>

        {/* Other Stories */}
        {otherStories.map((story) => {
            // Check if all items are viewed
            const allViewed = story.items.every(i => i.viewed);
            
            return (
                <div 
                    key={story.username} 
                    className="flex flex-col items-center gap-1 min-w-[72px] cursor-pointer group"
                    onClick={() => handleStoryClick(story)}
                >
                    <div className={cn(
                        "p-[3px] rounded-full transition-transform duration-200 group-hover:scale-105",
                        allViewed 
                            ? "bg-zinc-600" 
                            : "bg-gradient-to-tr from-yellow-400 via-orange-500 to-red-500"
                    )}>
                        <Avatar className="h-16 w-16 border-2 border-black">
                            <AvatarImage src={story.avatar} alt={story.username} />
                            <AvatarFallback>{story.username[0]}</AvatarFallback>
                        </Avatar>
                    </div>
                    <span className="text-xs text-white/90 truncate max-w-[72px]">{story.username}</span>
                </div>
            );
        })}
      </div>

      {viewingStoryIndex !== null && (
        <StoryViewer 
            stories={orderedStories} 
            initialStoryIndex={viewingStoryIndex} 
            onClose={() => setViewingStoryIndex(null)} 
        />
      )}
      
      <UploadStoryModal 
        isOpen={isUploadModalOpen} 
        onOpenChange={setIsUploadModalOpen}
      />
    </>
  );
};

export default StoryFeed;