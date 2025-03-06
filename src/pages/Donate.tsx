
import React from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '@/components/Header';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Heart, Copy, ExternalLink, ArrowRight, Bitcoin, Zap, QrCode } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';

const Donate: React.FC = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  
  const bitcoinAddress = "bc1q5d7rfpz7d5cgem4cy0yvfm5lx5uskrn5x9m58s";
  const lightningAddress = "craig@strayacoin.org";
  
  const copyToClipboard = (text: string, type: string) => {
    navigator.clipboard.writeText(text);
    toast({
      title: "Copied!",
      description: `${type} has been copied to clipboard.`,
      duration: 1500,
    });
  };
  
  return (
    <div className="min-h-screen bg-background">
      <Header title="Donate" showBack={true} />
      
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        <div className="mb-12 text-center">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-primary/10 mb-4">
            <Heart className="h-8 w-8 text-primary" />
          </div>
          <h1 className="text-4xl font-bold mb-4">Support Sparrow Development</h1>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Sparrow Wallet is free and open source software. Your donations help support continued development.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
          <Card>
            <CardHeader>
              <div className="flex items-center gap-2">
                <Bitcoin className="h-6 w-6 text-primary" />
                <CardTitle>Bitcoin Donation</CardTitle>
              </div>
              <CardDescription>Support via on-chain Bitcoin transaction</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex flex-col items-center mb-6">
                <div className="bg-muted w-48 h-48 flex items-center justify-center mb-4 rounded-lg">
                  <QrCode size={120} className="text-primary" />
                </div>
                <div className="text-center text-sm">Scan with your wallet app</div>
              </div>
              
              <div className="bg-muted p-3 rounded-md flex items-center justify-between mb-4">
                <span className="text-sm font-mono overflow-hidden text-ellipsis">{bitcoinAddress}</span>
                <Button variant="ghost" size="icon" onClick={() => copyToClipboard(bitcoinAddress, "Bitcoin address")}>
                  <Copy size={16} />
                </Button>
              </div>
              
              <Button variant="outline" className="w-full" onClick={() => window.open("https://mempool.space/address/" + bitcoinAddress)}>
                <ExternalLink size={16} className="mr-2" /> View on Block Explorer
              </Button>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <div className="flex items-center gap-2">
                <Zap className="h-6 w-6 text-primary" />
                <CardTitle>Lightning Network</CardTitle>
              </div>
              <CardDescription>Support via Lightning Network for lower fees</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex flex-col items-center mb-6">
                <div className="bg-muted w-48 h-48 flex items-center justify-center mb-4 rounded-lg">
                  <QrCode size={120} className="text-primary" />
                </div>
                <div className="text-center text-sm">Scan with your Lightning wallet</div>
              </div>
              
              <div className="bg-muted p-3 rounded-md flex items-center justify-between mb-4">
                <span className="text-sm font-mono overflow-hidden text-ellipsis">{lightningAddress}</span>
                <Button variant="ghost" size="icon" onClick={() => copyToClipboard(lightningAddress, "Lightning address")}>
                  <Copy size={16} />
                </Button>
              </div>
              
              <Button className="w-full">
                <Zap size={16} className="mr-2" /> Open in Lightning Wallet
              </Button>
            </CardContent>
          </Card>
        </div>
        
        <Card className="mb-12">
          <CardHeader>
            <CardTitle>Why Donate?</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p>
              Sparrow Wallet is developed as an open source project with no venture capital backing or 
              corporate funding. Your donations directly support:
            </p>
            
            <ul className="space-y-2 list-disc pl-5">
              <li>Continued development of new features</li>
              <li>Bug fixes and security updates</li>
              <li>Testing with various hardware wallets</li>
              <li>Documentation and educational resources</li>
              <li>Server costs for website and support infrastructure</li>
            </ul>
            
            <p className="pt-2">
              Every donation, no matter the size, helps keep Sparrow independent and focused on providing 
              the best Bitcoin wallet experience possible.
            </p>
          </CardContent>
        </Card>
        
        <div className="text-center mb-12">
          <h2 className="text-2xl font-bold mb-4">Other Ways to Support</h2>
          <p className="text-muted-foreground mb-8 max-w-2xl mx-auto">
            Besides donations, there are many other ways you can help support the Sparrow Wallet project
          </p>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card>
              <CardContent className="pt-6">
                <h3 className="font-bold text-lg mb-3">Contribute Code</h3>
                <p className="text-sm text-muted-foreground mb-4">
                  Help improve Sparrow by contributing code, reviewing PRs, or reporting bugs on GitHub.
                </p>
                <a 
                  href="https://github.com/sparrowwallet/sparrow" 
                  className="inline-flex items-center text-primary text-sm hover:underline"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  View on GitHub <ArrowRight size={14} className="ml-1" />
                </a>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="pt-6">
                <h3 className="font-bold text-lg mb-3">Spread the Word</h3>
                <p className="text-sm text-muted-foreground mb-4">
                  Share Sparrow with others. Write about your experience or create tutorial content.
                </p>
                <a 
                  href="https://twitter.com/SparrowWallet" 
                  className="inline-flex items-center text-primary text-sm hover:underline"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Follow on Twitter <ArrowRight size={14} className="ml-1" />
                </a>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="pt-6">
                <h3 className="font-bold text-lg mb-3">Improve Documentation</h3>
                <p className="text-sm text-muted-foreground mb-4">
                  Help improve guides, tutorials, and documentation to make Sparrow more accessible.
                </p>
                <a 
                  href="https://sparrowwallet.com/docs/" 
                  className="inline-flex items-center text-primary text-sm hover:underline"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  View Documentation <ArrowRight size={14} className="ml-1" />
                </a>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Donate;
