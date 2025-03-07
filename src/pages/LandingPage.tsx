
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import WalletLogo from '@/components/WalletLogo';
import { ArrowRight, Check, Menu, Shield, Users, Smartphone, Sparkles, Eye, Globe, Gift, Coins, Wallet, Search, X, Loader2, Star, ExternalLink, Lock, Zap, Key, UserPlus } from 'lucide-react';
import { useWallet } from '@/contexts/WalletContext';
import { useMenu } from '@/contexts/MenuContext';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/components/ui/use-toast';
import { useNavigate } from 'react-router-dom';
import Footer from '@/components/Footer';
import CreateWalletButton from '@/components/CreateWalletButton';
import FeaturesSection from '@/components/FeaturesSection';
import SupportedAssetsSection from '@/components/SupportedAssetsSection';

interface FeatureCardProps {
  icon: React.ReactNode;
  title: string;
  description: string;
}

interface SecurityCardProps {
  title: string;
  description: string;
}

interface AssetCardProps {
  icon: React.ReactNode;
  title: string;
  description: string;
  color: string;
}

interface StepCardProps {
  number: string;
  title: string;
  description: string;
}

interface TestimonialCardProps {
  quote: string;
  author: string;
  role: string;
}

interface FAQItemProps {
  question: string;
  answer: string;
}

interface SupportedFeatureProps {
  label: string;
  supported: boolean;
}

