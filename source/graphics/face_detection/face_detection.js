goog.provide('npf.graphics.FaceDetection');

goog.require('goog.array');
goog.require('goog.dom');
goog.require('goog.dom.TagName');
goog.require('goog.events.EventTarget');
goog.require('goog.math.Rect');
goog.require('npf.graphics.faceDetection.Detector');


/**
 * @param {Image} image Loaded image with right width and height.
 * @constructor
 * @extends {goog.events.EventTarget}
 * @source http://liuliu.me/ccv/js/nss/,
 *         https://github.com/liuliu/ccv/tree/unstable/js
 */
npf.graphics.FaceDetection = function(image) {
  goog.base(this);

  this._image = image;
};
goog.inherits(npf.graphics.FaceDetection, goog.events.EventTarget);


/**
 * @typedef {{
 *  rect: !goog.math.Rect,
 *  confidence: number,
 *  neighbors: number
 * }}
 */
npf.graphics.FaceDetection.Face;

/**
 * @enum {string}
 */
npf.graphics.FaceDetection.EventType = {
  /**
   * faces (!Array.<npf.graphics.FaceDetection.Face>)
   */
  DETECT: goog.events.getUniqueId('detect')
};

/**
 * @param {Image} image
 * @param {function(!Array.<npf.graphics.FaceDetection.Face>)} callback
 * @param {Object=} opt_scope
 */
npf.graphics.FaceDetection.detect = function(image, callback, opt_scope) {
  var faceDetection = new npf.graphics.FaceDetection(image);
  faceDetection.addEventListener(npf.graphics.FaceDetection.EventType.DETECT,
    function(evt) {
      var faces =
        /** @type {!Array.<npf.graphics.FaceDetection.Face>} */ (evt.faces);
      faceDetection.dispose();
      faceDetection = null;
      callback.call(opt_scope, faces);
    });
  faceDetection.start();
};

/**
 * @type {Image}
 * @private
 */
npf.graphics.FaceDetection.prototype._image;

/**
 * @type {Array.<npf.graphics.FaceDetection.Face>}
 * @private
 */
npf.graphics.FaceDetection.prototype._faces = null;


/** @inheritDoc */
npf.graphics.FaceDetection.prototype.disposeInternal = function() {
  goog.base(this, 'disposeInternal');

  this._image = null;
  this._faces = null;
};

/**
 * @return {Array.<goog.math.Rect>}
 */
npf.graphics.FaceDetection.prototype.getFaces = function() {
  return this._faces;
};

npf.graphics.FaceDetection.prototype.start = function() {
  var detector = new npf.graphics.faceDetection.Detector(
    this.grayscale(this.pre(this._image)));
  var comp = detector.detect();
  this._onDetect(comp);
};

/**
 * @param {!Array.<npf.graphics.faceDetection.Detector.Face>} sequence
 * @private
 */
npf.graphics.FaceDetection.prototype._onDetect = function(sequence) {
  /** @type {!Array.<goog.math.Rect>} */
  var faces = [];

  goog.array.forEach(sequence, function(item) {
    faces.push({
      rect: new goog.math.Rect(item.x, item.y, item.width, item.height),
      confidence: item.confidence,
      neighbors: item.neighbors
    });
  }, this);

  this._faces = faces;

  this.dispatchEvent({
    type: npf.graphics.FaceDetection.EventType.DETECT,
    faces: this._faces
  });
};

/**
 * @param {HTMLCanvasElement} canvas
 * @return {HTMLCanvasElement}
 */
npf.graphics.FaceDetection.prototype.grayscale = function(canvas) {
  var ctx = canvas.getContext("2d");
  var imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
  var data = imageData.data;
  var pix1, pix2, pix = canvas.width * canvas.height * 4;

  while (pix > 0) {
    data[pix -= 4] = data[pix1 = pix + 1] = data[pix2 = pix + 2] =
      (data[pix] * 0.3 + data[pix1] * 0.59 + data[pix2] * 0.11);
  }

  ctx.putImageData(imageData, 0, 0);

  return canvas;
};

/**
 * @param {Image|HTMLCanvasElement} image
 * @return {HTMLCanvasElement}
 */
npf.graphics.FaceDetection.prototype.pre = function(image) {
  if (goog.dom.TagName.IMG == image.tagName) {
    var canvas = /** @type {HTMLCanvasElement} */ (goog.dom.createDom(goog.dom.TagName.CANVAS, {
      'width': image.width,
      'height': image.height
    }));
    goog.dom.appendChild(document.body, canvas);

    var ctx = canvas.getContext("2d");
    ctx.drawImage(image, 0, 0);

    return canvas;
  }

  return /** @type {HTMLCanvasElement} */ (image);
};
