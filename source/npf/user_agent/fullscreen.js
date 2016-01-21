goog.provide('npf.userAgent.fullscreen');

goog.require('goog.dom');
goog.require('npf.userAgent.utils');


/**
 * @private {boolean?}
 */
npf.userAgent.fullscreen.supported_ = null;

/**
 * Detects support for the ability to make the current website take over
 * the user's entire screen.
 * @return {boolean}
 */
npf.userAgent.fullscreen.isSupported = function() {
  if (goog.isNull(npf.userAgent.fullscreen.supported_)) {
    /** @type {!Document} */
    var doc = goog.dom.getDomHelper().getDocument();

    npf.userAgent.fullscreen.supported_ = !!(
      npf.userAgent.utils.prefixed('exitFullscreen', doc, true) ||
      npf.userAgent.utils.prefixed('cancelFullScreen', doc, true)
    );
  }

  return /** @type {boolean} */ (npf.userAgent.fullscreen.supported_);
};
