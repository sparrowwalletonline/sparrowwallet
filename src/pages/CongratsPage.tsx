
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { CheckCircle } from 'lucide-react';

const CongratsPage: React.FC = () => {
  const navigate = useNavigate();
  const [iconVisible, setIconVisible] = useState(false);
  const [textVisible, setTextVisible] = useState(false);
  const [buttonVisible, setButtonVisible] = useState(false);

  useEffect(() => {
    // Staggered animation sequence
    setTimeout(() => setIconVisible(true), 300);
    setTimeout(() => setTextVisible(true), 800);
    setTimeout(() => setButtonVisible(true), 1300);
  }, []);

  const handleOpenWallet = () => {
    navigate('/wallet');
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-wallet-darkBg text-white p-6">
      <div className="w-full max-w-md mx-auto flex flex-col items-center justify-center text-center">
        <div className={`transform transition-all duration-700 ${iconVisible ? 'scale-100 opacity-100' : 'scale-0 opacity-0'}`}>
          <CheckCircle 
            className="h-24 w-24 text-wallet-green mb-6 animate-pulse" 
            strokeWidth={1.5}
          />
        </div>
        
        <div className={`transform transition-all duration-500 ${textVisible ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}`}>
          <h1 className="text-3xl font-bold mb-2">Herzlichen Glückwunsch!</h1>
          
          <p className="text-lg text-wallet-gray mb-8">
            Deine Wallet wurde erstellt!
          </p>
        </div>
        
        <div className={`w-full transform transition-all duration-500 ${buttonVisible ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}`}>
          <Button 
            onClick={handleOpenWallet}
            variant="wallet"
            className="w-full px-6 py-6 text-lg"
          >
            Wallet öffnen!
          </Button>
        </div>
      </div>
    </div>
  );
};

export default CongratsPage;
