
// Display restaurant Info
// function displayRestaurantInfo() {
// ***************************
// GLOBAL VARIABLE DECLARATION
var georesults;
var latitude;
var longitude;
// ***************************

$("#add-zip").on("click", function (event) {
  event.preventDefault();
  $("#geolocation-appear-here").empty();
  $("#restaurant-appear-here").empty();
  console.log("****** Button Clicked ******");

  var zipCode = $("#zipcode-input").val();
  $("#zipcode-input").val("");
  console.log("Zip Code: " + zipCode);
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
    $("#geolocation-appear-here").html("Latitude: " + latitude + " Longitude: " + longitude);
    googlePlacesCall();
    // $("#geolocation-appear-here").text(JSON.stringify(georesults));
  });


  function googlePlacesCall() {
    // var restaurantURL = "https://maps.googleapis.com/maps/api/place/textsearch/json?query=chicago+restaurant&key=AIzaSyCMv62EJ-6UqQEJhfSK1H2VFhle3CRnC-Q";
    var restaurantURL = "https://maps.googleapis.com/maps/api/place/nearbysearch/json?location=" + latitude + "," + longitude + "&radius=5000&type=restaurant&key=AIzaSyCMv62EJ-6UqQEJhfSK1H2VFhle3CRnC-Q";
    // var restaurantURL = "https://maps.googleapis.com/maps/api/place/nearbysearch/json?location=  41.8403395    ,    -87.6137011  &radius=5000&type=restaurant&key=AIzaSyCMv62EJ-6UqQEJhfSK1H2VFhle3CRnC-Q";

    $.ajax({
      url: restaurantURL,
      method: "GET"
    }).then(function (response) {

      var restresults = response;
      console.log(response);
      console.log("Array Length: " + response.results.length);

      // $("#movie-view").html(JSON.stringify(response,"",4));
      // $("#restaurant-appear-here").html(JSON.stringify(response,"",4));

      for (var i = 0; i < response.results.length; i++) {
        console.log("GOING FOR IT");



        // $("#restaurant-appear-here").append("Restaurant Name: "+restName);
        // $("#restaurant-appear-here").append("Open: "+restOpen);
        // $("#restaurant-appear-here").append("Price Level: "+priceLevel);
        // $("#restaurant-appear-here").append("Rating: "+rating);

        // Create a DIV to hold each of our restaurants and its description
        var restDisplayDiv = $("<div>").addClass("restDIV").addClass("card").attr("style", "width: 18rem");

        // Create a variable to hold each restaurant name 
        var restName = response.results[i].name;
        console.log("Restaurant Name: " + restName);

        // Create an inner DIV for each Restaurant title and description to utilize the card component from Bootstrap
        var innerRestDiv = $("<div>").addClass("card-body").attr("id", restName);

        // Display the movie title in each individual DIV
        var nameDisplay = $("<h5>").text("Restaurant Name: " + restName).addClass("restName").addClass("card-title");

        // Create a variable to hold each Restaurant description
        // var movieDescr = response[i].shortDescription;

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

        // Add the movie title and the description to the individual DIV
        innerRestDiv.append(nameDisplay, openDisplay, priceDisplay, ratingDisplay)

        restDisplayDiv.append(innerRestDiv);

        // Add all the movies to an existing DIV on the apge called movieTitles
        $("#restaurant-appear-here").prepend(restDisplayDiv);
        // $("#nearbyRestaurants").prepend(restDisplayDiv);
      }
    });
  }
});

  // $(document).on("click", "#add-zip", displayRestaurantInfo);

