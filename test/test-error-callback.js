/* global describe, it, before */
'use strict';
var assert = require('assert');
var bundalo = require('../index');
var engine = 'dust';
var path = require('path');

describe('bundalo Error callback @callback-errors@', function () {
	it('will gracefully callback with an ENOENT if the contentPath does not exist', function (done) {
		bundalo({
			contentPath: 'locales/',
			engine: engine
		}).get({
			bundle: 'dusta',
			locality: 'en-US'
		}, function (err) {
			assert.equal(err.name, 'Error');
			assert.ok(err.message.indexOf('ENOENT') === 0);
			done();
		});
	});

	it('will gracefully callback with an EISDIR if the locale does not exist', function (done) {
		bundalo({
			contentPath: path.resolve(__dirname, 'fixture', 'locales'),
			engine: engine
		}).get({
			bundle: 'dusta',
			locality: 'ab-CD'
		}, function (err) {
			if (process.platform !== 'win32' && process.platform !== 'win64') {
				assert.equal(err.name, 'Error');
				assert.ok(err.message.indexOf('EISDIR') === 0);
            }
			done();
		});
	});

	it('will gracefully callback with an EISDIR if the bundle does not exist in the contentPath', function (done) {
		bundalo({
			contentPath: path.join(__dirname, 'fixture', 'locales'),
			engine: engine
		}).get({
			bundle: Math.random().toString(),
			locality: 'en-US'
		}, function (err) {
			if (process.platform !== 'win32' && process.platform !== 'win64') {
				assert.equal(err.name, 'Error');
				assert.ok(err.message.indexOf('EISDIR') === 0);
            }
			done();
		});
	});

	it('will gracefully callback with an error if there was a Dust syntax error', function (done) {
		bundalo({
			contentPath: path.join(__dirname, 'fixture', 'locales'),
			engine: engine
		}).get({
			bundle: 'dustbad',
			locality: 'en-US',
			model: {
				'one': 'two'
			}
		}, function (err) {
			assert.equal(err.name, 'SyntaxError');
			done();
		});
	});
});
