var spm3 = require("../lib/spotify_m3");
var async = require('async');


/*spm3.get_albums_by_artist("coldplay", function(err, data){
	if(err) throw err;
	console.log("DATA : ");
	console.log(data);
});*/

spm3.get_album_tracks_by_artist("coldplay", function(err, data){
	if(err) throw err;
	console.log("DATA : ");
	console.log(data);
});