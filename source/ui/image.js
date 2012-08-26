goog.provide('npf.ui.Image');

goog.require('goog.dom.classes');
goog.require('goog.dom.TagName');
goog.require('goog.math.Size');
goog.require('goog.ui.Component');


/**
 * @param {string} src
 * @param {number} width
 * @param {number} height
 * @constructor
 * @extends {goog.ui.Component}
 */
npf.ui.Image = function(src, width, height) {
  goog.base(this);

  this.src_ = src;
  this.size_ = new goog.math.Size(width, height);
};
goog.inherits(npf.ui.Image, goog.ui.Component);


/**
 * @type {string}
 * @private
 */
npf.ui.Image.prototype.src_;

/**
 * @type {!goog.math.Size}
 * @private
 */
npf.ui.Image.prototype.size_;

/**
 * @type {Array.<string>}
 * @private
 */
npf.ui.Image.prototype.cssClass_ = null;

/**
 * @type {?string}
 * @private
 */
npf.ui.Image.prototype.caption_ = null;


/** @inheritDoc */
npf.ui.Image.prototype.createDom = function() {
  /** @type {!Element} */
  var element = this.getDomHelper().createDom(goog.dom.TagName.IMG, {
    'alt': this.caption_ || '',
    'src': this.src_,
    'width': this.size_.width,
    'height': this.size_.height
  });

  if (this.cssClass_) {
    goog.dom.classes.add(element, this.cssClass_.join(' '));
  }

  this.setElementInternal(element);
};

/** @inheritDoc */
npf.ui.Image.prototype.disposeInternal = function() {
  goog.base(this, 'disposeInternal');

  delete this.src_;
  delete this.size_;
  delete this.cssClass_;
  delete this.caption_;
};

/**
 * @return {string}
 */
npf.ui.Image.prototype.getSrc = function() {
  return this.src_;
};

/**
 * @return {!goog.math.Size}
 */
npf.ui.Image.prototype.getSize = function() {
  return this.size_;
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
 * @param {?string} caption
 */
npf.ui.Image.prototype.setCaption = function(caption) {
  this.caption_ = caption;
};

/**
 * @return {?string}
 */
npf.ui.Image.prototype.getCaption = function() {
  return this.caption_;
};
