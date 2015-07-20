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
'use strict';
var async = require('async');
var _ = require('lodash');
var path = require('path');
var debug = require('debuglog')('bundalo');

function loopalo(bundle, config, resolver, handler, callback) {
	var bundleRenderer = {};
	var bundleKey = {};
	var bundleAs = Object;
	var configBundle = [];

	if (bundle.constructor === String) {
		//user wants one bundle (string)
		bundleKey[bundle] = bundle;
		configBundle = [bundle];
		bundleAs = String;
	} else if (bundle.constructor === Array) {
		//multiple bundles non-aliased (array)
		bundle.forEach(function (key) {
			bundleKey[key] = key;
		});
		configBundle = bundle;
		bundleAs = Array;
	} else {
		//multiple bundles aliased (object)
		Object.keys(bundle).forEach(function (b) {
			bundleKey[bundle[b]] = b;
			configBundle.push(bundle[b]);
		});
	}

	debug('bundling as %s', bundleAs.name);

	configBundle.forEach(function processBundle(b) {
		debug('Processing %s', b);
		var localConfig = _.clone(config);
		localConfig.bundle = path.normalize(b);
		var resolved = resolver.resolve(localConfig);
		bundleRenderer[bundleKey[b]] = function (cb) {
			handler(resolved.bundleFile, resolved.cacheKey, cb);
		};
	});

	async.parallel(bundleRenderer, function returnalo(err, results) {
		var returnVal = results;
		//if only one bundle object, remove top level key
		if (bundleAs === String) {
			returnVal = results[Object.keys(results)[0]];
		}
		callback(err, returnVal);
	});

}


module.exports = loopalo;
