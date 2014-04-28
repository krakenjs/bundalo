var fs = require('fs'),
	spud = require('spud'),
	resolver = require('file-resolver'),
	i18n,
	locality,
	type;

exports.dust = (function() {
	return {
		"create": function(config) {
			console.log("bundalo['dust'].create config", config);
			//sample config: {"i18n": {below}, "locality": "en-US", "type": "properties|json"}
			/*	
				"i18n": {
				    "contentPath": "path:./locales",
				    "fallback": "en-US"
				}
			*/
			i18n = config.i18n;
			locality = config.locality;
			type = config.type;

		},
		"get": function(config, callback) {
			//sample config {"bundle": "errors/server", "key": "error", "model": {"name": "Will Robinson"}}
			var reso = resolver.create({ root: i18n.contentPath, ext: type, fallback: i18n.fallback});
			var props = reso.resolve("errors/server", locality).file || i18n.contentPath;
			var readStream = fs.createReadStream(props);
			spud.deserialize(readStream, 'properties', function (err, data) {
				//console.log(err || data);
				//console.log('Conversion complete.');
				callback(null, data);
			});
		}
	}
})();

exports.js = exports.dust;