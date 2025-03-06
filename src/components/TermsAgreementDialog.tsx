
import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { FileText, Shield, Lock } from 'lucide-react';
import { Link } from 'react-router-dom';

interface TermsAgreementDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onAccept: () => void;
}

const TermsAgreementDialog: React.FC<TermsAgreementDialogProps> = ({
  isOpen,
  onClose,
  onAccept,
}) => {
  const [agreed, setAgreed] = React.useState(false);

  const handleAccept = () => {
    if (agreed) {
      onAccept();
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-md bg-wallet-card text-white border-gray-800">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-xl">
            <FileText className="h-5 w-5 text-wallet-blue" />
            Terms of Service
          </DialogTitle>
          <DialogDescription className="text-gray-400">
            Please review and accept our Terms of Service before creating your wallet.
          </DialogDescription>
        </DialogHeader>
        
        <div className="space-y-4 my-4 max-h-[50vh] overflow-y-auto pr-2 text-sm">
          <div className="flex gap-3 bg-gray-800/50 p-3 rounded-md">
            <Shield className="h-5 w-5 text-wallet-blue flex-shrink-0 mt-0.5" />
            <div>
              <h4 className="font-medium mb-1">Wallet Security</h4>
              <p className="text-gray-400">
                You are solely responsible for maintaining the security of your wallet.
                We strongly recommend storing your seed phrase in a secure location.
              </p>
            </div>
          </div>
          
          <div className="flex gap-3 bg-gray-800/50 p-3 rounded-md">
            <Lock className="h-5 w-5 text-wallet-blue flex-shrink-0 mt-0.5" />
            <div>
              <h4 className="font-medium mb-1">Your Private Keys</h4>
              <p className="text-gray-400">
                We do not store your private keys or seed phrase. If you lose access to your 
                seed phrase, we cannot help you recover your wallet.
              </p>
            </div>
          </div>
          
          <p className="text-gray-400">
            By creating a wallet, you acknowledge that you have read and understood our full 
            <Link to="/terms" className="text-wallet-blue hover:underline ml-1" target="_blank">
              Terms of Service
            </Link>.
          </p>
        </div>
        
        <div className="flex items-start space-x-2 my-2">
          <Checkbox 
            id="terms" 
            checked={agreed} 
            onCheckedChange={(checked) => setAgreed(checked === true)}
            className="data-[state=checked]:bg-wallet-blue data-[state=checked]:border-wallet-blue"
          />
          <Label 
            htmlFor="terms" 
            className="text-sm font-normal leading-none cursor-pointer text-gray-300"
          >
            I have read and agree to the Terms of Service
          </Label>
        </div>

        <DialogFooter className="sm:justify-between flex-col sm:flex-row gap-3 mt-2">
          <Button 
            variant="ghost" 
            onClick={onClose} 
            className="text-gray-400 hover:text-white hover:bg-gray-800"
          >
            Cancel
          </Button>
          <Button 
            onClick={handleAccept} 
            disabled={!agreed} 
            className="bg-wallet-blue hover:bg-wallet-darkBlue text-white"
          >
            Accept & Continue
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default TermsAgreementDialog;
