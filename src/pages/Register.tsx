
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/hooks/use-toast';
import { Sparkles, ArrowLeft } from 'lucide-react';
import { motion } from 'framer-motion';
import WalletLogo from '@/components/WalletLogo';
import RegistrationForm from '@/components/auth/RegistrationForm';

const Register: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [countdownSeconds, setCountdownSeconds] = useState(0);
  const navigate = useNavigate();

  useEffect(() => {
    if (loading) {
      const interval = setInterval(() => {
        setProgress(prevProgress => {
          if (prevProgress >= 100) {
            clearInterval(interval);
            return 100;
          }
          return prevProgress + 100 / 3 / 10; // 3 seconds delay - 10 updates per second
        });
      }, 100);

      setCountdownSeconds(3);
      const countdownInterval = setInterval(() => {
        setCountdownSeconds(prevCount => {
          if (prevCount <= 1) {
            clearInterval(countdownInterval);
            return 0;
          }
          return prevCount - 1;
        });
      }, 1000);

      return () => {
        clearInterval(interval);
        clearInterval(countdownInterval);
      };
    } else {
      setProgress(0);
      setCountdownSeconds(0);
    }
  }, [loading]);

  const handleRegister = async (e: React.FormEvent, formData: { acceptTerms: boolean }) => {
    e.preventDefault();
    const form = e.target as HTMLFormElement;
    const formDataObj = new FormData(form);
    const email = formDataObj.get('email') as string;
    const password = formDataObj.get('password') as string;
    const confirmPassword = formDataObj.get('confirmPassword') as string;
    const acceptTerms = formData.acceptTerms;

    if (password !== confirmPassword) {
      toast({
        title: "Fehler",
        description: "Die Passwörter stimmen nicht überein",
        variant: "destructive",
        duration: 3000
      });
      return;
    }

    if (!acceptTerms) {
      toast({
        title: "Fehler",
        description: "Bitte akzeptiere die AGB und Datenschutzerklärung",
        variant: "destructive",
        duration: 3000
      });
      return;
    }

    setLoading(true);
    setTimeout(async () => {
      try {
        const { error } = await supabase.auth.signUp({
          email,
          password
        });
        
        if (error) throw error;

        toast({
          title: "Registrierung erfolgreich",
          description: "Bitte überprüfe deine E-Mail, um die Registrierung abzuschließen",
          duration: 3000
        });
        
        navigate('/wallet-intro');
      } catch (error) {
        if (error instanceof Error) {
          toast({
            title: "Fehler",
            description: error.message,
            variant: "destructive",
            duration: 3000
          });
        }
      } finally {
        setLoading(false);
      }
    }, 3000);
  };

  const handleLoginClick = () => {
    navigate('/auth');
  };

  const handleBackClick = () => {
    const form = document.querySelector('form');
    const formData = new FormData(form as HTMLFormElement);
    const isEmpty = !formData.get('email') && !formData.get('password') && !formData.get('confirmPassword');
    
    if (isEmpty) {
      navigate('/');
    } else {
      navigate(-1);
    }
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
    hidden: {
      y: 20,
      opacity: 0
    },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        type: "spring",
        stiffness: 100
      }
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-white to-gray-50 register-page-container">
      <div className="pt-4 px-4">
        <button 
          onClick={handleBackClick} 
          className="w-10 h-10 flex items-center justify-center rounded-full bg-white/70 hover:bg-white/90 backdrop-blur-sm shadow-sm hover:shadow-md"
        >
          <ArrowLeft className="w-5 h-5 text-gray-700" />
        </button>
      </div>
      
      <div className="flex-1 flex flex-col items-center justify-center p-4">
        <motion.div className="w-full max-w-md space-y-8" initial="hidden" animate="visible" variants={containerVariants}>
          <motion.div variants={itemVariants} className="text-center relative">
            <motion.div className="mb-6 mx-auto" whileHover={{ scale: 1.05 }} transition={{ type: "spring", stiffness: 400, damping: 10 }}>
              <WalletLogo useSparrowLogo={true} color="sparrow" className="w-20 h-20 mx-auto drop-shadow-md" />
            </motion.div>
            <motion.h1 className="text-3xl font-bold font-heading bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent mb-1" variants={itemVariants}>
              Willkommen!
            </motion.h1>
            <motion.p className="text-gray-500 text-sm" variants={itemVariants}>
              Erstelle ein neues Konto, um deine Wallet zu verwalten
            </motion.p>
          </motion.div>
          
          <motion.div className="bg-white/70 backdrop-blur-sm rounded-2xl shadow-xl border border-gray-100 p-8 hover:shadow-2xl transition-all duration-300" variants={itemVariants}>
            <RegistrationForm 
              onSubmit={handleRegister}
              loading={loading}
              progress={progress}
              countdownSeconds={countdownSeconds}
            />
          </motion.div>
          
          <motion.div className="text-center" variants={itemVariants}>
            <p className="text-gray-600">
              Bereits ein Konto?{" "}
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
          
          <motion.div className="text-center" variants={itemVariants}>
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
