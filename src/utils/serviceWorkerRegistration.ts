export function registerServiceWorker() {
  if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
      // Add a timestamp query parameter to force cache invalidation
      const swUrl = `/service-worker.js?v=${new Date().getTime()}`;
      
      // Keep track of when we last showed an update notification
      const lastUpdatePrompt = localStorage.getItem('lastUpdatePrompt');
      const currentTime = new Date().getTime();
      const showUpdatePrompt = !lastUpdatePrompt || 
        (currentTime - parseInt(lastUpdatePrompt, 10)) > (24 * 60 * 60 * 1000); // Only show once per day
      
      navigator.serviceWorker.register(swUrl)
        .then(registration => {
          console.log('ServiceWorker registration successful with scope: ', registration.scope);
          
          // Check for updates less frequently (every 3 hours)
          setInterval(() => {
            registration.update();
            console.log('Checking for service worker updates...');
          }, 3 * 60 * 60 * 1000); // Check every 3 hours
          
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
                    
                    // Only show update prompt if we haven't shown one recently
                    if (showUpdatePrompt) {
                      // Update the timestamp for when we last showed a prompt
                      localStorage.setItem('lastUpdatePrompt', currentTime.toString());
                      
                      // Use a more subtle notification approach instead of window.confirm
                      // Add a subtle visual indicator that an update is available
                      const updateBanner = document.createElement('div');
                      updateBanner.id = 'update-banner';
                      updateBanner.style.cssText = 'position: fixed; bottom: 20px; right: 20px; background: #0500FF; color: white; padding: 12px 20px; border-radius: 12px; box-shadow: 0 4px 12px rgba(0,0,0,0.15); z-index: 10000; display: flex; align-items: center; justify-content: space-between; max-width: 300px;';
                      updateBanner.innerHTML = `
                        <div>New version available!</div>
                        <button id="update-now" style="background: white; color: #0500FF; border: none; border-radius: 6px; padding: 6px 12px; margin-left: 12px; cursor: pointer;">Update</button>
                      `;
                      document.body.appendChild(updateBanner);
                      
                      document.getElementById('update-now')?.addEventListener('click', () => {
                        window.location.reload();
                      });
                      
                      // Auto-dismiss after 10 seconds
                      setTimeout(() => {
                        const banner = document.getElementById('update-banner');
                        if (banner) {
                          banner.style.opacity = '0';
                          banner.style.transition = 'opacity 0.5s ease';
                          setTimeout(() => banner.remove(), 500);
                        }
                      }, 10000);
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
        console.log('Active service worker found');
        
        // Only force skip waiting if it's a first-time visit in this session
        const hasVisitedThisSession = sessionStorage.getItem('hasVisitedThisSession');
        if (!hasVisitedThisSession) {
          sessionStorage.setItem('hasVisitedThisSession', 'true');
          navigator.serviceWorker.controller.postMessage({ type: 'SKIP_WAITING' });
        }
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
