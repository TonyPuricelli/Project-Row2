
// Display restaurant Info
// function displayRestaurantInfo() {
// ***************************
// GLOBAL VARIABLE DECLARATION
var georesults;
var latitude;
var longitude;

// ***************************
// Initialize Firebase
var config = {
  apiKey: "AIzaSyA7G2xyyMsQpQ22H3YEq7Nv5MVuiGamad8",
  authDomain: "dinner-and-a-movie-200002.firebaseapp.com",
  databaseURL: "https://dinner-and-a-movie-200002.firebaseio.com",
  projectId: "dinner-and-a-movie-200002",
  storageBucket: "",
  messagingSenderId: "814272938765"
};
firebase.initializeApp(config);

var database = firebase.database();
// ***************************

console.log("****** Button Clicked ******");

var zipCode = localStorage.getItem("zipcode")
console.log("*** Zip Code for Geolocation Calulation: " + zipCode);
// console.log("Zip Code: " + zipCode);
var queryURL = "https://maps.googleapis.com/maps/api/geocode/json?address=" + zipCode + "&key=AIzaSyD2nn48mhiIlV_nDEM-7OTtVwU22wOQa5Y"

$.ajax({
  url: queryURL,
  method: "GET"
}).then(function (response) {
  georesults = response;
  console.log("Lat: " + georesults.results[0].geometry.location.lat);
  console.log("Long: " + georesults.results[0].geometry.location.lng);
  latitude = georesults.results[0].geometry.location.lat;
  longitude = georesults.results[0].geometry.location.lng;
  googlePlacesCall()

});
function googlePlacesCall() {
  // var restaurantURL = "https://maps.googleapis.com/maps/api/place/textsearch/json?query=chicago+restaurant&key=AIzaSyCMv62EJ-6UqQEJhfSK1H2VFhle3CRnC-Q";
  var restaurantURL = "https://maps.googleapis.com/maps/api/place/nearbysearch/json?location=" + latitude + "," + longitude + "&radius=5000&type=restaurant&key=AIzaSyCMv62EJ-6UqQEJhfSK1H2VFhle3CRnC-Q";
  // var restaurantURL = "https://maps.googleapis.com/maps/api/place/nearbysearch/json?location=  41.8403395    ,    -87.6137011  &radius=5000&type=restaurant&key=AIzaSyCMv62EJ-6UqQEJhfSK1H2VFhle3CRnC-Q";
// Photo referece API call https://maps.googleapis.com/maps/api/place/photo?maxwidth=200&key=AIzaSyCMv62EJ-6UqQEJhfSK1H2VFhle3CRnC-Q&photoreference=
  $.ajax({
    url: restaurantURL,
    method: "GET"
  }).then(function (response) {

    var restresults = response;
    console.log(response);
    console.log("Array Length: " + response.results.length);

    for (var i = 0; i < response.results.length; i++) {
      console.log("Getting Restaurant "+i);
      // Create a DIV to hold each of our restaurants and its description
      var restDisplayDiv = $("<div>").addClass("restDIV").addClass("card").attr("style", "width: 18rem");

      var cardIMG = $("<img>").addClass("card-img-top").attr("src", "../dinner-and-a-movie/assets/css/restaurant.jpg");

      // Create a variable to hold each restaurant name 
      var restName = response.results[i].name;
      console.log("Restaurant Name: " + restName);

      //var photoReference = response.results[i].photos[0].photo_reference;
      
      // Create an inner DIV for each Restaurant title and description to utilize the card component from Bootstrap
      var innerRestDiv = $("<div>").addClass("card-body").attr("id", restName);

      // Display the restaurant name in each individual DIV
      var nameDisplay = $("<h5>").text(restName).addClass("restName").addClass("card-title");

      // Create a variable to hold each Restaurant description

      var restOpen = response.results[i].opening_hours.open_now;
      console.log("Open: " + restOpen);
      var priceLevel = response.results[i].price_level;
      console.log("Price Level: " + priceLevel);
      var rating = response.results[i].rating;
      console.log("Rating: " + rating);


      // Display the Restaurant description in each individual DIV
      if (restOpen) {
        var openDisplay = $("<h6>").text("Open").addClass("openDisplay").addClass("card-title");
      }
      else { var openDisplay = $("<h6>").text("Closed").addClass("openDisplay").addClass("card-title"); }
      var priceDisplay = $("<h6>").text("Price Level: " + priceLevel).addClass("priceDisplay").addClass("card-title");
      var ratingDisplay = $("<h6>").text("Google Rating: " + rating).addClass("ratingDisplay").addClass("card-title");

      // Add the restaurant name and other info to the individual DIV
      restDisplayDiv.append(cardIMG);
      innerRestDiv.append(nameDisplay, priceDisplay, ratingDisplay)
      innerRestDiv.append(openDisplay);

      restDisplayDiv.append(innerRestDiv);

      // Add all the restaurants to an existing DIV on the apge called nearbyRestaurants
      // $("#restaurant-appear-here").prepend(restDisplayDiv);
      $("#nearbyRestaurants").prepend(restDisplayDiv);
      // googlePhotos(photoReference);

     

    }

  });
}

// ADDING RESTAURANT PICTURE
function googlePhotos(reference){
  var photoURL= "https://maps.googleapis.com/maps/api/place/photo?maxwidth=200&key=AIzaSyCMv62EJ-6UqQEJhfSK1H2VFhle3CRnC-Q&photoreference="+reference;
  $.ajax({
    url: photoURL,
    method: "GET"
  }).then(function (response) {
    var photoResults = response;
    console.log("Photo reference: "+ reference);
    $("#nearbyRestaurants").html('<img src="photoResults" alt="Photo reference">');
})
};


