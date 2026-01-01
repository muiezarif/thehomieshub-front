import React, { useState, useEffect } from 'react';
import { 
    Check, 
    X, 
    AlertTriangle, 
    Search, 
    Loader2, 
    Calendar, 
    FileText, 
    MoreHorizontal,
    DollarSign
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/components/ui/use-toast';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';

const AdminMonetization = () => {
    const { toast } = useToast();
    const [applications, setApplications] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState("");
    const [filterStatus, setFilterStatus] = useState("pending");
    
    // Rejection Modal State
    const [rejectDialogOpen, setRejectDialogOpen] = useState(false);
    const [selectedApplicant, setSelectedApplicant] = useState(null);
    const [rejectionReason, setRejectionReason] = useState("");
    const [isProcessing, setIsProcessing] = useState(false);

    // Simulated API: GET /api/admin/monetization/pending
    useEffect(() => {
        const fetchApplications = async () => {
            setLoading(true);
            // Simulate network delay
            await new Promise(resolve => setTimeout(resolve, 1000));

            // Mock Data
            const mockData = [
                {
                    id: 'app_1',
                    user: {
                        id: 'u_101',
                        username: 'fitness_guru',
                        email: 'sarah@fitness.com',
                        avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop&crop=faces',
                        postsCount: 142,
                        joinedDate: '2023-04-12'
                    },
                    status: 'pending',
                    submittedAt: '2025-12-01',
                    flags: []
                },
                {
                    id: 'app_2',
                    user: {
                        id: 'u_102',
                        username: 'crypto_king',
                        email: 'invest@crypto.net',
                        avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&h=150&fit=crop&crop=faces',
                        postsCount: 23,
                        joinedDate: '2023-11-05'
                    },
                    status: 'pending',
                    submittedAt: '2025-12-02',
                    flags: ['High Risk Content', 'Multiple Reports']
                },
                {
                    id: 'app_3',
                    user: {
                        id: 'u_103',
                        username: 'travel_vlogs',
                        email: 'mike@travel.com',
                        avatar: 'https://images.unsplash.com/photo-1599566150163-29194dcaad36?w=150&h=150&fit=crop&crop=faces',
                        postsCount: 89,
                        joinedDate: '2023-01-20'
                    },
                    status: 'approved',
                    submittedAt: '2025-11-15',
                    flags: []
                },
                {
                    id: 'app_4',
                    user: {
                        id: 'u_104',
                        username: 'newbie_gamer',
                        email: 'game@play.com',
                        avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&h=150&fit=crop&crop=faces',
                        postsCount: 2,
                        joinedDate: '2025-11-30'
                    },
                    status: 'rejected',
                    submittedAt: '2025-12-01',
                    flags: ['Insufficient Content']
                }
            ];

            setApplications(mockData);
            setLoading(false);
        };

        fetchApplications();
    }, []);

    const handleApprove = async (appId) => {
        setIsProcessing(true);
        // Simulated API: PATCH /api/admin/monetization/approve/:userId
        try {
            await new Promise(resolve => setTimeout(resolve, 800));
            
            setApplications(prev => prev.map(app => 
                app.id === appId ? { ...app, status: 'approved' } : app
            ));

            toast({
                title: "Creator Approved",
                description: "Monetization features enabled for this user.",
                className: "bg-green-600 text-white border-none"
            });
        } catch (error) {
            toast({
                title: "Action Failed",
                description: "Could not approve application.",
                variant: "destructive"
            });
        } finally {
            setIsProcessing(false);
        }
    };

    const initiateReject = (app) => {
        setSelectedApplicant(app);
        setRejectionReason("");
        setRejectDialogOpen(true);
    };

    const handleConfirmReject = async () => {
        if (!selectedApplicant) return;
        
        setIsProcessing(true);
        // Simulated API: PATCH /api/admin/monetization/reject/:userId
        try {
            await new Promise(resolve => setTimeout(resolve, 800));
            
            setApplications(prev => prev.map(app => 
                app.id === selectedApplicant.id ? { ...app, status: 'rejected' } : app
            ));

            toast({
                title: "Creator Rejected",
                description: "Application rejected and user notified.",
            });
            setRejectDialogOpen(false);
        } catch (error) {
             toast({
                title: "Action Failed",
                description: "Could not reject application.",
                variant: "destructive"
            });
        } finally {
            setIsProcessing(false);
        }
    };

    const filteredApplications = applications.filter(app => {
        const matchesSearch = 
            app.user.username.toLowerCase().includes(searchTerm.toLowerCase()) || 
            app.user.email.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesStatus = app.status === filterStatus;
        return matchesSearch && matchesStatus;
    });

    const getStatusBadge = (status) => {
        switch(status) {
            case 'approved': return <Badge className="bg-green-500 hover:bg-green-600">Approved</Badge>;
            case 'rejected': return <Badge variant="destructive">Rejected</Badge>;
            default: return <Badge variant="secondary" className="bg-yellow-500/10 text-yellow-500 border-yellow-500/20">Pending Review</Badge>;
        }
    };

    return (
        <div className="space-y-6 p-4 md:p-8">
            <header>
                <h1 className="text-3xl font-bold tracking-tight text-foreground flex items-center gap-2">
                    <DollarSign className="h-8 w-8 text-primary" />
                    Monetization Requests
                </h1>
                <p className="text-muted-foreground mt-1">Review and manage creator applications for the partner program.</p>
            </header>

            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <Tabs value={filterStatus} onValueChange={setFilterStatus} className="w-full sm:w-auto">
                    <TabsList>
                        <TabsTrigger value="pending">Pending</TabsTrigger>
                        <TabsTrigger value="approved">Approved</TabsTrigger>
                        <TabsTrigger value="rejected">Rejected</TabsTrigger>
                    </TabsList>
                </Tabs>

                <div className="relative w-full sm:w-72">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input 
                        placeholder="Search creators..." 
                        className="pl-10" 
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>
            </div>

            <Card>
                <CardContent className="p-0">
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Creator</TableHead>
                                <TableHead>Stats</TableHead>
                                <TableHead>Submitted</TableHead>
                                <TableHead>Risk Analysis</TableHead>
                                <TableHead>Status</TableHead>
                                <TableHead className="text-right">Actions</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {loading ? (
                                <TableRow>
                                    <TableCell colSpan={6} className="h-24 text-center">
                                        <div className="flex justify-center items-center gap-2">
                                            <Loader2 className="h-5 w-5 animate-spin text-primary" />
                                            <span className="text-muted-foreground">Loading requests...</span>
                                        </div>
                                    </TableCell>
                                </TableRow>
                            ) : filteredApplications.length === 0 ? (
                                <TableRow>
                                    <TableCell colSpan={6} className="h-24 text-center text-muted-foreground">
                                        No {filterStatus} applications found.
                                    </TableCell>
                                </TableRow>
                            ) : (
                                filteredApplications.map((app) => (
                                    <TableRow key={app.id}>
                                        <TableCell>
                                            <div className="flex items-center gap-3">
                                                <Avatar className="h-9 w-9 border">
                                                    <AvatarImage src={app.user.avatar} />
                                                    <AvatarFallback>{app.user.username.charAt(0).toUpperCase()}</AvatarFallback>
                                                </Avatar>
                                                <div>
                                                    <div className="font-medium">{app.user.username}</div>
                                                    <div className="text-xs text-muted-foreground">{app.user.email}</div>
                                                </div>
                                            </div>
                                        </TableCell>
                                        <TableCell>
                                            <div className="flex flex-col text-sm">
                                                <span className="flex items-center gap-1 text-muted-foreground">
                                                    <FileText className="h-3 w-3" /> {app.user.postsCount} posts
                                                </span>
                                                <span className="flex items-center gap-1 text-muted-foreground text-xs">
                                                    <Calendar className="h-3 w-3" /> Joined {new Date(app.user.joinedDate).toLocaleDateString()}
                                                </span>
                                            </div>
                                        </TableCell>
                                        <TableCell className="text-muted-foreground">
                                            {new Date(app.submittedAt).toLocaleDateString()}
                                        </TableCell>
                                        <TableCell>
                                            {app.flags && app.flags.length > 0 ? (
                                                <div className="flex flex-col gap-1">
                                                    {app.flags.map((flag, idx) => (
                                                        <Badge key={idx} variant="outline" className="w-fit border-red-200 text-red-600 bg-red-50 flex gap-1 items-center text-[10px] py-0">
                                                            <AlertTriangle className="h-3 w-3" /> {flag}
                                                        </Badge>
                                                    ))}
                                                </div>
                                            ) : (
                                                <span className="text-xs text-green-600 flex items-center gap-1">
                                                    <Check className="h-3 w-3" /> Clean
                                                </span>
                                            )}
                                        </TableCell>
                                        <TableCell>
                                            {getStatusBadge(app.status)}
                                        </TableCell>
                                        <TableCell className="text-right">
                                            {app.status === 'pending' ? (
                                                <div className="flex items-center justify-end gap-2">
                                                    <Button 
                                                        size="sm" 
                                                        className="bg-green-600 hover:bg-green-700 h-8"
                                                        onClick={() => handleApprove(app.id)}
                                                        disabled={isProcessing}
                                                    >
                                                        <Check className="h-4 w-4 mr-1" /> Approve
                                                    </Button>
                                                    <Button 
                                                        size="sm" 
                                                        variant="destructive"
                                                        className="h-8"
                                                        onClick={() => initiateReject(app)}
                                                        disabled={isProcessing}
                                                    >
                                                        <X className="h-4 w-4 mr-1" /> Reject
                                                    </Button>
                                                </div>
                                            ) : (
                                                <DropdownMenu>
                                                    <DropdownMenuTrigger asChild>
                                                        <Button variant="ghost" className="h-8 w-8 p-0">
                                                            <MoreHorizontal className="h-4 w-4" />
                                                        </Button>
                                                    </DropdownMenuTrigger>
                                                    <DropdownMenuContent align="end">
                                                        <DropdownMenuItem onClick={() => toast({ title: "Not implemented", description: "View details coming soon" })}>
                                                            View Application Details
                                                        </DropdownMenuItem>
                                                    </DropdownMenuContent>
                                                </DropdownMenu>
                                            )}
                                        </TableCell>
                                    </TableRow>
                                ))
                            )}
                        </TableBody>
                    </Table>
                </CardContent>
            </Card>

            <Dialog open={rejectDialogOpen} onOpenChange={setRejectDialogOpen}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Reject Application</DialogTitle>
                        <DialogDescription>
                            Please provide a reason for rejecting @{selectedApplicant?.user.username}. This will be sent to the user.
                        </DialogDescription>
                    </DialogHeader>
                    <div className="py-4">
                        <Textarea 
                            placeholder="Reason for rejection (e.g. Insufficient content, Copyright violations)..."
                            value={rejectionReason}
                            onChange={(e) => setRejectionReason(e.target.value)}
                            className="min-h-[100px]"
                        />
                    </div>
                    <DialogFooter>
                        <Button variant="outline" onClick={() => setRejectDialogOpen(false)}>Cancel</Button>
                        <Button 
                            variant="destructive" 
                            onClick={handleConfirmReject}
                            disabled={!rejectionReason.trim() || isProcessing}
                        >
                            {isProcessing ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : null}
                            Confirm Rejection
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    );
};

export default AdminMonetization;