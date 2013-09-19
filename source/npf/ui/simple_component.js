goog.provide('npf.ui.SimpleComponent');

goog.require('goog.dom');
goog.require('goog.dom.TagName');
goog.require('npf.ui.Component');


/**
 * @param {string|Array.<string>=} opt_className
 * @param {string|Array.<string>=} opt_contentClassName
 * @param {goog.dom.DomHelper=} opt_domHelper Optional DOM helper.
 * @constructor
 * @extends {npf.ui.Component}
 */
npf.ui.SimpleComponent = function(opt_className, opt_contentClassName,
    opt_domHelper) {
  goog.base(this, opt_domHelper);

  if (goog.isArray(opt_className)) {
    this.classNames_ = opt_className;
  } else if (goog.isString(opt_className)) {
    this.classNames_ = [opt_className];
  }

  if (goog.isArray(opt_contentClassName)) {
    this.contentClassNames_ = opt_contentClassName;
  } else if (goog.isString(opt_contentClassName)) {
    this.contentClassNames_ = [opt_contentClassName];
  }
};
goog.inherits(npf.ui.SimpleComponent, npf.ui.Component);


/**
 * @private {Array.<string>}
 */
npf.ui.SimpleComponent.prototype.classNames_ = null;

/**
 * @private {Array.<string>}
 */
npf.ui.SimpleComponent.prototype.contentClassNames_ = null;

/**
 * @private {Element}
 */
npf.ui.SimpleComponent.prototype.contentElement_ = null;

/**
 * @private {string}
 */
npf.ui.SimpleComponent.prototype.contentTagName_ = goog.dom.TagName.DIV;

/**
 * @private {string}
 */
npf.ui.SimpleComponent.prototype.tagName_ = goog.dom.TagName.DIV;


/** @inheritDoc */
npf.ui.SimpleComponent.prototype.createDom = function() {
  /** @type {!Element} */
  var element = this.getDomHelper().createDom(this.tagName_, this.classNames_);
  this.setElementInternal(element);

  if (this.contentClassNames_) {
    this.contentElement_ = this.getDomHelper().createDom(this.contentTagName_,
      this.contentClassNames_);
    goog.dom.appendChild(element, this.contentElement_);
  } else {
    this.contentElement_ = element;
  }
};

/** @inheritDoc */
npf.ui.SimpleComponent.prototype.disposeInternal = function() {
  goog.base(this, 'disposeInternal');

  this.classNames_ = null;
  this.contentClassNames_ = null;
  this.contentElement_ = null;
};

/** @inheritDoc */
npf.ui.SimpleComponent.prototype.getContentElement = function() {
  return this.contentElement_ || this.getElement();
};

/**
 * @return {Array.<string>?}
 */
npf.ui.SimpleComponent.prototype.getClassNames = function() {
  return this.classNames_;
};

/**
 * @return {Array.<string>?}
 */
npf.ui.SimpleComponent.prototype.getContentClassNames = function() {
  return this.contentClassNames_;
};

/**
 * @return {string}
 */
npf.ui.SimpleComponent.prototype.getTagName = function() {
  return this.tagName_;
};

/**
 * @param {string} tagName
 */
npf.ui.SimpleComponent.prototype.setTagName = function(tagName) {
  this.tagName_ = tagName;
};

/**
 * @return {string}
 */
npf.ui.SimpleComponent.prototype.getContentTagName = function() {
  return this.contentTagName_;
};

/**
 * @param {string} tagName
 */
npf.ui.SimpleComponent.prototype.setContentTagName = function(tagName) {
  this.contentTagName_ = tagName;
};
