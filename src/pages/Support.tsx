
import React from 'react';
import { ArrowLeft, HelpCircle, MessageCircle, FileText, AlertTriangle, Github, Twitter } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import Header from '@/components/Header';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

const Support: React.FC = () => {
  const navigate = useNavigate();
  
  return (
    <div className="min-h-screen bg-background">
      <Header title="Support" showBack={true} />
      
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        <div className="mb-12 text-center">
          <h1 className="text-4xl font-bold mb-4">Sparrow Wallet Support</h1>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Get help with any issues or questions about using Sparrow Wallet
          </p>
        </div>

        <div className="mb-10">
          <div className="relative mb-6">
            <Input 
              placeholder="Search for answers..." 
              className="pl-10"
            />
            <HelpCircle className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
          <Card className="hover:shadow-md transition-shadow">
            <CardHeader className="pb-3">
              <div className="flex items-center gap-2">
                <MessageCircle className="h-6 w-6 text-primary" />
                <CardTitle>Community Discussions</CardTitle>
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground mb-4">
                Join our community discussions on various platforms to get help and share your experiences.
              </p>
              <div className="space-y-3">
                <a href="https://github.com/sparrowwallet/sparrow/discussions" 
                   className="flex items-center gap-2 text-primary hover:underline" 
                   target="_blank" rel="noopener noreferrer">
                  <Github size={16} />
                  <span>GitHub Discussions</span>
                </a>
                <a href="https://twitter.com/SparrowWallet" 
                   className="flex items-center gap-2 text-primary hover:underline" 
                   target="_blank" rel="noopener noreferrer">
                  <Twitter size={16} />
                  <span>Twitter</span>
                </a>
              </div>
            </CardContent>
          </Card>
          
          <Card className="hover:shadow-md transition-shadow">
            <CardHeader className="pb-3">
              <div className="flex items-center gap-2">
                <FileText className="h-6 w-6 text-primary" />
                <CardTitle>Documentation & Guides</CardTitle>
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground mb-4">
                Our comprehensive documentation covers most questions and provides helpful guides.
              </p>
              <div className="space-y-3">
                <a href="https://sparrowwallet.com/docs/" 
                   className="flex items-center gap-2 text-primary hover:underline" 
                   target="_blank" rel="noopener noreferrer">
                  <FileText size={16} />
                  <span>View Documentation</span>
                </a>
                <button 
                  onClick={() => navigate('/documentation')}
                  className="flex items-center gap-2 text-primary hover:underline"
                >
                  <HelpCircle size={16} />
                  <span>Guides & Tutorials</span>
                </button>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="mb-12">
          <h2 className="text-2xl font-bold mb-6">Frequently Asked Questions</h2>
          <Accordion type="single" collapsible className="w-full">
            <AccordionItem value="item-1">
              <AccordionTrigger>What is Sparrow Wallet?</AccordionTrigger>
              <AccordionContent>
                Sparrow is a Bitcoin wallet application that emphasizes security, privacy, and usability. 
                It provides users with fine-grained control over their Bitcoin transactions and connects 
                directly to their own Bitcoin node.
              </AccordionContent>
            </AccordionItem>
            <AccordionItem value="item-2">
              <AccordionTrigger>Is Sparrow Wallet open source?</AccordionTrigger>
              <AccordionContent>
                Yes, Sparrow Wallet is completely open source. The code is available on GitHub for review 
                and contribution by the community. It is released under the MIT License.
              </AccordionContent>
            </AccordionItem>
            <AccordionItem value="item-3">
              <AccordionTrigger>How does Sparrow protect my privacy?</AccordionTrigger>
              <AccordionContent>
                Sparrow protects your privacy by connecting directly to your Bitcoin node, supporting Tor connections, 
                and providing advanced coin control features. This allows you to maintain maximum control over your 
                transaction data and minimize leakage of sensitive information.
              </AccordionContent>
            </AccordionItem>
            <AccordionItem value="item-4">
              <AccordionTrigger>Does Sparrow support hardware wallets?</AccordionTrigger>
              <AccordionContent>
                Yes, Sparrow supports a wide range of hardware wallets including Trezor, Ledger, Coldcard, BitBox, Jade, 
                and Keystone devices. Hardware wallets provide enhanced security by keeping your private keys offline.
              </AccordionContent>
            </AccordionItem>
            <AccordionItem value="item-5">
              <AccordionTrigger>What's the difference between the desktop app and online version?</AccordionTrigger>
              <AccordionContent>
                The desktop app provides full functionality with enhanced security features like direct node connections. 
                The online version offers convenient access from any device but with more limited functionality. 
                For maximum security and privacy, we recommend using the desktop application.
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </div>

        <div className="bg-muted p-6 rounded-lg mb-12">
          <div className="flex items-start gap-4">
            <AlertTriangle className="h-10 w-10 text-primary flex-shrink-0 mt-1" />
            <div>
              <h3 className="font-bold text-lg mb-2">Security Notice</h3>
              <p className="text-muted-foreground mb-4">
                For the most secure experience, we recommend using the desktop version of Sparrow Wallet. 
                This allows you to connect to your own node and maintain full control over your Bitcoin.
              </p>
              <a 
                href="https://sparrowwallet.com/download/" 
                className="inline-flex items-center text-primary hover:underline"
                target="_blank"
                rel="noopener noreferrer"
              >
                <Button>Download Desktop Version</Button>
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Support;
