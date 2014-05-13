'use strict';
var fs = require('fs');
var spud = require('spud');
var loopalo = require('../lib/loopalo');
var Resolver = require('../lib/resolver');


var None = function (config) {
	this.resolver = new Resolver();
	this.resolver.init(config);
	this.cache = {};
};

None.prototype.get = function (config, callback) {
	var that = this;

	var noneBundler = function (bundleFile, cacheKey, cb) {
		if (that.cache && that.cache[cacheKey]) {
			cb(null, that.cache[cacheKey]);
			return;
		}
		//not yet in cache
		fs.readFile(bundleFile, {}, function handleBundleBuffer(err, bundleBuffer) {
			spud.deserialize(bundleBuffer, 'properties', function (err, bundleJSON) {
				that.cache[cacheKey] = bundleJSON;
				cb(null, that.cache[cacheKey]);
			});
		});
	};
	loopalo(config, this.resolver, noneBundler, callback);
};

None.prototype.__cache = function () {
	return this.cache;
};

module.exports = None;
