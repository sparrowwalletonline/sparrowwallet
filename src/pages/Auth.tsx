import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/components/ui/use-toast';
import { Mail, Lock, Eye, EyeOff, ArrowLeft } from 'lucide-react';
import { useWallet } from '@/contexts/WalletContext';

const Auth: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLogin, setIsLogin] = useState(true);
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
      navigate('/wallet-choice');
    }
  };
  
  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      if (isLogin) {
        const { error } = await supabase.auth.signInWithPassword({
          email,
          password,
        });
        
        if (error) throw error;
        
        toast({
          title: "Anmeldung erfolgreich",
          description: "Du wurdest erfolgreich angemeldet",
        });
        
        await checkUserWallet();
      } else {
        const { error } = await supabase.auth.signUp({
          email,
          password,
        });
        
        if (error) throw error;
        
        toast({
          title: "Registrierung erfolgreich",
          description: "Bitte überprüfe deine E-Mail, um die Registrierung abzuschließen",
        });
        
        navigate('/wallet-choice');
      }
    } catch (error) {
      if (error instanceof Error) {
        toast({
          title: "Fehler",
          description: error.message,
          variant: "destructive",
        });
      }
    } finally {
      setLoading(false);
    }
  };
  
  const toggleView = () => {
    setIsLogin(!isLogin);
  };
  
  const handleBackClick = () => {
    navigate('/');
  };
  
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-wallet-darkBg p-4 relative">
      <button 
        onClick={handleBackClick}
        className="absolute left-6 top-6 text-white hover:text-gray-300 transition-colors"
        aria-label="Zurück"
      >
        <ArrowLeft size={24} />
      </button>
      
      <div className="w-full max-w-md bg-wallet-card p-8 rounded-xl shadow-lg border border-gray-800">
        <h1 className="text-2xl font-bold text-center text-white mb-6">
          {isLogin ? 'Anmelden' : 'Registrieren'}
        </h1>
        
        <form onSubmit={handleAuth} className="space-y-4">
          <div className="space-y-2">
            <label htmlFor="email" className="text-sm font-medium text-gray-300">
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
                className="pl-10 bg-gray-800 border-gray-700 text-white"
              />
            </div>
          </div>
          
          <div className="space-y-2">
            <label htmlFor="password" className="text-sm font-medium text-gray-300">
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
                className="pl-10 pr-10 bg-gray-800 border-gray-700 text-white"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-300"
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
                {isLogin ? 'Anmelden...' : 'Registrieren...'}
              </span>
            ) : (
              <>{isLogin ? 'Anmelden' : 'Registrieren'}</>
            )}
          </Button>
        </form>
        
        <div className="mt-6 text-center">
          <button
            type="button"
            onClick={toggleView}
            className="text-wallet-blue hover:underline text-sm"
          >
            {isLogin ? 'Noch kein Konto? Registrieren' : 'Bereits ein Konto? Anmelden'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default Auth;
