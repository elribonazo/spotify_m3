var http = require('http');
var https = require('https');
var async = require('async');

'use strict';


module.exports = {
		get_album_tracks_by_artist : function(artist,callback){
			var functions = [];
			functions.push(this.getartist(artist));
			functions.push(this.get);
			functions.push(this.setartist);
			functions.push(this.getalbums);
			functions.push(this.getalbumstracks);
			
			async.waterfall(functions, function(err, data) {
				if (err !== null) {

					return callback(err, null);

				}
				return callback(null, data);
			});
		},
		get_albums_by_artist : function(artist,callback){
			var functions = [];
			functions.push(this.getartist(artist));
			functions.push(this.get);
			functions.push(this.setartist);
			functions.push(this.getalbums);

			async.waterfall(functions, function(err, data) {
				if (err !== null) {

					return callback(err, null);

				}
				return callback(null, data);
			});
		},
		getalbumstracks : function(artists, callback){
			var deferred = require('deferred') , count = 0, limit = artists.length, get;
			get = function () {
				
				var d = deferred();
				module.exports.gettracks(artists[count].albums, function(albums){
					artists[count].albums = albums;
					d.resolve(++count);
				});
				
				return d.promise;
			};
			get().then(function self(value) {
				if (value < limit) return get().then(self);
				return value;
			}).done(function () {
				callback(null, artists)
			});
		},
		gettracks : function(albums, callback){

			var deferred = require('deferred') , count = 0, limit = albums.length, get;
			get = function () {
				var d = deferred();
				var query = "/v1/albums/" + albums[count].id + "/tracks";
				
				albums[count].tracks = [];
				module.exports.get(query, function(err, tracks){
					
					for(i=0;i<tracks.items.length; ++i){
						
						var track = tracks.items[i];
						var info = {};
						
						info.name = track.name;
						info.id = track.id;
						info.track_number = track.track_number;
						info.uri = track.uri;
						info.artists = track.artists;
						
						albums[count].tracks.push(info);
					}
					d.resolve(++count);
				});
				return d.promise;
			};

			get().then(function self(value) {
				if (value < limit) return get().then(self);
				return value;
			}).done(function () {
				callback(null, albums)
			});
		},
		setartist : function(items, callback){
			var artists = [];
			items = items.artists.items;

			for(i=0;i<items.length;++i){
				var info = {};
				info.name = items[i].name;
				info.images = items[i].images;
				info.uri = items[i].uri;
				info.id = items[i].id;
				info.albums = [];
				artists.push(info);
			}

			callback(null, artists);
		},
		getalbums : function(artists,callback){

			var deferred = require('deferred') , count = 0, limit = artists.length, get;
			get = function () {
				var d = deferred();

				var id_artist = artists[count].id;
				var query = "/v1/artists/" + id_artist + "/albums";

				
				module.exports.get(query, function(err, albums){

					var items = albums.items;

					for(i=0;i<items.length;++i){
						var album_info = {}
						album_info.name = items[i].name;
						album_info.id = items[i].id;
						album_info.images = items[i].images;
						album_info.uri = items[i].uri;
						artists[count].albums.push(album_info);
					}

					d.resolve(++count);
				});

				return d.promise;
			};

			//Invoke while loop:
			get().then(function self(value) {
				if (value < limit) return get().then(self);
				return value;
			}).done(function () {
				callback(null, artists)
			});
		},
		getartist : function(artist){
			var query = '/v1/search?type=artist&q='+artist;
			console.log("Searching " + query);
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
						throw new Exception(json.error.message);
					}else{
						for(result in json){
							if(json[result].items.length<=0) callback("Not found", {});
						}

						callback(null, json);
					}


				});
			});
			req.end();

			req.on('error', function(err) {
				throw new Exception(err);
		
			});
		}
};