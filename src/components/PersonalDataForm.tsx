
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { Loader2, ArrowLeft } from 'lucide-react';
import { toast } from '@/components/ui/use-toast';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import Header from '@/components/Header';

interface PersonalDataFormProps {
  onComplete: () => void;
}

const PersonalDataForm: React.FC<PersonalDataFormProps> = ({ onComplete }) => {
  const navigate = useNavigate();
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [dateOfBirth, setDateOfBirth] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [address, setAddress] = useState('');
  const [city, setCity] = useState('');
  const [postalCode, setPostalCode] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [acceptTerms, setAcceptTerms] = useState(false);

  const handleBack = () => {
    navigate('/app');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!acceptTerms) {
      toast({
        title: "Nutzungsbedingungen nicht akzeptiert",
        description: "Bitte akzeptiere die Nutzungsbedingungen, um fortzufahren.",
        variant: "destructive",
      });
      return;
    }
    
    if (!firstName || !lastName || !dateOfBirth || !email) {
      toast({
        title: "Fehlende Informationen",
        description: "Bitte fülle alle erforderlichen Felder aus.",
        variant: "destructive",
      });
      return;
    }
    
    setIsLoading(true);
    
    try {
      // Get current user
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        throw new Error("Benutzer nicht gefunden");
      }
      
      // Update user profile
      const { error } = await supabase.from('profiles').upsert({
        id: user.id,
        first_name: firstName,
        last_name: lastName,
        date_of_birth: dateOfBirth,
        email: email,
        phone: phone,
        address: address,
        city: city,
        postal_code: postalCode,
      });
      
      if (error) throw error;
      
      toast({
        title: "Daten gespeichert",
        description: "Deine persönlichen Daten wurden erfolgreich gespeichert.",
      });
      
      // Proceed to the next step
      onComplete();
      
      // Add exit animation
      document.body.classList.add('page-exit');
      
      setTimeout(() => {
        navigate('/passphrase');
        
        // Remove class after navigation
        setTimeout(() => {
          document.body.classList.remove('page-exit');
        }, 50);
      }, 300);
      
    } catch (error) {
      console.error("Error saving profile data:", error);
      toast({
        title: "Fehler",
        description: "Deine Daten konnten nicht gespeichert werden. Bitte versuche es später erneut.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };
  
  return (
    <div className="min-h-screen flex flex-col bg-background text-foreground page-enter">
      <Header title="Persönliche Daten" showBack={true} />
      
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
            
            <div className="space-y-2">
              <Label htmlFor="address">Adresse</Label>
              <Input
                id="address"
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                placeholder="Musterstraße 123"
              />
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="city">Stadt</Label>
                <Input
                  id="city"
                  value={city}
                  onChange={(e) => setCity(e.target.value)}
                  placeholder="Musterstadt"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="postalCode">Postleitzahl</Label>
                <Input
                  id="postalCode"
                  value={postalCode}
                  onChange={(e) => setPostalCode(e.target.value)}
                  placeholder="12345"
                />
              </div>
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
                    Speichern...
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
