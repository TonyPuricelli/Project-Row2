// ***************************
// GLOBAL VARIABLE DECLARATION
var movieData;
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

// ****** LOCAL STORAGE ******** 
function saveData(userDate, userZipCode, movieTitle, theaterName, movieTime) {
    // Clear absolutely everything stored in localStorage using localStorage.clear()
    localStorage.clear();

    // Store the zipcode into localStorage using "localStorage.setItem"
    localStorage.setItem("zipcode", userZipCode);
    console.log("Local Storage ZipCode: " + localStorage.getItem("zipcode"));

    // Creates local "temporary" object for holding Dinner * Movie data
    var movieDinner = {
        date: userDate,
        zipCode: userZipCode,
        title: movieTitle,
        theater: theaterName,
        time: movieTime,
    };

    // Uploads movie & dinner data to the database
    database.ref().push(movieDinner);

    // Logs everything to console
    console.log("Firebase Push date: " + movieDinner.date);
    console.log("Firebase Push ZipeCode: " + movieDinner.zipCode);
    // Added info to Firebase
    console.log("Dinner & Movie Info successfully added");
};
// **** END OF LOCAL STORAGE CODE ***********

//Validating the user inputs from the form
function inputValidation(zip, userDate) {
    $("#errorTextZip").empty();
    $("#errorTextDate").empty();
    $("#movieTitles").empty();
    $("headerDiv").empty();
    var numberOfDigits = Math.floor(Math.log(zip) / Math.LN10 + 1)
    // if ((userDate >= moment().format("YYYY-MM-DD")) && ((zip > 10000) && (zip < 99999))) {
    if ((userDate >= moment().format("YYYY-MM-DD")) && ((zip > 0) && (numberOfDigits==5))) {
        console.log("*********** Input Correct ******");
        console.log("Number of digits: "+numberOfDigits);
        return true;
    }
    else {
        // if ((zip < 10000) || (zip > 99999)) {
        if ((zip <= 0) || (numberOfDigits!=5)) {
            console.log("Input Validation-->Wrong Zip: " + zip);
            console.log("Number of digits: "+numberOfDigits);
            $("#errorTextZip").append("Enter a valid zip code with 5 Digits (ex. 60647)")
        }
        if ((userDate < moment().format("YYYY-MM-DD"))) {
            console.log("Input validation --> Wrong Date: " + userDate);
            $("#errorTextDate").append("Enter a valid date (mm/dd/yyyy). Dates before today are not available.")
        }
        return false;
    }
}

//To display all the movies after the user submits their info
function submitUserInfo() {

    $("#submitButton").on("click", function () {
        event.preventDefault();

        var userDate = $("#movieDate").val();
        var userZipCode = $("#zipCode").val();
        var movieTitle = "";
        var theaterName = "";
        var movieTime = "";
        console.log("This is the user entered date: " + userDate);
        console.log("This is the user entered zip: " + userZipCode);

        if (inputValidation(userZipCode, userDate)) {
            // Calling SaveData() to store info in Firebase
            saveData(userDate, userZipCode, movieTitle, theaterName, movieTime);

            // Empty the fields when the submit button is clicked
            $("#movieDate").val("");
            $("#zipCode").val("");

            // Create variables to hold the information needed to submit the API call
            var apiKey = "gkd947dfsy5spd8zcruwcwa6";
            //var apiKey = "bdz8ugfm9xze9x33zqwf3zxt";
            var movieDate = userDate;
            var zipCode = userZipCode;
            var queryURL = "https://data.tmsapi.com/v1.1/movies/showings?startDate=" + movieDate + "&zip=" + zipCode + "&imageSize=Sm&imageText=true&api_key=" + apiKey;
            console.log(queryURL);

            // Make an AJAX call to the movie API to get data back
            $.ajax({
                url: queryURL,
                method: "GET"
            }).then(function (response) {

                var headerDIVTitle = $("<h3>").text("Movies Playing Near You").addClass("text-center");

                $("#headerDIV").prepend(headerDIVTitle);

                // Store the JSON response in a variable
                movieData = response;
                console.dir(movieData);

                // Looping over the results in the JSON object...
                for (var i = 0; i < movieData.length; i++) {

                    // Create a DIV to hold each of our movie titles and its description
                    var movieDisplayDiv = $("<div>").addClass("movieDIV").addClass("card").attr("style", "width: 16rem");

                    var cardIMG = $("<img>").addClass("card-img-top").attr("src", "../dinner-and-a-movie/assets/css/popcorn.jpg");

                    // Create a variable to hold each movie title
                    var movieTitle = [];
                    movieTitle = movieData[i].title;
                    console.log(movieTitle);

                    var movieID = [];
                    movieID = movieData[i].tmsId;
                    console.log(movieID);

                    // Create an inner DIV for each movie title and description to utilize the card component from Bootstrap
                    var innerMovieDiv = $("<div>").addClass("card-body");

                    // Display the movie title in each individual DIV
                    var titleDisplay = $("<h5>").text(movieTitle).addClass("card-title movieTitle").attr("id", movieID);

                    // Create a variable to hold each movie description
                    var movieDescr = movieData[i].shortDescription;

                    // Display the movie description in each individual DIV
                    var descrDisplay = $("<h6>").text(movieDescr).addClass("movieDescr").addClass("card-title");

                    // Add the movie title and the description to the individual DIV
                    movieDisplayDiv.append(cardIMG);
                    
                    innerMovieDiv.append(titleDisplay, descrDisplay)

                    movieDisplayDiv.append(innerMovieDiv);

                    // Add all the movies to an existing DIV on the apge called movieTitles
                    $("#movieTitles").append(movieDisplayDiv);
                }
            });
        }
    });
};

