//REQUIRES
require("dotenv").config();

const request = require("request"); //movie, concert
const fs = require("fs"); //dowhat
const Spotify = require("node-spotify-api"); //spotify
const moment = require("moment");
const keys = require("./keys.js");

const liriInput = process.argv;
const liriCommand = process.argv[2];

function getSearchString(liriInput) {
    let tempName = "";
    // Loop through all input with spaces and
    // handle the inclusion of "+"s or "&"
    for (let i = 3; i < liriInput.length; i++) {
        if (i > 3 && i < liriInput.length) {
            tempName = tempName + "+" + liriInput[i];
        } else {
            tempName += liriInput[i];
        }
    }
    return tempName;
}

let searchString = getSearchString(liriInput);

switch (liriCommand) {
    // liri_Command(s)
    //  1 -  `concert-this`
    //  2 -  `spotify-this-song`
    //  3 -  `movie-this`
    //  4 -  `do-what-it-says`
    case `spotify-this-song`:
        console.log(`node liri.js spotify-this-song '<songName here>'`);
        //REMEMBER THE DEFAULT
        spotifyThis(searchString);
        break;
    case `movie-this`:
        console.log(`node liri.js movie-this '<movie name here>'`);
        //REMEMBER THE DEFAULT
        console.log("Search for movieName " + searchString);
        movieThis(searchString);
        // }
        break;
    case `concert-this`:
        console.log(`node liri.js concert-this <artistbandName here>`);
        concertThis(searchString);
        break;
    case `do-what-it-says`:
        console.log(`node liri.js do-what-it-says`);
        doWhatItSays();
        break;
    default:
        console.log("NOT A VALID COMMAND");
        break;
}

function concertInfoDisplay(body) {
    //  artistBands Output
    const data = JSON.parse(body);
    const targetObj = data[0];

    //   * Venue Name
    console.log("Venue Name: " + data[0].venue.name);
    //   * Venue location
    //   {"name":"The Mirage","country":"United States","region":"NV","city":"Las Vegas",
    console.log(
        "Venue location: " +
        data[0].venue.city +
        ", " +
        data[0].venue.region +
        " " +
        data[0].venue.country
    );
    //   * Event Date (use moment to format this as "MM/DD/YYYY")
    console.log("Event Date: " + data[0].datetime);
}

function concertThis(artistbandName) {
    console.log("`node liri.js concert-this <artist/band name here>`");

    const bandKeys = keys.apiInfo;
    const bandapp_ID = bandKeys.bandapp_ID;

    var options = {
        method: "GET",
        url: "https://rest.bandsintown.com/artists/" + artistbandName + "/events",
        qs: {
            app_id: bandapp_ID
        },
        headers: {
            "cache-control": "no-cache"
        }
    };

    console.log("concert url ==> " + options.url);

    request(options, function (error, response, body) {
        if (error) throw new Error(error);

        // console.log("Pretty Version Output" + JSON.stringify(body));

        // console.log("THE BODY IS ==> " + body);
        concertInfoDisplay(body);
    });
}

function concertThisAlso(artistbandName) {
    // `node liri.js concert-this <artist/band name here>`
    console.log("`node liri.js concert-this <artist/band name here>`");

    console.log(artistbandName);
    // * This will search the Bands in Town Artist Events API
    // (`"https://rest.bandsintown.com/artists/" + artist + "/events?app_id=codingbootcamp"`) for an artist and render the following information about each event to the terminal:
    const bandsUri = "https://rest.bandsintown.com/artists/";
    const bandsBackUri = "/events?app_id=";

    const bandKeys = keys.apiInfo;
    const bandapp_ID = bandKeys.bandapp_ID;

    const artistBandsURL = bandsUri + artistbandName + bandsBackUri + bandapp_ID;

    console.log("artistBandsURL: " + artistBandsURL);

    request(artistBandsURL, function (error, response, body) {
        console.log("RESPONSE: " + JSON.stringify(response));
        if (!error && response.statusCode === 200) {
            console.log("Pretty Version Output" + JSON.stringify(response));
            // concertInfoDisplay(response.body);
            console.log("Venue Name " + response.venue);
        } else {
            console.log(error);
        }
    });
}

