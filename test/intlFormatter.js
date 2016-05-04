'use strict';

var thing = require('core-util-is');
var IntlMessageFormat = require('intl-messageformat');

module.exports = function format(obj, locality) {
    if (thing.isString(obj)) {
        var fmtObj = new IntlMessageFormat(obj, locality);
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
};
