import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Users, Video, FileText, Activity, TrendingUp, MessageSquare, Send, ArrowRight, Expand, ChevronDown, ChevronUp, Gift } from 'lucide-react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter, DialogTrigger } from '@/components/ui/dialog';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate, Link } from 'react-router-dom';
import { useToast } from '@/components/ui/use-toast';

const recentActivity = [
  { id: 1, user: 'marcopolo', action: 'posted a new thread', time: '2m ago', type: 'post' },
  { id: 2, user: 'bennyboy', action: 'commented on a video', time: '15m ago', type: 'comment' },
  { id: 3, user: 'dronedave', action: 'uploaded a new video', time: '1h ago', type: 'video' },
  { id: 4, user: 'samtravels', action: 'joined the platform', time: '3h ago', type: 'signup' },
  { id: 5, user: 'alexnomad', action: 'went live', time: '4h ago', type: 'live' },
  { id: 6, user: 'traveler', action: 'requested payout', time: '5h ago', type: 'finance' },
];

const trendingContent = [
    { id: 1, title: 'Street Food in Bangkok', type: 'Video', views: '2.5M', author: 'bennyboy' },
    { id: 2, title: 'Exploring the Swiss Alps', type: 'Video', views: '1.2M', author: 'dronedave' },
    { id: 3, title: 'Kyoto Hidden Gems', type: 'Thread', views: '870K', author: 'marcopolo' },
    { id: 4, title: 'Van Life Realities', type: 'Post', views: '500K', author: 'frankwanderer' },
];

const StatCard = ({ title, value, icon, description, onClick, className }) => {
    return (
        <Card onClick={onClick} className={`cursor-pointer transition-all hover:scale-[1.02] hover:shadow-lg ${className}`}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">{title}</CardTitle>
                {icon}
            </CardHeader>
            <CardContent>
                <div className="text-2xl font-bold">{value}</div>
                <p className="text-xs text-muted-foreground">{description}</p>
            </CardContent>
        </Card>
    );
};

const AdminGiftDialog = () => {
    const { toast } = useToast();
    const [username, setUsername] = useState('');
    const [amount, setAmount] = useState('');

    const handleGift = () => {
        if (!username || !amount) return;
        
        toast({
            title: "Points Gifted!",
            description: `Successfully gifted ${amount} points to @${username.replace('@', '')}.`,
        });
        setUsername('');
        setAmount('');
    };

    return (
        <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
                <DialogTitle>Gift Points</DialogTitle>
                <DialogDescription>Manually add points to a user's wallet.</DialogDescription>
            </DialogHeader>
            <div className="space-y-4 py-4">
                <div className="space-y-2">
                    <Label htmlFor="gift-username">Username</Label>
                    <Input 
                        id="gift-username"
                        placeholder="@username" 
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                    />
                </div>
                <div className="space-y-2">
                    <Label htmlFor="gift-amount">Amount</Label>
                    <Input 
                        id="gift-amount"
                        type="number"
                        placeholder="100" 
                        value={amount}
                        onChange={(e) => setAmount(e.target.value)}
                    />
                </div>
            </div>
            <DialogFooter>
                <Button onClick={handleGift} disabled={!username || !amount} className="bg-gradient-to-r from-yellow-500 to-amber-600 text-white">
                    <Gift className="w-4 h-4 mr-2" />
                    Send Points
                </Button>
            </DialogFooter>
        </DialogContent>
    );
}

