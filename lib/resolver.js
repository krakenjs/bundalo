'use strict';
var resolver = require('file-resolver'),
	locality,
	i18n;

var Resolver = function () {

};

Resolver.prototype.init = function (config, bundle) {
	i18n = config.i18n;
	locality = config.locality;
	this.resolver = resolver.create({ root: i18n.contentPath, ext: 'properties', fallback: i18n.fallback});
};
Resolver.prototype.resolve = function (bundle) {
	//console.log(this.resolver.resolve(bundle, locality).file);
	var bundleFile = this.resolver.resolve(bundle, locality).file || i18n.contentPath;
	return {
		"bundleFile": bundleFile,
		"cacheKey": bundleFile.split(i18n.contentPath)[1]
	};
};
module.exports = new Resolver();