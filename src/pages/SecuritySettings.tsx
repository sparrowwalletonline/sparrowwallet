
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Shield, Copy, Eye, EyeOff, Lock, Timer, Smartphone, KeyRound, Fingerprint } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { toast } from '@/components/ui/use-toast';
import { useWallet } from '@/contexts/WalletContext';
import { Card, CardContent } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Slider } from '@/components/ui/slider';
import { CustomSwitch } from '@/components/CustomSwitch';
import Header from '@/components/Header';

const SecuritySettings = () => {
  const navigate = useNavigate();
  const { seedPhrase, copyToClipboard } = useWallet();
  const [showSeedPhrase, setShowSeedPhrase] = useState(false);
  const [timeLeft, setTimeLeft] = useState(5);
  const [buttonPressed, setButtonPressed] = useState(false);
  
  // Pin settings
  const [pinEnabled, setPinEnabled] = useState(false);
  const [pin, setPin] = useState('');
  const [confirmPin, setConfirmPin] = useState('');
  const [showPinFields, setShowPinFields] = useState(false);
  
  // Password settings
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  
  // Auto-logout timer
  const [autoLogoutEnabled, setAutoLogoutEnabled] = useState(false);
  const [logoutTime, setLogoutTime] = useState(15);
  
  // Biometric authentication
  const [biometricEnabled, setBiometricEnabled] = useState(false);
  const [biometricAvailable, setBiometricAvailable] = useState(true);
  
  // Device management
  const [devices, setDevices] = useState([
    { id: '1', name: 'Aktuelles Gerät', lastActive: 'Jetzt', isCurrent: true },
    { id: '2', name: 'iPhone 13', lastActive: 'Vor 2 Tagen', isCurrent: false },
    { id: '3', name: 'MacBook Pro', lastActive: 'Vor 5 Tagen', isCurrent: false },
  ]);

  useEffect(() => {
    let timer: NodeJS.Timeout;
    
    if (buttonPressed && timeLeft > 0) {
      timer = setTimeout(() => {
        setTimeLeft(timeLeft - 1);
      }, 1000);
    } else if (timeLeft === 0) {
      setShowSeedPhrase(true);
      setButtonPressed(false);
    }
    
    return () => {
      if (timer) clearTimeout(timer);
    };
  }, [timeLeft, buttonPressed]);

  // Check if biometric auth is available
  useEffect(() => {
    // In a real app, this would check device capabilities
    // For now, we'll just simulate it's available
    setBiometricAvailable(true);
  }, []);

  const handleRevealClick = () => {
    if (!buttonPressed) {
      setButtonPressed(true);
      setTimeLeft(5);
    } else {
      setButtonPressed(false);
    }
  };

  const handleCopySeedPhrase = () => {
    copyToClipboard(seedPhrase.join(' '));
    toast({
      title: "Kopiert!",
      description: "Seed-Phrase wurde in die Zwischenablage kopiert.",
    });
  };

  const resetView = () => {
    setShowSeedPhrase(false);
    setButtonPressed(false);
    setTimeLeft(5);
  };
  
  const handlePinToggle = () => {
    if (pinEnabled) {
      setPinEnabled(false);
      setShowPinFields(false);
      setPin('');
      setConfirmPin('');
    } else {
      setShowPinFields(true);
    }
  };
  
  const savePin = () => {
    if (pin.length < 4) {
      toast({
        title: "Fehler",
        description: "PIN muss mindestens 4 Ziffern lang sein.",
        variant: "destructive",
      });
      return;
    }
    
    if (pin !== confirmPin) {
      toast({
        title: "Fehler",
        description: "PINs stimmen nicht überein.",
        variant: "destructive",
      });
      return;
    }
    
    setPinEnabled(true);
    setShowPinFields(false);
    toast({
      title: "PIN gespeichert",
      description: "Ihre Sicherheits-PIN wurde erfolgreich gespeichert.",
    });
  };
  
  const handleBiometricToggle = () => {
    if (!biometricAvailable && !biometricEnabled) {
      toast({
        title: "Nicht verfügbar",
        description: "Biometrische Authentifizierung ist auf diesem Gerät nicht verfügbar.",
        variant: "destructive",
      });
      return;
    }
    
    setBiometricEnabled(!biometricEnabled);
    
    if (!biometricEnabled) {
      // In a real app, this would request permission and set up biometric auth
      toast({
        title: "Biometrische Authentifizierung aktiviert",
        description: "Sie können nun Ihr Gesicht oder Ihren Fingerabdruck verwenden, um Ihre Wallet zu öffnen.",
      });
    } else {
      toast({
        title: "Biometrische Authentifizierung deaktiviert",
        description: "Biometrische Authentifizierung wurde deaktiviert.",
      });
    }
  };
  
  const changePassword = () => {
    if (!currentPassword || !newPassword || !confirmPassword) {
      toast({
        title: "Fehler",
        description: "Bitte füllen Sie alle Passwortfelder aus.",
        variant: "destructive",
      });
      return;
    }
    
    if (newPassword !== confirmPassword) {
      toast({
        title: "Fehler",
        description: "Neue Passwörter stimmen nicht überein.",
        variant: "destructive",
      });
      return;
    }
    
    toast({
      title: "Passwort geändert",
      description: "Ihr Passwort wurde erfolgreich aktualisiert.",
    });
    
    setCurrentPassword('');
    setNewPassword('');
    setConfirmPassword('');
  };
  
  const handleAutoLogoutToggle = () => {
    setAutoLogoutEnabled(!autoLogoutEnabled);
    
    if (!autoLogoutEnabled) {
      toast({
        title: "Auto-Logout aktiviert",
        description: `Sie werden nach ${logoutTime} Minuten Inaktivität automatisch abgemeldet.`,
      });
    } else {
      toast({
        title: "Auto-Logout deaktiviert",
        description: "Automatischer Logout wurde deaktiviert.",
      });
    }
  };
  
  const removeDevice = (deviceId: string) => {
    setDevices(devices.filter(device => device.id !== deviceId));
    
    toast({
      title: "Gerät entfernt",
      description: "Das Gerät wurde erfolgreich aus Ihrem Konto entfernt.",
    });
  };

  return (
    <div className="container max-w-md mx-auto px-4 py-6">
      <Header title="Sicherheitseinstellungen" showBack={true} />
      
      <Tabs defaultValue="seed" className="mt-8">
        <TabsList className="grid grid-cols-2 gap-1 w-full mb-2">
          <TabsTrigger value="seed">Seed-Phrase</TabsTrigger>
          <TabsTrigger value="pin">PIN & Passwort</TabsTrigger>
        </TabsList>
        <TabsList className="grid grid-cols-2 gap-1 w-full">
          <TabsTrigger value="logout">Auto-Logout</TabsTrigger>
          <TabsTrigger value="devices">Geräte</TabsTrigger>
        </TabsList>
        
        <TabsContent value="seed" className="space-y-4 mt-4">
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <Shield className="w-5 h-5 text-blue-600" />
                  <h2 className="text-lg font-medium">Seed-Phrase anzeigen</h2>
                </div>
              </div>
              
              <p className="text-sm text-muted-foreground mb-4">
                Deine Seed-Phrase ist der Schlüssel zu deiner Wallet. Bewahre sie sicher auf und teile sie mit niemandem.
              </p>
              
              {!showSeedPhrase ? (
                <div className="text-center py-4">
                  <Button 
                    onClick={handleRevealClick}
                    className="mb-2 w-full"
                    variant={buttonPressed ? "destructive" : "default"}
                  >
                    {buttonPressed ? `Halte für ${timeLeft}s gedrückt` : "Seed-Phrase anzeigen"}
                    {buttonPressed ? <EyeOff className="ml-2 h-4 w-4" /> : <Eye className="ml-2 h-4 w-4" />}
                  </Button>
                  {buttonPressed && (
                    <p className="text-xs text-muted-foreground">
                      Halte den Button gedrückt, um die Seed-Phrase anzuzeigen
                    </p>
                  )}
                </div>
              ) : (
                <div className="bg-muted rounded-md p-4 mb-4">
                  <div className="grid grid-cols-3 gap-2 mb-4">
                    {seedPhrase.map((word, index) => (
                      <div key={index} className="bg-background rounded border px-2 py-1 text-sm">
                        <span className="text-muted-foreground mr-1">{index + 1}.</span> {word}
                      </div>
                    ))}
                  </div>
                  <div className="flex gap-2 mt-4">
                    <Button onClick={handleCopySeedPhrase} variant="outline" className="w-1/2">
                      <Copy className="mr-2 h-4 w-4" /> Kopieren
                    </Button>
                    <Button onClick={resetView} variant="outline" className="w-1/2">
                      <EyeOff className="mr-2 h-4 w-4" /> Verbergen
                    </Button>
                  </div>
                </div>
              )}
              
              <p className="text-xs text-red-500 font-medium">
                WARNUNG: Gib niemals deine Seed-Phrase weiter. Jeder mit Zugriff auf diese Wörter kann deine Wallet kontrollieren.
              </p>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="pin" className="space-y-4 mt-4">
          <Card>
            <CardContent className="pt-6 space-y-6">
              <div>
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-2">
                    <KeyRound className="w-5 h-5 text-blue-600" />
                    <h2 className="text-lg font-medium">Sicherheits-PIN einrichten</h2>
                  </div>
                  <div className="flex items-center space-x-2">
                    <CustomSwitch checked={pinEnabled} onCheckedChange={handlePinToggle} />
                  </div>
                </div>
                
                <p className="text-sm text-muted-foreground mb-4">
                  Eine PIN bietet zusätzlichen Schutz für sensible Aktionen wie Transaktionen und Wallet-Zugriff.
                </p>
                
                {showPinFields && (
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="pin">PIN eingeben (min. 4 Ziffern)</Label>
                      <Input id="pin" type="password" value={pin} onChange={(e) => setPin(e.target.value)} maxLength={8} placeholder="PIN eingeben" />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="confirmPin">PIN bestätigen</Label>
                      <Input id="confirmPin" type="password" value={confirmPin} onChange={(e) => setConfirmPin(e.target.value)} maxLength={8} placeholder="PIN bestätigen" />
                    </div>
                    <Button onClick={savePin} className="w-full">PIN speichern</Button>
                  </div>
                )}
              </div>
              
              {/* New Biometric Authentication Section */}
              <div className="pt-4 border-t">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-2">
                    <Fingerprint className="w-5 h-5 text-blue-600" />
                    <h2 className="text-lg font-medium">Face ID / Touch ID</h2>
                  </div>
                  <div className="flex items-center space-x-2">
                    <CustomSwitch 
                      checked={biometricEnabled} 
                      onCheckedChange={handleBiometricToggle} 
                      disabled={!biometricAvailable} 
                    />
                  </div>
                </div>
                
                <p className="text-sm text-muted-foreground mb-4">
                  Verwenden Sie Gesichtserkennung oder Fingerabdruck, um Ihre Wallet schnell und sicher zu öffnen.
                </p>
                
                {!biometricAvailable && (
                  <p className="text-xs text-amber-500 bg-amber-50 p-3 rounded-md">
                    Biometrische Authentifizierung ist auf diesem Gerät nicht verfügbar. 
                    Diese Funktion ist für iOS (Face ID/Touch ID) und Android (Fingerabdruck/Gesichtserkennung) optimiert.
                  </p>
                )}
              </div>
              
              <div className="pt-4 border-t">
                <div className="flex items-center gap-2 mb-4">
                  <Lock className="w-5 h-5 text-blue-600" />
                  <h2 className="text-lg font-medium">Passwort ändern</h2>
                </div>
                
                <p className="text-sm text-muted-foreground mb-4">
                  Ändere regelmäßig dein Passwort, um die Sicherheit deines Kontos zu erhöhen.
                </p>
                
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="current-password">Aktuelles Passwort</Label>
                    <Input id="current-password" type="password" value={currentPassword} onChange={(e) => setCurrentPassword(e.target.value)} placeholder="Aktuelles Passwort" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="new-password">Neues Passwort</Label>
                    <Input id="new-password" type="password" value={newPassword} onChange={(e) => setNewPassword(e.target.value)} placeholder="Neues Passwort" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="confirm-password">Passwort bestätigen</Label>
                    <Input id="confirm-password" type="password" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} placeholder="Passwort bestätigen" />
                  </div>
                  <Button onClick={changePassword} className="w-full">Passwort ändern</Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="logout" className="space-y-4 mt-4">
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <Timer className="w-5 h-5 text-blue-600" />
                  <h2 className="text-lg font-medium">Auto-Logout Timer</h2>
                </div>
                <div className="flex items-center space-x-2">
                  <CustomSwitch checked={autoLogoutEnabled} onCheckedChange={handleAutoLogoutToggle} />
                </div>
              </div>
              
              <p className="text-sm text-muted-foreground mb-4">
                Automatisch abmelden nach einer bestimmten Zeit der Inaktivität.
              </p>
              
              <div className="space-y-6">
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <Label>Inaktivitätszeit: {logoutTime} Minuten</Label>
                  </div>
                  <Slider
                    disabled={!autoLogoutEnabled}
                    value={[logoutTime]}
                    min={5}
                    max={60}
                    step={5}
                    onValueChange={(value) => setLogoutTime(value[0])}
                  />
                  <div className="flex justify-between text-xs text-muted-foreground">
                    <span>5 Min</span>
                    <span>60 Min</span>
                  </div>
                </div>
                
                <p className="text-xs bg-muted p-3 rounded-md">
                  Hinweis: Ein kurzer Timer erhöht die Sicherheit, erfordert aber häufigeres Einloggen.
                </p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="devices" className="space-y-4 mt-4">
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center gap-2 mb-4">
                <Smartphone className="w-5 h-5 text-blue-600" />
                <h2 className="text-lg font-medium">Geräteverwaltung</h2>
              </div>
              
              <p className="text-sm text-muted-foreground mb-4">
                Verwalte die Geräte, die auf dein Konto zugreifen können.
              </p>
              
              <div className="space-y-4">
                {devices.map(device => (
                  <div key={device.id} className="flex justify-between items-center p-3 border rounded-md">
                    <div>
                      <p className="font-medium">{device.name} {device.isCurrent && <span className="text-xs bg-blue-100 text-blue-800 py-0.5 px-2 rounded-full ml-2">Aktuell</span>}</p>
                      <p className="text-xs text-muted-foreground">Letzter Zugriff: {device.lastActive}</p>
                    </div>
                    {!device.isCurrent && (
                      <Button variant="outline" size="sm" onClick={() => removeDevice(device.id)}>
                        Entfernen
                      </Button>
                    )}
                  </div>
                ))}
              </div>
              
              <p className="text-xs mt-4 bg-muted p-3 rounded-md">
                Wenn du ein Gerät entfernst, wird die Sitzung auf diesem Gerät sofort beendet und erfordert eine erneute Anmeldung.
              </p>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default SecuritySettings;
