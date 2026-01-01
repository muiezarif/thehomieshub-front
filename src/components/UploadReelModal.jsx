import React, { useState, useRef, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter, DialogTrigger } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Progress } from '@/components/ui/progress';
import { Switch } from '@/components/ui/switch';
import { Checkbox } from '@/components/ui/checkbox';
import { useToast } from '@/components/ui/use-toast';
import { useAuth } from '@/contexts/AuthContext';
import { useContent } from '@/contexts/ContentContext';
import { useMedia } from '@/contexts/MediaContext';
import { Upload, X, FileVideo, Loader2, Film, Hash, ChevronDown, ChevronUp, Music, Play, Pause, Check, AlertTriangle } from 'lucide-react';
import { cn } from '@/lib/utils';
import { motion, AnimatePresence } from 'framer-motion';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ScrollArea } from '@/components/ui/scroll-area';

const TrackItem = ({ track, onSelect, isSelected }) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const audioRef = useRef(null);

  const togglePreview = (e) => {
    e.stopPropagation();
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.pause();
      } else {
        document.querySelectorAll('audio').forEach(el => {
            if(el !== audioRef.current) el.pause(); 
        });
        audioRef.current.play();
      }
      setIsPlaying(!isPlaying);
    }
  };

  return (
    <div 
        className={cn(
            "flex items-center gap-3 p-2 rounded-lg hover:bg-zinc-800/50 cursor-pointer transition-colors group border border-transparent",
            isSelected && "bg-zinc-800/80 border-primary/30"
        )}
        onClick={() => onSelect(track)}
    >
        <div className="relative h-12 w-12 rounded overflow-hidden bg-zinc-800 shrink-0">
            <img src={track.cover} alt={track.title} className="h-full w-full object-cover" />
            <button 
                onClick={togglePreview}
                className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
            >
                {isPlaying ? <Pause className="h-5 w-5 text-white fill-current" /> : <Play className="h-5 w-5 text-white fill-current" />}
            </button>
            <audio ref={audioRef} src={track.audioUrl || "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3"} onEnded={() => setIsPlaying(false)} />
        </div>
        
        <div className="flex-1 min-w-0">
            <h4 className={cn("text-sm font-semibold truncate", isSelected ? "text-primary" : "text-white")}>{track.title}</h4>
            <p className="text-xs text-zinc-400 truncate">{track.artist}</p>
        </div>

        <div className="text-xs text-zinc-500 font-mono">
            {track.duration}
        </div>
        
        {isSelected && <Check className="h-4 w-4 text-primary ml-2" />}
    </div>
  );
};

const MusicPickerModal = ({ isOpen, onClose, onSelect, selectedTrack }) => {
    const { newReleases, likedMedia } = useMedia();
    const [activeTab, setActiveTab] = useState('trending');

    const trendingMusic = [...newReleases].sort(() => Math.random() - 0.5);
    const likedMusic = likedMedia.filter(item => item.type === 'audio');

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            {/* Added max-h-[85vh] and flex col to fix mobile overflow issues */}
            <DialogContent className="sm:max-w-md bg-zinc-950 border-zinc-800 text-white p-0 gap-0 overflow-hidden max-h-[85vh] flex flex-col">
                <DialogHeader className="px-6 py-4 border-b border-zinc-800 shrink-0">
                    <DialogTitle className="flex items-center gap-2 text-lg">
                        <Music className="h-5 w-5 text-primary" />
                        Select Audio
                    </DialogTitle>
                </DialogHeader>
                
                {/* Changed h-[450px] to flex-1 to handle dynamic height on mobile */}
                <Tabs defaultValue="trending" value={activeTab} onValueChange={setActiveTab} className="w-full flex flex-col flex-1 min-h-0">
                    <div className="px-6 pt-4 shrink-0">
                        <TabsList className="grid w-full grid-cols-3 bg-zinc-900">
                            <TabsTrigger value="trending">Trending</TabsTrigger>
                            <TabsTrigger value="new">New</TabsTrigger>
                            <TabsTrigger value="liked">Liked</TabsTrigger>
                        </TabsList>
                    </div>

                    <ScrollArea className="flex-1 px-6 py-4">
                        <TabsContent value="trending" className="mt-0 space-y-1">
                            {trendingMusic.map((track) => (
                                <TrackItem 
                                    key={`trending-${track.id}`} 
                                    track={track} 
                                    onSelect={(t) => { onSelect(t); onClose(); }} 
                                    isSelected={selectedTrack?.id === track.id}
                                />
                            ))}
                        </TabsContent>
                        
                        <TabsContent value="new" className="mt-0 space-y-1">
                             {newReleases.map((track) => (
                                <TrackItem 
                                    key={`new-${track.id}`} 
                                    track={track} 
                                    onSelect={(t) => { onSelect(t); onClose(); }} 
                                    isSelected={selectedTrack?.id === track.id}
                                />
                            ))}
                        </TabsContent>
                        
                        <TabsContent value="liked" className="mt-0 space-y-1">
                            {likedMusic.length > 0 ? (
                                likedMusic.map((track) => (
                                    <TrackItem 
                                        key={`liked-${track.id}`} 
                                        track={track} 
                                        onSelect={(t) => { onSelect(t); onClose(); }} 
                                        isSelected={selectedTrack?.id === track.id}
                                    />
                                ))
                            ) : (
                                <div className="flex flex-col items-center justify-center py-10 text-zinc-500">
                                    <p className="text-sm">No liked songs found.</p>
                                    <p className="text-xs">Go to Music Mode to like songs!</p>
                                </div>
                            )}
                        </TabsContent>
                    </ScrollArea>
                </Tabs>
            </DialogContent>
        </Dialog>
    );
};

