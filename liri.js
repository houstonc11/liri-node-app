var request = require("request");
var Twitter = require("twitter");
var Omdb = require("omdb");
var Spotify = require("node-spotify-api");

var fs = require("fs");
var key = require("./keys.js");

var client = new Twitter({
    consumer_key: 'w41YYCAiqFvaLICBBmlikol8O',
    consumer_secret: 'uiuxIl0kVaSKH2QKFzSCosibrsWNvjZLHeRbOtb8NRYlKZ1XWm',
    access_token_key: '882423115732668418-2jwdP17I4e6CDjl7VKLr0E1BNPQkUqj',
    access_token_secret: 'N7qgSp2vdpsDjMoNdw3BnQZpgKdYdxJxxgKfULY1pOMGS'
});
var params = { screen_name: "HoustonsMsgs27" };

var spotify = new Spotify({
    id: "b9a2eb516d7b43f7ad00307820eeb9a8",
    secret: "5a68a767a81c44f8b5e2d1cfb7108306"
});

var operator = process.argv[2];
var input = process.argv[3];
var tweets;

if (operator == "my-tweets") {
    displayTweets();
} else if (operator == "spotify-this-song") {
    displaySpotify(input);
} else if (operator == "movie-this") {
    displayMovie();
} else if (operator == "do-what-it-says") {
    doWhatItSays();
}

function displayTweets() {
    client.get('statuses/user_timeline', params, function(error, tweets, response) {
        if (!error) {
            var totalTweets = 20;

            for (i = 0; i < tweets.length; i++) {
                console.log(tweets[i].text);
                if (i > totalTweets) {
                    break;
                }
            }
        } else if (error) {
            console.log(error);
        }
    });
}

function displaySpotify(input) {
    if (input == null) {
        input = "The Sign Ace of Base";
    }

    spotify.search({ type: 'track', query: input }, function(err, data) {
        if (err) {
            console.log(err);
            return;

        } else if (!err) {        
            console.log("Song: " + input);
            console.log("Artist: " + JSON.stringify(data.tracks.items[0].album.artists[0].name));
            console.log("Preview Link: " + JSON.stringify(data.tracks.items[0].album.artists[0].external_urls.spotify));
            console.log("Album: " + JSON.stringify(data.tracks.items[0].album.name));
        }
    });
}


function displayMovie() {
    if (input == null) {
        input = "Mr. Nobody";
    }
    var queryURL = "http://www.omdbapi.com/?apikey=40e9cece&t=" + input + "&y=&plot=short&r=json"
    request(queryURL, function(error, response, body) {
        if (!error) {
            console.log("Title: " + JSON.parse(body).Title);
            console.log("Release Year: " + JSON.parse(body).Year);
            console.log("IMDB Rating: " + JSON.parse(body).imdbRating);
            console.log("Rotten Tomatoes Rating: " + JSON.parse(body).Ratings[1].Value);
            console.log("Country of Production: " + JSON.parse(body).Country);
            console.log("Language: " + JSON.parse(body).Language);
            console.log("Plot: " + JSON.parse(body).Plot);
            console.log("Actors: " + JSON.parse(body).Actors);
        } else if (error) {
            console.log(error);
            return;
        }
    });
}

function doWhatItSays() {
    fs.readFile("random.txt", "utf8", function(error, data) {
        if (!error) {
            var dataArray = data.split(",");
            displaySpotify(dataArray[1]);
        } else if (error) {
            console.log(error);
        }
    });
}
