'use strict';
var fs = require('fs'),
	spud = require('spud'),
	freshy = require('freshy'),
	loopalo = require('../lib/loopalo'),
	doost = require('dustjs-linkedin');



var Dust = function (config) {
	this.dust = freshy.freshy('dustjs-linkedin');
	this.resolver = new (require('../lib/resolver'))();
	this.resolver.init(config);
};

Dust.prototype.get = function (config, callback) {
	//single bundle config {"bundle": "errors/server", "model": {"name": "Will Robinson"}}
	//multiple bundle config {"bundle": ["errors/server", "errors/client"], "model": {"name": "Will Robinson"}}
	var that = this;
	var dustRender = function (cacheKey, model, cb) {
		that.dust.render(cacheKey, model || {}, function renderCallback(err, out) {
			spud.deserialize(new Buffer(out, 'utf8'), 'properties', function deserializeCallback(err, data) {
				cb(null, data);
			});
		});
	};
	var dustBundler = function (bundleFile, cacheKey, cb) {
		if (that.dust.cache && that.dust.cache[cacheKey]) {
			dustRender(cacheKey, config.model, cb);
			return;
		}

		//not yet in cache
		fs.readFile(bundleFile, {}, function handleBundleBuffer(err, bundleBuffer) {
			var compiled = that.dust.compile(bundleBuffer.toString(), cacheKey);
			that.dust.loadSource(compiled);
			//that.dust.cache[cacheKey] = compiled;
			dustRender(cacheKey, config.model, cb);
		});
	};


	loopalo(config, this.resolver, dustBundler, callback);
};

Dust.prototype.__cache = function () {
		return this.dust.cache;
};

module.exports = Dust;