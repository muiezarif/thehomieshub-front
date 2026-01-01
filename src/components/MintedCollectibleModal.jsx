import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { MapPin, ShieldCheck, Clock, Hash, ExternalLink, X, User, Database, Globe } from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';

const MintedCollectibleModal = ({ isOpen, onClose, data }) => {
  if (!data) return null;

  const {
    image,
    video,
    title,
    description,
    creator,
    timestamp,
    location,
    asaId,
    transactionId,
    edition,
    totalEditions,
    isVerifiedLocation
  } = data;

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="max-w-4xl p-0 overflow-hidden bg-zinc-950 border border-primary/20 text-white shadow-[0_0_50px_rgba(234,179,8,0.1)]">
        <div className="flex flex-col md:flex-row h-[85vh] md:h-[600px]">
          
          {/* Media Section */}
          <div className="w-full md:w-1/2 bg-black flex items-center justify-center relative border-b md:border-b-0 md:border-r border-white/10">
             {video ? (
                 <video src={video} className="w-full h-full object-contain" controls autoPlay loop muted />
             ) : (
                 <img src={image} alt={title} className="w-full h-full object-contain" />
             )}
             
             {/* Overlay Badge */}
             <div className="absolute top-4 left-4 z-10">
                 {isVerifiedLocation ? (
                     <Badge className="bg-primary text-black border-primary font-bold flex items-center gap-1 shadow-lg shadow-black/50">
                         <MapPin className="h-3 w-3 fill-current" /> Verified Location
                     </Badge>
                 ) : (
                     <Badge variant="outline" className="bg-black/50 backdrop-blur border-white/30 text-white font-medium flex items-center gap-1">
                         <Database className="h-3 w-3" /> Unverified Mint
                     </Badge>
                 )}
             </div>
          </div>

          {/* Details Section */}
          <div className="w-full md:w-1/2 flex flex-col bg-zinc-900/50">
            <div className="p-6 flex-1 overflow-hidden flex flex-col">
                <div className="flex items-start justify-between mb-4">
                    <div>
                        <h2 className="text-2xl font-bold text-white mb-1">{title}</h2>
                        <div className="flex items-center gap-2 text-sm text-primary">
                            <Hash className="h-4 w-4" />
                            <span>Edition {edition} of {totalEditions}</span>
                        </div>
                    </div>
                    <Button variant="ghost" size="icon" onClick={onClose} className="text-white/50 hover:text-white">
                        <X className="h-6 w-6" />
                    </Button>
                </div>

                <ScrollArea className="flex-1 pr-4">
                    <div className="space-y-6">
                        <div className="p-4 rounded-xl bg-black/40 border border-white/5 space-y-3">
                            <div className="flex items-center justify-between">
                                <span className="text-xs text-muted-foreground uppercase tracking-widest">Creator</span>
                                <div className="flex items-center gap-2">
                                    <Avatar className="h-6 w-6 border border-white/10">
                                        <AvatarImage src={creator.avatar} />
                                        <AvatarFallback>{creator.name[0]}</AvatarFallback>
                                    </Avatar>
                                    <span className="text-sm font-medium text-white">@{creator.username}</span>
                                </div>
                            </div>
                            <Separator className="bg-white/5" />
                            <div className="flex items-center justify-between">
                                <span className="text-xs text-muted-foreground uppercase tracking-widest">Minted</span>
                                <div className="flex items-center gap-2 text-white/80 text-sm">
                                    <Clock className="h-3 w-3" />
                                    <span>{timestamp}</span>
                                </div>
                            </div>
                            {location && (
                                <>
                                <Separator className="bg-white/5" />
                                <div className="flex flex-col gap-2">
                                    <div className="flex items-center justify-between">
                                        <span className="text-xs text-muted-foreground uppercase tracking-widest">Location Data</span>
                                        <span className="text-xs text-primary font-mono">{location.lat.toFixed(4)}, {location.lng.toFixed(4)}</span>
                                    </div>
                                    <div className="text-sm text-right text-white/80">{location.name}</div>
                                </div>
                                </>
                            )}
                        </div>

                        <div className="space-y-2">
                            <h3 className="text-sm font-medium text-white">Description</h3>
                            <p className="text-sm text-muted-foreground leading-relaxed">
                                {description || "No description provided."}
                            </p>
                        </div>

                        <div className="space-y-3">
                            <h3 className="text-sm font-medium text-white">Blockchain Details</h3>
                            <div className="grid grid-cols-1 gap-2">
                                <div className="p-3 rounded-lg bg-black/20 border border-white/5 flex items-center justify-between group cursor-pointer hover:border-primary/30 transition-colors">
                                    <div className="flex items-center gap-3">
                                        <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center text-primary">
                                            <Database className="h-4 w-4" />
                                        </div>
                                        <div className="flex flex-col">
                                            <span className="text-xs text-muted-foreground">Asset ID (ASA)</span>
                                            <span className="text-sm font-mono text-white">{asaId}</span>
                                        </div>
                                    </div>
                                    <ExternalLink className="h-4 w-4 text-white/20 group-hover:text-primary transition-colors" />
                                </div>

                                <div className="p-3 rounded-lg bg-black/20 border border-white/5 flex items-center justify-between group cursor-pointer hover:border-primary/30 transition-colors">
                                    <div className="flex items-center gap-3">
                                        <div className="h-8 w-8 rounded-full bg-blue-500/10 flex items-center justify-center text-blue-400">
                                            <ShieldCheck className="h-4 w-4" />
                                        </div>
                                        <div className="flex flex-col">
                                            <span className="text-xs text-muted-foreground">Transaction ID</span>
                                            <span className="text-sm font-mono text-white truncate max-w-[150px]">{transactionId}</span>
                                        </div>
                                    </div>
                                    <ExternalLink className="h-4 w-4 text-white/20 group-hover:text-blue-400 transition-colors" />
                                </div>
                            </div>
                        </div>
                    </div>
                </ScrollArea>
            </div>
            
            <div className="p-6 border-t border-white/10 bg-black/20">
                <Button className="w-full bg-primary text-black hover:bg-primary/90 font-bold" onClick={() => window.open(`https://algoexplorer.io/asset/${asaId}`, '_blank')}>
                    View on Chain <ExternalLink className="ml-2 h-4 w-4" />
                </Button>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default MintedCollectibleModal;