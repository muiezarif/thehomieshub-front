import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { MoreHorizontal, Search, UserPlus, CreditCard, Eye, KeyRound, ShieldBan, UserCheck, MessageSquare, Heart, Trash2, Pin, Edit, MicOff, Mic, ExternalLink, Send } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/components/ui/use-toast';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter, DialogTrigger } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useContent } from '@/contexts/ContentContext';
import { useAuth } from '@/contexts/AuthContext';
import { useNavigate } from 'react-router-dom';

const mockUserPosts = [
    { id: 'p1', content: 'Just landed in Kyoto!', type: 'Thread', likes: 12, comments: 3 },
    { id: 'p2', content: 'Tokyo Nightlife Guide', type: 'Video', likes: 45, comments: 10 },
    { id: 'p3', content: 'Onsen etiquette for beginners?', type: 'Thread', likes: 5, comments: 8 },
];
const mockUserComments = [
    { id: 'c1', content: 'Absolutely, Fushimi Inari is a must-see!', onPost: 'p0' },
    { id: 'c2', content: 'Great footage!', onPost: 'p2' },
];
const mockUserLikes = [
    { id: 'l1', postContent: 'Morning flight over Interlaken...', postAuthor: 'dronedave' },
    { id: 'l2', postContent: 'PCH Road Trip Plan!', postAuthor: 'ryan_roams' },
];

