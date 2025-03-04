
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Shield, Copy, Eye, EyeOff } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { toast } from '@/components/ui/use-toast';
import { useWallet } from '@/contexts/WalletContext';
import { Card, CardContent } from '@/components/ui/card';
import Header from '@/components/Header';

const SecuritySettings = () => {
  const navigate = useNavigate();
  const { seedPhrase, copyToClipboard } = useWallet();
  const [showSeedPhrase, setShowSeedPhrase] = useState(false);
  const [timeLeft, setTimeLeft] = useState(5);
  const [buttonPressed, setButtonPressed] = useState(false);

  useEffect(() => {
    let timer: NodeJS.Timeout;
    
    if (buttonPressed && timeLeft > 0) {
      timer = setTimeout(() => {
        setTimeLeft(timeLeft - 1);
      }, 1000);
    } else if (timeLeft === 0) {
      setShowSeedPhrase(true);
      setButtonPressed(false);
    }
    
    return () => {
      if (timer) clearTimeout(timer);
    };
  }, [timeLeft, buttonPressed]);

  const handleRevealClick = () => {
    if (!buttonPressed) {
      setButtonPressed(true);
      setTimeLeft(5);
    } else {
      setButtonPressed(false);
    }
  };

  const handleCopySeedPhrase = () => {
    copyToClipboard(seedPhrase.join(' '));
    toast({
      title: "Kopiert!",
      description: "Seed-Phrase wurde in die Zwischenablage kopiert.",
    });
  };

  const resetView = () => {
    setShowSeedPhrase(false);
    setButtonPressed(false);
    setTimeLeft(5);
  };

  return (
    <div className="container max-w-md mx-auto px-4 py-6">
      <Header title="Sicherheitseinstellungen" showBack={true} />
      
      <div className="mt-8 space-y-6">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <Shield className="w-5 h-5 text-blue-600" />
                <h2 className="text-lg font-medium">Seed-Phrase anzeigen</h2>
              </div>
            </div>
            
            <p className="text-sm text-muted-foreground mb-4">
              Deine Seed-Phrase ist der Schlüssel zu deiner Wallet. Bewahre sie sicher auf und teile sie mit niemandem.
            </p>
            
            {!showSeedPhrase ? (
              <div className="text-center py-4">
                <Button 
                  onClick={handleRevealClick}
                  className="mb-2 w-full"
                  variant={buttonPressed ? "destructive" : "default"}
                >
                  {buttonPressed ? `Halte für ${timeLeft}s gedrückt` : "Seed-Phrase anzeigen"}
                  {buttonPressed ? <EyeOff className="ml-2 h-4 w-4" /> : <Eye className="ml-2 h-4 w-4" />}
                </Button>
                {buttonPressed && (
                  <p className="text-xs text-muted-foreground">
                    Halte den Button gedrückt, um die Seed-Phrase anzuzeigen
                  </p>
                )}
              </div>
            ) : (
              <div className="bg-muted rounded-md p-4 mb-4">
                <div className="grid grid-cols-3 gap-2 mb-4">
                  {seedPhrase.map((word, index) => (
                    <div key={index} className="bg-background rounded border px-2 py-1 text-sm">
                      <span className="text-muted-foreground mr-1">{index + 1}.</span> {word}
                    </div>
                  ))}
                </div>
                <div className="flex gap-2 mt-4">
                  <Button onClick={handleCopySeedPhrase} variant="outline" className="w-1/2">
                    <Copy className="mr-2 h-4 w-4" /> Kopieren
                  </Button>
                  <Button onClick={resetView} variant="outline" className="w-1/2">
                    <EyeOff className="mr-2 h-4 w-4" /> Verbergen
                  </Button>
                </div>
              </div>
            )}
            
            <p className="text-xs text-red-500 font-medium">
              WARNUNG: Gib niemals deine Seed-Phrase weiter. Jeder mit Zugriff auf diese Wörter kann deine Wallet kontrollieren.
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default SecuritySettings;
