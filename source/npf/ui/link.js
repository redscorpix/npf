goog.provide('npf.ui.Link');

goog.require('goog.Uri');
goog.require('goog.dom.TagName');
goog.require('goog.events.BrowserEvent');
goog.require('goog.events.EventType');
goog.require('goog.ui.Component.EventType');
goog.require('npf.ui.Component');


/**
 * @param {Object|string|Array|NodeList} caption
 * @param {string|goog.Uri=} opt_url
 * @constructor
 * @extends {npf.ui.Component}
 */
npf.ui.Link = function(caption, opt_url) {
  goog.base(this);

  /**
   * @type {Object|string|Array|NodeList}
   * @private
   */
  this.caption_ = caption;

  /**
   * @private {Array.<string>}
   */
  this.cssClass_ = null;

  /**
   * @private {goog.Uri}
   */
  this.uri_ = opt_url ? new goog.Uri(opt_url) : null;
};
goog.inherits(npf.ui.Link, npf.ui.Component);


/** @inheritDoc */
npf.ui.Link.prototype.createDom = function() {
  /** @type {string} */
  var tagName = goog.dom.TagName.SPAN;
  /** @type {!Object} */
  var attrs = {};

  if (this.cssClass_) {
    attrs['class'] = this.cssClass_.join(' ');
  }

  if (this.uri_) {
    tagName = goog.dom.TagName.A;
    attrs['href'] = this.getUrl();
  }

  /** @type {!Element} */
  var element = this.getDomHelper().createDom(tagName, attrs, this.caption_);
  this.setElementInternal(element);
};

/** @inheritDoc */
npf.ui.Link.prototype.enterDocument = function() {
  goog.base(this, 'enterDocument');

  this.getHandler()
    .listen(this.getElement(), goog.events.EventType.CLICK, this.onClick_);
};

/** @inheritDoc */
npf.ui.Link.prototype.disposeInternal = function() {
  goog.base(this, 'disposeInternal');

  this.cssClass_ = null;
  this.uri_ = null;
};

/**
 * @param {goog.events.BrowserEvent} evt
 * @private
 */
npf.ui.Link.prototype.onClick_ = function(evt) {
  /** @type {goog.events.BrowserEvent} */
  var event = new goog.events.BrowserEvent(evt.getBrowserEvent());
  event.type = goog.ui.Component.EventType.ACTION;

  this.dispatchEvent(event);
};

/**
 * @return {Object|string|Array|NodeList}
 */
npf.ui.Link.prototype.getCaption = function() {
  return this.caption_;
};

/**
 * @param {Object|string|Array|NodeList} caption
 */
npf.ui.Link.prototype.setCaption = function(caption) {
  this.caption_ = caption;
};

/**
 * @return {Array.<string>}
 */
npf.ui.Link.prototype.getCssClass = function() {
  return this.cssClass_;
};

/**
 * @param {string|Array.<string>|null} cssClass
 */
npf.ui.Link.prototype.setCssClass = function(cssClass) {
  if (goog.isString(cssClass)) {
    this.cssClass_ = [cssClass];
  } else {
    this.cssClass_ = cssClass;
  }
};

/**
 * @return {goog.Uri}
 */
npf.ui.Link.prototype.getUri = function() {
  return this.uri_;
};

/**
 * @param {string|goog.Uri} url
 */
npf.ui.Link.prototype.setUri = function(url) {
  this.uri_ = new goog.Uri(url);
};

/**
 * @return {string}
 */
npf.ui.Link.prototype.getUrl = function() {
  return this.uri_ ? this.uri_.toString() : '';
};

/**
 * @param {string|goog.Uri} url
 */
npf.ui.Link.prototype.setUrl = function(url) {
  this.setUri(url);
};
