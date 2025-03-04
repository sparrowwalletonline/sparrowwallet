
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { HelpCircle, MessageCircle, FileQuestion, Book, ExternalLink } from 'lucide-react';
import Header from '@/components/Header';

const HelpCenter = () => {
  return (
    <div className="container mx-auto px-4 py-6 max-w-4xl">
      <Header title="Hilfe & Support" showBack={true} />
      
      <div className="mt-6">
        <div className="relative mb-8">
          <Input 
            placeholder="Wonach suchen Sie?"
            className="pl-10"
          />
          <HelpCircle className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
        </div>
        
        <div className="grid gap-6">
          <Card>
            <CardHeader>
              <CardTitle>Häufig gestellte Fragen</CardTitle>
              <CardDescription>Antworten auf die am häufigsten gestellten Fragen</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="border rounded-lg p-4 hover:bg-accent cursor-pointer transition-colors">
                <h3 className="font-medium mb-1">Wie erstelle ich ein neues Wallet?</h3>
                <p className="text-sm text-muted-foreground">
                  Erfahren Sie, wie Sie ein neues Krypto-Wallet erstellen und sichern.
                </p>
              </div>
              
              <div className="border rounded-lg p-4 hover:bg-accent cursor-pointer transition-colors">
                <h3 className="font-medium mb-1">Was ist eine Seed Phrase?</h3>
                <p className="text-sm text-muted-foreground">
                  Verstehen Sie die Bedeutung und Sicherheit Ihrer Wiederherstellungsphrase.
                </p>
              </div>
              
              <div className="border rounded-lg p-4 hover:bg-accent cursor-pointer transition-colors">
                <h3 className="font-medium mb-1">Wie sende ich Kryptowährungen?</h3>
                <p className="text-sm text-muted-foreground">
                  Eine Anleitung zum Senden von Kryptowährungen an andere Wallets.
                </p>
              </div>
              
              <div className="border rounded-lg p-4 hover:bg-accent cursor-pointer transition-colors">
                <h3 className="font-medium mb-1">Was sind Transaktionsgebühren?</h3>
                <p className="text-sm text-muted-foreground">
                  Erklärung zu Netzwerkgebühren und wie sie sich auf Transaktionen auswirken.
                </p>
              </div>
              
              <Button className="w-full" variant="outline">Alle FAQs anzeigen</Button>
            </CardContent>
          </Card>
          
          <div className="grid md:grid-cols-2 gap-4">
            <Card>
              <CardHeader>
                <div className="flex items-center gap-2">
                  <MessageCircle className="h-5 w-5 text-primary" />
                  <CardTitle className="text-base">Live Chat Support</CardTitle>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground mb-4">
                  Sprechen Sie direkt mit einem unserer Support-Mitarbeiter.
                </p>
                <p className="text-xs text-muted-foreground mb-4">
                  Verfügbar: Mo-Fr, 9:00 - 18:00 Uhr
                </p>
                <Button className="w-full">Chat starten</Button>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <div className="flex items-center gap-2">
                  <FileQuestion className="h-5 w-5 text-primary" />
                  <CardTitle className="text-base">Support-Ticket erstellen</CardTitle>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground mb-4">
                  Erstellen Sie ein Ticket für komplexere Probleme.
                </p>
                <p className="text-xs text-muted-foreground mb-4">
                  Antwortzeit: Innerhalb von 24 Stunden
                </p>
                <Button className="w-full" variant="outline">Ticket erstellen</Button>
              </CardContent>
            </Card>
          </div>
          
          <Card>
            <CardHeader>
              <CardTitle>Ressourcen</CardTitle>
              <CardDescription>Weitere Hilfe und Lernmaterialien</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between p-2 hover:bg-accent rounded-md transition-colors cursor-pointer">
                <div className="flex items-center gap-3">
                  <Book className="h-5 w-5 text-primary" />
                  <span>Benutzerhandbuch</span>
                </div>
                <ExternalLink className="h-4 w-4 text-muted-foreground" />
              </div>
              
              <div className="flex items-center justify-between p-2 hover:bg-accent rounded-md transition-colors cursor-pointer">
                <div className="flex items-center gap-3">
                  <FileQuestion className="h-5 w-5 text-primary" />
                  <span>Krypto-Glossar</span>
                </div>
                <ExternalLink className="h-4 w-4 text-muted-foreground" />
              </div>
              
              <div className="flex items-center justify-between p-2 hover:bg-accent rounded-md transition-colors cursor-pointer">
                <div className="flex items-center gap-3">
                  <MessageCircle className="h-5 w-5 text-primary" />
                  <span>Community Forum</span>
                </div>
                <ExternalLink className="h-4 w-4 text-muted-foreground" />
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default HelpCenter;
