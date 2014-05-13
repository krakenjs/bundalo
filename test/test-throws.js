/* global describe, it, before */
'use strict';
var assert = require('assert');
var bundalo = require("../index");
var engine = "dust";

describe("bundalo Error conditions @errors@", function () {
	it("will throw an error with no contentPath", function (done) {
		assert.throws(
			function () {
				new bundalo({"engine": "dust"});
			},
			Error
		);
		done();
	});
//	it("will throw an error with no engine", function (done) {
//		assert.throws(
//			function () {
//				var ret = new bundalo({"contentPath": "./"});
//			},
//			Error
//		);
//		done();
//	});
	it("will throw an error with non-existent engine", function (done) {
		assert.throws(
			function () {
				var ret = new bundalo({"engine": "raptorjs", "contentPath": "./"});
			},
			Error
		);
		done();
	});
});