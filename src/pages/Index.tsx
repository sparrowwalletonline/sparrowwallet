
import React, { useEffect } from 'react';
import LandingPage from './LandingPage';

const Index: React.FC = () => {
  useEffect(() => {
    // Force all elements to be visible
    const style = document.createElement('style');
    style.innerHTML = `
      * {
        opacity: 1 !important;
        visibility: visible !important;
        display: revert !important;
      }
    `;
    document.head.appendChild(style);
    
    return () => {
      document.head.removeChild(style);
    };
  }, []);

  return (
    <div className="w-full min-h-screen flex flex-col" style={{ opacity: 1, visibility: 'visible' }}>
      <LandingPage />
    </div>
  );
};

export default Index;
