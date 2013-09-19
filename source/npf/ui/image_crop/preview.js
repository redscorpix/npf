goog.provide('npf.ui.imageCrop.Preview');

goog.require('goog.math.Rect');
goog.require('goog.math.Size');
goog.require('npf.ui.StatedComponent');
goog.require('npf.ui.imageCrop.PreviewRenderer');


/**
 * @param {npf.ui.imageCrop.PreviewRenderer=} opt_renderer
 * @param {goog.dom.DomHelper=} opt_domHelper
 * @constructor
 * @extends {npf.ui.StatedComponent}
 */
npf.ui.imageCrop.Preview = function(opt_renderer, opt_domHelper) {
  goog.base(this, opt_renderer ||
    npf.ui.imageCrop.PreviewRenderer.getInstance(), opt_domHelper);
};
goog.inherits(npf.ui.imageCrop.Preview, npf.ui.StatedComponent);


/**
 * Обрезаемая часть изображения.
 * @private {goog.math.Rect}
 */
npf.ui.imageCrop.Preview.prototype.croppedRect_ = null;

/**
 * @private {Image}
 */
npf.ui.imageCrop.Preview.prototype.image_ = null;

/**
 * @private {number}
 */
npf.ui.imageCrop.Preview.prototype.maxHeight_ = Infinity;

/**
 * @private {number}
 */
npf.ui.imageCrop.Preview.prototype.maxWidth_ = Infinity;


/** @inheritDoc */
npf.ui.imageCrop.Preview.prototype.createDom = function() {
  goog.base(this, 'createDom');

  this.initializeInternal();
};

/** @inheritDoc */
npf.ui.imageCrop.Preview.prototype.decorateInternal = function(element) {
  goog.base(this, 'decorateInternal', element);

  this.initializeInternal();
};

/**
 * @protected
 */
npf.ui.imageCrop.Preview.prototype.initializeInternal = function() {
  this.applyImage(this.image_);
  this.applyCroppedRect(this.croppedRect_, this.getMaxSize());
};

/** @inheritDoc */
npf.ui.imageCrop.Preview.prototype.disposeInternal = function() {
  goog.base(this, 'disposeInternal');

  this.croppedRect_ = null;
  this.image_ = null;
};

/**
 * @return {goog.math.Rect}
 */
npf.ui.imageCrop.Preview.prototype.getCroppedRect = function() {
  return this.croppedRect_;
};

/**
 * @param {goog.math.Rect} rect
 * @param {boolean=} opt_force
 */
npf.ui.imageCrop.Preview.prototype.setCroppedRect = function(rect, opt_force) {
  /** @type {goog.math.Rect} */
  var newRect = null;

  if (rect) {
    /** @type {number} */
    var width = Math.max(rect.width, 0);
    /** @type {number} */
    var height = Math.max(rect.height, 0);
    /** @type {number} */
    var left = Math.max(rect.left, 0);
    /** @type {number} */
    var top = Math.max(rect.top, 0);
    /** @type {goog.math.Size} */
    var naturalSize = this.getImageNaturalSize();

    if (naturalSize) {
      width = Math.min(width, naturalSize.width);
      height = Math.min(height, naturalSize.height);
      left = Math.min(left, naturalSize.width - width);
      top = Math.min(top, naturalSize.height - height);
    }

    newRect = new goog.math.Rect(left, top, width, height);
  }

  if (opt_force || !goog.math.Rect.equals(this.croppedRect_, newRect)) {
    this.setCroppedRectInternal(newRect);
    this.applyCroppedRect(this.croppedRect_, this.getMaxSize());
  }
};

/**
 * @param {goog.math.Rect} rect
 * @protected
 */
npf.ui.imageCrop.Preview.prototype.setCroppedRectInternal = function(rect) {
  this.croppedRect_ = rect;
};

/**
 * @param {goog.math.Rect} rect
 * @param {goog.math.Size} maxSize
 * @protected
 */
npf.ui.imageCrop.Preview.prototype.applyCroppedRect = function(rect,
    maxSize) {
  /** @type {number} */
  var scale = this.getScaleInternal(this.image_, rect, maxSize);
  this.getRenderer().setCroppedRect(this, rect, scale);
  this.enableClassName(
    this.getRenderer().getEmptyCssClass(), !(rect && this.image_));
};

/**
 * @return {Image}
 */
npf.ui.imageCrop.Preview.prototype.getImage = function() {
  return this.image_;
};

/**
 * Set loaded image.
 * @param {Image} image
 * @param {goog.math.Rect=} opt_croppedRect
 */
npf.ui.imageCrop.Preview.prototype.setImage = function(image, opt_croppedRect) {
  /** @type {Image} */
  var oldImage = this.image_;

  if (oldImage !== image) {
    this.setImageInternal(image);
    this.applyImage(this.image_, oldImage);
    this.setCroppedRect(opt_croppedRect || this.croppedRect_);
  }
};

/**
 * @param {Image} image
 * @protected
 */
npf.ui.imageCrop.Preview.prototype.setImageInternal = function(image) {
  this.image_ = image;
};

/**
 * @param {Image} image
 * @param {Image=} opt_oldImage
 * @protected
 */
npf.ui.imageCrop.Preview.prototype.applyImage = function(image, opt_oldImage) {
  this.getRenderer().setImage(this, image, opt_oldImage);
};

/**
 * @return {Element}
 */
npf.ui.imageCrop.Preview.prototype.getImageElement = function() {
  return this.getRenderer().getImageElement(this.getElement());
};

/**
 * @return {goog.math.Size?}
 */
npf.ui.imageCrop.Preview.prototype.getImageNaturalSize = function() {
  return this.getRenderer().getImageSize(this.image_);
};

/**
 * @return {goog.math.Size?}
 */
npf.ui.imageCrop.Preview.prototype.getImageSize = function() {
  return this.getRenderer().getImageSize(this.image_, this.getScale());
};

/**
 * @return {!goog.math.Size}
 */
npf.ui.imageCrop.Preview.prototype.getMaxSize = function() {
  return new goog.math.Size(this.maxWidth_, this.maxHeight_);
};

/**
 * @param {number|goog.math.Size} width
 * @param {number=} opt_height
 */
npf.ui.imageCrop.Preview.prototype.setMaxSize = function(width, opt_height) {
  var w = /** @type {number} */ (goog.isNumber(width) ? width : width.width);
  var h = /** @type {number} */ (
    goog.isNumber(width) ? opt_height : width.height);

  if (!(this.maxWidth_ == w && this.maxHeight_ == h)) {
    this.setMaxSizeInternal(w, h);
    this.applyCroppedRect(this.croppedRect_, this.getMaxSize());
  }
};

/**
 * @param {number} width
 * @param {number} height
 * @protected
 */
npf.ui.imageCrop.Preview.prototype.setMaxSizeInternal = function(width,
    height) {
  this.maxWidth_ = width;
  this.maxHeight_ = height;
};

/**
 * @return {number}
 */
npf.ui.imageCrop.Preview.prototype.getScale = function() {
  return this.getScaleInternal(
    this.image_, this.croppedRect_, this.getMaxSize());
};

/**
 * @param {Image} image
 * @param {goog.math.Rect} rect
 * @param {goog.math.Size} maxSize
 * @return {number}
 * @protected
 */
npf.ui.imageCrop.Preview.prototype.getScaleInternal = function(image, rect,
    maxSize) {
  /** @type {number} */
  var scale = 1;

  if (maxSize && rect) {
    scale = Math.min(maxSize.width / rect.width, maxSize.height / rect.height);
  }

  return scale;
};