const AdminMessageDialog = () => {
    const { toast } = useToast();
    const [recipientType, setRecipientType] = useState('all');
    const [specificUser, setSpecificUser] = useState('');
    const [message, setMessage] = useState('');

    const handleSend = () => {
        if (!message) return;
        
        toast({
            title: "Message Sent",
            description: recipientType === 'all' 
                ? "Broadcast message sent to all users." 
                : `Message sent to @${specificUser}.`,
        });
        setMessage('');
        setSpecificUser('');
    };

    return (
        <DialogContent className="sm:max-w-[500px]">
            <DialogHeader>
                <DialogTitle>Send Admin Message</DialogTitle>
                <DialogDescription>Send a system notification or direct message to users.</DialogDescription>
            </DialogHeader>
            <div className="space-y-4 py-4">
                <div className="space-y-2">
                    <Label>Recipient</Label>
                    <Select value={recipientType} onValueChange={setRecipientType}>
                        <SelectTrigger>
                            <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="all">All Users (Broadcast)</SelectItem>
                            <SelectItem value="specific">Specific User</SelectItem>
                        </SelectContent>
                    </Select>
                </div>
                
                {recipientType === 'specific' && (
                    <div className="space-y-2">
                         <Label>Username</Label>
                         <Input 
                            placeholder="@username" 
                            value={specificUser}
                            onChange={(e) => setSpecificUser(e.target.value)}
                         />
                    </div>
                )}

                <div className="space-y-2">
                    <Label>Message Content</Label>
                    <Textarea 
                        placeholder="Type your message here..." 
                        className="min-h-[100px]"
                        value={message}
                        onChange={(e) => setMessage(e.target.value)}
                    />
                </div>
            </div>
            <DialogFooter>
                <Button onClick={handleSend} disabled={!message || (recipientType === 'specific' && !specificUser)}>
                    <Send className="w-4 h-4 mr-2" />
                    Send Message
                </Button>
            </DialogFooter>
        </DialogContent>
    );
};

