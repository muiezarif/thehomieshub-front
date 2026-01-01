import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '@/lib/utils';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from '@/components/ui/dialog';
import { Heart, Gift, Share2, Send, ChevronRight, Play, Volume2, Users, Maximize, CheckCircle, ShieldX } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';
import { useWallet } from '@/contexts/WalletContext';
import { useAuth } from '@/contexts/AuthContext';
import { useContent } from '@/contexts/ContentContext';
import MoreOptionsDropdown from '@/components/MoreOptionsDropdown';
import CommentsSheet from '@/components/CommentsSheet';

const giftTiers = [10, 50, 100, 500, 1000];

const GiftDialog = ({ onLoginRequest, creatorName }) => {
    const { user } = useAuth();
    const { balance, spendPoints } = useWallet();
    const [selectedTier, setSelectedTier] = useState(giftTiers[1]);
    const { toast } = useToast();

    const handleSendGift = () => {
        if (!user) {
            onLoginRequest();
            return;
        }

        if (balance < selectedTier) {
            toast({
                title: 'Insufficient Balance',
                description: 'You do not have enough points to send this gift.',
                variant: 'destructive',
            });
            return;
        }
        spendPoints(selectedTier);
        toast({
            title: '🎁 Gift Sent!',
            description: `You sent ${selectedTier} points to ${creatorName}.`,
        });
    };

    return (
        <Dialog>
            <DialogTrigger asChild>
                <Button variant="outline" className="border-primary text-primary">
                    <Gift className="mr-2 h-4 w-4" /> Gift
                </Button>
            </DialogTrigger>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Send a Gift to {creatorName}</DialogTitle>
                    <DialogDescription>Your current balance: {balance} points</DialogDescription>
                </DialogHeader>
                <div className="py-4">
                    <p className="font-semibold mb-3">Select amount:</p>
                    <div className="grid grid-cols-3 gap-3">
                        {giftTiers.map(tier => (
                            <Button
                                key={tier}
                                variant={selectedTier === tier ? 'default' : 'outline'}
                                onClick={() => setSelectedTier(tier)}
                            >
                                {tier} points
                            </Button>
                        ))}
                         <Input type="number" placeholder="Custom amount" className="col-span-3 mt-2" onChange={(e) => setSelectedTier(Number(e.target.value))}/>
                    </div>
                </div>
                <DialogFooter>
                    <Button variant="secondary">Cancel</Button>
                    <Button onClick={handleSendGift}>Send {selectedTier} Points</Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
};

const SubscribeDialog = ({ onLoginRequest, creatorName }) => {
    const { user } = useAuth();
    const { toast } = useToast();

    const handleSubscribe = () => {
        if (!user) {
            onLoginRequest();
            return;
        }
        toast({
          title: '🚧 Feature Not Implemented',
          description: "This feature isn't implemented yet—but don't worry! You can request it in your next prompt! 🚀",
        });
    };

    return (
        <Dialog>
            <DialogTrigger asChild>
                <Button variant="outline" className="border-primary text-primary">Subscribe</Button>
            </DialogTrigger>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Subscribe to {creatorName}</DialogTitle>
                    <DialogDescription>Unlock exclusive perks by subscribing.</DialogDescription>
                </DialogHeader>
                <div className="py-4">
                    <p className="font-semibold mb-3">Subscription tiers will be shown here.</p>
                </div>
                <DialogFooter>
                    <Button variant="secondary">Cancel</Button>
                    <Button onClick={handleSubscribe}>Confirm Subscription</Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
};


const LiveStreamPage = ({ onLoginRequest }) => {
    const { id } = useParams();
    const navigate = useNavigate();
    const { liveStreams } = useContent();
    const [stream, setStream] = useState(null);

    useEffect(() => {
        const allStreams = [...liveStreams.active, ...liveStreams.scheduled];
        const foundStream = allStreams.find(s => s.id === parseInt(id));
        setStream(foundStream);
    }, [id, liveStreams]);

    const [isChatOpen, setChatOpen] = useState(true);
    const [isFollowing, setIsFollowing] = useState(false);
    const { toast } = useToast();
    const { user } = useAuth();

    const handleFollow = () => {
        if (!user) { onLoginRequest(); return; }
        setIsFollowing(!isFollowing);
        toast({ title: isFollowing ? `Unfollowed ${stream.creator}` : `Followed ${stream.creator}!` });
    };

    const handleFeatureClick = (feature) => {
        toast({
            title: `🚀 ${feature} Clicked`,
            description: "This feature isn't implemented yet, but it's coming soon!",
        });
    };
    
    if (!stream) {
        return <div className="h-screen w-full flex items-center justify-center bg-black text-white">Loading stream...</div>
    }

    return (
        <>
            <Helmet>
                <title>{stream.title} - Live on The Homies Hub</title>
            </Helmet>
            <div className="flex flex-col lg:flex-row h-screen bg-black text-white">
                <main className="flex-1 flex flex-col">
                    <div className="flex-1 relative bg-black flex items-center justify-center">
                        {stream.terminated ? (
                            <div className="flex flex-col items-center justify-center text-center p-8">
                                <ShieldX className="h-24 w-24 text-destructive mb-4" />
                                <h2 className="text-2xl font-bold">This livestream has been terminated</h2>
                                <p className="text-muted-foreground mt-2">This content is no longer available due to a platform policy violation.</p>
                                <Button onClick={() => navigate('/live')} className="mt-6">Back to Livestreams</Button>
                            </div>
                        ) : (
                            <img className="w-full h-full object-contain" alt={stream.title} src="https://images.unsplash.com/photo-1589448369336-7e68b874f245" />
                        )}

                        {!stream.terminated && (
                        <>
                            <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black/70 to-transparent">
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-4">
                                        <Button variant="ghost" size="icon" onClick={() => handleFeatureClick('Play/Pause')}><Play className="h-6 w-6"/></Button>
                                        <Button variant="ghost" size="icon" onClick={() => handleFeatureClick('Volume')}><Volume2 className="h-6 w-6"/></Button>
                                        <div className="text-sm">09:13:10</div>
                                        <div className="bg-red-600 text-white px-2 py-1 text-xs font-bold rounded-md flex items-center gap-1">LIVE</div>
                                    </div>
                                    <div className="flex items-center gap-4">
                                        <Button variant="ghost" size="icon" onClick={() => handleFeatureClick('Fullscreen')}><Maximize className="h-6 w-6"/></Button>
                                    </div>
                                </div>
                            </div>
                            <div className="absolute top-4 left-4 flex items-center gap-2 bg-black/50 p-2 rounded-md">
                                <Users className="h-4 w-4 text-primary" />
                                <span className="text-sm font-semibold">{stream.viewers?.toLocaleString() || '12.4K'}</span>
                            </div>
                        </>
                        )}
                    </div>

                    <div className="p-4 border-t border-gray-800">
                        <div className="flex flex-col sm:flex-row justify-between items-start">
                            <Link to={`/profile/${stream.creator}`} className="flex items-center gap-3 hover:opacity-80 transition-opacity">
                                <Avatar className="h-12 w-12 border-2 border-primary">
                                    <AvatarImage src={stream.creatorAvatar} />
                                    <AvatarFallback>{stream.creator.charAt(0)}</AvatarFallback>
                                </Avatar>
                                <div>
                                    <h1 className="text-xl font-bold hover:text-primary transition-colors">{stream.title}</h1>
                                    <p className="text-sm text-gray-400">{stream.creator} &bull; {stream.category}</p>
                                </div>
                            </Link>
                            <div className="flex items-center gap-2 mt-4 sm:mt-0">
                                <Button variant={isFollowing ? 'default' : 'outline'} className={cn(isFollowing ? "bg-primary" : "border-primary text-primary")} onClick={handleFollow}>
                                    {isFollowing ? <CheckCircle className="mr-2 h-4 w-4" /> : <Heart className="mr-2 h-4 w-4" />}
                                    {isFollowing ? 'Following' : 'Follow'}
                                </Button>
                                <GiftDialog onLoginRequest={onLoginRequest} creatorName={stream.creator}/>
                                <SubscribeDialog onLoginRequest={onLoginRequest} creatorName={stream.creator}/>
                                <Button variant="ghost" size="icon" onClick={() => handleFeatureClick('Share')}>
                                    <Share2 className="h-5 w-5" />
                                </Button>
                                {user?.isAdmin && <MoreOptionsDropdown stream={stream} />}
                            </div>
                        </div>
                    </div>
                </main>

                 <aside className={cn(
                    "lg:w-80 bg-[#121212] flex flex-col transition-all duration-300",
                    isChatOpen ? 'w-full lg:w-80' : 'w-full lg:w-16',
                    "h-[50vh] lg:h-screen"
                )}>
                    <div className="flex items-center justify-between p-3 border-b border-gray-800">
                        <AnimatePresence>
                         {isChatOpen && <motion.h2 initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="font-semibold">Chat</motion.h2>}
                        </AnimatePresence>
                        <Button variant="ghost" size="icon" onClick={() => setChatOpen(!isChatOpen)}>
                            <ChevronRight className={cn('h-5 w-5 transition-transform', isChatOpen && 'rotate-180')} />
                        </Button>
                    </div>

                    <CommentsSheet post={stream} onLoginRequest={onLoginRequest} isLiveChat={true} isOpen={isChatOpen} onOpenChange={setChatOpen} />

                    <div className={cn("p-4 border-t border-gray-800", !isChatOpen && "hidden")}>
                        <div className="relative">
                            <Input placeholder="Send a message..." className="bg-gray-800 border-gray-700 rounded-full pr-12" />
                            <Button size="icon" className="absolute right-1 top-1/2 -translate-y-1/2 h-8 w-8 rounded-full">
                                <Send className="h-4 w-4" />
                            </Button>
                        </div>
                    </div>
                </aside>
            </div>
        </>
    );
};

export default LiveStreamPage;