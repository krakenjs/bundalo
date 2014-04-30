var fs = require('fs'),
	spud = require('spud'),
	resolver = require('file-resolver'),
	freshy = require('freshy'),
	dust = freshy.freshy('dustjs-linkedin'),
	async = require('async'),
	i18n,
	locality,
	type;

var dustRender = function(cacheKey, model, cb) {
	dust.render(cacheKey, model || {}, function (err, out) {
		spud.deserialize(new Buffer(out, 'utf8'), 'properties', function (err, data) {
			cb(null, data);
		});
	});
};
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
			//single bundle config {"bundle": "errors/server", "model": {"name": "Will Robinson"}}
			//multiple bundle config {"bundle": ["errors/server", "errors/client"], "model": {"name": "Will Robinson"}}
			//console.log("bundalo.get:config", config);

			//create a bundle key based on bundle name and locality info
			var reso = resolver.create({ root: i18n.contentPath, ext: type, fallback: i18n.fallback});
			var bundleFile = reso.resolve(config.bundle, locality).file || i18n.contentPath;
			var cacheKey = bundleFile.split(i18n.contentPath)[1];

			if (dust.cache && dust.cache[cacheKey]) {
				dustRender(cacheKey, config.model, callback);
				return;
			}

			//not yet in cache
			fs.readFile(bundleFile, {}, function handleBundleBuffer(err, bundleBuffer) {
				var compiled = dust.compile(bundleBuffer.toString(), cacheKey);
				dust.loadSource(compiled);
				dustRender(cacheKey, config.model, callback);
			});

		}
	}
})();
