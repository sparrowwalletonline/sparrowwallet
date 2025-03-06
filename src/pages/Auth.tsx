
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/hooks/use-toast';
import { Mail, Lock, Eye, EyeOff, ArrowLeft, CheckCircle } from 'lucide-react';
import { useWallet } from '@/contexts/WalletContext';
import Header from '@/components/Header';

const Auth: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();
  const { hasWallet, loadFromSupabase, session, loadWalletFromUserAccount } = useWallet();
  
  useEffect(() => {
    if (session) {
      checkUserWallet();
    }
  }, [session]);
  
  const checkUserWallet = async () => {
    const walletLoaded = await loadWalletFromUserAccount();
    
    if (walletLoaded) {
      navigate('/wallet');
      return;
    }
    
    if (hasWallet) {
      navigate('/wallet');
      return;
    }
    
    const seedPhraseLoaded = await loadFromSupabase();
    
    if (seedPhraseLoaded) {
      navigate('/wallet');
    } else {
      navigate('/generate-wallet');
    }
  };
  
  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    toast({
      title: "Anmeldung wird verarbeitet",
      description: "Bitte warte einen Moment...",
      duration: 3000,
    });
    
    await new Promise(resolve => setTimeout(resolve, 3000));
    
    try {
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });
      
      if (error) throw error;
      
      toast({
        title: "Anmeldung erfolgreich",
        description: "Du wurdest erfolgreich angemeldet",
        duration: 3000,
      });
      
      await checkUserWallet();
    } catch (error) {
      if (error instanceof Error) {
        toast({
          title: "Fehler",
          description: error.message,
          variant: "destructive",
          duration: 3000,
        });
      }
    } finally {
      setLoading(false);
    }
  };
  
  const handleRegisterClick = () => {
    navigate('/register');
  };
  
  const handleBackClick = () => {
    navigate('/');
  };

  const handleGoToWallet = () => {
    if (hasWallet) {
      navigate('/wallet');
    } else {
      navigate('/generate-wallet');
    }
  };
  
  // If user is already logged in, show a different UI
  if (session) {
    return (
      <div className="min-h-screen flex flex-col bg-white">
        <Header title="Sparrow" showBack={true} className="bg-white border-b" />
        
        <div className="flex-1 flex flex-col items-center justify-center p-4">
          <div className="w-full max-w-md text-center">
            <CheckCircle className="h-16 w-16 mx-auto mb-4 text-wallet-green" />
            <h1 className="text-2xl font-bold text-gray-900 mb-2">Du bist bereits angemeldet</h1>
            <p className="text-gray-600 mb-8">Möchtest du auf deine Wallet zugreifen?</p>
            
            <Button
              onClick={handleGoToWallet}
              className="w-full bg-wallet-blue hover:bg-wallet-darkBlue text-white py-6"
            >
              {hasWallet ? "Auf Wallet Zugreifen" : "Wallet Erstellen"}
            </Button>
          </div>
        </div>
      </div>
    );
  }
  
  return (
    <div className="min-h-screen flex flex-col bg-white">
      <Header title="Sparrow" showBack={true} className="bg-white border-b" />
      
      <div className="flex-1 flex flex-col items-center justify-center p-4">
        <div className="w-full max-w-md">
          <div className="text-center mb-8">
            <img 
              src="/lovable-uploads/311d7952-d195-4eb5-8b1a-17ed65abc660.png" 
              alt="Sparrow Logo" 
              className="w-16 h-16 mx-auto mb-4" 
            />
            <h1 className="text-2xl font-bold text-gray-900">Anmelden</h1>
            <p className="text-gray-600 mt-2">Melde dich an, um auf deine Wallet zuzugreifen</p>
          </div>
          
          <form onSubmit={handleLogin} className="space-y-5">
            <div className="space-y-2">
              <label htmlFor="email" className="text-sm font-medium text-gray-700">
                E-Mail
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                <Input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="name@example.com"
                  required
                  className="pl-10 border-gray-300"
                />
              </div>
            </div>
            
            <div className="space-y-2">
              <label htmlFor="password" className="text-sm font-medium text-gray-700">
                Passwort
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  required
                  className="pl-10 pr-10 border-gray-300"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                </button>
              </div>
            </div>
            
            <Button
              type="submit"
              disabled={loading}
              className="w-full bg-wallet-blue hover:bg-wallet-darkBlue text-white py-6"
            >
              {loading ? (
                <span className="flex items-center justify-center">
                  <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Anmelden...
                </span>
              ) : (
                "Anmelden"
              )}
            </Button>
          </form>
          
          <div className="mt-8 text-center">
            <p className="text-gray-600">
              Noch kein Konto? 
              <button
                type="button"
                onClick={handleRegisterClick}
                className="ml-1 text-wallet-blue hover:underline font-medium"
              >
                Registrieren
              </button>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Auth;
