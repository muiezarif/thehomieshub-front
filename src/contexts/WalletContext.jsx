import React, { createContext, useContext, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';

const WalletContext = createContext();

export const useWallet = () => useContext(WalletContext);

export const WalletProvider = ({ children }) => {
  const [connectedWallet, setConnectedWallet] = useState(null);
  const [isConnecting, setIsConnecting] = useState(false);

  const navigate = useNavigate();
  const location = useLocation();

  const isWalletModeActive = location.pathname.startsWith('/wallet');

  const connectWallet = async (walletType) => {
    setIsConnecting(true);
    return new Promise((resolve) => {
      setTimeout(() => {
        const mockWallet = {
          type: walletType,
          address: '0x71C...9A23',
          chainId: 1,
        };
        setConnectedWallet(mockWallet);
        setIsConnecting(false);
        resolve(mockWallet);
      }, 1200);
    });
  };

  const disconnectWallet = () => setConnectedWallet(null);

  return (
    <WalletContext.Provider
      value={{
        connectedWallet,
        connectWallet,
        disconnectWallet,
        isConnecting,
        enterWalletMode: () => navigate('/wallet'),
        exitWalletMode: () => navigate('/'),
        minimizeWalletMode: () => navigate('/'),
        maximizeWalletMode: () => navigate('/wallet'),
        walletMode: {
          active: isWalletModeActive,
          minimized: false,
        },
      }}
    >
      {children}
    </WalletContext.Provider>
  );
};
