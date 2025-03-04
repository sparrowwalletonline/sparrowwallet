
import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useTutorial } from '@/contexts/TutorialContext';

const TutorialOverlay: React.FC = () => {
  const { activeTutorial, currentStepIndex, isVisible } = useTutorial();
  const [highlightBox, setHighlightBox] = useState<DOMRect | null>(null);

  useEffect(() => {
    if (!activeTutorial || !isVisible) return;

    const currentStep = activeTutorial.steps[currentStepIndex];
    const targetElement = document.querySelector(currentStep.targetElement);

    if (targetElement) {
      const updateHighlight = () => {
        const rect = targetElement.getBoundingClientRect();
        setHighlightBox(rect);
      };

      updateHighlight();
      
      // Update on resize or scroll
      window.addEventListener('resize', updateHighlight);
      window.addEventListener('scroll', updateHighlight);

      return () => {
        window.removeEventListener('resize', updateHighlight);
        window.removeEventListener('scroll', updateHighlight);
      };
    } else {
      setHighlightBox(null);
    }
  }, [activeTutorial, currentStepIndex, isVisible]);

  if (!activeTutorial || !isVisible || !highlightBox) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-40 pointer-events-none"
        style={{ backgroundColor: 'rgba(0, 0, 0, 0.5)' }}
      >
        <svg width="100%" height="100%" className="absolute inset-0">
          <defs>
            <mask id="tutorial-mask">
              <rect width="100%" height="100%" fill="white" />
              <rect 
                x={highlightBox.left} 
                y={highlightBox.top} 
                width={highlightBox.width} 
                height={highlightBox.height} 
                fill="black"
                rx="4"
                ry="4"
              />
            </mask>
          </defs>
          <rect 
            width="100%" 
            height="100%" 
            fill="rgba(0, 0, 0, 0.5)" 
            mask="url(#tutorial-mask)" 
          />
          <rect 
            x={highlightBox.left - 2} 
            y={highlightBox.top - 2} 
            width={highlightBox.width + 4} 
            height={highlightBox.height + 4} 
            fill="none"
            stroke="#3B82F6"
            strokeWidth="2"
            rx="4"
            ry="4"
            className="pulse-animation"
          />
        </svg>
      </motion.div>
    </AnimatePresence>
  );
};

export default TutorialOverlay;
