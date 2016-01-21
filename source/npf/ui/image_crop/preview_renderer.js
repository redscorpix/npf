goog.provide('npf.ui.imageCrop.PreviewRenderer');

goog.require('goog.dom.TagName');
goog.require('goog.math.Rect');
goog.require('goog.math.Size');
goog.require('goog.style');
goog.require('npf.ui.StatedRenderer');
goog.require('npf.userAgent.css');


/**
 * @constructor
 * @extends {npf.ui.StatedRenderer}
 */
npf.ui.imageCrop.PreviewRenderer = function() {
  npf.ui.imageCrop.PreviewRenderer.base(this, 'constructor');
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
  /** @type {!Element} */
  var element = npf.ui.imageCrop.PreviewRenderer.base(
    this, 'createDom', component);
  element.innerHTML = '<div class="' + this.getContentCssClass() + '"></div>';

  return element;
};

/** @inheritDoc */
npf.ui.imageCrop.PreviewRenderer.prototype.getContentElement = function(
    element) {
  return this.getElementByClass(this.getContentCssClass(), element);
};

/**
 * @param {!npf.ui.imageCrop.Preview} component
 * @param {goog.math.Rect} rect
 * @param {number} scale
 */
npf.ui.imageCrop.PreviewRenderer.prototype.setCroppedRect = function(component,
    rect, scale) {
  /** @type {Element} */
  var contentElement = component.getContentElement();
  /** @type {HTMLImageElement} */
  var imageElement = component.getImageElement();

  if (contentElement && imageElement) {
    /** @type {Image|HTMLImageElement|HTMLCanvasElement} */
    var image = component.getImage();

    if (rect && image) {
      /** @type {!goog.math.Rect} */
      var imageRect = rect.clone().scale(scale).round();
      contentElement.style.width = imageRect.width + 'px';
      contentElement.style.height = imageRect.height + 'px';

      if (npf.userAgent.css.isTransform3dSupported()) {
        goog.style.setStyle(imageElement, 'transform',
          'scale(' + scale + ') ' +
          'translate3d(' + (-rect.left) + 'px,' + (-rect.top) + 'px, 0)');
      } else {
        /** @type {!goog.math.Size} */
        var imageSize = component.getImageNaturalSize().scale(scale).round();
        imageElement.style.left = -imageRect.left + 'px';
        imageElement.style.top = -imageRect.top + 'px';
        imageElement.style.width = imageSize.width + 'px';
        imageElement.style.height = imageSize.height + 'px';
      }
    }
  }
};

/**
 * @param {!npf.ui.imageCrop.Preview} component
 * @param {Image|HTMLImageElement|HTMLCanvasElement} image
 */
npf.ui.imageCrop.PreviewRenderer.prototype.setImage = function(component,
    image) {
  /** @type {Element} */
  var contentElement = component.getContentElement();

  if (contentElement) {
    /** @type {HTMLImageElement} */
    var imageElement = component.getImageElement();
    /** @type {goog.dom.DomHelper} */
    var domHelper = component.getDomHelper();

    if (imageElement) {
      domHelper.removeNode(imageElement);
    }

    if (image) {
      imageElement = this.createImageElement(component, image);
      domHelper.appendChild(contentElement, imageElement);
    }
  }
};

/**
 * @param {Image|HTMLImageElement|HTMLCanvasElement} image
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
 * @param {!npf.ui.imageCrop.Preview} component
 * @param {!(Image|HTMLImageElement|HTMLCanvasElement)} image
 * @return {!HTMLImageElement}
 */
npf.ui.imageCrop.PreviewRenderer.prototype.createImageElement = function(
    component, image) {
  /** @type {goog.math.Size} */
  var size = this.getImageSize(image);
  /** @type {string} */
  var src = image instanceof HTMLCanvasElement ? image.toDataURL() : image.src;

  return /** @type {!HTMLImageElement} */ (
    component.getDomHelper().createDom(goog.dom.TagName.IMG, {
      'class': this.getImageCssClass(),
      'height': size.height,
      'src': src,
      'width': size.width
    })
  );
};

/**
 * @param {Element} element
 * @return {HTMLImageElement}
 */
npf.ui.imageCrop.PreviewRenderer.prototype.getImageElement = function(element) {
  return /** @type {HTMLImageElement} */ (
    this.getElementByClass(this.getImageCssClass(), element));
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
