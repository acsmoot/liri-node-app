//REQUIRES
require("dotenv").config();

const moment = require("moment");
const request = require("request"); //movie, concert
const fs = require("fs"); //dowhat
const Spotify = require("node-spotify-api"); //spotify
const keys = require("./keys.js");
const inquirer = require("inquirer");

// Inquirer functionality commented out but works
// inquirer.prompt([
//     {
//         type: "rawlist",
//         name: "liriBotThis",
//         message: "What would you like to LIRI-BOT to search??",
//         default: 1,
//         //choices: ["concert-this", "spotify-this-song", "movie-this", do-what-it-says]
//         choices: [
//             {
//                 "name": "Item 1",
//                 "value": "concert-this"
//             },
//             {
//                 "name": "Item 2",
//                 "value": "spotify-this-song"
//             },
//             {
//                 "name": "Item 3",
//                 "value": "movie-this"
//             },
//             {
//                 "name": "Item 4",
//                 "value": "do-what-it-says"
//             },
//         ]},
//             {
//                 type: "input",
//                 name: "userInput",
//                 message: "Please enter the movie title, song, artist/band?"
//             }
//             // liri_Command(s)
//             //  1 -  `concert-this`
//             //  2 -  `spotify-this-song`
//             //  3 -  `movie-this`
//             //  4 -  `do-what-it-says`

//         ]).then(function (liri) {
//         console.log("liriBotThis" + liri.liriBotThis, " liri.userInput" + liri.userInput);
//         startLiriBot(liri.liriBotThis.trim(),liri.userInput.trim());
       
//     });

// working without the inquirer

const liriInput = process.argv;
getLiriArtifacts(liriInput);

function getLiriArtifacts(inputString) {
    let input = inputString.slice(2);
    console.log("inputArray=" + input);
    let liriCommand = "";
    let searchString = "";
    for (var i = 1; i < input.length; i++) {
        if (i > 1 && i < input.length) {
            searchString = searchString + "+" + input[i];
        } else {
            searchString += input[i];
        }
    }

    liriCommand += input[0];

    console.log("liriCommand in function " + liriCommand);
    console.log("searchstring " + searchString);
    startLiriBot(liriCommand.trim(), searchString.trim());
}

function getSearchString(input) {
    let tempName = "";
    // Loop through all input with spaces and
    // handle the inclusion of "+"s or "&"
    for (let i = 3; i < input.length; i++) {
        if (i > 3 && i < input.length) {
            tempName = tempName + "+" + input[i];
        } else {
            tempName += input[i];
        }
    }
    return tempName;
}

function startLiriBot(liriCommand, searchString) {
    switch (liriCommand) {
        // liri_Command(s)
        //  1 -  `concert-this`
        //  2 -  `spotify-this-song`
        //  3 -  `movie-this`
        //  4 -  `do-what-it-says`
        case `spotify-this-song`:
            console.log(`node liri.js spotify-this-song '<song Name here>'`);
            let tmp = "";
            if (searchString == "") {
                let tmp = "The+Sign";
                spotifyThis(tmp);
            } else spotifyThis(searchString);
            break;
        case `movie-this`:
            console.log(`node liri.js movie-this '<movie name here>'`);
            let tmpsearchString = "";
            if (searchString == "") {
                let tmpsearchString = "Mr+Nobody";
                movieThis(tmpsearchString);
            } else movieThis(searchString);
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
}

function concertDisplayInfo(body) {
    //  artistBands Output
    const data = JSON.parse(body);
    const concertObj = data[0];

    console.log("LIRI!!!!CONCERT-THIS.BOT!!!");
    //   * Venue Name
    console.log("Venue Name: " + concertObj.venue.name);
    //   * Venue location
    console.log(
        "Venue location: " +
        concertObj.venue.city +
        ", " +
        concertObj.venue.region +
        " " +
        concertObj.venue.country
    );
    //   * Event Date (use moment to format this as "MM/DD/YYYY")
    console.log(
        "Event Date: " + moment(concertObj.datetime).format("MM/DD/YYYY HH:mm")
    );
}

function concertThis(artistbandName) {
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
    // console.log("concert url ==> " + options.url);
    request(options, function (error, response, body) {
        if (error) throw new Error(error);
        // console.log("Pretty Version Output" + JSON.stringify(body));
        concertDisplayInfo(body);
    });
}

function spotifyDisplayInfo(data) {
    // console.log("Pretty Version Output" + JSON.stringify(data));

    const spotObj = data["tracks"]["items"][1];
    console.log("LIRI!!!!SPOTIFY-THIS.BOT!!!");
    // OUTPUT DATA
    //      * Artist(s)
    console.log("Artist(s):" + spotObj["album"]["artists"][0]["name"]);
    //      * Song Name
    console.log("Song Name: " + spotObj["name"]);
    //      * The album that the song is from
    console.log("Album: " + spotObj["album"]["name"]);
    //      * A preview link of the song from Spotify
    console.log("Preview Link: " + spotObj["preview_url"]);
}

function spotifyThis(trackName) {
    const spotKeys = keys.spotify;
    const spotID = spotKeys.id;
    const spotSecret = spotKeys.secret;
    const spotify = new Spotify({
        id: spotID,
        secret: spotSecret
    });

    const qs = {
        type: "track",
        query: trackName,
        limit: 2
    };

    spotify.search(qs, function (err, data) {
        if (err) {
            return console.log("Error occurred: " + err);
        }
        spotifyDisplayInfo(data);
    });
}

function movieInfoDisplay(body) {
    //  Movie Output
    console.log("LIRI!!!!MOVIE-THIS.BOT!!!");
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

    // console.log("queryUrl" + queryUrl);

    request(queryUrl, function (error, response, body) {
        if (!error && response.statusCode === 200) {
            // console.log("Pretty Version Output" + JSON.stringify(body));
            movieInfoDisplay(body);
        } else {
            console.log(error);
        }
    });
}

function doWhatItSays() {
    //  4 -  `do-what-it-says`
    //    * Using the `fs` Node package, LIRI will take the text inside of random.txt and then use it to call one of LIRI's commands.
    //      * It should run `spotify-this-song` for "I Want it That Way" as follows the text in `random.txt`.
    //      * Edit the text in random.txt to test out the feature for movie-this and concert-this.
    console.log("LIRI-BOT!!!!!Working on your request.");

    fs.readFile("random.txt", "utf8", function (error, data) {
        if (error) {
            return console.log(error);
        }

        let output = data.split(" ");
        let liriCommand = "";
        for (var i = 2; i < output.length; i++) {
            // Print each element (item) of the array/
            // console.log("output["+i+"]"+output[i]);
            // let tmp_searchString = join(output[i+1])
            // console.log(liriCommand);
            // console.log(tmp_searchString);
        }
        liriCommand = output[2];
        input =
            output[3] +
            "+" +
            output[4] +
            "+" +
            output[5] +
            "+" +
            output[6] +
            "+" +
            output[7];
        // console.log(liriCommand);
        // console.log(input);
        startLiriBot(liriCommand, input);
    });
}