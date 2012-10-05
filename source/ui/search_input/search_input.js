goog.provide('npf.ui.SearchInput');
goog.provide('npf.ui.SearchInput.EventType');

goog.require('goog.events.InputHandler');
goog.require('npf.ui.RenderComponent');
goog.require('npf.ui.searchInput.Renderer');


/**
 * @param {string=} opt_value
 * @param {string=} opt_placeholder
 * @param {npf.ui.searchInput.Renderer=} opt_renderer
 * @param {goog.dom.DomHelper=} opt_domHelper
 * @constructor
 * @extends {npf.ui.RenderComponent}
 */
npf.ui.SearchInput = function(opt_value, opt_placeholder, opt_renderer,
                              opt_domHelper) {
  goog.base(this, opt_renderer ||
    npf.ui.searchInput.Renderer.getInstance(), opt_domHelper);

  this.value_ = opt_value || '';
  this.placeholderValue_ = opt_placeholder || '';
};
goog.inherits(npf.ui.SearchInput, npf.ui.RenderComponent);


/**
 * @enum {string}
 */
npf.ui.SearchInput.EventType = {
  /**
   * Изменилось значение контрола.
   * value (string)
   */
  CHANGE: goog.events.getUniqueId('change'),

  /**
   * Пустое значение в контроле.
   */
  CLEAR: goog.events.getUniqueId('clear')
};

/**
 * @type {string}
 * @private
 */
npf.ui.SearchInput.prototype.value_ = '';

/**
 * @type {string}
 * @private
 */
npf.ui.SearchInput.prototype.placeholderValue_ = '';

/**
 * @type {boolean}
 * @private
 */
npf.ui.SearchInput.prototype.clearable_ = true;

/**
 * @type {boolean}
 * @private
 */
npf.ui.SearchInput.prototype.hasIcon_ = true;

/**
 * @type {goog.events.InputHandler}
 * @private
 */
npf.ui.SearchInput.prototype.inputHandler_ = null;


/** @inheritDoc */
npf.ui.SearchInput.prototype.createDom = function() {
  goog.base(this, 'createDom');

  /** @type {Element} */
  var placeholderElement = this.getPlaceholderElement();
  /** @type {Element} */
  var clearElement = this.getClearElement();

  this.setInputValue(this.value_);
  this.setEmptyInternal('' == this.value_);
};

/** @inheritDoc */
npf.ui.SearchInput.prototype.enterDocument = function() {
  goog.base(this, 'enterDocument');

  /** @type {goog.events.EventHandler} */
  var handler = this.getHandler();
  /** @type {Element} */
  var iconElement = this.getIconElement();
  /** @type {Element} */
  var clearElement = this.getClearElement();

  if (iconElement) {
    handler.listen(iconElement, goog.events.EventType.CLICK, this.onIconClick_);
  }

  if (clearElement) {
    handler.listen(clearElement, goog.events.EventType.CLICK,
      this.onClearClick_);
  }

  this.inputHandler_ = new goog.events.InputHandler(this.getQueryElement());
  handler.listen(this.inputHandler_, goog.events.InputHandler.EventType.INPUT,
    this.onChange_);
};

/** @inheritDoc */
npf.ui.SearchInput.prototype.exitDocument = function() {
  this.inputHandler_.dispose();
  this.inputHandler_ = null;

  goog.base(this, 'exitDocument');
};

/** @inheritDoc */
npf.ui.SearchInput.prototype.disposeInternal = function() {
  goog.base(this, 'disposeInternal');

  this.inputHandler_ = null;
};

/**
 * @param {goog.events.BrowserEvent} evt
 * @private
 */
npf.ui.SearchInput.prototype.onIconClick_ = function(evt) {
  this.getRenderer().focus(this.getQueryElement());
};

/**
 * @param {goog.events.BrowserEvent} evt
 * @private
 */
npf.ui.SearchInput.prototype.onClearClick_ = function(evt) {
  this.setValueInternal('', true);
  this.getRenderer().focus(this.getQueryElement());
};

/**
 * @param {goog.events.BrowserEvent} evt
 * @private
 */
npf.ui.SearchInput.prototype.onChange_ = function(evt) {
  this.update();
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
npf.ui.SearchInput.prototype.hasIcon = function() {
  return this.hasIcon_;
};

/**
 * @param {boolean} enable
 */
npf.ui.SearchInput.prototype.setIcon = function(enable) {
  this.hasIcon_ = enable;
};

npf.ui.SearchInput.prototype.focus = function() {
  this.getRenderer().focusAndSelect(this.getQueryElement());
};

npf.ui.SearchInput.prototype.blur = function() {
  this.getQueryElement().blur();
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

npf.ui.SearchInput.prototype.update = function() {
  /** @type {string} */
  var value = this.getRenderer().getValue(this.getQueryElement());
  this.setValueInternal(value, false);
};

/**
 * @param {string} value
 */
npf.ui.SearchInput.prototype.setValue = function(value) {
  this.setValueInternal(value, true);
};

/**
 * @param {string} value
 * @param {boolean} updateInput
 * @protected
 */
npf.ui.SearchInput.prototype.setValueInternal = function(value, updateInput) {
  if (this.value_ == value) {
    return;
  }

  /** @type {boolean} */
  var oldEmpty = '' == this.value_;
  /** @type {boolean} */
  var newEmpty = '' == value;

  this.value_ = value;

  if (oldEmpty != newEmpty) {
    this.setEmptyInternal(newEmpty);
  }

  if (updateInput) {
    this.setInputValue(value);
  }

  this.dispatchChangeEvent();

  if ('' == this.value_) {
    this.dispatchClearEvent();
  }
};

/**
 * @param {string} value
 * @protected
 */
npf.ui.SearchInput.prototype.setInputValue = function(value) {
  this.getRenderer().setValue(this.getQueryElement(), value);
};

/**
 * @param {boolean} empty
 * @protected
 */
npf.ui.SearchInput.prototype.setEmptyInternal = function(empty) {
  this.getRenderer().setVisible(this.getClearElement(), !empty);
  this.getRenderer().setVisible(this.getPlaceholderElement(), empty);
};

/**
 * @return {Element}
 */
npf.ui.SearchInput.prototype.getPlaceholderElement = function() {
  return this.getRenderer().getPlaceholderElement(this.getElement());
};

/**
 * @return {Element}
 */
npf.ui.SearchInput.prototype.getQueryElement = function() {
  return this.getRenderer().getQueryElement(this.getElement());
};

/**
 * @return {Element}
 */
npf.ui.SearchInput.prototype.getIconElement = function() {
  return this.getRenderer().getIconElement(this.getElement());
};

/**
 * @return {?Element}
 */
npf.ui.SearchInput.prototype.getClearElement = function() {
  return this.getRenderer().getClearElement(this.getElement());
};

/**
 * @protected
 */
npf.ui.SearchInput.prototype.dispatchChangeEvent = function() {
  this.dispatchEvent({
    type: npf.ui.SearchInput.EventType.CHANGE,
    value: this.value_
  });
};

/**
 * @protected
 */
npf.ui.SearchInput.prototype.dispatchClearEvent = function() {
  this.dispatchEvent({
    type: npf.ui.SearchInput.EventType.CLEAR
  });
};
