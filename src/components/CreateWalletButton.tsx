import React from 'react';
import { Button } from '@/components/ui/button';
import { Wallet } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { cn } from '@/lib/utils';
import { 
  Dialog,
  DialogContent,
  DialogTitle,
  DialogDescription,
  DialogClose
} from '@/components/ui/dialog';
import { useState, useEffect } from 'react';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/components/ui/use-toast';
import { Loader2, Check } from 'lucide-react';
import ThemeToggle from '@/components/ThemeToggle';
import { Link } from 'react-router-dom';
import { Switch } from '@/components/ui/switch';
import { Checkbox } from '@/components/ui/checkbox';
import { useWallet } from '@/contexts/WalletContext';
import { motion } from 'framer-motion';

const CreateWalletButton = () => {
  const navigate = useNavigate();
  const { session, hasWallet } = useWallet();
  const [isRegisterOpen, setIsRegisterOpen] = useState(false);
  const [isSuccessOpen, setIsSuccessOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [passwordStrength, setPasswordStrength] = useState(0);
  const [passwordFeedback, setPasswordFeedback] = useState('');
  const [acceptedTerms, setAcceptedTerms] = useState(false);
  const [progress, setProgress] = useState(0);
  const [errors, setErrors] = useState({
    email: '',
    password: '',
    confirmPassword: '',
    terms: ''
  });

  useEffect(() => {
    if (isLoading) {
      const interval = setInterval(() => {
        setProgress((prevProgress) => {
          if (prevProgress >= 100) {
            clearInterval(interval);
            return 100;
          }
          return prevProgress + (100 / 5) / 10;
        });
      }, 100);
      
      return () => {
        clearInterval(interval);
      };
    } else {
      setProgress(0);
    }
  }, [isLoading]);

  const validateEmail = (email: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const checkPasswordStrength = (password: string) => {
    let strength = 0;
    let feedback = '';

    if (password.length >= 8) strength += 1;
    if (/[A-Z]/.test(password)) strength += 1;
    if (/[0-9]/.test(password)) strength += 1;
    if (/[^A-Za-z0-9]/.test(password)) strength += 1;

    switch (strength) {
      case 0:
        feedback = 'Sehr schwach';
        break;
      case 1:
        feedback = 'Schwach';
        break;
      case 2:
        feedback = 'Moderat';
        break;
      case 3:
        feedback = 'Stark';
        break;
      case 4:
        feedback = 'Sehr stark';
        break;
    }

    return { strength, feedback };
  };

  const handlePasswordChange = (password: string) => {
    setPassword(password);
    const { strength, feedback } = checkPasswordStrength(password);
    setPasswordStrength(strength);
    setPasswordFeedback(feedback);
  };

  const handleClick = () => {
    if (session) {
      if (hasWallet) {
        navigate('/wallet');
      } else {
        navigate('/generate-wallet');
      }
    } else {
      navigate('/register');
    }
  };

  const validateForm = () => {
    const newErrors = {
      email: '',
      password: '',
      confirmPassword: '',
      terms: ''
    };
    let isValid = true;

    if (!email) {
      newErrors.email = 'E-Mail ist erforderlich';
      isValid = false;
    } else if (!validateEmail(email)) {
      newErrors.email = 'Ungültiges E-Mail Format';
      isValid = false;
    }

    if (!password) {
      newErrors.password = 'Passwort ist erforderlich';
      isValid = false;
    } else if (password.length < 8) {
      newErrors.password = 'Passwort muss mindestens 8 Zeichen lang sein';
      isValid = false;
    }

    if (password !== confirmPassword) {
      newErrors.confirmPassword = 'Passwörter stimmen nicht überein';
      isValid = false;
    }

    if (!acceptedTerms) {
      newErrors.terms = 'Sie müssen die Nutzungsbedingungen akzeptieren';
      isValid = false;
    }

    setErrors(newErrors);
    return isValid;
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }
    
    setIsRegisterOpen(false);
    navigate('/register');
  };

  const handleSuccessModalClose = () => {
    setIsSuccessOpen(false);
    navigate('/wallet-intro');
  };

  const getStrengthColor = () => {
    switch (passwordStrength) {
      case 0:
        return 'bg-red-500';
      case 1:
        return 'bg-orange-500';
      case 2:
        return 'bg-yellow-500';
      case 3:
        return 'bg-green-500';
      case 4:
        return 'bg-emerald-500';
      default:
        return 'bg-gray-300';
    }
  };

  return (
    <>
      <div className="fixed bottom-4 right-4 z-50">
        <Button 
          onClick={handleClick}
          size="sm"
          className={cn(
            "rounded-md shadow-lg flex items-center justify-center gap-1 create-wallet-trigger",
            "transition-all hover:scale-105 hover:shadow-xl bg-wallet-blue"
          )}
        >
          <Wallet className="h-3 w-3" />
          <span className="text-xs">
            {session ? (hasWallet ? "Auf Wallet Zugreifen" : "Wallet Erstellen") : "Create Wallet"}
          </span>
        </Button>
      </div>

      <Dialog open={isRegisterOpen} onOpenChange={setIsRegisterOpen}>
        <DialogContent className="bg-white border-gray-200 text-gray-800 dark:bg-wallet-card dark:border-gray-800 dark:text-white max-w-md p-0 overflow-hidden">
          <div className="flex flex-col">
            <div className="bg-blue-50 dark:bg-wallet-blue/10 p-6 flex justify-between items-center">
              <div>
                <DialogTitle className="text-xl font-bold">Registrieren</DialogTitle>
                <DialogDescription className="text-gray-600 dark:text-gray-400 mt-2">
                  Erstelle ein Konto, um deine Wallet zu sichern und auf allen Geräten nutzen zu können
                </DialogDescription>
              </div>
              <ThemeToggle />
            </div>
            
            <form onSubmit={handleRegister} className="p-6 space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email" className="text-gray-700 dark:text-gray-300">E-Mail</Label>
                <Input 
                  id="email"
                  type="email" 
                  value={email} 
                  onChange={(e) => setEmail(e.target.value)}
                  className="bg-gray-50 border-gray-200 text-gray-800 dark:bg-wallet-darkBg dark:border-gray-700 dark:text-white" 
                  placeholder="name@example.com"
                  required 
                />
                {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email}</p>}
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="password" className="text-gray-700 dark:text-gray-300">Passwort</Label>
                <Input 
                  id="password"
                  type="password" 
                  value={password} 
                  onChange={(e) => handlePasswordChange(e.target.value)}
                  className="bg-gray-50 border-gray-200 text-gray-800 dark:bg-wallet-darkBg dark:border-gray-700 dark:text-white" 
                  placeholder="••••••••"
                  required 
                />
                {password && (
                  <div className="mt-2 space-y-1">
                    <div className="h-1 w-full bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                      <div 
                        className={`h-full ${getStrengthColor()}`} 
                        style={{ width: `${(passwordStrength / 4) * 100}%` }}
                      />
                    </div>
                    <p className="text-xs text-gray-600 dark:text-gray-400">{passwordFeedback}</p>
                  </div>
                )}
                {errors.password && <p className="text-red-500 text-xs mt-1">{errors.password}</p>}
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="confirm-password" className="text-gray-700 dark:text-gray-300">Passwort bestätigen</Label>
                <Input 
                  id="confirm-password"
                  type="password" 
                  value={confirmPassword} 
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="bg-gray-50 border-gray-200 text-gray-800 dark:bg-wallet-darkBg dark:border-gray-700 dark:text-white" 
                  placeholder="••••••••"
                  required 
                />
                {errors.confirmPassword && <p className="text-red-500 text-xs mt-1">{errors.confirmPassword}</p>}
              </div>
              
              <div className="space-y-2 pt-2">
                <div className="flex items-start space-x-2">
                  <Checkbox 
                    id="terms" 
                    checked={acceptedTerms}
                    onCheckedChange={(checked) => setAcceptedTerms(checked === true)}
                    className="data-[state=checked]:bg-wallet-blue border-gray-300 dark:border-gray-600"
                  />
                  <div className="grid gap-1.5 leading-none">
                    <label
                      htmlFor="terms"
                      className="text-sm font-medium leading-none text-gray-700 dark:text-gray-300 peer-disabled:cursor-not-allowed peer-disabled:opacity-70 cursor-pointer"
                    >
                      Ich akzeptiere die <Link to="/terms" className="text-blue-600 dark:text-blue-400 hover:underline">Nutzungsbedingungen</Link> und <Link to="/terms" className="text-blue-600 dark:text-blue-400 hover:underline">Datenschutzrichtlinien</Link>
                    </label>
                  </div>
                </div>
                {errors.terms && <p className="text-red-500 text-xs mt-1">{errors.terms}</p>}
              </div>
              
              <div className="mt-6 flex justify-end space-x-3">
                <DialogClose asChild>
                  <Button type="button" variant="ghost" className="text-gray-700 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white">
                    Abbrechen
                  </Button>
                </DialogClose>
                <Button 
                  type="submit" 
                  disabled={isLoading} 
                  className="bg-wallet-blue hover:bg-wallet-darkBlue"
                >
                  {isLoading ? (
                    <div className="flex flex-col items-center w-full">
                      <div className="flex items-center justify-center">
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        <span>Registriere...</span>
                      </div>
                      <div className="w-full bg-blue-400/30 h-1 rounded-full overflow-hidden mt-1">
                        <motion.div
                          className="h-full bg-white"
                          initial={{ width: 0 }}
                          animate={{ width: `${progress}%` }}
                          transition={{ duration: 0.1 }}
                        />
                      </div>
                    </div>
                  ) : "Registrieren"}
                </Button>
              </div>
            </form>
          </div>
        </DialogContent>
      </Dialog>

      <Dialog open={isSuccessOpen} onOpenChange={setIsSuccessOpen}>
        <DialogContent className="bg-white border-gray-200 text-gray-800 dark:bg-wallet-card dark:border-gray-800 dark:text-white max-w-md text-center">
          <div className="flex flex-col items-center justify-center p-6">
            <div className="w-16 h-16 rounded-full bg-green-500 flex items-center justify-center mb-4">
              <Check className="h-8 w-8 text-white" />
            </div>
            <DialogTitle className="text-xl font-bold mb-2">Konto erfolgreich erstellt!</DialogTitle>
            <DialogDescription className="text-gray-600 dark:text-gray-400 mb-6">
              Jetzt kannst du deine Wallet erstellen.
            </DialogDescription>
            
            <Button onClick={handleSuccessModalClose} className="bg-wallet-blue hover:bg-wallet-darkBlue">
              Wallet Erstellen
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default CreateWalletButton;
