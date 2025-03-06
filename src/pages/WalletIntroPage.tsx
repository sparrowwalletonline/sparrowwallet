
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Shield, Key, LockKeyhole, CheckCircle } from 'lucide-react';
import WalletLogo from '@/components/WalletLogo';
import { useWallet } from '@/contexts/WalletContext';
import { Checkbox } from '@/components/ui/checkbox';
import { toast } from '@/components/ui/use-toast';

const WalletIntroPage: React.FC = () => {
  const navigate = useNavigate();
  const { cancelWalletCreation } = useWallet();
  const [seedPhraseAgreement, setSeedPhraseAgreement] = useState(false);

  const handleReady = () => {
    if (!seedPhraseAgreement) {
      toast({
        title: "Bitte bestätigen",
        description: "Bitte bestätigen Sie, dass Sie Ihre Seed-Phrase nicht teilen werden.",
        variant: "destructive"
      });
      return;
    }
    
    document.body.classList.add('page-exit');
    setTimeout(() => {
      navigate('/generate-wallet');
      setTimeout(() => {
        document.body.classList.remove('page-exit');
      }, 50);
    }, 300);
  };

  const handleBack = () => {
    document.body.classList.add('page-exit');
    setTimeout(() => {
      cancelWalletCreation();
      navigate('/app');
      setTimeout(() => {
        document.body.classList.remove('page-exit');
      }, 50);
    }, 300);
  };

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-b from-white to-blue-50 text-gray-800 p-4 page-enter safe-area-inset-bottom">
      <div className="w-full relative flex items-center justify-center">
        <button 
          onClick={handleBack}
          className="absolute left-2 sm:left-4 top-0 bottom-0 my-auto text-gray-700 hover:text-gray-900 transition-colors h-10 w-10 flex items-center justify-center touch-manipulation z-10"
          aria-label="Back to wallet choice"
        >
          <ArrowLeft size={24} />
        </button>
        <div className="text-center">
          <h1 className="text-xl font-medium text-gray-800">Wallet erstellen</h1>
        </div>
      </div>

      <div className="flex-1 flex flex-col items-center justify-center py-8 max-w-md mx-auto">
        <div className="h-24 sm:h-28 w-24 sm:w-28 relative mb-6">
          <WalletLogo className="w-full h-full" useSparrowLogo={true} />
        </div>
        
        <h1 className="text-2xl sm:text-3xl font-bold text-center mb-6">
          Ihr Weg zur sicheren Wallet
        </h1>
        
        <p className="text-gray-600 text-center mb-8">
          In den nächsten Schritten erstellen wir Ihre persönliche und sichere Sparrow Wallet.
          Bitte folgen Sie den Anweisungen sorgfältig.
        </p>

        <div className="w-full space-y-6 mb-8">
          <div className="flex items-start space-x-4 bg-white p-4 rounded-lg shadow-md">
            <div className="bg-blue-100 p-2 rounded-full">
              <Key className="h-6 w-6 text-blue-600" />
            </div>
            <div>
              <h3 className="font-medium text-gray-800">1. Seed-Phrase generieren</h3>
              <p className="text-sm text-gray-600">Wir erstellen eine einzigartige Seed-Phrase für Ihre Wallet. Diese dient als Schlüssel zu Ihren Vermögenswerten.</p>
            </div>
          </div>
          
          <div className="flex items-start space-x-4 bg-white p-4 rounded-lg shadow-md">
            <div className="bg-blue-100 p-2 rounded-full">
              <Shield className="h-6 w-6 text-blue-600" />
            </div>
            <div>
              <h3 className="font-medium text-gray-800">2. Seed-Phrase sichern</h3>
              <p className="text-sm text-gray-600">Schreiben Sie Ihre Seed-Phrase auf und bewahren Sie sie an einem sicheren Ort auf. Sie ist der einzige Weg, um Ihre Wallet wiederherzustellen.</p>
            </div>
          </div>
          
          <div className="flex items-start space-x-4 bg-white p-4 rounded-lg shadow-md">
            <div className="bg-blue-100 p-2 rounded-full">
              <LockKeyhole className="h-6 w-6 text-blue-600" />
            </div>
            <div>
              <h3 className="font-medium text-gray-800">3. Seed-Phrase bestätigen</h3>
              <p className="text-sm text-gray-600">Zur Sicherheit bitten wir Sie, Ihre Seed-Phrase zu bestätigen, um sicherzustellen, dass Sie sie korrekt aufgeschrieben haben.</p>
            </div>
          </div>
          
          <div className="flex items-start space-x-4 bg-white p-4 rounded-lg shadow-md">
            <div className="bg-blue-100 p-2 rounded-full">
              <CheckCircle className="h-6 w-6 text-blue-600" />
            </div>
            <div>
              <h3 className="font-medium text-gray-800">4. Wallet einrichten</h3>
              <p className="text-sm text-gray-600">Nach erfolgreicher Bestätigung ist Ihre Wallet einsatzbereit, und Sie können sofort mit der Verwaltung Ihrer Assets beginnen.</p>
            </div>
          </div>
        </div>
        
        <div className="bg-red-50 rounded-lg p-4 border border-red-100 mb-8 w-full">
          <p className="text-sm text-red-700 font-medium">
            Wichtig: Teilen Sie Ihre Seed-Phrase niemals mit anderen Personen. Wir werden Sie niemals danach fragen. Bewahren Sie sie offline und sicher auf.
          </p>
        </div>

        <div className="flex items-start space-x-2 w-full mb-6">
          <Checkbox 
            id="seedPhraseAgreement" 
            checked={seedPhraseAgreement}
            onCheckedChange={(checked) => setSeedPhraseAgreement(checked === true)}
            className="data-[state=checked]:bg-blue-600 data-[state=checked]:text-white border-gray-300 mt-1"
          />
          <label 
            htmlFor="seedPhraseAgreement" 
            className="text-sm text-gray-700 cursor-pointer"
          >
            Verstanden, ich werde meine Seed-Phrase niemals teilen und bin mir bewusst, dass ich bei Verlust keinen Zugriff mehr auf meine Wallet habe.
          </label>
        </div>

        <Button 
          onClick={handleReady}
          className="w-full py-3 bg-blue-600 hover:bg-blue-700 text-white font-medium shadow-md hover:-translate-y-0.5 transition-all duration-300 text-base disabled:opacity-50 disabled:cursor-not-allowed"
          disabled={!seedPhraseAgreement}
        >
          Ich bin bereit!
        </Button>
      </div>
      
      <div className="flex justify-center pb-4">
        <p className="text-xs text-gray-500">Schritt 1 von 4: Einführung</p>
      </div>
    </div>
  );
};

export default WalletIntroPage;
