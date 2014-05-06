'use strict';
var async = require('async'),
	resolver = require('../lib/resolver');

var Loopalo = function (config, handler, callback) {
	var bundleRenderer = {};
	var bundleKey = {};
	var configBundle = [];
	
	if (config.bundle.constructor === String) {
		//user wants one bundle (string)
		bundleKey[config.bundle] = config.bundle;
		configBundle = [config.bundle];
	} else if (config.bundle.constructor === Array) {
		//multiple bundles non-aliased (array)
		config.bundle.forEach(function (key) {
			bundleKey[key] = key;
		});
		configBundle = config.bundle;
	} else {
		//multiple bundles aliased (object)
		Object.keys(config.bundle).forEach(function (bundle) {
			bundleKey[config.bundle[bundle]] = bundle;
			configBundle.push(config.bundle[bundle]);
		});
	}
	configBundle.forEach(function processBundle(bundle) {
		config.bundle = bundle;
		var resolved = resolver.resolve(config);
		bundleRenderer[bundleKey[bundle]] = function (cb) {
			handler(resolved.bundleFile, resolved.cacheKey, cb);
		};
	});

	async.parallel(bundleRenderer, function returnalo(err, results) {
		var returnVal = results;
		//if only one bundle object, remove top level key
		if (Object.keys(results).length === 1) {
			returnVal = results[Object.keys(results)[0]];
		}
		callback(null, returnVal);
	});

};


module.exports = Loopalo;