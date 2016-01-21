goog.provide('npf.userAgent.userData');

goog.require('goog.dom');
goog.require('goog.dom.TagName');


/**
 * @private {boolean?}
 */
npf.userAgent.userData.supported_ = null;

/**
 * Detects support for IE userData for persisting data, an API similar
 * to localStorage but supported since IE5.
 * @return {boolean}
 */
npf.userAgent.userData.isSupported = function() {
  if (goog.isNull(npf.userAgent.userData.supported_)) {
    npf.userAgent.userData.supported_ =
      !!goog.dom.createElement(goog.dom.TagName.DIV)['addBehavior'];
  }

  return /** @type {boolean} */ (npf.userAgent.userData.supported_);
};
