goog.provide('npf.ui.imageCrop.CropperRenderer');

goog.require('goog.array');
goog.require('goog.dom.TagName');
goog.require('goog.dom.classlist');
goog.require('goog.math.Size');
goog.require('goog.object');
goog.require('npf.ui.StatedRenderer');
goog.require('npf.ui.imageCrop.Direction');


/**
 * @constructor
 * @extends {npf.ui.StatedRenderer}
 */
npf.ui.imageCrop.CropperRenderer = function() {
  npf.ui.imageCrop.CropperRenderer.base(this, 'constructor');

  /**
   * @private {Object.<npf.ui.imageCrop.Direction,string>}
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
  var cropper = /** @type {!npf.ui.imageCrop.Cropper} */ (component);
  /** @type {!Element} */
  var element = npf.ui.imageCrop.CropperRenderer.base(
    this, 'createDom', component);
  /** @type {goog.dom.DomHelper} */
  var domHelper = component.getDomHelper();
  /** @type {!Element} */
  var contentElement = domHelper.createDom(
    goog.dom.TagName.DIV, this.getContentCssClass());
  /** @type {!HTMLImageElement} */
  var imageElement = this.createImageElement(cropper);
  /** @type {!Element} */
  var faderElement = this.createFaderElement(cropper);

  domHelper.appendChild(contentElement, imageElement);
  domHelper.appendChild(contentElement, faderElement);
  domHelper.appendChild(element, contentElement);

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
      domHelper.appendChild(element, directionElement);
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
 * @param {!npf.ui.imageCrop.Cropper} component
 * @param {!goog.math.Rect} rect
 * @param {number} scale
 */
npf.ui.imageCrop.CropperRenderer.prototype.setCroppedRect = function(component,
    rect, scale) {
  /** @type {Element} */
  var element = component.getElement();
  /** @type {HTMLImageElement} */
  var imageElement = component.getImageElement();

  if (element && imageElement) {
    /** @type {!goog.math.Rect} */
    var scaledRect = rect.clone().scale(component.getScale()).round();
    element.style.width = scaledRect.width + 'px';
    element.style.height = scaledRect.height + 'px';
    element.style.left = scaledRect.left + 'px';
    element.style.top = scaledRect.top + 'px';
    imageElement.style.left = -scaledRect.left + 'px';
    imageElement.style.top = -scaledRect.top + 'px';
  }
};

/**
 * @param {!npf.ui.imageCrop.Cropper} component
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
      goog.dom.TagName.DIV, cssClass);
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
 * @param {!npf.ui.imageCrop.Cropper} component
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
    /** @type {goog.dom.DomHelper} */
    var domHelper = component.getDomHelper();

    if (enable) {
      if (!directionElement) {
        directionElement = domHelper.createDom(goog.dom.TagName.DIV, cssClass);
        domHelper.appendChild(element, directionElement);
      }
    } else {
      if (directionElement) {
        domHelper.removeNode(directionElement);
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

  return cssClass ? this.getElementByClass(cssClass, element) : null;
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
npf.ui.imageCrop.CropperRenderer.prototype.checkDirectionCssClasses_ =
    function() {
  if (!this.directionCssClassesMap_) {
    var Direction = npf.ui.imageCrop.Direction;
    var baseClass = this.getStructuralCssClass();
    this.directionCssClassesMap_ = goog.object.create(
      Direction.BOTTOM, goog.getCssName(baseClass, 'direction-bottom'),
      Direction.LEFT, goog.getCssName(baseClass, 'direction-left'),
      Direction.LEFT_BOTTOM, goog.getCssName(baseClass, 'direction-leftBottom'),
      Direction.LEFT_TOP, goog.getCssName(baseClass, 'direction-leftTop'),
      Direction.RIGHT, goog.getCssName(baseClass, 'direction-right'),
      Direction.RIGHT_BOTTOM,
                            goog.getCssName(baseClass, 'direction-rightBottom'),
      Direction.RIGHT_TOP, goog.getCssName(baseClass, 'direction-rightTop'),
      Direction.TOP, goog.getCssName(baseClass, 'direction-top')
    );
  }
};

/**
 * @param {!npf.ui.imageCrop.Cropper} component
 * @return {!HTMLImageElement}
 * @protected
 */
npf.ui.imageCrop.CropperRenderer.prototype.createImageElement = function(
    component) {
  /** @type {!goog.math.Size} */
  var imageSize = component.getImageNaturalSize();
  /** @type {Image|HTMLImageElement|HTMLCanvasElement} */
  var image = component.getImage();
  /** @type {string} */
  var src = image instanceof HTMLCanvasElement ?
    image.toDataURL() : image.src;

  return /** @type {!HTMLImageElement} */ (
    component.getDomHelper().createDom(goog.dom.TagName.IMG, {
      'class': this.getImageCssClass(),
      'height': imageSize.height,
      'src': src,
      'width': imageSize.width
    })
  );
};

/**
 * @param {npf.ui.imageCrop.Cropper} component
 * @return {!Element}
 * @protected
 */
npf.ui.imageCrop.CropperRenderer.prototype.createFaderElement = function(
    component) {
  return component.getDomHelper().createDom(
    goog.dom.TagName.DIV, this.getFaderCssClass());
};

/**
 * @param {Element} element
 * @return {HTMLImageElement}
 */
npf.ui.imageCrop.CropperRenderer.prototype.getImageElement = function(element) {
  return /** @type {HTMLImageElement} */ (
    this.getElementByClass(this.getImageCssClass(), element));
};

/**
 * @param {!(Image|HTMLImageElement|HTMLCanvasElement)} image
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
 * @param {!npf.ui.imageCrop.Cropper} component
 * @param {number} scale
 */
npf.ui.imageCrop.CropperRenderer.prototype.setScale = function(component,
    scale) {
  /** @type {HTMLImageElement} */
  var element = component.getImageElement();

  if (element) {
    /** @type {!goog.math.Size} */
    var imageSize = component.getImageNaturalSize().scale(scale).round();
    element.style.width = imageSize.width + 'px';
    element.style.height = imageSize.height + 'px';
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
npf.ui.imageCrop.CropperRenderer.prototype.getFaderCssClass = function() {
  return goog.getCssName(this.getStructuralCssClass(), 'fader');
};

/**
 * @return {string}
 */
npf.ui.imageCrop.CropperRenderer.prototype.getImageCssClass = function() {
  return goog.getCssName(this.getStructuralCssClass(), 'image');
};