const DirectMessageDialog = ({ recipient, isOpen, onOpenChange }) => {
    const { toast } = useToast();
    const [message, setMessage] = useState('');

    const handleSend = () => {
        if (!message.trim()) return;
        toast({
            title: "Message Sent",
            description: `Direct message sent to @${recipient.username}.`,
        });
        setMessage('');
        onOpenChange(false);
    };

    if (!recipient) return null;

    return (
        <Dialog open={isOpen} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                    <DialogTitle>Message @{recipient.username}</DialogTitle>
                    <DialogDescription>
                        Send a private message to this user.
                    </DialogDescription>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                    <div className="space-y-2">
                        <Label htmlFor="message">Message</Label>
                        <Textarea
                            id="message"
                            placeholder="Type your message here..."
                            className="min-h-[120px]"
                            value={message}
                            onChange={(e) => setMessage(e.target.value)}
                        />
                    </div>
                </div>
                <DialogFooter>
                    <Button variant="outline" onClick={() => onOpenChange(false)}>Cancel</Button>
                    <Button onClick={handleSend} disabled={!message.trim()}>
                        <Send className="mr-2 h-4 w-4" />
                        Send
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
};

const UserDetailModal = ({ user, isOpen, onOpenChange, onAction }) => {
    const { toast } = useToast();
    const navigate = useNavigate();
    const { user: currentUser } = useAuth();
    const [activitySearch, setActivitySearch] = useState("");
    const { banUser, unbanUser, muteUser, unmuteUser } = useContent();
    const [dmOpen, setDmOpen] = useState(false);

    if (!user) return null;
    
    const activityAction = (action, id) => {
        toast({
            title: `Action: ${action}`,
            description: `Performed "${action}" on item ${id}.`,
        });
    }
    
    const handleBanAction = () => {
        if(user.isBanned) {
            unbanUser(user.username);
            onAction('Unban', user.username);
        } else {
            banUser(user.username);
            onAction('Ban', user.username);
        }
    }

    const handleMuteAction = () => {
        if(user.isMuted) {
            unmuteUser(user.username);
            onAction('Unmute', user.username);
        } else {
            muteUser(user.username);
            onAction('Mute', user.username);
        }
    }

    return (
        <Dialog open={isOpen} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-3xl">
                <DialogHeader>
                    <DialogTitle>User Details</DialogTitle>
                    <DialogDescription>Manage account, posts, and subscriptions for @{user.username}.</DialogDescription>
                </DialogHeader>
                <div className="grid md:grid-cols-3 gap-6 py-4">
                    <div className="md:col-span-1 space-y-4">
                        <div className="flex flex-col items-center text-center">
                            <Avatar className="h-24 w-24 mb-4 cursor-pointer hover:opacity-80 transition-opacity" onClick={() => { onOpenChange(false); navigate(`/profile/${user.username}`); }}>
                                <AvatarImage src={user.avatar} />
                                <AvatarFallback>{user.name.charAt(0)}</AvatarFallback>
                            </Avatar>
                            <h3 className="font-semibold text-lg cursor-pointer hover:underline" onClick={() => { onOpenChange(false); navigate(`/profile/${user.username}`); }}>{user.name}</h3>
                            <p className="text-muted-foreground">@{user.username}</p>
                            <p className="text-sm text-muted-foreground">{user.email}</p>
                            <div className="flex flex-wrap justify-center gap-2 mt-2">
                                <Badge variant={user.isBanned ? 'destructive' : 'outline'}>{user.isBanned ? 'Banned' : 'Active'}</Badge>
                                {user.isMuted && <Badge variant="secondary" className="bg-yellow-500/10 text-yellow-500 border-yellow-500/20">Muted</Badge>}
                                <Badge variant={user.role === 'Creator' ? 'default' : 'secondary'}>{user.role || 'User'}</Badge>
                            </div>
                        </div>
                        <Card>
                            <CardHeader className="p-4"><h4 className="font-semibold">Subscription</h4></CardHeader>
                            <CardContent className="p-4 pt-0">
                                <div className="flex items-center justify-between">
                                    <span className="flex items-center gap-2 text-sm"><CreditCard className="h-4 w-4" /> {user.tier}</span>
                                    {currentUser?.isAdmin && (
                                        <Button size="sm" variant="outline" onClick={() => onAction('Manage Subscription', user.username)}>Manage</Button>
                                    )}
                                </div>
                            </CardContent>
                        </Card>
                         <div className="space-y-2">
                            <h4 className="font-semibold">User Actions</h4>
                            <div className="grid grid-cols-2 gap-2">
                                {currentUser?.isAdmin && (
                                    <Button variant="outline" size="sm" onClick={() => onAction('Reset Password', user.username)}><KeyRound className="mr-2 h-4 w-4" /> Reset</Button>
                                )}
                                
                                <Button 
                                    variant="outline" 
                                    size="sm" 
                                    className={!currentUser?.isAdmin ? "col-span-2" : ""} 
                                    onClick={() => setDmOpen(true)}
                                >
                                    <MessageSquare className="mr-2 h-4 w-4" /> DM
                                </Button>
                                
                                {user.isMuted ? (
                                    <Button className="col-span-2" variant="secondary" size="sm" onClick={handleMuteAction}><Mic className="mr-2 h-4 w-4" /> Unmute User</Button>
                                ) : (
                                    <Button className="col-span-2 bg-yellow-600 hover:bg-yellow-700 text-white" size="sm" onClick={handleMuteAction}><MicOff className="mr-2 h-4 w-4" /> Mute User</Button>
                                )}

                                {currentUser?.isAdmin && (
                                    user.isBanned ? (
                                        <Button className="col-span-2" variant="secondary" size="sm" onClick={handleBanAction}><UserCheck className="mr-2 h-4 w-4" /> Unban User</Button>
                                    ) : (
                                        <Button className="col-span-2" variant="destructive" size="sm" onClick={handleBanAction}><ShieldBan className="mr-2 h-4 w-4" /> Ban User</Button>
                                    )
                                )}
                            </div>
                        </div>
                    </div>
                    <div className="md:col-span-2 space-y-4">
                        <Tabs defaultValue="posts">
                            <div className="flex justify-between items-center mb-2">
                                <TabsList>
                                    <TabsTrigger value="posts"><MessageSquare className="mr-2 h-4 w-4" />Posts</TabsTrigger>
                                    <TabsTrigger value="comments"><MessageSquare className="mr-2 h-4 w-4" />Comments</TabsTrigger>
                                    <TabsTrigger value="likes"><Heart className="mr-2 h-4 w-4" />Likes</TabsTrigger>
                                </TabsList>
                                <div className="relative w-full max-w-xs">
                                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                                    <Input placeholder="Search activity..." className="pl-10 h-9" value={activitySearch} onChange={(e) => setActivitySearch(e.target.value)} />
                                </div>
                            </div>
                            <div className="border rounded-md min-h-[300px] max-h-[300px] overflow-y-auto">
                                <TabsContent value="posts" className="m-0">
                                    <div className="p-2 space-y-2">
                                        {mockUserPosts.filter(p => p.content.toLowerCase().includes(activitySearch.toLowerCase())).map(post => (
                                            <div key={post.id} className="flex justify-between items-center p-2 bg-muted/50 rounded-md">
                                                <div>
                                                    <p className="text-sm truncate font-medium">{post.content}</p>
                                                    <div className="text-xs text-muted-foreground flex items-center gap-4">
                                                        <span>{post.type}</span>
                                                        <span className="flex items-center gap-1"><Heart className="h-3 w-3" /> {post.likes}</span>
                                                        <span className="flex items-center gap-1"><MessageSquare className="h-3 w-3" /> {post.comments}</span>
                                                    </div>
                                                </div>
                                                <DropdownMenu>
                                                    <DropdownMenuTrigger asChild><Button variant="ghost" size="icon" className="h-8 w-8"><MoreHorizontal className="h-4 w-4" /></Button></DropdownMenuTrigger>
                                                    <DropdownMenuContent align="end">
                                                        <DropdownMenuItem onClick={() => activityAction('Delete', post.id)} className="text-destructive"><Trash2 className="mr-2 h-4 w-4" /> Delete Post</DropdownMenuItem>
                                                    </DropdownMenuContent>
                                                </DropdownMenu>
                                            </div>
                                        ))}
                                    </div>
                                </TabsContent>
                                <TabsContent value="comments" className="m-0">
                                     <div className="p-2 space-y-2">
                                        {mockUserComments.filter(c => c.content.toLowerCase().includes(activitySearch.toLowerCase())).map(comment => (
                                            <div key={comment.id} className="flex justify-between items-center p-2 bg-muted/50 rounded-md">
                                                <p className="text-sm truncate italic">"{comment.content}"</p>
                                                <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => activityAction('Delete Comment', comment.id)}><Trash2 className="h-4 w-4 text-destructive" /></Button>
                                            </div>
                                        ))}
                                    </div>
                                </TabsContent>
                                <TabsContent value="likes" className="m-0">
                                     <div className="p-2 space-y-2">
                                        {mockUserLikes.filter(l => l.postContent.toLowerCase().includes(activitySearch.toLowerCase())).map(like => (
                                            <div key={like.id} className="p-2 bg-muted/50 rounded-md">
                                                <p className="text-sm truncate">Liked post: <span className="font-medium">"{like.postContent}"</span> by @{like.postAuthor}</p>
                                            </div>
                                        ))}
                                    </div>
                                </TabsContent>
                            </div>
                        </Tabs>
                    </div>
                </div>
            </DialogContent>
            <DirectMessageDialog recipient={user} isOpen={dmOpen} onOpenChange={setDmOpen} />
        </Dialog>
    );
};

