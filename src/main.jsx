import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import App from '@/App';
import '@/styles/homies-theme.css';
import '@/index.css';
import { AuthProvider } from '@/contexts/AuthContext';
import { WalletProvider } from '@/contexts/WalletContext';
import { ContentProvider } from '@/contexts/ContentContext';
import { MediaProvider } from '@/contexts/MediaContext';
import { MessageProvider } from '@/contexts/MessageContext';
import { FeatureProvider } from '@/contexts/FeatureContext';

ReactDOM.createRoot(document.getElementById('root')).render(
  <>
    <BrowserRouter>
      <AuthProvider>
        <WalletProvider>
          <ContentProvider>
            <MediaProvider>
              <MessageProvider>
                <FeatureProvider>
                  <App />
                </FeatureProvider>
              </MessageProvider>
            </MediaProvider>
          </ContentProvider>
        </WalletProvider>
      </AuthProvider>
    </BrowserRouter>
  </>
);