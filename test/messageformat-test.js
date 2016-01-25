/* global describe, it, before */
/*eslint no-underscore-dangle: 0*/
'use strict';
var bundalo = require("../index");
var engine = "messageformat";
var path = require('path');
var assert = require('assert');
var thing = require('core-util-is');

describe("bundalo messageformat bundler @messageformat@", function () {
	it("should return IntlMessageFormat instance resolved to a string with a locale", function (done) {
		var contentPath = path.join(__dirname, 'fixture', 'locales');
		var bundle = bundalo({"contentPath": contentPath, "fallback": "en-US", "engine": engine});
		bundle.get({
			bundle: 'complex',
			locality: 'en-US',
			model: {
				numPhotos: 1000
			}
		}, function bundaloReturn(err, data) {
			if (err) {
				return done(err);
			}

			assert.equal(data.value, 'A Value with 1,000 photos.');
			done();
		});
	});
	it("should return IntlMessageFormat instance resolved to a string with a fallback locale", function (done) {
		var contentPath = path.join(__dirname, 'fixture', 'locales');
		var fallback = "en-US";
		var bundle = bundalo({"contentPath": contentPath, "fallback": fallback, "engine": engine});
		bundle.get({
			bundle: 'complex',
			locality: 'fr-FR',
			model: {
				numPhotos: 1000
			}
		}, function bundaloReturn(err, data) {
			if (err) {
				return done(err);
			}

			assert.equal(data.value, 'A Value with 1,000 photos.');
			done();
		});
	});
	it("should return IntlMessageFormat instances with no model", function (done) {
		var contentPath = path.join(__dirname, 'fixture', 'locales');
		var fallback = "";
		var bundle = bundalo({"contentPath": contentPath, "fallback": fallback, "engine": engine});
		bundle.get({
			bundle: 'complex',
			locality: 'en-US'
		}, function bundaloReturn(err, data) {
			if (err) {
				return done(err);
			}

			assert.equal(thing.isObject(data.value), true);
			done();
		});
	});
});
