goog.provide('npf.userAgent.animations');

goog.require('goog.dom.TagName');
goog.require('npf.userAgent.utils');


/**
 * @private {boolean?}
 */
npf.userAgent.animations.rafSupported_ = null;

/**
 * Detects support for the `window.requestAnimationFrame` API, for offloading
 * animation repainting to the browser for optimized performance.
 * @return {boolean}
 */
npf.userAgent.animations.isRequestAnimationFrameSupported = function() {
  if (goog.isNull(npf.userAgent.animations.rafSupported_)) {
    npf.userAgent.animations.rafSupported_ =
      !!npf.userAgent.utils.prefixed('requestAnimationFrame', goog.global);
  }

  return /** @type {boolean} */ (npf.userAgent.animations.rafSupported_);
};

/**
 * @private {boolean?}
 */
npf.userAgent.animations.webAnimationSupported_ = null;

/**
 * Detects support for the Web Animation API, a way to create css animations
 * in js.
 * @return {boolean}
 */
npf.userAgent.animations.isWebAnimationSupported = function() {
  if (goog.isNull(npf.userAgent.animations.webAnimationSupported_)) {
    npf.userAgent.animations.webAnimationSupported_ =
      'animate' in good.dom.createElement(goog.dom.TagName.DIV);
  }

  return /** @type {boolean} */ (
    npf.userAgent.animations.webAnimationSupported_);
};
