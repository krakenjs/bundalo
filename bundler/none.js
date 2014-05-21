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
var fs = require('fs');
var spud = require('spud');
var loopalo = require('../lib/loopalo');
var Resolver = require('../lib/resolver');


function None(config) {
	this.resolver = new Resolver();
	this.resolver.init(config);
	this.doCache = (config.cache !== undefined && config.cache === false) ? false : true;
	this.cache = {};
};

None.prototype.get = function (config, callback) {
	var that = this;

	function noneBundler(bundleFile, cacheKey, cb) {
		if (that.cache && that.cache[cacheKey]) {
			cb(null, that.cache[cacheKey]);
			return;
		}
		//not yet in cache
		fs.readFile(bundleFile, {}, function handleBundleBuffer(err, bundleBuffer) {
			spud.deserialize(bundleBuffer, 'properties', function (err, bundleJSON) {
				(that.doCache) ? (that.cache[cacheKey] = bundleJSON) : "";
				cb(null, bundleJSON);
			});
		});
	};
	loopalo(config, this.resolver, noneBundler, callback);
};

None.prototype.__cache = function () {
	return this.cache;
};

module.exports = None;
