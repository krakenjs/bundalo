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
var loopalo = require('../lib/loopalo');
var Resolver = require('../lib/resolver');
var IntlMessageFormat = require('intl-messageformat');
var thing = require('core-util-is');
var iferr = require('iferr');
var async = require('async');


function IntlFmt(config) {
    this.resolver = new Resolver(config);
    this.doCache = (config.cache !== undefined && config.cache === false) ? false : true;
    this.fallback = config.fallback || 'en-US';
    this.cache = {};
}

function format(obj, locality) {
    if (thing.isString(obj)) {
        var fmtObj = new IntlMessageFormat(obj, locality);
        //return (model) ? fmtObj.format(model) : fmtObj;
        return fmtObj;
    }
    else if (thing.isObject(obj)) {
        Object.keys(obj).forEach(function (elt) {
            obj[elt] = format(obj[elt], locality);
        });
        return obj;
    }
    else if (thing.isArray(obj)) {
        return obj.map(function (elt) {
            return format(elt, locality);
        });
    }
    //unconsidered use case? throw an error
    throw new Error('undefined format use case!');
}

function convert(obj, model) {
    if (obj.format && thing.isFunction(obj.format)) {
        return (model) ? obj.format(model) : obj;
    }
    else if (thing.isObject(obj)) {
        Object.keys(obj).forEach(function (elt) {
            obj[elt] = convert(obj[elt], model);
        });
        return obj;
    }
    else if (thing.isArray(obj)) {
        return obj.map(function (elt) {
            return convert(elt, model);
        });
    }
    //unconsidered use case? throw an error
    throw new Error('undefined convert use case!');
}

IntlFmt.prototype.get = function (config, callback) {
    var that = this;

    function intlFmtBundler(bundleFile, cacheKey, cb) {
        if (that.cache && that.cache[cacheKey]) {
            async.ensureAsync(cb(null, convert(that.cache[cacheKey], config.model)));
            return;
        }
        //not yet in cache
        fs.readFile(bundleFile, iferr(callback, function handleBundleBuffer(bundleBuffer) {
            try {
                var json = spud.parse(bundleBuffer.toString());
                //recurse into the JSON object and convert any string to a IntlMessageFormat object
                var formatted = format(json, config.locality);
                if (that.doCache) {
                    that.cache[cacheKey] = formatted;
                }
                cb(null, convert(formatted, config.model));
            } catch (e) {
                cb(e);
            }
        }));
    }

    loopalo(config.bundle, config, this.resolver, intlFmtBundler, callback);
};

IntlFmt.prototype.__cache = function () {
    return this.cache;
};

module.exports = IntlFmt;
