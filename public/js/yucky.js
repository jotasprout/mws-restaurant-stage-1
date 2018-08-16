const reviewForm = document.getElementById('reviewForm').addEventListener('submit', submitData);

function submitData (event) {

    event.preventDefault();

    let restaurant_id = restid;
    let name = document.getElementById('name').value;
    let rating = document.getElementById('rating').value;
    let comments = document.getElementById('comments').value;

    const reviewContent = {
        restaurant_id,
        name,
        rating,
        comments
    };

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
    .then((data) => console.log(data))
    .catch((err) => console.log (err));

};

/*
*/

  