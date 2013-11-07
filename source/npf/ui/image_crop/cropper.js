goog.provide('npf.ui.imageCrop.Cropper');
goog.provide('npf.ui.imageCrop.CropperEvent');
goog.provide('npf.ui.imageCrop.Cropper.EventType');

goog.require('goog.events');
goog.require('goog.events.Event');
goog.require('goog.events.EventType');
goog.require('goog.fx.Dragger');
goog.require('goog.fx.Dragger.EventType');
goog.require('goog.math.Rect');
goog.require('goog.math.Size');
goog.require('npf.events.TouchHandler');
goog.require('npf.ui.StatedComponent');
goog.require('npf.ui.imageCrop.CropperRenderer');
goog.require('npf.ui.imageCrop.Direction');


/**
 * @param {!Image} image
 * @param {number} scale
 * @param {!goog.math.Rect} rect
 * @param {npf.ui.imageCrop.CropperRenderer=} opt_renderer
 * @param {goog.dom.DomHelper=} opt_domHelper
 * @constructor
 * @extends {npf.ui.StatedComponent}
 */
npf.ui.imageCrop.Cropper = function(image, scale, rect, opt_renderer,
    opt_domHelper) {
  goog.base(this, opt_renderer ||
    npf.ui.imageCrop.CropperRenderer.getInstance(), opt_domHelper);

  this.croppedRect_ = rect;
  this.image_ = image;
  this.scale_ = scale;
};
goog.inherits(npf.ui.imageCrop.Cropper, npf.ui.StatedComponent);


/**
 * @enum {string}
 */
npf.ui.imageCrop.Cropper.EventType = {

  /**
   * npf.ui.imageCrop.CropperEvent
   */
  UPDATE: goog.events.getUniqueId('update')
};


/**
 * @private {goog.math.Rect}
 */
npf.ui.imageCrop.Cropper.prototype.croppedRect_;

/**
 * @private {number}
 */
npf.ui.imageCrop.Cropper.prototype.direction_ = npf.ui.imageCrop.Direction.ALL;

/**
 * @private {goog.fx.Dragger}
 */
npf.ui.imageCrop.Cropper.prototype.dragger_ = null;

/**
 * @private {Image}
 */
npf.ui.imageCrop.Cropper.prototype.image_;

/**
 * @private {number}
 */
npf.ui.imageCrop.Cropper.prototype.scale_;


/** @inheritDoc */
npf.ui.imageCrop.Cropper.prototype.createDom = function() {
  goog.base(this, 'createDom');

  this.initializeInternal();
};

/** @inheritDoc */
npf.ui.imageCrop.Cropper.prototype.decorateInternal = function(element) {
  goog.base(this, 'decorateInternal', element);

  this.initializeInternal();
};

/**
 * @protected
 */
npf.ui.imageCrop.Cropper.prototype.initializeInternal = function() {
  this.applyScale(this.scale_);
};

/** @inheritDoc */
npf.ui.imageCrop.Cropper.prototype.enterDocument = function() {
  goog.base(this, 'enterDocument');

  this.getHandler().listen(this.getElement(), [
    goog.events.EventType.MOUSEDOWN,
    goog.events.EventType.TOUCHSTART
  ], this.onMouseDown_);
};

/** @inheritDoc */
npf.ui.imageCrop.Cropper.prototype.exitDocument = function() {
  goog.dispose(this.dragger_);
  this.dragger_ = null;

  goog.base(this, 'exitDocument');
};

/** @inheritDoc */
npf.ui.imageCrop.Cropper.prototype.disposeInternal = function() {
  goog.base(this, 'disposeInternal');

  this.croppedRect_ = null;
  this.image_ = null;
};

/**
 * @return {goog.math.Rect}
 */
npf.ui.imageCrop.Cropper.prototype.getCroppedRect = function() {
  return this.croppedRect_;
};

/**
 * @param {!goog.math.Rect} rect
 */
npf.ui.imageCrop.Cropper.prototype.setCroppedRect = function(rect) {
  if (!goog.math.Rect.equals(this.croppedRect_, rect)) {
    this.setCroppedRectInternal(rect);
    this.applyCroppedRect(this.croppedRect_);
  }
};

