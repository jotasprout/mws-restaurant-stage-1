console.log ("localControl is awake");

var dbPromise = idb.open ('restaurant-db', 1, function (upgradeDb) {
    const store = upgradeDb.createObjectStore('restaurant-store');
    store.createIndex('by-neighborhood', 'neighborhood');
    store.createIndex('by-cuisine', 'cuisine_type');
});

dbPromise.then (function(db) {
    var tx = db.transaction('restaurant-store', 'readwrite');
    var restaurantStore = tx.objectStore('restaurant-store');
    DBHelper.fetchRestaurants((error, restaurants) => {
      if (error) {
        callback(error, null);
      } else {
        restaurants.forEach (function (restaurant) {
          restaurantStore.add(restaurant.name); // one of these for each key val pair
          restaurantStore.add(restaurant.cuisine_type);   
          restaurantStore.add(restaurant.neighborhood);     
        });
      }
    });
});

// use below as a model then delete
/*
static fetchRestaurantById(id, callback) {
    // fetch all restaurants with proper error handling.
    DBHelper.fetchRestaurants((error, restaurants) => {
      if (error) {
        callback(error, null);
      } else {
        const restaurant = restaurants.find(r => r.id == id);
        if (restaurant) { // Got the restaurant
          callback(null, restaurant);
        } else { // Restaurant does not exist in the database
          callback('Restaurant does not exist', null);
        }
      }
    });
  }
  */