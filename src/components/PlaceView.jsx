import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { MapPin, X, Grid, List, Calendar, Image as ImageIcon } from 'lucide-react';
import FeedItem from '@/components/FeedItem';
import { useContent } from '@/contexts/ContentContext';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Skeleton } from '@/components/ui/skeleton';

const PlaceView = () => {
  const { placeModalData, closePlaceModal, getPlacePosts } = useContent();
  const { isOpen, placeName } = placeModalData;
  const [activeTab, setActiveTab] = useState('all');
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);

  // Derive a nice cover image (mocked) based on place name length just to vary it
  const getPlaceImage = (name) => {
      const images = [
          "https://images.unsplash.com/photo-1496417263034-38ec4f0d6b21", // City
          "https://images.unsplash.com/photo-1507525428034-b723cf961d3e", // Beach
          "https://images.unsplash.com/photo-1464822759023-fed622ff2c3b", // Mountains
          "https://images.unsplash.com/photo-1513635269975-59663e0ac1ad"  // London/City
      ];
      return images[name?.length % images.length] || images[0];
  };

  useEffect(() => {
      if (isOpen && placeName) {
          setLoading(true);
          // Simulate fetch delay
          setTimeout(() => {
            const relatedPosts = getPlacePosts(placeName);
            setPosts(relatedPosts);
            setLoading(false);
          }, 600);
      }
  }, [isOpen, placeName]);

  if (!isOpen) return null;

  const filteredPosts = posts.filter(p => {
      if (activeTab === 'all') return true;
      if (activeTab === 'media') return p.type === 'clip' || p.type === 'trip';
      if (activeTab === 'events') return p.type === 'event';
      if (activeTab === 'posts') return p.type === 'text' || p.type === 'thread' || p.type === 'poll';
      return true;
  });

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && closePlaceModal()}>
      <DialogContent className="max-w-3xl h-[85vh] p-0 overflow-hidden bg-background border-none flex flex-col gap-0">
          
          {/* Header Cover */}
          <div className="h-40 relative shrink-0 bg-zinc-900">
              <img 
                  src={getPlaceImage(placeName)} 
                  alt={placeName} 
                  className="w-full h-full object-cover opacity-60"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-background to-transparent" />
              
              <div className="absolute bottom-4 left-6 right-6 flex justify-between items-end">
                  <div>
                      <div className="flex items-center gap-1 text-primary mb-1">
                          <MapPin className="h-4 w-4 fill-current" />
                          <span className="text-xs font-bold uppercase tracking-wider">Location</span>
                      </div>
                      <h2 className="text-3xl font-bold text-white shadow-sm">{placeName}</h2>
                      <p className="text-white/70 text-sm mt-1">{posts.length} posts about this place</p>
                  </div>
              </div>

              <Button 
                variant="ghost" 
                size="icon" 
                className="absolute top-2 right-2 text-white hover:bg-white/10 rounded-full" 
                onClick={closePlaceModal}
              >
                 <X className="h-6 w-6" />
              </Button>
          </div>

          {/* Content Area */}
          <div className="flex-1 bg-background flex flex-col overflow-hidden">
             <Tabs defaultValue="all" value={activeTab} onValueChange={setActiveTab} className="h-full flex flex-col">
                 <div className="px-6 pt-4 pb-2 border-b sticky top-0 bg-background z-10">
                     <TabsList className="w-full justify-start h-auto p-0 bg-transparent gap-6">
                         <TabsTrigger value="all" className="data-[state=active]:bg-transparent data-[state=active]:shadow-none data-[state=active]:border-b-2 data-[state=active]:border-primary rounded-none px-0 py-2">
                             Overview
                         </TabsTrigger>
                         <TabsTrigger value="posts" className="data-[state=active]:bg-transparent data-[state=active]:shadow-none data-[state=active]:border-b-2 data-[state=active]:border-primary rounded-none px-0 py-2">
                             <List className="h-4 w-4 mr-2" /> Posts
                         </TabsTrigger>
                         <TabsTrigger value="media" className="data-[state=active]:bg-transparent data-[state=active]:shadow-none data-[state=active]:border-b-2 data-[state=active]:border-primary rounded-none px-0 py-2">
                             <ImageIcon className="h-4 w-4 mr-2" /> Media
                         </TabsTrigger>
                         <TabsTrigger value="events" className="data-[state=active]:bg-transparent data-[state=active]:shadow-none data-[state=active]:border-b-2 data-[state=active]:border-primary rounded-none px-0 py-2">
                             <Calendar className="h-4 w-4 mr-2" /> Events
                         </TabsTrigger>
                     </TabsList>
                 </div>

                 <ScrollArea className="flex-1 bg-muted/10">
                    <div className="p-4 max-w-xl mx-auto pb-10">
                        {loading ? (
                            <div className="space-y-4">
                                <Skeleton className="h-32 w-full rounded-xl" />
                                <Skeleton className="h-48 w-full rounded-xl" />
                                <Skeleton className="h-24 w-full rounded-xl" />
                            </div>
                        ) : filteredPosts.length > 0 ? (
                            <div className="space-y-6">
                                {filteredPosts.map(post => (
                                    <FeedItem key={post.id} post={post} compact={true} />
                                ))}
                            </div>
                        ) : (
                            <div className="text-center py-20">
                                <MapPin className="h-12 w-12 text-muted-foreground mx-auto mb-3 opacity-20" />
                                <h3 className="text-lg font-semibold text-muted-foreground">No posts yet</h3>
                                <p className="text-sm text-muted-foreground/60">Be the first to post about {placeName}!</p>
                            </div>
                        )}
                    </div>
                 </ScrollArea>
             </Tabs>
          </div>
      </DialogContent>
    </Dialog>
  );
};

export default PlaceView;