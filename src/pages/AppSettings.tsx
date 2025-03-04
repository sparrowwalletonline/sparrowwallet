
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import Header from '@/components/Header';
import ThemeToggle from '@/components/ThemeToggle';

const AppSettings = () => {
  const { toast } = useToast();
  const [language, setLanguage] = useState("deutsch");
  const [currency, setCurrency] = useState("eur");
  
  const handleClearCache = () => {
    // Implementation would clear app cache
    toast({
      title: "Cache geleert",
      description: "Der App-Cache wurde erfolgreich geleert.",
    });
  };
  
  const handleResetSettings = () => {
    // Reset settings to defaults
    setLanguage("deutsch");
    setCurrency("eur");
    toast({
      title: "Einstellungen zurückgesetzt",
      description: "Alle Einstellungen wurden auf die Standardwerte zurückgesetzt.",
    });
  };

  return (
    <div className="container mx-auto px-4 py-6 max-w-4xl">
      <Header title="App-Einstellungen" showBack={true} />
      
      <div className="grid gap-6 mt-8">
        <Card>
          <CardHeader>
            <CardTitle>Grundeinstellungen</CardTitle>
            <CardDescription>
              Passen Sie grundlegende Einstellungen der App an
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <div>
                  <Label>Erscheinungsbild</Label>
                  <p className="text-sm text-muted-foreground">
                    Light oder Dark Mode auswählen
                  </p>
                </div>
                <ThemeToggle />
              </div>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="language">Sprache</Label>
              <select 
                id="language" 
                className="flex h-10 w-full items-center justify-between rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                value={language}
                onChange={(e) => setLanguage(e.target.value)}
              >
                <option value="deutsch">Deutsch</option>
                <option value="english">Englisch</option>
                <option value="francais">Französisch</option>
                <option value="espanol">Spanisch</option>
              </select>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="currency">Anzeigewährung</Label>
              <select 
                id="currency" 
                className="flex h-10 w-full items-center justify-between rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                value={currency}
                onChange={(e) => setCurrency(e.target.value)}
              >
                <option value="eur">Euro (€)</option>
                <option value="usd">US Dollar ($)</option>
                <option value="gbp">Britisches Pfund (£)</option>
                <option value="chf">Schweizer Franken (CHF)</option>
              </select>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle>Datenverwaltung</CardTitle>
            <CardDescription>Verwalten Sie App-Daten und Cache</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <h3 className="font-medium">App-Cache leeren</h3>
                <p className="text-sm text-muted-foreground">Temporäre Dateien und Daten löschen</p>
              </div>
              <Button onClick={handleClearCache} variant="outline">Cache leeren</Button>
            </div>
            
            <Dialog>
              <DialogTrigger asChild>
                <Button variant="destructive">Alle Einstellungen zurücksetzen</Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Einstellungen zurücksetzen?</DialogTitle>
                  <DialogDescription>
                    Diese Aktion setzt alle App-Einstellungen auf die Standardwerte zurück. Diese Aktion kann nicht rückgängig gemacht werden.
                  </DialogDescription>
                </DialogHeader>
                <div className="flex justify-end gap-3 mt-4">
                  <Button variant="outline">Abbrechen</Button>
                  <Button onClick={handleResetSettings} variant="destructive">Zurücksetzen</Button>
                </div>
              </DialogContent>
            </Dialog>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default AppSettings;
