var fs = require('fs'),
	spud = require('spud'),
	resolver = require('file-resolver'),
	pollutedust = require('dustjs-linkedin'),
	freshy = require('freshy'),
	dust = freshy.freshy('dustjs-linkedin'),
	i18n,
	locality,
	type;

exports.dust = (function () {
	return {
		"create": function (config) {
			//console.log("bundalo['dust'].create config", config);
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
		"get": function (config, callback) {
			//sample config {"bundle": "errors/server", "model": {"name": "Will Robinson"}}
			//console.log("bundalo.get:config", config);

			var reso = resolver.create({ root: i18n.contentPath, ext: type, fallback: i18n.fallback});
			var bundleFile = reso.resolve(config.bundle, locality).file || i18n.contentPath;
			console.log("bundleFile", bundleFile);


			fs.readFile(bundleFile, {}, function handleBundleBuffer(err, bundleBuffer) {
				var compiled = dust.compile(bundleBuffer.toString(), config.bundle);
				dust.loadSource(compiled);
				//console.log("compiled", compiled);


				dust.render(config.bundle, config.model || {}, function (err, out) {
					spud.deserialize(new Buffer(out, 'utf8'), 'properties', function (err, data) {
						callback(null, data);
					});
				});
			});

		}
	}
})();

exports.js = exports.dust;