goog.provide('npf.userAgent.crypto');

goog.require('npf.userAgent.utils');


/**
 * @private {boolean?}
 */
npf.userAgent.crypto.supported_ = null;

/**
 * Detects support for the window.crypto.getRandomValues for generate
 * cryptographically secure random numbers.
 * @return {boolean}
 */
npf.userAgent.crypto.isRandomValueSupported = function() {
  if (goog.isNull(npf.userAgent.crypto.supported_)) {
    // In Safari <=5.0 `window.crypto` exists (for some reason) but is
    // `undefined`, so we have to check it’s truthy before checking for
    // existence of `getRandomValues`.
    var crypto = npf.userAgent.utils.prefixed('crypto', goog.global);
    /** @type {boolean} */
    var supportsGetRandomValues = false;

    // Safari 6.0 supports crypto.getRandomValues, but does not return
    // the array, which is required by the spec, so we need to actually check.
    if (crypto && 'getRandomValues' in crypto && 'Uint32Array' in goog.global) {
      var array = new Uint32Array(10);
      var values = crypto['getRandomValues'](array);
      supportsGetRandomValues = !!(values && goog.isNumber(values[0]));
    }

    npf.userAgent.crypto.supported_ = supportsGetRandomValues;
  }

  return /** @type {boolean} */ (npf.userAgent.crypto.supported_);
};
