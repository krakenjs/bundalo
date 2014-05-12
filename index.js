'use strict';

function Bundalo(config) {
	var resolver = require('./lib/resolver');

	var _bundler;
	//look for any config errors here
	if (config.contentPath === undefined || config.engine === undefined) {
		throw new Error("[bundalo] Please provide a contentPath and engine on the config parameter");
	}
	try {
		_bundler = require("./bundler/" + config.engine);
	} catch (err) {
		throw new Error("[bundalo] Please provide a valid engine property on the config parameter");
	}
	resolver.init(config);
	return _bundler;
}

module.exports = Bundalo;

