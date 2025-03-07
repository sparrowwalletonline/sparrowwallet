
import React, { createContext, useContext, useState, useEffect } from 'react';
import { useWallet } from './WalletContext';
import { useLocation } from 'react-router-dom';

type TutorialStep = {
  id: string;
  title: string;
  description: string;
  targetElement: string;
  position: 'top' | 'right' | 'bottom' | 'left';
};

type TutorialType = {
  id: string;
  name: string;
  steps: TutorialStep[];
};

type TutorialContextType = {
  activeTutorial: TutorialType | null;
  currentStepIndex: number;
  isVisible: boolean;
  hasCompletedTutorials: string[];
  startTutorial: (tutorialId: string) => void;
  nextStep: () => void;
  prevStep: () => void;
  closeTutorial: () => void;
  completeTutorial: () => void;
};

const defaultContext: TutorialContextType = {
  activeTutorial: null,
  currentStepIndex: 0,
  isVisible: false,
  hasCompletedTutorials: [],
  startTutorial: () => {},
  nextStep: () => {},
  prevStep: () => {},
  closeTutorial: () => {},
  completeTutorial: () => {},
};

const TutorialContext = createContext<TutorialContextType>(defaultContext);

// Predefined tutorials
const tutorials: Record<string, TutorialType> = {
  walletIntro: {
    id: 'walletIntro',
    name: 'Wallet Introduction',
    steps: [
      {
        id: 'welcome',
        title: 'Welcome to Your Wallet',
        description: 'This tutorial will guide you through the main features of your wallet.',
        targetElement: '.wallet-header',
        position: 'bottom',
      },
      {
        id: 'balance',
        title: 'Your Balance',
        description: 'Here you can see your total balance across all cryptocurrencies.',
        targetElement: '.wallet-balance',
        position: 'bottom',
      },
      {
        id: 'assets',
        title: 'Your Assets',
        description: 'This section shows all your cryptocurrencies and their current values.',
        targetElement: '.wallet-assets',
        position: 'top',
      },
      {
        id: 'actions',
        title: 'Quick Actions',
        description: 'Use these buttons to send, receive, or buy cryptocurrencies.',
        targetElement: '.wallet-actions',
        position: 'top',
      }
    ],
  },
  sendCrypto: {
    id: 'sendCrypto',
    name: 'Sending Crypto',
    steps: [
      {
        id: 'select-send',
        title: 'Start a Transfer',
        description: 'Click the Send button to start a cryptocurrency transfer.',
        targetElement: '.send-button',
        position: 'top',
      },
      {
        id: 'enter-address',
        title: 'Enter Recipient Address',
        description: "Enter the recipient's wallet address here. Double-check it's correct!",
        targetElement: '.recipient-field',
        position: 'bottom',
      },
      {
        id: 'enter-amount',
        title: 'Enter Amount',
        description: 'Enter the amount you want to send.',
        targetElement: '.amount-field',
        position: 'bottom',
      },
      {
        id: 'confirm-send',
        title: 'Confirm Transaction',
        description: 'Review the details and confirm your transaction.',
        targetElement: '.confirm-button',
        position: 'top',
      }
    ],
  }
};

export const TutorialProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [activeTutorial, setActiveTutorial] = useState<TutorialType | null>(null);
  const [currentStepIndex, setCurrentStepIndex] = useState<number>(0);
  const [isVisible, setIsVisible] = useState<boolean>(false);
  const [hasCompletedTutorials, setHasCompletedTutorials] = useState<string[]>(() => {
    const saved = localStorage.getItem('completedTutorials');
    return saved ? JSON.parse(saved) : [];
  });
  const { hasWallet } = useWallet();
  const location = useLocation();

  // Save completed tutorials
  useEffect(() => {
    localStorage.setItem('completedTutorials', JSON.stringify(hasCompletedTutorials));
  }, [hasCompletedTutorials]);

  // Auto-start wallet tutorial for new users on wallet page
  useEffect(() => {
    if (
      hasWallet && 
      location.pathname === '/wallet' && 
      !hasCompletedTutorials.includes('walletIntro') && 
      !activeTutorial
    ) {
      // Wait a bit to let UI render
      const timer = setTimeout(() => {
        startTutorial('walletIntro');
      }, 1500);
      
      return () => clearTimeout(timer);
    }
  }, [hasWallet, location.pathname, hasCompletedTutorials, activeTutorial]);

  const startTutorial = (tutorialId: string) => {
    const tutorial = tutorials[tutorialId];
    if (tutorial) {
      setActiveTutorial(tutorial);
      setCurrentStepIndex(0);
      setIsVisible(true);
    }
  };

  const nextStep = () => {
    if (activeTutorial && currentStepIndex < activeTutorial.steps.length - 1) {
      setCurrentStepIndex(prev => prev + 1);
    } else {
      completeTutorial();
    }
  };

  const prevStep = () => {
    if (currentStepIndex > 0) {
      setCurrentStepIndex(prev => prev - 1);
    }
  };

  const closeTutorial = () => {
    setActiveTutorial(null);
    setIsVisible(false);
  };

  const completeTutorial = () => {
    if (activeTutorial && !hasCompletedTutorials.includes(activeTutorial.id)) {
      setHasCompletedTutorials(prev => [...prev, activeTutorial.id]);
    }
    closeTutorial();
  };

  return (
    <TutorialContext.Provider
      value={{
        activeTutorial,
        currentStepIndex,
        isVisible,
        hasCompletedTutorials,
        startTutorial,
        nextStep,
        prevStep,
        closeTutorial,
        completeTutorial,
      }}
    >
      {children}
    </TutorialContext.Provider>
  );
};

export const useTutorial = () => useContext(TutorialContext);
