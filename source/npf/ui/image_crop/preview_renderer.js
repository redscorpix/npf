goog.provide('npf.ui.imageCrop.PreviewRenderer');

goog.require('goog.dom');
goog.require('goog.dom.TagName');
goog.require('goog.math.Rect');
goog.require('goog.math.Size');
goog.require('goog.style');
goog.require('npf.ui.StatedRenderer');
goog.require('npf.userAgent.support');


/**
 * @constructor
 * @extends {npf.ui.StatedRenderer}
 */
npf.ui.imageCrop.PreviewRenderer = function() {
  goog.base(this);
};
goog.inherits(npf.ui.imageCrop.PreviewRenderer, npf.ui.StatedRenderer);
goog.addSingletonGetter(npf.ui.imageCrop.PreviewRenderer);


/**
 * @type {string}
 */
npf.ui.imageCrop.PreviewRenderer.CSS_CLASS =
  goog.getCssName('npf-imageCrop-preview');


/** @inheritDoc */
npf.ui.imageCrop.PreviewRenderer.prototype.getCssClass = function() {
  return npf.ui.imageCrop.PreviewRenderer.CSS_CLASS;
};

/** @inheritDoc */
npf.ui.imageCrop.PreviewRenderer.prototype.createDom = function(component) {
  /** @type {Element} */
  var element = goog.base(this, 'createDom', component);
  /** @type {!Element} */
  var contentElement = component.getDomHelper().createDom(
    goog.dom.TagName.DIV, this.getContentCssClass());

  goog.dom.appendChild(element, contentElement);

  return element;
};

/** @inheritDoc */
npf.ui.imageCrop.PreviewRenderer.prototype.getContentElement = function(
    element) {
  return this.getElementByClass(this.getContentCssClass(), element);
};

/**
 * @param {npf.ui.imageCrop.Preview} component
 * @param {goog.math.Rect} rect
 * @param {number} scale
 */
npf.ui.imageCrop.PreviewRenderer.prototype.setCroppedRect = function(component,
    rect, scale) {
  /** @type {Element} */
  var contentElement = component.getContentElement();
  /** @type {Element} */
  var imageElement = component.getImageElement();

  if (contentElement && imageElement) {
    /** @type {Image} */
    var image = component.getImage();

    if (rect && image) {
      /** @type {!goog.math.Rect} */
      var imageRect = rect.clone().scale(scale).round();
      goog.style.setSize(contentElement, imageRect.width, imageRect.height);

      if (npf.userAgent.support.getCssTransforms3d()) {
        goog.style.setStyle(imageElement, 'transform',
          'scale(' + scale + ') ' +
          'translate3d(' + (-rect.left) + 'px,' + (-rect.top) + 'px, 0)');
      } else {
        /** @type {!goog.math.Size} */
        var imageSize = component.getImageNaturalSize().scale(scale).round();

        goog.style.setPosition(imageElement, -imageRect.left, -imageRect.top);
        goog.style.setSize(imageElement, imageSize);
      }
    }
  }
};

/**
 * @param {npf.ui.imageCrop.Preview} component
 * @param {Image} image
 * @param {Image=} opt_oldImage
 */
npf.ui.imageCrop.PreviewRenderer.prototype.setImage = function(component, image,
    opt_oldImage) {
  /** @type {Element} */
  var contentElement = component.getContentElement();

  if (contentElement) {
    /** @type {Element} */
    var imageElement;

    if (opt_oldImage) {
      imageElement = component.getImageElement();
      goog.dom.removeNode(imageElement);
    }

    if (image) {
      imageElement = this.createImageElement(component, image);
      goog.dom.appendChild(contentElement, imageElement);
    }
  }
};

/**
 * @param {Image} image
 * @param {number=} opt_scale
 * @return {goog.math.Size?}
 */
npf.ui.imageCrop.PreviewRenderer.prototype.getImageSize = function(image,
    opt_scale) {
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
 * @param {npf.ui.imageCrop.Preview} component
 * @param {!Image} image
 * @return {!Element}
 */
npf.ui.imageCrop.PreviewRenderer.prototype.createImageElement = function(
    component, image) {
  /** @type {goog.math.Size} */
  var size = this.getImageSize(image);

  return component.getDomHelper().createDom(goog.dom.TagName.IMG, {
    'class': this.getImageCssClass(),
    'height': size.height,
    'src': image.src,
    'width': size.width
  });
};

/**
 * @param {Element} element
 * @return {Element}
 */
npf.ui.imageCrop.PreviewRenderer.prototype.getImageElement = function(element) {
  return this.getElementByClass(this.getImageCssClass(), element);
};

/**
 * @return {string}
 */
npf.ui.imageCrop.PreviewRenderer.prototype.getContentCssClass = function() {
  return goog.getCssName(this.getStructuralCssClass(), 'content');
};

/**
 * @return {string}
 */
npf.ui.imageCrop.PreviewRenderer.prototype.getEmptyCssClass = function() {
  return goog.getCssName(this.getStructuralCssClass(), 'empty');
};

/**
 * @return {string}
 */
npf.ui.imageCrop.PreviewRenderer.prototype.getImageCssClass = function() {
  return goog.getCssName(this.getStructuralCssClass(), 'image');
};
