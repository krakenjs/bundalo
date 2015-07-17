/* global describe, it, before */
/*eslint no-underscore-dangle: 0*/
'use strict';
var bundalo = require("../index");
var engine = "dust";
var path = require('path');
var assert = require('assert');

describe("bundalo dust bundler @dust@", function () {
	it("should maintain one cache per instance", function (done) {
		var contentPath = path.join(__dirname, "fixture", "nolocale");
		var fallback = "";
		var bundloo = bundalo({"contentPath": contentPath, "engine": engine, "fallback": fallback});
		var bundlee = bundalo({"contentPath": contentPath, "engine": engine, "fallback": fallback});
		bundloo.get({
			'bundle': 'nest/dusta',
			'locality': ''
		}, function bundaloReturn(err, data) {
			if (err) {
				return done(err);
			}
			try {
				assert.ok(data.greeting);
				assert.ok(bundloo.__cache()[path.normalize('nest/dusta.properties')]);
				assert.ok(!bundlee.__cache()[path.normalize('nest/dusta.properties')]);
				done();
			} catch (e) {
				done(e);
			}
		});
	});
});

describe("bundalo dust bundler @dust@disableCache@", function () {
	it("should not maintain cache", function (done) {
		var contentPath = path.join(__dirname, "fixture", "nolocale");
		var fallback = "";
		var bundloo = bundalo({"contentPath": contentPath, "engine": engine, "fallback": fallback, "cache": false});
		bundloo.get({
			'bundle': 'nest/dusta',
			'locality': ''
		}, function bundaloReturn(err, data) {
			if (err) {
				return done(err);
			}
			try {
				assert.ok(data.greeting);
				assert.ok(!bundloo.__cache()[path.normalize('nest/dusta.properties')]);
				done();
			} catch (e) {
				done(e);
			}
		});
	});
});

describe("bundalo dust bundler, no locale @dust@nofallback@nolocale@", function () {
	var contentPath = path.join(__dirname, "fixture", "nolocale");
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
			if (err) {
				return done(err);
			}
			try {
				assert.ok(data.greeting);
				assert.ok(_bundalo.__cache()[path.normalize('nest/dusta.properties')]);
				done();
			} catch (e) {
				done(e);
			}
		});
	});
	it("should give back bundle with key when config.bundle is an Array", function (done) {
		_bundalo.get({
			'bundle': ['nest/dusta'],
			'locality': ''
		}, function bundaloReturn(err, data) {
			if (err) {
				return done(err);
			}
			try {
				assert.ok(data['nest/dusta'].greeting);
				assert.ok(_bundalo.__cache()[path.normalize('nest/dusta.properties')]);
				done();
			} catch (e) {
				done(e);
			}
		});
	});
	it("should give back multiple bundles", function (done) {
		_bundalo.get({
			'bundle': ['nest/dusta', 'nest/dustb'],
			'locality': ''
		}, function bundaloReturn(err, data) {
			if (err) {
				return done(err);
			}
			try {
				assert.ok(data['nest/dusta'].greeting);
				assert.ok(data['nest/dustb'].signoff);
				done();
			} catch (e) {
				done(e);
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
			if (err) {
				return done(err);
			}
			try {
				assert.ok(data.dusta.greeting);
				assert.ok( data.dustb.signoff);
				done();
			} catch (e) {
				done(e);
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
			if (err) {
				return done(err);
			}
			try {
				assert.ok(data.greeting);
				done();
			} catch (e) {
				done(e);
			}
		});
	});
	it("should give back multiple bundles", function (done) {
		_bundalo.get({
			'bundle': ['nest/dusta', 'nest/dustb'],
			'locality': 'es-ES'
		}, function bundaloReturn(err, data) {
			if (err) {
				return done(err);
			}
			try {
				assert.ok(data['nest/dusta'].greeting);
				assert.ok(data['nest/dustb'].signoff);
				assert.ok(_bundalo.__cache()[path.normalize('ES/es/nest/dustb.properties')]);
				done();
			} catch (e) {
				done(e);
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
			if (err) {
				return done(err);
			}
			try {
				assert.ok(data.dusta.greeting);
				assert.ok( data.dustb.signoff);
				done();
			} catch (e) {
				done(e);
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
			if (err) {
				return done(err);
			}
			try {
				assert.ok(data.greeting);
				done();
			} catch (e) {
				done(e);
			}
		});
	});
	it("should give back multiple bundles", function (done) {
		_bundalo.get({
			'bundle': ['nest/dusta', 'nest/dustb']
		}, function bundaloReturn(err, data) {
			if (err) {
				return done(err);
			}
			try {
				assert.ok(data['nest/dusta'].greeting);
				assert.ok(data['nest/dustb'].signoff);
				done();
			} catch (e) {
				done(e);
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
			if (err) {
				return done(err);
			}
			try {
				assert.ok(data.dusta.greeting);
				assert.ok(data.dustb.signoff);
				done();
			} catch (e) {
				done(e);
			}
		});
	});
});
