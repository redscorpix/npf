goog.provide('npf.graphics.ChromaKey');
goog.provide('npf.graphics.ChromaKey.Back');

goog.require('goog.math');
goog.require('npf.graphics.Effect');


/**
 * @param {HTMLCanvasElement|Image|HTMLImageElement} source Canvas or loaded image.
 * @param {HTMLCanvasElement} destination
 * @constructor
 * @extends {npf.graphics.Effect}
 */
npf.graphics.ChromaKey = function(source, destination) {
  goog.base(this, source, destination);
};
goog.inherits(npf.graphics.ChromaKey, npf.graphics.Effect);


/**
 * @enum {number}
 */
npf.graphics.ChromaKey.Back = {
  RED: 1,
  GREEN: 2,
  BLUE: 3
};


/**
 * @param {HTMLCanvasElement|Image|HTMLImageElement} source Canvas or loaded image.
 * @param {Object.<number|string>=} opt_attrs
 * @param {goog.dom.DomHelper=} opt_domHelper
 * @return {!npf.graphics.ChromaKey}
 */
npf.graphics.ChromaKey.create = function(source, opt_attrs, opt_domHelper) {
  /** @type {!HTMLCanvasElement} */
  var dest = npf.graphics.Effect.createCanvasElement(opt_attrs, opt_domHelper);

  return new npf.graphics.ChromaKey(source, dest);
};

/**
 * @param {npf.graphics.ChromaKey.Back=} opt_back Defaults to
 *                                       npf.graphics.ChromaKey.Back.GREEN.
 * @return {boolean}
 */
npf.graphics.ChromaKey.prototype.convert = function(opt_back) {
  /** @type {npf.graphics.ChromaKey.Back} */
  var back = opt_back || npf.graphics.ChromaKey.Back.GREEN;

  if (this.drawImage(this.source, this.destination)) {
    var ctx = /** @type {CanvasRenderingContext2D} */ (
      this.destination.getContext('2d'));
    /** @type {ImageData} */
    var imageData = ctx.getImageData(
      0, 0, this.destination.width, this.destination.height);
    var data = /** @type {Uint8ClampedArray} */ (imageData.data);
    /** @type {Array.<number>} */
    var backRgb;
    /** @type {number} */
    var index1;
    /** @type {number} */
    var index2;
    /** @type {number} */
    var index3;

    switch (back) {
      case npf.graphics.ChromaKey.Back.RED:
        backRgb = [255, 0, 0];
        index1 = 1;
        index2 = 2;
        index3 = 0;
        break;

      case npf.graphics.ChromaKey.Back.GREEN:
        backRgb = [0, 255, 0];
        index1 = 0;
        index2 = 2;
        index3 = 1;
        break;

      case npf.graphics.ChromaKey.Back.BLUE:
        backRgb = [0, 0, 255];
        index1 = 0;
        index2 = 1;
        index3 = 2;
        break;
    }

    for (var i = 0; i < data.length; i += 4) {
      /** @type {number} */
      var r = data[i];
      /** @type {number} */
      var g = data[i + 1];
      /** @type {number} */
      var b = data[i + 2];
      /** @type {number} */
      var a = goog.math.clamp(
        (
          (data[i + index1] + data[i + index2]) / 2 - data[i + index3]
        ) / 255 + 1,
        0, 1
      );

      data[i]     = goog.math.clamp((r - (1 - a) * backRgb[0]) / a, 0, 255);
      data[i + 1] = goog.math.clamp((g - (1 - a) * backRgb[1]) / a, 0, 255);
      data[i + 2] = goog.math.clamp((b - (1 - a) * backRgb[2]) / a, 0, 255);
      data[i + 3] = Math.round(a * 255);
    }

    // Overwrite original image.
    ctx.putImageData(imageData, 0, 0);

    return true;
  }

  return false;
};
