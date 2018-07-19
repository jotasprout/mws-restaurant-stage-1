const restImgCache = 'rest-img';
const restCache = 'restaurant';

self.addEventListener('install', function(event) {
    event.waitUntil(
        caches.open(restCache).then(function(cache) {
            return cache.addAll([
                './',
                'index.html',
                'favicon.ico',
                'js/idb.js',
                'js/dbhelper.js',
                'js/main.js',
                'js/restaurant_info.js',
                'restaurant.html',
                'css/styles.css',
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

    if (requestUrl.pathname === '/') {
        event.respondWith(caches.match('./'));
        return;
    }
    /*   
    */
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