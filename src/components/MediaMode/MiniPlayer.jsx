import React from 'react';
import { useMedia } from '@/contexts/MediaContext';
import { motion, AnimatePresence } from 'framer-motion';
import { Play, Pause, X, Maximize2, SkipForward } from 'lucide-react';
import { Button } from '@/components/ui/button';

const MiniPlayer = () => {
  const { mediaMode, currentTrack, isPlaying, togglePlay, exitMediaMode, expandMediaMode } = useMedia();

  // Show only if in 'mini' mode AND there is a track
  if (mediaMode !== 'mini' || !currentTrack) return null;

  return (
    <motion.div
      initial={{ y: 100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      exit={{ y: 100, opacity: 0 }}
      className="fixed bottom-4 right-4 z-[90] w-80 bg-zinc-950 border border-zinc-800 rounded-lg shadow-2xl overflow-hidden flex flex-col"
    >
        {/* Video Area (if video) or Art */}
        <div className="relative h-40 bg-black group">
             <img src={currentTrack.cover} alt={currentTrack.title} className="w-full h-full object-cover opacity-60" />
             <div className="absolute inset-0 flex items-center justify-center gap-4">
                 <Button size="icon" variant="ghost" className="rounded-full hover:bg-white/20 text-white" onClick={togglePlay}>
                     {isPlaying ? <Pause className="h-8 w-8 fill-current" /> : <Play className="h-8 w-8 fill-current" />}
                 </Button>
             </div>
             
             {/* Overlay controls */}
             <div className="absolute top-2 right-2 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                <button onClick={expandMediaMode} className="p-1.5 bg-black/60 rounded-full text-white hover:bg-black">
                    <Maximize2 className="h-3 w-3" />
                </button>
                <button onClick={exitMediaMode} className="p-1.5 bg-black/60 rounded-full text-white hover:bg-red-500">
                    <X className="h-3 w-3" />
                </button>
             </div>
        </div>

        {/* Info Area */}
        <div className="p-3 bg-zinc-900 flex items-center justify-between">
            <div className="min-w-0 flex-1 mr-2">
                <h4 className="text-sm font-bold text-white truncate">{currentTrack.title}</h4>
                <p className="text-xs text-zinc-400 truncate">{currentTrack.artist}</p>
            </div>
             <div className="flex gap-1">
                 <button className="text-zinc-400 hover:text-white p-1"><SkipForward className="h-4 w-4" /></button>
             </div>
        </div>
        
        {/* Simple Progress Bar (Fake) */}
        <div className="h-0.5 bg-zinc-800 w-full">
            <div className="h-full bg-red-500 w-1/3 animate-pulse" />
        </div>
    </motion.div>
  );
};

export default MiniPlayer;