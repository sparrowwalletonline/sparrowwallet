import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/hooks/use-toast';
import { Mail, Lock, Eye, EyeOff, ArrowLeft, Check, Shield, Sparkles } from 'lucide-react';
import { useWallet } from '@/contexts/WalletContext';
import Header from '@/components/Header';
import WalletLogo from '@/components/WalletLogo';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { motion } from 'framer-motion';

const Register: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [acceptTerms, setAcceptTerms] = useState(false);
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const navigate = useNavigate();
  
  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (password !== confirmPassword) {
      toast({
        title: "Fehler",
        description: "Die Passwörter stimmen nicht überein",
        variant: "destructive",
        duration: 3000,
      });
      return;
    }
    
    if (!acceptTerms) {
      toast({
        title: "Fehler",
        description: "Bitte akzeptiere die AGB und Datenschutzerklärung",
        variant: "destructive",
        duration: 3000,
      });
      return;
    }
    
    setLoading(true);
    
    try {
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
  
  const handleLoginClick = () => {
    navigate('/auth');
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { 
      opacity: 1,
      transition: { 
        staggerChildren: 0.1,
        delayChildren: 0.2,
        duration: 0.5 
      } 
    }
  };
  
  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: { 
      y: 0, 
      opacity: 1,
      transition: { type: "spring", stiffness: 100 }
    }
  };
  
  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-white to-gray-50">
      <Header title="Sparrow" showBack={true} className="bg-transparent shadow-none" showProfileButton={false} />
      
      <div className="flex-1 flex flex-col items-center justify-center p-4">
        <motion.div 
          className="w-full max-w-md space-y-8"
          initial="hidden"
          animate="visible"
          variants={containerVariants}
        >
          <motion.div 
            className="text-center relative"
            variants={itemVariants}
          >
            <motion.div 
              className="mb-6 mx-auto"
              whileHover={{ scale: 1.05 }}
              transition={{ type: "spring", stiffness: 400, damping: 10 }}
            >
              <WalletLogo 
                useSparrowLogo={true} 
                color="sparrow" 
                className="w-20 h-20 mx-auto drop-shadow-md" 
              />
            </motion.div>
            <motion.h1 
              className="text-3xl font-bold font-heading bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent mb-1"
              variants={itemVariants}
            >
              Registrieren
            </motion.h1>
            <motion.p 
              className="text-gray-500 text-sm"
              variants={itemVariants}
            >
              Erstelle ein neues Konto, um deine Wallet zu verwalten
            </motion.p>
          </motion.div>
          
          <motion.div 
            className="bg-white/70 backdrop-blur-sm rounded-2xl shadow-xl border border-gray-100 p-8 hover:shadow-2xl transition-all duration-300"
            variants={itemVariants}
          >
            <form onSubmit={handleRegister} className="space-y-5">
              <motion.div 
                className="space-y-2" 
                variants={itemVariants}
              >
                <label htmlFor="email" className="text-sm font-medium text-gray-700 block">
                  E-Mail
                </label>
                <div className="relative group">
                  <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5 group-hover:text-blue-500 transition-colors duration-200" />
                  <Input
                    id="email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="name@example.com"
                    required
                    className="pl-10 border-gray-200 bg-white/80 focus:bg-white transition-all group-hover:border-blue-300"
                  />
                </div>
              </motion.div>
              
              <motion.div 
                className="space-y-2"
                variants={itemVariants}
              >
                <label htmlFor="password" className="text-sm font-medium text-gray-700 block">
                  Passwort
                </label>
                <div className="relative group">
                  <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5 group-hover:text-blue-500 transition-colors duration-200" />
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    required
                    className="pl-10 pr-10 border-gray-200 bg-white/80 focus:bg-white transition-all group-hover:border-blue-300"
                  />
                  <motion.button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-blue-500 transition-colors duration-200"
                    whileTap={{ scale: 0.9 }}
                  >
                    {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                  </motion.button>
                </div>
              </motion.div>
              
              <motion.div 
                className="space-y-2"
                variants={itemVariants}
              >
                <label htmlFor="confirmPassword" className="text-sm font-medium text-gray-700 block">
                  Passwort bestätigen
                </label>
                <div className="relative group">
                  <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5 group-hover:text-blue-500 transition-colors duration-200" />
                  <Input
                    id="confirmPassword"
                    type={showConfirmPassword ? "text" : "password"}
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="••••••••"
                    required
                    className="pl-10 pr-10 border-gray-200 bg-white/80 focus:bg-white transition-all group-hover:border-blue-300"
                  />
                  <motion.button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-blue-500 transition-colors duration-200"
                    whileTap={{ scale: 0.9 }}
                  >
                    {showConfirmPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                  </motion.button>
                </div>
              </motion.div>
              
              <motion.div 
                className="flex items-start space-x-3 bg-blue-50/70 p-4 rounded-lg border border-blue-100 hover:bg-blue-50 transition-colors duration-200"
                variants={itemVariants}
                whileHover={{ scale: 1.01, boxShadow: "0 4px 12px rgba(0, 0, 255, 0.1)" }}
              >
                <div className="mt-1">
                  <Checkbox 
                    id="terms" 
                    checked={acceptTerms} 
                    onCheckedChange={(checked) => setAcceptTerms(checked === true)}
                    className="h-5 w-5 data-[state=checked]:bg-blue-600 data-[state=checked]:border-blue-600 border-2"
                  />
                </div>
                <div className="grid gap-1.5 leading-none">
                  <Label 
                    htmlFor="terms" 
                    className="text-sm text-gray-700 font-medium"
                  >
                    Ich akzeptiere die <a href="/terms" className="text-blue-600 hover:underline font-medium">AGB</a> und <a href="/privacy" className="text-blue-600 hover:underline font-medium">Datenschutzerklärung</a>
                  </Label>
                  <p className="text-xs text-gray-500 mt-2 flex items-center gap-1.5">
                    <Shield className="h-3.5 w-3.5 text-blue-500 flex-shrink-0" />
                    Deine Daten sind bei uns sicher und werden nicht an Dritte weitergegeben
                  </p>
                </div>
              </motion.div>
              
              <motion.div
                variants={itemVariants}
                whileHover={{ scale: 1.01 }}
                whileTap={{ scale: 0.98 }}
              >
                <Button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-700 hover:to-blue-600 text-white font-medium py-6 transition-all duration-300 relative overflow-hidden group"
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
                    <>
                      <span className="z-10 relative">Registrieren</span>
                      <span className="absolute inset-0 bg-gradient-to-r from-blue-400/0 via-blue-400/30 to-blue-400/0 opacity-0 group-hover:opacity-100 transform group-hover:translate-x-full transition-all duration-1000"></span>
                    </>
                  )}
                </Button>
              </motion.div>
            </form>
          </motion.div>
          
          <motion.div 
            className="text-center"
            variants={itemVariants}
          >
            <p className="text-gray-600">
              Bereits ein Konto? 
              <motion.button
                type="button"
                onClick={handleLoginClick}
                className="ml-1 text-blue-600 hover:text-blue-700 font-medium"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                Anmelden
              </motion.button>
            </p>
          </motion.div>
          
          <motion.div 
            className="text-center"
            variants={itemVariants}
          >
            <p className="text-xs text-gray-500 flex items-center justify-center gap-1">
              <Sparkles className="h-3 w-3 text-blue-400" />
              © 2025 Sparrow. Alle Rechte vorbehalten.
            </p>
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
};

export default Register;
