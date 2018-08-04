class DBHelper {

/* Database URL */
  static get DATABASE_URL() {
    const port = 1337; // Change this to your server port
    return `http://localhost:${port}/restaurants`;
  };


  static fetchReviews(callback) {
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

          });
      }
    }).then(function(){
        console.log("added restaurants");
      }).catch(function(error){
        console.log(error);
      }); // end of dbPromise.then       

  } // end of fetchRestaurants

}