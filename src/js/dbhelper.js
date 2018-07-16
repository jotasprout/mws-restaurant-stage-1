/* Common database helper functions */

class DBHelper {

  /* Database URL */
  static get DATABASE_URL() {
    const port = 1337; // Change this to your server port
    // return `http://localhost:${port}/data/restaurants.json`;
    return `http://localhost:${port}/restaurants`;
  };

  /* NEW Fetch all restaurants. */
  
  static fetchRestaurants(callback) {
    let dataSource;
    dataSource = DBHelper.DATABASE_URL;

    /* Creates local db, object store, and indexes for sorting */
    const dbPromise = idb.open ('restaurant-db', 1, function (upgradeDb) {
      const store = upgradeDb.createObjectStore('restaurant-store', {
        keyPath: 'id'
      });
      store.createIndex('by-neighborhood', 'neighborhood');
      store.createIndex('by-cuisine', 'cuisine_type');
    });

    dbPromise.then (function(db) {
      var tx = db.transaction('restaurant-store', 'readwrite');
      var res = tx.objectStore('restaurant-store');
      return res.getAll();
    }).then(function(restaurants) {
      // if any restaurants are returned from local db call them back
      if (restaurants.length !==0){
        callback(null, restaurants);
      } else {
        // if no restaurants were returned from local db fetch restaurants from server
        fetch (`${DBHelper.DATABASE_URL}`)
        .then(function(response) {
          return response.json();
        })
        .then(function(restaurants) {
          // put restaurants from server into local db
          dbPromise.then(function(db){
            var tx = db.transaction('restaurant-store', 'readwrite');
            var res = tx.objectStore('restaurant-store');
            restaurants.forEach(
              restaurant => res.put(restaurant)
            ); 
            callback(null, restaurants);
            return tx.complete; 
          });
          // commenting out next line and moving it before 'return tx.complete' above
          // callback(null, restaurants);

          });
      }
    }).then(function(){
        console.log("added restaurants");
      }).catch(function(error){
        console.log(error);
      }); // end of dbPromise.then       

  } // end of fetchRestaurants

  /* Fetch a restaurant by its ID */

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

    /* Fetch restaurants by a cuisine type with proper error handling. */
  static fetchRestaurantByCuisine(cuisine, callback) {
    // Fetch all restaurants  with proper error handling
    DBHelper.fetchRestaurants((error, restaurants) => {
      if (error) {
        callback(error, null);
      } else {
        // Filter restaurants to have only given cuisine type
        const results = restaurants.filter(r => r.cuisine_type == cuisine);
        callback(null, results);
      }
    });
  }

  /* Fetch restaurants by a neighborhood with proper error handling. */
  static fetchRestaurantByNeighborhood(neighborhood, callback) {
    // Fetch all restaurants
    DBHelper.fetchRestaurants((error, restaurants) => {
      if (error) {
        callback(error, null);
      } else {
        // Filter restaurants to have only given neighborhood
        const results = restaurants.filter(r => r.neighborhood == neighborhood);
        callback(null, results);
      }
    });
  }

  /* Fetch restaurants by a cuisine and a neighborhood with proper error handling. */
  static fetchRestaurantByCuisineAndNeighborhood(cuisine, neighborhood, callback) {
    // Fetch all restaurants
    DBHelper.fetchRestaurants((error, restaurants) => {
      if (error) {
        callback(error, null);
      } else {
        let results = restaurants
        if (cuisine != 'all') { // filter by cuisine
          results = results.filter(r => r.cuisine_type == cuisine);
        }
        if (neighborhood != 'all') { // filter by neighborhood
          results = results.filter(r => r.neighborhood == neighborhood);
        }
        callback(null, results);
      }
    });
  }

  /* Fetch all neighborhoods with proper error handling. */
  static fetchNeighborhoods(callback) {
    // Fetch all restaurants
    DBHelper.fetchRestaurants((error, restaurants) => {
      if (error) {
        callback(error, null);
      } else {
        // Get all neighborhoods from all restaurants
        const neighborhoods = restaurants.map((v, i) => restaurants[i].neighborhood)
        // Remove duplicates from neighborhoods
        const uniqueNeighborhoods = neighborhoods.filter((v, i) => neighborhoods.indexOf(v) == i)
        callback(null, uniqueNeighborhoods);
      }
    });
  }

  /* Fetch all cuisines with proper error handling. */
  static fetchCuisines(callback) {
    // Fetch all restaurants
    DBHelper.fetchRestaurants((error, restaurants) => {
      if (error) {
        callback(error, null);
      } else {
        // Get all cuisines from all restaurants
        const cuisines = restaurants.map((v, i) => restaurants[i].cuisine_type)
        // Remove duplicates from cuisines
        const uniqueCuisines = cuisines.filter((v, i) => cuisines.indexOf(v) == i)
        callback(null, uniqueCuisines);
      }
    });
  }

  /* Restaurant page URL */
  static urlForRestaurant(restaurant) {
    return (`./restaurant.html?id=${restaurant.id}`);
  }

  /**
   * Restaurant image URL.
   * http://localhost:1337/restaurants/{3}
   * Watch last part of video if you get stuck
   */
  static imageUrlForRestaurant(restaurant) {
    if (restaurant.photograph) {
      return (`/img/${restaurant.photograph}` + '.jpg');
    } else {
      return ('http://localhost:8000/img/404.jpg');
    }
  }

  /**
   * Alt-text for restaurant image
   */
  static altTextForRestaurantImage(restaurant) {
    return (`${restaurant.photodesc}`);
  }

/**
   * Map marker for a restaurant.
   */
  static mapMarkerForRestaurant(restaurant, map) {
    // https://leafletjs.com/reference-1.3.0.html#marker  
    const marker = new L.marker([restaurant.latlng.lat, restaurant.latlng.lng],
      {title: restaurant.name,
      alt: restaurant.name,
      url: DBHelper.urlForRestaurant(restaurant)
      })
      marker.addTo(newMap);
    return marker;
  } 
  /* static mapMarkerForRestaurant(restaurant, map) {
    const marker = new google.maps.Marker({
      position: restaurant.latlng,
      title: restaurant.name,
      url: DBHelper.urlForRestaurant(restaurant),
      map: map,
      animation: google.maps.Animation.DROP}
    );
    return marker;
  } */

}
