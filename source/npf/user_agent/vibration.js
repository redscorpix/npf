goog.provide('npf.userAgent.vibration');

goog.require('goog.userAgent');
goog.require('npf.userAgent.utils');


/**
 * @private {boolean?}
 */
npf.userAgent.vibration.supported_ = null;

/**
 * Detects support for the API that provides access to the vibration mechanism
 * of the hosting device, to provide tactile feedback.
 * @return {boolean}
 */
npf.userAgent.vibration.isSupported = function() {
  if (goog.isNull(npf.userAgent.vibration.supported_)) {
    npf.userAgent.vibration.supported_ =
      !!npf.userAgent.utils.prefixed('vibrate', goog.userAgent.getNavigator());
  }

  return /** @type {boolean} */ (npf.userAgent.vibration.supported_);
};
