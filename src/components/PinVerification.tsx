
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { toast } from '@/hooks/use-toast';
import { Lock } from 'lucide-react';
import { useWallet } from '@/contexts/WalletContext';

interface PinVerificationProps {
  onSuccess: () => void;
}

const PinVerification: React.FC<PinVerificationProps> = ({ onSuccess }) => {
  const [pin, setPin] = useState('');
  const [attempts, setAttempts] = useState(0);
  const { verifyPin } = useWallet();
  const navigate = useNavigate();
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (verifyPin(pin)) {
      onSuccess();
      toast({
        title: "Zugriff gewährt",
        description: "PIN-Verifizierung erfolgreich",
        duration: 3000,
      });
    } else {
      setAttempts(prev => prev + 1);
      setPin('');
      toast({
        title: "Ungültige PIN",
        description: "Bitte versuchen Sie es erneut",
        variant: "destructive",
        duration: 3000,
      });
      
      // After 3 failed attempts, log out and redirect to login
      if (attempts >= 2) {
        toast({
          title: "Zu viele Versuche",
          description: "Aus Sicherheitsgründen müssen Sie sich erneut anmelden",
          variant: "destructive",
          duration: 3000,
        });
        setTimeout(() => {
          navigate('/auth');
        }, 1500);
      }
    }
  };
  
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-wallet-darkBg p-4 relative">
      <div className="w-full max-w-md bg-wallet-card p-8 rounded-xl shadow-lg border border-gray-800">
        <div className="flex justify-center mb-6">
          <div className="bg-blue-500/10 p-3 rounded-full">
            <Lock className="h-8 w-8 text-blue-500" />
          </div>
        </div>
        
        <h1 className="text-2xl font-bold text-center text-white mb-6">
          PIN-Eingabe erforderlich
        </h1>
        
        <p className="text-center text-gray-300 mb-6">
          Bitte geben Sie Ihre PIN ein, um auf Ihre Wallet zuzugreifen
        </p>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Input
              type="password"
              value={pin}
              onChange={(e) => setPin(e.target.value)}
              placeholder="PIN eingeben"
              maxLength={8}
              inputMode="numeric"
              pattern="[0-9]*"
              autoFocus
              className="text-center text-xl h-14"
            />
          </div>
          
          <Button
            type="submit"
            className="w-full bg-wallet-blue hover:bg-wallet-darkBlue text-white py-6"
            disabled={!pin}
          >
            Bestätigen
          </Button>
          
          <div className="text-center">
            <button
              type="button"
              onClick={() => navigate('/auth')}
              className="text-wallet-blue hover:underline text-sm"
            >
              Stattdessen anmelden
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default PinVerification;
