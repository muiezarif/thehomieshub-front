import React, { createContext, useContext, useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';

const WalletContext = createContext();

export const useWallet = () => useContext(WalletContext);

export const WalletProvider = ({ children }) => {
  const [balance, setBalance] = useState(1250); // Mock initial balance
  const [connectedWallet, setConnectedWallet] = useState(null);
  const [isConnecting, setIsConnecting] = useState(false);
  
  const navigate = useNavigate();
  const location = useLocation();

  // Helper to check if we are currently in wallet routes
  const isWalletModeActive = location.pathname.startsWith('/wallet');

  // Load from local storage on mount
  useEffect(() => {
    const storedBalance = localStorage.getItem('homies_wallet_balance');
    const storedWallet = localStorage.getItem('homies_connected_wallet');
    
    if (storedBalance) setBalance(parseInt(storedBalance));
    if (storedWallet) setConnectedWallet(JSON.parse(storedWallet));
  }, []);

  // Save to local storage on change
  useEffect(() => {
    localStorage.setItem('homies_wallet_balance', balance.toString());
  }, [balance]);

  const addPoints = (amount) => {
    setBalance(prev => prev + amount);
  };

  const spendPoints = (amount) => {
    if (balance >= amount) {
      setBalance(prev => prev - amount);
      return true;
    }
    return false;
  };
  
  const connectWallet = async (walletType) => {
      setIsConnecting(true);
      return new Promise((resolve) => {
          setTimeout(() => {
              const mockWallet = {
                  type: walletType,
                  address: '0x71C...9A23', // Mock address
                  chainId: 1
              };
              setConnectedWallet(mockWallet);
              localStorage.setItem('homies_connected_wallet', JSON.stringify(mockWallet));
              setIsConnecting(false);
              resolve(mockWallet);
          }, 1500);
      });
  };

  const disconnectWallet = () => {
      setConnectedWallet(null);
      localStorage.removeItem('homies_connected_wallet');
  };

  const enterWalletMode = () => {
    navigate('/wallet');
  };

  const exitWalletMode = () => {
    navigate('/');
  };

  const minimizeWalletMode = () => {
      navigate('/');
  };

  const maximizeWalletMode = () => {
      navigate('/wallet');
  };

  return (
    <WalletContext.Provider value={{
      balance,
      addPoints,
      spendPoints,
      connectedWallet,
      connectWallet,
      disconnectWallet,
      isConnecting,
      enterWalletMode,
      exitWalletMode,
      minimizeWalletMode,
      maximizeWalletMode,
      // We expose a "fake" object to keep component compatibility minimal
      walletMode: {
          active: isWalletModeActive,
          minimized: false 
      }
    }}>
      {children}
    </WalletContext.Provider>
  );
};