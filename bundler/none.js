'use strict';
var fs = require('fs'),
	spud = require('spud'),
	loopalo = require('../lib/loopalo'),
	cache = {};

var None = function() {}

None.prototype.get = function (config, callback) {
	var noneBundler = function (bundleFile, cacheKey, cb) {
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
	loopalo(config, noneBundler, callback);
};

None.prototype.__cache = function () {
	return cache;
};

module.exports = new None();
