var spm3 = require("../lib/spotify_m3");
var async = require('async');


spm3.load_artist_albums("coldplay", function(err, data){
	if(err) throw err;
	
	
	console.log("DATA : " + data);
});