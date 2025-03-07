
import React, { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { useTutorial } from '@/contexts/TutorialContext';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowRight, ArrowLeft, X, HelpCircle } from 'lucide-react';

type Position = {
  top?: number;
  left?: number;
  right?: number;
  bottom?: number;
  transform?: string;
};

const TutorialPopover: React.FC = () => {
  const { 
    activeTutorial, 
    currentStepIndex, 
    isVisible, 
    nextStep, 
    prevStep, 
    closeTutorial 
  } = useTutorial();
  const [position, setPosition] = useState<Position>({});
  const [viewportWidth, setViewportWidth] = useState(window.innerWidth);

  useEffect(() => {
    // Update viewport width on resize
    const handleResize = () => {
      setViewportWidth(window.innerWidth);
    };
    
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  useEffect(() => {
    if (!activeTutorial || !isVisible) return;

    const currentStep = activeTutorial.steps[currentStepIndex];
    const targetElement = document.querySelector(currentStep.targetElement);

    if (targetElement) {
      const rect = targetElement.getBoundingClientRect();
      const newPosition: Position = {};
      const isMobile = viewportWidth < 640;

      // For mobile, we use simplified positioning
      if (isMobile) {
        // On mobile, default to bottom positioning for most elements
        if (rect.top < window.innerHeight / 2) {
          // Element is in the top half of the screen, place popover below
          newPosition.top = rect.bottom + 10;
          newPosition.left = 16; // Left margin
          newPosition.right = 16; // Right margin
          newPosition.transform = 'none';
        } else {
          // Element is in the bottom half, place popover above
          newPosition.bottom = window.innerHeight - rect.top + 10;
          newPosition.left = 16;
          newPosition.right = 16;
          newPosition.transform = 'none';
        }
      } else {
        // Desktop positioning logic (unchanged)
        switch (currentStep.position) {
          case 'top':
            newPosition.bottom = window.innerHeight - rect.top + 10;
            newPosition.left = rect.left + rect.width / 2;
            newPosition.transform = 'translateX(-50%)';
            break;
          case 'right':
            newPosition.left = rect.right + 10;
            newPosition.top = rect.top + rect.height / 2;
            newPosition.transform = 'translateY(-50%)';
            break;
          case 'bottom':
            newPosition.top = rect.bottom + 10;
            newPosition.left = rect.left + rect.width / 2;
            newPosition.transform = 'translateX(-50%)';
            break;
          case 'left':
            newPosition.right = window.innerWidth - rect.left + 10;
            newPosition.top = rect.top + rect.height / 2;
            newPosition.transform = 'translateY(-50%)';
            break;
        }
      }

      setPosition(newPosition);

      // Add highlight to target element
      targetElement.classList.add('tutorial-highlight');
      
      return () => {
        targetElement.classList.remove('tutorial-highlight');
      };
    }
  }, [activeTutorial, currentStepIndex, isVisible, viewportWidth]);

  if (!activeTutorial || !isVisible) return null;

  const currentStep = activeTutorial.steps[currentStepIndex];
  const isFirstStep = currentStepIndex === 0;
  const isLastStep = currentStepIndex === activeTutorial.steps.length - 1;
  const isMobile = viewportWidth < 640;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.9 }}
        transition={{ duration: 0.2 }}
        className="fixed z-[9600] bg-white dark:bg-gray-800 p-4 rounded-xl shadow-lg w-full max-w-xs border border-gray-200 dark:border-gray-700"
        style={{
          ...position,
          maxWidth: isMobile ? 'calc(100% - 32px)' : '20rem' // Adjust width for mobile
        }}
      >
        {!isMobile && (
          <div className="absolute w-full h-full inset-0 -z-10">
            <div 
              className="absolute w-3 h-3 bg-white dark:bg-gray-800 transform rotate-45 border border-gray-200 dark:border-gray-700"
              style={{
                ...(currentStep.position === 'bottom' ? { top: '-6px', left: 'calc(50% - 6px)' } :
                  currentStep.position === 'top' ? { bottom: '-6px', left: 'calc(50% - 6px)' } :
                  currentStep.position === 'left' ? { right: '-6px', top: 'calc(50% - 6px)' } :
                  { left: '-6px', top: 'calc(50% - 6px)' })
              }}
            />
          </div>
        )}
        
        <div className="flex justify-between items-center mb-2">
          <div className="bg-blue-100 dark:bg-blue-900 p-1 rounded-full">
            <HelpCircle className="h-4 w-4 text-blue-600 dark:text-blue-400" />
          </div>
          <button
            onClick={closeTutorial}
            className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300 p-1"
            aria-label="Close tutorial"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
        
        <h3 className="font-medium text-lg mb-1">{currentStep.title}</h3>
        <p className="text-gray-600 dark:text-gray-300 text-sm mb-4">{currentStep.description}</p>
        
        <div className="flex justify-between items-center">
          <div className="text-xs text-gray-500 dark:text-gray-400">
            {currentStepIndex + 1} of {activeTutorial.steps.length}
          </div>
          <div className="flex space-x-2">
            {!isFirstStep && (
              <Button 
                variant="outline" 
                size="sm" 
                onClick={prevStep}
                className="text-xs py-1 h-8 touch-manipulation"
              >
                <ArrowLeft className="h-3 w-3 mr-1" /> Back
              </Button>
            )}
            <Button 
              size="sm" 
              onClick={nextStep} 
              className="text-xs py-1 h-8 bg-blue-600 hover:bg-blue-700 touch-manipulation"
            >
              {isLastStep ? 'Finish' : 'Next'} {!isLastStep && <ArrowRight className="h-3 w-3 ml-1" />}
            </Button>
          </div>
        </div>
      </motion.div>
    </AnimatePresence>
  );
};

export default TutorialPopover;
