import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { MoreHorizontal, Search, Video, FileText, BarChart2, MessageCircle, MapPin, PlusCircle, ThumbsUp, Trash2, Star, Edit, ShieldAlert, ExternalLink } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/components/ui/use-toast';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter, DialogTrigger } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { useContent } from '@/contexts/ContentContext';
import { useAuth } from '@/contexts/AuthContext';
import { useNavigate } from 'react-router-dom';

const contentTypes = ['Video', 'Thread', 'Poll', 'Trip'];

const getPostIcon = (type) => {
    switch (type) {
        case 'Video': return <Video className="h-4 w-4 text-muted-foreground" />;
        case 'Thread': return <FileText className="h-4 w-4 text-muted-foreground" />;
        case 'Poll': return <BarChart2 className="h-4 w-4 text-muted-foreground" />;
        case 'Comment': return <MessageCircle className="h-4 w-4 text-muted-foreground" />;
        case 'Trip': return <MapPin className="h-4 w-4 text-muted-foreground" />;
        default: return null;
    }
};

const AdminContent = () => {
    const navigate = useNavigate();
    const { toast } = useToast();
    const { communityPosts, deletePost } = useContent();
    const { user: currentUser } = useAuth();
    const [content, setContent] = useState(communityPosts);
    const [isCreateModalOpen, setCreateModalOpen] = useState(false);
    const [newItem, setNewItem] = useState({ type: 'Thread', content: '', user: '' });
    const [searchTerm, setSearchTerm] = useState("");
    const [filterType, setFilterType] = useState('all');

    const handleAction = (action, contentId) => {
        if (action === "Delete") {
            deletePost(contentId);
            setContent(prev => prev.filter(p => p.id !== contentId));
        } else if (action === "MarkNSFW") {
            setContent(prev => prev.map(p => {
                if(p.id === contentId) return { ...p, isNSFW: true, adminMandatedNSFW: true };
                return p;
            }));
        }
        toast({
            title: `Action: ${action}`,
            description: `Performed "${action}" on item ${contentId}.`,
        });
    };

    const handleNavigateToContent = (item) => {
        // In a real app, this would route to /post/:id
        // For now, we simulate by showing a toast or routing to profile
        navigate(`/profile/${item.user.username}`);
        toast({ title: "Navigating", description: `Viewing content from ${item.user.username}` });
    };

    const filteredContent = content.filter(item => {
        const itemContent = item.content.text || item.title || '';
        const matchesSearch = itemContent.toLowerCase().includes(searchTerm.toLowerCase()) ||
                             item.user.username.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesType = filterType === 'all' || item.type.toLowerCase() === filterType;
        return matchesSearch && matchesType;
    });

    return (
        <div className="space-y-6 p-4 md:p-8">
            <header>
                <h1 className="text-3xl font-bold tracking-tight text-foreground">Content Management</h1>
                <p className="text-muted-foreground mt-1">Review, approve, and manage all community videos and posts.</p>
            </header>

             <Card>
                <CardHeader>
                     <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                        <div className="relative w-full sm:max-w-xs">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                            <Input placeholder="Search content or users..." className="pl-10" value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} />
                        </div>
                        <Select value={filterType} onValueChange={setFilterType}>
                            <SelectTrigger className="w-[180px]">
                                <SelectValue placeholder="Filter by type" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="all">All Content</SelectItem>
                                <SelectItem value="video">Video</SelectItem>
                                <SelectItem value="thread">Thread</SelectItem>
                                <SelectItem value="poll">Poll</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>
                </CardHeader>
                <CardContent>
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead className="w-[40%]">Content</TableHead>
                                <TableHead>User</TableHead>
                                <TableHead>Type</TableHead>
                                <TableHead>Status</TableHead>
                                <TableHead className="text-right">Actions</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {filteredContent.map((item) => (
                                <TableRow key={item.id} className="cursor-pointer hover:bg-muted/50" onClick={() => handleNavigateToContent(item)}>
                                    <TableCell className="font-medium text-foreground truncate max-w-xs group">
                                        <div className="flex items-center gap-2">
                                            <span className={item.isNSFW && item.adminMandatedNSFW ? "blur-sm filter" : ""}>
                                                {item.content.text || item.title}
                                            </span>
                                            {item.featured && <Star className="h-4 w-4 text-yellow-400 fill-yellow-400 flex-shrink-0" />}
                                            {item.isNSFW && <Badge variant="destructive" className="ml-2 text-[10px] h-5">NSFW</Badge>}
                                            <ExternalLink className="h-3 w-3 opacity-0 group-hover:opacity-50 ml-1" />
                                        </div>
                                    </TableCell>
                                    <TableCell onClick={(e) => { e.stopPropagation(); navigate(`/profile/${item.user.username}`); }}>
                                        <div className="flex items-center gap-3 hover:text-primary transition-colors">
                                            <Avatar className="h-8 w-8">
                                                <AvatarImage src={`https://avatar.vercel.sh/${item.user.username}.png`} />
                                                <AvatarFallback>{item.user.name.charAt(0).toUpperCase()}</AvatarFallback>
                                            </Avatar>
                                            <span className="font-medium">@{item.user.username}</span>
                                        </div>
                                    </TableCell>
                                    <TableCell>
                                        <div className="flex items-center gap-2">
                                            {getPostIcon(item.type)}
                                            <span>{item.type}</span>
                                        </div>
                                    </TableCell>
                                    <TableCell>
                                        <Badge variant={item.status === 'published' ? 'secondary' : (item.status === 'flagged' ? 'destructive' : 'outline')}>{item.status}</Badge>
                                    </TableCell>
                                    <TableCell className="text-right">
                                        <DropdownMenu>
                                            <DropdownMenuTrigger asChild onClick={(e) => e.stopPropagation()}>
                                                <Button variant="ghost" className="h-8 w-8 p-0"><span className="sr-only">Open menu</span><MoreHorizontal className="h-4 w-4" /></Button>
                                            </DropdownMenuTrigger>
                                            <DropdownMenuContent align="end">
                                                {currentUser?.isAdmin && (
                                                    <DropdownMenuItem onClick={() => handleAction('Edit', item.id)}><Edit className="mr-2 h-4 w-4" /> Edit</DropdownMenuItem>
                                                )}
                                                {!item.isNSFW && <DropdownMenuItem onClick={() => handleAction('MarkNSFW', item.id)} className="text-red-500"><ShieldAlert className="mr-2 h-4 w-4" /> Mark NSFW</DropdownMenuItem>}
                                                {item.status !== 'published' && <DropdownMenuItem onClick={() => handleAction('Approve', item.id)}><ThumbsUp className="mr-2 h-4 w-4" />Approve</DropdownMenuItem>}
                                                {currentUser?.isAdmin && (
                                                    <DropdownMenuItem onClick={() => handleAction(item.featured ? 'Unfeature' : 'Feature', item.id)}><Star className="mr-2 h-4 w-4" />{item.featured ? 'Unfeature' : 'Feature'}</DropdownMenuItem>
                                                )}
                                                <DropdownMenuItem className="text-destructive focus:text-destructive" onClick={() => handleAction('Delete', item.id)}><Trash2 className="mr-2 h-4 w-4" />Delete</DropdownMenuItem>
                                            </DropdownMenuContent>
                                        </DropdownMenu>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </CardContent>
            </Card>
        </div>
    );
};

export default AdminContent;