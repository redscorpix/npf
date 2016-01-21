goog.provide('npf.userAgent.performance');

goog.require('npf.userAgent.utils');


/**
 * @private {boolean?}
 */
npf.userAgent.performance.supported_ = null;

/**
 * Detects support for the Navigation Timing API, for measuring browser
 * and connection performance.
 * @return {boolean}
 */
npf.userAgent.performance.isSupported = function() {
  if (goog.isNull(npf.userAgent.performance.supported_)) {
    npf.userAgent.performance.supported_ =
      !!npf.userAgent.utils.prefixed('performance', goog.global);
  }

  return /** @type {boolean} */ (npf.userAgent.performance.supported_);
};
