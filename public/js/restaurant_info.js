let restaurant;
var map;

/**
 * Initialize map as soon as the page is loaded.
 */
document.addEventListener('DOMContentLoaded', (event) => {  
  initMap();
});

/**
 * Initialize leaflet map
 */
initMap = () => {
  fetchRestaurantFromURL((error, restaurant) => {
    if (error) { // Got an error!
      console.error(error);
    } else {      
      self.newMap = L.map('map', {
        center: [restaurant.latlng.lat, restaurant.latlng.lng],
        zoom: 16,
        scrollWheelZoom: false
      });
      L.tileLayer('https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.jpg70?access_token={mapboxToken}', {
        mapboxToken: 'pk.eyJ1Ijoiam90YXNwcm91dCIsImEiOiJjamoyOHV5Z2EwemR1M3FvZ3Fmajl2N2loIn0.srfd-ekJk1drEoaZMm0Gdw',
        maxZoom: 18,
        attribution: 'Map data &copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors, ' +
          '<a href="https://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, ' +
          'Imagery © <a href="https://www.mapbox.com/">Mapbox</a>',
        id: 'mapbox.streets'    
      }).addTo(newMap);
      // fillBreadcrumb();
      DBHelper.mapMarkerForRestaurant(self.restaurant, self.newMap);
    }
  });
}  

/**
 * Get current restaurant from page URL.
 */
fetchRestaurantFromURL = (callback) => {
  if (self.restaurant) { // restaurant already fetched!
    callback(null, self.restaurant)
    return;
  }
  const id = getParameterByName('id');
  if (!id) { // no id found in URL
    error = 'No restaurant id in URL'
    callback(error, null);
  } else {
    DBHelper.fetchRestaurantById(id, (error, restaurant) => {
      self.restaurant = restaurant;
      if (!restaurant) {
        console.error(error);
        return;
      }
      
      fillRestaurantHTML();
      callback(null, restaurant)
    });
  }
}

/* Create restaurant HTML and add it to the webpage */
fillRestaurantHTML = (restaurant = self.restaurant) => {
  const name = document.getElementById('restaurant-name');
  name.innerHTML = restaurant.name;

  // heart favorite
  const heart = document.getElementById('heart');
  const stateOfHeart = restaurant.is_favorite;
  if (stateOfHeart == false) {
    heart.setAttribute('class', 'fas fa-heart whiteQueen');
  } else {
    heart.setAttribute('class', 'fas fa-heart redQueen');
  }

  const address = document.getElementById('restaurant-address');
  address.innerHTML = restaurant.address;

  const image = document.getElementById('restaurant-img');
  image.className = 'restaurant-img'
  image.alt = DBHelper.altTextForRestaurantImage(restaurant);
  image.src = DBHelper.imageUrlForRestaurant(restaurant);

  // fill operating hours
  if (restaurant.operating_hours) {
    fillRestaurantHoursHTML();
  }

  const restid = parseInt(restaurant.id, 10);

  const hiddenField = document.getElementById('restaurant_id');
  hiddenField.setAttribute('value', restid);

  const reviewForm = document.getElementById('reviewForm').addEventListener('submit', submitData);

  function submitData (event) {

      event.preventDefault();

      // let restaurant_id = restid;
      let restaurant_id = document.getElementById('restaurant_id').value;
      let name = document.getElementById('name').value;
      let rating = document.getElementById('rating').value;
      let comments = document.getElementById('comments').value;

      const reviewContent = {
          restaurant_id,
          name,
          rating,
          comments
      };
	  
    // console.log(reviewContent.restaurant_id);
    // above broke it

      const reviewOptions = {
          method: 'POST',
          body: JSON.stringify(reviewContent),
          headers: {
            'Content-Type': 'application/json'
          }
      };

      const url = 'http://localhost:1337/reviews/';

      fetch(url, reviewOptions)
      .then((res) => console.log(res.json()))
      .catch((err) => console.log (err));

  }; // end of submitData
	
/*  */

  // get reviews for this restaurant
  DBHelper.fetchReviewsByRestaurant(restid, (error, reviews) => {

    if (error) {
      console.error(error);
    } else {
      fillReviewsHTML(reviews);
    }
  });
  
} // end of fillRestaurantHTML

