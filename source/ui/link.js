goog.provide('npf.ui.Link');

goog.require('goog.dom.classes');
goog.require('goog.dom.TagName');
goog.require('goog.events.BrowserEvent');
goog.require('npf.events.TapHandler');
goog.require('npf.ui.Component');


/**
 * @param {string=} opt_htmlCaption
 * @param {string=} opt_url
 * @constructor
 * @extends {npf.ui.Component}
 */
npf.ui.Link = function(opt_htmlCaption, opt_url) {
  goog.base(this);

  this.caption_ = opt_htmlCaption || null;
  this.url_ = opt_url || null;
};
goog.inherits(npf.ui.Link, npf.ui.Component);


/**
 * @type {?string}
 * @private
 */
npf.ui.Link.prototype.caption_;

/**
 * @type {?string}
 * @private
 */
npf.ui.Link.prototype.url_;

/**
 * @type {Array.<string>}
 * @private
 */
npf.ui.Link.prototype.cssClass_ = null;


/** @inheritDoc */
npf.ui.Link.prototype.createDom = function() {
  /** @type {string} */
  var tagName = goog.dom.TagName.SPAN;
  /** @type {Object} */
  var attrs = null;

  if (this.url_) {
    tagName = goog.dom.TagName.A;
    attrs = {
      'href': this.url_
    };
  }

  /** @type {Element} */
  var element = goog.dom.createDom(tagName, attrs, this.caption_);

  if (this.cssClass_) {
    goog.dom.classes.add(element, this.cssClass_.join(' '));
  }

  this.setElementInternal(element);
};

/** @inheritDoc */
npf.ui.Link.prototype.enterDocument = function() {
  goog.base(this, 'enterDocument');

  var tapHandler = new npf.events.TapHandler(this.getElement());
  this.disposeOnExitDocument(tapHandler);

  this.getHandler().listen(tapHandler, npf.events.TapHandler.EventType.TAP,
    this.onTap_, false, this);
};

/** @inheritDoc */
npf.ui.Link.prototype.disposeInternal = function() {
  goog.base(this, 'disposeInternal');

  delete this.caption_;
  delete this.url_;
  delete this.cssClass_;
};

/**
 * @param {goog.events.BrowserEvent} evt
 * @private
 */
npf.ui.Link.prototype.onTap_ = function(evt) {
  /** @type {goog.events.BrowserEvent} */
  var event = new goog.events.BrowserEvent(evt.getBrowserEvent());
  event.type = goog.ui.Component.EventType.ACTION;

  this.dispatchEvent(event);
};

/**
 * @return {string?}
 */
npf.ui.Link.prototype.getCaption = function() {
  return this.caption_;
};

/**
 * @param {string=} optcaption_
 */
npf.ui.Link.prototype.setCaption = function(optcaption_) {
  this.caption_ = optcaption_ || null;
};

/**
 * @return {string?}
 */
npf.ui.Link.prototype.getUrl = function() {
  return this.url_;
};

/**
 * @param {string=} opt_url
 */
npf.ui.Link.prototype.setUrl = function(opt_url) {
  this.url_ = opt_url || null;
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
