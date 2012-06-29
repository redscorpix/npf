goog.provide('npfSupport');

goog.require('npf.userAgent.Support');
goog.require('npf.userAgent.support');


/**
 * @param {string} prop
 * @return {*}
 */
npfSupport = function(prop) {
	return npf.userAgent.Support.getInstance().isPropertySupported(/** @type {npf.userAgent.Support.Property} */ (prop.toLowerCase()));
};

/**
 * @param {string} str
 * @return {string}
 */
npfSupport.getCssPropertyName = function(str) {
	return npf.userAgent.support.getCssPropertyName(str);
};


goog.exportSymbol('npfSupport', npfSupport);
goog.exportSymbol('npfSupport.getCssPropertyName', npfSupport.getCssPropertyName);
