'use strict';
var fs = require('fs'),
	spud = require('spud'),
	resolver = require('../lib/resolver'),
	async = require('async'),
	returnalo = require('../lib/returnalo'),
	cache = {};
module.exports = function getNone(config, callback) {
		//single bundle config {"bundle": "errors/server"}
		//multiple bundle config {"bundle": ["errors/server", "errors/client"]}

		var bundleReader = {};

		//assume config.bundle is either an array of bundle strings or a string
		var configBundle = (config.bundle.constructor === Array) ? config.bundle : [config.bundle];

		configBundle.forEach(function processBundle(bundle) {
			var resolved = resolver.resolve(bundle);
			bundleReader[bundle] = function (cb) {
				//create a bundle key based on bundle name and locality info
				var bundleFile = resolved.bundleFile;
				var cacheKey = resolved.cacheKey;

				if (cache && cache[cacheKey]) {
					//console.log("bundalo:none:incache:",cacheKey);
					cb(null, cache[cacheKey]);
					return;
				}

				//not yet in cache
				fs.readFile(bundleFile, {}, function handleBundleBuffer(err, bundleBuffer) {
					//console.log("bundalo:none:outcache:",cacheKey);
					spud.deserialize(bundleBuffer, 'properties', function (err, bundleJSON) {
						cache[cacheKey] = bundleJSON;
						cb(null, cache[cacheKey]);
					});
				});
			};
		});

		async.parallel(bundleReader, returnalo(callback));


	};