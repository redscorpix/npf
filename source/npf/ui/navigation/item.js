goog.provide('npf.ui.navigation.Item');

goog.require('goog.events.BrowserEvent');
goog.require('goog.events.EventType');
goog.require('goog.ui.Component.EventType');
goog.require('npf.ui.RenderedComponent');
goog.require('npf.ui.navigation.ItemRenderer');


/**
 * @param {string} type
 * @param {string} url
 * @param {string} caption
 * @param {npf.ui.navigation.ItemRenderer=} opt_renderer Renderer used to render
 *        or decorate the component.
 * @param {goog.dom.DomHelper=} opt_domHelper DOM helper, used for document
 *        interaction.
 * @constructor
 * @extends {npf.ui.RenderedComponent}
 */
npf.ui.navigation.Item = function(type, url, caption, opt_renderer,
    opt_domHelper) {
  goog.base(this, opt_renderer ||
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
   * @private {string}
   */
  this.url_ = url;
};
goog.inherits(npf.ui.navigation.Item, npf.ui.RenderedComponent);


/** @inheritDoc */
npf.ui.navigation.Item.prototype.createDom = function() {
  goog.base(this, 'createDom');

  this.initializeDom();
};

/** @inheritDoc */
npf.ui.navigation.Item.prototype.decorateInternal = function(element) {
  goog.base(this, 'decorateInternal', element);

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
  goog.base(this, 'enterDocument');

  this.getHandler()
    .listen(this.getElement(), goog.events.EventType.CLICK, this.onClick_);
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
  this.getRenderer().setCaption(this.getCaptionElement(), caption);
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
  this.getRenderer().setEnabled(this.getElement(), enable);
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
  this.getRenderer().setSelected(this.getElement(), select);
};

/**
 * @return {string}
 */
npf.ui.navigation.Item.prototype.getType = function() {
  return this.type_;
};

/**
 * @return {string}
 */
npf.ui.navigation.Item.prototype.getUrl = function() {
  return this.url_;
};

/**
 * @param {string} url
 */
npf.ui.navigation.Item.prototype.setUrl = function(url) {
  if (this.getUrl() != url) {
    this.setUrlInternal(url);
    this.applyUrl(this.getUrl());
  }
};

/**
 * @param {string} url
 * @protected
 */
npf.ui.navigation.Item.prototype.setUrlInternal = function(url) {
  this.url_ = url;
};

/**
 * @param {string} url
 * @protected
 */
npf.ui.navigation.Item.prototype.applyUrl = function(url) {
  this.getRenderer().setUrl(this.getLinkElement(), url);
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
  return this.getRenderer().getCaptionElement(this.getElement());
};

/**
 * @return {Element}
 */
npf.ui.navigation.Item.prototype.getLinkElement = function() {
  return this.getRenderer().getLinkElement(this.getElement());
};
