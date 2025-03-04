
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import Header from '@/components/Header';
import { ArrowUpRight, Shield, Cpu, LineChart, Code2, Users, Github } from 'lucide-react';

const About = () => {
  return (
    <div className="container mx-auto px-4 py-6 max-w-4xl">
      <Header title="Über die App" showBack={true} />
      
      <div className="mt-8 space-y-8">
        <div className="text-center">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-primary/10 mb-4">
            <Cpu className="h-8 w-8 text-primary" />
          </div>
          <h1 className="text-3xl font-bold mb-2">CryptoWallet</h1>
          <p className="text-muted-foreground">Version 1.2.4</p>
          <p className="text-sm text-muted-foreground mt-2">© 2023-2024 CryptoWallet GmbH</p>
        </div>
        
        <Card>
          <CardHeader>
            <CardTitle>Unsere Mission</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground">
              Wir machen Kryptowährungen zugänglich für jeden. Unsere Mission ist es, eine sichere, benutzerfreundliche Plattform 
              zu schaffen, die Menschen hilft, die Welt der dezentralen Finanzen zu erkunden, zu verstehen und zu nutzen.
            </p>
          </CardContent>
        </Card>
        
        <div className="grid md:grid-cols-2 gap-4">
          <Card>
            <CardHeader className="pb-2">
              <div className="flex items-center gap-2">
                <Shield className="h-5 w-5 text-primary" />
                <CardTitle className="text-base">Sicherheit</CardTitle>
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">
                Ihre Sicherheit hat höchste Priorität. Unsere Wallet verwendet neueste Verschlüsselungstechnologien, 
                und private Schlüssel werden niemals auf unseren Servern gespeichert.
              </p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="pb-2">
              <div className="flex items-center gap-2">
                <LineChart className="h-5 w-5 text-primary" />
                <CardTitle className="text-base">Transparenz</CardTitle>
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">
                Wir glauben an vollständige Transparenz. Alle Gebühren werden klar angezeigt, 
                und wir kommunizieren offen über Änderungen und Updates.
              </p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="pb-2">
              <div className="flex items-center gap-2">
                <Code2 className="h-5 w-5 text-primary" />
                <CardTitle className="text-base">Open Source</CardTitle>
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">
                Unsere App ist open source, sodass die Community den Code überprüfen 
                und zur Verbesserung beitragen kann.
              </p>
              <a 
                href="#" 
                className="inline-flex items-center text-primary text-sm mt-2"
              >
                GitHub Repository 
                <Github className="ml-1 h-3 w-3" />
              </a>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="pb-2">
              <div className="flex items-center gap-2">
                <Users className="h-5 w-5 text-primary" />
                <CardTitle className="text-base">Gemeinschaft</CardTitle>
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">
                Wir bauen eine aktive Gemeinschaft auf, die gemeinsam lernt und wächst. 
                Treten Sie unseren Diskussionsforen bei und teilen Sie Ihre Ideen.
              </p>
            </CardContent>
          </Card>
        </div>
        
        <Card>
          <CardHeader>
            <CardTitle>Rechtliche Informationen</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between border-b pb-3">
              <span className="text-sm">Nutzungsbedingungen</span>
              <ArrowUpRight className="h-4 w-4 text-muted-foreground" />
            </div>
            <div className="flex items-center justify-between border-b pb-3">
              <span className="text-sm">Datenschutzrichtlinie</span>
              <ArrowUpRight className="h-4 w-4 text-muted-foreground" />
            </div>
            <div className="flex items-center justify-between border-b pb-3">
              <span className="text-sm">Impressum</span>
              <ArrowUpRight className="h-4 w-4 text-muted-foreground" />
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm">Lizenzen</span>
              <ArrowUpRight className="h-4 w-4 text-muted-foreground" />
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default About;