function spotifyDisplayInfo(body) {
    console.log("spotifyDisplayInfo inside the function");

    const info = JSON.parse(body);
    const spotObj = info[0];
    // console.log("spotObj: " + spotObj);
    // `console.log("spotifyOutput: " + JSON.stringify(spotObj));

    // OUTPUT DATA
    //    * This will show the following information about the song in your terminal/bash window
    //      * Artist(s)
    //   console.log("Artist(s): " + JSON.parse(body).name);
    //      * Song Name
    //   console.log("Song Name: " + JSON.parse(body).name);
    //      * The album that the song is from
    //   console.log("Album: " + JSON.parse(body).name);
    //      * A preview link of the song from Spotify
    //   console.log("Preview Link: " + JSON.parse(body).preview_url);
}

function spotifyThis(trackName) {
    console.log("`node liri.js spotify-this-song '<song name here>`");
    console.log("trackName :" + trackName);

    //   let qs = { type: 'artist' || 'album' || 'track', query: trackName, limit: 10 };
    const qs = {
        type: "track",
        query: trackName,
        limit: 2
    };

    const spotKeys = keys.spotify;
    const spotSecret = spotKeys.secret;
    const spotID = spotKeys.id;

    const spotify = new Spotify({
        id: spotID,
        secret: spotSecret
    });

    spotify.search(qs, function (err, data) {
        if (err) {
            return console.log("Error occurred: " + err);
        }
        console.log("Pretty Version Output" + JSON.stringify(data));
        spotifyDisplayInfo(data);
    });

    // ADDITIONAL INFO -- TO BE DELETED
    //    * You will utilize the [node-spotify-api](https://www.npmjs.com/package/node-spotify-api) package in order to retrieve song information from the
    // Web API returns all response data as a JSON object. See the Web API Object Model for a description of all the retrievable objects.
    // From <https://developer.spotify.com/documentation/web-api/>
    //    * Step One: Visit <https://developer.spotify.com/my-applications/#!/>
    //    * Step Three: Once logged in, navigate to <https://developer.spotify.com/my-applications/#!/applications/create> to register a new application to be used with the Spotify API. You can fill in whatever you'd like for these fields. When finished, click the "complete" button.
    //    * Step Four: On the next screen, see your client id and client secret.
    // Copy these values down somewhere,
    // Needed for Spotify API and the [node-spotify-api package]
    // (https://www.npmjs.com/package/node-spotify-api).
}

function movieInfoDisplay(body) {
    //  Movie Output
    console.log("LIRI - MOVIE-THIS.BOT!!!");
    console.log("Movie Title: " + JSON.parse(body).Title);
    console.log("Release Year: " + JSON.parse(body).Year);
    console.log("IMDB Rating: " + JSON.parse(body).imdbRating);
    console.log("Rotten Tomatoes Rating: " + JSON.parse(body).Ratings[1].Value);
    console.log(
        "Country where the movie was produced: " + JSON.parse(body).Country
    );
    console.log("Movie Language: " + JSON.parse(body).Language);
    console.log("Movie Plot: " + JSON.parse(body).Plot);
    console.log("Actors: " + JSON.parse(body).Actors);
}

function movieThis(movieName) {
    // 3. `node liri.js movie-this '<movie name here>'`

    const uri = "http://www.omdbapi.com/?t=";
    const url = "&y=&plot=short&apikey=";

    const apiKeys = keys.apiInfo;
    const OMDB_API = apiKeys.OMDB_API;

    const queryUrl = uri + movieName + url + OMDB_API;

    console.log("queryUrl" + queryUrl);

    request(queryUrl, function (error, response, body) {
        if (!error && response.statusCode === 200) {
            console.log("Pretty Version Output" + JSON.stringify(body));

            movieInfoDisplay(body);
        } else {
            console.log(error);
        }
    });
}

function doWhatItSays() {
    //  4 -  `do-what-it-says`
    console.log(`node liri.js do-what-it-says`);

    fs.readFile("random.txt", "utf8", function (error, data) {
        // If the code experiences any errors it will log the error to the console.
        if (error) {
            return console.log(error);
        }
        console.log(data);
        let output = data.split(" ");
        for (var i = 0; i < output.length; i++) {
            // Print each element (item) of the array/
            console.log(output[i]);
        }
        console.log(data);
        //    * Using the `fs` Node package, LIRI will take the text inside of random.txt and then use it to call one of LIRI's commands.
        //      * It should run `spotify-this-song` for "I Want it That Way," as follows the text in `random.txt`.
        //      * Edit the text in random.txt to test out the feature for movie-this and concert-this.
    });
}