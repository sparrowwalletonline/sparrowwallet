
import React from 'react';
import { ArrowLeft, Shield, Wallet, Lock, Bitcoin, RefreshCw, Network, LayoutList, Layers } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useNavigate } from 'react-router-dom';
import Header from '@/components/Header';

const Features: React.FC = () => {
  const navigate = useNavigate();
  
  return (
    <div className="min-h-screen bg-background">
      <Header title="Features" showBack={true} />
      
      <div className="container mx-auto px-4 py-8 max-w-5xl">
        <div className="mb-12 text-center">
          <h1 className="text-4xl font-bold mb-4">Sparrow Wallet Features</h1>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            A modern, comprehensive Bitcoin wallet with sophisticated features for privacy-focused users
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
          <Card>
            <CardHeader className="pb-3">
              <div className="flex items-center gap-2">
                <Shield className="h-6 w-6 text-primary" />
                <CardTitle>Privacy-Focused</CardTitle>
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">
                Connect to your own node for enhanced privacy. Supports Tor connections and coin selection to maintain your financial privacy.
              </p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="pb-3">
              <div className="flex items-center gap-2">
                <Wallet className="h-6 w-6 text-primary" />
                <CardTitle>Hardware Wallet Support</CardTitle>
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">
                Works with most popular hardware wallets, including Trezor, Ledger, Coldcard, and more, providing secure offline key storage.
              </p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="pb-3">
              <div className="flex items-center gap-2">
                <Lock className="h-6 w-6 text-primary" />
                <CardTitle>Multisignature Support</CardTitle>
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">
                Create and manage multisig wallets with easy setup processes and clear visualization of co-signers and thresholds.
              </p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="pb-3">
              <div className="flex items-center gap-2">
                <Bitcoin className="h-6 w-6 text-primary" />
                <CardTitle>PSBT Format</CardTitle>
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">
                Full support for Partially Signed Bitcoin Transactions (PSBT), enabling complex collaborative transactions.
              </p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="pb-3">
              <div className="flex items-center gap-2">
                <RefreshCw className="h-6 w-6 text-primary" />
                <CardTitle>Coin Control</CardTitle>
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">
                Advanced coin control features allow you to select which specific UTXOs to spend in your transactions.
              </p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="pb-3">
              <div className="flex items-center gap-2">
                <Network className="h-6 w-6 text-primary" />
                <CardTitle>Network Analysis</CardTitle>
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">
                Detailed transaction graphs provide visual insights into your transaction history and connections.
              </p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="pb-3">
              <div className="flex items-center gap-2">
                <LayoutList className="h-6 w-6 text-primary" />
                <CardTitle>BIP39 Support</CardTitle>
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">
                Full support for BIP39 seed phrases with optional passphrases for enhanced security.
              </p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="pb-3">
              <div className="flex items-center gap-2">
                <Layers className="h-6 w-6 text-primary" />
                <CardTitle>Address Types</CardTitle>
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">
                Support for all major address types including Legacy, SegWit, Native SegWit, and Taproot.
              </p>
            </CardContent>
          </Card>
        </div>
        
        <div className="text-center mb-12">
          <Button 
            size="lg" 
            onClick={() => navigate('/')}
            className="mx-auto"
          >
            Try Sparrow Online Now
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Features;
