
import React from 'react';
import LandingPage from './LandingPage';

const Index: React.FC = () => {
  // Force render with key to ensure component re-renders properly
  return <LandingPage key="main-landing-page" />;
};

export default Index;
