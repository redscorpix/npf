goog.provide('npf.ui.ImageCrop');
goog.provide('npf.ui.ImageCropEvent');
goog.provide('npf.ui.ImageCrop.EventType');

goog.require('goog.events');
goog.require('goog.events.Event');
goog.require('goog.math');
goog.require('goog.math.Rect');
goog.require('goog.math.Size');
goog.require('npf.events.TouchHandler');
goog.require('npf.graphics.Scale');
goog.require('npf.ui.RenderedComponent');
goog.require('npf.ui.imageCrop.Cropper');
goog.require('npf.ui.imageCrop.Direction');
goog.require('npf.ui.imageCrop.Renderer');


/**
 * @param {Image=} opt_image
 * @param {npf.ui.imageCrop.Renderer=} opt_renderer
 * @param {goog.dom.DomHelper=} opt_domHelper
 * @constructor
 * @extends {npf.ui.RenderedComponent}
 */
npf.ui.ImageCrop = function(opt_image, opt_renderer, opt_domHelper) {
  goog.base(this, opt_renderer ||
    npf.ui.imageCrop.Renderer.getInstance(), opt_domHelper);

  this.image_ = opt_image || null;
};
goog.inherits(npf.ui.ImageCrop, npf.ui.RenderedComponent);


/**
 * @enum {string}
 */
npf.ui.ImageCrop.EventType = {

  /**
   * npf.ui.ImageCropEvent
   */
  CROP: goog.events.getUniqueId('crop')
};

/**
 * Обрезаемая часть изображения.
 * @private {goog.math.Rect}
 */
npf.ui.ImageCrop.prototype.croppedRect_ = null;

/**
 * @private {npf.ui.imageCrop.Cropper}
 */
npf.ui.ImageCrop.prototype.cropper_ = null;

/**
 * @private {Image}
 */
npf.ui.ImageCrop.prototype.image_;

/**
 * @private {goog.math.Size}
 */
npf.ui.ImageCrop.prototype.defaultCroppedSize_ = null;

/**
 * @private {goog.math.Size}
 */
npf.ui.ImageCrop.prototype.maxCroppedSize_ = null;

/**
 * @private {number}
 */
npf.ui.ImageCrop.prototype.maxHeight_ = Infinity;

/**
 * @private {number}
 */
npf.ui.ImageCrop.prototype.maxWidth_ = Infinity;

/**
 * @private {goog.math.Size}
 */
npf.ui.ImageCrop.prototype.minCroppedSize_ = null;

/**
 * @private {boolean}
 */
npf.ui.ImageCrop.prototype.onlySquare_ = false;

/**
 * @private {npf.ui.imageCrop.Preview}
 */
npf.ui.ImageCrop.prototype.preview_ = null;


/** @inheritDoc */
npf.ui.ImageCrop.prototype.createDom = function() {
  goog.base(this, 'createDom');

  this.initializeInternal();
};

/** @inheritDoc */
npf.ui.ImageCrop.prototype.decorateInternal = function(element) {
  goog.base(this, 'decorateInternal', element);

  this.initializeInternal();
};

/**
 * @protected
 */
npf.ui.ImageCrop.prototype.initializeInternal = function() {
  this.applyImage(this.image_);
  this.applyMaxSize(this.getMaxSize());
  this.applyCroppedRect(this.croppedRect_);
};

/** @inheritDoc */
npf.ui.ImageCrop.prototype.enterDocument = function() {
  goog.base(this, 'enterDocument');

  this.getHandler().listen(this.getContentElement(), [
    goog.events.EventType.MOUSEDOWN,
    goog.events.EventType.TOUCHSTART
  ], this.onMouseDown_);
};

/** @inheritDoc */
npf.ui.ImageCrop.prototype.disposeInternal = function() {
  goog.base(this, 'disposeInternal');

  this.croppedRect_ = null;
  this.cropper_ = null;
  this.defaultCroppedSize_ = null;
  this.image_ = null;
  this.maxCroppedSize_ = null;
  this.minCroppedSize_ = null;
  this.preview_ = null;
};

