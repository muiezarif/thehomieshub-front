import React, { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useToast } from '@/components/ui/use-toast';
import { Copy, Share2, Twitter, Facebook, Linkedin, Mail, Download, RefreshCw, MessageCircle, PlusCircle, Check, Send } from 'lucide-react';
import { useMessages } from '@/contexts/MessageContext';
import { useContent } from '@/contexts/ContentContext';
import { useAuth } from '@/contexts/AuthContext';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';

const ShareDialog = ({ children, postUrl, postTitle, post }) => {
  const { toast } = useToast();
  const { user } = useAuth();
  const { sendMessage } = useMessages();
  const { addStory } = useContent();
  const [isDownloading, setIsDownloading] = useState(false);
  const [showUserPicker, setShowUserPicker] = useState(false);
  const [isSharedToStory, setIsSharedToStory] = useState(false);

  const handleCopyLink = () => {
    navigator.clipboard.writeText(postUrl);
    toast({
      title: '✅ Link Copied!',
      description: 'The post link has been copied to your clipboard.',
    });
  };

  const handleRepost = () => {
    setIsDownloading(true);
    setTimeout(() => {
        setIsDownloading(false);
        toast({
            title: '⬇️ Video Saved',
            description: 'Video downloaded with Homies Hub watermark.',
        });
    }, 2000);
  };
  
  const handleShareToStory = () => {
      if (!user) {
          toast({ title: "Login Required", description: "Please login to share to story." });
          return;
      }
      
      if (addStory) {
          addStory({
            user: user,
            type: 'post_share',
            post: post,
            url: post?.thumbnail || post?.videoUrl || "https://images.unsplash.com/photo-1592572130011-855af2d206af" 
          });
      }
      
      setIsSharedToStory(true);
      toast({ title: "Shared to Story", description: "This post is now on your story." });
  };

  const handleSendToUser = (username) => {
      if (!user) return;
      sendMessage(username, '', 'post_share', post);
      toast({ title: "Sent!", description: `Shared post with @${username}` });
      setShowUserPicker(false);
  };

  const recentContacts = [
      { username: 'alexnomad', name: 'Alex Nomad', avatar: 'https://avatar.vercel.sh/alexnomad.png' },
      { username: 'bennytravels', name: 'Benny', avatar: 'https://avatar.vercel.sh/bennytravels.png' },
      { username: 'sarah_v', name: 'Sarah V.', avatar: 'https://avatar.vercel.sh/sarah_v.png' }
  ];

  const socialShares = [
    {
      name: 'Twitter',
      icon: <Twitter className="h-6 w-6" />,
      url: `https://twitter.com/intent/tweet?url=${encodeURIComponent(postUrl)}&text=${encodeURIComponent(postTitle)}`,
    },
    {
      name: 'Facebook',
      icon: <Facebook className="h-6 w-6" />,
      url: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(postUrl)}`,
    },
    {
      name: 'LinkedIn',
      icon: <Linkedin className="h-6 w-6" />,
      url: `https://www.linkedin.com/shareArticle?mini=true&url=${encodeURIComponent(postUrl)}&title=${encodeURIComponent(postTitle)}`,
    },
    {
      name: 'Email',
      icon: <Mail className="h-6 w-6" />,
      url: `mailto:?subject=${encodeURIComponent(postTitle)}&body=Check out this post: ${encodeURIComponent(postUrl)}`,
    },
  ];

  if (showUserPicker) {
      return (
        <Dialog open={true} onOpenChange={() => setShowUserPicker(false)}>
            <DialogContent className="sm:max-w-md">
                <DialogHeader>
                    <DialogTitle>Send to...</DialogTitle>
                </DialogHeader>
                <div className="space-y-2 mt-2">
                    {recentContacts.map(contact => (
                        <div key={contact.username} className="flex items-center justify-between p-2 hover:bg-muted rounded-lg cursor-pointer" onClick={() => handleSendToUser(contact.username)}>
                             <div className="flex items-center gap-3">
                                 <Avatar>
                                     <AvatarImage src={contact.avatar} />
                                     <AvatarFallback>{contact.name[0]}</AvatarFallback>
                                 </Avatar>
                                 <div>
                                     <p className="text-sm font-semibold">{contact.name}</p>
                                     <p className="text-xs text-muted-foreground">@{contact.username}</p>
                                 </div>
                             </div>
                             <Button size="sm" variant="ghost"><Send className="h-4 w-4" /></Button>
                        </div>
                    ))}
                    <div className="pt-2 border-t">
                         <Input placeholder="Search users..." className="h-9" />
                    </div>
                </div>
            </DialogContent>
        </Dialog>
      )
  }

  return (
    <Dialog>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Share to</DialogTitle>
        </DialogHeader>
        
        <div className="flex flex-col space-y-6 pt-2">
            
             <div className="grid grid-cols-2 gap-3">
                <Button variant="outline" className="h-auto flex-col py-3 gap-2 border-dashed" onClick={() => setShowUserPicker(true)}>
                    <div className="bg-primary/10 p-2 rounded-full text-primary">
                        <MessageCircle className="h-5 w-5" />
                    </div>
                    <span className="text-xs">Send in Message</span>
                </Button>
                <Button 
                    variant="outline" 
                    className="h-auto flex-col py-3 gap-2 border-dashed" 
                    onClick={handleShareToStory}
                    disabled={isSharedToStory}
                >
                    <div className="bg-gradient-to-tr from-yellow-400 to-red-500 p-2 rounded-full text-white">
                        {isSharedToStory ? <Check className="h-5 w-5" /> : <PlusCircle className="h-5 w-5" />}
                    </div>
                    <span className="text-xs">{isSharedToStory ? 'Added to Story' : 'Add to Story'}</span>
                </Button>
            </div>

            {/* Repost / Download Section */}
            <div className="bg-muted/30 p-4 rounded-lg border border-border">
                <h4 className="text-sm font-semibold mb-3">Repost & Save</h4>
                <Button 
                    onClick={handleRepost} 
                    disabled={isDownloading}
                    className="w-full bg-gradient-to-r from-pink-500 to-rose-500 hover:from-pink-600 hover:to-rose-600 text-white shadow-md transition-all"
                >
                    {isDownloading ? (
                        <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                    ) : (
                        <Download className="h-4 w-4 mr-2" />
                    )}
                    {isDownloading ? 'Saving...' : 'Save'}
                </Button>
                <p className="text-[10px] text-muted-foreground mt-2 text-center">
                    Any videos downloaded from The Homies app will have a watermark.
                </p>
            </div>

            <div className="flex items-center space-x-2">
                <Input id="link" defaultValue={postUrl} readOnly className="flex-1 h-9" />
                <Button type="button" size="icon" onClick={handleCopyLink} variant="outline" className="h-9 w-9">
                <Copy className="h-4 w-4" />
                <span className="sr-only">Copy Link</span>
                </Button>
            </div>

            <div>
                 <h4 className="text-sm font-semibold mb-3">Share to Socials</h4>
                 <div className="grid grid-cols-4 gap-4">
                    {socialShares.map((social) => (
                    <a
                        key={social.name}
                        href={social.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex flex-col items-center justify-center space-y-2 text-muted-foreground hover:text-primary transition-colors group"
                    >
                        <div className="flex h-12 w-12 items-center justify-center rounded-full bg-accent group-hover:bg-primary/10 transition-colors">
                        {social.icon}
                        </div>
                        <span className="text-xs font-medium">{social.name}</span>
                    </a>
                    ))}
                </div>
            </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ShareDialog;