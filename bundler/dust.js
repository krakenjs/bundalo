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
var freshy = require('freshy');
var loopalo = require('../lib/loopalo');
//import dust here to get around issue in freshy where freshy.freshy doesn't properly check for an existing copy
var doost = require('dustjs-linkedin');
var Resolver = require('../lib/resolver');



function Dust(config) {
	this.dust = freshy.freshy('dustjs-linkedin');
	//preserve whitespace
	this.dust.optimizers.format = function(ctx, node) { return node };
	this.resolver = new Resolver();
	this.resolver.init(config);
	this.doCache = (config.cache !== undefined && config.cache === false) ? false : true;
};

Dust.prototype.get = function (config, callback) {
	//single bundle config {"bundle": "errors/server", "model": {"name": "Will Robinson"}}
	//multiple bundle config {"bundle": ["errors/server", "errors/client"], "model": {"name": "Will Robinson"}}
	var that = this;
	function dustRender(cacheKey, model, cb) {
		that.dust.render(cacheKey, model || {}, function renderCallback(err, out) {
			if (that.doCache === false) {
				delete that.dust.cache[cacheKey];
			}
			spud.deserialize(new Buffer(out, 'utf8'), 'properties', function deserializeCallback(err, data) {
				cb(null, data);
			});
		});
	};
	function dustBundler(bundleFile, cacheKey, cb) {
		if (that.dust.cache && that.dust.cache[cacheKey]) {
			dustRender(cacheKey, config.model, cb);
			return;
		}

		//not yet in cache
		fs.readFile(bundleFile, {}, function handleBundleBuffer(err, bundleBuffer) {
			var compiled = that.dust.compile(bundleBuffer.toString(), cacheKey);
			that.dust.loadSource(compiled);
			dustRender(cacheKey, config.model, cb);
		});
	};


	loopalo(config, this.resolver, dustBundler, callback);
};

Dust.prototype.__cache = function () {
	return this.dust.cache;
};

module.exports = Dust;