/**
 * @param {!goog.math.Rect} rect
 * @protected
 */
npf.ui.imageCrop.Cropper.prototype.setCroppedRectInternal = function(
    rect) {
  this.croppedRect_ = rect;
};

/**
 * @param {goog.math.Rect} rect
 * @protected
 */
npf.ui.imageCrop.Cropper.prototype.applyCroppedRect = function(rect) {
  this.getRenderer().setCroppedRect(this, rect, this.scale_);
};

/**
 * @return {number} Bit mask representing direction.
 */
npf.ui.imageCrop.Cropper.prototype.getDirection = function() {
  return this.direction_;
};


/**
 * @param {npf.ui.imageCrop.Direction} direction
 * @return {boolean}
 */
npf.ui.imageCrop.Cropper.prototype.hasDirection = function(direction) {
  return !!(this.direction_ & direction);
};

/**
 * @param {npf.ui.imageCrop.Direction} direction
 * @param {boolean} enable
 */
npf.ui.imageCrop.Cropper.prototype.setDirection = function(direction, enable) {
  if (enable != this.hasDirection(direction)) {
    var newDirection = /** @type {npf.ui.imageCrop.Direction} */ (
      enable ? this.direction_ | direction : this.direction_ & ~direction);
    this.setDirectionInternal(newDirection);
    this.getRenderer().setDirection(this, direction, enable);
  }
};

/**
 * @param {npf.ui.imageCrop.Direction} direction
 * @protected
 */
npf.ui.imageCrop.Cropper.prototype.setDirectionInternal = function(direction) {
  this.direction_ = direction;
};

/**
 * @param {npf.ui.imageCrop.Direction} direction
 * @return {Element}
 */
npf.ui.imageCrop.Cropper.prototype.getDirectionElement = function(direction) {
  return this.getRenderer().getDirectionElement(this.getElement(), direction);
};

/**
 * @return {Image}
 */
npf.ui.imageCrop.Cropper.prototype.getImage = function() {
  return this.image_;
};

/**
 * @return {Element}
 */
npf.ui.imageCrop.Cropper.prototype.getImageElement = function() {
  return this.getRenderer().getImageElement(this.getElement());
};

/**
 * @return {!goog.math.Size}
 */
npf.ui.imageCrop.Cropper.prototype.getImageNaturalSize = function() {
  return this.getRenderer().getImageSize(this.image_);
};

/**
 * @return {!goog.math.Size}
 */
npf.ui.imageCrop.Cropper.prototype.getImageSize = function() {
  return this.getRenderer().getImageSize(this.image_, this.scale_);
};

/**
 * @return {number}
 */
npf.ui.imageCrop.Cropper.prototype.getScale = function() {
  return this.scale_;
};

/**
 * @param {number} scale
 */
npf.ui.imageCrop.Cropper.prototype.setScale = function(scale) {
  if (this.scale_ != scale) {
    this.setScaleInternal(scale);
    this.applyScale(this.scale_);
  }
};

/**
 * @param {number} scale
 * @protected
 */
npf.ui.imageCrop.Cropper.prototype.setScaleInternal = function(scale) {
  this.scale_ = scale;
};

/**
 * @param {number} scale
 * @protected
 */
npf.ui.imageCrop.Cropper.prototype.applyScale = function(scale) {
  this.getRenderer().setScale(this, scale);
  this.getRenderer().setCroppedRect(this, this.croppedRect_, scale);
};

/**
 * @param {goog.events.BrowserEvent} evt
 * @private
 */
npf.ui.imageCrop.Cropper.prototype.onMouseDown_ = function(evt) {
  if (
    evt.isMouseActionButton() ||
    (
      goog.events.EventType.TOUCHSTART == evt.type &&
      1 == npf.events.TouchHandler.countFingers(evt.getBrowserEvent())
    )
  ) {
    this.startDrag(evt);
  }
};

/**
 * @param {goog.events.BrowserEvent} evt
 * @param {npf.ui.imageCrop.Direction=} opt_direction
 */
