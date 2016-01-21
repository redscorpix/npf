goog.provide('npf.userAgent.htmlImports');

goog.require('goog.dom');
goog.require('goog.dom.TagName');


/**
 * @private {boolean?}
 */
npf.userAgent.htmlImports.supported_ = null;

/**
 * Detects support for HTML import, a feature that is used for loading
 * in Web Components.
 * @return {boolean}
 */
npf.userAgent.htmlImports.isSupported = function() {
  if (goog.isNull(npf.userAgent.htmlImports.supported_)) {
    npf.userAgent.htmlImports.supported_ =
      'import' in goog.dom.createElement(goog.dom.TagName.LINK);
  }

  return /** @type {boolean} */ (npf.userAgent.htmlImports.supported_);
};
