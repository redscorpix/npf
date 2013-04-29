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
    /** @type {number} */
    var alpha;
    /** @type {number} */
    var newR;
    /** @type {number} */
    var newG;
    /** @type {number} */
    var newB;

    if (npf.graphics.ChromaKey.Back.RED == back) {
      for (var i = 0; i < data.length; i += 4) {
        if (
          2 > Math.abs(data[i] - 255) &&
          2 > Math.abs(data[i + 1]) &&
          2 > Math.abs(data[i + 2])
        ) {
          data[i + 3] = 0;
        } else if (
          2 <= Math.abs(data[i + 1] - data[i]) ||
          2 <= Math.abs(data[i + 2] - data[i])
        ) {
          alpha = goog.math.clamp(
            ((data[i + 1] + data[i + 2]) / 2 - data[i]) / 255 + 1, 0, 1);

          if (1 > alpha) {
            data[i]     = (data[i] - 255) / alpha + 255;
            data[i + 1] = data[i + 1] / alpha;
            data[i + 2] = data[i + 2] / alpha;
          }

          data[i + 3] = alpha * 255;
        }
      }
    } else if (npf.graphics.ChromaKey.Back.GREEN == back) {
      for (var i = 0; i < data.length; i += 4) {
        if (
          2 > Math.abs(data[i]) &&
          2 > Math.abs(data[i + 1] - 255) &&
          2 > Math.abs(data[i + 2])
        ) {
          data[i + 3] = 0;
        } else if (
          2 <= Math.abs(data[i + 1] - data[i]) ||
          2 <= Math.abs(data[i + 2] - data[i])
        ) {
          alpha = goog.math.clamp(
            ((data[i] + data[i + 2]) / 2 - data[i + 1]) / 255 + 1, 0, 1);

          if (1 > alpha) {
            data[i]     = data[i] / alpha;
            data[i + 1] = (data[i + 1] - 255) / alpha + 255;
            data[i + 2] = data[i + 2] / alpha;
          }

          data[i + 3] = alpha * 255;
        }
      }
    } else if (npf.graphics.ChromaKey.Back.BLUE == back) {
      for (var i = 0; i < data.length; i += 4) {
        alpha = 0;
        newR = 0;
        newG = 0;
        newB = 0;

        if (
          2 > Math.abs(data[i]) &&
          2 > Math.abs(data[i + 1]) &&
          2 > Math.abs(data[i + 2] - 255)
        ) {
          data[i + 3] = 0;
        } else if (
          2 <= Math.abs(data[i + 1] - data[i]) ||
          2 <= Math.abs(data[i + 2] - data[i])
        ) {
          alpha = goog.math.clamp(
            ((data[i] + data[i + 1]) / 2 - data[i + 2]) / 255 + 1, 0, 1);

          if (1 > alpha) {
            data[i]     = data[i] / alpha;
            data[i + 1] = data[i + 1] / alpha;
            data[i + 2] = (data[i + 2] - 255) / alpha + 255;
          }

          data[i + 3] = alpha * 255;
        }

        data[i]     = newR;
        data[i + 1] = newG;
        data[i + 2] = newB;
        data[i + 3] = alpha * 255;
      }
    }

    // Overwrite original image.
    ctx.putImageData(imageData, 0, 0);

    return true;
  }

  return false;
};
