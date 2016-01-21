goog.provide('npf.userAgent.abmientLight');

goog.require('npf.userAgent.utils');


/**
 * @private {boolean?}
 */
npf.userAgent.abmientLight.supported_ = null;

/**
 * Detects support for the API that provides information about the ambient
 * light levels, as detected by the device's light detector, in terms of lux
 * units.
 * @return {boolean}
 */
npf.userAgent.abmientLight.isSupported = function() {
  if (goog.isNull(npf.userAgent.abmientLight.supported_)) {
    npf.userAgent.abmientLight.supported_ =
      npf.userAgent.utils.hasEvent('devicelight', goog.global);
  }

  return /** @type {boolean} */ (npf.userAgent.abmientLight.supported_);
};
