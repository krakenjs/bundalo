/* global describe, it, before */
'use strict';
//var dustjs = require("dustjs-linkedin");
var dust = require('dustjs-linkedin');
var bundalo = require("../index");
var engine = "dust";

describe("bundalo dust bundler @dust@", function () {
	it("should maintain one cache per instance", function (done) {
		var contentPath =  process.cwd() + "/test/fixture/nolocale";
		var fallback =  "";
		var bundloo = bundalo({"contentPath": contentPath, "engine": engine, "fallback": fallback});
		var bundlee = bundalo({"contentPath": contentPath, "engine": engine, "fallback": fallback});
		bundloo.get({
			'bundle': 'nest/dusta',
			'locality': ''
		}, function bundaloReturn(err, data) {
			if (data.greeting && bundloo.__cache()['/nest/dusta.properties'] && !bundlee.__cache()['/nest/dusta.properties']) {
				done();
			} else {
				done(new Error("Kablooey"));
			}
		});
	});
});

describe("bundalo dust bundler @dust@disableCache@", function () {
	it("should not maintain cache", function (done) {
		var contentPath =  process.cwd() + "/test/fixture/nolocale";
		var fallback =  "";
		var bundloo = bundalo({"contentPath": contentPath, "engine": engine, "fallback": fallback, "cache": false});
		bundloo.get({
			'bundle': 'nest/dusta',
			'locality': ''
		}, function bundaloReturn(err, data) {
			console.log(bundloo.__cache());
			if (data.greeting && !bundloo.__cache()['/nest/dusta.properties']) {
				done();
			} else {
				done(new Error("Kablooey"));
			}
		});
	});
});

describe("bundalo dust bundler, no locale @dust@nofallback@nolocale@", function () {
	var contentPath = process.cwd() + "/test/fixture/nolocale";
	var fallback = "";
	var _bundalo;
	before(function () {
		_bundalo = bundalo({"contentPath": contentPath, "engine": engine, "fallback": fallback});
		return;
	});

	it("should give back single bundle with no key when config.bundle is a string", function (done) {
		_bundalo.get({
			'bundle': 'nest/dusta',
			'locality': ''
		}, function bundaloReturn(err, data) {
			if (data.greeting && _bundalo.__cache()['/nest/dusta.properties']) {
				done();
			} else {
				done(new Error("life isn't what you thought it would be"));
			}
		});
	});
	it("should give back bundle with key when config.bundle is an Array", function (done) {
		_bundalo.get({
			'bundle': ['nest/dusta'],
			'locality': ''
		}, function bundaloReturn(err, data) {
			if (data['nest/dusta'].greeting && _bundalo.__cache()['/nest/dusta.properties']) {
				done();
			} else {
				done(new Error("life isn't what you thought it would be"));
			}
		});
	});
	it("should give back multiple bundles", function (done) {
		_bundalo.get({
			'bundle': ['nest/dusta', 'nest/dustb'],
			'locality': ''
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
			},
			'locality': ''
		}, function bundaloReturn(err, data) {
			if (data.dusta.greeting && data.dustb.signoff) {
				done();
			} else {
				done(new Error("life isn't what you thought it would be"));
			}
		});
	});
});
//
//
describe("bundalo dust bundler, existing locale @dust@nofallback@locale@", function () {
	var contentPath = process.cwd() + "/test/fixture/locales";
	var fallback = "en-US";
	var _bundalo;
	before(function () {
		_bundalo = bundalo({"contentPath": contentPath, "engine": engine, "fallback": fallback});
		return;
	});

	it("should give back single bundle", function (done) {
		_bundalo.get({
			'bundle': 'nest/dusta',
			'locality': 'es-ES'
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
			'bundle': ['nest/dusta', 'nest/dustb'],
			'locality': 'es-ES'
		}, function bundaloReturn(err, data) {
			if (data['nest/dusta'].greeting && data['nest/dustb'].signoff && _bundalo.__cache()['/ES/es/nest/dustb.properties']) {
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
			},
			'locality': 'es-ES'
		}, function bundaloReturn(err, data) {
			if (data.dusta.greeting && data.dustb.signoff) {
				done();
			} else {
				done(new Error("life isn't what you thought it would be"));
			}
		});
	});
});


describe("bundalo dust bundler, fallback locale @dust@fallback@", function () {
	var contentPath = process.cwd() + "/test/fixture/locales";
	var fallback = "es-ES";
	var locality = "fr-FR";
	var _bundalo;
	before(function () {
		_bundalo = bundalo({
			'contentPath': contentPath,
			'locality': locality,
			'fallback': fallback,
			'engine': 'dust'
		});
		return;
	});
	it("should give back single bundle", function (done) {
		_bundalo.get({
			'bundle': 'nest/dusta',
			'model': {'name': 'Friend'}
		}, function bundaloReturn(err, data) {
			if (data.greeting) {
				console.log(data.greeting);
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