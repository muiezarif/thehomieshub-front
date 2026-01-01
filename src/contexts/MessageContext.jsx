import React, { createContext, useContext, useState, useEffect } from 'react';
import { useAuth } from './AuthContext';
import { mockUsers } from '@/data/mockUsers';

const MessageContext = createContext();

export const useMessages = () => {
  const context = useContext(MessageContext);
  if (!context) {
    throw new Error('useMessages must be used within a MessageProvider');
  }
  return context;
};

export const MessageProvider = ({ children }) => {
  const { user } = useAuth();
  const [threads, setThreads] = useState([]);
  const [requests, setRequests] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  // Load messages from local storage
  useEffect(() => {
    if (user) {
      const storedThreads = localStorage.getItem(`homies_threads_${user.username}`);
      const storedRequests = localStorage.getItem(`homies_requests_${user.username}`);
      
      if (storedThreads) setThreads(JSON.parse(storedThreads));
      else {
        // Initial mock data for demonstration
        const mockThread = [
           {
             id: 't1',
             participants: ['alexnomad'],
             muted: false,
             archived: false,
             lastMessage: { content: 'Hey, loved your latest video!', sender: 'alexnomad', timestamp: new Date(Date.now() - 3600000).toISOString(), read: false, type: 'text' },
             messages: [
                { id: 'm1', content: 'Hey, loved your latest video!', sender: 'alexnomad', timestamp: new Date(Date.now() - 3600000).toISOString(), type: 'text' }
             ],
             updatedAt: new Date(Date.now() - 3600000).toISOString()
           }
        ];
        setThreads(mockThread);
      }

      if (storedRequests) setRequests(JSON.parse(storedRequests));
      else {
         // Mock request
         const mockReq = [
            {
             id: 'r1',
             participants: ['unknown_user'],
             muted: false,
             archived: false,
             lastMessage: { content: 'Can we collab?', sender: 'unknown_user', timestamp: new Date(Date.now() - 86400000).toISOString(), read: false, type: 'text' },
             messages: [
                { id: 'm2', content: 'Can we collab?', sender: 'unknown_user', timestamp: new Date(Date.now() - 86400000).toISOString(), type: 'text' }
             ],
             updatedAt: new Date(Date.now() - 86400000).toISOString()
            }
         ];
         setRequests(mockReq);
      }
    }
  }, [user]);

  // Persist to local storage
  useEffect(() => {
    if (user) {
      localStorage.setItem(`homies_threads_${user.username}`, JSON.stringify(threads));
      localStorage.setItem(`homies_requests_${user.username}`, JSON.stringify(requests));
    }
  }, [threads, requests, user]);

  const sendMessage = (recipientUsername, content, type = 'text', attachment = null) => {
    const newMessage = {
      id: `msg_${Date.now()}`,
      content,
      sender: user.username,
      timestamp: new Date().toISOString(),
      read: true, // Sender always reads their own message
      type,
      // Handle legacy 'mediaUrl' by mapping attachment to it if needed by older components, 
      // but prefer 'attachment' prop for clarity on new types
      attachment: attachment, 
      mediaUrl: typeof attachment === 'string' ? attachment : null 
    };

    setThreads(prev => {
      // Check if thread exists
      const existingThreadIndex = prev.findIndex(t => t.participants.includes(recipientUsername));
      
      if (existingThreadIndex >= 0) {
        const updatedThreads = [...prev];
        const thread = { ...updatedThreads[existingThreadIndex] }; // Shallow copy
        thread.messages = [...thread.messages, newMessage]; // Create new array for messages
        thread.lastMessage = newMessage;
        thread.updatedAt = new Date().toISOString();
        thread.archived = false; // Unarchive on new message
        
        // Move to top
        updatedThreads.splice(existingThreadIndex, 1);
        updatedThreads.unshift(thread);
        return updatedThreads;
      } else {
        // Create new thread
        const newThread = {
          id: `thread_${Date.now()}`,
          participants: [recipientUsername],
          lastMessage: newMessage,
          messages: [newMessage],
          updatedAt: new Date().toISOString(),
          muted: false,
          archived: false
        };
        return [newThread, ...prev];
      }
    });
  };

  const getThread = (username) => {
    return threads.find(t => t.participants.includes(username));
  };
  
  const createThread = (username) => {
      const existing = getThread(username);
      if (existing) return existing;
      
      return {
          id: 'temp',
          participants: [username],
          messages: [],
          lastMessage: null,
          muted: false,
          archived: false
      }
  }

  const acceptRequest = (requestId) => {
    const request = requests.find(r => r.id === requestId);
    if (request) {
      setThreads(prev => [request, ...prev]);
      setRequests(prev => prev.filter(r => r.id !== requestId));
    }
  };

  const archiveRequest = (requestId) => {
    setRequests(prev => prev.filter(r => r.id !== requestId));
  };

  const searchUsers = (query) => {
    if (!query) return [];
    return Object.values(mockUsers).filter(u => 
      u.username.toLowerCase().includes(query.toLowerCase()) || 
      u.name.toLowerCase().includes(query.toLowerCase())
    ).filter(u => u.username !== user?.username);
  };
  
  const markAsRead = (threadId) => {
      setThreads(prev => prev.map(t => {
          if (t.id === threadId) {
              return { ...t, lastMessage: { ...t.lastMessage, read: true }};
          }
          return t;
      }))
  }

  const muteThread = (threadId, muted) => {
      setThreads(prev => prev.map(t => t.id === threadId ? { ...t, muted } : t));
  };

  const archiveThread = (threadId) => {
      setThreads(prev => prev.map(t => t.id === threadId ? { ...t, archived: true } : t));
  };

  const deleteThread = (threadId) => {
      setThreads(prev => prev.filter(t => t.id !== threadId));
  };

  const value = {
    threads,
    requests,
    sendMessage,
    getThread,
    createThread,
    acceptRequest,
    archiveRequest,
    searchUsers,
    markAsRead,
    muteThread,
    archiveThread,
    deleteThread
  };

  return (
    <MessageContext.Provider value={value}>
      {children}
    </MessageContext.Provider>
  );
};