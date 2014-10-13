var http = require('http');
var https = require('https');
function makeResponse(callback) {
    var chunks = '';
    return function(response) {
        response.setEncoding('utf8');

        response.on('data', function(chunk) {
            chunks += chunk;
        });

        response.on('end', function() {
            var err, json;

            try {
                json = JSON.parse( chunks );
            }
            catch(e) {
                err = e;
                console.log(e);
            }

            callback(err, json);
        });
    };
}

module.exports = {
	artist_albums : function(artist, callback){
		
	},
    lookup: function(opts, callback) {
        var type = opts.type+'s';
        var query = '/v1/'+type+'/'+opts.id;       
        this.get(query, callback);
    },
    search: function(opts, callback) {
        var query = '/v1/search?type='+opts.type+'&q='+opts.query;
        this.get(query, callback);
    },
    get: function(query, callback) {
        var opts = {
            host: "api.spotify.com",
            path: encodeURI(query),
            method: "GET",
            headers: { "Accept": "application/json" }
        },
        request = https.request(opts, makeResponse( callback ));
        request.end();

        request.on('error', function (err) {
            callback (err, {});
        });
    }
};