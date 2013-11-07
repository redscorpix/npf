goog.provide('npf.ui.SearchInput');
goog.provide('npf.ui.SearchInput.EventType');

goog.require('goog.events');
goog.require('goog.events.EventType');
goog.require('goog.events.InputHandler');
goog.require('goog.events.InputHandler.EventType');
goog.require('npf.ui.RenderedComponent');
goog.require('npf.ui.searchInput.Renderer');


/**
 * @param {string=} opt_value
 * @param {string=} opt_placeholder
 * @param {npf.ui.searchInput.Renderer=} opt_renderer
 * @param {goog.dom.DomHelper=} opt_domHelper
 * @constructor
 * @extends {npf.ui.RenderedComponent}
 */
npf.ui.SearchInput = function(opt_value, opt_placeholder, opt_renderer,
    opt_domHelper) {
  goog.base(this, opt_renderer ||
    npf.ui.searchInput.Renderer.getInstance(), opt_domHelper);

  this.value_ = opt_value || '';
  this.placeholderValue_ = opt_placeholder || '';
};
goog.inherits(npf.ui.SearchInput, npf.ui.RenderedComponent);


/**
 * @enum {string}
 */
npf.ui.SearchInput.EventType = {
  /**
   * Пустое значение в контроле.
   */
  CLEAR: goog.events.getUniqueId('clear'),

  /**
   * Изменилось значение контрола.
   */
  CHANGE: goog.events.getUniqueId('change')
};


/**
 * @private {boolean}
 */
npf.ui.SearchInput.prototype.clearable_ = true;

/**
 * @private {boolean}
 */
npf.ui.SearchInput.prototype.hasIcon_ = true;

/**
 * @private {string}
 */
npf.ui.SearchInput.prototype.placeholderValue_ = '';

/**
 * @private {string}
 */
npf.ui.SearchInput.prototype.value_ = '';


/** @inheritDoc */
npf.ui.SearchInput.prototype.createDom = function() {
  goog.base(this, 'createDom');

  this.applyValue(this.getValue(), '');
};

/** @inheritDoc */
npf.ui.SearchInput.prototype.enterDocument = function() {
  goog.base(this, 'enterDocument');

  /** @type {goog.events.EventHandler} */
  var handler = this.getHandler();
  /** @type {Element} */
  var clearElement = this.getClearElement();
  /** @type {Element} */
  var iconElement = this.getIconElement();

  if (clearElement) {
    handler.listen(
      clearElement, goog.events.EventType.CLICK, this.onClearClick_);
  }

  if (iconElement) {
    handler.listen(iconElement, goog.events.EventType.CLICK, this.onIconClick_);
  }

  var inputHandler = new goog.events.InputHandler(this.getQueryElement());
  this.disposeOnExitDocument(inputHandler);
  handler.listen(
    inputHandler, goog.events.InputHandler.EventType.INPUT, this.onChange_);
};

/**
 * @return {boolean}
 */
npf.ui.SearchInput.prototype.isClearable = function() {
  return this.clearable_;
};

/**
 * @param {boolean} enable
 */
npf.ui.SearchInput.prototype.setClearable = function(enable) {
  this.clearable_ = enable;
};

/**
 * @return {boolean}
 */
npf.ui.SearchInput.prototype.isEmpty = function() {
  return '' == this.getValue();
};

/**
 * @return {boolean}
 */
npf.ui.SearchInput.prototype.hasIcon = function() {
  return this.hasIcon_;
};

/**
 * @param {boolean} enable
 */
npf.ui.SearchInput.prototype.setIcon = function(enable) {
  this.hasIcon_ = enable;
};

/**
 * @return {string}
 */
npf.ui.SearchInput.prototype.getPlaceholderValue = function() {
  return this.placeholderValue_;
};

/**
 * @return {string}
 */
npf.ui.SearchInput.prototype.getValue = function() {
  return this.value_;
};

/**
 * @param {string} value
 * @param {boolean=} opt_noDom
 */
npf.ui.SearchInput.prototype.setValue = function(value, opt_noDom) {
  /** @type {string} */
  var oldValue = this.getValue();

  if (oldValue != value) {
    this.setValueInternal(value);
    this.applyValue(this.getValue(), oldValue, opt_noDom);

    this.dispatchChangeEvent();

    if ('' == this.getValue()) {
      this.dispatchClearEvent();
    }
  }
};

