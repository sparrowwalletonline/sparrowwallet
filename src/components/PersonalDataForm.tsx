
import React, { useState } from 'react';
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle,
  DialogFooter,
  DialogDescription,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { Loader2 } from 'lucide-react';
import { toast } from '@/components/ui/use-toast';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';

interface PersonalDataFormProps {
  isOpen: boolean;
  onClose: () => void;
  onComplete: () => void;
}

const PersonalDataForm: React.FC<PersonalDataFormProps> = ({ isOpen, onClose, onComplete }) => {
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
      onClose();
    }
  };
  
  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="max-w-md max-h-[90vh] overflow-y-auto bg-wallet-darkBg border-white/10">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold text-white">Persönliche Daten</DialogTitle>
          <DialogDescription className="text-gray-400">
            Bitte gib deine persönlichen Daten ein, um deine Wallet zu erstellen.
          </DialogDescription>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-4 mt-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="firstName" className="text-white">Vorname <span className="text-red-500">*</span></Label>
              <Input
                id="firstName"
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
                placeholder="Max"
                className="bg-gray-800 border-gray-700 text-white"
                required
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="lastName" className="text-white">Nachname <span className="text-red-500">*</span></Label>
              <Input
                id="lastName"
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
                placeholder="Mustermann"
                className="bg-gray-800 border-gray-700 text-white"
                required
              />
            </div>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="dateOfBirth" className="text-white">Geburtsdatum <span className="text-red-500">*</span></Label>
            <Input
              id="dateOfBirth"
              type="date"
              value={dateOfBirth}
              onChange={(e) => setDateOfBirth(e.target.value)}
              className="bg-gray-800 border-gray-700 text-white"
              required
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="email" className="text-white">E-Mail <span className="text-red-500">*</span></Label>
            <Input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="max.mustermann@example.com"
              className="bg-gray-800 border-gray-700 text-white"
              required
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="phone" className="text-white">Telefonnummer</Label>
            <Input
              id="phone"
              type="tel"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              placeholder="+49 123 4567890"
              className="bg-gray-800 border-gray-700 text-white"
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="address" className="text-white">Adresse</Label>
            <Input
              id="address"
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              placeholder="Musterstraße 123"
              className="bg-gray-800 border-gray-700 text-white"
            />
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="city" className="text-white">Stadt</Label>
              <Input
                id="city"
                value={city}
                onChange={(e) => setCity(e.target.value)}
                placeholder="Musterstadt"
                className="bg-gray-800 border-gray-700 text-white"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="postalCode" className="text-white">Postleitzahl</Label>
              <Input
                id="postalCode"
                value={postalCode}
                onChange={(e) => setPostalCode(e.target.value)}
                placeholder="12345"
                className="bg-gray-800 border-gray-700 text-white"
              />
            </div>
          </div>
          
          <div className="flex items-center space-x-2 mt-4">
            <Checkbox 
              id="terms" 
              checked={acceptTerms}
              onCheckedChange={(checked) => setAcceptTerms(checked as boolean)}
              className="border-gray-600 data-[state=checked]:bg-wallet-blue"
            />
            <label
              htmlFor="terms"
              className="text-sm text-gray-300 font-medium leading-none cursor-pointer"
            >
              Ich akzeptiere die <a href="/terms" target="_blank" className="text-wallet-blue hover:underline">Nutzungsbedingungen</a>
            </label>
          </div>
          
          <DialogFooter className="mt-6">
            <Button 
              type="button"
              onClick={onClose}
              variant="ghost"
              className="text-gray-300 hover:text-white"
              disabled={isLoading}
            >
              Abbrechen
            </Button>
            <Button 
              type="submit"
              className="bg-wallet-blue hover:bg-wallet-darkBlue text-white shadow-md hover:shadow-lg w-full md:w-auto"
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
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default PersonalDataForm;
