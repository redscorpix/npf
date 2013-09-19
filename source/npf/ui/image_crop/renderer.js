goog.provide('npf.ui.imageCrop.Renderer');

goog.require('goog.dom');
goog.require('goog.dom.TagName');
goog.require('goog.math.Size');
goog.require('goog.style');
goog.require('npf.graphics.Scale');
goog.require('npf.ui.Renderer');


/**
 * @constructor
 * @extends {npf.ui.Renderer}
 */
npf.ui.imageCrop.Renderer = function() {
  goog.base(this);
};
goog.inherits(npf.ui.imageCrop.Renderer, npf.ui.Renderer);
goog.addSingletonGetter(npf.ui.imageCrop.Renderer);


/**
 * @type {string}
 */
npf.ui.imageCrop.Renderer.CSS_CLASS = goog.getCssName('npf-imageCrop');


/** @inheritDoc */
npf.ui.imageCrop.Renderer.prototype.getCssClass = function() {
  return npf.ui.imageCrop.Renderer.CSS_CLASS;
};

/** @inheritDoc */
npf.ui.imageCrop.Renderer.prototype.createDom = function(component) {
  /** @type {Element} */
  var element = goog.base(this, 'createDom', component);
  /** @type {!Element} */
  var faderElement = component.getDomHelper().createDom(
    goog.dom.TagName.DIV, this.getFaderCssClass());
  /** @type {!Element} */
  var contentElement = component.getDomHelper().createDom(
    goog.dom.TagName.DIV, this.getContentCssClass());

  goog.dom.appendChild(element, faderElement);
  goog.dom.appendChild(element, contentElement);

  return element;
};

/** @inheritDoc */
npf.ui.imageCrop.Renderer.prototype.getContentElement = function(element) {
  return this.getElementByClass(this.getContentCssClass(), element);
};

/**
 * @param {npf.ui.imageCrop.Preview} component
 * @param {goog.math.Rect} rect
 * @param {number} scale
 */
npf.ui.imageCrop.Renderer.prototype.setCroppedRect = goog.nullFunction;

/**
 * @param {npf.ui.ImageCrop} component
 * @param {Image} image
 * @param {Image=} opt_oldImage
 */
npf.ui.imageCrop.Renderer.prototype.setImage = function(component, image,
    opt_oldImage) {
  /** @type {Element} */
  var element = component.getElement();

  if (element) {
    /** @type {Element} */
    var imageElement;

    if (opt_oldImage) {
      imageElement = component.getImageElement();
      goog.dom.removeNode(imageElement);
    }

    if (image) {
      imageElement = this.createImageElement(component, image);
      goog.dom.appendChild(element, imageElement);
    }
  }
};

/**
 * @param {Image} image
 * @param {number=} opt_scale
 * @return {goog.math.Size?}
 */
npf.ui.imageCrop.Renderer.prototype.getImageSize = function(image, opt_scale) {
  if (image) {
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
  }

  return null;
};

/**
 * @param {npf.ui.ImageCrop} component
 * @param {goog.math.Size} maxSize
 */
npf.ui.imageCrop.Renderer.prototype.setMaxSize = function(component, maxSize) {
  /** @type {Element} */
  var imageElement = component.getImageElement();
  /** @type {goog.math.Size} */
  var naturalSize = component.getImageNaturalSize();

  if (imageElement && naturalSize) {
    /** @type {!goog.math.Size} */
    var size = npf.graphics.Scale.contain(naturalSize, maxSize);
    goog.style.setSize(imageElement, size);
  }
};

/**
 * @param {npf.ui.ImageCrop} component
 * @param {!Image} image
 * @return {!Element}
 */
npf.ui.imageCrop.Renderer.prototype.createImageElement = function(component,
    image) {
  /** @type {goog.math.Size} */
  var naturalSize = this.getImageSize(image);

  return component.getDomHelper().createDom(goog.dom.TagName.IMG, {
    'class': this.getImageCssClass(),
    'height': naturalSize.height,
    'src': image.src,
    'width': naturalSize.width
  });
};

/**
 * @param {Element} element
 * @return {Element}
 */
npf.ui.imageCrop.Renderer.prototype.getImageElement = function(element) {
  return this.getElementByClass(this.getImageCssClass(), element);
};

/**
 * @return {string}
 */
npf.ui.imageCrop.Renderer.prototype.getCroppedCssClass = function() {
  return goog.getCssName(this.getStructuralCssClass(), 'cropped');
};

/**
 * @return {string}
 */
npf.ui.imageCrop.Renderer.prototype.getContentCssClass = function() {
  return goog.getCssName(this.getStructuralCssClass(), 'content');
};

/**
 * @return {string}
 */
npf.ui.imageCrop.Renderer.prototype.getFaderCssClass = function() {
  return goog.getCssName(this.getStructuralCssClass(), 'fader');
};

/**
 * @return {string}
 */
npf.ui.imageCrop.Renderer.prototype.getImageCssClass = function() {
  return goog.getCssName(this.getStructuralCssClass(), 'image');
};
