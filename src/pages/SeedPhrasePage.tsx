
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Shield, Check, ArrowLeft, LogIn } from 'lucide-react';
import { useWallet } from '@/contexts/WalletContext';
import { useToast } from '@/components/ui/use-toast';
import { Link, useNavigate } from 'react-router-dom';
import SeedPhraseGenerator from '@/components/SeedPhraseGenerator';

const SeedPhrasePage: React.FC = () => {
  const { seedPhrase, cancelWalletCreation, session } = useWallet();
  const { toast } = useToast();
  const navigate = useNavigate();
  const [savedPhrase, setSavedPhrase] = useState(false);
  const [agreedToTerms, setAgreedToTerms] = useState(false);
  
  // Pre-fill checkboxes if coming back from validation page
  useEffect(() => {
    if (seedPhrase && seedPhrase.length >= 12) {
      setSavedPhrase(true);
      setAgreedToTerms(true);
    }
  }, [seedPhrase]);
  
  const handleConfirm = () => {
    if (savedPhrase && agreedToTerms) {
      navigate('/seed-phrase-validation');
    }
  };
  
  const handleBackClick = () => {
    cancelWalletCreation();
    navigate('/passphrase');
  };
  
  return (
    <div className="min-h-screen flex flex-col bg-wallet-darkBg text-white p-6 animate-fade-in">
      <div className="absolute top-6 left-6">
        <button 
          onClick={handleBackClick}
          className="text-white hover:text-gray-300 transition-colors"
          aria-label="Back"
        >
          <ArrowLeft size={24} />
        </button>
      </div>
      
      <div className="w-full text-center mt-6">
        <h1 className="font-heading text-xl font-medium">Wallet erstellen (Test Page)</h1>
        {!session && (
          <div className="mt-2 text-sm text-wallet-gray">
            <span>Melde dich an, um deine Seed Phrase in der Cloud zu sichern </span>
            <Link 
              to="/auth" 
              className="text-wallet-blue hover:underline inline-flex items-center"
            >
              <LogIn size={14} className="mr-1" />
              Anmelden
            </Link>
          </div>
        )}
      </div>
      
      <div className="flex-1 flex flex-col items-center justify-center py-6">
        <img 
          src="/lovable-uploads/592e4215-1f4a-4c0d-a1e9-504a24191442.png" 
          alt="Wallet Logo" 
          className="w-24 h-24 mb-6"
        />
        
        <div className="w-full max-w-sm space-y-6">
          <div className="text-left">
            <h2 className="text-xl font-bold mb-2">Deine Seed Phrase</h2>
            <p className="text-wallet-gray text-sm mb-4">
              Schreibe diese Wörter in der richtigen Reihenfolge auf. Bewahre sie sicher auf und teile sie mit niemandem.
            </p>
            
            {session && (
              <div className="bg-green-800/30 border border-green-600/50 rounded p-2 mb-4">
                <p className="text-green-400 text-xs">
                  Test Page: Seed Phrase wird ohne Verschlüsselung in deinem Account gespeichert.
                </p>
              </div>
            )}
          </div>
          
          <SeedPhraseGenerator />
          
          <div className="bg-wallet-card rounded-lg p-4 border border-gray-700 shadow-sm">
            <div className="flex items-start gap-3">
              <Shield className="h-5 w-5 text-wallet-green mt-0.5 flex-shrink-0" />
              <div>
                <h3 className="font-medium text-sm mb-1">Bewahre deine Phrase sicher auf</h3>
                <p className="text-xs text-wallet-gray">
                  Deine Seed Phrase ist der einzige Weg, um deine Wallet wiederherzustellen, falls du den Zugriff verlierst. 
                  Schreibe sie auf und bewahre sie an einem sicheren Ort auf.
                </p>
              </div>
            </div>
          </div>
          
          <div className="space-y-3 mt-4">
            <label className="flex items-start gap-2 cursor-pointer">
              <div className="flex items-center h-5 mt-0.5">
                <input
                  type="checkbox"
                  checked={savedPhrase}
                  onChange={(e) => setSavedPhrase(e.target.checked)}
                  className="h-4 w-4 rounded border-gray-600 text-wallet-blue focus:ring-wallet-blue"
                />
              </div>
              <span className="text-sm text-wallet-gray">
                Ich habe die Seed Phrase an einem sicheren Ort gespeichert
              </span>
            </label>
            
            <label className="flex items-start gap-2 cursor-pointer">
              <div className="flex items-center h-5 mt-0.5">
                <input
                  type="checkbox"
                  checked={agreedToTerms}
                  onChange={(e) => setAgreedToTerms(e.target.checked)}
                  className="h-4 w-4 rounded border-gray-600 text-wallet-blue focus:ring-wallet-blue"
                />
              </div>
              <span className="text-sm text-wallet-gray">
                Ich stimme den <Link to="/terms" className="text-wallet-blue underline">Nutzungsbedingungen</Link> zu
              </span>
            </label>
          </div>
          
          <Button 
            onClick={handleConfirm}
            className="w-full py-6 bg-wallet-blue hover:bg-wallet-darkBlue text-white font-medium disabled:opacity-50 disabled:cursor-not-allowed"
            disabled={!savedPhrase || !agreedToTerms}
          >
            {savedPhrase && agreedToTerms ? (
              <>
                <Check size={16} className="mr-2" />
                Bestätigen
              </>
            ) : (
              "Bestätigen"
            )}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default SeedPhrasePage;
