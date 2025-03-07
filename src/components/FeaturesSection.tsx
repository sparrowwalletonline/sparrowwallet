
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
        <div className="mr-4 p-3 rounded-lg bg-blue-50 dark:bg-blue-900/20 text-wallet-blue">
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
            <span className="bg-gradient-to-r from-wallet-blue to-indigo-600 bg-clip-text text-transparent">
              Leistungsstarke Funktionen
            </span>
          </h2>
          <p className="text-gray-600 dark:text-gray-300 max-w-2xl mx-auto text-lg">
            Fortschrittliche Tools für Anfänger und Experten mit Fokus auf Sicherheit, Privatsphäre und Kontrolle
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
          <FeatureCard 
            icon={<Shield className="h-6 w-6" />} 
            title="Selbstverwahrung" 
            description="Ihre Schlüssel verlassen niemals Ihr Gerät. Behalten Sie die vollständige Kontrolle über Ihr Bitcoin ohne Zwischenhändler."
          />
          
          <FeatureCard 
            icon={<Lock className="h-6 w-6" />} 
            title="Verbesserte Sicherheit" 
            description="Unterstützung für Hardware-Wallets mit Multisignatur-Funktionen für institutionelle Sicherheit."
          />
          
          <FeatureCard 
            icon={<Key className="h-6 w-6" />} 
            title="BIP39 Passphrase" 
            description="Fügen Sie eine zusätzliche Sicherheitsebene mit optionaler BIP39-Passphrase-Unterstützung für Ihre Wallet hinzu."
          />
          
          <FeatureCard 
            icon={<Wallet className="h-6 w-6" />} 
            title="UTXO-Verwaltung" 
            description="Volle Kontrolle über Ihre unverbrauchten Transaktionsausgaben mit fortschrittlichen Coin-Auswahlfunktionen."
          />
          
          <FeatureCard 
            icon={<Eye className="h-6 w-6" />} 
            title="Fokus auf Privatsphäre" 
            description="Verbinden Sie sich mit Ihrem eigenen Node oder nutzen Sie öffentliche Electrum-Server mit Schutzmaßnahmen für maximale Privatsphäre."
          />
          
          <FeatureCard 
            icon={<Zap className="h-6 w-6" />} 
            title="Schnelligkeit" 
            description="Replace-by-Fee-Unterstützung ermöglicht es Ihnen, ausstehende Transaktionen bei Bedarf zu beschleunigen."
          />
          
          <FeatureCard 
            icon={<Users className="h-6 w-6" />} 
            title="Multisignatur-Unterstützung" 
            description="Erstellen Sie leistungsstarke Multisig-Wallets, die mehrere Signaturen für erhöhte Sicherheit erfordern."
          />
          
          <FeatureCard 
            icon={<Globe className="h-6 w-6" />} 
            title="Plattformübergreifend" 
            description="Nutzen Sie Sparrow auf dem Desktop (Windows, Mac, Linux) oder über diese sichere Web-Version."
          />
          
          <FeatureCard 
            icon={<Sparkles className="h-6 w-6" />} 
            title="Erweiterte Funktionen" 
            description="PSBT-Koordination, benutzerdefinierte Skripte, zeitverschlossene Transaktionen und mehr für fortgeschrittene Benutzer."
          />
        </div>
      </div>
    </section>
  );
};

export default FeaturesSection;
