'use strict';
var dust = require("./dust");
var none = require("./none");
exports.dust = function () {
	return dust;
};
exports.none = function () {
	return none;
};