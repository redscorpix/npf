goog.provide('npf.userAgent.battery');

goog.require('goog.userAgent');
goog.require('npf.userAgent.utils');


/**
 * @private {boolean?}
 */
npf.userAgent.battery.supported_ = null;

/**
 * Detect support for the Battery API, for accessing information about the
 * system's battery charge level.
 * @return {boolean}
 */
npf.userAgent.battery.isSupported = function() {
  if (goog.isNull(npf.userAgent.battery.supported_)) {
    npf.userAgent.battery.supported_ =
      !!npf.userAgent.utils.prefixed('battery', goog.userAgent.getNavigator());
  }

  return /** @type {boolean} */ (npf.userAgent.battery.supported_);
};

/**
 * @private {boolean?}
 */
npf.userAgent.battery.lowLevel_ = null;

/**
 * Enable a developer to remove CPU intensive CSS/JS when battery is low.
 * @param {number=} opt_minLevel
 * @return {boolean}
 */
npf.userAgent.battery.isLowLevel = function(opt_minLevel) {
  if (goog.isNull(npf.userAgent.battery.lowLevel_)) {
    /** @type {number} */
    var minLevel = opt_minLevel || 0.20;
    var battery = npf.userAgent.utils.prefixed('battery', navigator);
    npf.userAgent.battery.lowLevel_ =
      !!battery && !battery['charging'] && battery['level'] <= minLevel;
  }


  return /** @type {boolean} */ (npf.userAgent.battery.lowLevel_);
};
