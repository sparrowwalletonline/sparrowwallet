import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import WalletLogo from '@/components/WalletLogo';
import { ArrowRight, Check, Menu, Shield, Users, Smartphone, Sparkles, Eye, Globe, Gift, Coins, Wallet, Search, X, Loader2, Star, ExternalLink } from 'lucide-react';
import { useWallet } from '@/contexts/WalletContext';
import { useMenu } from '@/contexts/MenuContext';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/components/ui/use-toast';
import { useNavigate } from 'react-router-dom';
import Footer from '@/components/Footer';

const RegistrationModal = ({ isOpen, onClose, onRegister, isLoading }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      toast({
        title: "Fehler",
        description: "Die Passwörter stimmen nicht überein",
        variant: "destructive",
      });
      return;
    }
    onRegister(email, password);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black bg-opacity-50">
      <div className="bg-wallet-card text-white p-6 rounded-xl w-full max-w-md shadow-xl">
        <h2 className="text-xl font-bold mb-4">Registrieren</h2>
        <p className="text-gray-400 mb-6">Erstelle ein Konto, um deine Wallet zu sichern</p>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1">E-Mail</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full p-2 rounded bg-wallet-darkBg border border-gray-700 text-white"
              required
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium mb-1">Passwort</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full p-2 rounded bg-wallet-darkBg border border-gray-700 text-white"
              required
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium mb-1">Passwort bestätigen</label>
            <input
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className="w-full p-2 rounded bg-wallet-darkBg border border-gray-700 text-white"
              required
            />
          </div>
          
          <div className="flex justify-end space-x-3 mt-6">
            <Button 
              type="button" 
              onClick={onClose}
              variant="ghost"
              className="text-gray-400 hover:text-white"
            >
              Abbrechen
            </Button>
            <Button 
              type="submit"
              disabled={isLoading}
              className="bg-wallet-blue hover:bg-wallet-darkBlue"
            >
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Registriere...
                </>
              ) : (
                "Registrieren"
              )}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

const SuccessModal = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black bg-opacity-50">
      <div className="bg-wallet-card text-white p-6 rounded-xl w-full max-w-md shadow-xl text-center">
        <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-green-500 flex items-center justify-center">
          <Check className="h-8 w-8 text-white" />
        </div>
        <h2 className="text-xl font-bold mb-2">Konto erfolgreich erstellt!</h2>
        <p className="text-gray-400 mb-6">Du wirst jetzt zur Wallet-Auswahl weitergeleitet.</p>
        
        <Button 
          onClick={onClose}
          className="bg-wallet-blue hover:bg-wallet-darkBlue"
        >
          Weiter
        </Button>
      </div>
    </div>
  );
};

