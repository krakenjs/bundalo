# bundalo

Extract/cache/render property files/strings using i18n rules and various rendering engines

[![Build Status](https://travis-ci.org/krakenjs/bundalo.svg?branch=master)](https://travis-ci.org/krakenjs/bundalo)

## Use cases

### Initialize bundalo

Call bundalo module with a key that matches your template engine, plus locale information.
Currently only dust and none are supported as engines.

```javascript
var bundalo = require('bundalo');

// couple of configs for later
var config = {
    "contentPath": "locales/", //required
    "fallback": "en-US",       //optional
    "engine": "dust",          //required
    "cache": false             //optional, default is true
};
var config2 = {
    "contentPath": "globals/",
    "fallback": "",
    "engine": "none"
};

//create two bundalo instances. Each has its own cache
var bundle = bundalo(config);
var bundle2 = bundalo(config);

```

### Use bundalo

User wants key/values from a bundle file, corrected for locality, and possibly rendered with some data model

```javascript
bundler.get({bundle: 'errors/server', locality: 'en-US'}, function bundaloReturn(err, bundle) {
    cb({
        serverError: bundle.get('serverError')
    });
});
```

User wants multiple bundles in a single call, to avoid calling bundalo multiple times

```javascript
bundler.get({'bundle': ['errors/server', 'errors/client'], 'locality': 'en-US',  'model': {'name': 'Will Robinson'}}, function bundaloReturn(err, data) {
    cb({
        'clienterr': data['errors/client'].get('error'),
        'servererr': data['errors/server'].get('error')
    });
});
```

User wants multiple bundles in a single call, and wants to alias the bundles for easier management upon return

```javascript
bundler.get('bundle': {
    'server': 'errors/server',
    'client': 'errors/client'
}, 'locality': 'en-US', 'model': {'name': 'Will Robinson'}}, function bundaloReturn(err, bundles) {
    console.log("what'd we get from bundalo.get?", bundles, err);
    cb({
        'clienterr': bundles.client.get('error'),
        'servererr': bundles.server.get('error')
    });
});
```

Here is a pattern to use if you need to process bundle data with some type of formatter (dust as an example):

```javascript
var dustFormatter = function (bundle) {
    bundle.formatDust = function (pattern, model, renderCb) {
        if (!this.cache[pattern]) {
            this.cache[pattern] = dust.loadSource(dust.compile(this.get(pattern)));
        }

        dust.render(this.cache[pattern], model, renderCb);
    };
    return bundle;
};

bundler.get({bundle: 'errors/server', locality: 'en-US'}, function bundaloReturn(err, bundle) {
    bundle = dustFormatter(bundle);
    bundle.formatDust('otherError', { message: "It was bad" }, function (err, formatted) {
        cb({
            err: bundle.get('error'),
            otherError: formatted
        });
    });
});
```

## Design

When a user first requests a bundle, bundalo will:
* fetch the correct file from the file system based on locality
* set up a formatter, which will cache its templates on first use
* deserialize the rendered properties file via spud
* return a JSON data object with the rendered values

Upon subsequent requests for a bundle, the previously cached compiled template will be re-rendered and returned.

Cache will be based upon the filename of the resolved bundle.

Cache is consistent per bundalo instance created.
