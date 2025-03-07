
export function registerServiceWorker() {
  if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
      // Add a timestamp query parameter to force cache invalidation
      const swUrl = `/service-worker.js?v=${new Date().getTime()}`;
      
      navigator.serviceWorker.register(swUrl)
        .then(registration => {
          console.log('ServiceWorker registration successful with scope: ', registration.scope);
          
          // Check for updates periodically
          setInterval(() => {
            registration.update();
            console.log('Checking for service worker updates...');
          }, 60 * 60 * 1000); // Check every hour
          
          // Handle updates when found
          registration.onupdatefound = () => {
            const installingWorker = registration.installing;
            if (installingWorker) {
              installingWorker.onstatechange = () => {
                if (installingWorker.state === 'installed') {
                  if (navigator.serviceWorker.controller) {
                    // At this point, the updated precached content has been fetched,
                    // but the previous service worker will still serve the older content
                    console.log('New content is available; please refresh.');
                    
                    // Optional: Notify user about the update
                    if (window.confirm('New version available! Reload to update?')) {
                      window.location.reload();
                    }
                  } else {
                    // At this point, everything has been precached.
                    console.log('Content is cached for offline use.');
                  }
                }
              };
            }
          };
        })
        .catch(error => {
          console.log('ServiceWorker registration failed: ', error);
        });
      
      // If we already have a service worker, check for updates
      if (navigator.serviceWorker.controller) {
        console.log('Active service worker found, skipping installation');
        navigator.serviceWorker.controller.postMessage({ type: 'SKIP_WAITING' });
      }
    });
  }
}

// Helper function to clear all caches
export function clearAllCaches() {
  if ('caches' in window) {
    caches.keys().then(cacheNames => {
      cacheNames.forEach(cacheName => {
        caches.delete(cacheName);
        console.log(`Cache ${cacheName} deleted`);
      });
    });
  }
}