/**
 * @return {boolean}
 */
npf.ui.ImageCrop.prototype.isCropped = function() {
  return !!this.croppedRect_;
};

/**
 * @return {goog.math.Rect}
 */
npf.ui.ImageCrop.prototype.getCroppedRect = function() {
  return this.croppedRect_;
};

/**
 * @param {goog.math.Rect} rect
 * @param {npf.ui.imageCrop.Direction=} opt_direction Defaults
 *    to npf.ui.imageCrop.Direction.CENTER.
 * @param {boolean=} opt_force
 */
npf.ui.ImageCrop.prototype.setCroppedRect = function(rect, opt_direction,
    opt_force) {
  rect = this.correctCroppedRect(rect, opt_direction);

  if (opt_force || !goog.math.Rect.equals(this.croppedRect_, rect)) {
    this.setCroppedRectInternal(rect);
    this.applyCroppedRect(this.croppedRect_);
    this.dispatchCropEvent();
  }
};

/**
 * @param {goog.math.Rect} rect
 * @param {npf.ui.imageCrop.Direction=} opt_direction Defaults
 *    to npf.ui.imageCrop.Direction.CENTER.
 * @return {goog.math.Rect}
 * @protected
 */
npf.ui.ImageCrop.prototype.correctCroppedRect = function(rect, opt_direction) {
  /** @type {goog.math.Size} */
  var naturalSize = this.getImageNaturalSize();

  if (rect && naturalSize) {
    if (this.onlySquare_) {
      return this.correctCroppedSquare(rect, naturalSize, opt_direction);
    } else {
      return this.correctCroppedRectangle(rect, naturalSize, opt_direction);
    }
  }

  return null;
};

/**
 * @param {!goog.math.Rect} rect
 * @param {!goog.math.Size} naturalSize
 * @param {npf.ui.imageCrop.Direction=} opt_direction Defaults
 *    to npf.ui.imageCrop.Direction.CENTER.
 * @return {goog.math.Rect}
 * @protected
 */
