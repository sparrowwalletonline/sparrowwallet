import React, { useState, useEffect } from 'react';
import { WalletProvider, useWallet } from '@/contexts/WalletContext';
import LandingPage from './LandingPage';
import GenerateWallet from './GenerateWallet';
import WalletView from './WalletView';
import WalletChoice from './WalletChoice';
import PassPhrase from './PassPhrase';

// Wrapper component to handle view switching
const WalletApp: React.FC = () => {
  const { hasWallet, seedPhrase } = useWallet();
  const [currentView, setCurrentView] = useState<string>('');
  const [previousView, setPreviousView] = useState<string>('');
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [slideDirection, setSlideDirection] = useState<'right' | 'left'>('right');

  // Determine which view to show
  const showLandingPage = seedPhrase.length === 0;
  const showWalletChoice = seedPhrase.length === 1; // Special case for our flow
  const showPassPhrase = seedPhrase.length === 2; // New state for PassPhrase page
  const showCreateWallet = !hasWallet && seedPhrase.length > 2;
  
  useEffect(() => {
    // Determine the current view based on state
    let newView = '';
    if (showLandingPage) newView = 'landing';
    else if (showWalletChoice) newView = 'choice';
    else if (showPassPhrase) newView = 'passphrase';
    else if (showCreateWallet) newView = 'create';
    else if (hasWallet) newView = 'wallet';

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
      } else if (currentView === 'create' && newView === 'wallet') {
        setSlideDirection('right');
      } else if (currentView === 'wallet' && newView === 'landing') {
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
      if (previousView === 'wallet') return <WalletView />;
    }

    // After transition, show the current view
    if (currentView === 'landing') return <LandingPage />;
    if (currentView === 'choice') return <WalletChoice />;
    if (currentView === 'passphrase') return <PassPhrase />;
    if (currentView === 'create') return <GenerateWallet />;
    if (currentView === 'wallet') return <WalletView />;
    
    // Fallback
    return <LandingPage />;
  };

  return <div className={getTransitionClass()}>{renderView()}</div>;
};

// Main component with provider
const Index: React.FC = () => {
  return (
    <div className="min-h-screen bg-wallet-darkBg flex justify-center w-full">
      <WalletProvider>
        <WalletApp />
      </WalletProvider>
    </div>
  );
};

export default Index;
