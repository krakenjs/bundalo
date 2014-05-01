var fs = require('fs'),
	spud = require('spud'),
	resolver = require('file-resolver'),
	freshy = require('freshy'),
	dust = freshy.freshy('dustjs-linkedin'),
	async = require('async'),
	i18n,
	locality,
	type,
	none = {};

none.cache = {};

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
			//sample config: {"i18n": {below}, "locality": "en-US"}
			/*	
			 "i18n": {
				 "contentPath": "path:./locales",
				 "fallback": "en-US"
			 }
			 */
			i18n = config.i18n;
			locality = config.locality;

		},
		"get": function (config, callback) {
			//single bundle config {"bundle": "errors/server", "model": {"name": "Will Robinson"}}
			//multiple bundle config {"bundle": ["errors/server", "errors/client"], "model": {"name": "Will Robinson"}}

			var bundleRenderer = {};

			//assume config.bundle is either an array of bundle strings or a string
			var configBundle = (config.bundle.constructor === Array) ? config.bundle : [config.bundle];

			configBundle.forEach(function(bundle) {
				bundleRenderer[bundle] = function(cb) {
					//create a bundle key based on bundle name and locality info
					var reso = resolver.create({ root: i18n.contentPath, ext: 'properties', fallback: i18n.fallback});
					var bundleFile = reso.resolve(bundle, locality).file || i18n.contentPath;
					var cacheKey = bundleFile.split(i18n.contentPath)[1];

					if (dust.cache && dust.cache[cacheKey]) {
						//console.log("bundalo:incache:",cacheKey);
						dustRender(cacheKey, config.model, cb);
						return;
					}

					//not yet in cache
					fs.readFile(bundleFile, {}, function handleBundleBuffer(err, bundleBuffer) {
						//console.log("bundalo:outcache:",cacheKey);
						var compiled = dust.compile(bundleBuffer.toString(), cacheKey);
						dust.loadSource(compiled);
						dustRender(cacheKey, config.model, cb);
					});
				};
			});

			async.parallel(bundleRenderer, function(err, results) {
				var returnVal = results;
				//console.log("async results", results);
				//if only one bundle object, remove top level key
				if (Object.keys(results).length === 1) {
					returnVal = results[Object.keys(results)[0]];
				}
				callback(null, returnVal);
			});


		}
	}
})();

exports.none = (function () {
	return {
		"create": function (config) {
			//console.log("bundalo['none'].create config", config);
			//sample config: {"i18n": {below}, "locality": "en-US"}
			/*
			 "i18n": {
			 "contentPath": "path:./locales",
			 "fallback": "en-US"
			 }
			 */
			i18n = config.i18n;
			locality = config.locality;
		},
		"get": function (config, callback) {
			//single bundle config {"bundle": "errors/server"}
			//multiple bundle config {"bundle": ["errors/server", "errors/client"]}

			var bundleReader = {};

			//assume config.bundle is either an array of bundle strings or a string
			var configBundle = (config.bundle.constructor === Array) ? config.bundle : [config.bundle];

			configBundle.forEach(function(bundle) {
				bundleReader[bundle] = function(cb) {
					//create a bundle key based on bundle name and locality info
					var reso = resolver.create({ root: i18n.contentPath, ext: 'properties', fallback: i18n.fallback});
					var bundleFile = reso.resolve(bundle, locality).file || i18n.contentPath;
					var cacheKey = bundleFile.split(i18n.contentPath)[1];

					if (none.cache && none.cache[cacheKey]) {
						//console.log("bundalo:incache:",cacheKey);
						cb(null, none.cache[cacheKey]);
						return;
					}

					//not yet in cache
					fs.readFile(bundleFile, {}, function handleBundleBuffer(err, bundleBuffer) {
						//console.log("bundalo:outcache:",cacheKey);
						spud.deserialize(bundleBuffer, 'properties', function (err, bundleJSON) {
							none.cache[cacheKey] = bundleJSON;
							cb(null, none.cache[cacheKey]);
						});
					});
				};
			});

			async.parallel(bundleReader, function(err, results) {
				var returnVal = results;
				//console.log("async results", results);
				//if only one bundle object, remove top level key
				if (Object.keys(results).length === 1) {
					returnVal = results[Object.keys(results)[0]];
				}
				callback(null, returnVal);
			});


		}
	}
})();