/* Create all reviews HTML and add them to the webpage.*/
const fillReviewsHTML = (reviews = self.reviews) => {
  const container = document.getElementById('reviews-container');

  const title = document.createElement('h3');
  title.innerHTML = 'Reviews';
  container.appendChild(title);

  if (!reviews) {
    const noReviews = document.createElement('p');
    noReviews.innerHTML = 'No reviews yet!';
    container.appendChild(noReviews);
    return;
  }

  // button to review restaurant
  const writeReview = document.createElement('p');
  const actionCall = document.createElement('a');
  actionCall.innerHTML = 'Write a Review';
  writeReview.appendChild(actionCall);
  container.appendChild(writeReview);

  const ul = document.getElementById('reviews-list');
  reviews.forEach(review => {
    console.log(review);
    ul.appendChild(createReviewHTML(review));
  });
  container.appendChild(ul);
}

/**
 * Create review HTML and add it to the webpage.
 */
createReviewHTML = (review) => {
  const li = document.createElement('li');

  const reviewtop = document.createElement('div');
  reviewtop.className = 'review-top';
  li.appendChild(reviewtop);

  const name = document.createElement('div');
  name.className = 'review-name';
  name.innerHTML = review.name;
  reviewtop.appendChild(name);

  const date = document.createElement('div');
  date.className = 'review-date';
  date.innerHTML = review.createdAt;
  reviewtop.appendChild(date);

  const rating = document.createElement('div');
  rating.className = 'review-rating';
  rating.innerHTML = `Rating: ${review.rating}`;
  li.appendChild(rating);

  const comments = document.createElement('div');
  comments.className = 'review-comments';
  comments.innerHTML = review.comments;
  li.appendChild(comments);

  return li;
}

/* Create restaurant operating hours HTML table and add it to the webpage. */
fillRestaurantHoursHTML = (operatingHours = self.restaurant.operating_hours) => {
  const hours = document.getElementById('restaurant-hours');
  for (let key in operatingHours) {
    const row = document.createElement('tr');

    const day = document.createElement('td');
    day.innerHTML = key;
    row.appendChild(day);

    const time = document.createElement('td');
    time.innerHTML = operatingHours[key];
    row.appendChild(time);

    hours.appendChild(row);
  }
}

/* Create restaurant operating hours HTML table and add it to the webpage. */
fillWriteReviewHTML = (operatingHours = self.restaurant.operating_hours) => {
  const hours = document.getElementById('restaurant-hours');
  for (let key in operatingHours) {
    const row = document.createElement('tr');

    const day = document.createElement('td');
    day.innerHTML = key;
    row.appendChild(day);

    const time = document.createElement('td');
    time.innerHTML = operatingHours[key];
    row.appendChild(time);

    hours.appendChild(row);
  }
}

/* Get a parameter by name from page URL. */
getParameterByName = (name, url) => {
  if (!url)
    url = window.location.href;
  name = name.replace(/[\[\]]/g, '\\$&');
  const regex = new RegExp(`[?&]${name}(=([^&#]*)|&|#|$)`),
    results = regex.exec(url);
  if (!results)
    return null;
  if (!results[2])
    return '';
  return decodeURIComponent(results[2].replace(/\+/g, ' '));
}

const heart = document.getElementById("heart");
heart.onclick = changeOfHeart;

function changeOfHeart () {
  // const heart = document.getElementById("heart");
  const currentClass = heart.getAttribute("class");
  if (currentClass == 'fas fa-heart whiteQueen') {
    heart.setAttribute('class', 'fas fa-heart redQueen');
  } else {
    heart.setAttribute('class', 'fas fa-heart whiteQueen');
  }
}