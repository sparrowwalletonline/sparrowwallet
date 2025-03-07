
export function registerServiceWorker() {
  if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
      const swUrl = '/service-worker.js';
      
      // Check if the service worker can be found
      fetch(swUrl)
        .then(response => {
          // Ensure service worker exists
          if (response.status === 404) {
            console.log('Service worker not found. Skipping registration.');
            return;
          }
          
          navigator.serviceWorker.register(swUrl)
            .then(registration => {
              console.log('ServiceWorker registration successful with scope: ', registration.scope);
            })
            .catch(error => {
              console.log('ServiceWorker registration failed: ', error);
            });
        })
        .catch(() => {
          console.log('No internet connection found. App is running in offline mode.');
        });
    });
  }
}

// Add function to unregister service worker if needed
export function unregisterServiceWorker() {
  if ('serviceWorker' in navigator) {
    navigator.serviceWorker.ready
      .then(registration => {
        registration.unregister();
      })
      .catch(error => {
        console.error(error.message);
      });
  }
}
