/*───────────────────────────────────────────────────────────────────────────*\
 │  Copyright (C) 2014 eBay Software Foundation                                │
 │                                                                             │
 │hh ,'""`.                                                                    │
 │  / _  _ \  Licensed under the Apache License, Version 2.0 (the "License");  │
 │  |(@)(@)|  you may not use this file except in compliance with the License. │
 │  )  __  (  You may obtain a copy of the License at                          │
 │ /,'))((`.\                                                                  │
 │(( ((  )) ))    http://www.apache.org/licenses/LICENSE-2.0                   │
 │ `\ `)(' /'                                                                  │
 │                                                                             │
 │   Unless required by applicable law or agreed to in writing, software       │
 │   distributed under the License is distributed on an "AS IS" BASIS,         │
 │   WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.  │
 │   See the License for the specific language governing permissions and       │
 │   limitations under the License.                                            │
 \*───────────────────────────────────────────────────────────────────────────*/

/*eslint no-underscore-dangle:0*/
'use strict';
var fs = require('fs');
var spud = require('spud');
var iferr = require('iferr');
var async = require('async');

var freshy = require('freshy');
var dust = freshy.freshy('dustjs-linkedin');

var monkeymap = require('monkeymap');

var fileResolver = require('file-resolver');

function Bundler(config) {
	this.resolver = fileResolver.create({ root: config.contentPath, ext: 'properties', fallback: config.fallback});
	this.cache = (config.cache !== undefined && config.cache === false) ? null : {};
}

Bundler.prototype.get = function (config, callback) {
    var cache = this.cache;
    var resolver = this.resolver;
    var bundle = Array.isArray(config.bundle) ? makeObj(config.bundle) : config.bundle;
    monkeymap(bundle, function (file, next) {
        async.compose(decorate, readCached(cache), resolve(resolver, config.locale || config.locality))(file, next);
    }, callback);
};

function resolve(resolver, locale) {
    return function (filename, callback) {
        try {
            var file = resolver.resolve(filename, locale).file;
            if (!file) {
				var err = new Error("ENOENT: no such file or directory '" + filename + "'");
				err.code = 'ENOENT';
				err.path = filename;
				throw err;
            }
            callback(null, file);
        } catch (e) {
            callback(e);
        }
    };
}

function readCached(cache) {

	return function noneBundler(bundleFile, cb) {
		if (cache && cache[bundleFile]) {
			async.ensureAsync(cb(null, cache[bundleFile]));
			return;
		}
		//not yet in cache
		fs.readFile(bundleFile, iferr(cb, function handleBundleBuffer(bundleBuffer) {
			try {
				var parsed = spud.parse(bundleBuffer.toString());
				if (cache) {
					cache[bundleFile] = parsed;
				}
				safe(cb)(null, parsed);
			} catch (e) {
				safe(cb)(e);
			}
		}));
	};
}

function decorate(obj, cb) {
    var cache = {};
    obj.formatDust = function (prop, model, renderCb) {
        if (!cache[prop]) {
            cache[prop] = dust.loadSource(dust.compile(obj[prop]));
        }

        dust.render(cache[prop], model, renderCb);
    };
    cb(null, obj);
}

function makeObj(arr) {
    return arr.reduce(function (a, e) {
        a[e] = e;
        return a;
    }, {});
}

function safe(cb) {
    return function() {
        try {
            cb.apply(this, arguments);
        } catch (e) {
            setImmediate(function () {
                throw e;
            });
        }
    };
}

Bundler.prototype.__cache = function () {
	return this.cache || {};
};

module.exports = Bundler;