npf.ui.ImageCrop.prototype.correctCroppedRectangle = function(rect, naturalSize,
    opt_direction) {
  /** @type {!goog.math.Size} */
  var maxSize = this.maxCroppedSize_ ?
  this.maxCroppedSize_.clone() : new goog.math.Size(Infinity, Infinity);
  maxSize.width = Math.min(naturalSize.width, maxSize.width);
  maxSize.height = Math.min(naturalSize.height, maxSize.height);
  /** @type {!goog.math.Size} */
  var minSize = this.minCroppedSize_ ?
    this.minCroppedSize_.clone() : new goog.math.Size(0, 0);
  minSize.width = Math.min(naturalSize.width, minSize.width);
  minSize.height = Math.min(naturalSize.height, minSize.height);
  /** @type {goog.math.Rect} */
  var oldRect = this.croppedRect_;
  /** @type {npf.ui.imageCrop.Direction} */
  var direction = opt_direction && oldRect ?
    opt_direction : npf.ui.imageCrop.Direction.CENTER;
  /** @type {number} */
  var width;
  /** @type {number} */
  var height;
  /** @type {number} */
  var left;
  /** @type {number} */
  var top;

  if (npf.ui.imageCrop.Direction.CENTER == direction) {
    width = goog.math.clamp(rect.width, minSize.width, maxSize.width);
    height = goog.math.clamp(rect.height, minSize.height, maxSize.height);
    left = goog.math.clamp(rect.left, 0, naturalSize.width - width);
    top = goog.math.clamp(rect.top, 0, naturalSize.height - height);
  } else {
    /** @type {number} */
    var maxHeight;
    /** @type {number} */
    var maxWidth;

    width = oldRect.width;
    height = oldRect.height;
    left = oldRect.left;
    top = oldRect.top;

    if (
      (
        npf.ui.imageCrop.Direction.BOTTOM |
        npf.ui.imageCrop.Direction.LEFT_BOTTOM |
        npf.ui.imageCrop.Direction.RIGHT_BOTTOM
      ) & direction
    ) {
      top = Math.min(oldRect.top, naturalSize.height - minSize.height);
      maxHeight = Math.min(naturalSize.height - top, maxSize.height);
      height = goog.math.clamp(rect.height, minSize.height, maxHeight);
    }

    if (
      (
        npf.ui.imageCrop.Direction.LEFT |
        npf.ui.imageCrop.Direction.LEFT_BOTTOM |
        npf.ui.imageCrop.Direction.LEFT_TOP
      ) & direction
    ) {
      /** @type {number} */
      var leftWidth = Math.max(oldRect.left + oldRect.width, minSize.width);
      maxWidth = Math.min(leftWidth, maxSize.width);
      width = goog.math.clamp(rect.width, minSize.width, maxWidth);
      left = leftWidth - width;
    }

    if (
      (
        npf.ui.imageCrop.Direction.RIGHT |
        npf.ui.imageCrop.Direction.RIGHT_BOTTOM |
        npf.ui.imageCrop.Direction.RIGHT_TOP
      ) & direction
    ) {
      left = Math.min(oldRect.left, naturalSize.width - minSize.width);
      maxWidth = Math.min(naturalSize.width - left, maxSize.width);
      width = goog.math.clamp(rect.width, minSize.width, maxWidth);
    }

    if (
      (
        npf.ui.imageCrop.Direction.LEFT_TOP |
        npf.ui.imageCrop.Direction.RIGHT_TOP |
        npf.ui.imageCrop.Direction.TOP
      ) & direction
    ) {
      /** @type {number} */
      var topHeight = Math.max(oldRect.top + oldRect.height, minSize.height);
      maxHeight = Math.min(topHeight, maxSize.height);
      height = goog.math.clamp(rect.height, minSize.height, maxHeight);
      top = topHeight - height;
    }
  }

  return new goog.math.Rect(left, top, width, height);
};

/**
 * @param {!goog.math.Rect} rect
 * @param {!goog.math.Size} naturalSize
 * @param {npf.ui.imageCrop.Direction=} opt_direction Defaults
 *    to npf.ui.imageCrop.Direction.CENTER.
 * @return {goog.math.Rect}
 * @protected
 */
