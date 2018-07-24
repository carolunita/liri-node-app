require("dotenv").config();
var Twitter = require("twitter");
var Spotify = require("node-spotify-api");
var keys = require("./keys");
var request = require("request");
var fs = require("fs");

// Initialize the spotify API client
var spotify = new Spotify({
    id: keys.spotify.id,
    secret: keys.spotify.secret
});

var getArtistName = function(artist) {
  return artist.name;
};

// Function for running a Spotify search
var getSpotify = function(songName) {
  if (songName === undefined) {
    songName = "What About Us";
  }

  spotify.search(
    {
      type: "track",
      query: songName
    },
    function(err, data) {
      if (err) {
        console.log("Error occurred: " + err);
        return;
      }

      var songs = data.tracks.items;

      for (var i = 0; i < songs.length; i++) {
        console.log(i);
        console.log("Artist(s): " + songs[i].artists.map(getArtistName));
        console.log("Song Name: " + songs[i].name);
        console.log("Preview Song: " + songs[i].preview_url);
        console.log("Album: " + songs[i].album.name);
        console.log("-----------------------------------");
      }
    }
  );
};

// Function for running a Twitter Search
var getTweets = function() {
  var client = new Twitter(keys.twitter);
  var params = {
      screen_name: "carolinaquiel"
  };
  client.get("statuses/user_timeline", params, function(error, tweets, response) {
    if (!error) {
      for (var i = 0; i < tweets.length; i++) {
        console.log(tweets[i].created_at);
        console.log(" ");
        console.log(tweets[i].text);
      }
    }
  });
};

// Function for running a Movie Search
var getMovies = function(movieName) {
  if (movieName === undefined) {
    movieName = "Coraline";
  }

  var urlHit = "http://www.omdbapi.com/?t=" + movieName + "&y=&plot=full&tomatoes=true&apikey=6e35c1d";

  request(urlHit, function(error, response, body) {
    if (!error && response.statusCode === 200) {
      var jsonData = JSON.parse(body);

      console.log("Title: " + jsonData.Title);
      console.log("Year: " + jsonData.Year);
      console.log("Rated: " + jsonData.Rated);
      console.log("IMDB Rating: " + jsonData.imdbRating);
      console.log("Country: " + jsonData.Country);
      console.log("Language: " + jsonData.Language);
      console.log("Plot: " + jsonData.Plot);
      console.log("Actors: " + jsonData.Actors);
      console.log("Rotten Tomatoes Rating: " + jsonData.Ratings[1].Value);
    }
  });
};

// Function for running a command based on text file
var doWhatItSays = function() {
  fs.readFile("random.txt", "utf8", function(error, data) {
    console.log(data);

    var dataArr = data.split(",");

    if (dataArr.length === 2) {
      pick(dataArr[0], dataArr[1]);
    }
    else if (dataArr.length === 1) {
      pick(dataArr[0]);
    }
  });
};

// Function for determining which command is executed
var pick = function(caseData, functionData) {
  switch (caseData) {
  case "my-tweets":
    getTweets();
    break;
  case "spotify-this-song":
    getSpotify(functionData);
    break;
  case "movie-this":
    getMovies(functionData);
    break;
  case "do-what-it-says":
    doWhatItSays();
    break;
  default:
    console.log(
        '\n ==== LIRI DOES NOT KNOW THAT ====' +
        '\n PLEASE RUN ONE OF THE COMMANDS BELOW:' +
        '\n node liri.js my-tweets' +
        '\n node liri.js spotify-this-song "any song name"' +
        '\n node liri.js movie-this "any movie name"' +
        '\n node liri.js do-what-it-says' +
        '\n'
        );
  }
};

// Function which takes in command line arguments and executes correct function accordingly
var runThis = function(argumentOne, argumentTwo) {
  pick(argumentOne, argumentTwo);
};

// MAIN PROCESS
runThis(process.argv[2], process.argv[3]); 