import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { WalletProvider, useWallet } from '@/contexts/WalletContext';
import { MenuProvider } from '@/contexts/MenuContext';
import Header from '@/components/Header';
import WalletBalance from '@/components/WalletBalance';
import WalletActions from '@/components/WalletActions';
import ManageCryptoDialog from '@/components/ManageCryptoDialog';
import ManageWalletsDialog from '@/components/ManageWalletsDialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  RefreshCcw, 
  Home, 
  Compass, 
  Shield, 
  Plus, 
  ChevronDown, 
  Check, 
  Bus, 
  PlusSquare, 
  Clock 
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardFooter, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import { toast } from "@/components/ui/use-toast";

// Type definitions for transactions
interface Transaction {
  id: string;
  date: Date;
  type: 'receive' | 'send' | 'swap';
  amount: number;
  currency: string;
  status: 'completed' | 'pending' | 'failed';
  address?: string;
  fee?: number;
}

const WalletViewContent: React.FC = () => {
  const { 
    hasWallet, 
    btcBalance, 
    btcPrice, 
    ethBalance, 
    ethPrice, 
    cryptoPrices, 
    refreshPrices,
    isRefreshingPrices,
    wallets,
    activeWallet,
    setActiveWallet,
    addNewWallet,
    enabledCryptos
  } = useWallet();
  const navigate = useNavigate();
  const [newWalletName, setNewWalletName] = useState('');
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isManageCryptoOpen, setIsManageCryptoOpen] = useState(false);
  const [isManageWalletsOpen, setIsManageWalletsOpen] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  React.useEffect(() => {
    if (!hasWallet) {
      navigate('/');
    }
  }, [hasWallet, navigate]);

  const btcValue = (btcBalance * btcPrice).toFixed(2);
  const ethValue = (ethBalance * ethPrice).toFixed(2);
  
  const [transactions, setTransactions] = useState<Transaction[]>([
    {
      id: '1',
      date: new Date(Date.now() - 86400000), // yesterday
      type: 'receive',
      amount: 0.005,
      currency: 'BTC',
      status: 'completed',
      address: '3FZbgi29cpjq2GjdwV8eyHuJJnkLtktZc5'
    },
    {
      id: '2',
      date: new Date(Date.now() - 172800000), // 2 days ago
      type: 'send',
      amount: 0.001,
      currency: 'BTC',
      status: 'completed',
      address: '1A1zP1eP5QGefi2DMPTfTL5SLmv7DivfNa',
      fee: 0.00005
    },
    {
      id: '3',
      date: new Date(Date.now() - 345600000), // 4 days ago
      type: 'swap',
      amount: 0.01,
      currency: 'ETH',
      status: 'completed'
    }
  ]);
  
  const [isAddToHomeDialogOpen, setIsAddToHomeDialogOpen] = useState(false);

  useEffect(() => {
    refreshPrices();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (Object.keys(cryptoPrices).length > 0) {
      const calculatedUsdBalance = (btcBalance * (cryptoPrices.BTC?.price || btcPrice)) + 
                                  (ethBalance * (cryptoPrices.ETH?.price || ethPrice));
      //setUsdBalance(calculatedUsdBalance);
    }
  }, [cryptoPrices, btcBalance, ethBalance, btcPrice, ethPrice]);

  const handleAddWallet = () => {
    if (newWalletName.trim()) {
      addNewWallet(newWalletName.trim());
      setNewWalletName('');
      setIsDialogOpen(false);
    }
  };

  const handleManageWalletsClose = () => {
    setIsManageWalletsOpen(false);
  };

  const handleManageCryptoClose = () => {
    setIsManageCryptoOpen(false);
  };

  const handleDropdownOpenChange = (open: boolean) => {
    setIsDropdownOpen(open);
  };

  const handleCryptoClick = (symbol: string) => {
    navigate(`/wallet/crypto/${symbol}`);
  };

  // Add to Home function for iOS
  const handleAddToHomeScreen = () => {
    setIsAddToHomeDialogOpen(true);
  };

  const formatDate = (date: Date): string => {
    return new Intl.DateTimeFormat('de-DE', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    }).format(date);
  };

  const cryptoData = Object.entries(cryptoPrices)
    .filter(([symbol, data]) => {
      const id = data.name ? data.name.toLowerCase().replace(/\s+/g, '-') : symbol.toLowerCase();
      return enabledCryptos.includes(id);
    })
    .map(([symbol, data]) => {
      let amount = "0";
      if (symbol === "BTC") amount = btcBalance.toString();
      else if (symbol === "ETH") amount = ethBalance.toString();
      
      const value = parseFloat(amount) * data.price;
      
      const change = (data.change_percentage_24h >= 0 ? "+" : "") + 
                    data.change_percentage_24h.toFixed(2) + "%";
      
      let iconColor = "bg-gray-700";
      if (symbol === "BTC") iconColor = "bg-[#F7931A]";
      else if (symbol === "ETH") iconColor = "bg-[#627EEA]";
      else if (symbol === "BNB") iconColor = "bg-[#F3BA2F]";
      else if (symbol === "MATIC" || symbol === "POL") iconColor = "bg-[#8247E5]";
      
      return {
        symbol,
        name: data.name || symbol,
        amount,
        price: data.price,
        value,
        change,
        iconColor,
        changeColor: data.change_percentage_24h >= 0 ? "text-green-500" : "text-red-500",
        logoUrl: data.image || ""
      };
    });

  const handleNavItemClick = (path: string) => {
    if (path.startsWith('http')) {
      navigate('/browser', { state: { url: path } });
      return;
    }
    navigate(path);
  };

  return (
    <div className="min-h-screen flex flex-col bg-wallet-darkBg text-wallet-text">
      <Header title="Home" />
      
      <div className="px-4 mb-4">
        <div className="flex items-center">
          <DropdownMenu open={isDropdownOpen} onOpenChange={handleDropdownOpenChange}>
            <DropdownMenuTrigger asChild>
              <button className="flex items-center gap-2 bg-transparent hover:bg-wallet-card rounded-lg px-2 py-1 transition-colors">
                <Shield className="h-4 w-4 text-green-500" />
                <span className="text-xs text-gray-400">{activeWallet?.name || "Main wallet"}</span>
                <ChevronDown className="h-3 w-3 text-gray-400" />
              </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="bg-gray-900 border border-gray-800 text-white z-50 min-w-[200px]">
              {wallets.map((wallet) => (
                <DropdownMenuItem 
                  key={wallet.id} 
                  className="flex items-center justify-between cursor-pointer hover:bg-gray-800 text-sm py-2"
                  onClick={() => {
                    setActiveWallet(wallet.id);
                    setIsDropdownOpen(false);
                  }}
                >
                  <div className="flex items-center gap-2">
                    <Shield className="h-4 w-4 text-green-500" />
                    <span>{wallet.name}</span>
                  </div>
                  {wallet.isActive && <Check className="h-4 w-4 text-green-500" />}
                </DropdownMenuItem>
              ))}
              <DropdownMenuSeparator className="bg-gray-800" />
              <div className="p-2 gap-2 flex flex-col">
                <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                  <DialogTrigger asChild>
                    <Button variant="outline" size="sm" className="w-full bg-gray-800 hover:bg-gray-700 border-gray-700 flex gap-2 text-white">
                      <Plus className="h-4 w-4" />
                      <span className="text-sm">Neue Wallet hinzufügen</span>
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="bg-gray-900 border border-gray-800 text-white">
                    <DialogHeader>
                      <DialogTitle>Neue Wallet hinzufügen</DialogTitle>
                    </DialogHeader>
                    <Input
                      placeholder="Wallet Name"
                      value={newWalletName}
                      onChange={(e) => setNewWalletName(e.target.value)}
                      className="bg-gray-800 border-gray-700 text-white"
                    />
                    <DialogFooter>
                      <Button variant="wallet" onClick={handleAddWallet}>
                        Hinzufügen
                      </Button>
                    </DialogFooter>
                  </DialogContent>
                </Dialog>
                <Button 
                  variant="outline" 
                  size="sm" 
                  className="w-full bg-gray-800 hover:bg-gray-700 border-gray-700 flex gap-2 text-white"
                  onClick={() => {
                    setIsManageWalletsOpen(true);
                    setIsDropdownOpen(false);
                  }}
                >
                  <Bus className="h-4 w-4" />
                  <span className="text-sm">Wallets verwalten</span>
                </Button>
              </div>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
      
      <div className="flex-1 flex flex-col px-4">
        <WalletBalance />
        <WalletActions />
        
        <div className="mt-6">
          <Tabs defaultValue="crypto" className="w-full">
            <div className="flex justify-between items-center">
              <TabsList className="grid w-40 grid-cols-2 bg-transparent border-b border-gray-800">
                <TabsTrigger 
                  value="crypto" 
                  className="data-[state=active]:border-b-2 data-[state=active]:border-wallet-green data-[state=active]:text-white data-[state=active]:shadow-none rounded-none bg-transparent text-gray-400"
                >
                  Crypto
                </TabsTrigger>
                <TabsTrigger 
                  value="transactions" 
                  className="data-[state=active]:border-b-2 data-[state=active]:border-wallet-green data-[state=active]:text-white data-[state=active]:shadow-none rounded-none bg-transparent text-gray-400"
                >
                  Transaktionen
                </TabsTrigger>
              </TabsList>
              
              <Button
                variant="ghost"
                size="sm"
                className="text-gray-400 hover:text-white"
                onClick={refreshPrices}
                disabled={isRefreshingPrices}
              >
                <RefreshCcw className={`h-4 w-4 ${isRefreshingPrices ? 'animate-spin' : ''}`} />
                <span className="ml-1 text-xs">
                  {isRefreshingPrices ? 'Aktualisiere...' : 'Aktualisieren'}
                </span>
              </Button>
            </div>
            
            <TabsContent value="crypto" className="pt-4">
              <div className="space-y-4">
                {cryptoData.map((crypto, index) => (
                  <CryptoItem 
                    key={index}
                    symbol={crypto.symbol} 
                    name={crypto.name} 
                    amount={crypto.amount} 
                    price={crypto.price}
                    value={crypto.value} 
                    change={crypto.change} 
                    iconColor={crypto.iconColor}
                    changeColor={crypto.changeColor}
                    logoUrl={crypto.logoUrl}
                    onClick={() => handleCryptoClick(crypto.symbol)}
                  />
                ))}
                <div className="pt-4 text-center">
                  <Button 
                    variant="ghost" 
                    className="text-green-500 hover:text-green-400 hover:bg-gray-800"
                    onClick={() => setIsManageCryptoOpen(true)}
                  >
                    Kryptos verwalten
                  </Button>
                </div>
              </div>
            </TabsContent>
            <TabsContent value="transactions" className="pt-4">
              <div className="space-y-4">
                {transactions.map((transaction) => (
                  <TransactionItem 
                    key={transaction.id}
                    transaction={transaction}
                    formatDate={formatDate}
                  />
                ))}
                {transactions.length === 0 && (
                  <div className="text-center py-8 text-gray-400">
                    <p>Keine Transaktionen gefunden</p>
                  </div>
                )}
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </div>
      
      <div className="mt-auto border-t border-gray-800">
        <div className="grid grid-cols-4 py-3">
          <NavItem 
            icon={<Home className="h-5 w-5" />} 
            label="Home" 
            active 
            onClick={() => handleNavItemClick('/wallet')}
          />
          <NavItem 
            icon={<RefreshCcw className="h-5 w-5" />} 
            label="Swap" 
            onClick={() => handleNavItemClick('/wallet')}
          />
          <NavItem 
            icon={<Compass className="h-5 w-5" />} 
            label="Discover" 
            onClick={() => handleNavItemClick('https://www.coindesk.com/')}
          />
          <NavItem 
            icon={<PlusSquare className="h-5 w-5" />} 
            label="Add to Home" 
            onClick={handleAddToHomeScreen}
          />
        </div>
      </div>
      
      <ManageCryptoDialog 
        isOpen={isManageCryptoOpen} 
        onClose={handleManageCryptoClose} 
      />
      
      <ManageWalletsDialog
        isOpen={isManageWalletsOpen}
        onClose={handleManageWalletsClose}
      />

      {/* Add to Home Screen Dialog */}
      <Dialog open={isAddToHomeDialogOpen} onOpenChange={setIsAddToHomeDialogOpen}>
        <DialogContent className="bg-gray-900 border border-gray-800 text-white">
          <DialogHeader>
            <DialogTitle>Zur Startseite hinzufügen</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <p className="text-sm text-gray-400">
              So fügen Sie diese App zu Ihrem iOS-Startbildschirm hinzu:
            </p>
            <ol className="list-decimal list-inside space-y-2 text-sm text-gray-300">
              <li>Tippen Sie auf das Teilen-Symbol <span className="bg-gray-700 px-2 py-1 rounded">Teilen</span> unten im Browser</li>
              <li>Scrollen Sie nach unten und tippen Sie auf "Zum Home-Bildschirm"</li>
              <li>Tippen Sie oben rechts auf "Hinzufügen"</li>
            </ol>
            <div className="pt-4">
              <p className="text-xs text-gray-400">
                So haben Sie schnellen Zugriff auf Ihre Wallet direkt vom Home-Bildschirm.
              </p>
            </div>
          </div>
          <DialogFooter>
            <Button 
              variant="wallet" 
              onClick={() => setIsAddToHomeDialogOpen(false)}
            >
              Verstanden
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

// Transaction Item Component
interface TransactionItemProps {
  transaction: Transaction;
  formatDate: (date: Date) => string;
}

const TransactionItem: React.FC<TransactionItemProps> = ({ transaction, formatDate }) => {
  // Determine icon and styles based on transaction type
  const getTransactionDetails = () => {
    switch(transaction.type) {
      case 'receive':
        return {
          icon: <RefreshCcw className="h-4 w-4 text-green-500" />,
          label: 'Empfangen',
          amountPrefix: '+',
          amountColor: 'text-green-500'
        };
      case 'send':
        return {
          icon: <RefreshCcw className="h-4 w-4 text-red-500 transform rotate-180" />,
          label: 'Gesendet',
          amountPrefix: '-',
          amountColor: 'text-red-500'
        };
      case 'swap':
        return {
          icon: <RefreshCcw className="h-4 w-4 text-blue-500" />,
          label: 'Getauscht',
          amountPrefix: '',
          amountColor: 'text-blue-500'
        };
      default:
        return {
          icon: <Clock className="h-4 w-4 text-gray-500" />,
          label: 'Unbekannt',
          amountPrefix: '',
          amountColor: 'text-gray-400'
        };
    }
  };

  const details = getTransactionDetails();

  return (
    <div className="p-3 bg-gray-800/50 rounded-lg">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-gray-700 rounded-full">
            {details.icon}
          </div>
          <div>
            <div className="font-medium">{details.label}</div>
            <div className="text-xs text-gray-400">{formatDate(transaction.date)}</div>
          </div>
        </div>
        <div className="text-right">
          <div className={details.amountColor}>
            {details.amountPrefix}{transaction.amount} {transaction.currency}
          </div>
          <div className="text-xs text-gray-400">
            {transaction.status === 'completed' ? 'Abgeschlossen' : 
             transaction.status === 'pending' ? 'Ausstehend' : 'Fehlgeschlagen'}
          </div>
        </div>
      </div>
      {transaction.address && (
        <div className="mt-2 pt-2 border-t border-gray-700">
          <div className="text-xs text-gray-400 flex justify-between">
            <span>Adresse:</span>
            <span className="truncate max-w-[200px]">{transaction.address}</span>
          </div>
        </div>
      )}
      {transaction.fee !== undefined && (
        <div className="mt-1">
          <div className="text-xs text-gray-400 flex justify-between">
            <span>Gebühr:</span>
            <span>{transaction.fee} {transaction.currency}</span>
          </div>
        </div>
      )}
    </div>
  );
};

const NavItem = ({ 
  icon, 
  label, 
  active = false, 
  onClick 
}: { 
  icon: React.ReactNode, 
  label: string, 
  active?: boolean,
  onClick?: () => void 
}) => (
  <button 
    className="flex flex-col items-center justify-center gap-1" 
    onClick={onClick}
  >
    <div className={`${active ? 'text-wallet-green' : 'text-gray-500'}`}>
      {icon}
    </div>
    <span className={`text-xs ${active ? 'text-white' : 'text-gray-500'}`}>{label}</span>
  </button>
);

interface CryptoItemProps { 
  symbol: string;
  name: string;
  amount: string;
  price: number;
  value: number;
  change: string;
  iconColor: string;
  changeColor: string;
  logoUrl: string;
  onClick: () => void;
}

const CryptoItem = ({ 
  symbol, 
  name, 
  amount, 
  price,
  value, 
  change, 
  iconColor,
  changeColor,
  logoUrl,
  onClick
}: CryptoItemProps) => {
  const formattedPrice = new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  }).format(price);
  
  return (
    <div 
      className="flex items-center justify-between p-2 hover:bg-gray-800 rounded-lg cursor-pointer transition-colors"
      onClick={onClick}
    >
      <div className="flex items-center">
        <div className={`w-8 h-8 rounded-full flex items-center justify-center mr-3 overflow-hidden`}>
          {logoUrl ? (
            <img src={logoUrl} alt={symbol} className="w-full h-full object-cover" />
          ) : (
            <div className={`w-full h-full ${iconColor} flex items-center justify-center`}>
              <span className="text-xs text-white font-bold">{symbol.substring(0, 2)}</span>
            </div>
          )}
        </div>
        <div>
          <div className="flex items-center">
            <span className="font-medium mr-2">{symbol}</span>
            <span className="text-xs py-0.5 px-2 bg-[#2C3140] text-gray-400 rounded">{name}</span>
          </div>
          <div className="flex items-center mt-1">
            <span className="text-xs text-gray-400">{formattedPrice}</span>
            <span className={`text-xs ${changeColor} ml-2`}>{change}</span>
          </div>
        </div>
      </div>
      <div className="text-right">
        <div>{amount}</div>
        <div className="text-xs text-gray-400 mt-1">
          ${value.toFixed(2)}
        </div>
      </div>
    </div>
  );
};

const WalletView: React.FC = () => {
  return (
    <div className="min-h-screen bg-wallet-darkBg flex justify-center w-full">
      <div className="w-full max-w-md mx-auto min-h-screen shadow-lg bg-wallet-darkBg">
        <MenuProvider>
          <WalletProvider>
            <WalletViewContent />
          </WalletProvider>
        </MenuProvider>
      </div>
    </div>
  );
};

export default WalletView;
