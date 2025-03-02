import React, { useState, useEffect } from 'react';
import { useWallet } from '@/contexts/WalletContext';
import { QRCodeSVG } from 'qrcode.react';
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ArrowLeft, Search, Copy, AlertTriangle, X } from 'lucide-react';
import { toast } from '@/components/ui/use-toast';
import { copyToClipboard } from '@/utils/clipboardUtils';
import { getQrCodeValue } from '@/utils/encryptionUtils';

interface Token {
  id: string;
  symbol: string;
  name: string;
  network?: string;
  price: number;
  change: number;
  balance: number;
  value: number;
  iconColor: string;
  logoUrl?: string;
}

const WalletBalance: React.FC = () => {
  const { btcBalance, btcPrice, ethBalance, ethPrice, usdBalance, walletAddress, cryptoPrices, enabledCryptos, activeWallet } = useWallet();
  const [isTokenSelectionOpen, setIsTokenSelectionOpen] = useState(false);
  const [isSendDialogOpen, setIsSendDialogOpen] = useState(false);
  const [isReceiveDialogOpen, setIsReceiveDialogOpen] = useState(false);
  const [isBuyDialogOpen, setIsBuyDialogOpen] = useState(false);
  const [selectedToken, setSelectedToken] = useState<Token | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [recipientAddress, setRecipientAddress] = useState('');
  const [amount, setAmount] = useState('');
  
  const formatAddress = (address: string) => {
    if (!address) return '';
    return `${address.slice(0, 8)}...${address.slice(-8)}`;
  };

  const formatUSD = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    }).format(amount);
  };

  const tokens: Token[] = Object.entries(cryptoPrices)
    .filter(([symbol, data]) => {
      const id = data.name ? data.name.toLowerCase().replace(/\s+/g, '-') : symbol.toLowerCase();
      return enabledCryptos.includes(id);
    })
    .map(([symbol, data]) => {
      let balance = 0;
      if (symbol === "BTC") balance = btcBalance;
      else if (symbol === "ETH") balance = ethBalance;
      
      const value = balance * data.price;
      
      let iconColor = "bg-gray-700";
      if (symbol === "BTC") iconColor = "bg-[#F7931A]";
      else if (symbol === "ETH") iconColor = "bg-[#627EEA]";
      else if (symbol === "BNB") iconColor = "bg-[#F3BA2F]";
      else if (symbol === "MATIC" || symbol === "POL") iconColor = "bg-[#8247E5]";
      else if (symbol === "AE") iconColor = "bg-[#DE3162]";
      else if (symbol === "TWT") iconColor = "bg-[#3375BB]";
      
      return {
        id: data.name ? data.name.toLowerCase().replace(/\s+/g, '-') : symbol.toLowerCase(),
        symbol,
        name: data.name || symbol,
        network: getNetworkName(symbol),
        price: data.price,
        change: data.change_percentage_24h,
        balance,
        value,
        iconColor,
        logoUrl: data.image
      };
    });

  function getNetworkName(symbol: string): string {
    switch(symbol) {
      case "BTC": return "Bitcoin";
      case "ETH": return "Ethereum";
      case "BNB": return "BNB Smart Chain";
      case "MATIC":
      case "POL": return "Polygon";
      case "AE": return "Aeternity";
      case "TWT": return "BNB Smart Chain";
      default: return symbol;
    }
  }

  const handleSendClick = () => {
    setSelectedToken(null);
    setIsTokenSelectionOpen(true);
    setSearchTerm('');
  };

  const handleReceiveClick = () => {
    setSelectedToken(null);
    setIsTokenSelectionOpen(true);
    setSearchTerm('');
    console.log("Wallet address when receive clicked:", walletAddress);
    console.log("Active wallet when receive clicked:", activeWallet);
  };

  const handleBuyClick = () => {
    setIsBuyDialogOpen(true);
  };

  const handleCopyAddress = () => {
    const addressToCopy = activeWallet?.walletAddress || walletAddress;
    if (addressToCopy) {
      copyToClipboard(addressToCopy);
    } else {
      toast({
        title: "Fehler",
        description: "Keine Wallet-Adresse verfügbar zum Kopieren",
        variant: "destructive",
      });
    }
  };

  const getDisplayAddress = () => {
    return activeWallet?.walletAddress || walletAddress || "";
  };

  useEffect(() => {
    if (isReceiveDialogOpen) {
      console.log("Receive dialog opened, wallet address:", walletAddress);
      console.log("Active wallet:", activeWallet);
    }
  }, [isReceiveDialogOpen, walletAddress, activeWallet]);

  return (
    <div className="animate-fade-in w-full">
      <div className="mb-1 px-1">
        <h2 className="text-3xl font-bold">{formatUSD(usdBalance)}</h2>
      </div>
      
      <div className="flex justify-between mt-6">
        <CryptoAction icon="send" label="Send" onClick={handleSendClick} />
        <CryptoAction icon="receive" label="Receive" onClick={handleReceiveClick} />
        <CryptoAction icon="buy" label="Buy" onClick={handleBuyClick} />
        <CryptoAction icon="earn" label="Earn" />
      </div>
      
      <div className="mt-4 bg-[#232733] rounded-xl p-4 border border-gray-800">
        <div className="flex items-center gap-3">
          <div className="flex-shrink-0">
            <img 
              src="/lovable-uploads/b5f7d5f1-4b8c-465c-ab6e-151090ca29ec.png" 
              alt="Promotion" 
              className="w-10 h-10 object-cover rounded-lg"
            />
          </div>
          <div className="flex-1">
            <div className="flex justify-between items-start">
              <p className="text-sm font-medium">Add funds from exchange</p>
              <button className="text-xs text-gray-400">×</button>
            </div>
            <p className="text-xs text-wallet-green mt-1">Deposit now →</p>
          </div>
        </div>
      </div>

      <Dialog open={isTokenSelectionOpen} onOpenChange={setIsTokenSelectionOpen}>
        <DialogContent fullScreen className="bg-gray-900 border border-gray-800 text-white p-0 max-w-full md:max-w-3xl overflow-hidden flex flex-col">
          <div className="flex items-center justify-between px-4 py-3 border-b border-gray-800">
            <div className="flex items-center gap-3">
              <Button 
                variant="ghost" 
                size="icon" 
                className="text-gray-400 hover:text-white"
                onClick={() => setIsTokenSelectionOpen(false)}
              >
                <ArrowLeft className="h-5 w-5" />
              </Button>
              <h2 className="text-lg font-medium">Token auswählen</h2>
            </div>
          </div>
          
          <div className="px-4 py-3">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-500" />
              <Input
                placeholder="Token-Name oder Kontraktadresse"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 bg-gray-800 border-gray-700"
              />
            </div>
          </div>
          
          <div className="flex-1 overflow-y-auto">
            <div className="space-y-1">
              {filteredTokens.map((token) => (
                <div 
                  key={token.id} 
                  className="flex items-center justify-between py-3 px-4 hover:bg-gray-800 cursor-pointer"
                  onClick={() => handleTokenSelect(token, selectedToken ? (isReceiveDialogOpen ? 'receive' : 'send') : (isSendDialogOpen ? 'send' : 'receive'))}
                >
                  <div className="flex items-center gap-3">
                    <div className={`w-8 h-8 rounded-full ${token.iconColor} flex items-center justify-center overflow-hidden`}>
                      {token.logoUrl ? (
                        <img src={token.logoUrl} alt={token.symbol} className="w-full h-full object-cover" />
                      ) : (
                        <span className="text-xs text-white font-bold">{token.symbol.substring(0, 2)}</span>
                      )}
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-medium">{token.symbol}</span>
                        <span className="text-xs py-0.5 px-2 bg-[#2C3140] text-gray-400 rounded">
                          {token.network}
                        </span>
                      </div>
                      <div className="flex items-center text-sm text-gray-400">
                        <span>{token.price.toLocaleString('en-US', {style: 'currency', currency: 'USD', minimumFractionDigits: 2})}</span>
                        <span className={`ml-2 ${token.change >= 0 ? 'text-green-500' : 'text-red-500'}`}>
                          {token.change >= 0 ? '+' : ''}{token.change.toFixed(2)}%
                        </span>
                      </div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div>{token.balance}</div>
                    <div className="text-xs text-gray-400">
                      {token.value.toLocaleString('en-US', {style: 'currency', currency: 'USD', minimumFractionDigits: 2})}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </DialogContent>
      </Dialog>

      <Dialog open={isSendDialogOpen} onOpenChange={setIsSendDialogOpen}>
        <DialogContent fullScreen className="bg-gray-900 border border-gray-800 text-white p-0 max-w-full md:max-w-3xl overflow-hidden flex flex-col">
          <div className="flex items-center justify-between px-4 py-3 border-b border-gray-800">
            <div className="flex items-center gap-3">
              <Button 
                variant="ghost" 
                size="icon" 
                className="text-gray-400 hover:text-white"
                onClick={() => setIsSendDialogOpen(false)}
              >
                <ArrowLeft className="h-5 w-5" />
              </Button>
              <h2 className="text-lg font-medium">{selectedToken?.symbol} senden</h2>
            </div>
          </div>
          
          <div className="flex flex-col items-center py-4">
            {selectedToken && (
              <>
                <div className={`w-12 h-12 rounded-full ${selectedToken.iconColor} flex items-center justify-center mb-2`}>
                  {selectedToken.logoUrl ? (
                    <img src={selectedToken.logoUrl} alt={selectedToken.symbol} className="w-full h-full object-cover" />
                  ) : (
                    <span className="text-lg text-white font-bold">{selectedToken.symbol.substring(0, 2)}</span>
                  )}
                </div>
                <div className="text-sm text-gray-400">auf {selectedToken.network}</div>
              </>
            )}
          </div>
          
          <div className="px-4 py-2 space-y-4 flex-1">
            <div>
              <label className="block text-sm mb-2">Adresse des Empfängers</label>
              <Input
                placeholder="Gib eine gültige Adresse ein"
                value={recipientAddress}
                onChange={(e) => setRecipientAddress(e.target.value)}
                className="bg-gray-800 border-gray-700"
              />
            </div>
            
            <div>
              <label className="block text-sm mb-2">Betrag</label>
              <div className="relative">
                <Input
                  placeholder="Gib einen gültigen Betrag ein"
                  type="number"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  className="bg-gray-800 border-gray-700 pr-16"
                />
                <button 
                  className="absolute right-2 top-1/2 transform -translate-y-1/2 text-green-500 text-sm font-medium"
                  onClick={handleSetMaxAmount}
                >
                  MAX
                </button>
              </div>
              <div className="mt-2 text-sm text-gray-400">
                Guthaben: {selectedToken?.balance || 0} {selectedToken?.symbol}
              </div>
            </div>
          </div>
          
          <div className="border-t border-gray-800 p-4">
            <Button 
              variant="wallet" 
              className="w-full"
              onClick={handleSend}
            >
              Vorschau
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      <Dialog open={isReceiveDialogOpen} onOpenChange={setIsReceiveDialogOpen}>
        <DialogContent fullScreen className="bg-gray-900 border border-gray-800 text-white p-0 max-w-full md:max-w-3xl overflow-hidden flex flex-col">
          <div className="flex items-center justify-between px-4 py-3 border-b border-gray-800">
            <div className="flex items-center gap-3">
              <Button 
                variant="ghost" 
                size="icon" 
                className="text-gray-400 hover:text-white"
                onClick={() => setIsReceiveDialogOpen(false)}
              >
                <ArrowLeft className="h-5 w-5" />
              </Button>
              <h2 className="text-lg font-medium">{selectedToken?.symbol} erhalten</h2>
            </div>
            <Button 
              variant="ghost" 
              size="icon" 
              className="text-gray-400 hover:text-white"
              onClick={() => setIsReceiveDialogOpen(false)}
            >
              <X className="h-5 w-5" />
            </Button>
          </div>
          
          <div className="flex flex-col items-center py-4">
            {selectedToken && (
              <>
                <div className={`w-12 h-12 rounded-full ${selectedToken.iconColor} flex items-center justify-center mb-2`}>
                  {selectedToken.logoUrl ? (
                    <img src={selectedToken.logoUrl} alt={selectedToken.symbol} className="w-full h-full object-cover" />
                  ) : (
                    <span className="text-lg text-white font-bold">{selectedToken.symbol.substring(0, 2)}</span>
                  )}
                </div>
                <div className="text-sm text-gray-400">auf {selectedToken.network}</div>
              </>
            )}
          </div>
          
          <div className="flex-1 flex flex-col items-center px-4 py-2">
            <div className="bg-[#232733] p-4 rounded-lg mb-4 max-w-md w-full">
              <div className="flex items-start gap-3 text-yellow-500">
                <AlertTriangle className="w-5 h-5 flex-shrink-0 mt-0.5" />
                <p className="text-sm">
                  Sende nur {selectedToken?.symbol} an diese Adresse. Das Senden anderer Coins kann zum dauerhaften Verlust führen.
                </p>
              </div>
            </div>
            
            <div className="border-4 border-white p-2 rounded-lg bg-white mb-6">
              <QRCodeSVG 
                value={getQrCodeValue(getDisplayAddress(), selectedToken?.symbol || 'BTC')} 
                size={220} 
                bgColor={"#ffffff"} 
                fgColor={"#000000"} 
                level={"L"} 
                includeMargin={false}
                imageSettings={{
                  src: '/lovable-uploads/f133f418-8915-4f9e-8d3e-6fcf786f6b2c.png',
                  x: undefined,
                  y: undefined,
                  height: 60,
                  width: 60,
                  excavate: true,
                }}
              />
            </div>
            
            <div className="w-full max-w-md mb-6">
              <div className="text-center mb-2 text-sm text-gray-400">Deine {selectedToken?.symbol || 'Wallet'} Adresse</div>
              <div className="bg-[#2A2F3D] py-3 px-4 rounded-lg text-sm text-center break-all relative">
                <span className="text-white">{getDisplayAddress() || "Keine Wallet-Adresse verfügbar"}</span>
                <Button 
                  variant="ghost" 
                  size="icon" 
                  className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-white"
                  onClick={handleCopyAddress}
                >
                  <Copy className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>
          
          <div className="border-t border-gray-800 p-4">
            <Button 
              variant="wallet" 
              className="w-full"
              onClick={handleCopyAddress}
            >
              Adresse kopieren
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      <Dialog open={isBuyDialogOpen} onOpenChange={setIsBuyDialogOpen}>
        <DialogContent className="bg-gray-900 border border-gray-800 text-white sm:max-w-md">
          <DialogHeader className="flex flex-col space-y-1.5 text-center sm:text-left">
            <DialogTitle className="text-xl">Kauf nicht verfügbar</DialogTitle>
          </DialogHeader>
          <DialogDescription className="text-gray-300">
            Der direkte Kauf von Kryptowährungen ist in Ihrer Region leider noch nicht verfügbar. Wir arbeiten daran, diesen Service bald anzubieten.
          </DialogDescription>
          <div className="flex justify-end mt-4">
            <Button 
              variant="wallet" 
              onClick={() => setIsBuyDialogOpen(false)}
              className="px-4 py-2"
            >
              Verstanden
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

interface CryptoActionProps {
  icon: string;
  label: string;
  onClick?: () => void;
}

const CryptoAction = ({ icon, label, onClick }: CryptoActionProps) => {
  const getIcon = () => {
    switch(icon) {
      case 'send':
        return (
          <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M12 4V20M12 4L6 10M12 4L18 10" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        );
      case 'receive':
        return (
          <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M12 20V4M12 20L6 14M12 20L18 14" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        );
      case 'buy':
        return (
          <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <rect x="2" y="6" width="20" height="12" rx="2" stroke="currentColor" strokeWidth="2"/>
            <path d="M12 14C13.1046 14 14 13.1046 14 12C14 10.8954 13.1046 10 12 10C10.8954 10 10 10.8954 10 12C10 13.1046 10.8954 14 12 14Z" stroke="currentColor" strokeWidth="2"/>
          </svg>
        );
      case 'earn':
        return (
          <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M12 1v22M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        );
      default:
        return null;
    }
  };
  
  return (
    <button className="flex flex-col items-center" onClick={onClick}>
      <div className="w-10 h-10 rounded-full bg-wallet-card flex items-center justify-center mb-1">
        {getIcon()}
      </div>
      <span className="text-xs">{label}</span>
    </button>
  );
};

export default WalletBalance;
