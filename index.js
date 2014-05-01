var resolver = require('./lib/resolver'),
	get = require("./get");

var Bundalo = function (config) {
	resolver.init(config);
	return {
		"get": get[config.engine](config)
	}
};
module.exports = Bundalo;

