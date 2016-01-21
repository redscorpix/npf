goog.provide('npf.userAgent.webIntent');

goog.require('goog.userAgent');
goog.require('npf.userAgent.utils');


/**
 * @private {boolean?}
 */
npf.userAgent.webIntent.supported_ = null;

/**
 * Detects native support for the Web Intents APIs for service discovery
 * and inter-application communication.
 *
 * Chrome added support for this in v19, but
 * [removed it again in v24](http://lists.w3.org/Archives/Public/public-web-intents/2012Nov/0000.html)
 * because of "a number of areas for development in both the API and specific
 * user experience in Chrome". No other browsers currently support it, however
 * a [JavaScript shim](http://webintents.org/#javascriptshim) is available.
 * @return {boolean}
 */
npf.userAgent.webIntent.isSupported = function() {
  if (goog.isNull(npf.userAgent.webIntent.supported_)) {
    npf.userAgent.webIntent.supported_ = !!npf.userAgent.utils.prefixed(
      'startActivity', goog.userAgent.getNavigator());
  }

  return /** @type {boolean} */ (npf.userAgent.webIntent.supported_);
};
