'use strict';
var fs = require('fs'),
	spud = require('spud'),
	freshy = require('freshy'),
	dust = freshy.freshy('dustjs-linkedin'),
	loopalo = require('../lib/loopalo');



module.exports = function getDust(config, callback) {
	//single bundle config {"bundle": "errors/server", "model": {"name": "Will Robinson"}}
	//multiple bundle config {"bundle": ["errors/server", "errors/client"], "model": {"name": "Will Robinson"}}
	var dustRender = function(cacheKey, model, cb) {
		dust.render(cacheKey, model || {}, function renderCallback(err, out) {
			spud.deserialize(new Buffer(out, 'utf8'), 'properties', function deserializeCallback(err, data) {
				cb(null, data);
			});
		});
	};
	var dustBundler = function (bundleFile, cacheKey, cb) {
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


	loopalo(config, dustBundler, callback);
};