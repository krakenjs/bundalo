/* global describe, it, before */
'use strict';
//var dustjs = require("dustjs-linkedin");
var bundalo = require("../index");
var _bundalo;

describe("bundalo none bundler, no locale @none@nofallback@", function () {
	before(function () {
		var i18n = {
			"contentPath": process.cwd() + "/test/fixture/nolocale",
			"fallback": ""
		};
		var engine = "none";
		var locality = "";
		_bundalo = bundalo({
			'i18n': i18n,
			'locality': locality,
			'engine': engine
		});
		return;
	});
	it("should give back single bundle", function (done) {
		_bundalo.get({
			'bundle': 'nest/nonea'
		}, function bundaloReturn(err, data) {
			if (data.greeting && _bundalo.__cache()['/nest/nonea.properties']) {
				done();
			} else {
				done(new Error("life isn't what you thought it would be"));
			}
		});
	});
	it("should give back multiple bundles", function (done) {
		_bundalo.get({
			'bundle': ['nest/nonea', 'nest/noneb']
		}, function bundaloReturn(err, data) {
			if (data['nest/nonea'].greeting && data['nest/noneb'].signoff) {
				done();
			} else {
				done(new Error("life isn't what you thought it would be"));
			}
		});
	});
	it("should give back multiple bundles with alias", function (done) {
		_bundalo.get({
			'bundle': {
				'nonea': 'nest/nonea',
				'noneb': 'nest/noneb'
			}
		}, function bundaloReturn(err, data) {
			if (data.nonea.greeting && data.noneb.signoff) {
				done();
			} else {
				done(new Error("life isn't what you thought it would be"));
			}
		});
	});
});
describe("bundalo none bundler, fallback locale", function () {
	before(function () {
		var i18n = {
			"contentPath": process.cwd() + "/test/fixture/locales",
			"fallback": "en-US"
		};
		var engine = "none";
		var locality = "fr-FR";
		_bundalo = bundalo({
			'i18n': i18n,
			'locality': locality,
			'engine': engine
		});
		return;
	});
	it("should give back single bundle", function (done) {
		_bundalo.get({
			'bundle': 'nest/nonea'
		}, function bundaloReturn(err, data) {
			if (data.greeting) {
				done();
			} else {
				done(new Error("life isn't what you thought it would be"));
			}
		});
	});
	it("should give back multiple bundles", function (done) {
		_bundalo.get({
			'bundle': ['nest/nonea', 'nest/noneb']
		}, function bundaloReturn(err, data) {
			if (data['nest/nonea'].greeting && data['nest/noneb'].signoff) {
				done();
			} else {
				done(new Error("life isn't what you thought it would be"));
			}
		});
	});
	it("should give back multiple bundles with alias", function (done) {
		_bundalo.get({
			'bundle': {
				'nonea': 'nest/nonea',
				'noneb': 'nest/noneb'
			}
		}, function bundaloReturn(err, data) {
			if (data.nonea.greeting && data.noneb.signoff) {
				done();
			} else {
				done(new Error("life isn't what you thought it would be"));
			}
		});
	});
});

describe("bundalo none bundler, existing locale @none@nofallback@", function () {
	before(function () {
		var i18n = {
			"contentPath": process.cwd() + "/test/fixture/locales",
			"fallback": "en-US"
		};
		var engine = "none";
		var locality = "es-ES";
		_bundalo = bundalo({
			'i18n': i18n,
			'locality': locality,
			'engine': engine
		});
		return;
	});
	it("should give back single bundle", function (done) {
		_bundalo.get({
			'bundle': 'nest/nonea'
		}, function bundaloReturn(err, data) {
			if (data.greeting) {
				done();
			} else {
				done(new Error("life isn't what you thought it would be"));
			}
		});
	});
	it("should give back multiple bundles", function (done) {
		_bundalo.get({
			'bundle': ['nest/nonea', 'nest/noneb']
		}, function bundaloReturn(err, data) {
			if (data['nest/nonea'].greeting && data['nest/noneb'].signoff && _bundalo.__cache()['/ES/es/nest/noneb.properties']) {
				done();
			} else {
				done(new Error("life isn't what you thought it would be"));
			}
		});
	});
	it("should give back multiple bundles with alias", function (done) {
		_bundalo.get({
			'bundle': {
				'nonea': 'nest/nonea',
				'noneb': 'nest/noneb'
			}
		}, function bundaloReturn(err, data) {
			if (data.nonea.greeting && data.noneb.signoff) {
				done();
			} else {
				done(new Error("life isn't what you thought it would be"));
			}
		});
	});
});