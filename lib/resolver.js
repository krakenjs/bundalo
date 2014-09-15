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
var resolver = require('file-resolver');

function Resolver() {
	//no-op
}

Resolver.prototype.init = function (config, bundle) {
	this.contentPath = config.contentPath;
	this.fallback = config.fallback;
    //this.bundle = bundle;
};
Resolver.prototype.resolve = function (config) {
	//console.log(this.resolver.resolve(bundle, locality).file);
	var _resolver = resolver.create({ root: this.contentPath, ext: 'properties', fallback: this.fallback});
	var bundleFile = _resolver.resolve(config.bundle, config.locality).file || this.contentPath;
	//console.log("bundleFile", bundleFile);
	return {
		"bundleFile": bundleFile,
		"cacheKey": bundleFile.split(this.contentPath)[1]
	};
};
module.exports = Resolver;
