/* global describe, it, before */
/*eslint no-underscore-dangle: 0*/
'use strict';
var bundalo = require("../index");
var engine = "none";
var path = require('path');
var assert = require('assert');

describe("bundalo none bundler @none@", function () {
	it("should maintain one cache per instance", function (done) {
		var contentPath = path.resolve(__dirname, 'fixture', 'nolocale');
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

			try {
				assert(data.greeting);
				assert(bundloo.__cache()[path.resolve(contentPath, 'nest/nonea.properties')]);
				assert(!bundlee.__cache()[path.resolve(contentPath, 'nest/nonea.properties')]);
				done();
			} catch (e) {
				done(e);
			}
		});
	});
});

describe("bundalo none bundler @none@disableCache@", function () {
	it("should not maintain cache", function (done) {
		var contentPath = path.resolve(__dirname, 'fixture', 'nolocale');
		var fallback = "";
		var bundloo = bundalo({"contentPath": contentPath, "engine": engine, "fallback": fallback, "cache": false});
		bundloo.get({
			'bundle': 'nest/nonea',
			'locality': ''
		}, function bundaloReturn(err, data) {
			if (err) {
				return done(err);
			}
			try {
				assert(data.greeting);
				assert(!bundloo.__cache()[path.resolve(contentPath, 'nest/nonea.properties')]);
				done();
			} catch (e) {
				done(e);
			}
		});
	});
});

describe("bundalo none bundler, no locale @none@nofallback@", function () {
	var contentPath = path.resolve(__dirname, 'fixture', 'nolocale');
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
			try {
				assert(data.greeting);
				assert(_bundalo.__cache()[path.resolve(contentPath, 'nest/nonea.properties')]);
				done();
			} catch (e) {
				done(e);
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
			try {
				assert(data['nest/nonea'].greeting);
				assert(data['nest/noneb'].signoff);
				done();
			} catch (e) {
				done(e);
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
			try {
				assert(data.nonea.greeting);
				assert(data.noneb.signoff);
				done();
			} catch (e) {
				done(e);
			}
		});
	});
});
//
//
describe("bundalo none bundler, existing locale @none@nofallback@", function () {
	var contentPath = path.resolve(__dirname, "fixture", "locales");
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
			}

			try {
				assert(data.greeting);
				done();
			} catch (e) {
				done(e);
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
			try {
				assert(data['nest/nonea'].greeting);
				assert(data['nest/noneb'].signoff);
				assert(_bundalo.__cache()[path.resolve(contentPath, 'ES/es/nest/noneb.properties')]);
				done();
			} catch (e) {
				done(e);
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
			try {
				assert(data.nonea.greeting);
				assert(data.noneb.signoff);
				done();
			} catch (e) {
				done(e);
			}
		});
	});
});

describe("bundalo none bundler, fallback locale @none@fallback@", function () {
	var contentPath = path.resolve(__dirname, "fixture", "locales");
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
			try {
				assert(data.greeting);
				done();
			} catch (e) {
				done(e);
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

			try {
				assert(data['nest/nonea'].greeting);
				assert(data['nest/noneb'].signoff);
				done();
			} catch (e) {
				done(e);
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
			try {
				assert(data.nonea.greeting);
				assert(data.noneb.signoff);
				done();
			} catch (e) {
				done(e);
			}
		});
	});
});

describe("bundalo with dust", function () {
	it("should format messages given a model", function (done) {
		var contentPath = path.resolve(__dirname, 'fixture', 'nolocale');
		var bundloo = bundalo({"contentPath": contentPath});
		bundloo.get({
			'bundle': 'nest/dusta',
			'locality': ''
		}, function bundaloReturn(err, data) {
			if (err) {
				return done(err);
			}

            data.formatDust('greeting', { name: 'World' }, function (innererr, rendered) {
                if (innererr) {
                    return done(innererr);
                }

                try {
                    assert.equal(rendered, "Hello, World");
                    done();
                } catch (e) {
                    done(e);
                }
            });
		});
	});
	it("should have a simple accessor function", function (done) {
		var contentPath = path.resolve(__dirname, 'fixture', 'nolocale');
		var bundloo = bundalo({"contentPath": contentPath});
		bundloo.get({
			'bundle': 'nest/dusta',
			'locality': ''
		}, function bundaloReturn(err, data) {
			if (err) {
				return done(err);
			}

            try {
                var value = data.get('greeting');
                assert.equal(value, "Hello, {name}");
                done();
            } catch (e) {
                done(e);
            }
		});
	});
});
