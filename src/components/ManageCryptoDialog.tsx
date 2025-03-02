
import React, { useState, useEffect } from 'react';
import { X, Search, ArrowLeft } from 'lucide-react';
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { Button } from "@/components/ui/button";
import { useWallet } from '@/contexts/WalletContext';
import { fetchCryptoPrices } from '@/utils/cryptoPriceUtils';

interface CryptoOption {
  id: string;
  symbol: string;
  name: string;
  network?: string;
  image?: string;
  isEnabled: boolean;
}

interface ManageCryptoDialogProps {
  isOpen: boolean;
  onClose: () => void;
}

const ManageCryptoDialog: React.FC<ManageCryptoDialogProps> = ({ isOpen, onClose }) => {
  const { updateEnabledCryptos, enabledCryptos, cryptoPrices } = useWallet();
  const [cryptoOptions, setCryptoOptions] = useState<CryptoOption[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setIsLoading(true);
      
      // Create a list of cryptocurrencies based on the cryptoPrices from context
      const options: CryptoOption[] = Object.entries(cryptoPrices).map(([symbol, data]) => {
        // Convert symbol to lowercase for id (approximating CoinGecko's id format)
        const id = data.name ? data.name.toLowerCase().replace(/\s+/g, '-') : symbol.toLowerCase();
        
        return {
          id,
          symbol,
          name: data.name || symbol,
          image: data.image,
          isEnabled: enabledCryptos.includes(id)
        };
      });
      
      setCryptoOptions(options);
      setIsLoading(false);
    }
  }, [enabledCryptos, isOpen, cryptoPrices]);

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  };

  const toggleCrypto = (id: string) => {
    setCryptoOptions(prev => 
      prev.map(crypto => 
        crypto.id === id 
          ? { ...crypto, isEnabled: !crypto.isEnabled } 
          : crypto
      )
    );
  };

  const handleSave = () => {
    const enabledIds = cryptoOptions
      .filter(crypto => crypto.isEnabled)
      .map(crypto => crypto.id);
    
    updateEnabledCryptos(enabledIds);
    onClose();
  };

  const filteredCryptos = cryptoOptions.filter(crypto => 
    crypto.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
    crypto.symbol.toLowerCase().includes(searchTerm.toLowerCase())
  );

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
            <h2 className="text-lg font-medium">Kryptos verwalten</h2>
          </div>
        </div>
        
        {/* Search */}
        <div className="px-4 py-3">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-500" />
            <Input
              placeholder="Kryptowährung suchen"
              value={searchTerm}
              onChange={handleSearchChange}
              className="pl-10 bg-gray-800 border-gray-700"
            />
          </div>
          <div className="flex items-center gap-2 mt-3">
            <div className="flex items-center gap-2 px-2 py-1 bg-transparent text-gray-400 rounded-md border border-gray-700">
              <span className="text-sm">Alle Netzwerke</span>
            </div>
          </div>
        </div>
        
        {/* Cryptos List */}
        <div className="flex-1 overflow-y-auto">
          {isLoading ? (
            <div className="flex justify-center items-center h-40">
              <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-green-500"></div>
            </div>
          ) : (
            <div className="space-y-1 px-4">
              {filteredCryptos.map((crypto) => (
                <div 
                  key={crypto.id} 
                  className="flex items-center justify-between py-3"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-gray-800 flex items-center justify-center overflow-hidden">
                      {crypto.image ? (
                        <img src={crypto.image} alt={crypto.symbol} className="w-full h-full object-cover" />
                      ) : (
                        <span className="text-xs">{crypto.symbol.substring(0, 2)}</span>
                      )}
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-medium">{crypto.symbol}</span>
                        <span className="text-xs py-0.5 px-2 bg-[#2C3140] text-gray-400 rounded">
                          {crypto.network || crypto.name}
                        </span>
                      </div>
                      <div className="text-sm text-gray-400">
                        {crypto.name}
                      </div>
                    </div>
                  </div>
                  <Switch 
                    checked={crypto.isEnabled}
                    onCheckedChange={() => toggleCrypto(crypto.id)}
                  />
                </div>
              ))}
            </div>
          )}
        </div>
        
        {/* Footer */}
        <div className="border-t border-gray-800 p-4">
          <Button 
            variant="default" 
            className="w-full bg-green-500 hover:bg-green-600 text-white"
            onClick={handleSave}
          >
            Speichern
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ManageCryptoDialog;
