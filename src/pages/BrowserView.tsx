import React, { useState, useEffect, useRef } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { MenuProvider } from '@/contexts/MenuContext';
import { WalletProvider } from '@/contexts/WalletContext';
import Header from '@/components/Header';
import { ArrowLeft, ArrowRight, RefreshCcw, Home, X, AlertTriangle, Link } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { toast } from '@/components/ui/use-toast';
import { 
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter
} from '@/components/ui/dialog';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

const BrowserView: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [url, setUrl] = useState<string>('https://defillama.com/');
  const [inputUrl, setInputUrl] = useState<string>('https://defillama.com/');
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [showBlockedDialog, setShowBlockedDialog] = useState<boolean>(false);
  const [showProxyDialog, setShowProxyDialog] = useState<boolean>(false);
  const [blockedSite, setBlockedSite] = useState<string | null>(null);
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const loadTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    if (location.state && location.state.url) {
      setUrl(location.state.url);
      setInputUrl(location.state.url);
    }
  }, [location]);

  useEffect(() => {
    if (isLoading) {
      if (loadTimeoutRef.current) {
        clearTimeout(loadTimeoutRef.current);
      }
      
      loadTimeoutRef.current = setTimeout(() => {
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
    try {
      const urlObj = new URL(url);
      const hostname = urlObj.hostname;
      setBlockedSite(hostname);
      setError(`${hostname} refused to connect. This website likely blocks embedding in iframes.`);
      setShowBlockedDialog(true);
      toast({
        title: "Connection Blocked",
        description: "This website doesn't allow being displayed in our browser. Try a crypto-friendly site or view in external browser.",
        variant: "destructive",
      });
    } catch (e) {
      setError("Invalid URL or connection error.");
      setShowBlockedDialog(true);
    }
  };

  const handleGoBack = () => {
    document.body.classList.add('page-exit');
    
    setTimeout(() => {
      navigate(-1);
      
      setTimeout(() => {
        document.body.classList.remove('page-exit');
      }, 50);
    }, 300);
  };

  const handleGoForward = () => {
    document.body.classList.add('page-exit');
    
    setTimeout(() => {
      navigate(1);
      
      setTimeout(() => {
        document.body.classList.remove('page-exit');
      }, 50);
    }, 300);
  };

  const handleNavigate = () => {
    setIsLoading(true);
    setError(null);
    setShowBlockedDialog(false);
    const formattedUrl = inputUrl.startsWith('http') ? inputUrl : `https://${inputUrl}`;
    setUrl(formattedUrl);
  };

  const handleRefresh = () => {
    setIsLoading(true);
    setError(null);
    setShowBlockedDialog(false);
    const currentUrl = url;
    setUrl('about:blank');
    setTimeout(() => setUrl(currentUrl), 100);
  };

  const handleGoHome = () => {
    document.body.classList.add('page-exit');
    
    setTimeout(() => {
      navigate('/wallet');
      
      setTimeout(() => {
        document.body.classList.remove('page-exit');
      }, 50);
    }, 300);
  };

  const handleOpenInExternalBrowser = () => {
    window.open(url, '_blank');
    setShowBlockedDialog(false);
    toast({
      title: "Opening External Browser",
      description: "The website will open in your default browser.",
    });
  };

  const handleShowProxyOption = () => {
    setShowBlockedDialog(false);
    setShowProxyDialog(true);
  };

  const handleUseProxy = () => {
    if (blockedSite) {
      const proxyUrl = `https://api.allorigins.win/raw?url=${encodeURIComponent(url)}`;
      setUrl(proxyUrl);
      setShowProxyDialog(false);
      setIsLoading(true);
      toast({
        title: "Using Proxy Service",
        description: "Attempting to load website through a proxy. This may not work for all sites.",
      });
    }
  };

  const handleLoad = () => {
    if (loadTimeoutRef.current) {
      clearTimeout(loadTimeoutRef.current);
    }
    
    setIsLoading(false);
    setError(null);
    
    try {
      if (iframeRef.current) {
        const iframeDoc = iframeRef.current.contentDocument || iframeRef.current.contentWindow?.document;
        if (!iframeDoc) {
          handleFrameBlocked();
        }
      }
    } catch (e) {
      handleFrameBlocked();
    }
  };

  const handleError = () => {
    if (loadTimeoutRef.current) {
      clearTimeout(loadTimeoutRef.current);
    }
    
    setIsLoading(false);
    setError(`Could not load ${url}. The website may be blocking embedding or is unavailable.`);
    setShowBlockedDialog(true);
    toast({
      title: "Connection Error",
      description: "The website refused to connect. Try a different URL.",
      variant: "destructive",
    });
  };

  const recommendedSites = [
    { name: "DeFiLlama", url: "https://defillama.com/" },
    { name: "CryptoSlate", url: "https://cryptoslate.com/" },
    { name: "CoinPaprika", url: "https://coinpaprika.com/" },
    { name: "CryptoCompare", url: "https://www.cryptocompare.com/" },
    { name: "DEXTools", url: "https://www.dextools.io/" },
    { name: "DexScreener", url: "https://dexscreener.com/" }
  ];

  const handleTryRecommendedSite = (siteUrl: string, siteName: string) => {
    setUrl(siteUrl);
    setInputUrl(siteUrl);
    setError(null);
    setIsLoading(true);
    setShowBlockedDialog(false);
    toast({
      title: "Loading Alternative Site",
      description: `Trying ${siteName} which should work in our browser.`,
    });
  };

  return (
    <div className="min-h-screen bg-wallet-darkBg flex justify-center w-full page-enter">
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

            <Dialog open={showBlockedDialog} onOpenChange={setShowBlockedDialog}>
              <DialogContent className="bg-gray-900 border-gray-800 text-white max-w-sm mx-auto">
                <DialogHeader>
                  <div className="flex justify-center mb-2">
                    <AlertTriangle className="h-10 w-10 text-yellow-500" />
                  </div>
                  <DialogTitle className="text-center text-lg font-semibold text-white">Connection Blocked</DialogTitle>
                  <DialogDescription className="text-gray-300 text-center">
                    {error}
                  </DialogDescription>
                </DialogHeader>
                
                <div className="py-2">
                  <h4 className="text-sm font-medium text-gray-400 mb-3 text-center">Try these crypto-friendly sites:</h4>
                  <div className="grid grid-cols-2 gap-2">
                    {recommendedSites.map((site) => (
                      <Button 
                        key={site.url}
                        variant="secondary" 
                        className="text-xs" 
                        onClick={() => handleTryRecommendedSite(site.url, site.name)}
                      >
                        {site.name}
                      </Button>
                    ))}
                  </div>
                </div>
                
                <DialogFooter className="flex flex-col space-y-2 mt-4">
                  <Button 
                    variant="default" 
                    onClick={handleOpenInExternalBrowser} 
                    className="w-full"
                  >
                    <Link className="h-4 w-4 mr-2" />
                    Open in External Browser
                  </Button>
                  <Button 
                    variant="secondary" 
                    onClick={handleShowProxyOption} 
                    className="w-full"
                  >
                    Try Using Proxy
                  </Button>
                  <Button 
                    variant="outline" 
                    onClick={handleGoHome} 
                    className="w-full"
                  >
                    Return to Wallet
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>

            <AlertDialog open={showProxyDialog} onOpenChange={setShowProxyDialog}>
              <AlertDialogContent className="bg-gray-900 border-gray-800 text-white">
                <AlertDialogHeader>
                  <AlertDialogTitle className="text-white">Use Proxy Service?</AlertDialogTitle>
                  <AlertDialogDescription className="text-gray-300">
                    This will attempt to load {blockedSite} through a third-party proxy service. 
                    This may have limited functionality and could pose security risks.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel className="bg-gray-800 text-white border-gray-700 hover:bg-gray-700">
                    Cancel
                  </AlertDialogCancel>
                  <AlertDialogAction onClick={handleUseProxy} className="bg-emerald-600 hover:bg-emerald-700">
                    Continue With Proxy
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </WalletProvider>
        </MenuProvider>
      </div>
    </div>
  );
};

export default BrowserView;
