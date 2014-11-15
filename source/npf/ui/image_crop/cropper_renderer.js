goog.provide('npf.ui.imageCrop.CropperRenderer');

goog.require('goog.array');
goog.require('goog.dom');
goog.require('goog.dom.TagName');
goog.require('goog.dom.classlist');
goog.require('goog.math.Size');
goog.require('goog.object');
goog.require('goog.style');
goog.require('npf.ui.StatedRenderer');
goog.require('npf.ui.imageCrop.Direction');


/**
 * @constructor
 * @extends {npf.ui.StatedRenderer}
 */
npf.ui.imageCrop.CropperRenderer = function() {
  goog.base(this);

  /**
   * @type {Object.<npf.ui.imageCrop.Direction,string>}
   * @private
   */
  this.directionCssClassesMap_ = null;
};
goog.inherits(npf.ui.imageCrop.CropperRenderer, npf.ui.StatedRenderer);
goog.addSingletonGetter(npf.ui.imageCrop.CropperRenderer);


/**
 * @type {string}
 */
npf.ui.imageCrop.CropperRenderer.CSS_CLASS =
  goog.getCssName('npf-imageCrop-cropper');


/** @inheritDoc */
npf.ui.imageCrop.CropperRenderer.prototype.getCssClass = function() {
  return npf.ui.imageCrop.CropperRenderer.CSS_CLASS;
};

/** @inheritDoc */
npf.ui.imageCrop.CropperRenderer.prototype.createDom = function(component) {
  var cropper = /** @type {npf.ui.imageCrop.Cropper} */ (component);
  /** @type {Element} */
  var element = goog.base(this, 'createDom', component);
  /** @type {!Element} */
  var contentElement = component.getDomHelper().createDom(
    goog.dom.TagName.DIV, this.getContentCssClass());
  /** @type {!Element} */
  var imageElement = this.createImageElement(cropper);

  goog.dom.appendChild(contentElement, imageElement);
  goog.dom.appendChild(element, contentElement);

  /** @type {!Array.<npf.ui.imageCrop.Direction>} */
  var directions = [
    npf.ui.imageCrop.Direction.BOTTOM,
    npf.ui.imageCrop.Direction.LEFT,
    npf.ui.imageCrop.Direction.LEFT_BOTTOM,
    npf.ui.imageCrop.Direction.LEFT_TOP,
    npf.ui.imageCrop.Direction.RIGHT,
    npf.ui.imageCrop.Direction.RIGHT_BOTTOM,
    npf.ui.imageCrop.Direction.RIGHT_TOP,
    npf.ui.imageCrop.Direction.TOP
  ];

  goog.array.forEach(directions, function(direction) {
    /** @type {Element} */
    var directionElement = this.createDirectionElement(cropper, direction);

    if (directionElement) {
      goog.dom.appendChild(element, directionElement);
    }
  }, this);

  return element;
};

/** @inheritDoc */
npf.ui.imageCrop.CropperRenderer.prototype.getContentElement = function(
    element) {
  return this.getElementByClass(this.getContentCssClass(), element);
};

/**
 * @param {npf.ui.imageCrop.Cropper} component
 * @param {!goog.math.Rect} rect
 * @param {number} scale
 */
npf.ui.imageCrop.CropperRenderer.prototype.setCroppedRect = function(component,
    rect, scale) {
  /** @type {Element} */
  var element = component.getElement();
  /** @type {Element} */
  var imageElement = component.getImageElement();

  if (element && imageElement) {
    /** @type {!goog.math.Rect} */
    var scaledRect = rect.clone().scale(component.getScale()).round();
    goog.style.setSize(element, scaledRect.width, scaledRect.height);
    goog.style.setPosition(element, scaledRect.left, scaledRect.top);
    goog.style.setPosition(imageElement, -scaledRect.left, -scaledRect.top);
  }
};

/**
 * @param {npf.ui.imageCrop.Cropper} component
 * @param {npf.ui.imageCrop.Direction} direction
 * @return {Element}
 * @protected
 */
npf.ui.imageCrop.CropperRenderer.prototype.createDirectionElement = function(
    component, direction) {
  if (component.hasDirection(direction)) {
    /** @type {string} */
    var cssClass = this.getDirectionCssClass(direction);

    return component.getDomHelper().createDom(
      goog.dom.TagName.INS, cssClass);
  }

  return null;
};

/**
 * @param {Element} element
 * @return {npf.ui.imageCrop.Direction?} direction
 */
npf.ui.imageCrop.CropperRenderer.prototype.getDirection = function(element) {
  this.checkDirectionCssClasses_();

  /** @type {npf.ui.imageCrop.Direction?} */
  var direction = null;

  if (element) {
    goog.object.every(
      this.directionCssClassesMap_, function(className, dir) {
        if (goog.dom.classlist.contains(element, className)) {
          direction = /** @type {npf.ui.imageCrop.Direction} */ (
            parseInt(dir, 10));

          return false;
        }

        return true;
      }, this
    );
  }

  return direction;
};

