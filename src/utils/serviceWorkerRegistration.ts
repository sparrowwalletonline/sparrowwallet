
export function registerServiceWorker() {
  if ('serviceWorker' in navigator) {
    // Wait until window is loaded to register service worker
    // This helps ensure page renders on iOS Safari first
    window.addEventListener('load', () => {
      // Use a timeout to defer service worker registration
      // This ensures the page has a chance to render first
      setTimeout(() => {
        navigator.serviceWorker.register('/service-worker.js')
          .then(registration => {
            console.log('ServiceWorker registration successful with scope: ', registration.scope);
          })
          .catch(error => {
            console.log('ServiceWorker registration failed: ', error);
          });
      }, 500); // 500ms delay to prioritize page rendering
    });
  }
}

