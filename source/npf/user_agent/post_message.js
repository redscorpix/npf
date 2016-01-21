goog.provide('npf.userAgent.postMessage');


/**
 * Detects support for the `window.postMessage` protocol for cross-document
 * messaging.
 * @return {boolean}
 */
npf.userAgent.postMessage.isSupported = function() {
  return 'postMessage' in goog.global;
};
