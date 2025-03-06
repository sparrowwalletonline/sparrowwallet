
import React from 'react';
import { ArrowLeft, FileText, Code, FileCode, Book, Settings, Shield, Lightbulb } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import Header from '@/components/Header';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

const Documentation: React.FC = () => {
  const navigate = useNavigate();
  
  return (
    <div className="min-h-screen bg-background">
      <Header title="Documentation" showBack={true} />
      
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        <div className="mb-12 text-center">
          <h1 className="text-4xl font-bold mb-4">Sparrow Wallet Documentation</h1>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Comprehensive guides and documentation to help you make the most of Sparrow Wallet
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
          <Card className="hover:shadow-md transition-shadow cursor-pointer">
            <CardHeader className="pb-3">
              <div className="flex items-center gap-2">
                <Book className="h-6 w-6 text-primary" />
                <CardTitle>Getting Started</CardTitle>
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground mb-3">
                Everything you need to know to start using Sparrow Wallet, from installation to creating your first wallet.
              </p>
              <ul className="space-y-2 text-sm">
                <li>• Installation Guide</li>
                <li>• Creating Your First Wallet</li>
                <li>• Understanding the Interface</li>
                <li>• Securing Your Wallet</li>
              </ul>
            </CardContent>
          </Card>
          
          <Card className="hover:shadow-md transition-shadow cursor-pointer">
            <CardHeader className="pb-3">
              <div className="flex items-center gap-2">
                <Settings className="h-6 w-6 text-primary" />
                <CardTitle>Advanced Features</CardTitle>
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground mb-3">
                Learn about Sparrow's advanced capabilities and how to use them effectively.
              </p>
              <ul className="space-y-2 text-sm">
                <li>• Coin Control & UTXO Management</li>
                <li>• Multisignature Setup</li>
                <li>• Transaction Labeling</li>
                <li>• Custom Fee Management</li>
              </ul>
            </CardContent>
          </Card>
          
          <Card className="hover:shadow-md transition-shadow cursor-pointer">
            <CardHeader className="pb-3">
              <div className="flex items-center gap-2">
                <Shield className="h-6 w-6 text-primary" />
                <CardTitle>Privacy & Security</CardTitle>
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground mb-3">
                Detailed guides on maximizing your privacy and security when using Bitcoin.
              </p>
              <ul className="space-y-2 text-sm">
                <li>• Connecting to Your Own Node</li>
                <li>• Tor Configuration</li>
                <li>• Address Reuse Prevention</li>
                <li>• BIP39 Passphrases</li>
              </ul>
            </CardContent>
          </Card>
          
          <Card className="hover:shadow-md transition-shadow cursor-pointer">
            <CardHeader className="pb-3">
              <div className="flex items-center gap-2">
                <Code className="h-6 w-6 text-primary" />
                <CardTitle>Technical Resources</CardTitle>
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground mb-3">
                Technical documentation for developers and advanced users.
              </p>
              <ul className="space-y-2 text-sm">
                <li>• PSBT Format Details</li>
                <li>• Script Types & Address Formats</li>
                <li>• Hardware Wallet Integration</li>
                <li>• Command Line Options</li>
              </ul>
            </CardContent>
          </Card>
        </div>
        
        <div className="bg-muted p-6 rounded-lg mb-12">
          <div className="flex items-start gap-4">
            <Lightbulb className="h-10 w-10 text-primary flex-shrink-0 mt-1" />
            <div>
              <h3 className="font-bold text-lg mb-2">Online Documentation</h3>
              <p className="text-muted-foreground mb-4">
                This page provides an overview of available documentation. The full documentation is more comprehensive 
                and regularly updated on the official Sparrow Wallet website.
              </p>
              <p className="text-sm">
                <a href="https://sparrowwallet.com/docs/" className="text-primary hover:underline" target="_blank" rel="noopener noreferrer">
                  View Complete Documentation →
                </a>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Documentation;
