
import React from 'react';
import { Button } from '@/components/ui/button';
import WalletLogo from '@/components/WalletLogo';
import { ArrowRight, Check, Menu, Star, Shield, Users, Smartphone, Sparkles, Eye, Globe, Gift, Coins, Wallet } from 'lucide-react';
import { useWallet } from '@/contexts/WalletContext';

const LandingPage: React.FC = () => {
  const {
    generateWallet
  } = useWallet();
  
  const handleCreateWallet = () => {
    generateWallet();
  };
  
  return (
    <div className="min-h-screen flex flex-col bg-white text-gray-800">
      <header className="w-full p-6 flex justify-between items-center">
        <div className="flex items-center gap-2">
          <WalletLogo className="w-8 h-8" />
          <span className="font-heading text-xl font-bold">Trust Wallet</span>
        </div>
        <Menu className="w-6 h-6 cursor-pointer text-gray-800" />
      </header>
      
      <div className="flex-1 flex flex-col p-6">
        <div className="space-y-6 mb-10">
          <h1 className="font-heading tracking-tight text-gray-900 leading-[1.3] font-bold text-4xl md:text-5xl">
            The most trusted<br />
            & secure<br />
            crypto wallet
          </h1>
          
          <p className="font-sans text-gray-600 text-base max-w-md">
            Buy, store, collect NFTs, exchange & earn crypto. Join 50 million+ people using Trust Wallet.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4">
            <Button onClick={handleCreateWallet} className="w-full sm:w-auto py-6 text-base flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-medium transition-all rounded-xl">
              Create a new wallet <ArrowRight className="h-4 w-4" />
            </Button>
          </div>
          
          <div className="flex flex-col space-y-3 pt-4">
            <div className="flex items-center gap-2">
              <div className="rounded-full bg-green-100 p-1">
                <Check className="h-4 w-4 text-green-600" />
              </div>
              <span className="text-sm text-gray-700">Multi-chain support for 8M+ assets</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="rounded-full bg-green-100 p-1">
                <Check className="h-4 w-4 text-green-600" />
              </div>
              <span className="text-sm text-gray-700">Buy crypto with credit card</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="rounded-full bg-green-100 p-1">
                <Check className="h-4 w-4 text-green-600" />
              </div>
              <span className="text-sm text-gray-700">Self-custodial & secure</span>
            </div>
          </div>
        </div>
        
        <div className="mt-6 relative">
          <img alt="Trust Wallet Features" className="w-full max-w-md mx-auto" src="/lovable-uploads/057ecf4e-ca5a-4928-9979-cb5032455af3.jpg" />
        </div>
        
        <div className="mt-12 grid grid-cols-3 gap-4">
          <div className="text-center">
            <div className="text-blue-500 font-heading font-bold text-xl">50M+</div>
            <div className="text-gray-600 text-sm">Users</div>
          </div>
          <div className="text-center">
            <div className="text-blue-500 font-heading font-bold text-xl">100+</div>
            <div className="text-gray-600 text-sm">Blockchains</div>
          </div>
          <div className="text-center">
            <div className="text-blue-500 font-heading font-bold text-xl">8M+</div>
            <div className="text-gray-600 text-sm">Assets</div>
          </div>
        </div>
        
        {/* One Platform, Millions of Assets Section */}
        <div className="py-16 my-12 -mx-6 px-6 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-3xl">
          <div className="text-center mb-12">
            <h2 className="font-heading text-3xl font-bold mb-4 bg-gradient-to-r from-blue-500 to-indigo-600 bg-clip-text text-transparent">One Platform, Millions of Assets</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Trust Wallet is your gateway to the blockchain ecosystem. Store, trade, and discover over 8 million digital assets across 100+ blockchains.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <AssetCard 
              icon={<Globe className="h-6 w-6 text-indigo-500" />}
              title="Global Access"
              description="Access the blockchain ecosystem from anywhere in the world"
              color="indigo"
            />
            <AssetCard 
              icon={<Coins className="h-6 w-6 text-purple-500" />}
              title="Multiple Assets"
              description="Support for 8M+ cryptocurrencies and digital assets"
              color="purple"
            />
            <AssetCard 
              icon={<Users className="h-6 w-6 text-blue-500" />}
              title="Growing Community"
              description="Join 50M+ users who trust our platform"
              color="blue"
            />
            <AssetCard 
              icon={<Wallet className="h-6 w-6 text-teal-500" />}
              title="One Wallet"
              description="Manage all your digital assets in one secure place"
              color="teal"
            />
          </div>
        </div>
        
        {/* Features Section */}
        <div className="py-16 bg-gray-50 my-12 -mx-6 px-6">
          <div className="text-center mb-12">
            <h2 className="font-heading text-3xl font-bold mb-4">The most trusted & secure crypto wallet</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Trust Wallet is a secure multi-coin wallet enabling blockchain access at your fingertips.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <FeatureCard 
              icon={<Shield className="h-6 w-6 text-blue-500" />}
              title="Secure by design"
              description="Trust Wallet keeps your private keys only on your device, protecting your assets from server breaches."
            />
            <FeatureCard 
              icon={<Eye className="h-6 w-6 text-blue-500" />}
              title="Private & anonymous"
              description="We don't collect any personal information, ensuring your data remains private and anonymous."
            />
            <FeatureCard 
              icon={<Globe className="h-6 w-6 text-blue-500" />}
              title="Cross-chain enabled"
              description="Collect, store, and manage 8M+ cryptocurrencies and NFTs on 100+ blockchains."
            />
            <FeatureCard 
              icon={<Star className="h-6 w-6 text-blue-500" />}
              title="DEX in your pocket"
              description="Swap crypto tokens directly from your wallet with the built-in DEX functionality."
            />
            <FeatureCard 
              icon={<Smartphone className="h-6 w-6 text-blue-500" />}
              title="Web3 ready"
              description="Easily connect to web3 dApps with the built-in browser and enhance your DeFi experience."
            />
            <FeatureCard 
              icon={<Gift className="h-6 w-6 text-blue-500" />}
              title="Buy crypto easily"
              description="Buy cryptocurrency with credit card, bank transfer, or Apple Pay directly in the app."
            />
          </div>
        </div>

        {/* Enhanced Security Section with Colorful Background */}
        <div className="py-16 my-12 -mx-6 px-6 bg-gradient-to-b from-blue-900 to-indigo-800 text-white rounded-3xl">
          <div className="text-center mb-12">
            <h2 className="font-heading text-3xl font-bold mb-4">Enhanced Security & Privacy</h2>
            <p className="text-blue-100 max-w-2xl mx-auto">
              Your assets are protected by industry-leading security measures
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <SecurityCard
              title="Private Keys Stay on Your Device"
              description="We never have access to your assets or private information"
            />
            <SecurityCard
              title="Secure Encryption"
              description="Multiple layers of encryption protect your digital assets"
            />
            <SecurityCard
              title="Biometric Authentication"
              description="Use your fingerprint or face ID for an extra layer of security"
            />
          </div>
        </div>
        
        {/* How It Works Section */}
        <div className="py-16">
          <div className="text-center mb-12">
            <h2 className="font-heading text-3xl font-bold mb-4">How it works</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Get started with Trust Wallet in three simple steps
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <StepCard 
              number="1"
              title="Download Trust Wallet"
              description="Download the app from App Store or Google Play Store."
            />
            <StepCard 
              number="2"
              title="Create or import wallet"
              description="Create a new wallet or import an existing one."
            />
            <StepCard 
              number="3"
              title="Start exploring crypto"
              description="Buy, store, swap or stake your assets securely."
            />
          </div>
          
          <div className="mt-10 text-center">
            <Button onClick={handleCreateWallet} className="py-6 px-8 text-base flex items-center mx-auto justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-medium transition-all rounded-xl">
              Create a new wallet <ArrowRight className="h-4 w-4" />
            </Button>
          </div>
        </div>
        
        {/* Testimonials Section */}
        <div className="py-16 bg-gradient-to-r from-purple-50 to-pink-50 -mx-6 px-6">
          <div className="text-center mb-12">
            <h2 className="font-heading text-3xl font-bold mb-4">Trusted by millions</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Join over 50 million people who trust Trust Wallet
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <TestimonialCard 
              quote="Trust Wallet provides the best user experience and security for managing digital assets."
              author="John D."
              role="Crypto Investor"
            />
            <TestimonialCard 
              quote="I love how easy it is to connect to DeFi apps and view my NFTs - all in one place!"
              author="Sarah M."
              role="NFT Collector"
            />
          </div>
        </div>
        
        {/* FAQ Section */}
        <div className="py-16">
          <div className="text-center mb-12">
            <h2 className="font-heading text-3xl font-bold mb-4">Frequently Asked Questions</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Have questions? We've got answers.
            </p>
          </div>
          
          <div className="space-y-6 max-w-3xl mx-auto">
            <FAQItem 
              question="Is Trust Wallet safe?"
              answer="Yes, Trust Wallet is designed with security as the top priority. Your private keys never leave your device and are protected by several layers of security."
            />
            <FAQItem 
              question="How do I back up my wallet?"
              answer="When you create a wallet, you'll be prompted to write down your recovery phrase. This is the only way to recover your wallet if your device is lost or damaged."
            />
            <FAQItem 
              question="Which cryptocurrencies does Trust Wallet support?"
              answer="Trust Wallet supports over 8 million cryptocurrencies and digital assets across 100+ blockchains, including popular coins like Bitcoin, Ethereum, Binance Coin, and more."
            />
            <FAQItem 
              question="How do I buy crypto in Trust Wallet?"
              answer="You can purchase cryptocurrency directly in the Trust Wallet app using your credit/debit card, bank transfer, or Apple Pay depending on your region."
            />
          </div>
        </div>
        
        {/* CTA Section */}
        <div className="py-16 bg-gradient-to-r from-blue-500 to-indigo-600 -mx-6 px-6 rounded-3xl text-white">
          <div className="text-center">
            <h2 className="font-heading text-3xl font-bold mb-4">Ready to start your crypto journey?</h2>
            <p className="text-blue-100 max-w-2xl mx-auto mb-8">
              Take control of your digital assets today with the most trusted crypto wallet
            </p>
            
            <Button onClick={handleCreateWallet} className="py-6 px-8 text-base flex items-center mx-auto justify-center gap-2 bg-white hover:bg-blue-50 text-blue-600 font-medium transition-all rounded-xl">
              Create a new wallet <ArrowRight className="h-4 w-4" />
            </Button>
          </div>
        </div>
        
        <div className="text-center text-xs text-gray-500 mt-auto pt-10">
          By continuing, you agree to our <a href="#" className="underline hover:text-blue-500">Terms of Service</a> and <a href="#" className="underline hover:text-blue-500">Privacy Policy</a>.
        </div>
      </div>
    </div>
  );
};