/**
 * @param {string} value
 * @protected
 */
npf.ui.SearchInput.prototype.setValueInternal = function(value) {
  this.value_ = value;
};

/**
 * @param {string} value
 * @param {string} oldValue
 * @param {boolean=} opt_noDom
 * @protected
 */
npf.ui.SearchInput.prototype.applyValue = function(value, oldValue, opt_noDom) {
  /** @type {boolean} */
  var oldEmpty = '' == oldValue;
  /** @type {boolean} */
  var newEmpty = '' == value;
  var renderer = /** @type {npf.ui.searchInput.Renderer} */ (
    this.getRenderer());

  if (oldEmpty != newEmpty) {
    renderer.setVisible(this.getClearElement(), !newEmpty);
    renderer.setVisible(this.getPlaceholderElement(), newEmpty);
  }

  if (!opt_noDom) {
    renderer.setValue(this.getQueryElement(), value);
  }
};

npf.ui.SearchInput.prototype.blur = function() {
  var renderer = /** @type {npf.ui.searchInput.Renderer} */ (
    this.getRenderer());
  renderer.blur(this.getQueryElement());
};

/**
 * @param {boolean=} opt_select
 */
npf.ui.SearchInput.prototype.focus = function(opt_select) {
  var renderer = /** @type {npf.ui.searchInput.Renderer} */ (
    this.getRenderer());
  renderer.focus(this.getQueryElement(), opt_select);
};

npf.ui.SearchInput.prototype.update = function() {
  var renderer = /** @type {npf.ui.searchInput.Renderer} */ (
    this.getRenderer());
  /** @type {string} */
  var value = renderer.getValue(this.getQueryElement());
  this.setValue(value);
};

/**
 * @return {Element}
 */
npf.ui.SearchInput.prototype.getClearElement = function() {
  var renderer = /** @type {npf.ui.searchInput.Renderer} */ (
    this.getRenderer());

  return renderer.getClearElement(this.getElement());
};

/**
 * @return {Element}
 */
npf.ui.SearchInput.prototype.getIconElement = function() {
  var renderer = /** @type {npf.ui.searchInput.Renderer} */ (
    this.getRenderer());

  return renderer.getIconElement(this.getElement());
};

/**
 * @return {Element}
 */
npf.ui.SearchInput.prototype.getPlaceholderElement = function() {
  var renderer = /** @type {npf.ui.searchInput.Renderer} */ (
    this.getRenderer());

  return renderer.getPlaceholderElement(this.getElement());
};

/**
 * @return {Element}
 */
npf.ui.SearchInput.prototype.getQueryElement = function() {
  var renderer = /** @type {npf.ui.searchInput.Renderer} */ (
    this.getRenderer());

  return renderer.getQueryElement(this.getElement());
};

/**
 * @protected
 */
npf.ui.SearchInput.prototype.dispatchChangeEvent = function() {
  this.dispatchEvent(npf.ui.SearchInput.EventType.CHANGE);
};

/**
 * @protected
 */
npf.ui.SearchInput.prototype.dispatchClearEvent = function() {
  this.dispatchEvent(npf.ui.SearchInput.EventType.CLEAR);
};

/**
 * @param {goog.events.BrowserEvent} evt
 * @private
 */
npf.ui.SearchInput.prototype.onIconClick_ = function(evt) {
  var renderer = /** @type {npf.ui.searchInput.Renderer} */ (
    this.getRenderer());
  renderer.focus(this.getQueryElement(), true);
};

/**
 * @param {goog.events.BrowserEvent} evt
 * @private
 */
npf.ui.SearchInput.prototype.onClearClick_ = function(evt) {
  var renderer = /** @type {npf.ui.searchInput.Renderer} */ (
    this.getRenderer());
  this.setValue('');
  renderer.focus(this.getQueryElement());
};

/**
 * @param {goog.events.BrowserEvent} evt
 * @private
 */
npf.ui.SearchInput.prototype.onChange_ = function(evt) {
  this.update();
};
