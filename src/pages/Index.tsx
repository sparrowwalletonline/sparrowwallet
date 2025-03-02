
import React, { useState, useEffect } from 'react';
import { WalletProvider, useWallet } from '@/contexts/WalletContext';
import { MenuProvider } from '@/contexts/MenuContext';
import LandingPage from './LandingPage';
import GenerateWallet from './GenerateWallet';
import WalletChoice from './WalletChoice';
import PassPhrase from './PassPhrase';
import { supabase } from '@/integrations/supabase/client';
import { useNavigate } from 'react-router-dom';

// Wrapper component to handle view switching
const WalletApp: React.FC = () => {
  const { hasWallet, seedPhrase } = useWallet();
  const [currentView, setCurrentView] = useState<string>('');
  const [previousView, setPreviousView] = useState<string>('');
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [slideDirection, setSlideDirection] = useState<'right' | 'left'>('right');
  const [session, setSession] = useState(null);
  const navigate = useNavigate();

  // Check for authentication
  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
    });

    return () => subscription.unsubscribe();
  }, []);

  // Log current state for debugging
  useEffect(() => {
    console.log("Current state in Index:", { 
      hasWallet, 
      seedPhraseLength: seedPhrase.length, 
      currentView,
      isAuthenticated: !!session
    });

    // If user has a wallet, redirect to the dedicated wallet page
    if (hasWallet && seedPhrase.length > 2 && !currentView) {
      navigate('/wallet');
      return;
    }
  }, [hasWallet, seedPhrase, currentView, session, navigate]);

  // Determine which view to show
  const showLandingPage = !session || seedPhrase.length === 0;
  const showWalletChoice = session && seedPhrase.length === 1; // Special case for our flow
  const showPassPhrase = session && seedPhrase.length === 2; // New state for PassPhrase page
  const showCreateWallet = session && !hasWallet && seedPhrase.length > 2;
  
  useEffect(() => {
    // Determine the current view based on state
    let newView = '';
    if (showLandingPage) newView = 'landing';
    else if (showWalletChoice) newView = 'choice';
    else if (showPassPhrase) newView = 'passphrase';
    else if (showCreateWallet) newView = 'create';

    console.log("Determined view:", newView);

    // Only change direction if view actually changes
    if (newView !== currentView && currentView !== '') {
      // Set slide direction based on view flow
      if (currentView === 'landing' && newView === 'choice') {
        setSlideDirection('right');
      } else if (currentView === 'choice' && newView === 'landing') {
        setSlideDirection('left');
      } else if (currentView === 'choice' && newView === 'passphrase') {
        setSlideDirection('right');
      } else if (currentView === 'passphrase' && newView === 'choice') {
        setSlideDirection('left');
      } else if (currentView === 'passphrase' && newView === 'create') {
        setSlideDirection('right');
      } else if (currentView === 'create' && newView === 'passphrase') {
        setSlideDirection('left');
      }

      setPreviousView(currentView);
      setIsTransitioning(true);
      
      // After a delay, update to the new view
      const timer = setTimeout(() => {
        setCurrentView(newView);
        setIsTransitioning(false);
      }, 800); // Match transition duration in CSS
      
      return () => clearTimeout(timer);
    } else if (currentView === '') {
      // Initial load, no transition
      setCurrentView(newView);
    }
  }, [showLandingPage, showWalletChoice, showPassPhrase, showCreateWallet, hasWallet, currentView]);
  
  const getTransitionClass = () => {
    const baseClass = "w-full max-w-md mx-auto min-h-screen shadow-lg bg-wallet-darkBg overflow-hidden transition-effect";
    
    if (isTransitioning) {
      return slideDirection === 'right' 
        ? `${baseClass} slide-out-left` 
        : `${baseClass} slide-out-right`;
    }
    
    return `${baseClass} slide-in`;
  };

  // Determine which view to render
  const renderView = () => {
    // During transition, show the previous view
    if (isTransitioning) {
      if (previousView === 'landing') return <LandingPage />;
      if (previousView === 'choice') return <WalletChoice />;
      if (previousView === 'passphrase') return <PassPhrase />;
      if (previousView === 'create') return <GenerateWallet />;
    }

    // After transition, show the current view
    if (currentView === 'landing') return <LandingPage />;
    if (currentView === 'choice') return <WalletChoice />;
    if (currentView === 'passphrase') return <PassPhrase />;
    if (currentView === 'create') return <GenerateWallet />;
    
    // Fallback
    return <LandingPage />;
  };

  return <div className={getTransitionClass()}>{renderView()}</div>;
};

// Main component with provider
const Index: React.FC = () => {
  return (
    <div className="min-h-screen bg-wallet-darkBg flex justify-center w-full">
      <MenuProvider>
        <WalletProvider>
          <WalletApp />
        </WalletProvider>
      </MenuProvider>
    </div>
  );
};

export default Index;
