goog.provide('npf.graphics.chromaKey.convertor');
goog.provide('npf.graphics.chromaKey.convertor.Back');

goog.require('goog.math');


/**
 * @enum {number}
 */
npf.graphics.chromaKey.convertor.Back = {
  RED: 1,
  GREEN: 2,
  BLUE: 3
};

/**
 * @param {ImageData} imageData
 * @param {npf.graphics.chromaKey.convertor.Back} back
 */
npf.graphics.chromaKey.convertor.calculate = function(imageData, back) {
  var data = /** @type {Uint8ClampedArray} */ (imageData.data);
  /** @type {number} */
  var alpha;
  /** @type {number} */
  var newR;
  /** @type {number} */
  var newG;
  /** @type {number} */
  var newB;
  /** @type {number} */
  var i;

  if (npf.graphics.chromaKey.convertor.Back.RED == back) {
    for (i = 0; i < data.length; i += 4) {
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
  } else if (npf.graphics.chromaKey.convertor.Back.GREEN == back) {
    for (i = 0; i < data.length; i += 4) {
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
  } else if (npf.graphics.chromaKey.convertor.Back.BLUE == back) {
    for (i = 0; i < data.length; i += 4) {
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
};
