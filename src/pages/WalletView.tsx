import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { WalletProvider, useWallet } from '@/contexts/WalletContext';
import { MenuProvider } from '@/contexts/MenuContext';
import Header from '@/components/Header';
import WalletBalance from '@/components/WalletBalance';
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

interface TransactionItemProps {
  transaction: Transaction;
  formatDate: (date: Date) => string;
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
    enabledCryptos,
    refreshWalletBalance
  } = useWallet();
  const navigate = useNavigate();
  const [newWalletName, setNewWalletName] = useState('');
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isManageCryptoOpen, setIsManageCryptoOpen] = useState(false);
  const [isManageWalletsOpen, setIsManageWalletsOpen] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isRefreshingBalance, setIsRefreshingBalance] = useState(false);

  React.useEffect(() => {
    if (!hasWallet) {
      navigate('/');
    }
  }, [hasWallet, navigate]);

  React.useEffect(() => {
    const loadInitialWalletData = async () => {
      console.log("Initial wallet data loading");
      setIsRefreshingBalance(true);
      try {
        await Promise.all([
          refreshWalletBalance(),
          refreshPrices()
        ]);
        console.log("Initial wallet data loaded successfully");
      } catch (error) {
        console.error("Error loading initial wallet data:", error);
      } finally {
        setIsRefreshingBalance(false);
      }
    };
    
    loadInitialWalletData();
    
    const loadWalletData = async () => {
      console.log("Auto-refreshing wallet data");
      setIsRefreshingBalance(true);
      try {
        await refreshWalletBalance();
        await refreshPrices();
      } catch (error) {
        console.error("Error auto-refreshing wallet data:", error);
      } finally {
        setIsRefreshingBalance(false);
      }
    };
    
    const autoRefreshInterval = setInterval(loadWalletData, 30000); // Refresh every 30 seconds
    
    const handleVisibilityChange = () => {
      if (document.visibilityState === 'visible') {
        console.log("App became visible - refreshing wallet data");
        loadWalletData();
      }
    };
    
    document.addEventListener('visibilitychange', handleVisibilityChange);
    
    return () => {
      clearInterval(autoRefreshInterval);
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const btcValue = (btcBalance * btcPrice).toFixed(2);
  const ethValue = (ethBalance * ethPrice).toFixed(2);
  
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  
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

  const handleRefreshBalance = async () => {
    setIsRefreshingBalance(true);
    try {
      await refreshWalletBalance();
    } finally {
      setIsRefreshingBalance(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-background text-foreground">
      <Header title="Sparrow" />
      
      <div className="px-0">
        <div className="flex items-center justify-between pl-4 pr-4">
          <DropdownMenu open={isDropdownOpen} onOpenChange={handleDropdownOpenChange}>
            <DropdownMenuTrigger asChild>
              <button className="flex items-center gap-2 bg-transparent hover:bg-secondary rounded-lg px-2 py-1 transition-colors">
                <Shield className="h-4 w-4 text-primary" />
                <span className="text-xs text-muted-foreground">{activeWallet?.name || "Main wallet"}</span>
                <ChevronDown className="h-3 w-3 text-muted-foreground" />
              </button>
            </DropdownMenuTrigger>
            
            <DropdownMenuContent className="bg-popover border border-border text-popover-foreground z-50 min-w-[200px]">
              {wallets.map((wallet) => (
                <DropdownMenuItem 
                  key={wallet.id} 
                  className="flex items-center justify-between cursor-pointer hover:bg-secondary text-sm py-2"
                  onClick={() => {
                    setActiveWallet(wallet.id);
                    setIsDropdownOpen(false);
                  }}
                >
                  <div className="flex items-center gap-2">
                    <Shield className="h-4 w-4 text-primary" />
                    <span>{wallet.name}</span>
                  </div>
                  {wallet.isActive && <Check className="h-4 w-4 text-primary" />}
                </DropdownMenuItem>
              ))}
              <DropdownMenuSeparator className="bg-border" />
              <div className="p-2 gap-2 flex flex-col">
                <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                  <DialogTrigger asChild>
                    <Button variant="outline" size="sm" className="w-full bg-secondary hover:bg-secondary/80 border-border flex gap-2 text-foreground">
                      <Plus className="h-4 w-4" />
                      <span className="text-sm">Neue Wallet hinzufügen</span>
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="bg-popover border border-border text-popover-foreground">
                    <DialogHeader>
                      <DialogTitle>Neue Wallet hinzufügen</DialogTitle>
                    </DialogHeader>
                    <Input
                      placeholder="Wallet Name"
                      value={newWalletName}
                      onChange={(e) => setNewWalletName(e.target.value)}
                      className="bg-input border-input text-foreground"
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
                  className="w-full bg-secondary hover:bg-secondary/80 border-border flex gap-2 text-foreground"
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
          
          <Button
            variant="ghost"
            size="sm"
            className="text-muted-foreground hover:text-foreground"
            onClick={handleRefreshBalance}
            disabled={isRefreshingBalance}
          >
            <RefreshCcw className={`h-4 w-4 ${isRefreshingBalance ? 'animate-spin' : ''}`} />
            <span className="ml-1 text-xs">
              {isRefreshingBalance ? 'Aktualisiere...' : 'Wallet'}
            </span>
          </Button>
        </div>
      </div>
      
      <div className="flex-1 flex flex-col px-4">
        <WalletBalance />
        
        <div className="mt-6">
          <Tabs defaultValue="crypto" className="w-full">
            <div className="flex justify-between items-center border-b border-border">
              <TabsList className="flex bg-transparent">
                <TabsTrigger 
                  value="crypto" 
                  className="tabs-trigger data-[state=active]:border-b-2 data-[state=active]:border-primary rounded-md bg-transparent text-muted-foreground mx-1 px-3"
                >
                  Crypto
                </TabsTrigger>
                <TabsTrigger 
                  value="transactions" 
                  className="tabs-trigger data-[state=active]:border-b-2 data-[state=active]:border-primary rounded-md bg-transparent text-muted-foreground mx-1 px-3"
                >
                  Transaktionen
                </TabsTrigger>
              </TabsList>
              
              <Button
                variant="ghost"
                size="sm"
                className="text-muted-foreground hover:text-foreground"
                onClick={refreshPrices}
                disabled={isRefreshingPrices}
              >
                <RefreshCcw className={`h-4 w-4 ${isRefreshingPrices ? 'animate-spin' : ''}`} />
                <span className="ml-1 text-xs">
                  {isRefreshingPrices ? 'Aktualisiere...' : 'Preise'}
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
                    className="text-primary hover:text-primary hover:bg-secondary"
                    onClick={() => setIsManageCryptoOpen(true)}
                  >
                    Kryptos verwalten
                  </Button>
                </div>
              </div>
            </TabsContent>
            <TabsContent value="transactions" className="pt-4">
              <div className="space-y-4">
                {transactions.length === 0 && (
                  <div className="text-center py-12 text-muted-foreground flex flex-col items-center gap-2">
                    <Clock className="h-10 w-10 text-muted-foreground/50" />
                    <p className="text-lg">Keine Transaktionen gefunden</p>
                    <p className="text-sm max-w-xs">Deine Transaktionshistorie wird hier angezeigt, sobald du Krypto sendest oder empfängst.</p>
                  </div>
                )}
                {transactions.map((transaction) => (
                  <TransactionItem 
                    key={transaction.id}
                    transaction={transaction}
                    formatDate={formatDate}
                  />
                ))}
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </div>
      
      <div className="mt-auto border-t border-border">
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

      <Dialog open={isAddToHomeDialogOpen} onOpenChange={setIsAddToHomeDialogOpen}>
        <DialogContent className="bg-popover border border-border text-popover-foreground">
          <DialogHeader>
            <DialogTitle>Zur Startseite hinzufügen</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <p className="text-sm text-muted-foreground">
              So fügen Sie diese App zu Ihrem iOS-Startbildschirm hinzu:
            </p>
            <ol className="list-decimal list-inside space-y-2 text-sm text-muted-foreground">
              <li>Tippen Sie auf das Teilen-Symbol <span className="bg-secondary px-2 py-1 rounded">Teilen</span> unten im Browser</li>
              <li>Scrollen Sie nach unten und tippen Sie auf "Zum Home-Bildschirm"</li>
              <li>Tippen Sie oben rechts auf "Hinzufügen"</li>
            </ol>
            <div className="pt-4">
              <p className="text-xs text-muted-foreground">
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

const TransactionItem: React.FC<TransactionItemProps> = ({ transaction, formatDate }) => {
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
          icon: <Clock className="h-4 w-4 text-muted-foreground" />,
          label: 'Unbekannt',
          amountPrefix: '',
          amountColor: 'text-muted-foreground'
        };
    }
  };

  const details = getTransactionDetails();

  return (
    <div className="p-3 bg-secondary/50 rounded-lg">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-secondary rounded-full">
            {details.icon}
          </div>
          <div>
            <div className="font-medium">{details.label}</div>
            <div className="text-xs text-muted-foreground">{formatDate(transaction.date)}</div>
          </div>
        </div>
        <div className="text-right">
          <div className={details.amountColor}>
            {details.amountPrefix}{transaction.amount} {transaction.currency}
          </div>
          <div className="text-xs text-muted-foreground">
            {transaction.status === 'completed' ? 'Abgeschlossen' : 
             transaction.status === 'pending' ? 'Ausstehend' : 'Fehlgeschlagen'}
          </div>
        </div>
      </div>
      {transaction.address && (
        <div className="mt-2 pt-2 border-t border-border">
          <div className="text-xs text-muted-foreground flex justify-between">
            <span>Adresse:</span>
            <span className="truncate max-w-[200px]">{transaction.address}</span>
          </div>
        </div>
      )}
      {transaction.fee !== undefined && (
        <div className="mt-1">
          <div className="text-xs text-muted-foreground flex justify-between">
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
      className="flex items-center justify-between p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg cursor-pointer transition-colors"
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
            <span className="text-xs py-0.5 px-2 bg-gray-100 dark:bg-[#2C3140] text-gray-500 dark:text-gray-400 rounded">{name}</span>
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
    <div className="min-h-screen bg-background flex justify-center w-full">
      <div className="w-full max-w-md mx-auto min-h-screen shadow-lg bg-background">
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

