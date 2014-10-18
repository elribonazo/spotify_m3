var spm3 = require("../lib/spotify_m3");


spm3.get_album_tracks_by_artist("coldplay", function(err, data){
	if(err) throw err;
	console.log("DATA : ");
});


spm3.get_album_tracks_by_artist.on("status", function(data){
	console.log(data);
})