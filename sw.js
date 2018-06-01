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
