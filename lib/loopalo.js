'use strict';
var async = require('async'),
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

	async.parallel(bundleRenderer, function returnalo(err, results) {
		var returnVal = results;
		//console.log("async results", results);
		//if only one bundle object, remove top level key
		if (Object.keys(results).length === 1) {
			returnVal = results[Object.keys(results)[0]];
		}
		callback(null, returnVal);
	});

};


module.exports = Loopalo;