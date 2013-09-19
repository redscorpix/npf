goog.provide('npf.graphics.FaceDetection');
goog.provide('npf.graphics.FaceDetectionEvent');
goog.provide('npf.graphics.FaceDetection.EventType');

goog.require('goog.array');
goog.require('goog.dom');
goog.require('goog.dom.TagName');
goog.require('goog.events');
goog.require('goog.events.Event');
goog.require('goog.events.EventTarget');
goog.require('goog.math.Rect');
goog.require('goog.math.Size');
goog.require('npf.graphics.faceDetection.Detector');


/**
 * Source: http://liuliu.me/ccv/js/nss/,
 *  https://github.com/liuliu/ccv/tree/unstable/js
 * @param {Image|HTMLCanvasElement} image Canvas or loaded image with right
 *    width and height.
 * @param {number=} opt_scale
 * @param {goog.dom.DomHelper=} opt_domHelper
 * @constructor
 * @extends {goog.events.EventTarget}
 */
npf.graphics.FaceDetection = function(image, opt_scale, opt_domHelper) {
  goog.base(this);

  this.domHelper_ = opt_domHelper || goog.dom.getDomHelper();
  this.image_ = image;
  this.scale_ = opt_scale || 1;
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
   * npf.graphics.FaceDetection.Event
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
  faceDetection.listen(npf.graphics.FaceDetection.EventType.DETECT,
    function(evt) {
      /** @type {!Array.<npf.graphics.FaceDetection.Face>} */
      var faces = evt.faces;
      faceDetection.dispose();
      faceDetection = null;
      callback.call(opt_scope, faces);
    });
  faceDetection.start();
};


/**
 * @private {goog.dom.DomHelper}
 */
npf.graphics.FaceDetection.prototype.domHelper_;

/**
 * @private {Array.<npf.graphics.FaceDetection.Face>}
 */
npf.graphics.FaceDetection.prototype.faces_ = null;

/**
 * @type {Image|HTMLCanvasElement}
 * @private
 */
npf.graphics.FaceDetection.prototype.image_;

/**
 * @private {number}
 */
npf.graphics.FaceDetection.prototype.scale_;


/** @inheritDoc */
npf.graphics.FaceDetection.prototype.disposeInternal = function() {
  goog.base(this, 'disposeInternal');

  this.domHelper_ = null;
  this.faces_ = null;
  this.image_ = null;
};

/**
 * @return {goog.dom.DomHelper}
 */
npf.graphics.FaceDetection.prototype.getDomHelper = function() {
  return this.domHelper_;
};

/**
 * @return {Array.<npf.graphics.FaceDetection.Face>}
 */
npf.graphics.FaceDetection.prototype.getFaces = function() {
  return this.faces_;
};

/**
 * @return {Image|HTMLCanvasElement}
 */
npf.graphics.FaceDetection.prototype.getImage = function() {
  return this.image_;
};

/**
 * @return {number}
 */
npf.graphics.FaceDetection.prototype.getScale = function() {
  return this.scale_;
};

/**
 * @param {number} scale
 */
npf.graphics.FaceDetection.prototype.setScale = function(scale) {
  this.scale_ = scale;
};

npf.graphics.FaceDetection.prototype.start = function() {
  var detector = new npf.graphics.faceDetection.Detector(
    this.grayscale(this.pre(this.image_)));
  var comp = detector.detect();
  this.onDetect_(comp);
};

/**
 * @param {!Array.<npf.graphics.faceDetection.Detector.Face>} sequence
 * @private
 */
npf.graphics.FaceDetection.prototype.onDetect_ = function(sequence) {
  this.faces_ = goog.array.map(sequence, function(item) {
    /** @type {!goog.math.Rect} */
    var rect = (new goog.math.Rect(item.x, item.y, item.width, item.height)).
      scale(1 / this.scale_).round();

    return {
      rect: rect,
      confidence: item.confidence,
      neighbors: item.neighbors
    };
  }, this);

  var event = new npf.graphics.FaceDetectionEvent(
    npf.graphics.FaceDetection.EventType.DETECT, this.faces_);
  this.dispatchEvent(event);
};

/**
 * @param {HTMLCanvasElement} canvas
 * @return {HTMLCanvasElement}
 */
npf.graphics.FaceDetection.prototype.grayscale = function(canvas) {
  var ctx = canvas.getContext("2d");
  var imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
  var data = imageData.data;
  var pix = canvas.width * canvas.height * 4;

  while (pix > 0) {
    var pix1;
    var pix2;
    data[pix -= 4] = data[pix1 = pix + 1] = data[pix2 = pix + 2] =
      (data[pix] * 0.3 + data[pix1] * 0.59 + data[pix2] * 0.11);
  }

  ctx.putImageData(imageData, 0, 0);

  return canvas;
};

/**
 * @param {Image|HTMLCanvasElement} image
 * @return {!HTMLCanvasElement}
 */
npf.graphics.FaceDetection.prototype.pre = function(image) {
  /** @type {number} */
  var nativeWidth = goog.isNumber(image.nativeWidth) ?
    image.nativeWidth : image.width;
  /** @type {number} */
  var nativeHeight = goog.isNumber(image.nativeHeight) ?
    image.nativeHeight : image.height;
  /** @type {!goog.math.Size} */
  var size = (new goog.math.Size(nativeWidth, nativeHeight)).
    scale(this.scale_).round();
  var canvas = /** @type {!HTMLCanvasElement} */ (this.domHelper_.createDom(
    goog.dom.TagName.CANVAS, {
      'width': size.width,
      'height': size.height
    })
  );

  var ctx = canvas.getContext("2d");
  ctx.drawImage(image, 0, 0, size.width, size.height);

  return canvas;
};


/**
 * @param {npf.graphics.FaceDetection.EventType} type
 * @param {!Array.<npf.graphics.FaceDetection.Face>} faces
 * @constructor
 * @extends {goog.events.Event}
 */
npf.graphics.FaceDetectionEvent = function(type, faces) {
  goog.base(this, type);

  /**
   * @type {!Array.<npf.graphics.FaceDetection.Face>}
   */
  this.faces = faces;
};
goog.inherits(npf.graphics.FaceDetectionEvent, goog.events.Event);
