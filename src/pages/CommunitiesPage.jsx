
import React, { useEffect } from 'react';
import CommunityPostCreator from '@/components/CommunityPostCreator';
import FeedItem from '@/components/FeedItem';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import { Users, TrendingUp, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useContent } from '@/contexts/ContentContext';
import { useAuth } from '@/contexts/AuthContext';
import { AnimatePresence, motion } from 'framer-motion';

const CommunitiesPage = () => {
  const { communityPosts, loadCommunityPosts } = useContent();

  const { user } = useAuth();

  // Simple login handler for FeedItems if user isn't logged in
  const handleLoginRequest = () => {
    // In a real scenario, this might trigger the auth modal from context
    // For now, we rely on App.jsx passing this down, but since we are deep in component tree,
    // we can assume auth might be needed. 
    // Ideally this page receives handleLoginRequest prop or uses context to trigger modal.
    console.log("Login requested from Communities Page");
  };

  useEffect(() => {
  loadCommunityPosts?.();
}, [loadCommunityPosts]);

  return (
    <div className="flex h-full bg-background w-full">
      {/* Main Content */}
      <div className="flex-1 flex flex-col min-w-0">
          <header className="flex items-center justify-between px-6 py-4 border-b border-border bg-background/95 backdrop-blur z-10 sticky top-0">
              <div>
                  <h1 className="text-2xl font-bold tracking-tight">Communities</h1>
                  <p className="text-sm text-muted-foreground">Connect with travelers worldwide</p>
              </div>
          </header>

          <ScrollArea className="flex-1 w-full">
              <div className="max-w-2xl mx-auto p-4 md:p-6 pb-20">
                  <CommunityPostCreator />
                  
                  <div className="mb-6 flex items-center justify-between">
                      <h2 className="text-lg font-semibold flex items-center gap-2">
                          <TrendingUp className="h-4 w-4 text-primary" /> Trending Posts
                      </h2>
                      <div className="flex gap-2">
                          <Button variant="ghost" size="sm" className="text-xs">Latest</Button>
                          <Button variant="ghost" size="sm" className="text-xs text-muted-foreground">Top</Button>
                      </div>
                  </div>

                  <div className="space-y-4">
                      <AnimatePresence mode="popLayout">
                          {communityPosts.map((post) => (
                              <motion.div
                                  key={post.id}
                                  initial={{ opacity: 0, y: 20 }}
                                  animate={{ opacity: 1, y: 0 }}
                                  exit={{ opacity: 0, scale: 0.95 }}
                                  layout
                              >
                                  <FeedItem 
                                      post={post} 
                                      onLoginRequest={handleLoginRequest} 
                                  />
                              </motion.div>
                          ))}
                      </AnimatePresence>
                  </div>
              </div>
          </ScrollArea>
      </div>

      {/* Right Sidebar (Desktop only) */}
      <div className="hidden lg:block w-80 border-l border-border bg-card/30 p-6 space-y-6">
          <div>
              <h3 className="font-semibold mb-4 flex items-center gap-2">
                  <Sparkles className="h-4 w-4 text-yellow-500" /> Suggested Communities
              </h3>
              <div className="space-y-4">
                  {[
                      { name: "Solo Travelers", members: "125k" },
                      { name: "Foodie Adventures", members: "84k" },
                      { name: "Digital Nomads", members: "210k" },
                      { name: "Photography", members: "302k" }
                  ].map((comm, i) => (
                      <div key={i} className="flex items-center justify-between group cursor-pointer">
                          <div className="flex items-center gap-3">
                              <div className="h-8 w-8 rounded-md bg-accent flex items-center justify-center">
                                  <Users className="h-4 w-4 text-muted-foreground" />
                              </div>
                              <div>
                                  <p className="text-sm font-medium group-hover:text-primary transition-colors">{comm.name}</p>
                                  <p className="text-xs text-muted-foreground">{comm.members} members</p>
                              </div>
                          </div>
                          <Button variant="outline" size="sm" className="h-7 text-xs">Join</Button>
                      </div>
                  ))}
              </div>
          </div>
          
          <Separator />
          
          <div className="rounded-xl bg-primary/5 p-4 border border-primary/10">
              <h4 className="font-bold text-primary mb-2">Premium Communities</h4>
              <p className="text-xs text-muted-foreground mb-3">Unlock exclusive groups and content with a premium subscription.</p>
              <Button className="w-full text-xs h-8">Upgrade Now</Button>
          </div>
      </div>
    </div>
  );
};

export default CommunitiesPage;
