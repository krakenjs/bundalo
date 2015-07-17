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
var fileResolver = require('file-resolver');
var path = require('path');
var debug = require('debuglog')('bundalo');

function Resolver(config) {
    this.contentPath = path.normalize(config.contentPath);
    this.fallback = config.fallback && path.normalize(config.fallback);
}

Resolver.prototype.resolve = function (config) {
	var resolver = fileResolver.create({ root: this.contentPath, ext: 'properties', fallback: this.fallback});
	var bundleFile = resolver.resolve(config.bundle, config.locality).file || this.contentPath;

	debug('Resolved %s (%s) to %s', config.bundle, config.locality, bundleFile);

	return {
		"bundleFile": bundleFile,
		"cacheKey": path.relative(this.contentPath, bundleFile)
	};
};
module.exports = Resolver;
