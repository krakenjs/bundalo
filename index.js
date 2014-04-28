exports.dust = function() {
	return {
		"create": function(config) {
			console.log("bundalo['dust'].create config", config);
			//sample config: {"i18n": {below}, "locality": "en-US", "type": "properties|json"}
			/*	
				"i18n": {
				    "contentPath": "path:./locales",
				    "fallback": "en-US"
				}
			*/

		}
	}
}