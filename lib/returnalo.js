module.exports = function returnWrapper(callback) {
	return function returnalo(err, results) {
		var returnVal = results;
		//console.log("async results", results);
		//if only one bundle object, remove top level key
		if (Object.keys(results).length === 1) {
			returnVal = results[Object.keys(results)[0]];
		}
		callback(null, returnVal);
	};
};