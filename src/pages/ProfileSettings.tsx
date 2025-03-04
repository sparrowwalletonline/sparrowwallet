
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { useWallet } from '@/contexts/WalletContext';
import Header from '@/components/Header';

const ProfileSettings = () => {
  const { toast } = useToast();
  const { session } = useWallet();
  
  const handleSaveChanges = (e: React.FormEvent) => {
    e.preventDefault();
    toast({
      title: "Einstellungen gespeichert",
      description: "Ihre Profilaktualisierungen wurden erfolgreich gespeichert.",
    });
  };

  return (
    <div className="container mx-auto px-4 py-6 max-w-4xl">
      <Header title="Profil Einstellungen" showBack={true} />
      
      <div className="grid gap-6 mt-8">
        <Card>
          <CardHeader>
            <CardTitle>Persönliche Informationen</CardTitle>
            <CardDescription>
              Aktualisieren Sie Ihre persönlichen Angaben und Profilbild
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSaveChanges} className="space-y-6">
              <div className="space-y-4">
                <div className="grid gap-2">
                  <Label htmlFor="name">Name</Label>
                  <Input 
                    id="name" 
                    placeholder="Ihr Name" 
                    defaultValue={session?.user?.user_metadata?.full_name || ''}
                  />
                </div>
                
                <div className="grid gap-2">
                  <Label htmlFor="email">E-Mail</Label>
                  <Input 
                    id="email" 
                    type="email" 
                    placeholder="Ihre E-Mail-Adresse" 
                    defaultValue={session?.user?.email || ''}
                    disabled
                  />
                  <p className="text-sm text-muted-foreground">
                    Ihre E-Mail-Adresse können Sie nicht ändern.
                  </p>
                </div>
                
                <div className="grid gap-2">
                  <Label htmlFor="phone">Telefonnummer</Label>
                  <Input 
                    id="phone" 
                    type="tel" 
                    placeholder="Ihre Telefonnummer" 
                    defaultValue={session?.user?.phone || ''}
                  />
                </div>
              </div>
              
              <Button type="submit">Änderungen speichern</Button>
            </form>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle>Benachrichtigungen</CardTitle>
            <CardDescription>Stellen Sie ein, wie und wann Sie Benachrichtigungen erhalten möchten</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4">
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <h3 className="font-medium">E-Mail-Benachrichtigungen</h3>
                  <p className="text-sm text-muted-foreground">Erhalten Sie Benachrichtigungen per E-Mail</p>
                </div>
                <Button variant="outline">Konfigurieren</Button>
              </div>
              
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <h3 className="font-medium">Push-Benachrichtigungen</h3>
                  <p className="text-sm text-muted-foreground">Benachrichtigungen auf Ihrem Gerät</p>
                </div>
                <Button variant="outline">Konfigurieren</Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default ProfileSettings;
