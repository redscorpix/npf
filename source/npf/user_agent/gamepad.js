goog.provide('npf.userAgent.gamepad');

goog.require('goog.userAgent');
goog.require('npf.userAgent.utils');


/**
 * @private {boolean?}
 */
npf.userAgent.gamepad.supported_ = null;

/**
 * Detects support for the Gamepad API, for access to gamepads and controllers.
 * @return {boolean}
 */
npf.userAgent.gamepad.isSupported = function() {
  if (goog.isNull(npf.userAgent.gamepad.supported_)) {
    npf.userAgent.gamepad.supported_ = !!npf.userAgent.utils.prefixed(
      'getGamepads', goog.userAgent.getNavigator());
  }

  return /** @type {boolean} */ (npf.userAgent.gamepad.supported_);
};
