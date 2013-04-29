goog.provide('npf.graphics.Grayscale');

goog.require('goog.math');
goog.require('npf.graphics.Effect');


/**
 * @param {HTMLCanvasElement|Image|HTMLImageElement} source Canvas or loaded image.
 * @param {HTMLCanvasElement} destination
 * @constructor
 * @extends {npf.graphics.Effect}
 */
npf.graphics.Grayscale = function(source, destination) {
  goog.base(this, source, destination);
};
goog.inherits(npf.graphics.Grayscale, npf.graphics.Effect);


/**
 * @param {HTMLCanvasElement|Image|HTMLImageElement} source Canvas or loaded image.
 * @param {Object.<number|string>=} opt_attrs
 * @param {goog.dom.DomHelper=} opt_domHelper
 * @return {!npf.graphics.Grayscale}
 */
npf.graphics.Grayscale.create = function(source, opt_attrs, opt_domHelper) {
  /** @type {!HTMLCanvasElement} */
  var dest = npf.graphics.Effect.createCanvasElement(opt_attrs, opt_domHelper);

  return new npf.graphics.Grayscale(source, dest);
};


/**
 * @param {goog.math.Rect=} opt_sourceRect
 * @param {goog.math.Rect=} opt_destRect
 * @return {boolean}
 */
npf.graphics.Grayscale.prototype.convert = function(opt_sourceRect,
    opt_destRect) {
  if (
    this.drawImage(this.source, this.destination, opt_sourceRect, opt_destRect)
  ) {
    var ctx = /** @type {CanvasRenderingContext2D} */ (
      this.destination.getContext('2d'));
    /** @type {ImageData} */
    var imageData = ctx.getImageData(
      0, 0, this.destination.width, this.destination.height);
    var data = /** @type {Uint8ClampedArray} */ (imageData.data);

    for (var i = 0; i < data.length; i += 4) {
      var brightness = 0.34 * data[i] + 0.5 * data[i + 1] + 0.16 * data[i + 2];
      data[i] = brightness; // red
      data[i + 1] = brightness; // green
      data[i + 2] = brightness; // blue
    }

    ctx.putImageData(imageData, 0, 0);

    return true;
  }

  return false;
};
