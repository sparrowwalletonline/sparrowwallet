import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/hooks/use-toast';
import { Mail, Lock, Eye, EyeOff, X } from 'lucide-react';
import { useWallet } from '@/contexts/WalletContext';
import { Dialog, DialogContent, DialogTrigger } from '@/components/ui/dialog';
import { cn } from '@/lib/utils';

const Auth: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isLogin, setIsLogin] = useState(true);
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [acceptTerms, setAcceptTerms] = useState(false);
  const [open, setOpen] = useState(true);
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
      navigate('/app');
    }
  };
  
  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!isLogin && password !== confirmPassword) {
      toast({
        title: "Fehler",
        description: "Die Passwörter stimmen nicht überein",
        variant: "destructive",
        duration: 3000,
      });
      return;
    }
    
    if (!isLogin && !acceptTerms) {
      toast({
        title: "Fehler",
        description: "Bitte akzeptiere die Nutzungsbedingungen und Datenschutzrichtlinien",
        variant: "destructive",
        duration: 3000,
      });
      return;
    }
    
    setLoading(true);
    
    if (isLogin) {
      toast({
        title: "Anmeldung wird verarbeitet",
        description: "Bitte warte einen Moment...",
        duration: 3000,
      });
    }
    
    if (isLogin) {
      await new Promise(resolve => setTimeout(resolve, 3000));
    }
    
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
          duration: 3000,
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
          duration: 3000,
        });
        
        navigate('/app');
      }
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
  
  const toggleView = () => {
    setIsLogin(!isLogin);
    setPassword('');
    setConfirmPassword('');
    setAcceptTerms(false);
  };
  
  const handleBackClick = () => {
    navigate('/');
  };
  
  const LoginForm = () => (
    <form onSubmit={handleAuth} className="space-y-6">
      <div className="space-y-3">
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
            className="pl-10 bg-background border-input text-foreground rounded-xl"
          />
        </div>
      </div>
      
      <div className="space-y-3">
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
            className="pl-10 pr-10 bg-background border-input text-foreground rounded-xl"
          />
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-500"
          >
            {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
          </button>
        </div>
      </div>
      
      <Button
        type="submit"
        disabled={loading}
        className="w-full bg-wallet-blue hover:bg-wallet-darkBlue text-white py-6 rounded-xl mt-4"
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
          <>Anmelden</>
        )}
      </Button>
      
      <div className="mt-4 text-center">
        <button
          type="button"
          onClick={toggleView}
          className="text-wallet-blue hover:underline text-sm"
        >
          Noch kein Konto? Registrieren
        </button>
      </div>
    </form>
  );
  
  const RegisterForm = () => (
    <form onSubmit={handleAuth} className="space-y-5">
      <div className="space-y-2">
        <label htmlFor="email" className="text-sm font-medium text-gray-700">
          E-Mail
        </label>
        <Input
          id="email"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="name@example.com"
          required
          className="bg-background border-input text-foreground rounded-xl"
        />
      </div>
      
      <div className="space-y-2">
        <label htmlFor="password" className="text-sm font-medium text-gray-700">
          Passwort
        </label>
        <div className="relative">
          <Input
            id="password"
            type={showPassword ? "text" : "password"}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="••••••••"
            required
            className="pr-10 bg-background border-input text-foreground rounded-xl"
          />
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-500"
          >
            {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
          </button>
        </div>
      </div>
      
      <div className="space-y-2">
        <label htmlFor="confirmPassword" className="text-sm font-medium text-gray-700">
          Passwort bestätigen
        </label>
        <div className="relative">
          <Input
            id="confirmPassword"
            type={showConfirmPassword ? "text" : "password"}
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            placeholder="••••••••"
            required
            className="pr-10 bg-background border-input text-foreground rounded-xl"
          />
          <button
            type="button"
            onClick={() => setShowConfirmPassword(!showConfirmPassword)}
            className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-500"
          >
            {showConfirmPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
          </button>
        </div>
      </div>
      
      <div className="flex items-start mt-4">
        <div className="flex items-center h-5">
          <input
            id="terms"
            type="checkbox"
            checked={acceptTerms}
            onChange={(e) => setAcceptTerms(e.target.checked)}
            className="w-4 h-4 border border-gray-300 rounded"
            required
          />
        </div>
        <div className="ml-3 text-sm">
          <label htmlFor="terms" className="text-gray-700">
            Ich akzeptiere die{" "}
            <a href="/terms" className="text-wallet-blue hover:underline">
              Nutzungsbedingungen
            </a>{" "}
            und{" "}
            <a href="/privacy" className="text-wallet-blue hover:underline">
              Datenschutzrichtlinien
            </a>
          </label>
        </div>
      </div>
      
      <div className="flex justify-between space-x-4 mt-6">
        <Button
          type="button"
          variant="outline"
          onClick={toggleView}
          className="flex-1 py-5"
        >
          Abbrechen
        </Button>
        <Button
          type="submit"
          disabled={loading || !acceptTerms}
          className={cn(
            "flex-1 bg-wallet-blue hover:bg-wallet-darkBlue text-white py-5",
            (!acceptTerms) && "opacity-50 cursor-not-allowed"
          )}
        >
          {loading ? (
            <span className="flex items-center justify-center">
              <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Registrieren...
            </span>
          ) : (
            <>Registrieren</>
          )}
        </Button>
      </div>
    </form>
  );
  
  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <div className="min-h-screen flex flex-col items-center justify-center bg-wallet-darkBg">
        <DialogContent 
          className="bg-white sm:max-w-md py-8 px-6 sm:px-8 rounded-3xl border-none shadow-lg"
          hideCloseButton={false}
        >
          <div className="w-full">
            <div className="flex justify-between items-center mb-6">
              <h1 className="text-2xl font-bold text-gray-800">
                {isLogin ? 'Anmelden' : 'Registrieren'}
              </h1>
              <Button 
                variant="ghost" 
                size="icon" 
                onClick={() => navigate('/')}
                className="text-gray-500 hover:text-gray-700"
              >
                <X className="h-5 w-5" />
              </Button>
            </div>
            
            {!isLogin && (
              <p className="text-gray-600 mb-6">
                Erstelle ein Konto, um deine Wallet zu sichern und auf allen Geräten nutzen zu können
              </p>
            )}
            
            {isLogin ? <LoginForm /> : <RegisterForm />}
          </div>
        </DialogContent>
      </div>
    </Dialog>
  );
};

export default Auth;
