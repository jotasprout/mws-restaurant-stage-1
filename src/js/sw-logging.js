// Feedback for me
// Stole the idea from Jake Archibald but writing on my own

if (!navigator.serviceWorker.controller) {
    console.log("No serviceWorker controls this page");
}
else {
    console.log("Your awesome serviceWorker controls this page");
}