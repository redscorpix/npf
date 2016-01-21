goog.provide('npf.ui.Link');

goog.require('goog.Uri');
goog.require('goog.dom.TagName');
goog.require('goog.events.BrowserEvent');
goog.require('goog.events.EventType');
goog.require('goog.ui.Component.EventType');
goog.require('npf.events.ClickHandler');
goog.require('npf.ui.Component');


/**
 * @param {Object|string|Array|NodeList} caption
 * @param {goog.Uri=} opt_uri
 * @param {goog.dom.DomHelper=} opt_domHelper
 * @constructor
 * @struct
 * @extends {npf.ui.Component}
 */
npf.ui.Link = function(caption, opt_uri, opt_domHelper) {
  npf.ui.Link.base(this, 'constructor', opt_domHelper);

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
  this.uri_ = opt_uri || null;
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
    attrs['href'] = this.getUri().toString();
  }

  /** @type {!Element} */
  var element = this.getDomHelper().createDom(tagName, attrs, this.caption_);
  this.setElementInternal(element);
};

/** @inheritDoc */
npf.ui.Link.prototype.enterDocument = function() {
  npf.ui.Link.base(this, 'enterDocument');

  var clickHandler = new npf.events.ClickHandler(
    /** @type {!Element} */ (this.getElement()));
  this.disposeOnExitDocument(clickHandler);

  this.getHandler().
    listen(clickHandler, goog.events.EventType.CLICK, this.onClick_);
};

/** @inheritDoc */
npf.ui.Link.prototype.disposeInternal = function() {
  npf.ui.Link.base(this, 'disposeInternal');

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
  this.cssClass_ = goog.isString(cssClass) ? [cssClass] : cssClass;
};

/**
 * @return {goog.Uri}
 */
npf.ui.Link.prototype.getUri = function() {
  return this.uri_;
};

/**
 * @param {goog.Uri} uri
 */
npf.ui.Link.prototype.setUri = function(uri) {
  this.uri_ = uri;
};
