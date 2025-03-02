
import React, { useState } from 'react';
import { toast } from '@/components/ui/use-toast';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ArrowLeft, Search, Send, ArrowDownUp, CreditCard, History } from 'lucide-react';
import { useWallet } from '@/contexts/WalletContext';

// Token selection component that will be displayed first
const TokenSelectionDialog: React.FC<{
  isOpen: boolean;
  onClose: () => void;
  onSelectToken: (symbol: string) => void;
}> = ({ isOpen, onClose, onSelectToken }) => {
  const { cryptoPrices, enabledCryptos } = useWallet();
  const [searchTerm, setSearchTerm] = useState('');

  const filteredTokens = Object.entries(cryptoPrices)
    .filter(([symbol, data]) => {
      const id = data.name ? data.name.toLowerCase().replace(/\s+/g, '-') : symbol.toLowerCase();
      return enabledCryptos.includes(id) && 
        (data.name?.toLowerCase().includes(searchTerm.toLowerCase()) || 
         symbol.toLowerCase().includes(searchTerm.toLowerCase()));
    })
    .map(([symbol, data]) => {
      let amount = "0";
      
      const value = parseFloat(amount) * data.price;
      const change = (data.change_percentage_24h >= 0 ? "+" : "") + 
                    data.change_percentage_24h.toFixed(2) + "%";
      
      let iconColor = "bg-gray-700";
      if (symbol === "BTC") iconColor = "bg-[#F7931A]";
      else if (symbol === "ETH") iconColor = "bg-[#627EEA]";
      else if (symbol === "BNB") iconColor = "bg-[#F3BA2F]";
      else if (symbol === "POL" || symbol === "MATIC") iconColor = "bg-[#8247E5]";
      else if (symbol === "AE") iconColor = "bg-[#DE3F6B]";
      else if (symbol === "TWT") iconColor = "bg-[#3375BB]";
      
      return {
        symbol,
        name: data.name || symbol,
        network: (symbol === "BNB" || symbol === "TWT") ? "BNB Smart Chain" : 
                 (symbol === "POL") ? "Polygon" : 
                 (symbol === "AE") ? "Aeternity" : data.name,
        amount,
        price: data.price,
        value,
        change,
        iconColor,
        changeColor: data.change_percentage_24h >= 0 ? "text-green-500" : "text-red-500",
        logoUrl: data.image || ""
      };
    });

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="bg-gray-900 border border-gray-800 text-white p-0 max-w-md max-h-[85vh] overflow-hidden flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between px-4 py-3 border-b border-gray-800">
          <div className="flex items-center gap-3">
            <Button 
              variant="ghost" 
              size="icon" 
              className="text-gray-400 hover:text-white"
              onClick={onClose}
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
        
        {/* Token List */}
        <div className="flex-1 overflow-y-auto">
          <div className="space-y-0">
            {filteredTokens.map((token) => (
              <div 
                key={token.symbol} 
                className="flex items-center justify-between py-4 px-4 hover:bg-gray-800 cursor-pointer border-b border-gray-800"
                onClick={() => onSelectToken(token.symbol)}
              >
                <div className="flex items-center">
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center mr-3 overflow-hidden ${token.iconColor}`}>
                    {token.logoUrl ? (
                      <img src={token.logoUrl} alt={token.symbol} className="w-full h-full object-cover" />
                    ) : (
                      <span className="text-xs text-white font-bold">{token.symbol.substring(0, 2)}</span>
                    )}
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-medium text-lg">{token.symbol}</span>
                      <span className="text-xs py-0.5 px-2 bg-[#2C3140] text-gray-400 rounded">
                        {token.network}
                      </span>
                    </div>
                    <div className="flex items-center mt-1">
                      <span className="text-sm text-gray-400">{token.price.toLocaleString('en-US', { style: 'currency', currency: 'USD' })}</span>
                      <span className={`text-xs ${token.changeColor} ml-2`}>{token.change}</span>
                    </div>
                  </div>
                </div>
                <div className="text-right">
                  <div className="font-medium">0</div>
                  <div className="text-xs text-gray-400 mt-1">
                    0,00 $
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

// Send token dialog with address and amount inputs
const SendTokenDialog: React.FC<{
  isOpen: boolean;
  onClose: () => void;
  selectedToken: string | null;
}> = ({ isOpen, onClose, selectedToken }) => {
  const { cryptoPrices, btcBalance, ethBalance } = useWallet();
  const [recipientAddress, setRecipientAddress] = useState('');
  const [amount, setAmount] = useState('');

  if (!selectedToken) return null;

  const tokenData = cryptoPrices[selectedToken];
  if (!tokenData) return null;

  const tokenBalance = selectedToken === 'BTC' ? btcBalance : 
                       selectedToken === 'ETH' ? ethBalance : 0;

  const handleMaxAmount = () => {
    setAmount(tokenBalance.toString());
  };

  const handlePreview = () => {
    if (!recipientAddress) {
      toast({
        title: "Fehler",
        description: "Bitte gib eine gültige Adresse ein",
        variant: "destructive",
      });
      return;
    }

    if (!amount || parseFloat(amount) <= 0) {
      toast({
        title: "Fehler",
        description: "Bitte gib einen gültigen Betrag ein",
        variant: "destructive",
      });
      return;
    }

    if (parseFloat(amount) > tokenBalance) {
      toast({
        title: "Fehler",
        description: "Nicht genügend Guthaben",
        variant: "destructive",
      });
      return;
    }

    toast({
      title: "Transaktion",
      description: `Möchtest du ${amount} ${selectedToken} an ${recipientAddress} senden?`,
    });
    
    // In a real app, we would proceed to confirmation, but for demo we'll just close
    setTimeout(() => {
      onClose();
      setRecipientAddress('');
      setAmount('');
      
      toast({
        title: "Demo-Modus",
        description: "Dies ist eine Demo. Keine Transaktion wird durchgeführt.",
      });
    }, 2000);
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="bg-gray-900 border border-gray-800 text-white p-0 max-w-md flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between px-4 py-3 border-b border-gray-800">
          <div className="flex items-center gap-3">
            <Button 
              variant="ghost" 
              size="icon" 
              className="text-gray-400 hover:text-white"
              onClick={onClose}
            >
              <ArrowLeft className="h-5 w-5" />
            </Button>
            <h2 className="text-lg font-medium">{selectedToken} senden</h2>
          </div>
        </div>
        
        {/* Token Info */}
        <div className="flex flex-col items-center py-6">
          <div className={`w-16 h-16 rounded-full flex items-center justify-center overflow-hidden relative ${
            selectedToken === "BTC" ? "bg-[#F7931A]" :
            selectedToken === "ETH" ? "bg-[#627EEA]" :
            selectedToken === "BNB" ? "bg-[#F3BA2F]" :
            selectedToken === "POL" || selectedToken === "MATIC" ? "bg-[#8247E5]" :
            "bg-gray-700"
          }`}>
            {tokenData.image ? (
              <img src={tokenData.image} alt={selectedToken} className="w-full h-full object-cover" />
            ) : (
              <span className="text-xl text-white font-bold">{selectedToken.substring(0, 2)}</span>
            )}
          </div>
          <div className="mt-2 text-sm text-gray-400">
            auf {tokenData.name || selectedToken}
          </div>
        </div>
        
        {/* Form */}
        <div className="px-4 pb-6 flex flex-col gap-4">
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
                value={amount}
                onChange={(e) => setAmount(e.target.value.replace(/[^0-9.]/g, ''))}
                className="bg-gray-800 border-gray-700 pr-16"
                type="text"
              />
              <Button
                variant="ghost"
                size="sm"
                className="absolute right-2 top-1/2 transform -translate-y-1/2 text-green-500 h-6"
                onClick={handleMaxAmount}
              >
                MAX
              </Button>
            </div>
            <div className="mt-1 text-sm text-gray-400">
              Guthaben: {tokenBalance} {selectedToken}
            </div>
          </div>
          
          <Button 
            className="w-full mt-4 bg-green-600 hover:bg-green-700"
            onClick={handlePreview}
          >
            Vorschau
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

const WalletActions: React.FC = () => {
  const [isTokenSelectionOpen, setIsTokenSelectionOpen] = useState(false);
  const [isSendDialogOpen, setIsSendDialogOpen] = useState(false);
  const [selectedToken, setSelectedToken] = useState<string | null>(null);

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

  const handleSelectToken = (symbol: string) => {
    setSelectedToken(symbol);
    setIsTokenSelectionOpen(false);
    setIsSendDialogOpen(true);
  };

  const handleCloseSendDialog = () => {
    setIsSendDialogOpen(false);
    setSelectedToken(null);
  };

  return (
    <div className="mt-6 grid grid-cols-3 gap-3">
      <Button
        variant="outline"
        className="flex flex-col items-center justify-center py-4 bg-wallet-card border-wallet-card hover:bg-wallet-hover"
        onClick={() => handleAction('send')}
      >
        <Send className="h-6 w-6 mb-1" />
        <span>Senden</span>
      </Button>
      
      <Button
        variant="outline"
        className="flex flex-col items-center justify-center py-4 bg-wallet-card border-wallet-card hover:bg-wallet-hover"
        onClick={() => handleAction('swap')}
      >
        <ArrowDownUp className="h-6 w-6 mb-1" />
        <span>Tauschen</span>
      </Button>
      
      <Button
        variant="outline"
        className="flex flex-col items-center justify-center py-4 bg-wallet-card border-wallet-card hover:bg-wallet-hover"
        onClick={() => handleAction('buy')}
      >
        <CreditCard className="h-6 w-6 mb-1" />
        <span>Kaufen</span>
      </Button>
      
      <TokenSelectionDialog 
        isOpen={isTokenSelectionOpen}
        onClose={() => setIsTokenSelectionOpen(false)}
        onSelectToken={handleSelectToken}
      />
      
      <SendTokenDialog
        isOpen={isSendDialogOpen}
        onClose={handleCloseSendDialog}
        selectedToken={selectedToken}
      />
    </div>
  );
};

export default WalletActions;
