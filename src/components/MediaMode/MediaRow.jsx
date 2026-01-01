import React, { useRef, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft, ChevronRight, Play, Plus, ThumbsUp, Check, ChevronDown } from 'lucide-react';
import { useMedia } from '@/contexts/MediaContext';
import { AddToPlaylistModal } from './PlaylistModals';
import { cn } from '@/lib/utils';

// Individual Card Component to handle hover state cleanly without layout shift
const MediaCard = ({ item, isRanked, rank, onPlay }) => {
    const { isLiked, toggleLike } = useMedia();
    const [isHovered, setIsHovered] = useState(false);
    const [isAddToPlaylistOpen, setIsAddToPlaylistOpen] = useState(false);
    
    // Timer to delay the hover expansion so it doesn't trigger on fast scroll
    const hoverTimeout = useRef(null);

    const handleMouseEnter = () => {
        hoverTimeout.current = setTimeout(() => setIsHovered(true), 400);
    };

    const handleMouseLeave = () => {
        if (hoverTimeout.current) clearTimeout(hoverTimeout.current);
        setIsHovered(false);
    };

    return (
        <div 
            className={cn("relative flex-none transition-all duration-300", isRanked ? "w-[240px] md:w-[280px]" : "w-[200px] md:w-[240px]")}
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
        >
            {/* RANK NUMBER (Optional) */}
            {isRanked && (
                <span className="absolute -left-4 bottom-0 text-[100px] font-black text-black text-stroke-white leading-[0.8] z-0 select-none opacity-50">
                    {rank}
                </span>
            )}

            {/* STATIC CARD */}
            <div className="relative aspect-video bg-zinc-800 rounded-sm overflow-hidden cursor-pointer" onClick={() => onPlay(item)}>
                <img 
                    src={item.cover} 
                    alt={item.title} 
                    className="w-full h-full object-cover" 
                    loading="lazy"
                    onError={(e) => e.target.src = "https://images.unsplash.com/photo-1516280440614-6697288d5d38"}
                />
                <div className="absolute inset-0 bg-black/10" />
                <div className="absolute bottom-2 right-2 px-1 py-0.5 bg-black/70 text-white text-[10px] font-bold rounded-sm">
                    {item.duration}
                </div>
                {/* Title overlay always visible on static for clarity if no hover */}
                {!isHovered && (
                     <div className="absolute bottom-0 left-0 right-0 p-2 bg-gradient-to-t from-black/90 to-transparent">
                         <p className="text-xs text-white font-bold truncate">{item.title}</p>
                     </div>
                )}
            </div>

            {/* EXPANDED HOVER CARD (Portal-like absolute positioning) */}
            <AnimatePresence>
                {isHovered && (
                    <motion.div 
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1.15 }}
                        exit={{ opacity: 0, scale: 0.9, transition: { duration: 0.2 } }}
                        transition={{ duration: 0.3 }}
                        className="absolute top-[-20%] left-[-7.5%] w-[115%] z-50 shadow-2xl bg-[#181818] rounded-md overflow-hidden ring-1 ring-white/10"
                    >
                        <div className="relative aspect-video cursor-pointer" onClick={() => onPlay(item)}>
                            {item.videoUrl ? (
                                <video src={item.videoUrl} className="w-full h-full object-cover" autoPlay muted loop playsInline />
                            ) : (
                                <img src={item.cover} className="w-full h-full object-cover" />
                            )}
                            <div className="absolute bottom-2 left-2 px-1 bg-black/60 text-white text-[9px] font-bold rounded">HD</div>
                        </div>

                        <div className="p-3 flex flex-col gap-2">
                            <div className="flex items-center justify-between">
                                <div className="flex gap-2">
                                    <button 
                                        onClick={(e) => { e.stopPropagation(); onPlay(item); }}
                                        className="bg-white rounded-full p-1.5 hover:bg-white/90 transition-colors"
                                    >
                                        <Play className="h-4 w-4 fill-black text-black" />
                                    </button>
                                    <button 
                                        onClick={(e) => { e.stopPropagation(); toggleLike(item); }}
                                        className="border-2 border-zinc-500 rounded-full p-1.5 hover:border-white hover:text-white text-zinc-400 transition-colors"
                                    >
                                        {isLiked(item.id) ? <Check className="h-4 w-4" /> : <ThumbsUp className="h-4 w-4" />}
                                    </button>
                                    <button 
                                        onClick={(e) => { e.stopPropagation(); setIsAddToPlaylistOpen(true); }}
                                        className="border-2 border-zinc-500 rounded-full p-1.5 hover:border-white hover:text-white text-zinc-400 transition-colors"
                                    >
                                        <Plus className="h-4 w-4" />
                                    </button>
                                </div>
                                <button className="border-2 border-zinc-500 rounded-full p-1.5 hover:border-white hover:text-white text-zinc-400">
                                    <ChevronDown className="h-4 w-4" />
                                </button>
                            </div>

                            <div>
                                <h4 className="text-sm font-bold text-white line-clamp-1">{item.title}</h4>
                                <div className="flex items-center gap-2 mt-1">
                                    <span className="text-[10px] text-green-400 font-semibold">98% Match</span>
                                    <span className="text-[10px] border border-zinc-600 px-1 rounded text-zinc-400">16+</span>
                                    <span className="text-[10px] text-zinc-400">{item.duration}</span>
                                </div>
                                <div className="flex flex-wrap gap-1 mt-2">
                                    {item.tags?.slice(0,3).map(tag => (
                                        <span key={tag} className="text-[9px] text-zinc-400 flex items-center">
                                            <span className="w-1 h-1 bg-zinc-600 rounded-full mr-1" />
                                            {tag}
                                        </span>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
            <AddToPlaylistModal isOpen={isAddToPlaylistOpen} onClose={() => setIsAddToPlaylistOpen(false)} mediaToAdd={item} />
        </div>
    );
};

const MediaRow = ({ title, items, isRanked = false }) => {
  const rowRef = useRef(null);
  const { playMedia } = useMedia();
  const [showLeftArrow, setShowLeftArrow] = useState(false);

  const scroll = (direction) => {
    if (rowRef.current) {
      const { scrollLeft, clientWidth } = rowRef.current;
      const scrollTo = direction === 'left' ? scrollLeft - clientWidth + 200 : scrollLeft + clientWidth - 200;
      rowRef.current.scrollTo({ left: scrollTo, behavior: 'smooth' });
    }
  };

  const handleScroll = () => {
      if (rowRef.current) {
          setShowLeftArrow(rowRef.current.scrollLeft > 0);
      }
  };

  if (!items || items.length === 0) return null;

  return (
    <div className="mb-8 relative group/row">
      <h2 className="text-xl md:text-2xl font-bold text-gray-100 mb-3 px-1 transition-colors hover:text-white cursor-pointer inline-flex items-center gap-2">
        {title}
        <ChevronRight className="h-4 w-4 opacity-0 group-hover/row:opacity-100 transition-opacity text-cyan-400" />
      </h2>
      
      <div className="relative group">
          {/* Left Arrow */}
          <button 
            className={cn(
                "absolute left-0 top-0 bottom-0 z-40 bg-black/60 w-12 flex items-center justify-center transition-all duration-300 hover:bg-black/80",
                showLeftArrow ? "opacity-0 group-hover:opacity-100 translate-x-0" : "opacity-0 -translate-x-full pointer-events-none"
            )}
            onClick={() => scroll('left')}
          >
              <ChevronLeft className="h-8 w-8 text-white scale-125" />
          </button>

          {/* Scroll Container */}
          <div 
            ref={rowRef}
            onScroll={handleScroll}
            className="flex gap-2 overflow-x-auto scrollbar-hide scroll-smooth pb-8 pt-4 px-1 -ml-1" // Added padding top/bottom for hover expansion space
            style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
          >
            {items.map((item, index) => (
               <MediaCard 
                    key={item.id} 
                    item={item} 
                    isRanked={isRanked} 
                    rank={index + 1}
                    onPlay={playMedia}
               />
            ))}
          </div>

          {/* Right Arrow */}
          <button 
            className="absolute right-0 top-0 bottom-0 z-40 bg-black/60 w-12 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity hover:bg-black/80"
            onClick={() => scroll('right')}
          >
              <ChevronRight className="h-8 w-8 text-white scale-125" />
          </button>
      </div>
    </div>
  );
};

export default MediaRow;