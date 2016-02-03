/* global describe, it, before */
/*eslint no-underscore-dangle: 0*/
'use strict';
var bundalo = require('../index');
var path = require('path');
var assert = require('assert');
var formatPath = require('kraken-format-path');
var formatter = require('./intlFormatter');


describe('bundalo with @custom-formatter@', function () {
    it('should format messages given a model', function (done) {
        var contentPath = path.resolve(__dirname, 'fixture', 'locales');
        var locality = 'de-DE';
        var bundloo = bundalo({
            contentPath: contentPath,
            formatter: formatter,
            formatPath: formatPath }
        );
        bundloo.get({
            'bundle': 'complex',
            'locality': locality
        }, function bundaloReturn(err, bundle) {
            if (err) {
                return done(err);
            }
            var IntlMessageFormatObj = bundle.get('value');
            var formatted = IntlMessageFormatObj.format({numPhotos: 1234633.342});
            //this only works if you install de-DE locale info and tell node about it
            // see: https://www.npmjs.com/package/full-icu
            assert.equal(formatted, 'Der Value ist 1.234.633,342');
            done();
        });
    });


});
