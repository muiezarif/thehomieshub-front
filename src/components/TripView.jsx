import React, { useState } from 'react';
import { Dialog, DialogContent } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { MapPin, Calendar, Users, X, PlusCircle, Check, Share2, Maximize2, Minimize2 } from 'lucide-react';
import FeedItem from '@/components/FeedItem';
import { useContent } from '@/contexts/ContentContext';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/components/ui/use-toast';
import { cn } from '@/lib/utils';
import { motion } from 'framer-motion';

const TripView = ({ isOpen, onClose, post }) => {
  const { user } = useAuth();
  const { getTripPosts, toggleFollowTrip } = useContent();
  const { toast } = useToast();
  const [isFullScreen, setIsFullScreen] = useState(false);
  
  if (!post || post.type !== 'trip') return null;
  const trip = post.content.trip;
  const tripPosts = getTripPosts(post.id);
  const isOwner = user && user.username === post.user.username;
  const isFollowing = trip.isFollowing;

  const handleFollow = (e) => {
      e.stopPropagation();
      if(!user) {
          toast({ title: "Login required", description: "Please login to follow trips." });
          return;
      }
      toggleFollowTrip(post.id);
      toast({
          title: !isFollowing ? "Trip Followed! 🎒" : "Unfollowed Trip",
          description: !isFollowing ? "You'll see updates from this adventure in your feed." : "You've stopped following this trip."
      });
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className={cn("p-0 overflow-hidden bg-background border-none flex flex-col gap-0 transition-all duration-300", 
        isFullScreen ? "max-w-[100vw] h-[100vh] rounded-none" : "max-w-5xl h-[90vh] md:flex-row"
      )}>
         
         {/* Left Side: Cover / Details (Sidebar in fullscreen) */}
         <div className={cn("bg-zinc-900 relative flex flex-col text-white transition-all",
             isFullScreen ? "w-full md:w-80 h-auto md:h-full border-r border-white/10" : "w-full md:w-[350px]"
         )}>
             {/* Cover Image */}
             <div className="h-48 md:h-64 w-full relative shrink-0">
                 <img 
                    src={trip.coverImage || "https://images.unsplash.com/photo-1469854523086-cc02fe5d8800"} 
                    alt={trip.title} 
                    className="w-full h-full object-cover"
                 />
                 <div className="absolute inset-0 bg-gradient-to-b from-transparent to-zinc-900/90" />
                 
                 <Button variant="ghost" size="icon" className="absolute top-4 left-4 text-white hover:bg-black/20 rounded-full md:hidden" onClick={onClose}>
                     <X className="h-6 w-6" />
                 </Button>
             </div>

             {/* Trip Info */}
             <div className="flex-1 p-6 -mt-12 relative z-10 flex flex-col overflow-y-auto">
                 <h2 className="text-2xl md:text-3xl font-bold mb-2 leading-tight">{trip.title}</h2>
                 
                 <div className="flex items-center gap-3 mb-6">
                    <Avatar className="h-8 w-8 border border-white/20">
                        <AvatarImage src={post.user.avatar} />
                        <AvatarFallback>{post.user.name[0]}</AvatarFallback>
                    </Avatar>
                    <div className="flex flex-col">
                        <span className="text-sm font-medium">Hosted by</span>
                        <span className="text-xs text-white/70">@{post.user.username}</span>
                    </div>
                 </div>

                 <div className="grid grid-cols-2 gap-4 mb-6 text-sm">
                    <div className="flex items-center gap-2 text-white/80">
                        <Calendar className="h-4 w-4 text-primary" />
                        <span>{trip.duration}</span>
                    </div>
                     <div className="flex items-center gap-2 text-white/80">
                        <Users className="h-4 w-4 text-primary" />
                        <span>{tripPosts.length + 1} Stops</span>
                    </div>
                     <div className="flex items-center gap-2 text-white/80 col-span-2">
                        <MapPin className="h-4 w-4 text-primary" />
                        <span className="truncate">
  {(Array.isArray(trip.destinations) ? trip.destinations : []).join(" → ")}
</span>
                    </div>
                 </div>

                 <p className="text-white/70 text-sm mb-6 leading-relaxed">
                    {post.content.text || "Join me on this adventure! We're exploring hidden gems and local favorites."}
                 </p>

                 <div className="flex gap-3 mt-auto pt-4 border-t border-white/10">
                     <Button 
                        className={cn("flex-1 font-bold", isFollowing ? "bg-white/10 hover:bg-white/20 text-white" : "bg-primary text-black hover:bg-primary/90")}
                        onClick={handleFollow}
                     >
                         {isFollowing ? <><Check className="mr-2 h-4 w-4" /> Following</> : "Follow Trip"}
                     </Button>
                     <Button variant="outline" size="icon" className="bg-transparent border-white/20 text-white hover:bg-white/10">
                         <Share2 className="h-5 w-5" />
                     </Button>
                 </div>
             </div>
         </div>

         {/* Right Side: Adventure Feed */}
         <div className="flex-1 bg-background flex flex-col h-full relative min-w-0">
            <div className="flex items-center justify-between p-4 border-b sticky top-0 bg-background/95 backdrop-blur z-20">
                <h3 className="font-bold text-lg flex items-center gap-2">
                    Adventure Timeline 
                    <span className="text-xs font-normal text-muted-foreground bg-muted px-2 py-0.5 rounded-full">
                        {tripPosts.length} updates
                    </span>
                </h3>
                <div className="flex gap-2">
                     <Button 
                        variant="ghost" 
                        size="icon" 
                        onClick={() => setIsFullScreen(!isFullScreen)}
                        className="hidden md:flex"
                     >
                         {isFullScreen ? <Minimize2 className="h-5 w-5" /> : <Maximize2 className="h-5 w-5" />}
                     </Button>
                     {isOwner && (
                        <Button size="sm" variant="ghost" className="text-primary hover:text-primary hover:bg-primary/10">
                            <PlusCircle className="mr-2 h-4 w-4" /> Add Update
                        </Button>
                     )}
                     <Button variant="ghost" size="icon" className="hidden md:flex" onClick={onClose}>
                        <X className="h-5 w-5" />
                    </Button>
                </div>
            </div>

            <ScrollArea className="flex-1 p-4 md:p-8 bg-muted/10">
                <div className="max-w-2xl mx-auto space-y-8 relative pb-20 pl-6 md:pl-0">
                     {/* Timeline Line */}
                    <div className="absolute left-3 top-4 bottom-0 w-0.5 bg-border md:left-8" />
                    
                    {/* Start Node */}
                    <div className="relative flex items-center mb-8 pl-8 md:pl-16">
                        <div className="absolute left-0 md:left-5 w-6 h-6 rounded-full bg-primary border-4 border-background shadow-sm z-10" />
                         <div className="bg-primary text-primary-foreground text-xs font-bold px-3 py-1 rounded-full shadow-lg">
                             Trip Started
                         </div>
                    </div>

                    {tripPosts.map((p, i) => (
                        <div key={p.id} className="relative z-10 pl-8 md:pl-16">
                             {/* Timeline Dot */}
                             <div className="absolute left-[5px] md:left-[29px] top-6 w-4 h-4 rounded-full bg-background border-2 border-primary" />
                             
                             <motion.div 
                                initial={{ opacity: 0, x: 20 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: i * 0.1 }}
                             >  
                                 <div className="text-xs text-muted-foreground mb-2 flex items-center gap-2">
                                     <span className="font-bold text-primary">Day {i + 1}</span>
                                     <span>•</span>
                                     <span>{p.location || "On the road"}</span>
                                 </div>
                                 <FeedItem post={p} compact={true} />
                             </motion.div>
                        </div>
                    ))}

                    {/* End Node */}
                    <div className="relative flex items-center mt-8 pl-8 md:pl-16">
                        <div className="absolute left-1 md:left-6 w-4 h-4 rounded-full bg-muted-foreground border-2 border-background z-10" />
                         <div className="bg-muted text-muted-foreground text-xs font-bold px-3 py-1 rounded-full border border-border">
                             End of Updates
                         </div>
                    </div>
                </div>
            </ScrollArea>
         </div>

      </DialogContent>
    </Dialog>
  );
};

export default TripView;