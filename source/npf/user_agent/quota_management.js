goog.provide('npf.userAgent.quotaManagement');

goog.require('goog.userAgent');
goog.require('npf.userAgent.utils');


/**
 * @private {boolean?}
 */
npf.userAgent.quotaManagement.supported_ = null;

/**
 * Detects the ability to request a specific amount of space for filesystem
 * access.
 * @return {boolean}
 */
npf.userAgent.quotaManagement.isSupported = function() {
  if (goog.isNull(npf.userAgent.quotaManagement.supported_)) {
    var navigator = goog.userAgent.getNavigator();

    npf.userAgent.quotaManagement.supported_ = !!(
      npf.userAgent.utils.prefixed('temporaryStorage', navigator) &&
      npf.userAgent.utils.prefixed('persistentStorage', navigator)
    );
  }

  return /** @type {boolean} */ (npf.userAgent.quotaManagement.supported_);
};
