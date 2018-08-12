/* Common database helper functions */

class DBHelper {

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
        fetch (`http://localhost:1337/restaurants`)
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

  /* Restaurant image URL */
  static imageUrlForRestaurant(restaurant) {
    if (restaurant.photograph) {
      return (`/img/${restaurant.photograph}` + '.jpg');
    } else {
      return ('http://localhost:8000/img/404.jpg');
    }
  }

  /* Alt-text for restaurant image */
  static altTextForRestaurantImage(restaurant) {
    return (`${restaurant.photodesc}`);
  }

/* Map marker for a restaurant */
  static mapMarkerForRestaurant(restaurant, map) { 
    const marker = new L.marker([restaurant.latlng.lat, restaurant.latlng.lng],
      {title: restaurant.name,
      alt: restaurant.name,
      url: DBHelper.urlForRestaurant(restaurant)
      })
      marker.addTo(newMap);
    return marker;
  } 

  static fetchReviews(callback) {

    /* Creates local db, object store, and indexes for sorting */
    const dbPromise = idb.open ('review-db', 1, function (upgradeDb) {
      const store = upgradeDb.createObjectStore('review-store', {
        keyPath: 'id'
      });
      store.createIndex('by-restaurant', 'restaurant');
    });

    dbPromise.then (function(db) {
      var tx = db.transaction('review-store', 'readwrite');
      var res = tx.objectStore('review-store');
      return res.getAll();
    }).then(function(reviews) {
      // if any reviews are returned from local db call them back
      if (reviews.length !==0){
        callback(null, reviews);
      } else {
        // if no reviews were returned from local db fetch reviews from server
        fetch (`http://localhost:1337/reviews/`)
        .then(function(response) {
          // const snot = response.json();
          // console.log(snot);
          return response.json();
          
        })
        .then(function(reviews) {
          // put reviews from server into local db
          // console.log(reviews);
          // the above works
          dbPromise.then(function(db){
            var tx = db.transaction('review-store', 'readwrite');
            var res = tx.objectStore('review-store');
            reviews.forEach(
              review => res.put(review)
            ); 
            callback(null, reviews);
            return tx.complete; 
          });
        });
      }
    }).then(function(){
        console.log("added reviews");
      }).catch(function(error){
        console.log(error);
      }); // end of dbPromise.then       
  } // end of fetchReviews

  static fetchReviewsByRestaurant(restid, callback) {
    console.log(restid);
    // Fetch all reviews with proper error handling
    DBHelper.fetchReviews((error, reviews) => {
      // console.log(reviews);
      // the above works
      if (error) {
        callback(error, null);
      } else {
        // Filter reviews for only one restaurant
        let results = reviews.filter(r => r.restaurant_id == restid);       
        callback(null, results);
      }
    });
  } 



}
