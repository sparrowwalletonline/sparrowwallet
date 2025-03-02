
import React, { useState, useEffect } from 'react';
import { X, Search, ArrowLeft, Plus } from 'lucide-react';
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { Button } from "@/components/ui/button";
import { useWallet } from '@/contexts/WalletContext';

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

const DEFAULT_CRYPTOS: CryptoOption[] = [
  { id: 'bitcoin', symbol: 'BTC', name: 'Bitcoin', network: 'Bitcoin', isEnabled: true, image: "/lovable-uploads/7e1fa6ef-c45f-4ce0-af71-fa865a931600.png" },
  { id: 'ethereum', symbol: 'ETH', name: 'Ethereum', network: 'Ethereum', isEnabled: true, image: "/lovable-uploads/14bf916a-665e-4e15-b4c5-631d8d5ff633.png" },
  { id: 'binancecoin', symbol: 'BNB', name: 'BNB Smart Chain', network: 'BNB Smart Chain', isEnabled: true, image: "/lovable-uploads/dc54f948-8605-4e6b-a659-7f492598ea5c.png" },
  { id: 'matic-network', symbol: 'POL', name: 'Polygon', network: 'Polygon', isEnabled: true, image: "/lovable-uploads/9c181aad-4d83-4b09-957f-11721da14747.png" },
  { id: 'aeternity', symbol: 'AE', name: 'Aeternity', network: 'Aeternity', isEnabled: false },
  { id: 'trustwallet', symbol: 'TWT', name: 'Trust Wallet', network: 'BNB Smart Chain', isEnabled: false },
  { id: 'cardano', symbol: 'ADA', name: 'Cardano', network: 'Cardano', isEnabled: false },
  { id: 'aion', symbol: 'AION', name: 'Aion', network: 'Aion', isEnabled: false },
  { id: 'akash-network', symbol: 'AKT', name: 'Akash', network: 'Akash', isEnabled: false },
  { id: 'algorand', symbol: 'ALGO', name: 'Algorand', network: 'Algorand', isEnabled: false },
  { id: 'aptos', symbol: 'APT', name: 'Aptos', network: 'Aptos', isEnabled: false },
  { id: 'cosmos', symbol: 'ATOM', name: 'Cosmos', network: 'Cosmos Hub', isEnabled: false },
  { id: 'avalanche-2', symbol: 'AVAX', name: 'Avalanche', network: 'Avalanche C-Chain', isEnabled: false },
];

const ManageCryptoDialog: React.FC<ManageCryptoDialogProps> = ({ isOpen, onClose }) => {
  const { updateEnabledCryptos, enabledCryptos } = useWallet();
  const [cryptoOptions, setCryptoOptions] = useState<CryptoOption[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    // Initialize cryptos with enabled status from context
    const initialCryptos = DEFAULT_CRYPTOS.map(crypto => ({
      ...crypto,
      isEnabled: enabledCryptos.includes(crypto.id)
    }));
    
    setCryptoOptions(initialCryptos);
  }, [enabledCryptos, isOpen]);

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
            <h2 className="text-lg font-medium">Suchen</h2>
          </div>
          <Button 
            variant="ghost" 
            size="icon"
            className="text-gray-400 hover:text-white"
          >
            <Plus className="h-5 w-5" />
          </Button>
        </div>
        
        {/* Search */}
        <div className="px-4 py-3">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-500" />
            <Input
              placeholder="Token-Name oder Kontraktadresse"
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
            Du hast deine Kryptowährung nicht gesehen? Importieren
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ManageCryptoDialog;