const AdminDashboard = () => {
    const navigate = useNavigate();
    const [expandedSection, setExpandedSection] = useState(null);
    
    const cardVariants = {
        hidden: { opacity: 0, y: 20 },
        visible: i => ({
            opacity: 1,
            y: 0,
            transition: { delay: i * 0.1, duration: 0.5, ease: "easeOut" }
        })
    };

    const toggleExpand = (section) => {
        if (expandedSection === section) {
            setExpandedSection(null);
        } else {
            setExpandedSection(section);
        }
    };

    return (
        <div className="space-y-6 p-4 md:p-8">
            <header className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight text-foreground">Admin Dashboard</h1>
                    <p className="text-muted-foreground mt-1">Overview of community performance and moderation.</p>
                </div>
                <div className="flex gap-2">
                    <Dialog>
                        <DialogTrigger asChild>
                            <Button variant="outline" className="border-yellow-500/50 text-yellow-500 hover:bg-yellow-500/10">
                                <Gift className="mr-2 h-4 w-4" />
                                Gift Points
                            </Button>
                        </DialogTrigger>
                        <AdminGiftDialog />
                    </Dialog>
                    <Dialog>
                        <DialogTrigger asChild>
                            <Button className="bg-primary text-primary-foreground hover:bg-primary/90">
                                <MessageSquare className="mr-2 h-4 w-4" />
                                Send Message
                            </Button>
                        </DialogTrigger>
                        <AdminMessageDialog />
                    </Dialog>
                </div>
            </header>

            <motion.div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                <motion.div custom={0} variants={cardVariants} initial="hidden" animate="visible">
                    <StatCard 
                        title="Total Users" 
                        value="1,245" 
                        icon={<Users className="h-4 w-4 text-muted-foreground" />} 
                        description="+20.1% from last month" 
                        onClick={() => navigate('/admin/users')}
                    />
                </motion.div>
                <motion.div custom={1} variants={cardVariants} initial="hidden" animate="visible">
                    <StatCard 
                        title="Total Videos" 
                        value="3,402" 
                        icon={<Video className="h-4 w-4 text-muted-foreground" />} 
                        description="+125 this week"
                        onClick={() => navigate('/admin/content?type=video')}
                    />
                </motion.div>
                <motion.div custom={2} variants={cardVariants} initial="hidden" animate="visible">
                    <StatCard 
                        title="Total Posts" 
                        value="10,899" 
                        icon={<FileText className="h-4 w-4 text-muted-foreground" />} 
                        description="+5.2% from last week"
                        onClick={() => navigate('/admin/content')}
                    />
                </motion.div>
                <motion.div custom={3} variants={cardVariants} initial="hidden" animate="visible">
                    <StatCard 
                        title="Active Now" 
                        value="73" 
                        icon={<Activity className="h-4 w-4 text-muted-foreground" />} 
                        description="Users currently online"
                        onClick={() => navigate('/admin/users?filter=active')}
                    />
                </motion.div>
            </motion.div>

            <div className="grid gap-6 lg:grid-cols-2">
                {/* Recent Activity Section */}
                <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.5, delay: 0.4 }}>
                    <Card className={`transition-all duration-300 ${expandedSection === 'activity' ? 'fixed inset-4 z-50 overflow-auto' : ''}`}>
                        <CardHeader className="flex flex-row items-center justify-between">
                            <CardTitle className="flex items-center gap-2"><Activity className="h-5 w-5" /> Recent Activity</CardTitle>
                            <Button variant="ghost" size="icon" onClick={() => toggleExpand('activity')}>
                                {expandedSection === 'activity' ? <Expand className="h-4 w-4 text-primary" /> : <ArrowRight className="h-4 w-4" />}
                            </Button>
                        </CardHeader>
                        <CardContent>
                             <Table>
                                <TableBody>
                                    {(expandedSection === 'activity' ? [...recentActivity, ...recentActivity, ...recentActivity] : recentActivity.slice(0, 5)).map((activity, idx) => (
                                        <TableRow key={`${activity.id}-${idx}`} className="cursor-pointer hover:bg-muted/50" onClick={() => navigate(`/profile/${activity.user}`)}>
                                            <TableCell>
                                                <div className="flex items-center gap-3">
                                                    <Avatar className="h-9 w-9">
                                                        <AvatarImage src={`https://avatar.vercel.sh/${activity.user}.png`} />
                                                        <AvatarFallback>{activity.user.charAt(0).toUpperCase()}</AvatarFallback>
                                                    </Avatar>
                                                    <div>
                                                        <span className="font-medium hover:text-primary transition-colors">@{activity.user}</span> {activity.action}
                                                    </div>
                                                </div>
                                            </TableCell>
                                            <TableCell className="text-right text-muted-foreground whitespace-nowrap">{activity.time}</TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                            {expandedSection === 'activity' && (
                                <div className="mt-4 flex justify-end">
                                    <Button variant="outline" onClick={() => toggleExpand('activity')}>Close Full View</Button>
                                </div>
                            )}
                        </CardContent>
                    </Card>
                    {expandedSection === 'activity' && <div className="fixed inset-0 bg-black/80 z-40" onClick={() => toggleExpand('activity')} />}
                </motion.div>

                {/* Trending Content Section */}
                <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.5, delay: 0.5 }}>
                    <Card className={`transition-all duration-300 ${expandedSection === 'trending' ? 'fixed inset-4 z-50 overflow-auto' : ''}`}>
                         <CardHeader className="flex flex-row items-center justify-between">
                            <CardTitle className="flex items-center gap-2"><TrendingUp className="h-5 w-5" /> Trending Content</CardTitle>
                            <Button variant="ghost" size="icon" onClick={() => toggleExpand('trending')}>
                                {expandedSection === 'trending' ? <Expand className="h-4 w-4 text-primary" /> : <ArrowRight className="h-4 w-4" />}
                            </Button>
                        </CardHeader>
                        <CardContent>
                            <Table>
                                <TableHeader>
                                    <TableRow>
                                        <TableHead>Title</TableHead>
                                        <TableHead>Type</TableHead>
                                        <TableHead className="text-right">Views</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                     {(expandedSection === 'trending' ? [...trendingContent, ...trendingContent] : trendingContent).map((item, idx) => (
                                        <TableRow key={`${item.id}-${idx}`} className="cursor-pointer hover:bg-muted/50" onClick={() => navigate('/admin/content')}>
                                            <TableCell className="font-medium">
                                                <div className="flex flex-col">
                                                    <span className="text-sm font-semibold">{item.title}</span>
                                                    <span className="text-xs text-muted-foreground">
                                                        by <Link to={`/profile/${item.author}`} onClick={(e) => e.stopPropagation()} className="hover:text-primary hover:underline">@{item.author}</Link>
                                                    </span>
                                                </div>
                                            </TableCell>
                                            <TableCell><Badge variant="secondary">{item.type}</Badge></TableCell>
                                            <TableCell className="text-right font-mono">{item.views}</TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                             {expandedSection === 'trending' && (
                                <div className="mt-4 flex justify-end">
                                    <Button variant="outline" onClick={() => toggleExpand('trending')}>Close Full View</Button>
                                </div>
                            )}
                        </CardContent>
                    </Card>
                    {expandedSection === 'trending' && <div className="fixed inset-0 bg-black/80 z-40" onClick={() => toggleExpand('trending')} />}
                </motion.div>
            </div>
        </div>
    );
};

export default AdminDashboard;