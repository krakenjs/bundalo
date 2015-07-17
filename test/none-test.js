/* global describe, it, before */
/*eslint no-underscore-dangle: 0*/
'use strict';
var bundalo = require("../index");
var engine = "none";
var path = require('path');

describe("bundalo none bundler @none@", function () {
	it("should maintain one cache per instance", function (done) {
		var contentPath = path.join(__dirname, 'fixture', 'nolocale');
		var fallback = "";
		var bundloo = bundalo({"contentPath": contentPath, "fallback": fallback});
		var bundlee = bundalo({"contentPath": contentPath, "fallback": fallback});
		bundloo.get({
			'bundle': 'nest/nonea',
			'locality': ''
		}, function bundaloReturn(err, data) {
			if (err) {
				return done(err);
			}

			if (data.greeting && bundloo.__cache()[path.normalize('nest/nonea.properties')] && !bundlee.__cache()[path.normalize('nest/nonea.properties')]) {
				done();
			} else {
				done(new Error("Kablamo"));
			}
		});
	});
});

describe("bundalo none bundler @none@disableCache@", function () {
	it("should not maintain cache", function (done) {
		var contentPath = path.join(__dirname, 'fixture', 'nolocale');
		var fallback = "";
		var bundloo = bundalo({"contentPath": contentPath, "engine": engine, "fallback": fallback, "cache": false});
		bundloo.get({
			'bundle': 'nest/nonea',
			'locality': ''
		}, function bundaloReturn(err, data) {
			if (err) {
				return done(err);
			}
			if (data.greeting && !bundloo.__cache()[path.normalize('nest/nonea.properties')]) {
				done();
			} else {
				done(new Error("Kablooey"));
			}
		});
	});
});

describe("bundalo none bundler, no locale @none@nofallback@", function () {
	var contentPath = path.join(__dirname, 'fixture', 'nolocale');
	var fallback = "";
	var _bundalo;
	before(function () {
		_bundalo = bundalo({"contentPath": contentPath, "engine": engine, "fallback": fallback});
		return;
	});

	it("should give back single bundle", function (done) {
		_bundalo.get({
			'bundle': 'nest/nonea',
			'locality': ''
		}, function bundaloReturn(err, data) {
			if (err) {
				return done(err);
			}
			if (data.greeting && _bundalo.__cache()[path.normalize('nest/nonea.properties')]) {
				done();
			} else {
				done(new Error("life isn't what you thought it would be"));
			}
		});
	});
	it("should give back multiple bundles", function (done) {
		_bundalo.get({
			'bundle': ['nest/nonea', 'nest/noneb'],
			'locality': ''
		}, function bundaloReturn(err, data) {
			if (err) {
				return done(err);
			}
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
			},
			'locality': ''
		}, function bundaloReturn(err, data) {
			if (err) {
				return done(err);
			}
			if (data.nonea.greeting && data.noneb.signoff) {
				done();
			} else {
				done(new Error("life isn't what you thought it would be"));
			}
		});
	});
});
//
//
describe("bundalo none bundler, existing locale @none@nofallback@", function () {
	var contentPath = path.join(__dirname, "fixture", "locales");
	var fallback = "en-US";
	var _bundalo;
	before(function () {
		_bundalo = bundalo({"contentPath": contentPath, "engine": engine, "fallback": fallback});
		return;
	});
	it("should give back single bundle", function (done) {
		_bundalo.get({
			'bundle': 'nest/nonea',
			'locality': 'es-ES'
		}, function bundaloReturn(err, data) {
			if (err) {
				return done(err);
			} else if (data.greeting) {
				done();
			} else {
				done(new Error("life isn't what you thought it would be"));
			}
		});
	});
	it("should give back multiple bundles", function (done) {
		_bundalo.get({
			'bundle': ['nest/nonea', 'nest/noneb'],
			'locality': 'es-ES'
		}, function bundaloReturn(err, data) {
			if (err) {
				return done(err);
			}
			if (data['nest/nonea'].greeting && data['nest/noneb'].signoff && _bundalo.__cache()[path.normalize('ES/es/nest/noneb.properties')]) {
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
			},
			'locality': 'es-ES'
		}, function bundaloReturn(err, data) {
			if (err) {
				return done(err);
			}
			if (data.nonea.greeting && data.noneb.signoff) {
				done();
			} else {
				done(new Error("life isn't what you thought it would be"));
			}
		});
	});
});

describe("bundalo none bundler, fallback locale @none@fallback@", function () {
	var contentPath = path.join(__dirname, "fixture", "locales");
	var fallback = "en-US";
	var locality = "fr-FR";
	var _bundalo;
	before(function () {
		_bundalo = bundalo({
			'contentPath': contentPath,
			'locality': locality,
			'fallback': fallback
		});
		return;
	});
	it("should give back single bundle", function (done) {
		_bundalo.get({
			'bundle': 'nest/nonea'
		}, function bundaloReturn(err, data) {
			if (err) {
				return done(err);
			}
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
			if (err) {
				return done(err);
			}
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
			if (err) {
				return done(err);
			}
			if (data.nonea.greeting && data.noneb.signoff) {
				done();
			} else {
				done(new Error("life isn't what you thought it would be"));
			}
		});
	});
});
