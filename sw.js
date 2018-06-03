const restImgCache = 'rest-img';

self.addEventListener('install', function(event) {
    event.waitUntil(
        // stores stuff in the cache
        caches.open('restaurant').then(function(cache) {
            return cache.addAll([
                './',
                'js/dbhelper.js',
                'js/main.js',
                'js/restaurant_info.js',
                'restaurant.html',
                'CSS/styles.css',
                'data/restaurants.json'
            ]);
        })
    )
});

self.addEventListener('fetch', function(event) {
    let requestUrl = new URL(event.request.url);
    if (requestUrl.pathname.startsWith('/img/')) {
        event.respondWith(showImg(event.request));
        return;
    }
    event.respondWith(
        caches.match(event.request).then(function(response) {
            if (response) {
                return response;
            }
            return fetch(event.request);
        })
    );
});

function showImg(request) {
    let localImgName = request.url.replace(/-\d+px\.jpg$/, '');

    return caches.open(restImgCache).then(function(cache) {
        return cache.match(localImgName).then(function(response) {
            if (response) {
                return response;
            }
            return fetch(request).then(function(networkResponse) {
                cache.put(localImgName, networkResponse.clone());
                return networkResponse;
            });
        });
    });
}