const NSFWConfirmationModal = ({ isOpen, onConfirm, onCancel }) => {
    const [isConfirmed, setIsConfirmed] = useState(false);

    return (
        <Dialog open={isOpen} onOpenChange={(open) => !open && onCancel()}>
            <DialogContent className="sm:max-w-md border-red-900/50 bg-zinc-950">
                <DialogHeader>
                    <DialogTitle className="flex items-center gap-2 text-red-500">
                        <AlertTriangle className="h-5 w-5" />
                        NSFW Content Rules
                    </DialogTitle>
                    <DialogDescription>
                        You are marking this content as NSFW (18+). Please review the rules carefully.
                    </DialogDescription>
                </DialogHeader>
                
                <ScrollArea className="h-[200px] rounded-md border border-zinc-800 bg-zinc-900/50 p-4 text-sm text-zinc-300 relative z-0">
                    <ul className="list-disc pl-4 space-y-2">
                        <li><strong>Strictly Prohibited:</strong> Child Sexual Abuse Material (CSAM) is illegal and will be reported to authorities immediately.</li>
                        <li><strong>Consent is Mandatory:</strong> Non-consensual content (revenge porn) is strictly forbidden.</li>
                        <li><strong>No Violence:</strong> Sexual violence, rape, or exploitation is not allowed.</li>
                        <li><strong>Tagging:</strong> You must accurately tag this content. Misleading tags may result in account suspension.</li>
                    </ul>
                </ScrollArea>

                {/* Added relative z-10 to ensure checkbox is clickable on mobile */}
                <div className="flex items-center space-x-2 py-4 relative z-10">
                    <Checkbox id="nsfw-confirm" checked={isConfirmed} onCheckedChange={setIsConfirmed} />
                    <label
                        htmlFor="nsfw-confirm"
                        className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 text-white pl-2"
                    >
                        I confirm this content complies with The Homies Hub NSFW rules.
                    </label>
                </div>

                <DialogFooter>
                    <Button variant="ghost" onClick={onCancel}>Cancel</Button>
                    <Button 
                        variant="destructive" 
                        onClick={onConfirm} 
                        disabled={!isConfirmed}
                    >
                        Confirm NSFW
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
};

const UploadMomentModal = ({ isOpen, onOpenChange }) => {
  const { toast } = useToast();
  const { user } = useAuth();
  const { addReel } = useContent();
  
  const [file, setFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);
  const [title, setTitle] = useState('');
  const [caption, setCaption] = useState('');
  const [hashtags, setHashtags] = useState([]);
  const [currentHashtag, setCurrentHashtag] = useState('');
  const [areTagsExpanded, setAreTagsExpanded] = useState(false);
  
  // Music Selection State
  const [selectedMusic, setSelectedMusic] = useState(null);
  const [isMusicPickerOpen, setIsMusicPickerOpen] = useState(false);
  
  // NSFW State
  const [isNSFW, setIsNSFW] = useState(false);
  const [showNSFWModal, setShowNSFWModal] = useState(false);
  const [nsfwConfirmed, setNsfwConfirmed] = useState(false);

  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [dragActive, setDragActive] = useState(false);
  
  const fileInputRef = useRef(null);

  // Reset state when modal closes
  useEffect(() => {
    if (!isOpen) {
      const timer = setTimeout(() => {
        setFile(null);
        setPreviewUrl(null);
        setTitle('');
        setCaption('');
        setHashtags([]);
        setCurrentHashtag('');
        setAreTagsExpanded(false);
        setUploading(false);
        setProgress(0);
        setSelectedMusic(null);
        setIsNSFW(false);
        setNsfwConfirmed(false);
      }, 300);
      return () => clearTimeout(timer);
    }
  }, [isOpen]);

  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFile(e.dataTransfer.files[0]);
    }
  };

  const handleChange = (e) => {
    e.preventDefault();
    if (e.target.files && e.target.files[0]) {
      handleFile(e.target.files[0]);
    }
  };

  const handleFile = (selectedFile) => {
    if (!selectedFile.type.startsWith('video/')) {
      toast({
        title: "❌ Invalid File Type",
        description: "Please upload a video file (MP4, MOV, etc.).",
        variant: "destructive"
      });
      return;
    }

    if (selectedFile.size > 50 * 1024 * 1024) {
      toast({
        title: "❌ File Too Large",
        description: "Maximum file size is 50MB.",
        variant: "destructive"
      });
      return;
    }

    setFile(selectedFile);
    const url = URL.createObjectURL(selectedFile);
    setPreviewUrl(url);
  };

  const removeFile = () => {
    setFile(null);
    setPreviewUrl(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleHashtagKeyDown = (e) => {
    if (e.key === 'Enter' || e.key === ' ' || e.key === ',') {
      e.preventDefault();
      const tag = currentHashtag.trim().replace(/^#/, '');
      if (tag && !hashtags.includes(tag)) {
        setHashtags([...hashtags, tag]);
        setCurrentHashtag('');
      }
    } else if (e.key === 'Backspace' && !currentHashtag && hashtags.length > 0) {
      setHashtags(hashtags.slice(0, -1));
    }
  };

  const removeHashtag = (tagToRemove) => {
    setHashtags(hashtags.filter(tag => tag !== tagToRemove));
  };

  const handleNSFWToggle = (checked) => {
      if (checked) {
          setShowNSFWModal(true);
      } else {
          setIsNSFW(false);
          setNsfwConfirmed(false);
      }
  };

  const confirmNSFW = () => {
      setIsNSFW(true);
      setNsfwConfirmed(true);
      setShowNSFWModal(false);
  };

  const cancelNSFW = () => {
      setIsNSFW(false);
      setNsfwConfirmed(false);
      setShowNSFWModal(false);
  };

  const handleUpload = async () => {
    if (!file) return;
    if (!title.trim()) {
        toast({
            title: "⚠️ Title Required",
            description: "Please give your Moment a title.",
            variant: "destructive"
        });
        return;
    }
    if (!caption.trim()) {
        toast({
            title: "⚠️ Caption Required",
            description: "Please add a description for your Moment.",
            variant: "destructive"
        });
        return;
    }
    
    if (isNSFW && !nsfwConfirmed) {
        toast({
            title: "⚠️ Confirmation Required",
            description: "Please confirm NSFW rules.",
            variant: "destructive"
        });
        return;
    }

    setUploading(true);
    setProgress(0);

    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 95) {
          clearInterval(interval);
          return 95;
        }
        return prev + Math.random() * 10;
      });
    }, 300);

    try {
        await new Promise(resolve => setTimeout(resolve, 3000));
        
        clearInterval(interval);
        setProgress(100);

        const newReel = {
            id: Math.random().toString(36).substr(2, 9),
            videoUrl: previewUrl,
            title: title,
            description: caption,
            user: {
                name: user.name,
                username: user.username,
                avatar: user.avatar,
                verified: user.verified
            },
            engagement: { likes: 0, comments: 0, shares: 0 },
            tags: hashtags.length > 0 ? hashtags : ['new', 'moment'],
            isNew: true,
            isNSFW: isNSFW,
            music: selectedMusic ? {
                id: selectedMusic.id,
                title: selectedMusic.title,
                artist: selectedMusic.artist,
                cover: selectedMusic.cover
            } : null
        };

        addReel(newReel);

        toast({
            title: "✅ Upload Successful!",
            description: "Your Moment is now live on the Explore feed.",
        });

        onOpenChange(false);

    } catch (error) {
        console.error("Upload failed:", error);
        toast({
            title: "❌ Upload Failed",
            description: "Something went wrong. Please try again.",
            variant: "destructive"
        });
    } finally {
        setUploading(false);
    }
  };

  const displayedHashtags = areTagsExpanded ? hashtags : hashtags.slice(0, 5);
  const hasMoreTags = hashtags.length > 5;

  return (
    <>
      <Dialog open={isOpen} onOpenChange={onOpenChange}>
        <DialogContent className="sm:max-w-lg max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Film className="h-5 w-5 text-primary" />
              Upload Moment
            </DialogTitle>
            <DialogDescription>
              Share your latest adventures with a vertical video.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-5 py-4">
            {!file ? (
              <div 
                className={cn(
                  "border-2 border-dashed rounded-xl p-8 flex flex-col items-center justify-center text-center cursor-pointer transition-colors min-h-[200px]",
                  dragActive ? "border-primary bg-primary/5" : "border-muted hover:border-primary/50 hover:bg-muted/50"
                )}
                onDragEnter={handleDrag}
                onDragLeave={handleDrag}
                onDragOver={handleDrag}
                onDrop={handleDrop}
                onClick={() => fileInputRef.current?.click()}
              >
                <div className="bg-muted rounded-full p-4 mb-4">
                  <Upload className="h-8 w-8 text-muted-foreground" />
                </div>
                <h3 className="font-semibold text-lg mb-1">Drag & drop or click to upload</h3>
                <p className="text-sm text-muted-foreground mb-4">
                  MP4, MOV or WEBM. Vertical format recommended (9:16).
                </p>
                <Button size="sm" variant="secondary">Select File</Button>
                <input 
                  ref={fileInputRef}
                  type="file" 
                  className="hidden" 
                  accept="video/*"
                  onChange={handleChange}
                />
              </div>
            ) : (
              <div className="space-y-4">
                {/* Preview Area */}
                <div className="relative rounded-lg overflow-hidden bg-black aspect-[9/16] max-h-[250px] mx-auto w-full flex items-center justify-center">
                  <video 
                    src={previewUrl} 
                    className="max-h-full max-w-full object-contain"
                    controls 
                  />
                  <Button 
                    size="icon" 
                    variant="destructive" 
                    className="absolute top-2 right-2 h-8 w-8 rounded-full z-10"
                    onClick={removeFile}
                    disabled={uploading}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                  
                  {/* Music Overlay (Preview) */}
                  {selectedMusic && (
                     <div className="absolute bottom-4 left-4 right-4 bg-black/60 backdrop-blur-md rounded-lg p-2 flex items-center gap-3 animate-in fade-in slide-in-from-bottom-2">
                        <div className="h-8 w-8 rounded bg-zinc-800 overflow-hidden shrink-0">
                            <img src={selectedMusic.cover} className="h-full w-full object-cover" alt="Music" />
                        </div>
                        <div className="flex-1 min-w-0">
                             <p className="text-xs font-bold text-white truncate">{selectedMusic.title}</p>
                             <p className="text-[10px] text-zinc-300 truncate">{selectedMusic.artist}</p>
                        </div>
                        <button onClick={() => setSelectedMusic(null)} className="text-zinc-400 hover:text-white p-1">
                            <X className="h-4 w-4" />
                        </button>
                     </div>
                  )}
                </div>

                {/* File Info */}
                <div className="flex items-center gap-2 text-sm text-muted-foreground bg-muted/30 p-2 rounded-md border border-muted">
                  <FileVideo className="h-4 w-4 flex-shrink-0" />
                  <span className="truncate flex-1">{file.name}</span>
                  <span className="whitespace-nowrap">{(file.size / (1024 * 1024)).toFixed(1)} MB</span>
                </div>
                
                <div className="grid gap-4">
                  {/* Title Field */}
                  <div className="space-y-2">
                    <Label htmlFor="title">Title</Label>
                    <Input 
                      id="title"
                      placeholder="Give your Moment a title" 
                      value={title}
                      onChange={(e) => setTitle(e.target.value)}
                      disabled={uploading}
                    />
                  </div>

                  {/* Caption Field */}
                  <div className="space-y-2">
                    <Label htmlFor="caption">Caption</Label>
                    <Textarea 
                      id="caption"
                      placeholder="Write a catchy description..." 
                      value={caption}
                      onChange={(e) => setCaption(e.target.value)}
                      disabled={uploading}
                      rows={3}
                    />
                  </div>
                  
                  {/* Add Audio Button */}
                   <div className="space-y-2">
                        <Label>Audio</Label>
                        <Button 
                            type="button" 
                            variant="outline" 
                            className="w-full justify-start text-muted-foreground hover:text-primary"
                            onClick={() => setIsMusicPickerOpen(true)}
                        >
                            <Music className="mr-2 h-4 w-4" />
                            {selectedMusic ? `${selectedMusic.title} - ${selectedMusic.artist}` : "Add Audio Track"}
                        </Button>
                   </div>

                  {/* Hashtags Field */}
                  <div className="space-y-2">
                    <Label htmlFor="hashtags">Hashtags</Label>
                    <div className="relative">
                      <Hash className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                      <Input 
                        id="hashtags"
                        placeholder="Add tags (press Enter or Space)" 
                        value={currentHashtag}
                        onChange={(e) => setCurrentHashtag(e.target.value)}
                        onKeyDown={handleHashtagKeyDown}
                        disabled={uploading}
                        className="pl-9"
                      />
                    </div>
                    
                    {/* Hashtag Chips */}
                    <div className="flex flex-wrap gap-2 min-h-[2rem] items-start">
                      <AnimatePresence>
                        {displayedHashtags.map((tag) => (
                          <motion.span
                            key={tag}
                            initial={{ opacity: 0, scale: 0.8 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.8 }}
                            className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-primary/10 text-primary text-sm font-medium border border-primary/20"
                          >
                            #{tag}
                            <button
                              type="button"
                              onClick={() => removeHashtag(tag)}
                              className="hover:bg-primary/20 rounded-full p-0.5 transition-colors"
                            >
                              <X className="h-3 w-3" />
                            </button>
                          </motion.span>
                        ))}
                      </AnimatePresence>
                      
                      {hasMoreTags && (
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => setAreTagsExpanded(!areTagsExpanded)}
                          className="h-7 px-2 text-xs"
                        >
                          {areTagsExpanded ? (
                            <span className="flex items-center gap-1">Show Less <ChevronUp className="h-3 w-3" /></span>
                          ) : (
                            <span className="flex items-center gap-1">+{hashtags.length - 5} more <ChevronDown className="h-3 w-3" /></span>
                          )}
                        </Button>
                      )}
                    </div>
                  </div>

                  {/* NSFW Toggle */}
                  <div className="flex items-center justify-between space-x-2 border border-zinc-800 rounded-lg p-3 bg-zinc-900/50">
                      <div className="space-y-0.5">
                          <Label htmlFor="nsfw-mode" className="text-base text-white">NSFW Content</Label>
                          <p className="text-xs text-zinc-400">Mark this post as 18+ content.</p>
                      </div>
                      <Switch 
                          id="nsfw-mode" 
                          checked={isNSFW} 
                          onCheckedChange={handleNSFWToggle}
                      />
                  </div>
                </div>

                {/* Progress Bar */}
                {uploading && (
                  <div className="space-y-2 animate-in fade-in slide-in-from-bottom-2 pt-2">
                    <div className="flex justify-between text-xs font-medium">
                      <span className="text-primary">Uploading...</span>
                      <span>{Math.round(progress)}%</span>
                    </div>
                    <Progress value={progress} className="h-2" />
                  </div>
                )}
              </div>
            )}
          </div>

          <DialogFooter className="gap-2 sm:gap-0">
             {file && !uploading && (
                <Button variant="outline" onClick={removeFile} className="w-full sm:w-auto sm:mr-auto">
                  Change File
                </Button>
             )}
             <div className="flex gap-2 w-full sm:w-auto">
                <Button variant="ghost" onClick={() => onOpenChange(false)} disabled={uploading} className="flex-1 sm:flex-none">
                  Cancel
                </Button>
                <Button onClick={handleUpload} disabled={!file || uploading} className="flex-1 sm:flex-none min-w-[100px]">
                  {uploading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Uploading
                    </>
                  ) : (
                    'Upload Moment'
                  )}
                </Button>
             </div>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      
      <MusicPickerModal 
        isOpen={isMusicPickerOpen} 
        onClose={() => setIsMusicPickerOpen(false)} 
        onSelect={setSelectedMusic} 
        selectedTrack={selectedMusic}
      />

      <NSFWConfirmationModal 
        isOpen={showNSFWModal}
        onConfirm={confirmNSFW}
        onCancel={cancelNSFW}
      />
    </>
  );
};

export default UploadMomentModal;