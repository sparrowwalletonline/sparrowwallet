
/**
 * Fix for iOS Safari's 100vh issue
 * This sets a CSS variable that can be used instead of 100vh
 */

export const applyViewportFix = (): void => {
  // First we get the viewport height and we multiply it by 1% to get a value for a vh unit
  const vh = window.innerHeight * 0.01;
  // Then we set the value in the --vh custom property to the root of the document
  document.documentElement.style.setProperty('--vh', `${vh}px`);
  
  // We listen to the resize event to update the value when the window is resized
  window.addEventListener('resize', () => {
    // Same calculation again
    const vh = window.innerHeight * 0.01;
    document.documentElement.style.setProperty('--vh', `${vh}px`);
  });
  
  // Also update on orientation change which is especially important on iOS
  window.addEventListener('orientationchange', () => {
    // Small timeout to ensure the browser has completed any UI updates
    setTimeout(() => {
      const vh = window.innerHeight * 0.01;
      document.documentElement.style.setProperty('--vh', `${vh}px`);
    }, 100);
  });
};
