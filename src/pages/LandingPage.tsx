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

interface Testimonial {
  name: string;
  title: string;
  image: string;
  text: string;
}

interface FAQItemProps {
  question: string;
  answer: string;
}

interface SupportedFeatureProps {
  icon: React.ReactNode;
  title: string;
  description: string;
}

const LandingPage = () => {
  const { generateWallet, hasWallet, session } = useWallet();
  const { toggleMenu } = useMenu();
  const [searchQuery, setSearchQuery] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
  };

  const handleMenuClick = () => {
    toggleMenu();
  };

  const handleRegisterClick = async () => {
    setIsLoading(true);
    try {
      const { data, error } = await supabase.auth.signUp({
        email: `${Math.random().toString(36).substring(2, 15)}@example.com`,
        password: Math.random().toString(36).substring(2, 15),
      });

      if (error) {
        console.error("Error signing up:", error);
        toast({
          title: "Fehler",
          description: "Es gab einen Fehler bei der Registrierung. Bitte versuche es später noch einmal.",
          variant: "destructive",
        });
      } else {
        console.log("Sign up successful:", data);
        toast({
          title: "Konto erstellt!",
          description: "Bitte bestätige deine E-Mail-Adresse, um fortzufahren.",
        });
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleLoginClick = async () => {
    setIsLoading(true);
    try {
      const { data, error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: `${window.location.origin}/wallet`,
        }
      });

      if (error) {
        console.error("Error signing in with Google:", error);
        toast({
          title: "Fehler",
          description: "Es gab einen Fehler beim Anmelden mit Google. Bitte versuche es später noch einmal.",
          variant: "destructive",
        });
      } else {
        console.log("Sign in with Google initiated:", data);
        toast({
          title: "Anmeldung wird durchgeführt",
          description: "Du wirst nun zu Google weitergeleitet, um dich anzumelden.",
        });
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleWalletAccess = () => {
    navigate('/wallet');
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
    icon,
    title,
    description
  }: {
    icon: React.ReactNode;
    title: string;
    description: string;
  }) => {
    return <div className="flex flex-col items-center p-6 rounded-xl border border-gray-100 bg-white shadow-sm transition-all hover:shadow-md hover:translate-y-[-4px] dark:bg-wallet-card dark:border-gray-800">
        <div className="mb-4 text-wallet-blue">{icon}</div>
        <h3 className="font-heading font-semibold text-lg mb-2 text-center">{title}</h3>
        <p className="text-gray-600 text-sm text-center dark:text-gray-400">{description}</p>
      </div>;
  };
  
  const AssetCard = ({
    image,
    name,
    symbol,
    price,
    change
  }: {
    image: string;
    name: string;
    symbol: string;
    price: number;
    change: number;
  }) => {
    return <div className="p-4 rounded-xl bg-white shadow-sm transition-all hover:shadow-md hover:translate-y-[-4px] dark:bg-wallet-card">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <img src={image} alt={name} className="w-8 h-8 rounded-full" />
            <div>
              <h4 className="font-medium">{name}</h4>
              <p className="text-xs text-gray-500">{symbol}</p>
            </div>
          </div>
          <div className="text-right">
            <h4 className="font-medium">${price.toFixed(2)}</h4>
            <p className={`text-xs ${change > 0 ? 'text-green-500' : 'text-red-500'}`}>
              {change > 0 ? '+' : ''}{change.toFixed(2)}%
            </p>
          </div>
        </div>
      </div>;
  };
  
  const StepCard = ({
    number,
    title,
    description
  }: {
    number: number;
    title: string;
    description: string;
  }) => {
    return <div className="flex flex-col md:flex-row items-center gap-4 p-6 rounded-xl bg-white shadow-sm transition-all hover:shadow-md hover:translate-y-[-4px] dark:bg-wallet-card">
        <div className="step-number w-10 h-10 rounded-full bg-wallet-blue text-white font-bold flex items-center justify-center relative">
          {number}
        </div>
        <div>
          <h3 className="font-medium">{title}</h3>
          <p className="text-sm text-gray-500">{description}</p>
        </div>
      </div>;
  };
  
  const TestimonialCard = ({
    name,
    title,
    image,
    text
  }: Testimonial) => {
    return <div className="p-6 rounded-xl bg-white shadow-sm transition-all hover:shadow-md hover:translate-y-[-4px] dark:bg-wallet-card">
        <div className="flex items-center gap-4 mb-4">
          <img src={image} alt={name} className="w-12 h-12 rounded-full" />
          <div>
            <h4 className="font-medium">{name}</h4>
            <p className="text-sm text-gray-500">{title}</p>
          </div>
        </div>
        <p className="text-gray-600 dark:text-gray-400">{text}</p>
      </div>;
  };
  
  const FAQItem = ({
    question,
    answer
  }: FAQItemProps) => {
    const [isOpen, setIsOpen] = useState(false);
    return <div className="faq-item border-b border-gray-200 dark:border-gray-700 last:border-none">
        <button className="w-full text-left py-4 px-6 flex items-center justify-between font-medium text-gray-800 dark:text-gray-200" onClick={() => setIsOpen(!isOpen)}>
          {question}
          <svg className={`w-4 h-4 shrink-0 transition-transform ${isOpen ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path>
          </svg>
        </button>
        <div className={`faq-answer px-6 pb-4 text-gray-600 dark:text-gray-400 ${isOpen ? 'open' : ''}`} style={{
        maxHeight: isOpen ? '500px' : '0'
      }}>
          {answer}
        </div>
      </div>;
  };
  
  const SupportedFeature = ({
    icon,
    title,
    description
  }: SupportedFeatureProps) => {
    return <div className="flex items-start gap-4">
        <div className="w-12 h-12 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center">
          {icon}
        </div>
        <div>
          <h4 className="font-medium">{title}</h4>
          <p className="text-sm text-gray-500">{description}</p>
        </div>
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
        <section className="py-24 px-6 relative overflow-hidden bg-white text-gray-800">
          <div className="absolute inset-0 bg-gradient-to-b from-white to-blue-50/30"></div>
          
          <div className="max-w-screen-xl mx-auto relative z-10">
            <div className="text-center mb-16">
              <div className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                <h2 className="font-roboto text-6xl md:text-8xl font-bold mb-4 text-center">
                  Sicher
                </h2>
                <p className="text-6xl md:text-6xl font-roboto font-bold mb-8">
                  Einfach. Bitcoin für jeden.
                </p>
              </div>
              <p className="text-gray-600 max-w-2xl mx-auto bg-gradient-to-r from-blue-600/70 to-purple-600/70 bg-clip-text text-transparent font-medium">
                Sparrow ist eine Bitcoin-Wallet für alle, die finanziell selbstbestimmt sein wollen. 
                Jetzt auch als sichere, vollständige Webanwendung verfügbar.
              </p>
            </div>
            
            <div className="grid grid-cols-3 md:grid-cols-3 gap-6 justify-center max-w-4xl mx-auto mb-16">
              <div className="flex flex-col items-center">
                <div className="w-16 h-16 bg-blue-50 flex items-center justify-center rounded-xl transform rotate-45 overflow-hidden transition-all hover:scale-110 hover:shadow-lg hover:shadow-blue-500/20">
                  <div className="transform -rotate-45 flex items-center justify-center w-full h-full">
                    <Shield className="h-8 w-8 text-blue-600" />
                  </div>
                </div>
                <span className="mt-2 text-sm text-gray-700 font-medium">Sicher</span>
              </div>
              
              <div className="flex flex-col items-center">
                <div className="w-16 h-16 bg-purple-50 flex items-center justify-center rounded-xl transform rotate-45 overflow-hidden transition-all hover:scale-110 hover:shadow-lg hover:shadow-purple-500/20">
                  <div className="transform -rotate-45 flex items-center justify-center w-full h-full">
                    <Key className="h-8 w-8 text-purple-600" />
                  </div>
                </div>
                <span className="mt-2 text-sm text-gray-700 font-medium">Privat</span>
              </div>
              
              <div className="flex flex-col items-center">
                <div className="w-16 h-16 bg-green-50 flex items-center justify-center rounded-xl transform rotate-45 overflow-hidden transition-all hover:scale-110 hover:shadow-lg hover:shadow-green-500/20">
                  <div className="transform -rotate-45 flex items-center justify-center w-full h-full">
                    <Zap className="h-8 w-8 text-green-600" />
                  </div>
                </div>
                <span className="mt-2 text-sm text-gray-700 font-medium">Schnell</span>
              </div>
            </div>
            
            <div className="flex flex-col sm:flex-row gap-4 pt-4 z-10 relative justify-center">
              {session ? (
                <Button 
                  onClick={handleWalletAccess} 
                  className="w-full sm:w-auto py-6 text-base flex items-center justify-center gap-2 text-white font-medium transition-all rounded-xl bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
                >
                  {hasWallet ? "Auf Wallet Zugreifen" : "Wallet Erstellen"} <ArrowRight className="h-4 w-4" />
                </Button>
              ) : (
                <>
                  <Button 
                    onClick={handleRegisterClick} 
                    disabled={isLoading} 
                    className="w-full sm:w-auto py-6 text-base flex items-center justify-center gap-2 text-white font-medium transition-all rounded-xl bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
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
                    className="w-full sm:w-auto py-6 text-base bg-gray-50 hover:bg-gray-100 border-gray-200"
                    onClick={handleLoginClick}
                  >
                    Anmelden
                  </Button>
                </>
              )}
              
              <Button variant="outline" className="w-full sm:w-auto py-6 text-base bg-gray-50 hover:bg-gray-100 border-gray-200" onClick={() => window.open('https://sparrowwallet.com/download/', '_blank')}>
                <ExternalLink className="mr-2 h-4 w-4" />
                Download Desktop App
              </Button>
            </div>
            
            <div className="relative mt-16 flex justify-center">
              <img src="/lovable-uploads/1b77eb0f-8d23-4584-b764-6202a16c8247.png" alt="Bitcoin Wallet App" className="w-full max-w-2xl mx-auto z-10 rounded-xl shadow-2xl shadow-blue-500/10" />
              <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-full max-w-2xl h-20 bg-gradient-to-t from-white to-transparent"></div>
            </div>
          </div>
        </section>
        
        <section className="bg-gray-50 py-12">
          <div className="max-w-screen-xl mx-auto px-6 text-center">
            <h2 className="font-roboto text-4xl font-bold mb-8">Funktionen</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-5xl mx-auto">
              <FeatureCard icon={<Shield className="w-6 h-6" />} title="Sicherheit" description="Schützen Sie Ihre Bitcoin mit modernster Verschlüsselung und Sicherheitsfunktionen." />
              <FeatureCard icon={<Key className="w-6 h-6" />} title="Privatsphäre" description="Behalten Sie die Kontrolle über Ihre Daten und Transaktionen." />
              <FeatureCard icon={<Users className="w-6 h-6" />} title="Multi-Plattform" description="Verwenden Sie Sparrow auf Ihrem Desktop, im Web oder auf Ihrem Mobilgerät." />
            </div>
          </div>
        </section>
        
        <section className="px-6 py-12 bg-white dark:bg-wallet-card/40 backdrop-blur-md relative">
          <div className="max-w-screen-xl mx-auto text-center">
            <h2 className="font-roboto text-4xl font-bold mb-8">Sicherheit</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-5xl mx-auto">
              <SecurityCard icon={<Lock className="w-8 h-8" />} title="Volle Kontrolle" description="Sie haben die volle Kontrolle über Ihre privaten Schlüssel und Ihre Bitcoin." />
              <SecurityCard icon={<Eye className="w-8 h-8" />} title="Open Source" description="Der Code ist öffentlich einsehbar und von der Community geprüft." />
              <SecurityCard icon={<Check className="w-8 h-8" />} title="Non-Custodial" description="Ihre Bitcoin werden nicht von Dritten verwahrt." />
            </div>
          </div>
        </section>
        
        <section className="px-6 py-20 relative overflow-hidden">
          <div className="max-w-screen-xl mx-auto text-center">
            <h2 className="font-roboto text-4xl font-bold mb-8">Einfache Schritte zum Start</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto">
              <StepCard number={1} title="Wallet erstellen" description="Erstellen Sie eine neue Wallet oder importieren Sie eine bestehende." />
              <StepCard number={2} title="Bitcoin empfangen" description="Empfangen Sie Bitcoin von Freunden, Familie oder einer Börse." />
              <StepCard number={3} title="Bitcoin senden" description="Senden Sie Bitcoin an jeden auf der Welt." />
            </div>
          </div>
        </section>
        
        <FeaturesSection />
        <SupportedAssetsSection />

        <Footer />
      </div>
    </div>
  );
};

export default LandingPage;
