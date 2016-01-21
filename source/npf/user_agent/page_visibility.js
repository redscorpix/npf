goog.provide('npf.userAgent.pageVisibility');

goog.require('goog.dom');
goog.require('npf.userAgent.utils');


/**
 * @private {boolean?}
 */
npf.userAgent.pageVisibility.supported_ = null;

/**
 * Detects support for the Page Visibility API, which can be used to disable
 * unnecessary actions and otherwise improve user experience.
 * @return {boolean}
 */
npf.userAgent.pageVisibility.isSupported = function() {
  if (goog.isNull(npf.userAgent.pageVisibility.supported_)) {
    /** @type {!Document} */
    var doc = goog.dom.getDomHelper().getDocument();

    npf.userAgent.pageVisibility.supported_ =
      !!npf.userAgent.utils.prefixed('hidden', doc, true);
  }

  return /** @type {boolean} */ (npf.userAgent.pageVisibility.supported_);
};
