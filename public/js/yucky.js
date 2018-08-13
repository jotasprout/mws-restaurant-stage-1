const reviewForm = documents.getElementById('reviewForm');

reviewForm.addEventListener('submit', function(event) {

    // next few lines prolly not needed
    // replace with below functions & shizzle
    const formData = new FormData();
    for (var i=0; i < reviewForm.length; i++) {
        formData.append(reviewForm[i].name, reviewForm[i].value);
    }

});

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
}

const url = 'http://localhost:1337/reviews/';

const responsePromise = fetch(url, reviewOptions);

responsePromise
    .then(res => res.json())
    .then(res => console.log(res));

event.preventDefault();    