// Feature Card Component
const FeatureCard = ({ icon, title, description }: { icon: React.ReactNode, title: string, description: string }) => {
  return (
    <div className="feature-card p-6 rounded-xl transition-all">
      <div className="mb-4">{icon}</div>
      <h3 className="font-heading font-semibold text-lg mb-2">{title}</h3>
      <p className="text-gray-600 text-sm">{description}</p>
    </div>
  );
};

// Security Card Component 
const SecurityCard = ({ title, description }: { title: string, description: string }) => {
  return (
    <div className="p-6 rounded-xl transition-all bg-white/10 backdrop-blur-sm hover:bg-white/20">
      <h3 className="font-heading font-semibold text-lg mb-2">{title}</h3>
      <p className="text-blue-100 text-sm">{description}</p>
    </div>
  );
};

// Asset Card Component
const AssetCard = ({ icon, title, description, color }: { icon: React.ReactNode, title: string, description: string, color: string }) => {
  const getGradient = () => {
    switch (color) {
      case 'indigo': return 'from-indigo-500 to-indigo-600';
      case 'purple': return 'from-purple-500 to-purple-600';
      case 'blue': return 'from-blue-500 to-blue-600';
      case 'teal': return 'from-teal-500 to-teal-600';
      default: return 'from-blue-500 to-blue-600';
    }
  };
  
  return (
    <div className="p-6 rounded-xl transition-all bg-white shadow-md hover:shadow-lg">
      <div className={`bg-gradient-to-r ${getGradient()} inline-flex p-3 rounded-lg text-white mb-4`}>
        {icon}
      </div>
      <h3 className="font-heading font-semibold text-lg mb-2 bg-gradient-to-r from-indigo-500 to-blue-600 bg-clip-text text-transparent">{title}</h3>
      <p className="text-gray-600 text-sm">{description}</p>
    </div>
  );
};

