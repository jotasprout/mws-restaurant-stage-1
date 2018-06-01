// Installs the service worker and stores stuff in the cache
self.addEventListener('install', function(event) {
    event.waitUntil(
        // stores stuff in the cache
        caches.open('restaurant').then(function(cache) {
            return cache.addAll([
                './',
                'js/',
                // How come it only makes the folders but doesn't store their contents?
                'img/',
                // 'restaurant.html',
                'CSS/styles.css',
                'data/restaurants.json'
            ]);
        })
    )
});
