'use strict';
var fs = require('fs'),
	spud = require('spud'),
	resolver = require('../lib/resolver'),
	freshy = require('freshy'),
	dust = freshy.freshy('dustjs-linkedin'),
	loopalo = require('../lib/loopalo'),
	returnalo = require('../lib/returnalo'),
	async = require('async');

var dustRender = function (cacheKey, model, cb) {
	dust.render(cacheKey, model || {}, function renderCallback(err, out) {
		spud.deserialize(new Buffer(out, 'utf8'), 'properties', function deserializeCallback(err, data) {
			cb(null, data);
		});
	});
};

module.exports = function getDust(config, callback) {
	//single bundle config {"bundle": "errors/server", "model": {"name": "Will Robinson"}}
	//multiple bundle config {"bundle": ["errors/server", "errors/client"], "model": {"name": "Will Robinson"}}

	//var bundleRenderer = {};
	var handler = function processBundle(bundle) {
		var resolved = resolver.resolve(bundle);
		bundleRenderer[bundle] = function (cb) {
			//create a bundle key based on bundle name and locality info
			//var reso = resolver.create({ root: i18n.contentPath, ext: 'properties', fallback: i18n.fallback});
			var bundleFile = resolved.bundleFile;
			var cacheKey = resolved.cacheKey;

			if (dust.cache && dust.cache[cacheKey]) {
				//console.log("bundalo:dust:incache:",cacheKey);
				dustRender(cacheKey, config.model, cb);
				return;
			}

			//not yet in cache
			fs.readFile(bundleFile, {}, function handleBundleBuffer(err, bundleBuffer) {
				//console.log("bundalo:dust:outcache:",cacheKey);
				var compiled = dust.compile(bundleBuffer.toString(), cacheKey);
				dust.loadSource(compiled);
				dustRender(cacheKey, config.model, cb);
			});
		};
	}
	loopalo(config, handler, callback);
	//assume config.bundle is either an array of bundle strings or a string
	//var configBundle = (config.bundle.constructor === Array) ? config.bundle : [config.bundle];

	// configBundle.forEach();

	// async.parallel(bundleRenderer, returnalo(callback));
};