const LandingPage = () => {
  const { generateWallet, hasWallet, session } = useWallet();
  const { toggleMenu } = useMenu();
  const [searchQuery, setSearchQuery] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  
  const handleRegisterClick = () => {
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      navigate('/register');
    }, 1000);
  };
  
  const handleLoginClick = () => {
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      navigate('/auth');
    }, 1000);
  };
  
  const handleWalletAccess = () => {
    if (hasWallet) {
      navigate('/wallet');
    } else {
      navigate('/generate-wallet');
    }
  };
  
  const handleMenuClick = () => {
    console.log('Landing page menu button clicked');
    toggleMenu();
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
    return <div className="p-6 rounded-xl border border-gray-100 bg-white shadow-sm transition-all hover:shadow-md hover:translate-y-[-4px] dark:bg-wallet-card dark:border-gray-800">
        <div className="mb-4 text-wallet-blue">{icon}</div>
        <h3 className="font-heading font-semibold text-lg mb-2">{title}</h3>
        <p className="text-gray-600 text-sm dark:text-gray-400">{description}</p>
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
    return <div className="p-6 rounded-xl transition-all bg-white shadow-md hover:shadow-lg dark:bg-wallet-card dark:border-gray-800 hover:translate-y-[-4px]">
        <div className={`bg-gradient-to-r ${getGradient()} inline-flex p-3 rounded-lg text-white mb-4`}>
          {icon}
        </div>
        <h3 className="font-heading font-semibold text-lg mb-2 bg-gradient-to-r from-indigo-500 to-blue-600 bg-clip-text text-transparent">{title}</h3>
        <p className="text-gray-600 text-sm dark:text-gray-400">{description}</p>
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
  
  console.log("Rendering LandingPage component");
  
  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-b from-gray-50 to-white text-gray-800 dark:from-wallet-darkBg dark:to-[#151823] dark:text-white">
      <header className="w-full p-6 flex justify-between items-center backdrop-blur-sm bg-white/70 dark:bg-black/20 sticky top-0 z-40">
        <div className="flex items-center gap-2">
          <WalletLogo className="w-8 h-8" useSparrowLogo={true} color="sparrow" animate={true} />
          <div>
            <span className="font-heading text-xl font-bold">Sparrow Wallet</span>
            <p className="text-xs text-gray-600 dark:text-gray-400 -mt-1">Bitcoin Wallet for Desktop & Web</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <button onClick={handleMenuClick} className="flex items-center justify-center w-10 h-10 rounded-full bg-gray-100 dark:bg-gray-800 text-gray-800 dark:text-gray-200 hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors" aria-label="Open menu">
            <Menu className="w-5 h-5 cursor-pointer" />
          </button>
        </div>
      </header>
      
      <div className="flex-1 flex flex-col">
        {/* Updated Hero Section - styled like the supported assets section */}
        <section className="py-24 px-6 relative overflow-hidden bg-[#1A1F2C] text-white">
          <div className="absolute inset-0 bg-gradient-to-b from-[#1A1F2C] to-[#221F26]/90"></div>
          
          <div className="max-w-screen-xl mx-auto relative z-10">
            <div className="text-center mb-16">
              <h2 className="font-roboto text-6xl md:text-8xl font-bold mb-4 text-center">
                <span className="bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
                  Sicher
                </span>
              </h2>
              <p className="text-3xl md:text-4xl font-roboto font-bold text-white/90 mb-8">
                Einfach. <span className="text-wallet-blue">Bitcoin</span> für jeden.
              </p>
              <p className="text-gray-400 max-w-2xl mx-auto">
                Sparrow ist eine Bitcoin-Wallet für alle, die finanziell selbstbestimmt sein wollen. 
                Jetzt auch als sichere, vollständige Webanwendung verfügbar.
              </p>
            </div>
            
            <div className="grid grid-cols-3 md:grid-cols-3 gap-6 justify-center max-w-4xl mx-auto mb-16">
              <div className="flex flex-col items-center">
                <div className="w-16 h-16 bg-[#1c1c28] flex items-center justify-center rounded-xl transform rotate-45 overflow-hidden transition-all hover:scale-110 hover:shadow-lg hover:shadow-blue-500/20">
                  <div className="transform -rotate-45 flex items-center justify-center w-full h-full">
                    <Shield className="h-8 w-8 text-blue-400" />
                  </div>
                </div>
                <span className="mt-2 text-sm text-gray-300 font-medium">Sicher</span>
              </div>
              
              <div className="flex flex-col items-center">
                <div className="w-16 h-16 bg-[#1c1c28] flex items-center justify-center rounded-xl transform rotate-45 overflow-hidden transition-all hover:scale-110 hover:shadow-lg hover:shadow-purple-500/20">
                  <div className="transform -rotate-45 flex items-center justify-center w-full h-full">
                    <Key className="h-8 w-8 text-purple-400" />
                  </div>
                </div>
                <span className="mt-2 text-sm text-gray-300 font-medium">Privat</span>
              </div>
              
              <div className="flex flex-col items-center">
                <div className="w-16 h-16 bg-[#1c1c28] flex items-center justify-center rounded-xl transform rotate-45 overflow-hidden transition-all hover:scale-110 hover:shadow-lg hover:shadow-green-500/20">
                  <div className="transform -rotate-45 flex items-center justify-center w-full h-full">
                    <Zap className="h-8 w-8 text-green-400" />
                  </div>
                </div>
                <span className="mt-2 text-sm text-gray-300 font-medium">Schnell</span>
              </div>
            </div>
            
            <div className="flex flex-col sm:flex-row gap-4 pt-4 z-10 relative justify-center">
              {session ? (
                <Button 
                  onClick={handleWalletAccess} 
                  className="w-full sm:w-auto py-6 text-base flex items-center justify-center gap-2 text-white font-medium transition-all rounded-xl bg-wallet-blue"
                >
                  {hasWallet ? "Auf Wallet Zugreifen" : "Wallet Erstellen"} <ArrowRight className="h-4 w-4" />
                </Button>
              ) : (
                <>
                  <Button 
                    onClick={handleRegisterClick} 
                    disabled={isLoading} 
                    className="w-full sm:w-auto py-6 text-base flex items-center justify-center gap-2 text-white font-medium transition-all rounded-xl bg-wallet-blue"
                  >
                    {isLoading ? (
                      <>
                        <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                        Loading...
                      </>
                    ) : (
                      <>
                        Registrieren <ArrowRight className="h-4 w-4" />
                      </>
                    )}
                  </Button>
                  
                  <Button 
                    variant="outline" 
                    className="w-full sm:w-auto py-6 text-base bg-[#1c1c28] hover:bg-[#252532] border-none"
                    onClick={handleLoginClick}
                  >
                    Anmelden
                  </Button>
                </>
              )}
              
              <Button variant="outline" className="w-full sm:w-auto py-6 text-base bg-[#1c1c28] hover:bg-[#252532] border-none" onClick={() => window.open('https://sparrowwallet.com/download/', '_blank')}>
                <ExternalLink className="mr-2 h-4 w-4" />
                Download Desktop App
              </Button>
            </div>
            
            <div className="relative mt-16 flex justify-center">
              <img src="/lovable-uploads/1b77eb0f-8d23-4584-b764-6202a16c8247.png" alt="Bitcoin Wallet App" className="w-full max-w-2xl mx-auto z-10 rounded-xl shadow-2xl shadow-blue-500/10" />
              <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-full max-w-2xl h-20 bg-gradient-to-t from-[#1A1F2C] to-transparent"></div>
            </div>
          </div>
        </section>
        
        <section className="px-6 py-12 bg-white dark:bg-wallet-card/40 backdrop-blur-md relative">
          <div className="max-w-screen-xl mx-auto">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 sm:gap-8">
              <div className="text-center transform transition-all duration-300 hover:scale-105 group">
                <div className="mb-2 inline-flex items-center justify-center">
                  <div className="text-purple-600 dark:text-purple-400 font-heading font-bold text-3xl sm:text-4xl bg-purple-100 dark:bg-purple-900/30 rounded-xl px-3 py-2 sm:px-4 sm:py-3 group-hover:shadow-md transition-all">100%</div>
                </div>
                <div className="text-gray-600 dark:text-gray-400 text-sm font-medium">Open Source</div>
              </div>
              <div className="text-center transform transition-all duration-300 hover:scale-105 group">
                <div className="mb-2 inline-flex items-center justify-center">
                  <div className="text-blue-600 dark:text-blue-400 font-heading font-bold text-3xl sm:text-4xl bg-blue-100 dark:bg-blue-900/30 rounded-xl px-3 py-2 sm:px-4 sm:py-3 group-hover:shadow-md transition-all">24/7</div>
                </div>
                <div className="text-gray-600 dark:text-gray-400 text-sm font-medium">Access</div>
              </div>
              <div className="text-center transform transition-all duration-300 hover:scale-105 group">
                <div className="mb-2 inline-flex items-center justify-center">
                  <div className="text-teal-600 dark:text-teal-400 font-heading font-bold text-3xl sm:text-4xl bg-teal-100 dark:bg-teal-900/30 rounded-xl px-3 py-2 sm:px-4 sm:py-3 group-hover:shadow-md transition-all">100+</div>
                </div>
                <div className="text-gray-600 dark:text-gray-400 text-sm font-medium">Hardware Wallets</div>
              </div>
            </div>
          </div>
        </section>
        
        <section className="px-6 py-20 relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-blue-50/80 to-indigo-50/80 dark:from-blue-900/10 dark:to-indigo-900/10 opacity-80"></div>
          
          <div className="absolute top-0 right-0 w-1/2 h-1/2 bg-blue-100 dark:bg-blue-800/10 rounded-full blur-3xl opacity-20 -translate-y-1/4 translate-x-1/4 animate-pulse"></div>
          <div className="absolute bottom-0 left-0 w-1/2 h-1/2 bg-indigo-100 dark:bg-indigo-800/10 rounded-full blur-3xl opacity-20 translate-y-1/4 -translate-x-1/4 animate-pulse" style={{
          animationDuration: '8s',
          animationDelay: '2s'
        }}></div>
          
          <div className="max-w-screen-xl mx-auto relative z-10">
            <div className="text-center mb-16">
              <div className="inline-flex items-center justify-center p-3 bg-gradient-to-r from-blue-500/10 to-indigo-500/10 dark:from-blue-500/20 dark:to-indigo-500/20 rounded-2xl mb-6 backdrop-blur-sm border border-blue-100/30 dark:border-blue-400/10 transform transition-all duration-300 hover:scale-105">
                <Shield className="h-10 w-10 text-blue-600 dark:text-blue-400" />
              </div>
              <h2 className="font-roboto text-4xl md:text-5xl font-bold mb-6">
                Sicherheit der du vertrauen kannst, 
                <span className="bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent"> Einfachheit </span> 
                die du lieben wirst
              </h2>
              <p className="text-gray-600 dark:text-gray-300 max-w-3xl mx-auto text-lg leading-relaxed font-roboto">
                Sparrow Wallet kombiniert branchenführende Sicherheit mit intuitivem Design und macht es zur perfekten Wallet für Anfänger und fortgeschrittene Bitcoin-Nutzer.
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-12">
              <div className="relative group">
                <div className="absolute inset-0 bg-gradient-to-r from-green-400/20 to-emerald-400/20 rounded-2xl blur-xl opacity-70 group-hover:opacity-100 transition-all duration-300 -z-10 group-hover:scale-105"></div>
                <div className="bg-white/80 dark:bg-gray-800/40 p-8 rounded-2xl shadow-sm backdrop-blur-md border border-green-100/50 dark:border-green-500/10 transition-all duration-300 group-hover:shadow-lg hover:-translate-y-1 h-full">
                  <div className="inline-flex items-center justify-center p-3 bg-gradient-to-r from-green-400/20 to-emerald-400/20 dark:from-green-500/20 dark:to-emerald-500/20 rounded-xl mb-5 group-hover:scale-110 transition-all duration-300">
                    <Shield className="h-7 w-7 text-green-600 dark:text-green-400" />
                  </div>
                  <h3 className="font-roboto text-xl font-bold mb-3 text-gray-800 dark:text-white">Kompromisslose Sicherheit</h3>
                  <p className="text-gray-600 dark:text-gray-300">
                    Deine Schlüssel verlassen niemals dein Gerät. Volle Selbstverwahrung bedeutet, dass du immer die Kontrolle über deine Bitcoin hast, ohne Risiko durch Dritte.
                  </p>
                  <ul className="mt-5 space-y-3">
                    <li className="flex items-start">
                      <div className="flex-shrink-0 p-1 bg-green-100 dark:bg-green-900/30 rounded-full mr-3 mt-0.5">
                        <Check className="h-4 w-4 text-green-600 dark:text-green-400" />
                      </div>
                      <span className="text-gray-700 dark:text-gray-300 text-sm">Open-Source und vollständig prüfbarer Code</span>
                    </li>
                    <li className="flex items-start">
                      <div className="flex-shrink-0 p-1 bg-green-100 dark:bg-green-900/30 rounded-full mr-3 mt-0.5">
                        <Check className="h-4 w-4 text-green-600 dark:text-green-400" />
                      </div>
                      <span className="text-gray-700 dark:text-gray-300 text-sm">Hardware-Wallet Integration</span>
                    </li>
                    <li className="flex items-start">
                      <div className="flex-shrink-0 p-1 bg-green-100 dark:bg-green-900/30 rounded-full mr-3 mt-0.5">
                        <Check className="h-4 w-4 text-green-600 dark:text-green-400" />
                      </div>
                      <span className="text-gray-700 dark:text-gray-300 text-sm">Sichere kryptographische Protokolle</span>
                    </li>
                  </ul>
                </div>
              </div>
              
              <div className="relative group">
                <div className="absolute inset-0 bg-gradient-to-r from-blue-400/20 to-indigo-400/20 rounded-2xl blur-xl opacity-70 group-hover:opacity-100 transition-all duration-300 -z-10 group-hover:scale-105"></div>
                <div className="bg-white/80 dark:bg-gray-800/40 p-8 rounded-2xl shadow-sm backdrop-blur-md border border-blue-100/50 dark:border-blue-500/10 transition-all duration-300 group-hover:shadow-lg hover:-translate-y-1 h-full">
                  <div className="inline-flex items-center justify-center p-3 bg-gradient-to-r from-blue-400/20 to-indigo-400/20 dark:from-blue-500/20 dark:to-indigo-500/20 rounded-xl mb-5 group-hover:scale-110 transition-all duration-300">
                    <UserPlus className="h-7 w-7 text-blue-600 dark:text-blue-400" />
                  </div>
                  <h3 className="font-roboto text-xl font-bold mb-3 text-gray-800 dark:text-white">Anfängerfreundlich</h3>
                  <p className="text-gray-600 dark:text-gray-300">
                    Eine intuitive Benutzeroberfläche mit hilfreichen Anleitungen und Tooltips macht Bitcoin für jeden zugänglich, unabhängig von technischem Fachwissen.
                  </p>
                  <ul className="mt-5 space-y-3">
                    <li className="flex items-start">
                      <div className="flex-shrink-0 p-1 bg-blue-100 dark:bg-blue-900/30 rounded-full mr-3 mt-0.5">
                        <Check className="h-4 w-4 text-blue-600 dark:text-blue-400" />
                      </div>
                      <span className="text-gray-700 dark:text-gray-300 text-sm">Klares, intuitives Design</span>
                    </li>
                    <li className="flex items-start">
                      <div className="flex-shrink-0 p-1 bg-blue-100 dark:bg-blue-900/30 rounded-full mr-3 mt-0.5">
                        <Check className="h-4 w-4 text-blue-600 dark:text-blue-400" />
                      </div>
                      <span className="text-gray-700 dark:text-gray-300 text-sm">Integrierte Tutorials und Anleitungen</span>
                    </li>
                    <li className="flex items-start">
                      <div className="flex-shrink-0 p-1 bg-blue-100 dark:bg-blue-900/30 rounded-full mr-3 mt-0.5">
                        <Check className="h-4 w-4 text-blue-600 dark:text-blue-400" />
                      </div>
                      <span className="text-gray-700 dark:text-gray-300 text-sm">Vereinfachter Transaktionsprozess</span>
                    </li>
                  </ul>
                </div>
              </div>
              
              <div className="relative group">
                <div className="absolute inset-0 bg-gradient-to-r from-purple-400/20 to-violet-400/20 rounded-2xl blur-xl opacity-70 group-hover:opacity-100 transition-all duration-300 -z-10 group-hover:scale-105"></div>
                <div className="bg-white/80 dark:bg-gray-800/40 p-8 rounded-2xl shadow-sm backdrop-blur-md border border-purple-100/50 dark:border-purple-500/10 transition-all duration-300 group-hover:shadow-lg hover:-translate-y-1 h-full">
                  <div className="inline-flex items-center justify-center p-3 bg-gradient-to-r from-purple-400/20 to-violet-400/20 dark:from-purple-500/20 dark:to-violet-500/20 rounded-xl mb-5 group-hover:scale-110 transition-all duration-300">
                    <Key className="h-7 w-7 text-purple-600 dark:text-purple-400" />
                  </div>
                  <h3 className="font-roboto text-xl font-bold mb-3 text-gray-800 dark:text-white">Vollständige Kontrolle</h3>
                  <p className="text-gray-600 dark:text-gray-300">
                    Erweiterte Funktionen, wenn du sie brauchst, mit detaillierten Transaktionskontrollen, die mit deiner Erfahrung wachsen.
                  </p>
                  <ul className="mt-5 space-y-3">
                    <li className="flex items-start">
                      <div className="flex-shrink-0 p-1 bg-purple-100 dark:bg-purple-900/30 rounded-full mr-3 mt-0.5">
                        <Check className="h-4 w-4 text-purple-600 dark:text-purple-400" />
                      </div>
                      <span className="text-gray-700 dark:text-gray-300 text-sm">Detaillierte UTXO-Verwaltung</span>
                    </li>
                    <li className="flex items-start">
                      <div className="flex-shrink-0 p-1 bg-purple-100 dark:bg-purple-900/30 rounded-full mr-3 mt-0.5">
                        <Check className="h-4 w-4 text-purple-600 dark:text-purple-400" />
                      </div>
                      <span className="text-gray-700 dark:text-gray-300 text-sm">Benutzerdefinierte Gebühreneinstellungen</span>
                    </li>
                    <li className="flex items-start">
                      <div className="flex-shrink-0 p-1 bg-purple-100 dark:bg-purple-900/30 rounded-full mr-3 mt-0.5">
                        <Check className="h-4 w-4 text-purple-600 dark:text-purple-400" />
                      </div>
                      <span className="text-gray-700 dark:text-gray-300 text-sm">Transaktionskennzeichnung und -verlauf</span>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
            
            <div className="mt-16 text-center">
              {session ? (
                <Button 
                  onClick={handleWalletAccess}
                  className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white py-6 rounded-xl shadow-md hover:shadow-lg transition-all duration-300 hover:-translate-y-1 text-lg font-medium px-[15px]"
                >
                  {hasWallet ? "Auf Wallet Zugreifen" : "Wallet Erstellen"}
                </Button>
              ) : (
                <Button 
                  onClick={handleRegisterClick} 
                  disabled={isLoading} 
                  className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white py-6 rounded-xl shadow-md hover:shadow-lg transition-all duration-300 hover:-translate-y-1 text-lg font-medium px-[15px]"
                >
                  Registrieren
                </Button>
              )}
            </div>
          </div>
        </section>
        
        {/* Include additional sections if they exist in the original file */}
        <FeaturesSection />
        <SupportedAssetsSection />

        <Footer />
      </div>
    </div>
  );
};

export default LandingPage;
