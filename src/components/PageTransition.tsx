
import React, { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';

interface PageTransitionProps {
  children: React.ReactNode;
}

const PageTransition: React.FC<PageTransitionProps> = ({ children }) => {
  const location = useLocation();
  const [displayLocation, setDisplayLocation] = useState(location);

  useEffect(() => {
    if (location !== displayLocation) {
      setDisplayLocation(location);
    }
  }, [location, displayLocation]);

  const variants = {
    initial: {
      opacity: 0,
      y: 8,
      scale: 0.99
    },
    in: {
      opacity: 1,
      y: 0,
      scale: 1,
      transition: {
        duration: 0.25,
        ease: [0.33, 1, 0.68, 1] // Cubic bezier for smoother animation
      }
    },
    out: {
      opacity: 0,
      y: -8,
      scale: 0.99,
      transition: {
        duration: 0.15,
        ease: [0.33, 1, 0.68, 1]
      }
    }
  };

  return (
    <AnimatePresence mode="wait" initial={false}>
      <motion.div
        key={location.pathname}
        initial="initial"
        animate="in"
        exit="out"
        variants={variants}
        className="min-h-screen w-full"
      >
        {children}
      </motion.div>
    </AnimatePresence>
  );
};

export default PageTransition;
