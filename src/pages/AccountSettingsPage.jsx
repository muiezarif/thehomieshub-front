import React, { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useWallet } from '@/contexts/WalletContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Separator } from '@/components/ui/separator';
import { useToast } from '@/components/ui/use-toast';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Bell, Shield, Wallet, User, Lock, AlertTriangle, LogOut, Trash2, FileText, Heart } from 'lucide-react';
import { Link } from 'react-router-dom';

const AccountSettingsPage = () => {
  const { user, updateUser } = useAuth();
  const { walletMode, exitWalletMode } = useWallet();
  const { toast } = useToast();

  const [email, setEmail] = useState(user?.email || '');
  const [password, setPassword] = useState('');
  
  // Notification States
  const [notifications, setNotifications] = useState({
    likes: true,
    comments: true,
    followers: true,
    mentions: true,
    dms: true,
    events: false,
    wallet: true,
  });

  // Privacy States
  const [privacy, setPrivacy] = useState({
    messaging: 'everyone',
    comments: 'everyone',
    nsfw: 'blur',
  });
  
  // Confirmation Dialog States
  const [isDeactivateOpen, setIsDeactivateOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);

  const handleNotificationToggle = (key) => {
    setNotifications(prev => ({ ...prev, [key]: !prev[key] }));
    toast({
        title: "Settings Updated",
        description: `${key.charAt(0).toUpperCase() + key.slice(1)} notifications ${!notifications[key] ? 'enabled' : 'disabled'}.`,
    });
  };

  const handlePrivacyChange = (key, value) => {
    setPrivacy(prev => ({ ...prev, [key]: value }));
    toast({
        title: "Privacy Updated",
        description: "Your privacy settings have been saved.",
    });
  };

  const handleSaveAccountInfo = () => {
    toast({
      title: "Account Updated",
      description: "Your email and password have been updated successfully.",
    });
    // In a real app, this would call an API
  };

  const handleDisconnectWallet = () => {
      toast({
          title: "Wallet Disconnected",
          description: "Your wallet has been disconnected from your account."
      })
  }

  const handleDeactivate = () => {
      setIsDeactivateOpen(false);
      toast({
          title: "Account Deactivated",
          description: "You have been logged out. We hope to see you again soon."
      });
      // Logic to logout would go here
  };

  const handleDelete = () => {
      setIsDeleteOpen(false);
      toast({
          title: "Account Deleted",
          description: "Your account and data have been permanently removed."
      });
      // Logic to delete and logout
  };

  return (
    <div className="container max-w-3xl mx-auto py-8 px-4 space-y-8 pb-24">
      <div className="flex flex-col space-y-2">
        <h1 className="text-3xl font-bold tracking-tight">Account Settings</h1>
        <p className="text-muted-foreground">Manage your account details, privacy, and preferences.</p>
      </div>

      {/* 1. Account Information */}
      <Card>
        <CardHeader>
          <div className="flex items-center gap-2">
            <User className="w-5 h-5 text-primary" />
            <CardTitle>Account Information</CardTitle>
          </div>
          <CardDescription>Update your login credentials.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="email">Email Address</Label>
            <Input 
                id="email" 
                value={email} 
                onChange={(e) => setEmail(e.target.value)} 
                placeholder="Enter your email"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="password">New Password</Label>
            <Input 
                id="password" 
                type="password" 
                value={password} 
                onChange={(e) => setPassword(e.target.value)} 
                placeholder="••••••••"
            />
          </div>
        </CardContent>
        <CardFooter>
          <Button onClick={handleSaveAccountInfo}>Save Changes</Button>
        </CardFooter>
      </Card>

      {/* 2. Notification Settings */}
      <Card>
        <CardHeader>
           <div className="flex items-center gap-2">
            <Bell className="w-5 h-5 text-primary" />
            <CardTitle>Notifications</CardTitle>
          </div>
          <CardDescription>Manage what alerts you receive.</CardDescription>
        </CardHeader>
        <CardContent className="grid gap-6">
          {[
            { key: 'likes', label: 'Likes' },
            { key: 'comments', label: 'Comments' },
            { key: 'followers', label: 'New Followers' },
            { key: 'mentions', label: 'Mentions' },
            { key: 'dms', label: 'Direct Messages' },
            { key: 'events', label: 'Event Reminders' },
            { key: 'wallet', label: 'Wallet Activity' },
          ].map((item) => (
            <div key={item.key} className="flex items-center justify-between space-x-2">
              <Label htmlFor={item.key} className="flex-1">{item.label}</Label>
              <Switch
                id={item.key}
                checked={notifications[item.key]}
                onCheckedChange={() => handleNotificationToggle(item.key)}
                className="data-[state=checked]:bg-green-500 data-[state=unchecked]:bg-red-500"
              />
            </div>
          ))}
        </CardContent>
      </Card>

      {/* 3. Privacy & Content Preferences */}
      <Card>
        <CardHeader>
          <div className="flex items-center gap-2">
            <Shield className="w-5 h-5 text-primary" />
            <CardTitle>Privacy & Content</CardTitle>
          </div>
          <CardDescription>Control who can interact with you and what you see.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
            <div className="space-y-2">
                <Label>Who can message you?</Label>
                <Select value={privacy.messaging} onValueChange={(val) => handlePrivacyChange('messaging', val)}>
                    <SelectTrigger>
                        <SelectValue placeholder="Select" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="everyone">Everyone</SelectItem>
                        <SelectItem value="followers">Followers Only</SelectItem>
                        <SelectItem value="subscribers">Subscribers Only</SelectItem>
                    </SelectContent>
                </Select>
            </div>
            
             <div className="space-y-2">
                <Label>Who can comment on your posts?</Label>
                <Select value={privacy.comments} onValueChange={(val) => handlePrivacyChange('comments', val)}>
                    <SelectTrigger>
                        <SelectValue placeholder="Select" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="everyone">Everyone</SelectItem>
                        <SelectItem value="followers">Followers Only</SelectItem>
                        <SelectItem value="subscribers">Subscribers Only</SelectItem>
                    </SelectContent>
                </Select>
            </div>

            <Separator />

            <div className="space-y-2">
                <Label>NSFW Content Visibility</Label>
                 <Select value={privacy.nsfw} onValueChange={(val) => handlePrivacyChange('nsfw', val)}>
                    <SelectTrigger>
                        <SelectValue placeholder="Select" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="show">Show</SelectItem>
                        <SelectItem value="blur">Blur (Click to view)</SelectItem>
                        <SelectItem value="hide">Hide completely</SelectItem>
                    </SelectContent>
                </Select>
            </div>
        </CardContent>
      </Card>

      {/* 4. Wallet Preferences */}
      <Card>
        <CardHeader>
           <div className="flex items-center gap-2">
            <Wallet className="w-5 h-5 text-primary" />
            <CardTitle>Wallet Preferences</CardTitle>
          </div>
          <CardDescription>Manage your connected Web3 wallet.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
            <div className="p-4 bg-secondary/50 rounded-lg flex items-center justify-between overflow-hidden">
                <div className="flex flex-col overflow-hidden mr-4">
                    <span className="text-xs text-muted-foreground uppercase font-semibold">Connected Address</span>
                    <span className="font-mono text-sm truncate">0x71C...9A23</span>
                </div>
                <Button variant="outline" size="sm" onClick={handleDisconnectWallet}>Disconnect</Button>
            </div>
            
            <Link to="/wallet" className="block">
                <Button variant="secondary" className="w-full justify-between group">
                    <span>Enter Wallet Mode</span>
                    <Wallet className="w-4 h-4 ml-2 group-hover:text-primary transition-colors" />
                </Button>
            </Link>
        </CardContent>
      </Card>

      {/* 5. Legal & About (New Section) */}
       <Card>
        <CardHeader>
           <div className="flex items-center gap-2">
            <FileText className="w-5 h-5 text-primary" />
            <CardTitle>Legal & About</CardTitle>
          </div>
          <CardDescription>Review our community rules and policies.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-2">
            <Link to="/terms" className="flex items-center justify-between p-3 rounded-md hover:bg-muted transition-colors">
                <div className="flex items-center gap-3">
                    <FileText className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm font-medium">Terms of Service</span>
                </div>
            </Link>
             <Link to="/privacy" className="flex items-center justify-between p-3 rounded-md hover:bg-muted transition-colors">
                <div className="flex items-center gap-3">
                    <Shield className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm font-medium">Privacy Policy</span>
                </div>
            </Link>
             <Link to="/community-guidelines" className="flex items-center justify-between p-3 rounded-md hover:bg-muted transition-colors">
                <div className="flex items-center gap-3">
                    <Heart className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm font-medium">Community Guidelines</span>
                </div>
            </Link>
        </CardContent>
      </Card>

      {/* 6. Account Management */}
      <Card className="border-red-500/20 shadow-none">
        <CardHeader>
          <div className="flex items-center gap-2">
            <AlertTriangle className="w-5 h-5 text-red-500" />
            <CardTitle className="text-red-500">Danger Zone</CardTitle>
          </div>
          <CardDescription>Irreversible actions for your account.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
             <div className="flex items-center justify-between">
                <div>
                    <h4 className="font-medium">Deactivate Account</h4>
                    <p className="text-sm text-muted-foreground">Temporarily disable your profile.</p>
                </div>
                <Dialog open={isDeactivateOpen} onOpenChange={setIsDeactivateOpen}>
                    <DialogTrigger asChild>
                         <Button variant="outline">Deactivate</Button>
                    </DialogTrigger>
                    <DialogContent>
                        <DialogHeader>
                            <DialogTitle>Deactivate Account?</DialogTitle>
                            <DialogDescription>
                                This will temporarily hide your profile and content. You can reactivate it anytime by logging back in.
                            </DialogDescription>
                        </DialogHeader>
                        <DialogFooter>
                            <Button variant="outline" onClick={() => setIsDeactivateOpen(false)}>Cancel</Button>
                            <Button variant="destructive" onClick={handleDeactivate}>Deactivate</Button>
                        </DialogFooter>
                    </DialogContent>
                </Dialog>
            </div>
            
            <Separator />

             <div className="flex items-center justify-between">
                <div>
                    <h4 className="font-medium">Delete Account</h4>
                    <p className="text-sm text-muted-foreground">Permanently remove your account and data.</p>
                </div>
                 <Dialog open={isDeleteOpen} onOpenChange={setIsDeleteOpen}>
                    <DialogTrigger asChild>
                         <Button variant="destructive">Delete Account</Button>
                    </DialogTrigger>
                    <DialogContent>
                        <DialogHeader>
                            <DialogTitle>Are you absolutely sure?</DialogTitle>
                            <DialogDescription>
                                This action cannot be undone. This will permanently delete your account and remove your data from our servers.
                            </DialogDescription>
                        </DialogHeader>
                        <DialogFooter>
                            <Button variant="outline" onClick={() => setIsDeleteOpen(false)}>Cancel</Button>
                            <Button variant="destructive" onClick={handleDelete}>Delete Permanently</Button>
                        </DialogFooter>
                    </DialogContent>
                </Dialog>
            </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default AccountSettingsPage;