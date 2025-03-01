
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card } from '@/components/ui/card';
import { ArrowLeft, Mail, Lock, User } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { useWallet } from '@/contexts/WalletContext';
import { toast } from '@/components/ui/use-toast';

const Auth: React.FC = () => {
  const [isSignUp, setIsSignUp] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const { session, hasWallet, generateWallet } = useWallet();

  // Redirect to home if already logged in
  useEffect(() => {
    if (session) {
      navigate('/');
    }
  }, [session, navigate]);

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email || !password) {
      toast({
        title: "Fehler",
        description: "Bitte fülle alle Felder aus",
        variant: "destructive",
      });
      return;
    }
    
    setIsLoading(true);
    
    try {
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });
      
      if (error) {
        throw error;
      }
      
      toast({
        title: "Erfolgreich angemeldet",
        description: "Du wirst weitergeleitet...",
      });
      
      // Redirect to wallet flow or home based on wallet status
      if (hasWallet) {
        navigate('/');
      } else {
        navigate('/wallet-choice');
      }
    } catch (error: any) {
      console.error('Error signing in:', error);
      toast({
        title: "Anmeldung fehlgeschlagen",
        description: error.message || "Bitte überprüfe deine Anmeldedaten",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };
  
  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email || !password || !confirmPassword) {
      toast({
        title: "Fehler",
        description: "Bitte fülle alle Felder aus",
        variant: "destructive",
      });
      return;
    }
    
    if (password !== confirmPassword) {
      toast({
        title: "Fehler",
        description: "Die Passwörter stimmen nicht überein",
        variant: "destructive",
      });
      return;
    }
    
    setIsLoading(true);
    
    try {
      const { error } = await supabase.auth.signUp({
        email,
        password,
      });
      
      if (error) {
        throw error;
      }
      
      toast({
        title: "Registrierung erfolgreich",
        description: "Dein Konto wurde erstellt. Du wirst zum Wallet-Setup weitergeleitet.",
      });
      
      // After successful registration, redirect to wallet setup
      navigate('/wallet-choice');
    } catch (error: any) {
      console.error('Error signing up:', error);
      toast({
        title: "Registrierung fehlgeschlagen",
        description: error.message || "Bitte versuche es mit einer anderen E-Mail-Adresse",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };
  
  const handleSubmit = (e: React.FormEvent) => {
    if (isSignUp) {
      handleSignUp(e);
    } else {
      handleSignIn(e);
    }
  };
  
  return (
    <div className="min-h-screen flex flex-col bg-wallet-darkBg text-white p-6 animate-fade-in">
      <div className="absolute top-6 left-6">
        <button 
          onClick={() => navigate(-1)}
          className="text-white hover:text-gray-300 transition-colors"
          aria-label="Zurück"
        >
          <ArrowLeft size={24} />
        </button>
      </div>
      
      <div className="flex-1 flex flex-col items-center justify-center">
        <Card className="w-full max-w-md p-8 bg-wallet-card border-gray-700">
          <div className="text-center mb-8">
            <h1 className="text-2xl font-bold mb-2">
              {isSignUp ? 'Konto erstellen' : 'Anmelden'}
            </h1>
            <p className="text-wallet-gray text-sm">
              {isSignUp 
                ? 'Erstelle ein Konto, um deine Wallet-Daten zu sichern' 
                : 'Melde dich an, um auf deine Wallet zuzugreifen'}
            </p>
          </div>
          
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-4">
              <div className="space-y-2">
                <label htmlFor="email" className="text-sm font-medium text-wallet-gray">
                  E-Mail
                </label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-wallet-gray h-4 w-4" />
                  <Input
                    id="email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="pl-10 bg-gray-800 text-white border-gray-700"
                    placeholder="deine@email.de"
                    required
                  />
                </div>
              </div>
              
              <div className="space-y-2">
                <label htmlFor="password" className="text-sm font-medium text-wallet-gray">
                  Passwort
                </label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-wallet-gray h-4 w-4" />
                  <Input
                    id="password"
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="pl-10 bg-gray-800 text-white border-gray-700"
                    placeholder="••••••••"
                    required
                  />
                </div>
              </div>
              
              {isSignUp && (
                <div className="space-y-2">
                  <label htmlFor="confirmPassword" className="text-sm font-medium text-wallet-gray">
                    Passwort bestätigen
                  </label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-wallet-gray h-4 w-4" />
                    <Input
                      id="confirmPassword"
                      type="password"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      className="pl-10 bg-gray-800 text-white border-gray-700"
                      placeholder="••••••••"
                      required
                    />
                  </div>
                </div>
              )}
            </div>
            
            <Button 
              type="submit" 
              className="w-full py-6 bg-wallet-blue hover:bg-wallet-darkBlue"
              disabled={isLoading}
            >
              {isLoading 
                ? 'Wird bearbeitet...' 
                : isSignUp ? 'Registrieren' : 'Anmelden'}
            </Button>
            
            <div className="text-center mt-4">
              <button
                type="button"
                onClick={() => setIsSignUp(!isSignUp)}
                className="text-wallet-blue hover:underline text-sm"
              >
                {isSignUp 
                  ? 'Bereits ein Konto? Anmelden' 
                  : 'Kein Konto? Registrieren'}
              </button>
            </div>
          </form>
        </Card>
      </div>
    </div>
  );
};

export default Auth;
