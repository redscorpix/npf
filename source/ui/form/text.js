goog.provide('npf.ui.form.Text');

goog.require('goog.events.InputHandler');
goog.require('goog.format.EmailAddress');
goog.require('goog.string');
goog.require('npf.ui.form.Field');
goog.require('npf.ui.form.TextRenderer');

/**
 * @param {string} name
 * @param {npf.ui.form.TextRenderer=} opt_renderer
 * @param {goog.dom.DomHelper=} opt_domHelper
 * @constructor
 * @extends {npf.ui.form.Field}
 */
npf.ui.form.Text = function(name, opt_renderer, opt_domHelper) {
  goog.base(this, name, opt_renderer ||
    npf.ui.form.TextRenderer.getInstance(), opt_domHelper);

  this.addClassName(this.getRenderer().getTextCssClass());
  this.setValueInternal('');
};
goog.inherits(npf.ui.form.Text, npf.ui.form.Field);


/**
 * @enum {string}
 */
npf.ui.form.Text.ErrorMessage = {
  EMAIL: 'Неправильный формат электронной почты.'
};

/**
 * @type {boolean}
 * @private
 */
npf.ui.form.Text.prototype.autoComplete_ = true;

/**
 * @type {goog.events.InputHandler}
 * @private
 */
npf.ui.form.Text.prototype.inputHandler_ = null;

/**
 * @type {number}
 * @private
 */
npf.ui.form.Text.prototype.maxLength_ = 0;


/** @inheritDoc */
npf.ui.form.Text.prototype.createDom = function() {
  goog.base(this, 'createDom');

  this.initializeInternal();
};

/** @inheritDoc */
npf.ui.form.Text.prototype.decorateInternal = function(element) {
  goog.base(this, 'decorateInternal', element);

  this.initializeInternal();
};

/** @inheritDoc */
npf.ui.form.Text.prototype.enterDocument = function() {
  goog.base(this, 'enterDocument');

  this.inputHandler_ = new goog.events.InputHandler(this.getValueElement());
  this.inputHandler_.addEventListener(goog.events.InputHandler.EventType.INPUT,
    this.onInput_, false, this);
};

/** @inheritDoc */
npf.ui.form.Text.prototype.exitDocument = function() {
  goog.base(this, 'exitDocument');

  this.inputHandler_.dispose();
  this.inputHandler_ = null;
};

/** @inheritDoc */
npf.ui.form.Text.prototype.disposeInternal = function() {
  goog.base(this, 'disposeInternal');

  this.inputHandler_ = null;
};

/**
 * @param {goog.events.BrowserEvent} evt
 * @private
 */
npf.ui.form.Text.prototype.onInput_ = function(evt) {
  var renderer = this.getRenderer();
  /** @type {string} */
  var value = /** @type {string} */ (renderer.getValue(this.getValueElement()));
  value = goog.string.trim(value);

  this.setValue(value, true);
};

/** @inheritDoc */
npf.ui.form.Text.prototype.initializeInternal = function() {
  this.setMaxLengthInternal(this.maxLength_);
  this.setAutoCompleteInternal(this.autoComplete_);
  this.bindLabel(this.getValueElement());

  goog.base(this, 'initializeInternal');
};

/**
 * @return {string}
 */
npf.ui.form.Text.prototype.getValue = function() {
  return /** @type {string} */ (goog.base(this, 'getValue'));
};

/** @inheritDoc */
npf.ui.form.Text.prototype.isEmpty = function() {
  return '' == this.getValue();
};

/**
 * @return {boolean}
 */
npf.ui.form.Text.prototype.isAutoComplete = function() {
  return this.autoComplete_;
};

/**
 * @param {boolean} autoComplete
 */
npf.ui.form.Text.prototype.setAutoComplete = function(autoComplete) {
  if (this.autoComplete_ != autoComplete) {
    this.autoComplete_ = autoComplete;
    this.setAutoCompleteInternal(this.autoComplete_);
  }
};

/**
 * @param {boolean} autoComplete
 * @protected
 */
npf.ui.form.Text.prototype.setAutoCompleteInternal = function(autoComplete) {
  this.getRenderer().setAutoComplete(this.getValueElement(), autoComplete);
};

/**
 * @return {number}
 */
npf.ui.form.Text.prototype.getMaxLength = function() {
  return this.maxLength_;
};

/**
 * @param {number} maxLength
 */
npf.ui.form.Text.prototype.setMaxLength = function(maxLength) {
  if (this.maxLength_ != maxLength) {
    this.maxLength_ = maxLength;
    this.setMaxLengthInternal(this.maxLength_);
  }
};

/**
 * @param {number} maxLength
 * @protected
 */
npf.ui.form.Text.prototype.setMaxLengthInternal = function(maxLength) {
  this.getRenderer().setMaxLength(this.getValueElement(), maxLength);
};

/**
 * @param {string=} opt_error
 */
npf.ui.form.Text.prototype.addEmailValidator = function(opt_error) {
  var validator = function(value) {
    if (goog.format.EmailAddress.isValidAddress(/** @type {string} */ (value))) {
      return '';
    } else {
      return opt_error || this.getEmailError();
    }
  };

  this.addValidator(goog.bind(validator, this));
};

/**
 * @return {string}
 */
npf.ui.form.Text.prototype.getEmailError = function() {
  return npf.ui.form.Text.ErrorMessage.EMAIL;
};
