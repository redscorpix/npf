goog.provide('npf.userAgent.emoji');

goog.require('goog.dom');
goog.require('goog.dom.TagName');
goog.require('npf.userAgent.canvas');


/**
 * @private {boolean?}
 */
npf.userAgent.emoji.supported_ = null;

/**
 * @return {boolean}
 */
npf.userAgent.emoji.isSupported = function() {
  if (goog.isNull(npf.userAgent.emoji.supported_)) {
    npf.userAgent.emoji.supported_ = false;

    if (npf.userAgent.canvas.isTextSupported()) {
      /** @type {number} */
      var pixelRatio = goog.dom.getPixelRatio();
      /** @type {number} */
      var offset = 12 * pixelRatio;
      var node = /** @type {!HTMLCanvasElement} */ (
        goog.dom.createElement(goog.dom.TagName.CANVAS));
      var ctx = /** @type {CanvasRenderingContext2D} */ (node.getContext('2d'));
      ctx.fillStyle = '#f00';
      ctx.textBaseline = 'top';
      ctx.font = '32px Arial';
      ctx.fillText('\ud83d\udc28', 0, 0); // U+1F428 KOALA

      npf.userAgent.emoji.supported_ =
        0 !== ctx.getImageData(offset, offset, 1, 1).data[0];
    }
  }

  return /** @type {boolean} */ (npf.userAgent.emoji.supported_);
};
