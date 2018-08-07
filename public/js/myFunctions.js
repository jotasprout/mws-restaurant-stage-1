class DBHelper {

  static fetchReviews(callback) {
    let dataSource;
    dataSource = DBHelper.DATABASE_URL;

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
          return response.json();
        })
        .then(function(reviews) {
          // put reviews from server into local db
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

}