spotify_m3
==========

Nodejs Module that implements track search and its information

##Usage

var spm3 = require("spotify_m3");

# Get all the albums and tracks by artist name

spm3.get_albums_by_artist("coldplay", function(data){
	console.log(data);
});



# Get album tracks by Artist name

spm3.get_album_tracks_by_artist("coldplay", function(data){
	console.log(data);
});


# Get tracks from a album array
var albums_array = [
{id:'spotify_album_id121332'},
{id:'spotify_album_id121333'},
{id:'spotify_album_id121334'}
];


spm3.getalbumstracks(albums_array, function(data){
	console.log(data);
});


# Get all the artist array albums

var artist_array = [
{id:'spotify_artist_id121332'},
{id:'spotify_artist_id121333'},
{id:'spotify_artist_id121334'}
];


