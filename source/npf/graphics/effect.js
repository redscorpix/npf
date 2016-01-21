goog.provide('npf.graphics.Effect');

goog.require('goog.dom');
goog.require('goog.dom.TagName');
goog.require('goog.math.Rect');
goog.require('goog.object');


/**
 * @param {HTMLCanvasElement|Image|HTMLImageElement} source
 *                                                      Canvas or loaded image.
 * @param {HTMLCanvasElement} destination
 * @constructor
 * @struct
 */
npf.graphics.Effect = function(source, destination) {

  /**
   * @type {HTMLCanvasElement}
   */
  this.destination = destination;

  /**
   * @type {Image|HTMLCanvasElement|HTMLImageElement}
   */
  this.source = source;
};


/**
 * @param {Object.<number|string>=} opt_attrs
 * @param {goog.dom.DomHelper=} opt_domHelper
 * @return {!HTMLCanvasElement}
 */
npf.graphics.Effect.createCanvasElement = function(opt_attrs, opt_domHelper) {
  /** @type {!Object.<number|string>} */
  var attrs = opt_attrs ? goog.object.clone(opt_attrs) : {};
  /** @type {!goog.dom.DomHelper} */
  var domHelper = opt_domHelper || goog.dom.getDomHelper();

  return /** @type {!HTMLCanvasElement} */ (
    domHelper.createDom(goog.dom.TagName.CANVAS, attrs)
  );
};


/**
 * @param {HTMLCanvasElement|Image|HTMLImageElement} source
 * @param {HTMLCanvasElement} destination
 * @param {goog.math.Rect=} opt_sourceRect
 * @param {goog.math.Rect=} opt_destRect
 * @return {boolean}
 * @protected
 */
npf.graphics.Effect.prototype.drawImage = function(source, destination,
    opt_sourceRect, opt_destRect) {
  var ctx = /** @type {CanvasRenderingContext2D} */ (
    destination.getContext('2d'));
  /** @type {!goog.math.Rect} */
  var sourceRect = opt_sourceRect ||
    new goog.math.Rect(0, 0, source.width, source.height);
  /** @type {!goog.math.Rect} */
  var destRect = opt_destRect ||
    new goog.math.Rect(0, 0, source.width, source.height);

  destination.width = destRect.width;
  destination.height = destRect.height;

  if (source.getContext) {
    // Изображение не масштабируется.

    /** @type {ImageData} */
    var imageData = this.getImageData(source, sourceRect);

    if (imageData) {
      ctx.putImageData(
        imageData,
        destRect.left, destRect.top,
        sourceRect.left, sourceRect.top, sourceRect.width, sourceRect.height
      );

      return true;
    }

    return false;
  }

  // Изображение масштабируется, если sourceRect != destRect.

  var image = /** @type {!Image|HTMLImageElement} */ (source);
  ctx.drawImage(
    image,
    sourceRect.left, sourceRect.top, sourceRect.width, sourceRect.height,
    destRect.left, destRect.top, destRect.width, destRect.height
  );

  return true;
};

/**
 * @param {HTMLCanvasElement|Image|HTMLImageElement} source
 * @param {goog.math.Rect=} opt_rect
 * @return {ImageData}
 * @protected
 */
npf.graphics.Effect.prototype.getImageData = function(source, opt_rect) {
  /** @type {!goog.math.Rect} */
  var rect = opt_rect || new goog.math.Rect(0, 0, source.width, source.height);
  /** @type {HTMLCanvasElement} */
  var canvas;
  /** @type {CanvasRenderingContext2D} */
  var ctx;

  if (source.getContext) {
    canvas = /** @type {!HTMLCanvasElement} */ (source);
    ctx = /** @type {CanvasRenderingContext2D} */ (canvas.getContext('2d'));
  } else {
    var image = /** @type {!Image|HTMLImageElement} */ (source);

    canvas = npf.graphics.Effect.createCanvasElement();
    canvas.width = image.width;
    canvas.height = image.height;
    ctx = /** @type {CanvasRenderingContext2D} */ (canvas.getContext('2d'));
    ctx.drawImage(image, 0, 0);
  }

  /** @type {ImageData} */
  var imageData = null;

  try {
    imageData = ctx.getImageData(rect.left, rect.top, rect.width, rect.height);
  } catch(e) {
    throw new Error("unable to access image data: " + e);
  }

  return imageData;
};
