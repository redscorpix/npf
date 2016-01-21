goog.provide('npf.userAgent.json');


/**
 * Detects native support for JSON handling functions.
 * @return {boolean}
 */
npf.userAgent.json.isSupported = function() {
  return 'JSON' in goog.global && 'parse' in JSON && 'stringify' in JSON;
};
