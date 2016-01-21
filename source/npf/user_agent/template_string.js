goog.provide('npf.userAgent.templateString');


/**
 * @private {boolean?}
 */
npf.userAgent.templateString.supported_ = null;

/**
 * Template strings are string literals allowing embedded expressions.
 * @return {boolean}
 */
npf.userAgent.templateString.isSupported = function() {
  if (goog.isNull(npf.userAgent.templateString.supported_)) {
    npf.userAgent.templateString.supported_ = false;

    try {
      // A number of tools, including uglifyjs and require, break on a raw "`",
      // so use an eval to get around that.
      eval('``');
      npf.userAgent.templateString.supported_ = true;
    } catch (e) {}
  }

  return /** @type {boolean} */ (npf.userAgent.templateString.supported_);
};
