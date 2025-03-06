
import React from 'react';
import { 
  Shield, 
  Zap, 
  Lock, 
  Wallet, 
  Globe, 
  Smartphone, 
  Users, 
  Key, 
  Eye, 
  Sparkles 
} from 'lucide-react';

interface FeatureCardProps {
  icon: React.ReactNode;
  title: string;
  description: string;
  className?: string;
}

const FeatureCard = ({ icon, title, description, className = "" }: FeatureCardProps) => {
  return (
    <div className={`p-6 rounded-xl bg-white dark:bg-wallet-card border border-gray-100 dark:border-gray-800 shadow-sm transition-all hover:shadow-md hover:-translate-y-1 ${className}`}>
      <div className="flex items-start">
        <div className="mr-4 p-3 rounded-lg bg-gray-50 dark:bg-gray-900/20 text-[#403E43]">
          {icon}
        </div>
        <div>
          <h3 className="font-heading font-semibold text-lg mb-2">{title}</h3>
          <p className="text-gray-600 dark:text-gray-400 text-sm">{description}</p>
        </div>
      </div>
    </div>
  );
};

const FeaturesSection = () => {
  return (
    <section className="py-24 px-6 relative" id="features">
      <div className="absolute inset-0 bg-gradient-to-b from-gray-50 to-white dark:from-[#151823]/50 dark:to-wallet-darkBg/80 pointer-events-none" />
      
      <div className="max-w-screen-xl mx-auto relative z-10">
        <div className="text-center mb-16">
          <h2 className="font-heading text-4xl font-bold mb-4">
            <span className="bg-gradient-to-r from-[#8E9196] to-[#403E43] bg-clip-text text-transparent">
              Powerful Features
            </span>
          </h2>
          <p className="text-gray-600 dark:text-gray-300 max-w-2xl mx-auto text-lg">
            Advanced tools designed for both beginners and power users with a focus on security, privacy, and control
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
          <FeatureCard 
            icon={<Shield className="h-6 w-6" />} 
            title="Self-Custody" 
            description="Your keys never leave your device. Maintain complete sovereignty over your bitcoin with no intermediaries."
          />
          
          <FeatureCard 
            icon={<Lock className="h-6 w-6" />} 
            title="Enhanced Security" 
            description="Support for hardware wallets with multisignature capabilities for institutional-grade security."
          />
          
          <FeatureCard 
            icon={<Key className="h-6 w-6" />} 
            title="BIP39 Passphrase" 
            description="Add an extra layer of security with optional BIP39 passphrase support for your wallet."
          />
          
          <FeatureCard 
            icon={<Wallet className="h-6 w-6" />} 
            title="UTXO Management" 
            description="Full control over your unspent transaction outputs with advanced coin selection features."
          />
          
          <FeatureCard 
            icon={<Eye className="h-6 w-6" />} 
            title="Privacy Focus" 
            description="Connect to your own node or use public electrum servers with safeguards for maximum privacy."
          />
          
          <FeatureCard 
            icon={<Zap className="h-6 w-6" />} 
            title="Transaction Acceleration" 
            description="Replace-by-fee support lets you speed up pending transactions when needed."
          />
          
          <FeatureCard 
            icon={<Users className="h-6 w-6" />} 
            title="Multisignature Support" 
            description="Create powerful multisig wallets requiring multiple signatures for enhanced security."
          />
          
          <FeatureCard 
            icon={<Globe className="h-6 w-6" />} 
            title="Cross-Platform" 
            description="Use Sparrow on desktop (Windows, Mac, Linux) or via this secure web version."
          />
          
          <FeatureCard 
            icon={<Sparkles className="h-6 w-6" />} 
            title="Advanced Features" 
            description="PSBT coordination, custom scripts, time-locked transactions and more for power users."
          />
        </div>
      </div>
    </section>
  );
};

export default FeaturesSection;
