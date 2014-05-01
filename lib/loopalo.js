'use strict';
var async = require('async'),
	returnalo = require('../lib/returnalo');

var Loopalo = function(config, handler, callback) {
	var bundleRenderer = {};
	var configBundle = (config.bundle.constructor === Array) ? config.bundle : [config.bundle];
	configBundle.forEach(handler);

	async.parallel(bundleRenderer, returnalo(callback));

};


module.exports = Loopalo;