const LandingPage = () => {
  const { generateWallet } = useWallet();
  const { toggleMenu } = useMenu();
  const [searchQuery, setSearchQuery] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [showRegistrationModal, setShowRegistrationModal] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [session, setSession] = useState(null);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const navigate = useNavigate();
  
  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
    });

    return () => subscription.unsubscribe();
  }, []);
  
  useEffect(() => {
    const elements = document.querySelectorAll('.landing-page-content *');
    elements.forEach(el => {
      if (el instanceof HTMLElement) {
        el.style.opacity = '1';
        el.style.visibility = 'visible';
        el.style.display = el.style.display === 'none' ? 'block' : el.style.display;
      }
    });
    
    const buttons = document.querySelectorAll('button');
    buttons.forEach(button => {
      button.style.opacity = '1';
      button.style.visibility = 'visible';
      button.style.display = 'inline-flex';
    });
  }, []);

  const handleCreateWallet = () => {
    setIsLoading(true);
    
    setTimeout(() => {
      if (session) {
        generateWallet();
      } else {
        setIsLoading(false);
        setShowRegistrationModal(true);
      }
    }, 3000);
  };
  
  const handleRegister = async (email, password) => {
    setIsLoading(true);
    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
      });
      
      if (error) {
        throw error;
      }
      
      setShowRegistrationModal(false);
      setShowSuccessModal(true);
    } catch (error) {
      console.error("Registration error:", error);
      toast({
        title: "Registrierung fehlgeschlagen",
        description: error.message || "Bitte versuche es mit einer anderen E-Mail-Adresse",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };
  
  const handleSuccessModalClose = () => {
    setShowSuccessModal(false);
    navigate('/wallet-choice');
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
    return (
      <div className="p-6 rounded-xl border border-gray-100 bg-white shadow-sm transition-all hover:shadow-md hover:translate-y-[-4px] dark:bg-wallet-card dark:border-gray-800">
        <div className="mb-4 text-wallet-blue">{icon}</div>
        <h3 className="font-heading font-semibold text-lg mb-2">{title}</h3>
        <p className="text-gray-600 text-sm dark:text-gray-400">{description}</p>
      </div>
    );
  };
  
  const SecurityCard = ({
    title,
    description
  }: {
    title: string;
    description: string;
  }) => {
    return (
      <div className="p-6 rounded-xl transition-all bg-white/10 backdrop-blur-sm hover:bg-white/20">
        <h3 className="font-heading font-semibold text-lg mb-2">{title}</h3>
        <p className="text-blue-100 text-sm">{description}</p>
      </div>
    );
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
    return (
      <div className="p-6 rounded-xl transition-all bg-white shadow-md hover:shadow-lg dark:bg-wallet-card dark:border-gray-800 hover:translate-y-[-4px]">
        <div className={`bg-gradient-to-r ${getGradient()} inline-flex p-3 rounded-lg text-white mb-4`}>
          {icon}
        </div>
        <h3 className="font-heading font-semibold text-lg mb-2 bg-gradient-to-r from-indigo-500 to-blue-600 bg-clip-text text-transparent">{title}</h3>
        <p className="text-gray-600 text-sm dark:text-gray-400">{description}</p>
      </div>
    );
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
    <div 
      className="landing-page-content min-h-screen flex flex-col bg-gradient-to-b from-gray-50 to-white text-gray-800 dark:from-wallet-darkBg dark:to-[#151823] dark:text-white force-visible"
      style={{ opacity: 1, visibility: 'visible' }}
    >
      <header className="w-full p-6 flex justify-between items-center backdrop-blur-sm bg-white/70 dark:bg-black/20 sticky top-0 z-10 force-visible">
        <div className="flex items-center gap-2">
          <WalletLogo className="w-8 h-8" useSparrowLogo={true} color="sparrow" />
          <div>
            <span className="font-heading text-xl font-bold">Sparrow Wallet</span>
            <p className="text-xs text-gray-600 dark:text-gray-400 -mt-1">Bitcoin Wallet for Desktop & Web</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <button 
            onClick={handleMenuClick}
            className="flex items-center justify-center w-10 h-10 rounded-full bg-gray-100 dark:bg-gray-800 text-gray-800 dark:text-gray-200 hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
            aria-label="Open menu"
          >
            <Menu className="w-5 h-5 cursor-pointer" />
          </button>
        </div>
      </header>
      
      <div className="flex-1 flex flex-col force-visible" style={{ opacity: 1, visibility: 'visible' }}>
        {/* Hero Section */}
        <section className="relative px-6 py-20 sm:py-28 overflow-hidden force-visible hero-section" style={{ opacity: 1, visibility: 'visible' }}>
          <div className="absolute inset-0 pointer-events-none">
            <div className="absolute inset-0 bg-blue-50 dark:bg-blue-900/10" />
            <div className="absolute top-0 left-0 right-0 h-32 bg-gradient-to-b from-white dark:from-wallet-darkBg to-transparent" />
            <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-white dark:from-wallet-darkBg to-transparent" />
            <div className="absolute opacity-30 -top-24 -right-24 w-96 h-96 rounded-full bg-blue-200 dark:bg-blue-800/20 blur-3xl" />
            <div className="absolute opacity-30 -bottom-24 -left-24 w-96 h-96 rounded-full bg-purple-200 dark:bg-purple-800/20 blur-3xl" />
          </div>
          
          <div className="max-w-screen-xl mx-auto">
            <div className="flex flex-col lg:flex-row items-center gap-10">
              <div className="space-y-8 lg:w-1/2">
                <h1 className="font-heading tracking-tight text-gray-900 dark:text-white leading-[1.1] font-bold text-4xl md:text-5xl lg:text-6xl max-w-xl force-visible"
                    style={{ opacity: 1, visibility: 'visible' }}>
                  Powerful Bitcoin
                  <span className="text-wallet-blue"> Wallet </span>
                  for Power Users
                </h1>
                
                <p className="font-sans text-gray-600 dark:text-gray-300 text-lg max-w-lg force-visible"
                   style={{ opacity: 1, visibility: 'visible' }}>
                  Sparrow is a Bitcoin wallet for those who value financial self sovereignty. 
                  Now available as a secure, full-featured web application.
                </p>
                
                <div className="flex flex-col sm:flex-row gap-4 pt-4 force-visible"
                     style={{ opacity: 1, visibility: 'visible', display: 'flex' }}>
                  <Button 
                    onClick={handleCreateWallet} 
                    disabled={isLoading}
                    className="force-visible w-full sm:w-auto py-6 text-base flex items-center justify-center gap-2 text-white font-medium transition-all rounded-xl bg-wallet-blue"
                    style={{ opacity: 1, visibility: 'visible', display: 'flex' }}
                  >
                    {isLoading ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Wird geladen...
                      </>
                    ) : (
                      <>
                        Create Online Wallet <ArrowRight className="h-4 w-4" />
                      </>
                    )}
                  </Button>
                  
                  <Button
                    variant="outline"
                    className="force-visible w-full sm:w-auto py-6 text-base"
                    style={{ opacity: 1, visibility: 'visible', display: 'flex' }}
                    onClick={() => window.open('https://sparrowwallet.com/download/', '_blank')}
                  >
                    <ExternalLink className="mr-2 h-4 w-4" />
                    Download Desktop App
                  </Button>
                </div>
              </div>
              
              <div className="relative lg:w-1/2 force-visible" style={{ opacity: 1, visibility: 'visible' }}>
                <div className="absolute inset-0 rounded-3xl bg-blue-500/10 dark:bg-blue-500/5 blur-xl -z-10"></div>
                <div className="relative bg-white dark:bg-wallet-card rounded-3xl shadow-lg p-6 border border-gray-200 dark:border-gray-800 overflow-hidden">
                  <img 
                    src="/lovable-uploads/1b77eb0f-8d23-4584-b764-6202a16c8247.png" 
                    alt="Bitcoin Wallet App" 
                    className="w-full max-w-md mx-auto force-visible"
                    style={{ opacity: 1, visibility: 'visible' }}
                  />
                </div>
              </div>
            </div>
          </div>
        </section>
        
        {/* Stats Section */}
        <section className="px-6 py-12 bg-white dark:bg-wallet-card">
          <div className="max-w-screen-xl mx-auto">
            <div className="grid grid-cols-3 gap-4">
              <div className="text-center">
                <div className="text-wallet-blue font-heading font-bold text-3xl bg-transparent">100%</div>
                <div className="text-gray-600 dark:text-gray-400 text-sm">Open Source</div>
              </div>
              <div className="text-center">
                <div className="text-wallet-blue font-heading font-bold text-3xl">24/7</div>
                <div className="text-gray-600 dark:text-gray-400 text-sm">Access</div>
              </div>
              <div className="text-center">
                <div className="text-wallet-blue font-heading font-bold text-3xl">100+</div>
                <div className="text-gray-600 dark:text-gray-400 text-sm">Hardware Wallets</div>
              </div>
            </div>
          </div>
        </section>
        
        {/* Bitcoin Online Freedom Section */}
        <section className="py-20 my-12 px-6">
          <div className="relative max-w-screen-xl mx-auto rounded-3xl overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-b from-blue-500 via-blue-600 to-blue-900"></div>
            
            <div className="relative py-20 px-6 text-white">
              <div className="text-center mb-12">
                <h2 className="font-heading text-4xl font-bold mb-6">Bitcoin Online<br />Freedom Everywhere</h2>
                <p className="text-blue-50 max-w-2xl mx-auto text-lg">
                  Sparrow provides a powerful platform for interacting with the Bitcoin network, whether you're a beginner or an advanced user.
                  Now accessible from any web browser, anywhere.
                </p>
              </div>
              
              <div className="bg-white rounded-3xl max-w-xl mx-auto overflow-hidden text-gray-800 shadow-2xl transform transition-transform hover:scale-[1.02]">
                <div className="p-6">
                  <div className="border-b border-gray-100 pb-4 mb-4">
                    <div className="flex items-center gap-3 mb-3">
                      <div className="w-10 h-10 rounded-full bg-orange-400 flex items-center justify-center text-white">
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                          <path d="M23.638 14.904c-1.602 6.425-8.113 10.334-14.542 8.746C2.67 22.052-1.244 15.546.345 9.105 1.952 2.677 8.458-1.233 14.895.355c6.447 1.605 10.346 8.11 8.743 14.549z" fill="#FFF" />
                          <path d="M17.291 10.174c.25-1.669-.998-2.564-2.7-3.165l.55-2.212-1.346-.336-.535 2.151c-.355-.088-.717-.172-1.078-.253l.54-2.165-1.344-.336-.552 2.21a44.184 44.184 0 01-.86-.202l.001-.007-1.855-.463-.358 1.437s.998.23.978.244c.545.136.644.497.627.784l-.627 2.518c.037.01.087.024.14.046l-.142-.036-.879 3.524c-.067.166-.236.414-.618.32.013.02-.979-.244-.979-.244l-.67 1.545 1.75.437c.325.082.644.167.958.247l-.558 2.24 1.342.336.558-2.234c2.297.435 4.03.26 4.758-1.818.586-1.674-.03-2.641-1.237-3.267.879-.203 1.544-.78 1.723-1.974zm-3.081 4.298c-.417 1.674-3.233.77-4.147.542l.74-2.967c.914.228 3.85.68 3.407 2.425zm.415-4.348c-.38 1.52-2.725.747-3.487.557l.67-2.693c.762.19 3.217.543 2.817 2.136z" fill="#FFF" />
                        </svg>
                      </div>
                      <span className="font-semibold">Bitcoin (BTC)</span>
                    </div>
                    
                    <div className="space-y-3 ml-13">
                      <SupportedFeature label="Transaction Control" supported={true} />
                      <SupportedFeature label="Coin Selection" supported={true} />
                      <SupportedFeature label="UTXO Management" supported={true} />
                      <SupportedFeature label="Multiple Hardware Wallets" supported={true} />
                      <SupportedFeature label="Online Access" supported={true} />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
        
        {/* Features Section */}
        <section className="py-20 px-6 bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 rounded-3xl mx-6 my-12">
          <div className="max-w-screen-xl mx-auto">
            <div className="text-center mb-16">
              <h2 className="font-heading text-3xl font-bold mb-4">Features For Power Users</h2>
              <p className="text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
                Sparrow Wallet gives you complete control over your bitcoin with advanced features now accessible from anywhere.
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              <AssetCard 
                icon={<Globe className="h-6 w-6" />} 
                title="Web Access" 
                description="Use Sparrow from any browser, anywhere in the world" 
                color="indigo" 
              />
              <AssetCard 
                icon={<Coins className="h-6 w-6" />} 
                title="UTXO Control" 
                description="Full control over your unspent transaction outputs" 
                color="purple" 
              />
              <AssetCard 
                icon={<Shield className="h-6 w-6" />} 
                title="Self-Custody" 
                description="Your keys, your coins - you maintain control" 
                color="blue" 
              />
              <AssetCard 
                icon={<Wallet className="h-6 w-6" />} 
                title="Multiple Wallets" 
                description="Manage multiple wallets for different purposes" 
                color="teal" 
              />
            </div>
          </div>
        </section>
        
        {/* Privacy & Security Section */}
        <section className="py-20 px-6 bg-white dark:bg-wallet-card my-12 rounded-3xl mx-6">
          <div className="max-w-screen-xl mx-auto">
            <div className="text-center mb-16">
              <h2 className="font-heading text-3xl font-bold mb-4">Privacy & Security Focus</h2>
              <p className="text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
                Sparrow Wallet is designed with your privacy and security as the top priority.
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              <FeatureCard 
                icon={<Shield className="h-6 w-6" />} 
                title="Self-Custody" 
                description="Sparrow gives you full control of your bitcoin. Your keys never leave your device." 
              />
              <FeatureCard 
                icon={<Eye className="h-6 w-6" />} 
                title="Privacy-focused" 
                description="Connect to your own node for maximum privacy, or use public electrum servers." 
              />
              <FeatureCard 
                icon={<Globe className="h-6 w-6" />} 
                title="Open Source" 
                description="All code is open source and available for review by the community." 
              />
              <FeatureCard 
                icon={<Users className="h-6 w-6" />} 
                title="Coin Control" 
                description="Advanced coin selection allows you to maintain privacy with UTXO management." 
              />
              <FeatureCard 
                icon={<Smartphone className="h-6 w-6" />} 
                title="Hardware Support" 
                description="Works with major hardware wallets for enhanced security." 
              />
              <FeatureCard 
                icon={<Sparkles className="h-6 w-6" />} 
                title="Online Access" 
                description="Now available online with the same powerful features as the desktop app." 
              />
            </div>
          </div>
        </section>
      </div>
      
      <RegistrationModal
        isOpen={showRegistrationModal}
        onClose={() => setShowRegistrationModal(false)}
        onRegister={handleRegister}
        isLoading={isLoading}
      />
      
      <SuccessModal
        isOpen={showSuccessModal}
        onClose={handleSuccessModalClose}
      />
      
      <Footer />
    </div>
  );
};

export default LandingPage;
