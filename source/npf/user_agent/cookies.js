goog.provide('npf.userAgent.cookies');

goog.require('goog.dom');


/**
 * Detects whether cookie support is enabled.
 * @param {goog.dom.DomHelper=} opt_domHelper
 * @return {boolean}
 */
npf.userAgent.cookies.isEnabled = function(opt_domHelper) {
  /** @type {!goog.dom.DomHelper} */
  var domHelper = opt_domHelper || goog.dom.getDomHelper();
  /** @type {!Document} */
  var doc = domHelper.getDocument();

  // navigator.cookieEnabled cannot detect custom or nuanced cookie blocking
  // configurations. For example, when blocking cookies via the Advanced
  // Privacy Settings in IE9, it always returns true. And there have been
  // issues in the past with site-specific exceptions.
  // Don't rely on it.

  // try..catch because some in situations `document.cookie` is exposed but
  // throws a SecurityError if you try to access it; e.g. documents created
  // from data URIs or in sandboxed iframes (depending on flags/context)
  try {
    // Create cookie
    doc.cookie = 'cookietest=1';
    var ret = -1 < doc.cookie.indexOf('cookietest=');
    // Delete cookie
    doc.cookie = 'cookietest=1; expires=Thu, 01-Jan-1970 00:00:01 GMT';

    return ret;
  } catch (e) {
    return false;
  }
};
