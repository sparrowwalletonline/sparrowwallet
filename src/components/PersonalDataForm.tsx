
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { Loader2, ArrowLeft } from 'lucide-react';
import { toast } from '@/components/ui/use-toast';
import { useNavigate } from 'react-router-dom';
import { useWallet } from '@/contexts/WalletContext';

const PersonalDataForm: React.FC = () => {
  const navigate = useNavigate();
  const { generateWallet } = useWallet();
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [dateOfBirth, setDateOfBirth] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [acceptTerms, setAcceptTerms] = useState(false);
  const [countdown, setCountdown] = useState(0);

  useEffect(() => {
    let timer: number | undefined;
    if (countdown > 0) {
      timer = window.setTimeout(() => {
        setCountdown(prev => prev - 1);
      }, 1000);
    } else if (countdown === 0 && isLoading) {
      // When countdown reaches 0 and loading is still active, navigate to the seed phrase
      generateWallet();
      navigate('/seed-phrase');
      toast({
        title: "Wallet wird vorbereitet",
        description: "Bitte folgen Sie den nächsten Schritten zur Wallet-Erstellung."
      });
      setIsLoading(false);
    }

    return () => {
      if (timer) clearTimeout(timer);
    };
  }, [countdown, isLoading, navigate, generateWallet]);

  const handleBack = () => {
    // Add exit animation
    document.body.classList.add('page-exit');
    
    setTimeout(() => {
      navigate('/app');
      
      // Remove class after navigation
      setTimeout(() => {
        document.body.classList.remove('page-exit');
      }, 50);
    }, 300);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!acceptTerms) {
      toast({
        title: "Nutzungsbedingungen nicht akzeptiert",
        description: "Bitte akzeptiere die Nutzungsbedingungen, um fortzufahren.",
        variant: "destructive",
        duration: 3000,
      });
      return;
    }
    
    if (!firstName || !lastName || !dateOfBirth || !email) {
      toast({
        title: "Fehlende Informationen",
        description: "Bitte fülle alle erforderlichen Felder aus.",
        variant: "destructive",
        duration: 3000,
      });
      return;
    }
    
    setIsLoading(true);
    
    try {
      // Show success message
      toast({
        title: "Daten erfasst",
        description: "Deine persönlichen Daten wurden erfolgreich erfasst.",
        duration: 3000,
      });
      
      // Start the 5-second countdown
      setCountdown(5);
      
    } catch (error) {
      console.error("Error:", error);
      toast({
        title: "Fehler",
        description: "Ein Fehler ist aufgetreten. Bitte versuche es später erneut.",
        variant: "destructive",
        duration: 3000,
      });
      setIsLoading(false);
    }
  };
  
  return (
    <div className="min-h-screen bg-[#f9fafb] text-gray-800 page-enter">
      {/* Header with back button */}
      <div className="sticky top-0 z-10 bg-white shadow-sm">
        <div className="max-w-screen-md mx-auto px-4 sm:px-6 py-4 flex items-center">
          <button 
            onClick={handleBack}
            className="mr-4 text-gray-700 hover:text-gray-900 transition-colors h-10 w-10 flex items-center justify-center rounded-full hover:bg-gray-100"
            aria-label="Back to wallet choice"
          >
            <ArrowLeft size={20} />
          </button>
          <h1 className="text-xl font-medium text-gray-800">Persönliche Daten</h1>
        </div>
      </div>
      
      {/* Main content */}
      <div className="max-w-screen-md mx-auto px-4 sm:px-6 py-8">
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 sm:p-8">
          <div className="space-y-6">
            <div>
              <h2 className="text-2xl font-bold text-gray-900">Deine Informationen</h2>
              <p className="mt-2 text-gray-600">
                Bitte gib deine persönlichen Daten ein, um deine Wallet zu erstellen.
              </p>
            </div>
            
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                <div className="space-y-2">
                  <Label htmlFor="firstName" className="text-sm font-medium text-gray-700">
                    Vorname <span className="text-red-500">*</span>
                  </Label>
                  <Input
                    id="firstName"
                    value={firstName}
                    onChange={(e) => setFirstName(e.target.value)}
                    placeholder="Max"
                    required
                    className="rounded-lg border-gray-200 focus:border-[#0500ff] focus:ring-[#0500ff]"
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="lastName" className="text-sm font-medium text-gray-700">
                    Nachname <span className="text-red-500">*</span>
                  </Label>
                  <Input
                    id="lastName"
                    value={lastName}
                    onChange={(e) => setLastName(e.target.value)}
                    placeholder="Mustermann"
                    required
                    className="rounded-lg border-gray-200 focus:border-[#0500ff] focus:ring-[#0500ff]"
                  />
                </div>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="dateOfBirth" className="text-sm font-medium text-gray-700">
                  Geburtsdatum <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="dateOfBirth"
                  type="date"
                  value={dateOfBirth}
                  onChange={(e) => setDateOfBirth(e.target.value)}
                  required
                  className="rounded-lg border-gray-200 focus:border-[#0500ff] focus:ring-[#0500ff]"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="email" className="text-sm font-medium text-gray-700">
                  E-Mail <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="max.mustermann@example.com"
                  required
                  className="rounded-lg border-gray-200 focus:border-[#0500ff] focus:ring-[#0500ff]"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="phone" className="text-sm font-medium text-gray-700">
                  Telefonnummer
                </Label>
                <Input
                  id="phone"
                  type="tel"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="+49 123 4567890"
                  className="rounded-lg border-gray-200 focus:border-[#0500ff] focus:ring-[#0500ff]"
                />
              </div>
              
              <div className="flex items-start space-x-3 mt-6 p-4 bg-[#E5EDFF] rounded-lg">
                <Checkbox 
                  id="terms" 
                  checked={acceptTerms}
                  onCheckedChange={(checked) => setAcceptTerms(checked as boolean)}
                  className="mt-1 bg-white border-[#0500ff] data-[state=checked]:bg-[#0500ff]"
                />
                <label
                  htmlFor="terms"
                  className="text-sm text-gray-700 leading-relaxed cursor-pointer"
                >
                  Ich akzeptiere die <a href="/terms" target="_blank" className="text-[#0500ff] hover:underline font-medium">Nutzungsbedingungen</a> und erkläre mich damit einverstanden, dass meine persönlichen Daten gemäß der Datenschutzerklärung verarbeitet werden.
                </label>
              </div>
              
              <div className="flex flex-col sm:flex-row justify-end gap-3 mt-8 pt-4 border-t border-gray-100">
                <Button 
                  type="button"
                  onClick={handleBack}
                  variant="outline"
                  disabled={isLoading}
                  className="text-gray-700 hover:text-gray-900 border-gray-300"
                >
                  Abbrechen
                </Button>
                <Button 
                  type="submit"
                  disabled={isLoading}
                  className="bg-[#0500ff] hover:bg-[#0400cf] text-white shadow-md hover:shadow-lg transition-all"
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" /> 
                      {countdown > 0 ? `Weiter in ${countdown}...` : "Weiter..."}
                    </>
                  ) : (
                    "Wallet erstellen"
                  )}
                </Button>
              </div>
            </form>
          </div>
        </div>
        
        <div className="text-center text-xs text-gray-500 mt-6">
          © 2025 Sparrow Wallet · Alle Rechte vorbehalten
        </div>
      </div>
    </div>
  );
};

export default PersonalDataForm;
