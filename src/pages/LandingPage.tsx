import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import WalletLogo from '@/components/WalletLogo';
import { ArrowRight, Check, Menu, Star, Shield, Users, Smartphone, Sparkles, Eye, Globe, Gift, Coins, Wallet, Search, X } from 'lucide-react';
import { useWallet } from '@/contexts/WalletContext';
const LandingPage: React.FC = () => {
  const {
    generateWallet
  } = useWallet();
  const [searchQuery, setSearchQuery] = useState('');
  const handleCreateWallet = () => {
    generateWallet();
  };
  return <div className="min-h-screen flex flex-col bg-white text-gray-800">
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
        
        <div className="py-16 my-12 -mx-6 bg-gradient-to-b from-blue-500 via-blue-600 to-blue-900 text-white rounded-3xl px-[15px]">
          <div className="text-center mb-8">
            <h2 className="font-heading text-4xl font-bold mb-4">One Platform,<br />Millions of Assets</h2>
            <p className="text-blue-50 max-w-2xl mx-auto">
              As a leading self-custody multi-chain platform, we support millions of assets across 
              100+ blockchains. From Bitcoin, Ethereum, and Solana, to Cosmos, Optimism, and much more.
            </p>
          </div>
          
          <div className="relative max-w-md mx-auto mb-8">
            <div className="bg-white rounded-full flex items-center p-2 pl-4 shadow-lg">
              <Search className="h-5 w-5 text-gray-400 mr-2" />
              <input type="text" placeholder="Search a chain..." className="w-full bg-transparent border-none outline-none text-gray-800" value={searchQuery} onChange={e => setSearchQuery(e.target.value)} />
            </div>
          </div>
          
          <div className="bg-white rounded-3xl max-w-md mx-auto overflow-hidden text-gray-800">
            <div className="p-4">
              <div className="border-b border-gray-100 pb-4 mb-4">
                <div className="flex items-center gap-3 mb-3">
                  <img src="/lovable-uploads/d6777daf-350a-4823-8823-22586f89c3f4.png" alt="BNB Smart Chain" className="w-10 h-10 rounded-full" />
                  <span className="font-semibold">BNB Smart Chain (BNB)</span>
                </div>
                
                <div className="space-y-2 ml-13">
                  <SupportedFeature label="Buy" supported={true} />
                  <SupportedFeature label="Sell" supported={true} />
                  <SupportedFeature label="Swap" supported={true} />
                  <SupportedFeature label="Earn" supported={true} />
                  <SupportedFeature label="dApps" supported={true} />
                </div>
              </div>
              
              <div className="border-b border-gray-100 pb-4 mb-4">
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-10 h-10 rounded-full bg-orange-400 flex items-center justify-center text-white">
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M23.638 14.904c-1.602 6.425-8.113 10.334-14.542 8.746C2.67 22.052-1.244 15.546.345 9.105 1.952 2.677 8.458-1.233 14.895.355c6.447 1.605 10.346 8.11 8.743 14.549z" fill="#FFF" />
                      <path d="M17.291 10.174c.25-1.669-.998-2.564-2.7-3.165l.55-2.212-1.346-.336-.535 2.151c-.355-.088-.717-.172-1.078-.253l.54-2.165-1.344-.336-.552 2.21a44.184 44.184 0 01-.86-.202l.001-.007-1.855-.463-.358 1.437s.998.23.978.244c.545.136.644.497.627.784l-.627 2.518c.037.01.087.024.14.046l-.142-.036-.879 3.524c-.067.166-.236.414-.618.32.013.02-.979-.244-.979-.244l-.67 1.545 1.75.437c.325.082.644.167.958.247l-.558 2.24 1.342.336.552-2.215c.368.1.726.193 1.077.28l-.55 2.2 1.346.336.558-2.234c2.297.435 4.03.26 4.758-1.818.586-1.674-.03-2.641-1.237-3.267.879-.203 1.544-.78 1.723-1.974zm-3.081 4.298c-.417 1.674-3.233.77-4.147.542l.74-2.967c.914.228 3.85.68 3.407 2.425zm.415-4.348c-.38 1.52-2.725.747-3.487.557l.67-2.693c.762.19 3.217.543 2.817 2.136z" fill="#FFF" />
                    </svg>
                  </div>
                  <span className="font-semibold">Bitcoin (BTC)</span>
                </div>
                
                <div className="space-y-2 ml-13">
                  <SupportedFeature label="Buy" supported={true} />
                  <SupportedFeature label="Sell" supported={true} />
                  <SupportedFeature label="Swap" supported={false} />
                  <SupportedFeature label="Earn" supported={false} />
                  <SupportedFeature label="dApps" supported={false} />
                </div>
              </div>
              
              <div className="border-b border-gray-100 pb-4 mb-4">
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-10 h-10 rounded-full bg-gray-800 flex items-center justify-center">
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M12 2L3 12l9 4.5L21 12 12 2z" fill="#5064FB" />
                      <path d="M12 22.5l9-5.3-9-4.5-9 4.5 9 5.3z" fill="#5064FB" />
                      <path d="M12 2v7l9 3-9-10z" fill="#6C78F1" fillOpacity=".8" />
                      <path d="M12 2L3 12l9-3V2z" fill="#5064FB" fillOpacity=".5" />
                      <path d="M12 16.5v6l9-5.3-9-.7z" fill="#6C78F1" fillOpacity=".8" />
                      <path d="M12 22.5v-6l-9-.7 9 6.7z" fill="#5064FB" fillOpacity=".5" />
                    </svg>
                  </div>
                  <span className="font-semibold">Cosmos (ATOM)</span>
                </div>
                
                <div className="space-y-2 ml-13">
                  <SupportedFeature label="Buy" supported={true} />
                  <SupportedFeature label="Sell" supported={true} />
                  <SupportedFeature label="Swap" supported={false} />
                  <SupportedFeature label="Earn" supported={true} />
                  <SupportedFeature label="dApps" supported={false} />
                </div>
              </div>
              
              <div className="border-b border-gray-100 pb-4 mb-4">
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center">
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M11.999 0L11.798 0.675V16.4236L11.999 16.6236L19.364 12.3171L11.999 0Z" fill="#343434" />
                      <path d="M11.999 0L4.63599 12.3171L11.999 16.6236V8.8927V0Z" fill="#8C8C8C" />
                      <path d="M11.999 18.0319L11.8862 18.1688V23.7944L11.999 24.0001L19.3689 13.7283L11.999 18.0319Z" fill="#3C3C3B" />
                      <path d="M11.999 24.0001V18.0319L4.63599 13.7283L11.999 24.0001Z" fill="#8C8C8C" />
                      <path d="M11.999 16.6236L19.364 12.3171L11.999 8.8927V16.6236Z" fill="#141414" />
                      <path d="M4.63599 12.3171L11.999 16.6236V8.8927L4.63599 12.3171Z" fill="#393939" />
                    </svg>
                  </div>
                  <span className="font-semibold">Ethereum (ETH)</span>
                </div>
                
                <div className="space-y-2 ml-13">
                  <SupportedFeature label="Buy" supported={true} />
                  <SupportedFeature label="Sell" supported={true} />
                  <SupportedFeature label="Swap" supported={true} />
                  <SupportedFeature label="Earn" supported={true} />
                  <SupportedFeature label="dApps" supported={true} />
                </div>
              </div>
            </div>
          </div>
        </div>
        
        <div className="py-16 my-12 -mx-6 px-6 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-3xl">
          <div className="text-center mb-12">
            <h2 className="font-heading text-3xl font-bold mb-4">One Platform, Millions of Assets</h2>
            <p className="text-blue-50 max-w-2xl mx-auto">
              Trust Wallet is your gateway to the blockchain ecosystem. Store, trade, and discover over 8 million digital assets across 100+ blockchains.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <AssetCard icon={<Globe className="h-6 w-6 text-indigo-500" />} title="Global Access" description="Access the blockchain ecosystem from anywhere in the world" color="indigo" />
            <AssetCard icon={<Coins className="h-6 w-6 text-purple-500" />} title="Multiple Assets" description="Support for 8M+ cryptocurrencies and digital assets" color="purple" />
            <AssetCard icon={<Users className="h-6 w-6 text-blue-500" />} title="Growing Community" description="Join 50M+ users who trust our platform" color="blue" />
            <AssetCard icon={<Wallet className="h-6 w-6 text-teal-500" />} title="One Wallet" description="Manage all your digital assets in one secure place" color="teal" />
          </div>
        </div>
        
        <div className="py-16 bg-gray-50 my-12 -mx-6 px-6">
          <div className="text-center mb-12">
            <h2 className="font-heading text-3xl font-bold mb-4">The most trusted & secure crypto wallet</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Trust Wallet is a secure multi-coin wallet enabling blockchain access at your fingertips.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <FeatureCard icon={<Shield className="h-6 w-6 text-blue-500" />} title="Secure by design" description="Trust Wallet keeps your private keys only on your device, protecting your assets from server breaches." />
            <FeatureCard icon={<Eye className="h-6 w-6 text-blue-500" />} title="Private & anonymous" description="We don't collect any personal information, ensuring your data remains private and anonymous." />
            <FeatureCard icon={<Globe className="h-6 w-6 text-blue-500" />} title="Cross-chain enabled" description="Collect, store, and manage 8M+ cryptocurrencies and NFTs on 100+ blockchains." />
            <FeatureCard icon={<Star className="h-6 w-6 text-blue-500" />} title="DEX in your pocket" description="Swap crypto tokens directly from your wallet with the built-in DEX functionality." />
            <FeatureCard icon={<Smartphone className="h-6 w-6 text-blue-500" />} title="Web3 ready" description="Easily connect to web3 dApps with the built-in browser and enhance your DeFi experience." />
            <FeatureCard icon={<Gift className="h-6 w-6 text-blue-500" />} title="Buy crypto easily" description="Buy cryptocurrency with credit card, bank transfer, or Apple Pay directly in the app." />
          </div>
        </div>

        <div className="py-16 my-12 -mx-6 px-6 bg-gradient-to-b from-blue-900 to-indigo-800 text-white rounded-3xl">
          <div className="text-center mb-12">
            <h2 className="font-heading text-3xl font-bold mb-4">Enhanced Security & Privacy</h2>
            <p className="text-blue-100 max-w-2xl mx-auto">
              Your assets are protected by industry-leading security measures
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <SecurityCard title="Private Keys Stay on Your Device" description="We never have access to your assets or private information" />
            <SecurityCard title="Secure Encryption" description="Multiple layers of encryption protect your digital assets" />
            <SecurityCard title="Biometric Authentication" description="Use your fingerprint or face ID for an extra layer of security" />
          </div>
        </div>
        
        <div className="py-16">
          <div className="text-center mb-12">
            <h2 className="font-heading text-3xl font-bold mb-4">How it works</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Get started with Trust Wallet in three simple steps
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <StepCard number="1" title="Download Trust Wallet" description="Download the app from App Store or Google Play Store." />
            <StepCard number="2" title="Create or import wallet" description="Create a new wallet or import an existing one." />
            <StepCard number="3" title="Start exploring crypto" description="Buy, store, swap or stake your assets securely." />
          </div>
          
          <div className="mt-10 text-center">
            <Button onClick={handleCreateWallet} className="py-6 px-8 text-base flex items-center mx-auto justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-medium transition-all rounded-xl">
              Create a new wallet <ArrowRight className="h-4 w-4" />
            </Button>
          </div>
        </div>
        
        <div className="py-16 bg-gradient-to-r from-purple-50 to-pink-50 -mx-6 px-6">
          <div className="text-center mb-12">
            <h2 className="font-heading text-3xl font-bold mb-4">Trusted by millions</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Join over 50 million people who trust Trust Wallet
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <TestimonialCard quote="Trust Wallet provides the best user experience and security for managing digital assets." author="John D." role="Crypto Investor" />
            <TestimonialCard quote="I love how easy it is to connect to DeFi apps and view my NFTs - all in one place!" author="Sarah M." role="NFT Collector" />
          </div>
        </div>
        
        <div className="py-16">
          <div className="text-center mb-12">
            <h2 className="font-heading text-3xl font-bold mb-4">Frequently Asked Questions</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Have questions? We've got answers.
            </p>
          </div>
          
          <div className="space-y-6 max-w-3xl mx-auto">
            <FAQItem question="Is Trust Wallet safe?" answer="Yes, Trust Wallet is designed with security as the top priority. Your private keys never leave your device and are protected by several layers of security." />
            <FAQItem question="How do I back up my wallet?" answer="When you create a wallet, you'll be prompted to write down your recovery phrase. This is the only way to recover your wallet if your device is lost or damaged." />
            <FAQItem question="Which cryptocurrencies does Trust Wallet support?" answer="Trust Wallet supports over 8 million cryptocurrencies and digital assets across 100+ blockchains, including popular coins like Bitcoin, Ethereum, Binance Coin, and more." />
            <FAQItem question="How do I buy crypto in Trust Wallet?" answer="You can purchase cryptocurrency directly in the Trust Wallet app using your credit/debit card, bank transfer, or Apple Pay depending on your region." />
          </div>
        </div>
        
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
    </div>;
};
const FeatureCard = ({
  icon,
  title,
  description
}: {
  icon: React.ReactNode;
  title: string;
  description: string;
}) => {
  return <div className="feature-card p-6 rounded-xl transition-all">
      <div className="mb-4">{icon}</div>
      <h3 className="font-heading font-semibold text-lg mb-2">{title}</h3>
      <p className="text-gray-600 text-sm">{description}</p>
    </div>;
};
const SecurityCard = ({
  title,
  description
}: {
  title: string;
  description: string;
}) => {
  return <div className="p-6 rounded-xl transition-all bg-white/10 backdrop-blur-sm hover:bg-white/20">
      <h3 className="font-heading font-semibold text-lg mb-2">{title}</h3>
      <p className="text-blue-100 text-sm">{description}</p>
    </div>;
};
const AssetCard = ({
  icon,
  title,
  description,
  color
}: {
  icon: React.ReactNode;
  title: string;
  description: string;
  color: string;
}) => {
  const getGradient = () => {
    switch (color) {
      case 'indigo':
        return 'from-indigo-500 to-indigo-600';
      case 'purple':
        return 'from-purple-500 to-purple-600';
      case 'blue':
        return 'from-blue-500 to-blue-600';
      case 'teal':
        return 'from-teal-500 to-teal-600';
      default:
        return 'from-blue-500 to-blue-600';
    }
  };
  return <div className="p-6 rounded-xl transition-all bg-white shadow-md hover:shadow-lg">
      <div className={`bg-gradient-to-r ${getGradient()} inline-flex p-3 rounded-lg text-white mb-4`}>
        {icon}
      </div>
      <h3 className="font-heading font-semibold text-lg mb-2 bg-gradient-to-r from-indigo-500 to-blue-600 bg-clip-text text-transparent">{title}</h3>
      <p className="text-gray-600 text-sm">{description}</p>
    </div>;
};
const StepCard = ({
  number,
  title,
  description
}: {
  number: string;
  title: string;
  description: string;
}) => {
  return <div className="text-center">
      <div className="w-12 h-12 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center mx-auto mb-4 font-bold text-xl">
        {number}
      </div>
      <h3 className="font-heading font-semibold text-lg mb-2">{title}</h3>
      <p className="text-gray-600 text-sm">{description}</p>
    </div>;
};
const TestimonialCard = ({
  quote,
  author,
  role
}: {
  quote: string;
  author: string;
  role: string;
}) => {
  return <div className="bg-white p-6 rounded-xl shadow-sm">
      <div className="flex mb-4">
        {[1, 2, 3, 4, 5].map((_, index) => <Star key={index} className="h-4 w-4 text-yellow-400 fill-yellow-400" />)}
      </div>
      <p className="text-gray-700 mb-4 italic">"{quote}"</p>
      <div>
        <p className="font-medium">{author}</p>
        <p className="text-gray-500 text-sm">{role}</p>
      </div>
    </div>;
};
const FAQItem = ({
  question,
  answer
}: {
  question: string;
  answer: string;
}) => {
  const [isOpen, setIsOpen] = React.useState(false);
  return <div className="border-b border-gray-200 pb-4">
      <button className="flex justify-between items-center w-full text-left py-2 font-medium" onClick={() => setIsOpen(!isOpen)}>
        {question}
        <span className="ml-6 flex-shrink-0">
          {isOpen ? <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18 12H6" />
            </svg> : <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
            </svg>}
        </span>
      </button>
      {isOpen && <div className="mt-2 text-gray-600">
          <p>{answer}</p>
        </div>}
    </div>;
};
const SupportedFeature = ({
  label,
  supported
}: {
  label: string;
  supported: boolean;
}) => {
  return <div className="flex items-center justify-between px-0 mx-0">
      <span className="text-gray-600">{label}</span>
      {supported ? <div className="w-5 h-5 rounded-full bg-blue-600 flex items-center justify-center">
          <Check className="w-3 h-3 text-white" />
        </div> : <div className="w-5 h-5 rounded-full bg-gray-200 flex items-center justify-center">
          <X className="w-3 h-3 text-gray-500" />
        </div>}
    </div>;
};
export default LandingPage;