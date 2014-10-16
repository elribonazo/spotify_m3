var http = require('http');
var https = require('https');
var async = require('async');


module.exports = {
		
	getartistalbums : function(artist,callback){

		var functions = [];

		functions.push(this.getartist(artist));
		functions.push(this.get);
		functions.push(function(json, cb){

			
			
			var items  = json.artists.items;
			var artist_albums = [];

			for(i=0;i<items.length;++i){
				artist_albums[i] = {};
				artist_albums[i].name = items[i].name;
				artist_albums[i].images = items[i].images;
				artist_albums[i].uri = items[i].uri;
				artist_albums[i].albums = [];
				
				
				var query = '/v1/artists/' + items[i].id + '/albums';
				
				
			}
		});
		
		async.waterfall(functions, function(err, data) {
			if (err !== null) {
				return callback(err, "");
			}
			return callback(null, data);
		});
		
	},
	getalbums : function(data,callback){
		
		
	},
	getartist : function(artist){
		var query = '/v1/search?type=artist&q='+artist;
		return function(callback){
			callback(null, query);
		}
	},
	get: function(query, callback) {
		var opts = {
				host: "api.spotify.com",
				path: encodeURI(query),
				method: "GET",
				headers: { "Accept": "application/json" }
		};
		var req = https.request(opts, function(res) {
			
			var result = "";
			res.on('data', function(d) {
				result += d;
			});
			res.on('end', function() {
	            var json;
	            json = JSON.parse(result);
	            if(json.error){
	            	callback(json.error.message, null);
	            }else{
	            	callback(null,json);
	            }
	            
	            
	        });
		});
		req.end();

		req.on('error', function(err) {
			console.log("REQ error");
			callback(err, "");
		});
		
    }
};