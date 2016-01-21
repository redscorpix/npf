goog.provide('npf.userAgent.webgl');

goog.require('goog.dom');
goog.require('goog.dom.TagName');


/**
 * @private {boolean?}
 */
npf.userAgent.webgl.supported_ = null;

/**
 * @return {boolean}
 */
npf.userAgent.webgl.isSupported = function() {
  if (goog.isNull(npf.userAgent.webgl.supported_)) {
    var canvas = /** @type {!HTMLCanvasElement} */ (
      goog.dom.createElement(goog.dom.TagName.CANVAS));
    /** @type {string} */
    var supports = ('probablySupportsContext' in canvas ? 'probablyS' : 's') +
      'upportsContext';

    npf.userAgent.webgl.supported_ = supports in canvas ?
      canvas[supports]('webgl') || canvas[supports]('experimental-webgl') :
      'WebGLRenderingContext' in goog.global;
  }

  return /** @type {boolean} */ (npf.userAgent.webgl.supported_);
};

/**
 * @private {Array<string>}
 */
npf.userAgent.webgl.extensions_ = null;

/**
 * Detects support for OpenGL extensions in WebGL.
 *
 * Based on code from ilmari heikkinen:
 * code.google.com/p/graphics-detect/source/browse/js/detect.js
 * @return {Array<string>}
 */
npf.userAgent.webgl.getExtensions = function() {
  if (!npf.userAgent.webgl.extensions_ && npf.userAgent.webgl.isSupported()) {
    try {
      var canvas = /** @type {!HTMLCanvasElement} */ (
        goog.dom.createElement(goog.dom.TagName.CANVAS));
      var ctx = /** @type {WebGLRenderingContext} */ (
        canvas.getContext('webgl') || canvas.getContext('experimental-webgl'));
      npf.userAgent.webgl.extensions_ = ctx.getSupportedExtensions();
    } catch (e) { }
  }

  return npf.userAgent.webgl.extensions_;
};
