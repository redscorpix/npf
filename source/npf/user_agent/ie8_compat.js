goog.provide('npf.userAgent.ie8Compat');

goog.require('goog.dom');


/**
 * Detects whether or not the current browser is IE8 in compatibility mode
 * (i.e. acting as IE7).
 * @return {boolean}
 */
npf.userAgent.ie8Compat.isEnabled = function() {
  /** @type {!goog.dom.DomHelper} */
  var domHelper = goog.dom.getDomHelper();
  /** @type {!Document} */
  var doc = domHelper.getDocument();
  /** @type {!Window} */
  var win = domHelper.getWindow();

  // In this case, IE8 will be acting as IE7. You may choose to remove features
  // in this case.
  // related:
  // james.padolsey.com/javascript/detect-ie-in-js-using-conditional-comments/
  return !win.addEventListener && !!doc.documentMode && 7 === doc.documentMode;
};
