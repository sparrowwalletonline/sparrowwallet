
import React, { useEffect } from 'react';
import { X, Trash2, Shield, Check } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { useWallet } from '@/contexts/WalletContext';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";

interface ManageWalletsDialogProps {
  isOpen: boolean;
  onClose: () => void;
}

const ManageWalletsDialog: React.FC<ManageWalletsDialogProps> = ({ isOpen, onClose }) => {
  const { wallets, setActiveWallet, deleteWallet } = useWallet();

  const handleDeleteWallet = (walletId: string) => {
    deleteWallet(walletId);
  };

  const handleSetActiveWallet = (walletId: string) => {
    setActiveWallet(walletId);
  };

  const isMainWallet = (name: string) => {
    return name === 'Main Wallet';
  };

  // Ensure clean close without triggering additional state changes
  const handleDialogClose = () => {
    onClose();
  };

  return (
    <Dialog 
      open={isOpen} 
      onOpenChange={(open) => {
        if (!open) handleDialogClose();
      }}
    >
      <DialogContent className="bg-gray-900 border border-gray-800 text-white p-0 max-w-md max-h-[85vh] overflow-hidden flex flex-col" onInteractOutside={handleDialogClose} onEscapeKeyDown={handleDialogClose}>
        {/* Header */}
        <DialogHeader className="px-4 py-3 border-b border-gray-800">
          <div className="flex items-center justify-between">
            <DialogTitle>Wallets verwalten</DialogTitle>
            <Button 
              variant="ghost" 
              size="icon" 
              className="text-gray-400 hover:text-white"
              onClick={handleDialogClose}
            >
              <X className="h-5 w-5" />
            </Button>
          </div>
        </DialogHeader>
        
        {/* Wallet List */}
        <div className="flex-1 overflow-y-auto p-4">
          <div className="space-y-4">
            {wallets.map((wallet) => (
              <div 
                key={wallet.id} 
                className="flex items-center justify-between p-3 bg-gray-800 rounded-lg"
              >
                <div className="flex items-center gap-3">
                  <Shield className="h-5 w-5 text-green-500" />
                  <div>
                    <div className="font-medium">{wallet.name}</div>
                    <div className="text-xs text-gray-400 mt-1">{wallet.walletAddress.substring(0, 15)}...</div>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  {wallet.isActive ? (
                    <div className="flex items-center text-xs text-green-500 gap-1 bg-green-900/20 px-2 py-1 rounded">
                      <Check className="h-3 w-3" />
                      <span>Aktiv</span>
                    </div>
                  ) : (
                    <Button 
                      variant="outline" 
                      size="sm" 
                      className="bg-gray-700 hover:bg-gray-600 border-gray-600 text-xs"
                      onClick={() => handleSetActiveWallet(wallet.id)}
                    >
                      Aktivieren
                    </Button>
                  )}
                  
                  {!isMainWallet(wallet.name) && (
                    <AlertDialog>
                      <AlertDialogTrigger asChild>
                        <Button 
                          variant="outline" 
                          size="icon" 
                          className="bg-gray-700 hover:bg-red-900/50 border-gray-600 h-8 w-8"
                        >
                          <Trash2 className="h-4 w-4 text-red-500" />
                        </Button>
                      </AlertDialogTrigger>
                      <AlertDialogContent className="bg-gray-900 border border-gray-800 text-white">
                        <AlertDialogHeader>
                          <AlertDialogTitle>Wallet löschen</AlertDialogTitle>
                          <AlertDialogDescription className="text-gray-400">
                            Bist du sicher, dass du die Wallet "{wallet.name}" löschen möchtest? 
                            Diese Aktion kann nicht rückgängig gemacht werden.
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel className="bg-gray-800 hover:bg-gray-700 border-gray-700 text-white">
                            Abbrechen
                          </AlertDialogCancel>
                          <AlertDialogAction 
                            className="bg-red-600 hover:bg-red-700 text-white"
                            onClick={() => handleDeleteWallet(wallet.id)}
                          >
                            Löschen
                          </AlertDialogAction>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ManageWalletsDialog;
