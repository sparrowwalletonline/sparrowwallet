
import React, { useState } from 'react';
import { ArrowLeft, Search, Send, Repeat, CreditCard } from 'lucide-react';
import { useWallet } from '@/contexts/WalletContext';
import { toast } from '@/components/ui/use-toast';
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

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

const WalletActions: React.FC = () => {
  const { 
    activeWallet, 
    btcBalance, 
    ethBalance, 
    btcPrice, 
    ethPrice, 
    cryptoPrices, 
    enabledCryptos,
    copyToClipboard
  } = useWallet();
  
  const [isTokenSelectionOpen, setIsTokenSelectionOpen] = useState(false);
  const [isSendDialogOpen, setIsSendDialogOpen] = useState(false);
  const [selectedToken, setSelectedToken] = useState<Token | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [recipientAddress, setRecipientAddress] = useState('');
  const [amount, setAmount] = useState('');

  // Generate tokens from cryptoPrices and enabledCryptos
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

  const handleAction = (action: string) => {
    if (action === 'send') {
      setIsTokenSelectionOpen(true);
    } else {
      toast({
        title: `${action}`,
        description: `This is a demo. No actual ${action.toLowerCase()} will be performed.`,
      });
    }
  };

  const handleTokenSelect = (token: Token) => {
    setSelectedToken(token);
    setIsTokenSelectionOpen(false);
    setIsSendDialogOpen(true);
  };

  const handleSend = () => {
    if (!selectedToken || !recipientAddress || !amount) {
      toast({
        title: "Fehler",
        description: "Bitte fülle alle Felder aus.",
        variant: "destructive",
      });
      return;
    }

    toast({
      title: "Transaktion initiiert",
      description: `Dies ist eine Demo. ${amount} ${selectedToken.symbol} würden an ${recipientAddress} gesendet werden.`,
    });

    // Reset form
    setRecipientAddress('');
    setAmount('');
    setIsSendDialogOpen(false);
    setSelectedToken(null);
  };

  const handleSetMaxAmount = () => {
    if (selectedToken) {
      setAmount(selectedToken.balance.toString());
    }
  };

  const filteredTokens = searchTerm 
    ? tokens.filter(token => 
        token.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
        token.symbol.toLowerCase().includes(searchTerm.toLowerCase()))
    : tokens;

  return (
    <div className="flex justify-around py-4 px-2 gap-4">
      <Button 
        variant="ghost" 
        className="flex-1 flex flex-col items-center gap-1 hover:bg-gray-800"
        onClick={() => handleAction('send')}
      >
        <Send className="h-6 w-6 text-green-500" />
        <span className="text-xs">Senden</span>
      </Button>
      <Button 
        variant="ghost" 
        className="flex-1 flex flex-col items-center gap-1 hover:bg-gray-800"
        onClick={() => handleAction('swap')}
      >
        <Repeat className="h-6 w-6 text-green-500" />
        <span className="text-xs">Swappen</span>
      </Button>
      <Button 
        variant="ghost" 
        className="flex-1 flex flex-col items-center gap-1 hover:bg-gray-800"
        onClick={() => handleAction('buy')}
      >
        <CreditCard className="h-6 w-6 text-green-500" />
        <span className="text-xs">Kaufen</span>
      </Button>

      {/* Token Selection Dialog */}
      <Dialog open={isTokenSelectionOpen} onOpenChange={setIsTokenSelectionOpen}>
        <DialogContent className="bg-gray-900 border border-gray-800 text-white p-0 max-w-md overflow-hidden flex flex-col">
          {/* Header */}
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
              <h2 className="text-lg font-medium">Token zum Versenden auswählen</h2>
            </div>
          </div>
          
          {/* Search */}
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
          
          {/* Tokens List */}
          <div className="flex-1 overflow-y-auto">
            <div className="space-y-1">
              {filteredTokens.map((token) => (
                <div 
                  key={token.id} 
                  className="flex items-center justify-between py-3 px-4 hover:bg-gray-800 cursor-pointer"
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

      {/* Send Token Dialog */}
      <Dialog open={isSendDialogOpen} onOpenChange={setIsSendDialogOpen}>
        <DialogContent className="bg-gray-900 border border-gray-800 text-white p-0 max-w-md overflow-hidden flex flex-col">
          {/* Header */}
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
          
          {/* Token Info */}
          <div className="flex flex-col items-center py-4">
            {selectedToken && (
              <>
                <div className={`w-12 h-12 rounded-full ${selectedToken.iconColor} flex items-center justify-center overflow-hidden mb-2`}>
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
          
          {/* Send Form */}
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
          
          {/* Footer */}
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
    </div>
  );
};

export default WalletActions;
