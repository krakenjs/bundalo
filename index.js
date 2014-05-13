'use strict';

function bundalo(config) {
	var Bundler;
	var engine = config.engine || 'none';
	if (config.contentPath === undefined) {
		throw new Error("[bundalo] Please provide a contentPath");
	}
	try {
		Bundler = require("./bundler/" + engine);
	} catch (err) {
		throw new Error("[bundalo] Please provide a valid engine property on the config parameter");
	}
	return new Bundler(config);
}
module.exports = bundalo;

