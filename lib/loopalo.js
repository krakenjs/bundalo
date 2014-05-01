'use strict';
var async = require('async'),
	returnalo = require('../lib/returnalo'),
	resolver = require('../lib/resolver');

var Loopalo = function(config, handler, callback) {
	var bundleRenderer = {};
	var configBundle = (config.bundle.constructor === Array) ? config.bundle : [config.bundle];
	configBundle.forEach(function processBundle(bundle) {
		var resolved = resolver.resolve(bundle);
		bundleRenderer[bundle] = function(cb) {
			handler(resolved.bundleFile, resolved.cacheKey, cb);
		}
	});

	async.parallel(bundleRenderer, returnalo(callback));

};


module.exports = Loopalo;