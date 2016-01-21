goog.provide('npf.userAgent.dart');

goog.require('goog.userAgent');
goog.require('npf.userAgent.utils');


/**
 * @private {boolean?}
 */
npf.userAgent.dart.supported_ = null;

/**
 * Detects native support for the Dart programming language.
 * @return {boolean}
 */
npf.userAgent.dart.isSupported = function() {
  if (goog.isNull(npf.userAgent.dart.supported_)) {
    npf.userAgent.dart.supported_ = !!npf.userAgent.utils.prefixed(
      'startDart', goog.userAgent.getNavigator());
  }

  return /** @type {boolean} */ (npf.userAgent.dart.supported_);
};
