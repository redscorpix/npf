goog.provide('npf.ui.navigation.Item');

goog.require('goog.events.BrowserEvent');
goog.require('goog.events.EventType');
goog.require('goog.ui.Component.EventType');
goog.require('npf.events.ClickHandler');
goog.require('npf.ui.RenderedComponent');
goog.require('npf.ui.navigation.ItemRenderer');


/**
 * @param {string} type
 * @param {goog.Uri} uri
 * @param {string} caption
 * @param {npf.ui.navigation.ItemRenderer=} opt_renderer
 * @param {goog.dom.DomHelper=} opt_domHelper
 * @constructor
 * @extends {npf.ui.RenderedComponent}
 */
npf.ui.navigation.Item = function(type, uri, caption, opt_renderer,
    opt_domHelper) {
  npf.ui.navigation.Item.base(this, 'constructor', opt_renderer ||
    npf.ui.navigation.ItemRenderer.getInstance(), opt_domHelper);

  /**
   * @private {string}
   */
  this.caption_ = caption;

  /**
   * @private {boolean}
   */
  this.enabled_ = true;

  /**
   * @private {boolean}
   */
  this.selected_ = false;

  /**
   * @private {string}
   */
  this.type_ = type;

  /**
   * @private {goog.Uri}
   */
  this.uri_ = uri;
};
goog.inherits(npf.ui.navigation.Item, npf.ui.RenderedComponent);


/** @inheritDoc */
npf.ui.navigation.Item.prototype.createDom = function() {
  npf.ui.navigation.Item.base(this, 'createDom');

  this.initializeDom();
};

/** @inheritDoc */
npf.ui.navigation.Item.prototype.decorateInternal = function(element) {
  npf.ui.navigation.Item.base(this, 'decorateInternal', element);

  this.initializeDom();
};

/**
 * @protected
 */
npf.ui.navigation.Item.prototype.initializeDom = function() {
  this.applyCaption(this.getCaption());
  this.applyEnabled(this.isEnabled());
  this.applySelected(this.isSelected());
};

/** @inheritDoc */
npf.ui.navigation.Item.prototype.enterDocument = function() {
  npf.ui.navigation.Item.base(this, 'enterDocument');

  var clickHandler = new npf.events.ClickHandler(
    /** @type {!Element} */ (this.getElement()));
  this.disposeOnExitDocument(clickHandler);

  this.getHandler().
    listen(clickHandler, goog.events.EventType.CLICK, this.onClick_);
};

/** @inheritDoc */
npf.ui.navigation.Item.prototype.disposeInternal = function() {
  npf.ui.navigation.Item.base(this, 'disposeInternal');

  this.uri_ = null;
};

/**
 * @return {string}
 */
npf.ui.navigation.Item.prototype.getCaption = function() {
  return this.caption_;
};

/**
 * @param {string} caption
 */
npf.ui.navigation.Item.prototype.setCaption = function(caption) {
  if (this.getCaption() != caption) {
    this.setCaptionInternal(caption);
    this.applyCaption(this.getCaption());
  }
};

/**
 * @param {string} caption
 * @protected
 */
npf.ui.navigation.Item.prototype.setCaptionInternal = function(caption) {
  this.caption_ = caption;
};

/**
 * @param {string} caption
 * @protected
 */
npf.ui.navigation.Item.prototype.applyCaption = function(caption) {
  var renderer = /** @type {npf.ui.navigation.ItemRenderer} */ (
    this.getRenderer());
  renderer.setCaption(this.getCaptionElement(), caption);
};

/**
 * @return {boolean}
 */
npf.ui.navigation.Item.prototype.isEnabled = function() {
  return this.enabled_;
};

/**
 * @param {boolean} enable
 */
npf.ui.navigation.Item.prototype.setEnabled = function(enable) {
  if (this.isEnabled() != enable) {
    this.setEnabledInternal(enable);
    this.applyEnabled(this.isEnabled());
  }
};

/**
 * @param {boolean} enable
 * @protected
 */
npf.ui.navigation.Item.prototype.setEnabledInternal = function(enable) {
  this.enabled_ = enable;
};

/**
 * @param {boolean} enable
 * @protected
 */
npf.ui.navigation.Item.prototype.applyEnabled = function(enable) {
  var renderer = /** @type {npf.ui.navigation.ItemRenderer} */ (
    this.getRenderer());
  renderer.setEnabled(this.getElement(), enable);
};

/**
 * @return {boolean}
 */
npf.ui.navigation.Item.prototype.isSelected = function() {
  return this.selected_;
};

/**
 * @param {boolean} select
 */
npf.ui.navigation.Item.prototype.setSelected = function(select) {
  if (this.isSelected() != select) {
    this.setSelectedInternal(select);
    this.applySelected(this.isSelected());
  }
};

/**
 * @param {boolean} select
 * @protected
 */
npf.ui.navigation.Item.prototype.setSelectedInternal = function(select) {
  this.selected_ = select;
};

/**
 * @param {boolean} select
 * @protected
 */
npf.ui.navigation.Item.prototype.applySelected = function(select) {
  var renderer = /** @type {npf.ui.navigation.ItemRenderer} */ (
    this.getRenderer());
  renderer.setSelected(this.getElement(), select);
};

/**
 * @return {string}
 */
npf.ui.navigation.Item.prototype.getType = function() {
  return this.type_;
};

/**
 * @return {goog.Uri}
 */
npf.ui.navigation.Item.prototype.getUri = function() {
  return this.uri_;
};

/**
 * @param {goog.Uri} uri
 */
npf.ui.navigation.Item.prototype.setUri = function(uri) {
  if (this.getUri().toString() != uri.toString()) {
    this.setUriInternal(uri);
    this.applyUri(this.getUri());
  }
};

/**
 * @param {goog.Uri} uri
 * @protected
 */
npf.ui.navigation.Item.prototype.setUriInternal = function(uri) {
  this.uri_ = uri;
};

/**
 * @param {goog.Uri} uri
 * @protected
 */
npf.ui.navigation.Item.prototype.applyUri = function(uri) {
  var renderer = /** @type {npf.ui.navigation.ItemRenderer} */ (
    this.getRenderer());
  renderer.setUri(this.getLinkElement(), uri);
};

/**
 * @param {goog.events.BrowserEvent} evt
 * @private
 */
npf.ui.navigation.Item.prototype.onClick_ = function(evt) {
  if (this.enabled_) {
    this.onAction(evt);
  } else {
    evt.preventDefault();
  }
};

/**
 * @param {goog.events.BrowserEvent} evt
 * @protected
 */
npf.ui.navigation.Item.prototype.onAction = function(evt) {
  this.dispatchEvent(goog.ui.Component.EventType.ACTION);
};

/**
 * @return {Element}
 */
npf.ui.navigation.Item.prototype.getCaptionElement = function() {
  var renderer = /** @type {npf.ui.navigation.ItemRenderer} */ (
    this.getRenderer());

  return renderer.getCaptionElement(this.getElement());
};

/**
 * @return {Element}
 */
npf.ui.navigation.Item.prototype.getLinkElement = function() {
  var renderer = /** @type {npf.ui.navigation.ItemRenderer} */ (
    this.getRenderer());

  return renderer.getLinkElement(this.getElement());
};
