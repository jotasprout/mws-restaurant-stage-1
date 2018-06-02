self.addEventListener('install', function(event) {
    event.waitUntil(
        // stores stuff in the cache
        caches.open('restaurant').then(function(cache) {
            return cache.addAll([
                './',
                'index.html',
                'js/dbhelper.js',
                'js/main.js',
                'js/restaurant_info.js',
                'img/',
                'restaurant.html',
                'CSS/styles.css',
                'data/restaurants.json'
            ]);
        })
    )
});


self.addEventListener('fetch', function(event) {
    event.respondWith(
        caches.match(event.request).then(function(response) {
            if (response) {
                return response;
            }
            return fetch(event.request);
        })
    );
});