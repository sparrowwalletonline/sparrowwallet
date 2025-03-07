
import React, { useState } from 'react';
import { Mail, Lock, Eye, EyeOff } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { motion } from 'framer-motion';
import PasswordStrengthIndicator, { checkPasswordStrength } from './PasswordStrengthIndicator';

interface RegistrationFormProps {
  onSubmit: (e: React.FormEvent, formData: { acceptTerms: boolean }) => void;
  loading: boolean;
  progress: number;
  countdownSeconds: number;
}

const RegistrationForm: React.FC<RegistrationFormProps> = ({ 
  onSubmit, 
  loading, 
  progress, 
  countdownSeconds 
}) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [acceptTerms, setAcceptTerms] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [passwordStrength, setPasswordStrength] = useState(0);
  const [passwordFeedback, setPasswordFeedback] = useState('');

  const handlePasswordChange = (value: string) => {
    setPassword(value);
    const { strength, feedback } = checkPasswordStrength(value);
    setPasswordStrength(strength);
    setPasswordFeedback(feedback);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(e, { acceptTerms });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      <motion.div className="space-y-2" variants={itemVariants}>
        <label htmlFor="email" className="text-sm font-medium text-gray-700 block">
          E-Mail
        </label>
        <div className="relative group">
          <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5 group-hover:text-blue-500 transition-colors duration-200" />
          <Input
            id="email"
            name="email"
            type="email"
            value={email}
            onChange={e => setEmail(e.target.value)}
            placeholder="name@example.com"
            required
            className="pl-10 border-gray-200 bg-white/80 focus:bg-white transition-all group-hover:border-blue-300"
          />
        </div>
      </motion.div>

      <motion.div className="space-y-2" variants={itemVariants}>
        <label htmlFor="password" className="text-sm font-medium text-gray-700 block">
          Passwort
        </label>
        <div className="relative group">
          <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5 group-hover:text-blue-500 transition-colors duration-200" />
          <Input
            id="password"
            name="password"
            type={showPassword ? "text" : "password"}
            value={password}
            onChange={e => handlePasswordChange(e.target.value)}
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
        <PasswordStrengthIndicator 
          password={password} 
          strength={passwordStrength} 
          feedback={passwordFeedback} 
        />
      </motion.div>

      <motion.div className="space-y-2" variants={itemVariants}>
        <label htmlFor="confirmPassword" className="text-sm font-medium text-gray-700 block">
          Passwort bestätigen
        </label>
        <div className="relative group">
          <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5 group-hover:text-blue-500 transition-colors duration-200" />
          <Input
            id="confirmPassword"
            name="confirmPassword"
            type={showConfirmPassword ? "text" : "password"}
            value={confirmPassword}
            onChange={e => setConfirmPassword(e.target.value)}
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
        whileHover={{
          scale: 1.01,
          boxShadow: "0 4px 12px rgba(0, 0, 255, 0.1)"
        }}
      >
        <div className="mt-1">
          <Checkbox
            id="terms"
            name="terms"
            checked={acceptTerms}
            onCheckedChange={(checked) => setAcceptTerms(checked === true)}
            className="h-5 w-5 data-[state=checked]:bg-blue-600 data-[state=checked]:border-blue-600 border-2"
          />
        </div>
        <div className="grid gap-1.5 leading-none">
          <Label htmlFor="terms" className="text-sm text-gray-700 font-medium">
            Ich akzeptiere die <a href="/terms" className="text-blue-600 hover:underline font-medium">AGB</a> und{" "}
            <a href="/privacy" className="text-blue-600 hover:underline font-medium">Datenschutzerklärung</a>
          </Label>
          <p className="text-xs text-gray-500 mt-1">
            Deine Daten sind bei uns sicher und werden nicht an Dritte weitergegeben
          </p>
        </div>
      </motion.div>

      <motion.div variants={itemVariants} whileHover={{ scale: 1.01 }} whileTap={{ scale: 0.98 }}>
        <Button
          type="submit"
          disabled={loading}
          className="w-full bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-700 hover:to-blue-600 text-white font-medium py-6 transition-all duration-300 relative overflow-hidden group"
        >
          {loading ? (
            <div className="flex flex-col items-center w-full">
              <div className="flex items-center justify-center mb-2">
                <svg
                  className="animate-spin -ml-1 mr-2 h-5 w-5 text-white"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  ></path>
                </svg>
                <span>Registrieren... {countdownSeconds > 0 ? `(${countdownSeconds}s)` : ''}</span>
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
          ) : (
            <>
              <span className="z-10 relative">Registrieren</span>
              <span className="absolute inset-0 bg-gradient-to-r from-blue-400/0 via-blue-400/30 to-blue-400/0 opacity-0 group-hover:opacity-100 transform group-hover:translate-x-full transition-all duration-1000"></span>
            </>
          )}
        </Button>
      </motion.div>
    </form>
  );
};

export const itemVariants = {
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

export default RegistrationForm;
