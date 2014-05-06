'use strict';
var async = require('async'),
	resolver = require('../lib/resolver'),
	_ = require("lodash");

var Loopalo = function (config, handler, callback) {
	var bundleRenderer = {};
	var bundleKey = {};
	var bundleAs = Object;
	var configBundle = [];
	
	if (config.bundle.constructor === String) {
		//user wants one bundle (string)
		bundleKey[config.bundle] = config.bundle;
		configBundle = [config.bundle];
		bundleAs = String;
	} else if (config.bundle.constructor === Array) {
		//multiple bundles non-aliased (array)
		config.bundle.forEach(function (key) {
			bundleKey[key] = key;
		});
		configBundle = config.bundle;
		bundleAs = Array;
	} else {
		//multiple bundles aliased (object)
		Object.keys(config.bundle).forEach(function (bundle) {
			bundleKey[config.bundle[bundle]] = bundle;
			configBundle.push(config.bundle[bundle]);
		});
	}
	configBundle.forEach(function processBundle(bundle) {
		var localConfig = _.clone(config);
		localConfig.bundle = bundle;
		var resolved = resolver.resolve(localConfig);
		bundleRenderer[bundleKey[bundle]] = function (cb) {
			handler(resolved.bundleFile, resolved.cacheKey, cb);
		};
	});

	async.parallel(bundleRenderer, function returnalo(err, results) {
		var returnVal = results;
		//if only one bundle object, remove top level key
		if (bundleAs === String) {
			returnVal = results[Object.keys(results)[0]];
		}
		callback(null, returnVal);
	});

};


module.exports = Loopalo;