npf.ui.imageCrop.Cropper.prototype.startDrag = function(evt, opt_direction) {
  /** @type {goog.math.Size} */
  var naturalSize = this.getImageNaturalSize();

  if (this.isInDocument() && naturalSize) {
    goog.dispose(this.dragger_);

    /** @type {npf.ui.imageCrop.Direction?} */
    var direction = null;

    if (opt_direction) {
      direction = opt_direction;
    } else {
      /** @type {Element} */
      var draggerElement = /** @type {Element} */ (evt.target);
      direction = this.getRenderer().getDirection(draggerElement);
    }

    if (!direction || !this.hasDirection(direction)) {
      direction = npf.ui.imageCrop.Direction.CENTER;
    }

    /** @type {function(goog.fx.DragEvent)?} */
    var onDrag = null;
    /** @type {goog.math.Rect} */
    var croppedRect = this.croppedRect_;
    /** @type {number} */
    var leftLimit;
    /** @type {number} */
    var topLimit;
    /** @type {number} */
    var widthLimit;
    /** @type {number} */
    var heightLimit;

    switch (direction) {
      case npf.ui.imageCrop.Direction.BOTTOM:
        leftLimit = croppedRect.left;
        topLimit = croppedRect.top - croppedRect.height;
        widthLimit = 0;
        heightLimit = naturalSize.height - croppedRect.top;

        onDrag = function(evt) {
          /** @type {number} */
          var top = Math.round(evt.top / this.scale_);
          this.dispatchUpdateEvent(new goog.math.Rect(
            croppedRect.left,
            croppedRect.top,
            croppedRect.width,
            croppedRect.height + top - croppedRect.top
          ), direction);
        };

        break;

      case npf.ui.imageCrop.Direction.CENTER:
        leftLimit = 0;
        topLimit = 0;
        widthLimit = naturalSize.width - croppedRect.width;
        heightLimit = naturalSize.height - croppedRect.height;

        onDrag = function(evt) {
          this.dispatchUpdateEvent(new goog.math.Rect(
            Math.round(evt.left / this.scale_),
            Math.round(evt.top / this.scale_),
            croppedRect.width,
            croppedRect.height
          ), direction);
        };

        break;

      case npf.ui.imageCrop.Direction.LEFT:
        leftLimit = 0;
        topLimit = croppedRect.top;
        widthLimit = croppedRect.left + croppedRect.width;
        heightLimit = 0;

        onDrag = function(evt) {
          /** @type {number} */
          var left = Math.round(evt.left / this.scale_);
          this.dispatchUpdateEvent(new goog.math.Rect(
            left,
            croppedRect.top,
            croppedRect.left + croppedRect.width - left,
            croppedRect.height
          ), direction);
        };

        break;

      case npf.ui.imageCrop.Direction.LEFT_BOTTOM:
        leftLimit = 0;
        topLimit = croppedRect.top - croppedRect.height;
        widthLimit = croppedRect.left + croppedRect.width;
        heightLimit = naturalSize.height - croppedRect.top;

        onDrag = function(evt) {
          /** @type {number} */
          var left = Math.round(evt.left / this.scale_);
          /** @type {number} */
          var top = Math.round(evt.top / this.scale_);
          this.dispatchUpdateEvent(new goog.math.Rect(
            left,
            croppedRect.top,
            croppedRect.left + croppedRect.width - left,
            croppedRect.height + top - croppedRect.top
          ), direction);
        };

        break;

      case npf.ui.imageCrop.Direction.LEFT_TOP:
        leftLimit = 0;
        topLimit = 0;
        widthLimit = croppedRect.left + croppedRect.width;
        heightLimit = croppedRect.top + croppedRect.height;

        onDrag = function(evt) {
          /** @type {number} */
          var left = Math.round(evt.left / this.scale_);
          /** @type {number} */
          var top = Math.round(evt.top / this.scale_);
          this.dispatchUpdateEvent(new goog.math.Rect(
            left,
            top,
            croppedRect.left + croppedRect.width - left,
            croppedRect.height + croppedRect.top - top
          ), direction);
        };

        break;

      case npf.ui.imageCrop.Direction.RIGHT:
        leftLimit = croppedRect.left - croppedRect.width;
        topLimit = croppedRect.top;
        widthLimit = naturalSize.width - croppedRect.left;
        heightLimit = 0;

        onDrag = function(evt) {
          /** @type {number} */
          var left = Math.round(evt.left / this.scale_);
          this.dispatchUpdateEvent(new goog.math.Rect(
            croppedRect.left,
            croppedRect.top,
            croppedRect.width + left - croppedRect.left,
            croppedRect.height
          ), direction);
        };

        break;

      case npf.ui.imageCrop.Direction.RIGHT_BOTTOM:
        leftLimit = croppedRect.left - croppedRect.width;
        topLimit = croppedRect.top - croppedRect.height;
        widthLimit = naturalSize.width - croppedRect.left;
        heightLimit = naturalSize.height - croppedRect.top;

        onDrag = function(evt) {
          /** @type {number} */
          var left = Math.round(evt.left / this.scale_);
          /** @type {number} */
          var top = Math.round(evt.top / this.scale_);
          this.dispatchUpdateEvent(new goog.math.Rect(
            croppedRect.left,
            croppedRect.top,
            croppedRect.width + left - croppedRect.left,
            croppedRect.height + top - croppedRect.top
          ), direction);
        };

        break;

      case npf.ui.imageCrop.Direction.RIGHT_TOP:
        leftLimit = croppedRect.left - croppedRect.width;
        topLimit = 0;
        widthLimit = naturalSize.width - croppedRect.left;
        heightLimit = croppedRect.top + croppedRect.height;

        onDrag = function(evt) {
          /** @type {number} */
          var left = Math.round(evt.left / this.scale_);
          /** @type {number} */
          var top = Math.round(evt.top / this.scale_);
          this.dispatchUpdateEvent(new goog.math.Rect(
            croppedRect.left,
            top,
            croppedRect.width + left - croppedRect.left,
            croppedRect.height + croppedRect.top - top
          ), direction);
        };

        break;

      case npf.ui.imageCrop.Direction.TOP:
        leftLimit = croppedRect.left;
        topLimit = 0;
        widthLimit = 0;
        heightLimit = croppedRect.top + croppedRect.height;

        onDrag = function(evt) {
          /** @type {number} */
          var top = Math.round(evt.top / this.scale_);
          this.dispatchUpdateEvent(new goog.math.Rect(
            croppedRect.left,
            top,
            croppedRect.width,
            croppedRect.height + croppedRect.top - top
          ), direction);
        };

        break;
    }

    if (onDrag) {
      /** @type {goog.math.Rect} */
      var limits = (new goog.math.Rect(leftLimit, topLimit, widthLimit,
        heightLimit)).scale(this.scale_).round();

      this.dragger_ = new goog.fx.Dragger(this.getElement(), null, limits);
      this.getHandler().
        listen(this.dragger_, goog.fx.Dragger.EventType.DRAG, onDrag).
        listen(this.dragger_, goog.fx.Dragger.EventType.END, this.onDragEnd);
      this.dragger_.defaultAction = goog.nullFunction;
      this.dragger_.startDrag(evt);
    }
  }
};

