<lov-code>
import React, { useState, useEffect, useRef } from 'react';
import { useWallet } from '@/contexts/WalletContext';
import { QRCodeSVG } from 'qrcode.react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ArrowLeft, Search, Copy, AlertTriangle, X } from 'lucide-react';
import { toast } from '@/components/ui/use-toast';
import { copyToClipboard } from '@/utils/clipboardUtils';
import { getQrCodeValue } from '@/utils/encryptionUtils';
import { useTheme } from '@/components/ui/theme-provider';
import AnalyticsChart from './AnalyticsChart';
import { AlertDialog, AlertDialogContent, AlertDialogHeader, AlertDialogTitle, AlertDialogDescription, AlertDialogFooter, AlertDialogCancel, AlertDialogAction } from "@/components/ui/alert-dialog";
import { Shield } from "lucide-react";

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
  const { theme } = useTheme();
  
  const [animatedBalance, setAnimatedBalance] = useState(0);
  const prevBalanceRef = useRef(0);
  const initialLoadRef = useRef(true);
  
  const [selectedAction, setSelectedAction] = useState<'send' | 'receive' | null>(null);
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [isConfirmingTransaction, setIsConfirmingTransaction] = useState(false);
  
  const [amountError, setAmountError] = useState<string | null>(null);
  
  useEffect(() => {
    const prevBalance = prevBalanceRef.current;
    prevBalanceRef.current = usdBalance;
    
    if (initialLoadRef.current && usdBalance > 0) {
      initialLoadRef.current = false;
      
      const startTime = performance.now();
      const duration = 600;
      
      const animateValue = (timestamp: number) => {
        const runtime = timestamp - startTime;
        const progress = Math.min(runtime / duration, 1);
        
        const easeProgress = 1 - Math.pow(1 - progress, 3);
        const nextValue = 0 + (usdBalance * easeProgress);
        
        setAnimatedBalance(nextValue);
        
        if (runtime < duration) {
          requestAnimationFrame(animateValue);
        } else {
          setAnimatedBalance(usdBalance);
        }
      };
      
      requestAnimationFrame(animateValue);
      return;
    }
    
    if (prevBalance !== usdBalance) {
      if (prevBalance === 0 && initialLoadRef.current) {
        setAnimatedBalance(usdBalance);
        initialLoadRef.current = false;
        return;
      }
      
      setAnimatedBalance(prevBalance);
      
      const startTime = performance.now();
      const duration = 1000;
      
      const animateValue = (timestamp: number) => {
        const runtime = timestamp - startTime;
        const progress = Math.min(runtime / duration, 1);
        
        const easeProgress = 1 - Math.pow(1 - progress, 3);
        const nextValue = prevBalance + (usdBalance - prevBalance) * easeProgress;
        
        setAnimatedBalance(nextValue);
        
        if (runtime < duration) {
          requestAnimationFrame(animateValue);
        } else {
          setAnimatedBalance(usdBalance);
        }
      };
      
      requestAnimationFrame(animateValue);
    }
  }, [usdBalance]);
  
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

  const filteredTokens = tokens.filter(token => 
    token.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
    token.symbol.toLowerCase().includes(searchTerm.toLowerCase())
  );

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

  const handleTokenSelect = (token: Token) => {
    setSelectedToken(token);
    setIsTokenSelectionOpen(false);
    
    if (selectedAction === 'send') {
      setIsSendDialogOpen(true);
    } else if (selectedAction === 'receive') {
      setIsReceiveDialogOpen(true);
    }
  };

  const handleSendClick = () => {
    setSelectedToken(null);
    setSelectedAction('send');
    setIsTokenSelectionOpen(true);
    setSearchTerm('');
  };

  const handleReceiveClick = () => {
    setSelectedToken(null);
    setSelectedAction('receive');
    setIsTokenSelectionOpen(true);
    setSearchTerm('');
    console.log("Wallet address when receive clicked:", walletAddress);
    console.log("Active wallet when receive clicked:", activeWallet);
  };

  const handleBuyClick = () => {
    setIsBuyDialogOpen(true);
  };

  const handleSetMaxAmount = () => {
    if (selectedToken) {
      setAmountError(null);
      setAmount(selectedToken.balance.toString());
    }
  };

  const validateTransaction = (): boolean => {
    if (!selectedToken) {
      toast({
        title: "Fehler",
        description: "Bitte wähle ein Token aus",
        variant: "destructive",
      });
      return false;
    }

    if (!recipientAddress.trim()) {
      toast({
        title: "Fehler",
        description: "Bitte gib eine Empfängeradresse ein",
        variant: "destructive",
      });
      return false;
    }

    const numAmount = parseFloat(amount);
    if (isNaN(numAmount) || numAmount <= 0) {
      setAmountError("Der Betrag muss größer als 0 sein");
      toast({
        title: "Fehler",
        description: "Der Betrag muss größer als 0 sein",
        variant: "destructive",
      });
      return false;
    }

    if (numAmount > selectedToken.balance) {
      setAmountError(`Nicht genügend ${selectedToken.symbol} im Wallet. Maximal verfügbar: ${selectedToken.balance}`);
      toast({
        title: "Fehler",
        description: `Nicht genügend ${selectedToken.symbol} im Wallet`,
        variant: "destructive",
      });
      return false;
    }

    setAmountError(null);
    return true;
  };

  const handlePreviewTransaction = () => {
    if (validateTransaction()) {
      setShowConfirmation(true);
    }
  };

  const handleConfirmTransaction = () => {
    if (validateTransaction()) {
      setIsConfirmingTransaction(true);
      setTimeout(() => {
        toast({
          title: "Transaktion in Bearbeitung",
          description: `${amount} ${selectedToken?.symbol} werden an ${recipientAddress} gesendet.`,
        });
        setShowConfirmation(false);
        setIsSendDialogOpen(false);
        setIsConfirmingTransaction(false);
      }, 1000);
    }
  };

  const handleSend = () => {
    if (validateTransaction()) {
      toast({
        title: "Transaktion in Bearbeitung",
        description: `${amount} ${selectedToken?.symbol} werden an ${recipientAddress} gesendet.`,
      });
      setIsSendDialogOpen(false);
    }
  };

  const handleAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setAmount(value);
    
    // Clear error when user starts typing a new amount
    if (amountError) {
      setAmountError(null);
    }
    
    // Validate in real-time if needed
    const numAmount = parseFloat(value);
    if (selectedToken && !isNaN(numAmount) && numAmount > selectedToken.balance) {
      setAmountError(`Nicht genügend ${selectedToken.symbol} im Wallet. Maximal verfügbar: ${selectedToken.balance}`);
    }
  };

  return (
    <div className="animate-fade-in w-full wallet-balance-wrapper">
      <div className="mb-1 px-1">
        <h2 className="text-3xl font-bold">{formatUSD(animatedBalance)}</h2>
      </div>
      
      <AnalyticsChart tokens={tokens} />
      
      <div className="flex justify-between mt-6">
        <CryptoAction icon="send" label="Send" onClick={handleSendClick} />
        <CryptoAction icon="receive" label="Receive" onClick={handleReceiveClick} />
        <CryptoAction icon="buy" label="Buy" onClick={handleBuyClick} />
        <CryptoAction icon="earn" label="Earn" />
      </div>
      
      <Dialog open={isTokenSelectionOpen} onOpenChange={setIsTokenSelectionOpen}>
        <DialogContent fullScreen className={`dialog-content max-w-full md:max-w-3xl overflow-hidden flex flex-col`}>
          <div className="flex items-center justify-between px-4 py-3 border-b border-border">
            <div className="flex items-center gap-3">
              <Button 
                variant="ghost" 
                size="icon" 
                className="text-muted-foreground hover:text-foreground"
                onClick={() => setIsTokenSelectionOpen(false)}
              >
                <ArrowLeft className="h-5 w-5" />
              </Button>
              <h2 className="text-lg font-medium">Token auswählen</h2>
            </div>
          </div>
          
          <div className="px-4 py-3">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Token-Name oder Kontraktadresse"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 bg-secondary border-input"
              />
            </div>
          </div>
          
          <div className="flex-1 overflow-y-auto">
            <div className="space-y-1">
              {filteredTokens.map((token) => (
                <div 
                  key={token.id} 
                  className="flex items-center justify-between py-3 px-4 hover:bg-secondary/70 cursor-pointer"
                  onClick={() => handleTokenSelect(token)}
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
                        <span className="text-xs py-0.5 px-2 bg-secondary text-muted-foreground rounded">
                          {token.network}
                        </span>
                      </div>
                      <div className="flex items-center text-sm text-muted-foreground">
                        <span>{token.price.toLocaleString('en-US', {style: 'currency', currency: 'USD', minimumFractionDigits: 2})}</span>
                        <span className={`ml-2 ${token.change >= 0 ? 'text-green-500' : 'text-red-500'}`}>
                          {token.change >= 0 ? '+' : ''}{token.change.toFixed(2)}%
                        </span>
                      </div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div>{token.balance}</div>
                    <div className="text-xs text-muted-foreground">
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
        <DialogContent fullScreen className={`dialog-content max-w-full md:max-w-3xl overflow-hidden flex flex-col`}>
          <div className="flex items-center justify-between px-4 py-3 border-b border-border">
            <div className="flex items-center gap-3">
              <Button 
                variant="ghost" 
                size="icon" 
                className="text-muted-foreground hover:text-foreground"
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
                <div className="text-sm text-muted-foreground">auf {selectedToken.network}</div>
              </>
            )}
          </div>
          
          <div className="px-4 py-2 space-y-4 flex-1">
            {selectedToken?.symbol === 'BTC' && (
              <div className="space-y-3">
                <div className="bg-yellow-100 dark:bg-yellow-900/30 border border-yellow-300 dark:border-yellow-700 p-3 rounded-lg">
                  <div className="flex items-start gap-3 text-yellow-700 dark:text-yellow-500">
                    <AlertTriangle className="w-5 h-5 flex-shrink-0 mt-0.5" />
                    <p className="text-sm">
                      Senden Sie nur BTC an diese Adresse. Das Senden anderer Coins kann zum dauerhaften Verlust führen.
                    </p>
                  </div>
                </div>
                
                <div className="bg-yellow-100 dark:bg-yellow-900/30 border border-yellow-300 dark:border-yellow-700 p-3 rounded-lg">
                  <div className="flex items-start gap-3 text-yellow-700 dark:text-yellow-500">
                    <AlertTriangle className="w-5 h-5 flex-shrink-0 mt-0.5" />
                    <p className="text-sm">
                      Verwenden Sie nur das Bitcoin-Netzwerk für diese Transaktion. Die Verwendung anderer Netzwerke kann zu Verlusten führen.
                    </p>
                  </div>
                </div>
              </div>
            )}
            
            <div>
              <label className="block text-sm mb-2">Adresse des Empfängers</label>
              <Input
                placeholder="Gib eine gültige Adresse ein"
                value={recipientAddress}
                onChange={(e) => setRecipientAddress(e.target.value)}
                className="bg-secondary border-input"
              />
            </div>
            
            <div>
              <label className="block text-sm mb-2">Betrag</label>
              <div className="relative">
                <Input
                  placeholder="Gib einen gültigen Betrag ein"
                  type="number"
                  value={amount}
                  onChange={handleAmountChange}
                  className={`bg-secondary border-input pr-16 ${amountError ? 'border-red-500' : ''}`}
                />
                <button 
                  className="absolute right-2 top-1/2 transform -translate-y-1/2 text-green-500 text-sm font-medium"
                  onClick={handleSetMaxAmount}
                >
                  MAX
                </button>
              </div>
              {amountError ? (
                <div className="mt-2 text-sm text-red-500">
                  {amountError}
                </div>
              ) : (
                <div className="mt-2 text-sm text-muted-foreground">
                  Guthaben: {selectedToken?.balance || 0} {selectedToken?.symbol}
                </div>
              )}
            </div>
          </div>
          
          <div className="border-t border-border p-4">
            <Button 
              variant="wallet" 
              className="w-full"
              onClick={handlePreviewTransaction}
            >
              Vorschau
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      <AlertDialog open={showConfirmation} onOpenChange={setShowConfirmation}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle className="flex items-center gap-2">
              <Shield className="h-5 w-5 text-green-500" />
              Transaktion bestätigen
            </AlertDialogTitle>
            <AlertDialogDescription>
              <div className="space-y-4">
                <div className="bg-secondary/50 p-4 rounded-lg space-y-2">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Token:</span>
                    <span className="font-medium">{selectedToken?.symbol}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Betrag:</span>
                    <span className="font-medium">{amount} {selectedToken?.symbol}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Empfänger:</span>
                    <span className="font-medium">{recipientAddress}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Netzwerk:</span>
                    <span className="font-medium">{selectedToken?.network}</span>
                  </div>
                </div>

                <div className="bg-yellow-100 dark:bg-yellow-900/30 border border-yellow-300 dark:border-yellow-700 p-3 rounded-lg">
                  <div className="flex items-start gap-3 text-yellow-700 dark:text-yellow-500">
                    <AlertTriangle className="w-5 h-5 flex-shrink-0 mt-0.5" />
                    <div className="space-y-1">
                      <p className="text-sm font-medium">Wichtige Sicherheitshinweise:</p>
                      <ul className="text-sm list-disc pl-4 space-y-1">
                        <li>Überprüfen Sie die Empfängeradresse sorgfältig</li>
                        <li>Stellen Sie sicher, dass der Betrag korrekt ist</li>
                        <li>Transaktionen können nicht rückgängig gemacht werden</li>
                      </ul>
                    </div>
                  </div>
                </div>
              </div>
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Abbrechen</AlertDialogCancel>
            <AlertDialogAction
              disabled={isConfirmingTransaction}
              onClick={handleConfirmTransaction}
              className="bg-[#0500ff] text-primary-foreground hover:bg-[#0500ff]/90"
            >
              {isConfirmingTransaction ? (
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  Wird bestätigt...
                </div>
              ) : (
                "Bestätigen & Senden"
              )}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      <Dialog open={isReceiveDialogOpen} onOpenChange={setIsReceiveDialogOpen}>
        <DialogContent fullScreen className={`dialog-content max-w-full md:max-w-3xl overflow-hidden flex flex-col`}>
          <DialogHeader className="px-4 py-3 border-b border-border flex justify-between items-center">
            <div className="flex items-center gap-3">
              <Button 
                variant="ghost" 
                size="icon" 
                className="text-muted-foreground hover:text-foreground"
                onClick={() => setIsReceiveDialogOpen(false)}
              >
                <ArrowLeft className="h-5 w-5" />
              </Button>
              <DialogTitle className="text-lg font-medium">{selectedToken?.symbol} erhalten</DialogTitle>
            </div>
            <Button 
              variant="ghost" 
              size="icon" 
              className="text-muted-foreground hover:text-foreground"
              onClick={() => setIsReceiveDialogOpen(false)}
            >
              <X className="h-5 w-5" />
            </Button>
          </DialogHeader>
          
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
                <div className="text-sm text-muted-foreground">auf {selectedToken.network}</div>
              </>
            )}
          </div>
          
          <div className="flex-1 flex flex-col items-center px-4 py-2">
            <div className="bg-secondary p-4 rounded-lg mb-4 max-w-md w-full">
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
              <div className="text-center mb-2 text-sm text-muted-foreground">Deine {selectedToken?.symbol || 'Wallet'} Adresse</div>
              <div className="bg-secondary py-3 px-4 rounded-lg text-sm text-center break-all relative">
                <span className="text-foreground">{getDisplayAddress() || "Keine Wallet-Adresse verfügbar"}</span>
                <Button 
                  variant="ghost" 
                  size="icon" 
                  className="absolute right-2 top-1/2 transform -translate-y-1/2 text-muted-foreground hover:text-foreground"
                  onClick={handleCopyAddress}
                >
                  <Copy className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>
          
          <div className="border-t border-border p-4">
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
        <DialogContent className={`dialog-content sm:max-w-md`}>
          <DialogHeader>
            <DialogTitle className="text-xl">Kauf nicht verfügbar</DialogTitle>
          </DialogHeader>
          <DialogDescription className="text-muted-foreground">
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
          
