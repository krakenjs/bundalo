'use strict';
var resolver = require('./lib/resolver');

var Bundalo = function (config) {
	var bundler = require("./bundler/" + config.engine);
	resolver.init(config);
	return bundler;
};
module.exports = Bundalo;

