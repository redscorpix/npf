goog.provide('npf.history.TokenTransformer');

goog.require('goog.history.Html5History.TokenTransformer');


/**
 * @constructor
 * @implements {goog.history.Html5History.TokenTransformer}
 */
npf.history.TokenTransformer = function() {

};


/** @inheritDoc */
npf.history.TokenTransformer.prototype.retrieveToken = function(pathPrefix, location) {
	return location.pathname.substr(pathPrefix.length) + location.search;
};

/** @inheritDoc */
npf.history.TokenTransformer.prototype.createUrl = function(token, pathPrefix, location) {
	return pathPrefix + token;
};
