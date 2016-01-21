goog.provide('npf.graphics.ChromaKey');

goog.require('npf.graphics.Effect');
goog.require('npf.graphics.chromaKey.convertor');


/**
 * @param {HTMLCanvasElement|Image|HTMLImageElement} source Canvas or loaded
 *    image.
 * @param {HTMLCanvasElement} destination
 * @constructor
 * @struct
 * @extends {npf.graphics.Effect}
 */
npf.graphics.ChromaKey = function(source, destination) {
  npf.graphics.ChromaKey.base(this, 'constructor', source, destination);
};
goog.inherits(npf.graphics.ChromaKey, npf.graphics.Effect);


/**
 * @param {HTMLCanvasElement|Image|HTMLImageElement} source Canvas or loaded
 *    image.
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
 * @param {npf.graphics.chromaKey.convertor.Back} back
 * @return {boolean}
 */
npf.graphics.ChromaKey.prototype.convert = function(back) {
  if (this.drawImage(this.source, this.destination)) {
    var ctx = /** @type {CanvasRenderingContext2D} */ (
      this.destination.getContext('2d'));
    /** @type {ImageData} */
    var imageData = ctx.getImageData(
      0, 0, this.destination.width, this.destination.height);
    npf.graphics.chromaKey.convertor.calculate(imageData, back);

    // Overwrite original image.
    ctx.putImageData(imageData, 0, 0);

    return true;
  }

  return false;
};

/**
 * @param {npf.graphics.chromaKey.convertor.Back} back
 * @param {string} workerSrc
 * @param {function(this: SCOPE, HTMLCanvasElement?)} callback
 * @param {SCOPE=} opt_scope
 * @template SCOPE
 */
npf.graphics.ChromaKey.prototype.convertInWorker = function(back, workerSrc,
    callback, opt_scope) {
  if (this.drawImage(this.source, this.destination)) {
    /** @type {HTMLCanvasElement} */
    var destination = this.destination;
    var ctx = /** @type {CanvasRenderingContext2D} */ (
      destination.getContext('2d'));
    /** @type {ImageData} */
    var imageData = ctx.getImageData(
      0, 0, destination.width, destination.height);

    var worker = new goog.global['Worker'](workerSrc);
    worker['onerror'] = function(evt) {
      worker['onerror'] = null;
      worker['onmessage'] = null;

      callback.call(opt_scope, null);
    };
    worker['onmessage'] = function(evt) {
      var imageData = /** @type {ImageData} */ (evt.data);

      worker['onerror'] = null;
      worker['onmessage'] = null;

      if (imageData) {
        // Overwrite original image.
        ctx.putImageData(imageData, 0, 0);
        callback.call(opt_scope, destination);
      } else {
        callback.call(opt_scope, null);
      }
    };
    worker['postMessage']({
      'back': back,
      'imageData': imageData
    });
  } else {
    callback.call(opt_scope, null);
  }
};
