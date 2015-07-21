/* global describe, it, before */
'use strict';
var assert = require('assert');
var bundalo = require('../index');
var path = require('path');

describe('bundalo Error callback @callback-errors@', function () {
	it('will gracefully callback with an ENOENT if the contentPath does not exist', function (done) {
		bundalo({
			contentPath: 'locales/'
		}).get({
			bundle: 'nonea',
			locality: 'en-US'
		}, function (err) {
			assert.ok(err);
			assert.equal(err.name, 'Error');
			assert.ok(err.message.indexOf('ENOENT') === 0);
			done();
		});
	});

	it('will gracefully callback with an ENOENT if the locale does not exist', function (done) {
		bundalo({
			contentPath: path.resolve(__dirname, 'fixture', 'locales')
		}).get({
			bundle: 'nonea',
			locality: 'ab-CD'
		}, function (err) {
			if (process.platform !== 'win32' && process.platform !== 'win64') {
				assert.ok(err);
				assert.equal(err.name, 'Error');
				assert.ok(err.message.indexOf('ENOENT') === 0);
			}
			done();
		});
	});

	it('will gracefully callback with an ENOENT if the bundle does not exist in the contentPath', function (done) {
		bundalo({
			contentPath: path.join(__dirname, 'fixture', 'locales')
		}).get({
			bundle: 'does not exist',
			locality: 'en-US'
		}, function (err) {
			if (process.platform !== 'win32' && process.platform !== 'win64') {
				assert.ok(err);
				assert.equal(err.name, 'Error');
				assert.ok(err.message.indexOf('ENOENT') === 0);
			}
			done();
		});
	});

});
