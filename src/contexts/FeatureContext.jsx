import React, { createContext, useContext, useState, useEffect } from 'react';
import { useAuth } from './AuthContext';

const FeatureContext = createContext();

export const useFeatures = () => {
  const context = useContext(FeatureContext);
  if (!context) {
    throw new Error('useFeatures must be used within a FeatureProvider');
  }
  return context;
};

const defaultGlobalFeatures = {
  messaging: { id: 'messaging', name: 'Messaging', status: 'active', message: 'Messaging is currently undergoing maintenance.' },
  wallet: { id: 'wallet', name: 'Wallet', status: 'active', message: 'Wallet features are temporarily disabled.' },
  live_streaming: { id: 'live_streaming', name: 'Live Streaming', status: 'active', message: 'Live streaming is restricted at this time.' },
  create_post: { id: 'create_post', name: 'Create Post', status: 'active', message: 'Posting is paused for server upgrades.' },
  explore: { id: 'explore', name: 'Explore Page', status: 'active', message: 'Explore page is hidden.' },
  search: { id: 'search', name: 'Search', status: 'active', message: 'Search functionality is offline.' },
  library: { id: 'library', name: 'Library', status: 'active', message: 'Library is currently unavailable.' },
  my_ai: { id: 'my_ai', name: 'My AI', status: 'active', message: 'AI features are being updated.' },
};

export const FeatureProvider = ({ children }) => {
  const { user } = useAuth();
  
  // State for global feature flags
  const [globalFeatures, setGlobalFeatures] = useState(() => {
    const saved = localStorage.getItem('homies_global_features');
    return saved ? JSON.parse(saved) : defaultGlobalFeatures;
  });

  // State for per-user restrictions: { username: { featureId: 'hidden' | 'blurred' } }
  const [userRestrictions, setUserRestrictions] = useState(() => {
    const saved = localStorage.getItem('homies_user_restrictions');
    return saved ? JSON.parse(saved) : {};
  });

  useEffect(() => {
    localStorage.setItem('homies_global_features', JSON.stringify(globalFeatures));
  }, [globalFeatures]);

  useEffect(() => {
    localStorage.setItem('homies_user_restrictions', JSON.stringify(userRestrictions));
  }, [userRestrictions]);

  // Admin function to update global feature
  const updateGlobalFeature = (featureId, updates) => {
    setGlobalFeatures(prev => ({
      ...prev,
      [featureId]: { ...prev[featureId], ...updates }
    }));
  };

  // Admin function to update user restriction
  const updateUserRestriction = (username, featureId, status) => {
    setUserRestrictions(prev => {
      const userRes = prev[username] || {};
      if (status === 'active') {
        // Remove restriction if setting to active
        const { [featureId]: removed, ...rest } = userRes;
        return { ...prev, [username]: rest };
      }
      return {
        ...prev,
        [username]: { ...userRes, [featureId]: status }
      };
    });
  };

  // Check if a feature is allowed for the current user (or specific user if passed)
  const checkAccess = (featureId, specificUsername = null) => {
    const feature = globalFeatures[featureId];
    if (!feature) return { allowed: true, status: 'active', message: '' };

    // 1. Check Global Status
    if (feature.status !== 'active') {
      return { 
        allowed: false, 
        status: feature.status, // 'hidden' or 'blurred'
        message: feature.message 
      };
    }

    // 2. Check User Restriction
    const usernameToCheck = specificUsername || user?.username;
    if (usernameToCheck) {
      const restrictions = userRestrictions[usernameToCheck];
      if (restrictions && restrictions[featureId]) {
        return {
          allowed: false,
          status: restrictions[featureId],
          message: 'This feature has been restricted for your account.'
        };
      }
    }

    return { allowed: true, status: 'active', message: '' };
  };

  const value = {
    globalFeatures,
    userRestrictions,
    updateGlobalFeature,
    updateUserRestriction,
    checkAccess,
    featureList: Object.values(globalFeatures),
  };

  return (
    <FeatureContext.Provider value={value}>
      {children}
    </FeatureContext.Provider>
  );
};