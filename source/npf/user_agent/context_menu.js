goog.provide('npf.userAgent.contextMenu');

goog.require('goog.dom');


/**
 * @private {boolean?}
 */
npf.userAgent.contextMenu.supported_ = null;

/**
 * Detects support for custom context menus.
 * @return {boolean}
 */
npf.userAgent.contextMenu.isSupported = function() {
  if (goog.isNull(npf.userAgent.contextMenu.supported_)) {
    /** @type {!goog.dom.DomHelper} */
    var domHelper = goog.dom.getDomHelper();
    npf.userAgent.contextMenu.supported_ =
      'contextMenu' in domHelper.getDocument().documentElement &&
      'HTMLMenuItemElement' in domHelper.getWindow();
  }


  return /** @type {boolean} */ (npf.userAgent.contextMenu.supported_);
};
