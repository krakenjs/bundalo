/* global describe, it, before */
'use strict';
//var dustjs = require("dustjs-linkedin");
var bundalo = require("../index");
var _bundalo;

describe("bundalo dust bundler, no locale @nofallback@dust@", function () {
	before(function () {
		var i18n = {
			"contentPath": process.cwd() + "/test/fixture/nolocale",
			"fallback": ""
		};
		var engine = "dust";
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
			'bundle': 'nest/dusta'
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
			'bundle': ['nest/dusta', 'nest/dustb']
		}, function bundaloReturn(err, data) {
			if (data['nest/dusta'].greeting && data['nest/dustb'].signoff) {
				done();
			} else {
				done(new Error("life isn't what you thought it would be"));
			}
		});
	});
	it("should give back multiple bundles with alias", function (done) {
		_bundalo.get({
			'bundle': {
				'dusta': 'nest/dusta',
				'dustb': 'nest/dustb'
			}
		}, function bundaloReturn(err, data) {
			if (data.dusta.greeting && data.dustb.signoff) {
				done();
			} else {
				done(new Error("life isn't what you thought it would be"));
			}
		});
	});
});
describe("bundalo dust bundler, fallback locale", function () {
	before(function () {
		var i18n = {
			"contentPath": process.cwd() + "/test/fixture/locales",
			"fallback": "en-US"
		};
		var engine = "dust";
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
			'bundle': 'nest/dusta'
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
			'bundle': ['nest/dusta', 'nest/dustb']
		}, function bundaloReturn(err, data) {
			if (data['nest/dusta'].greeting && data['nest/dustb'].signoff) {
				done();
			} else {
				done(new Error("life isn't what you thought it would be"));
			}
		});
	});
	it("should give back multiple bundles with alias", function (done) {
		_bundalo.get({
			'bundle': {
				'dusta': 'nest/dusta',
				'dustb': 'nest/dustb'
			}
		}, function bundaloReturn(err, data) {
			if (data.dusta.greeting && data.dustb.signoff) {
				done();
			} else {
				done(new Error("life isn't what you thought it would be"));
			}
		});
	});
});

describe("bundalo dust bundler, existing locale @dust@nofallback@", function () {
	before(function () {
		var i18n = {
			"contentPath": process.cwd() + "/test/fixture/locales",
			"fallback": "en-US"
		};
		var engine = "dust";
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
			'bundle': 'nest/dusta'
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
			'bundle': ['nest/dusta', 'nest/dustb']
		}, function bundaloReturn(err, data) {
			if (data['nest/dusta'].greeting && data['nest/dustb'].signoff) {
				done();
			} else {
				done(new Error("life isn't what you thought it would be"));
			}
		});
	});
	it("should give back multiple bundles with alias", function (done) {
		_bundalo.get({
			'bundle': {
				'dusta': 'nest/dusta',
				'dustb': 'nest/dustb'
			}
		}, function bundaloReturn(err, data) {
			if (data.dusta.greeting && data.dustb.signoff) {
				done();
			} else {
				done(new Error("life isn't what you thought it would be"));
			}
		});
	});
});