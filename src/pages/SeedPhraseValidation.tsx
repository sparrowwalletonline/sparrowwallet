
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ArrowLeft, AlertCircle, CheckCircle2 } from 'lucide-react';
import { useWallet } from '@/contexts/WalletContext';
import { useToast } from '@/components/ui/use-toast';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';

const SeedPhraseValidation: React.FC = () => {
  const { toast } = useToast();
  const navigate = useNavigate();
  const { seedPhrase, createWallet } = useWallet();
  
  // State for validation
  const [wordIndices, setWordIndices] = useState<number[]>([]);
  const [inputValues, setInputValues] = useState<{ [key: number]: string }>({});
  const [errors, setErrors] = useState<{ [key: number]: boolean }>({});
  const [allValid, setAllValid] = useState(false);
  
  // Select random words to validate (2-3 words)
  useEffect(() => {
    if (seedPhrase && seedPhrase.length >= 12) {
      // Randomly determine if we'll validate 2 or 3 words
      const numWordsToValidate = Math.random() > 0.5 ? 3 : 2;
      
      // Create an array of indices (0-11)
      const allIndices = Array.from({ length: 12 }, (_, i) => i);
      
      // Shuffle and select first 2-3 indices
      const shuffled = allIndices.sort(() => 0.5 - Math.random());
      const selectedIndices = shuffled.slice(0, numWordsToValidate);
      
      console.log(`Selected ${numWordsToValidate} words for validation at indices:`, selectedIndices);
      setWordIndices(selectedIndices);
      
      // Initialize input values
      const initialInputs: { [key: number]: string } = {};
      selectedIndices.forEach(idx => {
        initialInputs[idx] = '';
      });
      setInputValues(initialInputs);
    } else {
      console.error("Seed phrase is not available or invalid");
      toast({
        title: "Error",
        description: "Seed phrase not found. Please go back and generate one.",
        variant: "destructive",
        duration: 5000,
      });
    }
  }, [seedPhrase, toast]);
  
  // Handle input change
  const handleInputChange = (index: number, value: string) => {
    // Update input value
    const newInputValues = { ...inputValues, [index]: value };
    setInputValues(newInputValues);
    
    // Check if current input is valid
    const isValid = value.toLowerCase().trim() === seedPhrase[index]?.toLowerCase();
    const newErrors = { ...errors, [index]: value.length > 0 && !isValid };
    setErrors(newErrors);
    
    // Check if all inputs are valid
    const allInputsValid = Object.keys(newInputValues).every((idx) => {
      const inputIdx = parseInt(idx);
      return newInputValues[inputIdx].toLowerCase().trim() === seedPhrase[inputIdx]?.toLowerCase();
    });
    
    // Only set all valid if all inputs have some content and are valid
    const allFilled = Object.keys(newInputValues).every(idx => newInputValues[parseInt(idx)].length > 0);
    setAllValid(allInputsValid && allFilled);
  };
  
  const handleConfirm = () => {
    if (allValid) {
      toast({
        title: "Success!",
        description: "Seed phrase validated successfully.",
        duration: 2000,
      });
      
      // This is critical - directly call createWallet instead of changing seedPhrase length
      console.log("Validation successful, creating wallet directly");
      createWallet();
    }
  };
  
  return (
    <div className="min-h-screen flex flex-col bg-wallet-darkBg text-white p-6 animate-fade-in">
      <div className="absolute top-6 left-6">
        <button 
          onClick={() => navigate('/seed-phrase')}
          className="text-white hover:text-gray-300 transition-colors"
          aria-label="Back"
        >
          <ArrowLeft size={24} />
        </button>
      </div>
      
      <div className="w-full text-center mt-6 mb-8">
        <h1 className="font-heading text-xl font-medium">Passphrase bestätigen</h1>
      </div>
      
      <div className="flex-1 flex flex-col">
        <div className="w-full max-w-sm mx-auto space-y-6">
          <div className="text-left">
            <p className="text-wallet-gray text-base mb-8">
              Fast fertig! Gib die folgenden Wörter Deiner Passphrase ein.
            </p>
          </div>
          
          <div className="space-y-6">
            {wordIndices.map((index) => (
              <div key={index} className="space-y-2">
                <label className="text-sm text-wallet-gray font-medium">
                  Wort Nr.{index + 1}
                </label>
                <div className="relative">
                  <Input
                    value={inputValues[index] || ''}
                    onChange={(e) => handleInputChange(index, e.target.value)}
                    className={`bg-[#1E2230] text-white border-gray-700 h-12 pl-4 ${
                      errors[index] ? 'border-red-500' : inputValues[index] ? 'border-wallet-green' : ''
                    }`}
                    placeholder={`Gib Wort Nr.${index + 1} ein`}
                  />
                  
                  {errors[index] && (
                    <motion.div 
                      initial={{ opacity: 0, y: -5 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="absolute right-3 top-3 text-red-500"
                    >
                      <AlertCircle size={18} />
                    </motion.div>
                  )}
                  
                  {inputValues[index] && !errors[index] && inputValues[index].length > 0 && (
                    <motion.div 
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={{ opacity: 1, scale: 1 }}
                      className="absolute right-3 top-3 text-wallet-green"
                    >
                      <CheckCircle2 size={18} />
                    </motion.div>
                  )}
                </div>
                
                {errors[index] && (
                  <motion.p 
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    className="text-xs text-red-500 mt-1"
                  >
                    Dieses Wort ist falsch. Bitte überprüfe es.
                  </motion.p>
                )}
              </div>
            ))}
          </div>
          
          <div className="pt-6 pb-4 mt-6">
            <Button 
              onClick={handleConfirm}
              className={`w-full py-6 text-white font-medium transition-all duration-300 ${
                allValid 
                  ? 'bg-wallet-green hover:bg-wallet-green/90 shadow-lg' 
                  : 'bg-gray-600 cursor-not-allowed opacity-50'
              }`}
              disabled={!allValid}
            >
              Bestätigen
            </Button>
            
            <div className="text-center mt-4">
              <Link 
                to="/seed-phrase" 
                className="text-wallet-green text-sm font-medium hover:underline transition-all"
              >
                Passphrase erneut anschauen
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SeedPhraseValidation;
