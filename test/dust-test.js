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
			bundle: 'nest/dusta',
			locality: '',
			model: {
				name: "World"
			}
		}, function bundaloReturn(err, data) {
			if (err) {
				return done(err);
			}
			try {
				assert.equal(data.greeting, "Hello, World");
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
			bundle: 'nest/dusta',
			locality: '',
			model: {
				name: 'World'
			}
		}, function bundaloReturn(err, data) {
			if (err) {
				return done(err);
			}
			try {
				assert.equal(data.greeting, "Hello, World");
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
			bundle: 'nest/dusta',
			locality: '',
			model: {
				name: "World"
			}
		}, function bundaloReturn(err, data) {
			if (err) {
				return done(err);
			}
			try {
				assert.equal(data.greeting, "Hello, World");
				assert.ok(_bundalo.__cache()[path.normalize('nest/dusta.properties')]);
				done();
			} catch (e) {
				done(e);
			}
		});
	});
	it("should give back bundle with key when config.bundle is an Array", function (done) {
		_bundalo.get({
			bundle: ['nest/dusta'],
			locality: '',
			model: {
				name: "World"
			}
		}, function bundaloReturn(err, data) {
			if (err) {
				return done(err);
			}
			try {
				assert.equal(data['nest/dusta'].greeting, "Hello, World");
				assert.ok(_bundalo.__cache()[path.normalize('nest/dusta.properties')]);
				done();
			} catch (e) {
				done(e);
			}
		});
	});
	it("should give back multiple bundles", function (done) {
		_bundalo.get({
			bundle: ['nest/dusta', 'nest/dustb'],
			locality: '',
			model: {
				name: "World"
			}
		}, function bundaloReturn(err, data) {
			if (err) {
				return done(err);
			}
			try {
				assert.equal(data['nest/dusta'].greeting, "Hello, World");
				assert.equal(data['nest/dustb'].signoff, "Goodbye, World");
				done();
			} catch (e) {
				done(e);
			}
		});
	});
	it("should give back multiple bundles with alias", function (done) {
		_bundalo.get({
			bundle: {
				dusta: 'nest/dusta',
				dustb: 'nest/dustb'
			},
			locality: '',
			model: {
				name: "World"
			}
		}, function bundaloReturn(err, data) {
			if (err) {
				return done(err);
			}
			try {
				assert.equal(data.dusta.greeting, "Hello, World");
				assert.equal(data.dustb.signoff, "Goodbye, World");
				done();
			} catch (e) {
				done(e);
			}
		});
	});
});


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
			bundle: 'nest/dusta',
			locality: 'es-ES',
			model: {
				name: "Mundo"
			}
		}, function bundaloReturn(err, data) {
			if (err) {
				return done(err);
			}
			try {
				assert.equal(data.greeting, "Hola al Mundo");
				done();
			} catch (e) {
				done(e);
			}
		});
	});
	it("should give back multiple bundles", function (done) {
		_bundalo.get({
			bundle: ['nest/dusta', 'nest/dustb'],
			locality: 'es-ES',
			model: {
				name: "Mundo"
			}
		}, function bundaloReturn(err, data) {
			if (err) {
				return done(err);
			}
			try {
				assert.equal(data['nest/dusta'].greeting, "Hola al Mundo");
				assert.equal(data['nest/dustb'].signoff, "Adios al Mundo!");
				assert.ok(_bundalo.__cache()[path.normalize('ES/es/nest/dustb.properties')]);
				done();
			} catch (e) {
				done(e);
			}
		});
	});
	it("should give back multiple bundles with alias", function (done) {
		_bundalo.get({
			bundle: {
				dusta: 'nest/dusta',
				dustb: 'nest/dustb'
			},
			locality: 'es-ES',
			model: {
				name: "Mundo"
			}
		}, function bundaloReturn(err, data) {
			if (err) {
				return done(err);
			}
			try {
				assert.equal(data.dusta.greeting, "Hola al Mundo");
				assert.equal(data.dustb.signoff, "Adios al Mundo!");
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
			contentPath: contentPath,
			locality: locality,
			fallback: fallback,
			engine: 'dust'
		});
		return;
	});
	it("should give back single bundle", function (done) {
		_bundalo.get({
			bundle: 'nest/dusta',
			model: {
				name: 'Mundo'
			}
		}, function bundaloReturn(err, data) {
			if (err) {
				return done(err);
			}
			try {
				assert.equal(data.greeting, "Hola al Mundo");
				done();
			} catch (e) {
				done(e);
			}
		});
	});
	it("should give back multiple bundles", function (done) {
		_bundalo.get({
			bundle: ['nest/dusta', 'nest/dustb'],
			model: {
				name: "Mundo"
			}
		}, function bundaloReturn(err, data) {
			if (err) {
				return done(err);
			}
			try {
				assert.equal(data['nest/dusta'].greeting, "Hola al Mundo");
				assert.equal(data['nest/dustb'].signoff, "Adios al Mundo!");
				done();
			} catch (e) {
				done(e);
			}
		});
	});
	it("should give back multiple bundles with alias", function (done) {
		_bundalo.get({
			bundle: {
				dusta: 'nest/dusta',
				dustb: 'nest/dustb'
			},
			model: {
				name: "Mundo"
			}
		}, function bundaloReturn(err, data) {
			if (err) {
				return done(err);
			}
			try {
				assert.equal(data.dusta.greeting, "Hola al Mundo");
				assert.equal(data.dustb.signoff, "Adios al Mundo!");
				done();
			} catch (e) {
				done(e);
			}
		});
	});
});

describe("bundalo dust bundler, existing locale, country group, @dust@nofallback@locale@countrygroup@", function () {
	var contentPath = process.cwd() + "/test/fixture/locales";
	var fallback = "en-US";
	var _bundalo;
	before(function () {
		_bundalo = bundalo({"contentPath": contentPath, "engine": engine, "fallback": fallback});
		return;
	});

	it("should give back the group_B bundle", function (done) {
		_bundalo.get({
			bundle: 'nest/dusta',
			locality: {country: 'group_B', language: 'es', locale: 'es_group_B'},
			model: {
				name: "Mundo"
			}
		}, function bundaloReturn(err, data) {
			if (err) {
				return done(err);
			}
			try {
				assert.equal(data.greeting, "Hola al Mundo group b");
				done();
			} catch (e) {
				done(e);
			}
		});
	});
});