npf.ui.ImageCrop.prototype.correctCroppedSquare = function(rect, naturalSize,
    opt_direction) {
  /** @type {number} */
  var maxSize;
  /** @type {number} */
  var minSize;

  if (this.maxCroppedSize_) {
    maxSize = Math.min(this.maxCroppedSize_.width, this.maxCroppedSize_.height);
  } else {
    maxSize = Infinity;
  }

  if (this.minCroppedSize_) {
    minSize = Math.max(this.minCroppedSize_.width, this.minCroppedSize_.height);
  } else {
    minSize = 0;
  }

  maxSize = Math.min(maxSize, naturalSize.width, naturalSize.height);
  minSize = Math.min(minSize, naturalSize.width, naturalSize.height);

  /** @type {goog.math.Rect} */
  var oldRect = this.croppedRect_;
  /** @type {npf.ui.imageCrop.Direction} */
  var direction = opt_direction && oldRect ?
    opt_direction : npf.ui.imageCrop.Direction.CENTER;
  /** @type {number} */
  var left;
  /** @type {number} */
  var top;
  /** @type {number} */
  var size;

  if (npf.ui.imageCrop.Direction.CENTER == direction) {
    size = goog.math.clamp(rect.width, minSize, maxSize);
    left = goog.math.clamp(rect.left, 0, naturalSize.width - size);
    top = goog.math.clamp(rect.top, 0, naturalSize.height - size);
  } else {
    /** @type {number} */
    var leftWidth = Math.max(oldRect.left + oldRect.width, minSize);
    /** @type {number} */
    var topHeight = Math.max(oldRect.top + oldRect.height, minSize);

    left = Math.min(oldRect.left, naturalSize.width - minSize);
    top = Math.min(oldRect.top, naturalSize.height - minSize);
    size = rect.width;

    switch (direction) {
      case npf.ui.imageCrop.Direction.BOTTOM:
        size = rect.height;
        maxSize = Math.min(naturalSize.height - top, maxSize);
        size = goog.math.clamp(size, minSize, maxSize);
        left = goog.math.clamp(
          oldRect.left + Math.round((oldRect.width - size) / 2),
          0, naturalSize.width - size
        );

        break;

      case npf.ui.imageCrop.Direction.LEFT:
        maxSize = Math.min(leftWidth, maxSize);
        size = goog.math.clamp(size, minSize, maxSize);
        left = leftWidth - size;
        top = goog.math.clamp(
          oldRect.top + Math.round((oldRect.height - size) / 2),
          0, naturalSize.height - size
        );

        break;

      case npf.ui.imageCrop.Direction.LEFT_BOTTOM:
        maxSize = Math.min(leftWidth, naturalSize.height - top, maxSize);
        size = goog.math.clamp(size, minSize, maxSize);
        left = leftWidth - size;

        break;

      case npf.ui.imageCrop.Direction.LEFT_TOP:
        maxSize = Math.min(leftWidth, topHeight, maxSize);
        size = goog.math.clamp(size, minSize, maxSize);
        left = leftWidth - size;
        top = topHeight - size;

        break;

      case npf.ui.imageCrop.Direction.RIGHT:
        maxSize = Math.min(naturalSize.width - left, maxSize);
        size = goog.math.clamp(size, minSize, maxSize);
        top = goog.math.clamp(
          oldRect.top + Math.round((oldRect.height - size) / 2),
          0, naturalSize.height - size
        );

        break;

      case npf.ui.imageCrop.Direction.RIGHT_BOTTOM:
        maxSize = Math.min(
          naturalSize.width - left, naturalSize.height - top, maxSize);
        size = goog.math.clamp(size, minSize, maxSize);

        break;

      case npf.ui.imageCrop.Direction.RIGHT_TOP:
        maxSize = Math.min(naturalSize.width - left, topHeight, maxSize);
        size = goog.math.clamp(size, minSize, maxSize);
        top = topHeight - size;

        break;

      case npf.ui.imageCrop.Direction.TOP:
      size = rect.height;
        maxSize = Math.min(topHeight, maxSize);
        size = goog.math.clamp(size, minSize, maxSize);
        top = topHeight - size;
        left = goog.math.clamp(
          oldRect.left + Math.round((oldRect.width - size) / 2),
          0, naturalSize.width - size
        );

        break;
    }
  }

  return new goog.math.Rect(left, top, size, size);
};

/**
 * @param {goog.math.Rect} rect
 * @protected
 */
npf.ui.ImageCrop.prototype.setCroppedRectInternal = function(rect) {
  this.croppedRect_ = rect;
};

/**
 * @param {goog.math.Rect} rect
 * @protected
 */
npf.ui.ImageCrop.prototype.applyCroppedRect = function(rect) {
  this.getRenderer().setCroppedRect(this, rect);
  this.enableClassName(this.getRenderer().getCroppedCssClass(), !!rect);

  if (this.preview_) {
    this.preview_.setCroppedRect(rect);
  }

  if (rect && this.image_) {
    if (this.cropper_) {
      this.cropper_.setCroppedRect(rect);
    } else {
      this.cropper_ = this.createCropper(this.image_, this.getScale(), rect);
      this.addChild(this.cropper_, true);
    }
  } else {
    if (this.cropper_) {
      this.removeChild(this.cropper_);
      this.cropper_.dispose();
      this.cropper_ = null;
    }
  }
};

/**
 * @param {!Image} image
 * @param {number} scale
 * @param {!goog.math.Rect} rect
 * @return {!npf.ui.imageCrop.Cropper}
 * @protected
 */