const AdminUsers = () => {
    const { toast } = useToast();
    const navigate = useNavigate();
    const { users, banUser, unbanUser, muteUser, unmuteUser } = useContent();
    const { user: currentUser } = useAuth();
    const [selectedUser, setSelectedUser] = useState(null);
    const [isCreateUserModalOpen, setCreateUserModalOpen] = useState(false);
    const [newUser, setNewUser] = useState({ name: '', username: '', email: '', password: ''});
    const [searchTerm, setSearchTerm] = useState("");
    const [dmModalOpen, setDmModalOpen] = useState(false);
    const [dmRecipient, setDmRecipient] = useState(null);

    const handleAction = (action, username) => {
        if (action === 'Ban') {
            banUser(username);
        } else if (action === 'Unban') {
            unbanUser(username);
        } else if (action === 'Mute') {
            muteUser(username);
        } else if (action === 'Unmute') {
            unmuteUser(username);
        } else if (action === 'Message') {
            // Usually triggered inside modal, but if triggered from dropdown:
            const user = Object.values(users).find(u => u.username === username);
            if (user) {
                setDmRecipient(user);
                setDmModalOpen(true);
            }
            return;
        }

        toast({
            title: `Action: ${action}`,
            description: `Performed "${action}" on user @${username}.`,
        });
    };

    const handleCreateUser = () => {
        if (!newUser.email || !newUser.username || !newUser.password) {
            toast({ title: 'Missing Information', description: 'Please fill out all required fields.', variant: 'destructive'});
            return;
        }
        toast({ title: 'User Created', description: `User @${newUser.username} has been successfully created. (Demo)` });
        setCreateUserModalOpen(false);
        setNewUser({ name: '', username: '', email: '', password: '' });
    };
    
    const userList = Object.values(users);
    
    const filteredUsers = userList.filter(user => 
        user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.username.toLowerCase().includes(searchTerm.toLowerCase())
    );
  
    return (
        <div className="space-y-6 p-4 md:p-8">
            <header>
                <h1 className="text-3xl font-bold tracking-tight text-foreground">User Management</h1>
                <p className="text-muted-foreground mt-1">View, manage, and moderate user accounts.</p>
            </header>
            <Card>
                <CardHeader>
                     <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                        <div className="relative w-full sm:max-w-xs">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                            <Input placeholder="Search users..." className="pl-10" value={searchTerm} onChange={e => setSearchTerm(e.target.value)} />
                        </div>
                        {currentUser?.isAdmin && (
                            <Dialog open={isCreateUserModalOpen} onOpenChange={setCreateUserModalOpen}>
                                <DialogTrigger asChild><Button><UserPlus className="mr-2 h-4 w-4" />Create User</Button></DialogTrigger>
                                <DialogContent className="sm:max-w-[425px]">
                                    <DialogHeader>
                                        <DialogTitle>Create New User</DialogTitle>
                                        <DialogDescription>Add a new user to the platform.</DialogDescription>
                                    </DialogHeader>
                                    <div className="grid gap-4 py-4">
                                        <div className="grid grid-cols-4 items-center gap-4"><Label htmlFor="name" className="text-right">Name</Label><Input id="name" value={newUser.name} onChange={(e) => setNewUser({...newUser, name: e.target.value})} className="col-span-3" placeholder="John Doe" /></div>
                                        <div className="grid grid-cols-4 items-center gap-4"><Label htmlFor="username-create" className="text-right">Username</Label><Input id="username-create" value={newUser.username} onChange={(e) => setNewUser({...newUser, username: e.target.value})} className="col-span-3" placeholder="johndoe" required /></div>
                                        <div className="grid grid-cols-4 items-center gap-4"><Label htmlFor="email" className="text-right">Email</Label><Input id="email" type="email" value={newUser.email} onChange={(e) => setNewUser({...newUser, email: e.target.value})} className="col-span-3" placeholder="john@example.com" required /></div>
                                        <div className="grid grid-cols-4 items-center gap-4"><Label htmlFor="password" className="text-right">Password</Label><Input id="password" type="password" value={newUser.password} onChange={(e) => setNewUser({...newUser, password: e.target.value})} className="col-span-3" placeholder="••••••••" required /></div>
                                    </div>
                                    <DialogFooter><Button type="submit" onClick={handleCreateUser}>Create User</Button></DialogFooter>
                                </DialogContent>
                            </Dialog>
                        )}
                    </div>
                </CardHeader>
                <CardContent>
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>User</TableHead>
                                <TableHead>Status</TableHead>
                                <TableHead>Subscription</TableHead>
                                <TableHead className="text-right">Actions</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {filteredUsers.map((user) => (
                            <TableRow key={user.id} className="cursor-pointer hover:bg-muted/50" onClick={() => setSelectedUser(user)}>
                                <TableCell className="font-medium">
                                    <div className="flex items-center gap-3">
                                        <Avatar className="hover:ring-2 ring-primary transition-all"><AvatarImage src={user.avatar} /><AvatarFallback>{user.name.charAt(0)}</AvatarFallback></Avatar>
                                        <div>
                                            <div className="font-semibold text-foreground hover:text-primary transition-colors">{user.name}</div>
                                            <div className="text-sm text-muted-foreground">@{user.username}</div>
                                            <div className="text-xs text-muted-foreground/80">{user.email}</div>
                                        </div>
                                    </div>
                                </TableCell>
                                <TableCell>
                                    <div className="flex gap-2">
                                        <Badge variant={user.isBanned ? 'destructive' : 'outline'}>{user.isBanned ? 'Banned' : 'Active'}</Badge>
                                        {user.isMuted && <Badge variant="secondary" className="bg-yellow-500/10 text-yellow-500 border-yellow-500/20">Muted</Badge>}
                                    </div>
                                </TableCell>
                                <TableCell>
                                    <div className="flex items-center gap-2"><CreditCard className="h-4 w-4 text-muted-foreground" /><span>{user.tier}</span></div>
                                </TableCell>
                                <TableCell className="text-right">
                                    <DropdownMenu>
                                        <DropdownMenuTrigger asChild onClick={(e) => e.stopPropagation()}>
                                            <Button variant="ghost" className="h-8 w-8 p-0"><span className="sr-only">Open menu</span><MoreHorizontal className="h-4 w-4" /></Button>
                                        </DropdownMenuTrigger>
                                        <DropdownMenuContent align="end">
                                            <DropdownMenuItem onClick={() => setSelectedUser(user)}><Eye className="mr-2 h-4 w-4" /> View Details</DropdownMenuItem>
                                            <DropdownMenuItem onClick={() => navigate(`/profile/${user.username}`)}><ExternalLink className="mr-2 h-4 w-4" /> View Profile</DropdownMenuItem>
                                            <DropdownMenuItem onClick={() => handleAction(user.isMuted ? 'Unmute' : 'Mute', user.username)}>{user.isMuted ? <Mic className="mr-2 h-4 w-4" /> : <MicOff className="mr-2 h-4 w-4" />} {user.isMuted ? 'Unmute' : 'Mute'}</DropdownMenuItem>
                                            
                                            {currentUser?.isAdmin && (
                                                <>
                                                <DropdownMenuItem onClick={() => handleAction('Reset Password', user.username)}><KeyRound className="mr-2 h-4 w-4" /> Reset Password</DropdownMenuItem>
                                                <DropdownMenuItem className="text-destructive" onClick={() => handleAction(user.isBanned ? 'Unban' : 'Ban', user.username)}>{user.isBanned ? <UserCheck className="mr-2 h-4 w-4" /> : <ShieldBan className="mr-2 h-4 w-4" />} {user.isBanned ? 'Unban' : 'Ban'}</DropdownMenuItem>
                                                </>
                                            )}
                                        </DropdownMenuContent>
                                    </DropdownMenu>
                                </TableCell>
                            </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </CardContent>
            </Card>
            <UserDetailModal user={selectedUser} isOpen={!!selectedUser} onOpenChange={() => setSelectedUser(null)} onAction={handleAction} />
            <DirectMessageDialog recipient={dmRecipient} isOpen={dmModalOpen} onOpenChange={setDmModalOpen} />
        </div>
    );
};

export default AdminUsers;