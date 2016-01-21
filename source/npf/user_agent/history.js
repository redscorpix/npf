goog.provide('npf.userAgent.history');

goog.require('goog.userAgent');


/**
 * @private {boolean?}
 */
npf.userAgent.history.supported_ = null;

/**
 * Detects support for the History API for manipulating the browser session
 * history.
 * @return {boolean}
 */
npf.userAgent.history.isSupported = function() {
  if (goog.isNull(npf.userAgent.history.supported_)) {
    // The stock browser on Android 2.2 & 2.3, and 4.0.x returns positive
    // on history support.
    // Unfortunately support is really buggy and there is no clean way to detect
    // these bugs, so we fall back to a user agent sniff :(

    /** @type {string} */
    var ua = goog.userAgent.getUserAgentString();

    // We only want Android 2 and 4.0, stock browser, and not Chrome which
    // identifies itself as 'Mobile Safari' as well, nor Windows Phone.
    npf.userAgent.history.supported_ = (
      (-1 == ua.indexOf('Android 2.') && -1 == ua.indexOf('Android 4.0')) ||
      -1 == ua.indexOf('Mobile Safari') ||
      -1 < ua.indexOf('Chrome') ||
      -1 < ua.indexOf('Windows Phone')
    ) && goog.global.history && 'pushState' in goog.global.history;
  }

  return /** @type {boolean} */ (npf.userAgent.history.supported_);
};