/**
 * @param {!goog.math.Rect} rect
 * @param {npf.ui.imageCrop.Direction} direction
 * @protected
 */
npf.ui.imageCrop.Cropper.prototype.dispatchUpdateEvent = function(rect,
    direction) {
  var event = new npf.ui.imageCrop.CropperEvent(
    npf.ui.imageCrop.Cropper.EventType.UPDATE, rect, direction);
  this.dispatchEvent(event);
};

/**
 * @param {goog.fx.DragEvent} evt
 * @protected
 */
npf.ui.imageCrop.Cropper.prototype.onDragEnd = function(evt) {
  this.dragger_.dispose();
  this.dragger_ = null;
};


/**
 * @param {npf.ui.imageCrop.Cropper.EventType} type
 * @param {!goog.math.Rect} croppedRect
 * @param {npf.ui.imageCrop.Direction} direction
 * @constructor
 * @extends {goog.events.Event}
 */
npf.ui.imageCrop.CropperEvent = function(type, croppedRect, direction) {
  goog.base(this, type);

  /**
   * @type {!goog.math.Rect}
   */
  this.croppedRect = croppedRect;

  /**
   * @type {npf.ui.imageCrop.Direction}
   */
  this.direction = direction;
};
goog.inherits(npf.ui.imageCrop.CropperEvent, goog.events.Event);
