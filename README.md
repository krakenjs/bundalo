# bundalo

Extract/cache/render property files/strings using i18n rules and various rendering engines

## Use cases

### Initialize bundalo

Call bundalo module with a key that matches your template engine. Currently only dust is supported

```javascript
var bundalo = require('bundalo');

bundalo = bundalo[engine]();
bundalo.create({"i18n": i18n, "locality": locality, "type": "properties"});
```

* i18n object: 
```javascript
 "i18n": {
    "contentPath": "path:./locales",
    "fallback": "en-US"
},
```
* locality string (e.g. "en-US")
* format and file extension of content files (json, properties)

### Use bundalo

User wants key/values from some bundle file, corrected for locality, and possibly rendered with some data model

```javascript
bundalo.get({"bundle": "errors/server", "model": {"name": "Will Robinson"}}, function bundaloReturn(err, data) {
	//do any further processing of the returned data
	cb(data);
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

Upon subsequent requests for a bundle, the previously cached compiled template will be re-rendered and returned.  