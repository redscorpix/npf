goog.provide('npf.ui.Image');

goog.require('goog.dom.classes');
goog.require('goog.dom.TagName');
goog.require('goog.math.Size');
goog.require('npf.ui.Component');


/**
 * @param {string} src
 * @param {number} width
 * @param {number} height
 * @constructor
 * @extends {npf.ui.Component}
 */
npf.ui.Image = function(src, width, height) {
  goog.base(this);

  this.height_ = height;
  this.src_ = src;
  this.width_ = width;
};
goog.inherits(npf.ui.Image, npf.ui.Component);


/**
 * @private {string}
 */
npf.ui.Image.prototype.caption_ = '';

/**
 * @private {Array.<string>}
 */
npf.ui.Image.prototype.cssClass_ = null;

/**
 * @private {number}
 */
npf.ui.Image.prototype.height_;

/**
 * @private {string}
 */
npf.ui.Image.prototype.src_;

/**
 * @private {number}
 */
npf.ui.Image.prototype.width_;


/** @inheritDoc */
npf.ui.Image.prototype.createDom = function() {
  /** @type {!Element} */
  var element = this.getDomHelper().createDom(goog.dom.TagName.IMG, {
    'alt': this.caption_,
    'src': this.src_,
    'width': this.width_,
    'height': this.height_
  });

  if (this.cssClass_) {
    goog.dom.classes.add(element, this.cssClass_.join(' '));
  }

  this.setElementInternal(element);
};

/** @inheritDoc */
npf.ui.Image.prototype.disposeInternal = function() {
  goog.base(this, 'disposeInternal');

  this.cssClass_ = null;
};

/**
 * @return {string}
 */
npf.ui.Image.prototype.getCaption = function() {
  return this.caption_;
};

/**
 * @param {string} caption
 */
npf.ui.Image.prototype.setCaption = function(caption) {
  this.caption_ = caption;
};

/**
 * @return {Array.<string>}
 */
npf.ui.Image.prototype.getCssClass = function() {
  return this.cssClass_;
};

/**
 * @param {string|Array.<string>|null} cssClass
 */
npf.ui.Image.prototype.setCssClass = function(cssClass) {
  if (goog.isString(cssClass)) {
    this.cssClass_ = [cssClass];
  } else {
    this.cssClass_ = cssClass;
  }
};

/**
 * @return {!goog.math.Size}
 */
npf.ui.Image.prototype.getSize = function() {
  return new goog.math.Size(this.width_, this.height_);
};

/**
 * @return {string}
 */
npf.ui.Image.prototype.getSrc = function() {
  return this.src_;
};