npf.ui.ImageCrop.prototype.createCropper = function(image, scale, rect) {
  var cropper = new npf.ui.imageCrop.Cropper(image, scale, rect);
  cropper.listen(npf.ui.imageCrop.Cropper.EventType.UPDATE,
    this.onCropperUpdate_, false, this);

  return cropper;
};

/**
 * @return {goog.math.Size}
 */
npf.ui.ImageCrop.prototype.getDefaultCroppedSize = function() {
  return this.defaultCroppedSize_;
};

/**
 * @param {goog.math.Size} size
 */
npf.ui.ImageCrop.prototype.setDefaultCroppedSize = function(size) {
  if (!goog.math.Size.equals(this.defaultCroppedSize_, size)) {
    this.setDefaultCroppedSizeInternal(size);
  }
};

/**
 * @param {goog.math.Size} size
 * @protected
 */
npf.ui.ImageCrop.prototype.setDefaultCroppedSizeInternal = function(size) {
  this.defaultCroppedSize_ = size;
};

/**
 * @return {Image}
 */
npf.ui.ImageCrop.prototype.getImage = function() {
  return this.image_;
};

/**
 * @param {Image} image
 * @param {goog.math.Rect=} opt_croppedRect
 */
npf.ui.ImageCrop.prototype.setImage = function(image, opt_croppedRect) {
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
npf.ui.ImageCrop.prototype.setImageInternal = function(image) {
  this.image_ = image;
};

/**
 * @param {Image} image
 * @param {Image=} opt_oldImage
 * @protected
 */
npf.ui.ImageCrop.prototype.applyImage = function(image, opt_oldImage) {
  this.getRenderer().setImage(this, image, opt_oldImage);

  if (this.preview_) {
    this.preview_.setImage(image, this.croppedRect_);
  }
};

/**
 * @return {Element}
 */
npf.ui.ImageCrop.prototype.getImageElement = function() {
  return this.getRenderer().getImageElement(this.getElement());
};

/**
 * @return {goog.math.Size?}
 */
npf.ui.ImageCrop.prototype.getImageNaturalSize = function() {
  return this.getRenderer().getImageSize(this.image_);
};

/**
 * @return {goog.math.Size?}
 */
npf.ui.ImageCrop.prototype.getImageSize = function() {
  return this.getRenderer().getImageSize(this.image_, this.getScale());
};

/**
 * @return {goog.math.Size?}
 */
npf.ui.ImageCrop.prototype.getMaxCroppedSize = function() {
  return this.maxCroppedSize_;
};

/**
 * @param {number|goog.math.Size} width
 * @param {number=} opt_height
 */
npf.ui.ImageCrop.prototype.setMaxCroppedSize = function(width, opt_height) {
  var w = /** @type {number} */ (goog.isNumber(width) ? width : width.width);
  var h = /** @type {number} */ (
    goog.isNumber(opt_height) ? opt_height : width.height);
  /** @type {!goog.math.Size} */
  var size = new goog.math.Size(w, h);

  if (this.minCroppedSize_) {
    size.width = Math.max(this.minCroppedSize_.width, size.width);
    size.height = Math.max(this.minCroppedSize_.height, size.height);
  }

  this.setMaxMinCroppedSize(size, this.minCroppedSize_);
};

/**
 * @param {goog.math.Size?} size
 * @protected
 */
npf.ui.ImageCrop.prototype.setMaxCroppedSizeInternal = function(size) {
  this.maxCroppedSize_ = size;
};

/**
 * @param {goog.math.Size=} opt_maxSize
 * @param {goog.math.Size=} opt_minSize
 */
npf.ui.ImageCrop.prototype.setMaxMinCroppedSize = function(opt_maxSize,
    opt_minSize) {
  /** @type {goog.math.Size} */
  var maxSize = opt_maxSize ? opt_maxSize.clone() : null;
  /** @type {goog.math.Size} */
  var minSize = opt_minSize ? opt_minSize.clone() : null;

  if (maxSize) {
    maxSize.width = Math.max(0, maxSize.width);
    maxSize.height = Math.max(0, maxSize.height);
  }

  if (minSize) {
    minSize.width = Math.max(0, minSize.width);
    minSize.height = Math.max(0, minSize.height);
  }

  if (maxSize && minSize) {
    maxSize.width = Math.max(maxSize.width, minSize.width);
    maxSize.height = Math.max(maxSize.height, minSize.height);
  }

  if (
    !goog.math.Size.equals(this.maxCroppedSize_, maxSize) ||
    !goog.math.Size.equals(this.minCroppedSize_, minSize)
  ) {
    this.setMaxCroppedSizeInternal(maxSize);
    this.setMinCroppedSizeInternal(minSize);
    this.applyMaxMinCroppedSize(this.maxCroppedSize_, this.minCroppedSize_);
  }
};

/**
 * @param {goog.math.Size?} maxSize
 * @param {goog.math.Size?} minSize
 * @protected
 */
npf.ui.ImageCrop.prototype.applyMaxMinCroppedSize = function(maxSize, minSize) {
  this.setCroppedRect(this.croppedRect_);
};

/**
 * @return {goog.math.Size?}
 */
npf.ui.ImageCrop.prototype.getMinCroppedSize = function() {
  return this.minCroppedSize_;
};

/**
 * @param {number|goog.math.Size} width
 * @param {number=} opt_height
 */
npf.ui.ImageCrop.prototype.setMinCroppedSize = function(width, opt_height) {
  var w = /** @type {number} */ (goog.isNumber(width) ? width : width.width);
  var h = /** @type {number} */ (
    goog.isNumber(opt_height) ? opt_height : width.height);
  /** @type {!goog.math.Size} */
  var size = new goog.math.Size(w, h);

  if (this.maxCroppedSize_) {
    size.width = Math.min(this.maxCroppedSize_.width, size.width);
    size.height = Math.min(this.maxCroppedSize_.height, size.height);
  }

  this.setMaxMinCroppedSize(this.maxCroppedSize_, size);
};

/**
 * @param {goog.math.Size?} size
 * @protected
 */
npf.ui.ImageCrop.prototype.setMinCroppedSizeInternal = function(size) {
  this.minCroppedSize_ = size;
};

/**
 * @return {boolean}
 */
npf.ui.ImageCrop.prototype.isOnlySquare = function() {
  return this.onlySquare_;
};

/**
 * @param {boolean} square
 */
npf.ui.ImageCrop.prototype.setOnlySquare = function(square) {
  if (this.onlySquare_ != square) {
    this.onlySquare_ = square;

    if (this.onlySquare_) {
      this.setCroppedRect(this.croppedRect_);
    }
  }
};

/**
 * @return {npf.ui.imageCrop.Preview}
 */
npf.ui.ImageCrop.prototype.getPreview = function() {
  return this.preview_;
};

/**
 * @param {npf.ui.imageCrop.Preview} preview
 */
npf.ui.ImageCrop.prototype.setPreview = function(preview) {
  if (this.preview_ !== preview) {
    this.preview_ = preview;
    this.preview_.setImage(this.image_, this.croppedRect_);
  }
};

/**
 * @return {!goog.math.Size}
 */
npf.ui.ImageCrop.prototype.getMaxSize = function() {
  return new goog.math.Size(this.maxWidth_, this.maxHeight_);
};

/**
 * @param {number|goog.math.Size} width
 * @param {number=} opt_height
 */
npf.ui.ImageCrop.prototype.setMaxSize = function(width, opt_height) {
  var w = /** @type {number} */ (goog.isNumber(width) ? width : width.width);
  var h = /** @type {number} */ (
    goog.isNumber(width) ? opt_height : width.height);

  if (!(this.maxWidth_ == w && this.maxHeight_ == h)) {
    this.setMaxSizeInternal(w, h);
    this.applyMaxSize(this.getMaxSize());
  }
};

/**
 * @param {number} width
 * @param {number} height
 * @protected
 */
npf.ui.ImageCrop.prototype.setMaxSizeInternal = function(width, height) {
  this.maxWidth_ = width;
  this.maxHeight_ = height;
};

/**
 * @param {goog.math.Size} maxSize
 * @protected
 */
npf.ui.ImageCrop.prototype.applyMaxSize = function(maxSize) {
  this.getRenderer().setMaxSize(this, maxSize);

  if (this.cropper_) {
    this.cropper_.setScale(this.getScale());
  }
};

/**
 * @return {number}
 */
npf.ui.ImageCrop.prototype.getScale = function() {
  return this.getScaleInternal(this.image_, this.getMaxSize());
};

/**
 * @param {Image} image
 * @param {goog.math.Size} maxSize
 * @return {number}
 * @protected
 */
npf.ui.ImageCrop.prototype.getScaleInternal = function(image, maxSize) {
  /** @type {number} */
  var scale = 1;
  /** @type {goog.math.Size} */
  var naturalSize = this.getRenderer().getImageSize(image);

  if (naturalSize && maxSize) {
    /** @type {!goog.math.Size} */
    var cropSize = npf.graphics.Scale.contain(naturalSize, maxSize);
    scale = cropSize.width / naturalSize.width;
  }

  return scale;
};

/**
 * @protected
 */
npf.ui.ImageCrop.prototype.dispatchCropEvent = function() {
  var event = new npf.ui.ImageCropEvent(
    npf.ui.ImageCrop.EventType.CROP, this.croppedRect_);
  this.dispatchEvent(event);
};

/**
 * @param {goog.events.BrowserEvent} evt
 * @private
 */
npf.ui.ImageCrop.prototype.onMouseDown_ = function(evt) {
  if (
    !this.croppedRect_ &&
    (
      evt.isMouseActionButton() ||
      (
        goog.events.EventType.TOUCHSTART == evt.type &&
        1 == npf.events.TouchHandler.countFingers(evt.getBrowserEvent())
      )
    )
  ) {
    /** @type {!goog.math.Coordinate} */
    var position = goog.style.getRelativePosition(
      evt, this.getContentElement()).scale(1 / this.getScale()).round();
    /** @type {!goog.math.Size} */
    var size = this.defaultCroppedSize_ ?
      this.defaultCroppedSize_.clone() : new goog.math.Size(1, 1);

    if (this.minCroppedSize_) {
      size.width = Math.max(size.width, this.minCroppedSize_.width);
      size.height = Math.max(size.height, this.minCroppedSize_.height);
    }

    if (this.maxCroppedSize_) {
      size.width = Math.min(size.width, this.maxCroppedSize_.width);
      size.height = Math.min(size.height, this.maxCroppedSize_.height);
    }

    position.x = position.x - Math.round(size.width / 2);
    position.y = position.y - Math.round(size.height / 2);

    this.setCroppedRect(
      new goog.math.Rect(position.x, position.y, size.width, size.height));
  }
};

/**
 * @param {npf.ui.imageCrop.CropperEvent} evt
 * @private
 */
npf.ui.ImageCrop.prototype.onCropperUpdate_ = function(evt) {
  /** @type {!goog.math.Rect} */
  var croppedRect = evt.croppedRect;
  /** @type {npf.ui.imageCrop.Direction} */
  var direction = evt.direction;
  this.setCroppedRect(croppedRect, direction);
};


/**
 * @param {npf.ui.ImageCrop.EventType} type
 * @param {goog.math.Rect?} rect
 * @constructor
 * @extends {goog.events.Event}
 */
npf.ui.ImageCropEvent = function(type, rect) {
  goog.base(this, type);

  /**
   * @type {goog.math.Rect?}
   */
  this.rect = rect;
};
goog.inherits(npf.ui.ImageCropEvent, goog.events.Event);
