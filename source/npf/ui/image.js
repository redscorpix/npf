goog.provide('npf.ui.Image');

goog.require('goog.dom.classlist');
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

  /**
   * @private {string}
   */
  this.caption_ = '';

  /**
   * @private {Array.<string>}
   */
  this.cssClass_ = null;

  /**
   * @private {number}
   */
  this.height_ = height;

  /**
   * @private {string}
   */
  this.src_ = src;

  /**
   * @private {number}
   */
  this.width_ = width;
};
goog.inherits(npf.ui.Image, npf.ui.Component);


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
    goog.dom.classlist.addAll(element, this.cssClass_);
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
