
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import Header from '@/components/Header';
import { AlertDialog, AlertDialogAction, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog';
import { MapPin, Calendar, HelpCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';

const PaymentMethods = () => {
  const [open, setOpen] = useState(false);
  
  return (
    <div className="container mx-auto px-4 py-6 max-w-4xl">
      <Header title="Zahlungsmethoden" showBack={true} />
      
      <div className="mt-8">
        <Card className="border-dashed border-2">
          <CardHeader className="text-center">
            <CardTitle className="flex justify-center">
              <MapPin className="h-8 w-8 text-muted-foreground mb-2" />
            </CardTitle>
            <CardTitle>Nicht verfügbar in Ihrer Region</CardTitle>
            <CardDescription className="text-center max-w-md mx-auto">
              Zahlungsmethoden sind in Ihrer Region derzeit nicht verfügbar. Wir arbeiten daran, diesen Service ab Juni 2025 in Ihrer Region anzubieten.
            </CardDescription>
          </CardHeader>
          <CardContent className="text-center pb-6">
            <div className="flex items-center justify-center gap-2 mb-4 p-2 bg-secondary rounded-md inline-block">
              <Calendar className="h-4 w-4 text-primary" />
              <span className="text-sm font-medium">Geplanter Start: Juni 2025</span>
            </div>
            <p className="text-sm text-muted-foreground mb-6">
              Sobald dieser Service in Ihrer Region verfügbar ist, können Sie hier Kreditkarten, Bankkonto und andere Zahlungsmethoden hinzufügen.
            </p>
            
            <AlertDialog open={open} onOpenChange={setOpen}>
              <AlertDialogTrigger asChild>
                <Button variant="outline" className="flex items-center gap-2">
                  <HelpCircle className="h-4 w-4" />
                  <span>In welchen Regionen ist dies verfügbar?</span>
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>In welchen Regionen ist dies verfügbar?</AlertDialogTitle>
                  <AlertDialogDescription>
                    Unser Zahlungssystem ist derzeit in den folgenden Regionen verfügbar:
                    <ul className="list-disc pl-5 mt-2 space-y-1">
                      <li>Vereinigte Staaten</li>
                      <li>Europäische Union (ausgenommen einige Länder)</li>
                      <li>Vereinigtes Königreich</li>
                      <li>Kanada</li>
                      <li>Australien</li>
                    </ul>
                    <p className="mt-4">
                      Wir planen, in den kommenden Monaten weitere Regionen hinzuzufügen, mit einer vollständigen Abdeckung bis Juni 2025. Danke für Ihre Geduld!
                    </p>
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogAction>Verstanden</AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </CardContent>
        </Card>
      </div>
      
      <div className="mt-8">
        <h3 className="text-lg font-medium mb-4">Was Sie jetzt tun können:</h3>
        <div className="grid gap-4">
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Wallet aufladen durch Krypto-Überweisung</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">
                Sie können Ihr Wallet immer noch durch direkte Überweisungen von anderen Krypto-Wallets auffüllen.
              </p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Benachrichtigung aktivieren</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">
                Wir werden Sie benachrichtigen, sobald Zahlungsmethoden in Ihrer Region verfügbar sind (voraussichtlich Juni 2025).
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default PaymentMethods;
