/* global describe, it, before */
'use strict';
var assert = require('assert');
var bundalo = require("../index");

describe("bundalo Error conditions @errors@", function () {
	it("will throw an error with no contentPath", function (done) {
		assert.throws(function () {
			bundalo({});
		}, Error);
		done();
	});
});
