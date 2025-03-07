
/**
 * Fix for iOS Safari's 100vh issue and general mobile viewport handling
 * This sets CSS variables that can be used instead of 100vh
 */

export const applyViewportFix = (): void => {
  // First we get the viewport height and we multiply it by 1% to get a value for a vh unit
  const vh = window.innerHeight * 0.01;
  // Then we set the value in the --vh custom property to the root of the document
  document.documentElement.style.setProperty('--vh', `${vh}px`);
  
  // iOS Safari specific fix for -webkit-fill-available
  document.documentElement.style.setProperty('--webkit-fill-available-height', `${window.innerHeight}px`);
  
  // Force an initial paint/layout to ensure everything renders correctly
  document.body.style.opacity = '0.99';
  setTimeout(() => {
    document.body.style.opacity = '1';
  }, 10);
  
  // We listen to the resize event to update the value when the window is resized
  window.addEventListener('resize', () => {
    // Same calculation again
    const vh = window.innerHeight * 0.01;
    document.documentElement.style.setProperty('--vh', `${vh}px`);
    document.documentElement.style.setProperty('--webkit-fill-available-height', `${window.innerHeight}px`);
    
    // Force repaint on resize too
    document.body.style.opacity = '0.99';
    setTimeout(() => {
      document.body.style.opacity = '1';
    }, 10);
  });
  
  // Also update on orientation change which is especially important on iOS
  window.addEventListener('orientationchange', () => {
    // Small timeout to ensure the browser has completed any UI updates
    setTimeout(() => {
      const vh = window.innerHeight * 0.01;
      document.documentElement.style.setProperty('--vh', `${vh}px`);
      document.documentElement.style.setProperty('--webkit-fill-available-height', `${window.innerHeight}px`);
      
      // Force repaint on orientation change
      document.body.style.opacity = '0.99';
      setTimeout(() => {
        document.body.style.opacity = '1';
      }, 10);
    }, 100);
  });
  
  // Safari on iOS sometimes needs a forced redraw to render correctly
  // Use a more TypeScript-friendly way to detect iOS Safari
  const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent) && 
                !(window as any).MSStream; // Type assertion for compatibility
  
  if (isIOS) {
    // Apply a minimal transform to force a repaint
    document.body.style.transform = 'translateZ(0)';
    document.body.style.webkitTransform = 'translateZ(0)';
    
    // Ensure the root div has appropriate height and display properties
    const rootElement = document.getElementById('root');
    if (rootElement) {
      rootElement.style.minHeight = '100vh';
      rootElement.style.minHeight = 'calc(var(--vh, 1vh) * 100)';
      rootElement.style.display = 'flex';
      rootElement.style.flexDirection = 'column';
      rootElement.style.height = '100%';
      rootElement.style.width = '100%';
      
      // Force hardware acceleration
      rootElement.style.transform = 'translateZ(0)';
      rootElement.style.webkitTransform = 'translateZ(0)';
      rootElement.style.backfaceVisibility = 'hidden';
      rootElement.style.webkitBackfaceVisibility = 'hidden';
    }
  }
};
