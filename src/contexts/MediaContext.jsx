import React, { createContext, useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { mockCommunityPosts } from '@/data/mockCommunityPosts';

const MediaContext = createContext();

export const useMedia = () => useContext(MediaContext);

export const MediaProvider = ({ children }) => {
  const navigate = useNavigate();
  const [currentTrack, setCurrentTrack] = useState(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isFullscreenPlayer, setIsFullscreenPlayer] = useState(false);
  const [activeCategory, setActiveCategory] = useState('home');
  const [playlists, setPlaylists] = useState([]);
  const [likedMediaIds, setLikedMediaIds] = useState([]);
  const [showWarning, setShowWarning] = useState(false);

  // Reliable fallback data with high-quality images to prevent broken thumbnails
  const fallbackVideos = [
    {
      id: 'fallback-1',
      title: 'Neon Nights in Tokyo',
      artist: 'Cyberpunk Vibes',
      cover: 'https://images.unsplash.com/photo-1540959733332-eab4deabeeaf?w=800&q=80',
      videoUrl: 'https://assets.mixkit.co/videos/preview/mixkit-neon-lights-in-the-city-at-night-1454-large.mp4',
      duration: '3:15',
      type: 'video',
      tags: ['Electronic', 'Vibes']
    },
    {
      id: 'fallback-2',
      title: 'Ocean Drive',
      artist: 'Summer Sounds',
      cover: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=800&q=80',
      videoUrl: 'https://assets.mixkit.co/videos/preview/mixkit-waves-in-the-water-1164-large.mp4',
      duration: '4:20',
      type: 'video',
      tags: ['Chill', 'Summer']
    },
    {
      id: 'fallback-3',
      title: 'Urban Flow',
      artist: 'City Beats',
      cover: 'https://images.unsplash.com/photo-1477959858617-67f85cf4f1df?w=800&q=80',
      videoUrl: 'https://assets.mixkit.co/videos/preview/mixkit-traffic-in-an-underground-tunnel-4357-large.mp4',
      duration: '2:45',
      type: 'video',
      tags: ['Urban', 'Flow']
    },
    {
        id: 'fallback-4',
        title: 'Mountain Echoes',
        artist: 'Nature Lo-Fi',
        cover: 'https://images.unsplash.com/photo-1519681393784-d120267933ba?w=800&q=80',
        videoUrl: 'https://assets.mixkit.co/videos/preview/mixkit-stars-in-space-1610-large.mp4',
        duration: '5:10',
        type: 'video',
        tags: ['Ambient', 'Focus']
    }
  ];

  // Map community posts to media items, prioritizing valid images
  let mappedVideos = (mockCommunityPosts || [])
    .filter(p => p.type === 'video' || p.type === 'clip' || p.type === 'mint')
    .map(p => {
        // Determine the best available image source
        let coverImage = p.thumbnail || p.content?.video || p.content?.image || p.mintData?.image;
        
        // If no image or if it's a blob/local path that might be broken in this context, use a random fallback
        if (!coverImage || coverImage.startsWith('blob:') || coverImage.length < 10) {
             coverImage = fallbackVideos[Math.floor(Math.random() * fallbackVideos.length)].cover;
        }

        return {
            id: p.id,
            title: p.content?.text?.slice(0, 40) || p.content?.title || p.mintData?.title || "Untitled Video",
            artist: p.user?.name || "Unknown Artist",
            cover: coverImage,
            videoUrl: p.videoUrl || p.content?.video || fallbackVideos[0].videoUrl,
            duration: "3:45", // Mock duration
            type: 'video',
            tags: ['Music', 'Trending']
        };
    });

  // Combine real (mapped) data with fallbacks to ensure the UI is populated
  const popularVideos = [...mappedVideos, ...fallbackVideos];
  
  // Create derived lists
  const newReleases = [...popularVideos].reverse();
  const likedMedia = [...popularVideos].filter(item => likedMediaIds.includes(item.id));

  const enterMediaMode = () => setShowWarning(true);
  const confirmEnterMediaMode = () => { setShowWarning(false); navigate('/media'); };
  const cancelEnterMediaMode = () => setShowWarning(false);
  const exitMediaMode = () => navigate('/');
  const minimizeMediaMode = () => navigate('/'); 
  const expandMediaMode = () => navigate('/media');

  const playMedia = (media) => {
      if(!media) return;
      setCurrentTrack(media);
      setIsPlaying(true);
      setIsFullscreenPlayer(true);
  };

  const togglePlay = () => setIsPlaying(!isPlaying);
  const closeFullscreen = () => setIsFullscreenPlayer(false);
  
  const createPlaylist = (name, image) => setPlaylists([...playlists, { id: Date.now(), name, image, items: [] }]);
  const deletePlaylist = (id) => setPlaylists(playlists.filter(p => p.id !== id));
  const addToPlaylist = (playlistId, item) => {
      setPlaylists(playlists.map(p => p.id === playlistId ? { ...p, items: [...p.items, item] } : p));
  };

  const toggleLike = (item) => {
      setLikedMediaIds(prev => prev.includes(item.id) ? prev.filter(id => id !== item.id) : [...prev, item.id]);
  };
  const isLiked = (id) => likedMediaIds.includes(id);

  return (
    <MediaContext.Provider value={{
      showWarning, enterMediaMode, confirmEnterMediaMode, cancelEnterMediaMode, exitMediaMode,
      minimizeMediaMode, expandMediaMode, currentTrack, setCurrentTrack, isPlaying, togglePlay,
      isFullscreenPlayer, closeFullscreen, activeCategory, setActiveCategory, playMedia,
      popularVideos, newReleases, playlists, createPlaylist, deletePlaylist, addToPlaylist,
      toggleLike, isLiked, likedMedia
    }}>
      {children}
    </MediaContext.Provider>
  );
};