/**
 * @param {npf.ui.imageCrop.Cropper} component
 * @param {npf.ui.imageCrop.Direction} direction
 * @param {boolean} enable
 */
npf.ui.imageCrop.CropperRenderer.prototype.setDirection = function(component,
    direction, enable) {
  /** @type {string} */
  var cssClass = this.getDirectionCssClass(direction);
  /** @type {Element} */
  var element = component.getElement();

  if (element && cssClass) {
    /** @type {Element} */
    var directionElement = component.getDirectionElement(direction);

    if (enable) {
      if (!directionElement) {
        directionElement = component.getDomHelper().createDom(
          goog.dom.TagName.INS, cssClass);
        goog.dom.appendChild(element, directionElement);
      }
    } else {
      if (directionElement) {
        goog.dom.removeNode(directionElement);
      }
    }
  }
};

/**
 * @param {Element} element
 * @param {npf.ui.imageCrop.Direction} direction
 * @return {Element}
 */
npf.ui.imageCrop.CropperRenderer.prototype.getDirectionElement = function(
    element, direction) {
  /** @type {string} */
  var cssClass = this.getDirectionCssClass(direction);

  if (cssClass) {
    return this.getElementByClass(cssClass, element);
  }

  return null;
};

/**
 * @param {npf.ui.imageCrop.Direction} direction
 * @return {string}
 */
npf.ui.imageCrop.CropperRenderer.prototype.getDirectionCssClass = function(
    direction) {
  this.checkDirectionCssClasses_();

  return this.directionCssClassesMap_[direction] || '';
};

/**
 * @private
 */
npf.ui.imageCrop.CropperRenderer.prototype.checkDirectionCssClasses_ = function(
    ) {
  if (!this.directionCssClassesMap_) {
    var Direction = npf.ui.imageCrop.Direction;
    this.directionCssClassesMap_ = goog.object.create(
      Direction.BOTTOM,
        goog.getCssName(this.getStructuralCssClass(), 'direction-bottom'),
      Direction.LEFT,
        goog.getCssName(this.getStructuralCssClass(), 'direction-left'),
      Direction.LEFT_BOTTOM,
        goog.getCssName(this.getStructuralCssClass(), 'direction-leftBottom'),
      Direction.LEFT_TOP,
        goog.getCssName(this.getStructuralCssClass(), 'direction-leftTop'),
      Direction.RIGHT,
        goog.getCssName(this.getStructuralCssClass(), 'direction-right'),
      Direction.RIGHT_BOTTOM,
        goog.getCssName(this.getStructuralCssClass(), 'direction-rightBottom'),
      Direction.RIGHT_TOP,
        goog.getCssName(this.getStructuralCssClass(), 'direction-rightTop'),
      Direction.TOP,
        goog.getCssName(this.getStructuralCssClass(), 'direction-top')
    );
  }
};

/**
 * @param {npf.ui.imageCrop.Cropper} component
 * @return {!Element}
 * @protected
 */
npf.ui.imageCrop.CropperRenderer.prototype.createImageElement = function(
    component) {
  /** @type {!goog.math.Size} */
  var imageSize = component.getImageNaturalSize();

  return component.getDomHelper().createDom(goog.dom.TagName.IMG, {
    'class': this.getImageCssClass(),
    'height': imageSize.height,
    'src': component.getImage().src,
    'width': imageSize.width
  });
};

/**
 * @param {Element} element
 * @return {Element}
 */
npf.ui.imageCrop.CropperRenderer.prototype.getImageElement = function(element) {
  return this.getElementByClass(this.getImageCssClass(), element);
};

/**
 * @param {Image} image
 * @param {number=} opt_scale
 * @return {!goog.math.Size}
 */
npf.ui.imageCrop.CropperRenderer.prototype.getImageSize = function(image,
    opt_scale) {
  /** @type {number} */
  var width = goog.isNumber(image.naturalWidth) ?
    image.naturalWidth : image.width;
  /** @type {number} */
  var height = goog.isNumber(image.naturalHeight) ?
    image.naturalHeight : image.height;
  var size = new goog.math.Size(width, height);

  if (opt_scale && 1 != opt_scale) {
    size = size.scale(opt_scale).round();
  }

  return size;
};

/**
 * @param {npf.ui.imageCrop.Cropper} component
 * @param {number} scale
 */
npf.ui.imageCrop.CropperRenderer.prototype.setScale = function(component,
    scale) {
  /** @type {Element} */
  var element = component.getImageElement();

  if (element) {
    /** @type {!goog.math.Size} */
    var imageSize = component.getImageNaturalSize();
    goog.style.setSize(element, imageSize.scale(scale).round());
  }
};

/**
 * @return {string}
 */
npf.ui.imageCrop.CropperRenderer.prototype.getContentCssClass = function() {
  return goog.getCssName(this.getStructuralCssClass(), 'content');
};

/**
 * @return {string}
 */
npf.ui.imageCrop.CropperRenderer.prototype.getImageCssClass = function() {
  return goog.getCssName(this.getStructuralCssClass(), 'image');
};
