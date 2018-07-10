console.log ("localControl is awake");

var dbPromise = idb.open ('restaurant-db', 1, function (upgradeDb) {
    const store = upgradeDb.createObjectStore('restaurant-store');
    store.createIndex('by-neighborhood', 'neighborhood');
    store.createIndex('by-cuisine', 'cuisine_type');
});

dbPromise.then (function(db) {
    var tx = db.transaction('restaurant-store', 'readwrite');
    var restaurantStore = tx.objectStore('restaurant-store');

    // need to define restaurantData (variable for data) -- get from JSON
    restaurantData.forEach (function (restaurant) {
        restaurantStore.add(something); // one of these for each key val pair
        
    });
});