goog.provide('npf.userAgent.i18n');

goog.require('npf.userAgent.utils');


/**
 * @private {boolean?}
 */
npf.userAgent.i18n.supported_ = null;

/**
 * Detects support for the Internationalization API which allow easy formatting
 * of number and dates and sorting string based on a locale.
 * @return {boolean}
 */
npf.userAgent.i18n.isSupported = function() {
  if (goog.isNull(npf.userAgent.i18n.supported_)) {
    npf.userAgent.i18n.supported_ =
      !!npf.userAgent.utils.prefixed('Intl', goog.global);
  }

  return /** @type {boolean} */ (npf.userAgent.i18n.supported_);
};
