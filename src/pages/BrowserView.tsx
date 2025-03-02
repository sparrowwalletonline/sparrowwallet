
import React, { useState, useEffect, useRef } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { MenuProvider } from '@/contexts/MenuContext';
import { WalletProvider } from '@/contexts/WalletContext';
import Header from '@/components/Header';
import { ArrowLeft, ArrowRight, RefreshCcw, Home, X, AlertTriangle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { toast } from '@/components/ui/use-toast';

const BrowserView: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [url, setUrl] = useState<string>('https://www.coingecko.com/');
  const [inputUrl, setInputUrl] = useState<string>('https://www.coingecko.com/');
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const loadTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Get URL from state if available
  useEffect(() => {
    if (location.state && location.state.url) {
      setUrl(location.state.url);
      setInputUrl(location.state.url);
    }
  }, [location]);

  // Set up load timeout to detect CSP/X-Frame-Options blocks
  useEffect(() => {
    if (isLoading) {
      // Clear any existing timeout
      if (loadTimeoutRef.current) {
        clearTimeout(loadTimeoutRef.current);
      }
      
      // Set a timeout to check if the iframe loaded within 5 seconds
      loadTimeoutRef.current = setTimeout(() => {
        // If we're still loading after 5 seconds, it's likely blocked
        if (isLoading) {
          setIsLoading(false);
          handleFrameBlocked();
        }
      }, 5000);
    }
    
    return () => {
      if (loadTimeoutRef.current) {
        clearTimeout(loadTimeoutRef.current);
      }
    };
  }, [isLoading, url]);

  const handleFrameBlocked = () => {
    setError(`${new URL(url).hostname} refused to connect. This website likely blocks embedding in iframes.`);
    toast({
      title: "Connection Blocked",
      description: "This website doesn't allow being displayed in our browser. Try a crypto-friendly site instead.",
      variant: "destructive",
    });
  };

  const handleGoBack = () => {
    navigate(-1);
  };

  const handleGoForward = () => {
    navigate(1);
  };

  const handleNavigate = () => {
    setIsLoading(true);
    setError(null);
    // Format URL with https:// if not present
    const formattedUrl = inputUrl.startsWith('http') ? inputUrl : `https://${inputUrl}`;
    setUrl(formattedUrl);
  };

  const handleRefresh = () => {
    setIsLoading(true);
    setError(null);
    // Force refresh by setting to blank and then back
    const currentUrl = url;
    setUrl('about:blank');
    setTimeout(() => setUrl(currentUrl), 100);
  };

  const handleGoHome = () => {
    navigate('/wallet');
  };

  const handleLoad = () => {
    // Clear any loading timeout
    if (loadTimeoutRef.current) {
      clearTimeout(loadTimeoutRef.current);
    }
    
    setIsLoading(false);
    setError(null);
    
    // Check if iframe actually loaded content or was blocked
    try {
      if (iframeRef.current) {
        // This will throw an error if the iframe is blocked by CSP
        const iframeDoc = iframeRef.current.contentDocument || iframeRef.current.contentWindow?.document;
        
        // If we can't access the document, it was likely blocked
        if (!iframeDoc) {
          handleFrameBlocked();
        }
      }
    } catch (e) {
      // If we get an error trying to access the iframe content, it was blocked
      handleFrameBlocked();
    }
  };

  const handleError = () => {
    if (loadTimeoutRef.current) {
      clearTimeout(loadTimeoutRef.current);
    }
    
    setIsLoading(false);
    setError(`Could not load ${url}. The website may be blocking embedding or is unavailable.`);
    toast({
      title: "Connection Error",
      description: "The website refused to connect. Try a different URL.",
      variant: "destructive",
    });
  };

  // Safe crypto websites that are known to work in iframes
  const recommendedSites = [
    { name: "CoinGecko", url: "https://www.coingecko.com/" },
    { name: "Etherscan", url: "https://etherscan.io/" },
    { name: "DEXTools", url: "https://www.dextools.io/" },
    { name: "DeFiLlama", url: "https://defillama.com/" }
  ];

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
                  onClick={handleGoForward}
                >
                  <ArrowRight className="h-4 w-4" />
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
            
            <div className="flex-1 bg-white relative">
              {isLoading && (
                <div className="absolute inset-0 flex items-center justify-center bg-gray-900 bg-opacity-50 z-10">
                  <RefreshCcw className="h-8 w-8 text-wallet-green animate-spin" />
                </div>
              )}
              
              {error && (
                <div className="absolute inset-0 flex items-center justify-center bg-gray-900 bg-opacity-90 z-10 p-4">
                  <div className="bg-gray-800 p-6 rounded-lg max-w-sm text-center">
                    <div className="flex justify-center mb-4">
                      <AlertTriangle className="h-10 w-10 text-yellow-500" />
                    </div>
                    <h3 className="text-lg font-semibold text-white mb-2">Connection Blocked</h3>
                    <p className="text-gray-300 mb-4">{error}</p>
                    
                    <div className="mb-4">
                      <h4 className="text-sm font-medium text-gray-400 mb-2">Try these crypto-friendly sites:</h4>
                      <div className="grid grid-cols-2 gap-2">
                        {recommendedSites.map((site) => (
                          <Button 
                            key={site.url}
                            variant="secondary" 
                            className="text-xs" 
                            onClick={() => {
                              setUrl(site.url);
                              setInputUrl(site.url);
                              setError(null);
                              setIsLoading(true);
                            }}
                          >
                            {site.name}
                          </Button>
                        ))}
                      </div>
                    </div>
                    
                    <Button variant="outline" onClick={handleGoHome} className="w-full">
                      Return to Wallet
                    </Button>
                  </div>
                </div>
              )}
              
              <iframe 
                ref={iframeRef}
                src={url} 
                className="w-full h-full border-none"
                onLoad={handleLoad}
                onError={handleError}
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
