# bundalo

Extract/cache/render property files/strings using i18n rules and various rendering engines

## Use cases

### User wants a localized value from a content bundle file

User specify:
* i18n object: 
```javascript
 "i18n": {
    "contentPath": "path:./locales",
    "fallback": "en-US"
},
```
* format and file extension of content files (json, properties)
* locality object (e.g. "en-US")