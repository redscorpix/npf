goog.provide('npf.userAgent.canvas');

goog.require('goog.dom');
goog.require('goog.dom.TagName');


/**
 * @private {boolean?}
 */
npf.userAgent.canvas.supported_ = null;

/**
 * Detects support for the `<canvas>` element for 2D drawing.
 * @return {boolean}
 */
npf.userAgent.canvas.isSupported = function() {
  if (goog.isNull(npf.userAgent.canvas.supported_)) {
    npf.userAgent.canvas.supported_ =
      !!npf.userAgent.canvas.getCanvasElement_();
  }

  return /** @type {boolean} */ (npf.userAgent.canvas.supported_);
};

/**
 * @private {boolean?}
 */
npf.userAgent.canvas.blending_ = null;

/**
 * Detects if Photoshop style blending modes are available in canvas.
 * @return {boolean}
 */
npf.userAgent.canvas.isBlendingSupported = function() {
  if (goog.isNull(npf.userAgent.canvas.blending_)) {
    /** @type {HTMLCanvasElement} */
    var element = npf.userAgent.canvas.getCanvasElement_();
    npf.userAgent.canvas.blending_ = false;

    if (element) {
      var ctx = /** @type {CanvasRenderingContext2D} */ (
        element.getContext('2d'));

      // Firefox 3 throws an error when setting an invalid
      //`globalCompositeOperation`.
      try {
        ctx.globalCompositeOperation = 'screen';
      } catch (e) {}

      npf.userAgent.canvas.blending_ =
        'screen' === ctx.globalCompositeOperation;
    }
  }

  return /** @type {boolean} */ (npf.userAgent.canvas.blending_);
};

/**
 * @return {HTMLCanvasElement}
 * @private
 */
npf.userAgent.canvas.getCanvasElement_ = function() {
  var element = /** @type {!HTMLCanvasElement} */ (
    goog.dom.createElement(goog.dom.TagName.CANVAS));

  return element.getContext && element.getContext('2d') ? element : null;
};

/**
 * @param {string} type
 * @return {boolean}
 * @private
 */
npf.userAgent.canvas.isDataUrlSupported_ = function(type) {
  /** @type {HTMLCanvasElement} */
  var element = npf.userAgent.canvas.getCanvasElement_();

  /** @type {boolean} */
  var support = false;

  if (element) {
    // firefox 3 throws an error when you use an "invalid" toDataUrl
    try {
      support = !element.toDataURL('image/' + type).
        indexOf('data:image/' + type);
    } catch (e) { }
  }

  return support;
};

/**
 * @private {boolean?}
 */
npf.userAgent.canvas.jpegDataUrl_ = null;

/**
 * @return {boolean}
 */
npf.userAgent.canvas.isJpegDataUrlSupported = function() {
  if (goog.isNull(npf.userAgent.canvas.jpegDataUrl_)) {
    npf.userAgent.canvas.jpegDataUrl_ =
      npf.userAgent.canvas.isDataUrlSupported_('jpeg');
  }

  return /** @type {boolean} */ (npf.userAgent.canvas.jpegDataUrl_);
};

/**
 * @private {boolean?}
 */
npf.userAgent.canvas.pngDataUrl_ = null;

/**
 * @return {boolean}
 */
npf.userAgent.canvas.isPngDataUrlSupported = function() {
  if (goog.isNull(npf.userAgent.canvas.pngDataUrl_)) {
    npf.userAgent.canvas.pngDataUrl_ =
      npf.userAgent.canvas.isDataUrlSupported_('png');
  }

  return /** @type {boolean} */ (npf.userAgent.canvas.pngDataUrl_);
};

/**
 * @private {boolean?}
 */
npf.userAgent.canvas.text_ = null;

/**
 * Detects support for the text APIs for `<canvas>` elements.
 * @return {boolean}
 */
npf.userAgent.canvas.isTextSupported = function() {
  if (goog.isNull(npf.userAgent.canvas.text_)) {
    /** @type {HTMLCanvasElement} */
    var element = npf.userAgent.canvas.getCanvasElement_();

    npf.userAgent.canvas.text_ = element ?
      'function' == typeof element.getContext('2d').fillText : false;
  }

  return /** @type {boolean} */ (npf.userAgent.canvas.text_);
};

/**
 * @private {boolean?}
 */
npf.userAgent.canvas.webpDataUrl_ = null;

/**
 * @return {boolean}
 */
npf.userAgent.canvas.isWebpDataUrlSupported = function() {
  if (goog.isNull(npf.userAgent.canvas.webpDataUrl_)) {
    npf.userAgent.canvas.webpDataUrl_ =
      npf.userAgent.canvas.isDataUrlSupported_('webp');
  }

  return /** @type {boolean} */ (npf.userAgent.canvas.webpDataUrl_);
};

/**
 * @private {boolean?}
 */
npf.userAgent.canvas.winding_ = null;

/**
 * Determines if winding rules, which controls if a path can go clockwise or
 * counterclockwise.
 * @return {boolean}
 */
npf.userAgent.canvas.isWindingSupported = function() {
  if (goog.isNull(npf.userAgent.canvas.winding_)) {
    /** @type {HTMLCanvasElement} */
    var element = npf.userAgent.canvas.getCanvasElement_();
    npf.userAgent.canvas.winding_ = false;

    if (element) {
      var ctx = /** @type {CanvasRenderingContext2D} */ (
        element.getContext('2d'));
      ctx.rect(0, 0, 10, 10);
      ctx.rect(2, 2, 6, 6);

      npf.userAgent.canvas.winding_ =
        false === ctx.isPointInPath(5, 5, 'evenodd');
    }
  }

  return /** @type {boolean} */ (npf.userAgent.canvas.winding_);
};
