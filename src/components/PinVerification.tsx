
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { toast } from '@/hooks/use-toast';
import { Lock, KeyRound, ArrowLeft } from 'lucide-react';
import { useWallet } from '@/contexts/WalletContext';
import { Card } from '@/components/ui/card';

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
      
      // After 3 failed attempts, redirect to wallet choice instead of auth
      if (attempts >= 2) {
        toast({
          title: "Zu viele Versuche",
          description: "Aus Sicherheitsgründen müssen Sie erneut beginnen",
          variant: "destructive",
          duration: 3000,
        });
        setTimeout(() => {
          navigate('/app');
        }, 1500);
      }
    }
  };
  
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-b from-white to-blue-50 p-4 relative">
      <Card className="w-full max-w-md bg-white p-8 rounded-xl shadow-lg border border-blue-100">
        <button 
          onClick={() => navigate('/app')} 
          className="absolute top-4 left-4 text-gray-500 hover:text-gray-700"
          aria-label="Back"
        >
          <ArrowLeft size={20} />
        </button>
        
        <div className="flex justify-center mb-6">
          <div className="relative">
            <div className="absolute inset-0 bg-blue-100 rounded-full blur-lg opacity-60"></div>
            <div className="bg-blue-500/10 p-4 rounded-full relative z-10">
              <KeyRound className="h-8 w-8 text-wallet-blue" />
            </div>
          </div>
        </div>
        
        <h1 className="text-2xl font-bold text-center text-gray-800 mb-4">
          PIN-Eingabe erforderlich
        </h1>
        
        <p className="text-center text-gray-600 mb-6">
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
              className="text-center text-xl h-14 bg-white border-gray-300 focus:border-wallet-blue"
            />
          </div>
          
          <Button
            type="submit"
            className="w-full bg-wallet-blue hover:bg-wallet-darkBlue text-white py-6 h-12"
            disabled={!pin}
          >
            Bestätigen
          </Button>
          
          <div className="text-center">
            <button
              type="button"
              onClick={() => navigate('/app')}
              className="text-wallet-blue hover:underline text-sm"
            >
              Stattdessen neue Wallet erstellen
            </button>
          </div>
        </form>
      </Card>
    </div>
  );
};

export default PinVerification;
