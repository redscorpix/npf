goog.provide('npf.ui.navigation.Item');

goog.require('npf.events.TapHandler');
goog.require('npf.ui.RenderComponent');
goog.require('npf.ui.navigation.ItemRenderer');


/**
 * @param {string} type
 * @param {string} url
 * @param {string} caption
 * @param {npf.ui.navigation.ItemRenderer=} opt_renderer Renderer used to render or decorate the component.
 * @param {goog.dom.DomHelper=} opt_domHelper DOM helper, used for document interaction.
 * @constructor
 * @extends {npf.ui.RenderComponent}
 */
npf.ui.navigation.Item = function(type, url, caption, opt_renderer, opt_domHelper) {
  goog.base(this, opt_renderer ||
    npf.ui.navigation.ItemRenderer.getInstance(), opt_domHelper);

  this.type_ = type;
  this.url_ = url;
  this.caption_ = caption;
};
goog.inherits(npf.ui.navigation.Item, npf.ui.RenderComponent);


/**
 * @type {string}
 * @private
 */
npf.ui.navigation.Item.prototype.type_;

/**
 * @type {string}
 * @private
 */
npf.ui.navigation.Item.prototype.caption_;

/**
 * @type {string}
 * @private
 */
npf.ui.navigation.Item.prototype.url_;

/**
 * @type {boolean}
 * @private
 */
npf.ui.navigation.Item.prototype.selected_ = false;

/**
 * @type {boolean}
 * @private
 */
npf.ui.navigation.Item.prototype.enabled_ = true;


/** @inheritDoc */
npf.ui.navigation.Item.prototype.enterDocument = function() {
  goog.base(this, 'enterDocument');

  var tapHandler = new npf.events.TapHandler(this.getElement());
  this.disposeOnExitDocument(tapHandler);

  this.getHandler()
    .listen(tapHandler, npf.events.TapHandler.EventType.TAP, this.onTap_);
};

/**
 * @param {goog.events.BrowserEvent} evt
 * @private
 */
npf.ui.navigation.Item.prototype.onTap_ = function(evt) {
  if (evt && !this.enabled_) {
    evt.preventDefault();
  }
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
npf.ui.navigation.Item.prototype.getCaption = function() {
  return this.caption_;
};

/**
 * @param {string} caption
 */
npf.ui.navigation.Item.prototype.setCaption = function(caption) {
  if (this.caption_ != caption) {
    this.caption_ = caption;
    this.setCaptionInternal(this.caption_);
  }
};

/**
 * @param {string} caption
 * @protected
 */
npf.ui.navigation.Item.prototype.setCaptionInternal = function(caption) {
  var renderer = this.getRenderer();
  /** @type {Element} */
  var captionElement = renderer.getCaptionElement(this.getElement());
  renderer.setCaption(captionElement, caption);
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
  if (this.url_ != url) {
    this.url_ = url;
    this.setUrlInternal(this.url_);
  }
};

/**
 * @param {string} url
 * @protected
 */
npf.ui.navigation.Item.prototype.setUrlInternal = function(url) {
  var renderer = this.getRenderer();
  /** @type {Element} */
  var linkElement = renderer.getLinkElement(this.getElement());
  renderer.setUrl(linkElement, url);
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
  if (this.selected_ != select) {
    this.selected_ = select;
    this.setSelectedInternal(this.selected_);
  }
};

/**
 * @param {boolean} select
 * @protected
 */
npf.ui.navigation.Item.prototype.setSelectedInternal = function(select) {
  this.getRenderer().setSelected(this.getElement(), select);
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
  if (this.enabled_ != enable) {
    this.enabled_ = enable;
    this.setEnabledInternal(this.enabled_);
  }
};

/**
 * @param {boolean} enable
 * @protected
 */
npf.ui.navigation.Item.prototype.setEnabledInternal = function(enable) {
  this.getRenderer().setEnabled(this.getElement(), enable);
};
