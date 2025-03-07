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
  Sparkles,
  Star,
  Rocket,
  Heart,
  Lightbulb
} from 'lucide-react';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';
import { Card, CardContent } from '@/components/ui/card';

interface FeatureCardProps {
  icon: React.ReactNode;
  title: string;
  description: string;
  className?: string;
  index: number;
}

const FeatureCard = ({ icon, title, description, className = "", index }: FeatureCardProps) => {
  const bgColors = [
    'from-blue-50 to-blue-100 dark:from-blue-900/20 dark:to-blue-800/10',
    'from-purple-50 to-purple-100 dark:from-purple-900/20 dark:to-purple-800/10',
    'from-green-50 to-green-100 dark:from-green-900/20 dark:to-green-800/10',
    'from-orange-50 to-orange-100 dark:from-orange-900/20 dark:to-orange-800/10',
    'from-pink-50 to-pink-100 dark:from-pink-900/20 dark:to-pink-800/10',
    'from-indigo-50 to-indigo-100 dark:from-indigo-900/20 dark:to-indigo-800/10',
    'from-red-50 to-red-100 dark:from-red-900/20 dark:to-red-800/10',
    'from-amber-50 to-amber-100 dark:from-amber-900/20 dark:to-amber-800/10',
    'from-teal-50 to-teal-100 dark:from-teal-900/20 dark:to-teal-800/10',
  ];

  const iconBgColors = [
    'bg-gradient-to-r from-blue-500 to-blue-600',
    'bg-gradient-to-r from-purple-500 to-purple-600',
    'bg-gradient-to-r from-green-500 to-green-600',
    'bg-gradient-to-r from-orange-500 to-orange-600',
    'bg-gradient-to-r from-pink-500 to-pink-600',
    'bg-gradient-to-r from-indigo-500 to-indigo-600',
    'bg-gradient-to-r from-red-500 to-red-600',
    'bg-gradient-to-r from-amber-500 to-amber-600',
    'bg-gradient-to-r from-teal-500 to-teal-600',
  ];

  const cardVariants = {
    hidden: { 
      opacity: 0, 
      y: 20 
    },
    visible: (i: number) => ({ 
      opacity: 1, 
      y: 0,
      transition: { 
        delay: i * 0.1,
        duration: 0.5,
        ease: "easeOut"
      }
    }),
    hover: {
      y: -8,
      boxShadow: "0 10px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)",
      transition: {
        duration: 0.3
      }
    }
  };

  return (
    <motion.div
      custom={index}
      initial="hidden"
      whileInView="visible"
      whileHover="hover"
      viewport={{ once: true, margin: "-100px" }}
      variants={cardVariants}
      className={cn(
        `p-6 rounded-2xl bg-gradient-to-br ${bgColors[index % bgColors.length]} 
        border border-gray-100 dark:border-gray-800 shadow-sm`,
        className
      )}
    >
      <div className="flex items-start gap-5">
        <div className={`flex-shrink-0 p-3 rounded-xl ${iconBgColors[index % iconBgColors.length]} text-white shadow-lg`}>
          {icon}
        </div>
        <div>
          <h3 className="font-roboto font-bold text-xl mb-2">{title}</h3>
          <p className="text-gray-600 dark:text-gray-300 text-sm">{description}</p>
        </div>
      </div>
    </motion.div>
  );
};

