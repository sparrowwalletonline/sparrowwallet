
import React, { useState } from 'react';
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
      
      // Navigate to wallet intro with animation
      setTimeout(() => {
        generateWallet();
        navigate('/wallet-intro');
        toast({
          title: "Wallet wird vorbereitet",
          description: "Bitte folgen Sie den nächsten Schritten zur Wallet-Erstellung."
        });
        setIsLoading(false);
      }, 500);
      
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
    <div className="min-h-screen flex flex-col bg-gradient-to-b from-[#f8fafc] to-[#e2e8f0] text-gray-800 page-enter safe-area-inset-bottom">
      <div className="w-full relative flex items-center justify-center p-4">
        <button 
          onClick={handleBack}
          className="absolute left-2 sm:left-4 top-0 bottom-0 my-auto text-gray-700 hover:text-gray-900 transition-colors h-10 w-10 flex items-center justify-center touch-manipulation z-10"
          aria-label="Back to wallet choice"
        >
          <ArrowLeft size={24} />
        </button>
        <div className="text-center">
          <h1 className="text-xl font-medium ml-10 text-gray-800">Persönliche Daten</h1>
        </div>
      </div>
      
      <div className="flex-1 container max-w-md mx-auto px-4 py-6 overflow-y-auto">
        <div className="space-y-6">
          <div>
            <h1 className="text-2xl font-bold">Persönliche Daten</h1>
            <p className="text-muted-foreground mt-2">
              Bitte gib deine persönlichen Daten ein, um deine Wallet zu erstellen.
            </p>
          </div>
          
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="firstName">Vorname <span className="text-red-500">*</span></Label>
                <Input
                  id="firstName"
                  value={firstName}
                  onChange={(e) => setFirstName(e.target.value)}
                  placeholder="Max"
                  required
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="lastName">Nachname <span className="text-red-500">*</span></Label>
                <Input
                  id="lastName"
                  value={lastName}
                  onChange={(e) => setLastName(e.target.value)}
                  placeholder="Mustermann"
                  required
                />
              </div>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="dateOfBirth">Geburtsdatum <span className="text-red-500">*</span></Label>
              <Input
                id="dateOfBirth"
                type="date"
                value={dateOfBirth}
                onChange={(e) => setDateOfBirth(e.target.value)}
                required
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="email">E-Mail <span className="text-red-500">*</span></Label>
              <Input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="max.mustermann@example.com"
                required
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="phone">Telefonnummer</Label>
              <Input
                id="phone"
                type="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="+49 123 4567890"
              />
            </div>
            
            <div className="flex items-center space-x-2 mt-4">
              <Checkbox 
                id="terms" 
                checked={acceptTerms}
                onCheckedChange={(checked) => setAcceptTerms(checked as boolean)}
              />
              <label
                htmlFor="terms"
                className="text-sm font-medium leading-none cursor-pointer"
              >
                Ich akzeptiere die <a href="/terms" target="_blank" className="text-primary hover:underline">Nutzungsbedingungen</a>
              </label>
            </div>
            
            <div className="flex flex-col sm:flex-row justify-end gap-3 mt-6">
              <Button 
                type="button"
                onClick={handleBack}
                variant="outline"
                disabled={isLoading}
              >
                Abbrechen
              </Button>
              <Button 
                type="submit"
                className="shadow-md hover:shadow-lg"
                disabled={isLoading}
              >
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" /> 
                    Weiter...
                  </>
                ) : (
                  "Wallet erstellen"
                )}
              </Button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default PersonalDataForm;
