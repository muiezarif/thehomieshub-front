import React from 'react';
import { Helmet } from 'react-helmet';
import { Link } from 'react-router-dom';
import { Card, CardContent } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Calendar, Radio } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { motion, AnimatePresence } from 'framer-motion';
import { useContent } from '@/contexts/ContentContext';


const StreamCard = ({ stream, isLive }) => (
    <motion.div
      layout
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.8 }}
      transition={{ duration: 0.3 }}
      className="flex flex-col"
    >
        <Card className="overflow-hidden flex-grow flex flex-col">
            <div className="relative">
                <img alt={stream.title} className="aspect-video w-full object-cover" src="https://images.unsplash.com/photo-1648554090883-d23dbcf203a1" />
                {isLive && (
                    <div className="absolute top-2 left-2 bg-red-600 text-white px-2 py-1 text-xs font-bold rounded-md flex items-center gap-1">
                        <Radio className="h-3 w-3 animate-pulse" /> LIVE
                    </div>
                )}
            </div>
            <CardContent className="p-4 flex-grow flex flex-col">
                <h3 className="text-lg font-bold text-primary">{stream.title}</h3>
                <Link 
                    to={`/profile/${stream.creator}`} 
                    className="flex items-center gap-2 text-sm text-muted-foreground my-2 hover:text-primary transition-colors w-fit"
                >
                    <Avatar className="h-6 w-6">
                        <AvatarImage src={stream.creatorAvatar} alt={stream.creator} />
                        <AvatarFallback>{stream.creator.charAt(0)}</AvatarFallback>
                    </Avatar>
                    <span>{stream.creator}</span>
                </Link>
                <p className="text-sm text-foreground/80 flex-grow">{stream.description}</p>
                <div className="flex items-center gap-2 text-sm text-muted-foreground mt-4">
                    <Calendar className="h-4 w-4" />
                    <span>{stream.date} at {stream.time}</span>
                </div>
                <Link to={`/live-stream/${stream.id}`} className="mt-4">
                    <Button className="w-full">{isLive ? 'Join Live' : 'View Schedule'}</Button>
                </Link>
            </CardContent>
        </Card>
    </motion.div>
);

const LivePage = () => {
    const { liveStreams } = useContent();
    const activeStreams = liveStreams.active.filter(s => !s.terminated);
    const scheduledStreams = liveStreams.scheduled;

    return (
        <>
            <Helmet>
                <title>Live - The Homies Hub</title>
                <meta name="description" content="Find your next favorite creator, live." />
            </Helmet>
            <div className="max-w-7xl mx-auto p-4 md:p-8 space-y-8">
                <header className="text-center">
                     <h1 className="text-4xl font-bold tracking-tight text-primary flex items-center justify-center gap-2">
                        <span className="relative flex h-4 w-4">
                            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary/75 opacity-75"></span>
                            <span className="relative inline-flex rounded-full h-4 w-4 bg-primary"></span>
                        </span>
                        Browse Livestreams
                    </h1>
                    <p className="text-muted-foreground mt-2">Find your next favorite creator, live.</p>
                </header>

                <Tabs defaultValue="active" className="w-full">
                    <TabsList className="grid w-full grid-cols-2">
                        <TabsTrigger value="active">Active ({activeStreams.length})</TabsTrigger>
                        <TabsTrigger value="scheduled">Scheduled ({scheduledStreams.length})</TabsTrigger>
                    </TabsList>
                    <AnimatePresence mode="wait">
                    <TabsContent value="active">
                         <motion.div 
                            key="active"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mt-6">
                            {activeStreams.length > 0 ? (
                                activeStreams.map(stream => <StreamCard key={stream.id} stream={stream} isLive={true} />)
                            ) : (
                                <p className="col-span-full text-center text-muted-foreground">No active streams right now. Check back later!</p>
                            )}
                         </motion.div>
                    </TabsContent>
                    <TabsContent value="scheduled">
                        <motion.div
                             key="scheduled"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mt-6">
                            {scheduledStreams.map(stream => <StreamCard key={stream.id} stream={stream} isLive={false} />)}
                        </motion.div>
                    </TabsContent>
                    </AnimatePresence>
                </Tabs>
            </div>
        </>
    );
};

export default LivePage;