const FeaturesSection = () => {
  const headingVariants = {
    hidden: { opacity: 0, y: -20 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: {
        duration: 0.6,
        ease: "easeOut"
      }
    }
  };

  const featureData = [
    {
      icon: <Shield className="h-6 w-6" />,
      title: "Selbstverwahrung",
      description: "Ihre Schlüssel verlassen niemals Ihr Gerät. Behalten Sie die vollständige Kontrolle über Ihr Bitcoin ohne Zwischenhändler."
    },
    {
      icon: <Lock className="h-6 w-6" />,
      title: "Verbesserte Sicherheit",
      description: "Unterstützung für Hardware-Wallets mit Multisignatur-Funktionen für institutionelle Sicherheit."
    },
    {
      icon: <Key className="h-6 w-6" />,
      title: "BIP39 Passphrase",
      description: "Fügen Sie eine zusätzliche Sicherheitsebene mit optionaler BIP39-Passphrase-Unterstützung für Ihre Wallet hinzu."
    },
    {
      icon: <Wallet className="h-6 w-6" />,
      title: "UTXO-Verwaltung",
      description: "Volle Kontrolle über Ihre unverbrauchten Transaktionsausgaben mit fortschrittlichen Coin-Auswahlfunktionen."
    },
    {
      icon: <Eye className="h-6 w-6" />,
      title: "Fokus auf Privatsphäre",
      description: "Verbinden Sie sich mit Ihrem eigenen Node oder nutzen Sie öffentliche Electrum-Server mit Schutzmaßnahmen für maximale Privatsphäre."
    },
    {
      icon: <Zap className="h-6 w-6" />,
      title: "Schnelligkeit",
      description: "Replace-by-Fee-Unterstützung ermöglicht es Ihnen, ausstehende Transaktionen bei Bedarf zu beschleunigen."
    },
    {
      icon: <Users className="h-6 w-6" />,
      title: "Multisignatur-Unterstützung",
      description: "Erstellen Sie leistungsstarke Multisig-Wallets, die mehrere Signaturen für erhöhte Sicherheit erfordern."
    },
    {
      icon: <Globe className="h-6 w-6" />,
      title: "Plattformübergreifend",
      description: "Nutzen Sie Sparrow auf dem Desktop (Windows, Mac, Linux) oder über diese sichere Web-Version."
    },
    {
      icon: <Sparkles className="h-6 w-6" />,
      title: "Erweiterte Funktionen",
      description: "PSBT-Koordination, benutzerdefinierte Skripte, zeitverschlossene Transaktionen und mehr für fortgeschrittene Benutzer."
    }
  ];

  return (
    <section className="py-24 px-6 relative overflow-hidden" id="features">
      <div className="absolute inset-0 bg-gradient-to-b from-gray-50 to-white dark:from-[#151823]/50 dark:to-wallet-darkBg/80 pointer-events-none">
        <div className="absolute top-0 left-0 w-full h-full overflow-hidden opacity-10">
          <div className="absolute -top-40 -left-40 w-80 h-80 bg-blue-500 rounded-full blur-3xl"></div>
          <div className="absolute top-1/2 -right-40 w-80 h-80 bg-purple-500 rounded-full blur-3xl"></div>
          <div className="absolute -bottom-40 left-1/3 w-80 h-80 bg-green-500 rounded-full blur-3xl"></div>
        </div>
      </div>
      
      <div className="max-w-screen-xl mx-auto relative z-10">
        <motion.div 
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={headingVariants}
          className="text-center mb-16"
        >
          <div className="inline-block mb-2 px-4 py-1 rounded-full bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 text-sm font-medium">
            <Star className="w-4 h-4 inline-block mr-1" />
            <span>Für Anfänger bis Profis</span>
          </div>
          
          <h2 className="font-roboto text-5xl font-bold mb-4 text-black dark:text-white">
            Fortschrittliche Funktionen
          </h2>
          
          <p className="text-gray-600 dark:text-gray-300 max-w-2xl mx-auto text-lg font-roboto relative">
            <span className="relative inline-block">
              Entdecken Sie leistungsstarke Tools mit Fokus auf Sicherheit, Privatsphäre und Kontrolle
              <svg className="absolute bottom-0 left-0 w-full" height="4" viewBox="0 0 100 4" preserveAspectRatio="none">
                <path d="M 0,2 L 100,2" stroke="url(#gradient)" strokeWidth="4" fill="none" />
                <defs>
                  <linearGradient id="gradient" gradientTransform="rotate(90)">
                    <stop offset="0%" stopColor="#0500ff" />
                    <stop offset="100%" stopColor="#00FF5F" />
                  </linearGradient>
                </defs>
              </svg>
            </span>
          </p>
        </motion.div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {featureData.map((feature, index) => (
            <FeatureCard
              key={index}
              icon={feature.icon}
              title={feature.title}
              description={feature.description}
              index={index}
            />
          ))}
        </div>
        
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5, duration: 0.5 }}
          viewport={{ once: true }}
          className="mt-16 text-center"
        >
          <Card className="p-6 mx-auto max-w-2xl bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20 border-0 shadow-xl">
            <CardContent className="p-0 flex items-center gap-4">
              <div className="bg-gradient-to-r from-blue-600 to-purple-600 p-3 rounded-full text-white">
                <Rocket className="h-6 w-6" />
              </div>
              <div className="text-left">
                <h3 className="font-semibold text-lg">Entdecken Sie noch mehr</h3>
                <p className="text-sm text-gray-600 dark:text-gray-300">
                  Laden Sie die Desktop-App herunter für zusätzliche erweiterte Funktionen.
                </p>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </section>
  );
};

export default FeaturesSection;
