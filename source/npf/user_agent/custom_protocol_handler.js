goog.provide('npf.userAgent.customProtocolHandler');

goog.require('goog.userAgent');


/**
 * @private {boolean?}
 */
npf.userAgent.customProtocolHandler.supported_ = null;

/**
 * Detects support for the `window.registerProtocolHandler()` API to allow
 * websites to register themselves as possible handlers for particular
 * protocols.
 * @return {boolean}
 */
npf.userAgent.customProtocolHandler.isSupported = function() {
  if (goog.isNull(npf.userAgent.customProtocolHandler.supported_)) {
    npf.userAgent.customProtocolHandler.supported_ = false;

    /** @type {Object} */
    var navigator = goog.userAgent.getNavigator();

    // early bailout where it doesn't exist at all
    if (navigator['registerProtocolHandler']) {
      // registerProtocolHandler was stubbed in webkit for a while, and didn't
      // actually do anything. We intentionally set it improperly to test for
      // the proper sort of failure
      try {
        navigator['registerProtocolHandler']('thisShouldFail');
      } catch (e) {
        npf.userAgent.customProtocolHandler.supported_ = e instanceof TypeError;
      }
    }
  }

  return /** @type {boolean} */ (
    npf.userAgent.customProtocolHandler.supported_);
};
