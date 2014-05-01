# bundalo

Extract/cache/render property files/strings using i18n rules and various rendering engines

## Use cases

### Initialize bundalo

Call bundalo module with a key that matches your template engine. Currently only dust and none are supported

```javascript
var bundalo = require('bundalo');

var _bundalo = bundalo({'i18n': i18n, 'locality': locality, 'engine': engine});
```

* i18n object: 
```javascript
 "i18n": {
    "contentPath": "path:./locales",
    "fallback": "en-US"
},
```
* locality string (e.g. "en-US")

### Use bundalo

User wants key/values from some bundle file, corrected for locality, and possibly rendered with some data model

```javascript
_bundalo.get({'bundle': 'errors/server', 'model': {'name': 'Will Robinson'}}, function bundaloReturn(err, data) {
	console.log("what'd we get from bundalo.get?", data, err);
	cb({
		'name': data.error
	});
});
```

User wants multiple bundles in a single call, to avoid calling bundalo multiple times

```javascript
_bundalo.get({'bundle': ['errors/server', 'errors/client'], 'model': {'name': 'Will Robinson'}}, function bundaloReturn(err, data) {
	console.log("what'd we get from bundalo.get?", data, err);
	cb({
		'name': data['errors/client'].error,
		'servername': data['errors/server'].error
	});
});
```
## Design

When a user first requests a bundle, bundalo will:
* fetch the correct file from the file system based on locality
* compile the properties file into a dust template
* cache the compiled dust template
* render the template with any provided data model
* deserialize the rendered properties file via spud
* return a JSON data object with the rendered  values

Upon subsequent requests for a bundle, the previously cached compiled template will be re-rendered and returned. Cache will be based upon the bundle path provided by the user, plus the locality path information. I.e. 'US/en/foo/bar' is a separate cached object from 'DE/de/foo/bar'.  