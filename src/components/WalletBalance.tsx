import React, { useState, useEffect } from 'react';
import { toast } from '@/components/ui/use-toast';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { useWallet } from '@/contexts/WalletContext';
import { ConfirmDialog } from '@/components/ConfirmDialog';
import { copyToClipboard } from '@/utils/clipboardUtils';
import { QrCode } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle, AlertTriangle } from "@/components/ui/alert"

// Make sure to add these imports
import { UserSearch } from '@/components/UserSearch';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

interface WalletBalanceProps {
  btcPrice: number;
}

const WalletBalance: React.FC<WalletBalanceProps> = ({ btcPrice }) => {
  const { 
    balance, 
    btcBalance, 
    usdBalance, 
    walletAddress, 
    copyToClipboard: copyToClipboardContext,
    activeWallet
  } = useWallet();
  const [sendDialogOpen, setSendDialogOpen] = useState(false);
  const [confirmDialogOpen, setConfirmDialogOpen] = useState(false);
  const [recipientAddress, setRecipientAddress] = useState('');
  const [amount, setAmount] = useState(0);
  const [selectedTab, setSelectedTab] = useState<'address' | 'user'>('address');
  const [selectedUser, setSelectedUser] = useState<{ address: string, username: string } | null>(null);

  const handleCopyToClipboard = () => {
    copyToClipboard(walletAddress);
    toast({
      title: "Adresse kopiert",
      description: "Wallet-Adresse wurde in die Zwischenablage kopiert.",
    })
  };

  const sendDialog = (
    <Dialog open={sendDialogOpen} onOpenChange={setSendDialogOpen}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Senden</DialogTitle>
        </DialogHeader>
        
        <div className="space-y-4">
          <Alert variant="warning" className="bg-amber-50 dark:bg-amber-950 text-amber-800 dark:text-amber-200">
            <AlertTriangle className="h-4 w-4" />
            <AlertTitle>Wichtig</AlertTitle>
            <AlertDescription>
              Nur BTC über das Bitcoin-Netzwerk senden. Andere Kryptowährungen oder Netzwerke werden nicht unterstützt.
            </AlertDescription>
          </Alert>

          <Tabs value={selectedTab} onValueChange={(v) => setSelectedTab(v as 'address' | 'user')}>
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="address">BTC-Adresse</TabsTrigger>
              <TabsTrigger value="user">Registrierter Nutzer</TabsTrigger>
            </TabsList>
            
            <TabsContent value="address" className="mt-4">
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="address">Bitcoin-Adresse</Label>
                  <Input 
                    id="address" 
                    placeholder="Bitcoin-Adresse eingeben" 
                    value={recipientAddress}
                    onChange={(e) => setRecipientAddress(e.target.value)}
                  />
                </div>
              </div>
            </TabsContent>
            
            <TabsContent value="user" className="mt-4">
              <div className="space-y-4">
                {selectedUser ? (
                  <div className="space-y-2">
                    <Label>Ausgewählter Nutzer</Label>
                    <div className="p-3 border rounded-md flex justify-between items-center">
                      <div>
                        <div className="font-medium">{selectedUser.username}</div>
                        <div className="text-xs text-muted-foreground truncate max-w-[220px]">
                          {selectedUser.address}
                        </div>
                      </div>
                      <Button 
                        variant="ghost" 
                        size="sm"
                        onClick={() => setSelectedUser(null)}
                      >
                        Ändern
                      </Button>
                    </div>
                  </div>
                ) : (
                  <UserSearch 
                    onSelectUser={(address, username) => {
                      setSelectedUser({ address, username });
                      setRecipientAddress(address);
                    }} 
                  />
                )}
              </div>
            </TabsContent>
          </Tabs>

          <div className="space-y-2">
            <Label htmlFor="amount">Betrag (BTC)</Label>
            <Input 
              id="amount" 
              type="number" 
              step="0.00000001"
              min="0"
              placeholder="BTC-Betrag eingeben" 
              value={amount}
              onChange={(e) => setAmount(Number(e.target.value))}
            />
            <div className="text-sm text-right text-muted-foreground">
              ≈ {(amount * btcPrice).toFixed(2)} USD
            </div>
          </div>

          <div className="flex justify-end space-x-2 pt-4">
            <Button variant="outline" onClick={() => setSendDialogOpen(false)}>
              Abbrechen
            </Button>
            <Button 
              onClick={() => {
                setConfirmDialogOpen(true);
                setSendDialogOpen(false);
              }}
              disabled={!amount || amount <= 0 || (!recipientAddress && !selectedUser)}
            >
              Vorschau
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );

  return (
    <div className="grid gap-4">
      <div className="grid gap-2">
        <h2 className="text-lg font-semibold">Wallet</h2>
        <p className="text-muted-foreground">
          Aktuelle Wallet: {activeWallet?.name}
        </p>
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-1">
            <p className="text-sm font-medium">Wallet-Adresse</p>
            <div className="flex items-center">
              <Input 
                className="cursor-pointer truncate" 
                readOnly 
                value={walletAddress} 
                onClick={handleCopyToClipboard}
              />
              <Button variant="ghost" size="icon" onClick={handleCopyToClipboard}>
                <QrCode className="h-4 w-4" />
              </Button>
            </div>
          </div>
          <div className="space-y-1">
            <p className="text-sm font-medium">BTC-Guthaben</p>
            <p className="text-lg font-semibold">{btcBalance} BTC</p>
          </div>
          <div className="space-y-1">
            <p className="text-sm font-medium">USD-Guthaben</p>
            <p className="text-lg font-semibold">${usdBalance.toFixed(2)}</p>
          </div>
          <div className="space-y-1">
            <DialogTrigger asChild>
              <Button onClick={() => setRecipientAddress('')} className="w-full">
                Senden
              </Button>
            </DialogTrigger>
          </div>
        </div>
      </div>

      {sendDialog}

      <ConfirmDialog
        open={confirmDialogOpen}
        setOpen={setConfirmDialogOpen}
        recipientAddress={recipientAddress}
        amount={amount}
        btcPrice={btcPrice}
      />
    </div>
  );
};

export default WalletBalance;
