goog.provide('npf.userAgent.pointerLock');

goog.require('goog.dom');
goog.require('npf.userAgent.utils');


/**
 * @private {boolean?}
 */
npf.userAgent.pointerLock.supported_ = null;

/**
 * Detects support the pointer lock API which allows you to lock the mouse
 * cursor to the browser window.
 * https://developer.mozilla.org/en-US/docs/API/Pointer_Lock_API
 * @return {boolean}
 */
npf.userAgent.pointerLock.isSupported = function() {
  if (goog.isNull(npf.userAgent.pointerLock.supported_)) {
    npf.userAgent.pointerLock.supported_ = !!npf.userAgent.utils.prefixed(
      'exitPointerLock', goog.dom.getDomHelper().getDocument());
  }

  return /** @type {boolean} */ (npf.userAgent.pointerLock.supported_);
};
