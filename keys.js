//
console.log("The keys are now loaded");

// api calls
// load into the liri.js file

const spotify = {
id: process.env.SPOTIFY_ID,
secret: process.env.SPOTIFY_Secret
};

const apiInfo = {
    bandapp_ID: process.env.bandapp_ID,
    OMDB_API: process.env.OMDB_API
}

module.exports = {
    spotify,
    apiInfo
};