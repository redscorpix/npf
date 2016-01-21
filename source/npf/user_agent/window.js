goog.provide('npf.userAgent.window');

goog.require('npf.userAgent.utils');


/**
 * @private {boolean?}
 */
npf.userAgent.window.matchMedia_ = null;

/**
 * Detects support for matchMedia.
 * @return {boolean}
 */
npf.userAgent.window.isMatchMediaSupported = function() {
  if (goog.isNull(npf.userAgent.window.matchMedia_)) {
    npf.userAgent.window.matchMedia_ =
      !!npf.userAgent.utils.prefixed('matchMedia', goog.global);
  }

  return /** @type {boolean} */ (npf.userAgent.window.matchMedia_);
};