// Call the function
submitUserInfo();

//To display the movie showtimes after a user clicks on the movie title
$(document).on("click touchstart", "h5", function () {
    // Using 'this', create a variable that grabs the movie ID in the id attribute for the specific movie title that the user has clicked on.
    var movieID = $(this).attr("id");
    console.log(movieID);

    // Create a variable that returns the index number of the movie that matches that movie ID that was clicked. We can use this index number to plug into the for loop to only loop through that movie's showtimes.
    var selectedMovie = movieData.findIndex(function (movie) {
        return movie.tmsId === movieID;
    });
    console.log("This is the selected movie's index: " + selectedMovie);

    // Create an empty array that will hold a list of generated objects containing each movie theatre and showtime.
    var movieTheatres = [];
    var theatreNames = [];

    // Loop through all the movie showtimes of the array that we have selected to get the theatres names by using the index number generated above
    for (var i = 0; i < movieData[selectedMovie].showtimes.length; i++) {
        // Create a variable to hold each of the theatre names for each showtime in the array
        var theatreName = movieData[selectedMovie].showtimes[i].theatre.name;
        //console.log("Here's the theatre name: " + theatreName);

        // Create an if statement using the indexOf method that will create a new array to hold all the theatre names. A theatre name will only be pushed to the array if that theatre name is not present ( == -1).
        if (theatreNames.indexOf(theatreName) < 0) {
            theatreNames.push(theatreName);
        }
    }

    console.log("All movie theatres  for this particular movie: ", theatreNames);

    // Loop through the theatreName array to get all showtimes and put them in a new object with each theatre
    for (var i = 0; i < theatreNames.length; i++) {
        // Create a new variable that will use the filter function to create a new array to hold all of the movie showtimes by theatre
        var showtimes = movieData[selectedMovie].showtimes.filter(function (showtime) {
            //console.log("DATA", showtime);
            return showtime.theatre.name == theatreNames[i];
        });
        // Push an object containing 2 properties: name (containing the name) and times (blank array that will hold the showtimes that will be generated by the next for loop)
        movieTheatres.push({ name: theatreNames[i], times: [] });
        //console.log("Showtime: ", showtimes);
        // Loop through the showtimes array and push all the showtimes into the empty 'times' property in the object in the movieTheatre array
        for (j = 0; j < showtimes.length; j++) {
            //console.log("Showtimes: " , showtimes[j]);
            movieTheatres[i].times.push(showtimes[j].dateTime);
        }
    }
    console.log(movieTheatres)

    //When the user clicks a movie title, grab all the theatres and the corresponding show times and display that in a new div within the movie title div
    for (let i = 0; i < movieTheatres.length; i++) {
        var showtimesDIV = $("<div>").addClass("showtimesDIV");
        //console.log("DIV " + showtimesDIV);

        var theatre = movieTheatres[i].name;
        console.log("Theatre " + theatre);

        var movieTimes = movieTheatres[i].times.map(function (element) {
            return moment(element).format('h:mm A');
        });
        console.log("Movie times" + movieTimes);

        showtimesDIV.append("<strong>" + theatre + "</strong>" + "<br>" + movieTimes.join(", ") + "<hr>");

        $(this).parent().append(showtimesDIV);
    }

    var restaurantPage = $("<button>").addClass("btn btn-dark hvr-underline-from-center dinnerButton").attr("type", "button").html('<a href="./index_restaurant.html">Want to go to Dinner?</a>');

    $(this).parent().append(restaurantPage);

});