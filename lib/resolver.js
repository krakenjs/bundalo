'use strict';
var resolver = require('file-resolver'),
	contentPath,
	fallback;

var Resolver = function () {

};

Resolver.prototype.init = function (config, bundle) {
	contentPath = config.contentPath;
	fallback = config.fallback;
};
Resolver.prototype.resolve = function (config) {
	//console.log(this.resolver.resolve(bundle, locality).file);
	var _resolver = resolver.create({ root: contentPath, ext: 'properties', fallback: fallback});
	var bundleFile = _resolver.resolve(config.bundle, config.locality).file || contentPath;
	//console.log("bundleFile", bundleFile);
	return {
		"bundleFile": bundleFile,
		"cacheKey": bundleFile.split(contentPath)[1]
	};
};
module.exports = Resolver;