// Step Card Component
const StepCard = ({ number, title, description }: { number: string, title: string, description: string }) => {
  return (
    <div className="text-center">
      <div className="w-12 h-12 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center mx-auto mb-4 font-bold text-xl">
        {number}
      </div>
      <h3 className="font-heading font-semibold text-lg mb-2">{title}</h3>
      <p className="text-gray-600 text-sm">{description}</p>
    </div>
  );
};

// Testimonial Card Component
const TestimonialCard = ({ quote, author, role }: { quote: string, author: string, role: string }) => {
  return (
    <div className="bg-white p-6 rounded-xl shadow-sm">
      <div className="flex mb-4">
        {[1, 2, 3, 4, 5].map((_, index) => (
          <Star key={index} className="h-4 w-4 text-yellow-400 fill-yellow-400" />
        ))}
      </div>
      <p className="text-gray-700 mb-4 italic">"{quote}"</p>
      <div>
        <p className="font-medium">{author}</p>
        <p className="text-gray-500 text-sm">{role}</p>
      </div>
    </div>
  );
};

// FAQ Item Component
const FAQItem = ({ question, answer }: { question: string, answer: string }) => {
  const [isOpen, setIsOpen] = React.useState(false);
  
  return (
    <div className="border-b border-gray-200 pb-4">
      <button 
        className="flex justify-between items-center w-full text-left py-2 font-medium"
        onClick={() => setIsOpen(!isOpen)}
      >
        {question}
        <span className="ml-6 flex-shrink-0">
          {isOpen ? (
            <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18 12H6" />
            </svg>
          ) : (
            <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
            </svg>
          )}
        </span>
      </button>
      {isOpen && (
        <div className="mt-2 text-gray-600">
          <p>{answer}</p>
        </div>
      )}
    </div>
  );
};

export default LandingPage;
