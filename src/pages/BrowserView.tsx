
import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { MenuProvider } from '@/contexts/MenuContext';
import { WalletProvider } from '@/contexts/WalletContext';
import Header from '@/components/Header';
import { ArrowLeft, ArrowRight, RefreshCcw, Home, X } from 'lucide-react';
import { Button } from '@/components/ui/button';

const BrowserView: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [url, setUrl] = useState<string>('https://www.coindesk.com/');
  const [inputUrl, setInputUrl] = useState<string>('https://www.coindesk.com/');
  const [isLoading, setIsLoading] = useState<boolean>(true);

  // Get URL from state if available
  useEffect(() => {
    if (location.state && location.state.url) {
      setUrl(location.state.url);
      setInputUrl(location.state.url);
    }
  }, [location]);

  const handleGoBack = () => {
    navigate(-1);
  };

  const handleNavigate = () => {
    setIsLoading(true);
    setUrl(inputUrl.startsWith('http') ? inputUrl : `https://${inputUrl}`);
  };

  const handleRefresh = () => {
    setIsLoading(true);
    setUrl(url);
  };

  const handleGoHome = () => {
    navigate('/wallet');
  };

  const handleLoad = () => {
    setIsLoading(false);
  };

  return (
    <div className="min-h-screen bg-wallet-darkBg flex justify-center w-full">
      <div className="w-full max-w-md mx-auto min-h-screen shadow-lg bg-wallet-darkBg flex flex-col">
        <MenuProvider>
          <WalletProvider>
            <Header title="Browser" />
            
            <div className="bg-gray-900 p-2 border-b border-gray-800">
              <div className="flex items-center space-x-2">
                <Button 
                  variant="ghost" 
                  size="icon" 
                  className="text-gray-400 hover:text-white"
                  onClick={handleGoBack}
                >
                  <ArrowLeft className="h-4 w-4" />
                </Button>
                <Button 
                  variant="ghost" 
                  size="icon" 
                  className="text-gray-400 hover:text-white"
                  onClick={handleRefresh}
                >
                  <RefreshCcw className={`h-4 w-4 ${isLoading ? 'animate-spin' : ''}`} />
                </Button>
                <div className="flex-1 flex items-center bg-gray-800 rounded-md px-2 py-1">
                  <input
                    className="bg-transparent border-none focus:outline-none w-full text-sm text-white"
                    value={inputUrl}
                    onChange={(e) => setInputUrl(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && handleNavigate()}
                  />
                  {inputUrl && (
                    <Button 
                      variant="ghost" 
                      size="icon" 
                      className="h-6 w-6 text-gray-400 hover:text-white"
                      onClick={() => setInputUrl('')}
                    >
                      <X className="h-3 w-3" />
                    </Button>
                  )}
                </div>
                <Button 
                  variant="ghost" 
                  size="icon" 
                  className="text-gray-400 hover:text-white"
                  onClick={handleGoHome}
                >
                  <Home className="h-4 w-4" />
                </Button>
              </div>
            </div>
            
            <div className="flex-1 bg-white">
              {isLoading && (
                <div className="absolute inset-0 flex items-center justify-center bg-gray-900 bg-opacity-50 z-10">
                  <RefreshCcw className="h-8 w-8 text-wallet-green animate-spin" />
                </div>
              )}
              <iframe 
                src={url} 
                className="w-full h-full border-none"
                onLoad={handleLoad}
                title="In-app browser"
                sandbox="allow-same-origin allow-scripts allow-popups allow-forms"
              />
            </div>
          </WalletProvider>
        </MenuProvider>
      </div>
    </div>
  );
};

export default BrowserView;
