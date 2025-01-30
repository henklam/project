self.addEventListener('install', (event) => {
    event.waitUntil(
      caches.open('my-cache').then((cache) => {
        return cache.addAll([
          '/',
          '/index.html', // Add the full URL if necessary
          '/app.html',
          '/app.js',
          '/index.js',
          '/style.css', // Add any other assets you want to cache, such as stylesheets
          '/images/your-image.jpg', // Example for caching images
        ]);
      })
    );
  });
  
  self.addEventListener('fetch', (event) => {
    event.respondWith(
      caches.match(event.request).then((cachedResponse) => {
        // If there is a cached response, return it. Otherwise, fetch from network.
        return cachedResponse || fetch(event.request);
      })
    );
  });
  