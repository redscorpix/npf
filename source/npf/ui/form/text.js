goog.provide('npf.ui.form.Text');

goog.require('goog.events.InputHandler');
goog.require('goog.events.InputHandler.EventType');
goog.require('goog.string');
goog.require('npf.ui.form.Field');
goog.require('npf.ui.form.TextRenderer');
goog.require('npf.ui.form.validation.Email');


/**
 * @param {string} name
 * @param {npf.ui.form.TextRenderer=} opt_renderer
 * @param {goog.dom.DomHelper=} opt_domHelper
 * @constructor
 * @extends {npf.ui.form.Field}
 */
npf.ui.form.Text = function(name, opt_renderer, opt_domHelper) {
  var renderer = opt_renderer || npf.ui.form.TextRenderer.getInstance();

  goog.base(this, name, renderer, opt_domHelper);

  this.addClassName(renderer.getFieldCssClass());
  this.setValue('');
};
goog.inherits(npf.ui.form.Text, npf.ui.form.Field);


/**
 * @private {boolean}
 */
npf.ui.form.Text.prototype.autoComplete_ = true;

/**
 * @private {number}
 */
npf.ui.form.Text.prototype.maxLength_ = 0;

/**
 * @private {boolean}
 */
npf.ui.form.Text.prototype.trimedValue_ = true;


/** @inheritDoc */
npf.ui.form.Text.prototype.enterDocument = function() {
  goog.base(this, 'enterDocument');

  var inputHandler = new goog.events.InputHandler(this.getValueElement());
  this.disposeOnExitDocument(inputHandler);

  this.getHandler().listen(inputHandler,
    goog.events.InputHandler.EventType.INPUT, this.onInput_);
};

/** @inheritDoc */
npf.ui.form.Text.prototype.initializeInternal = function() {
  goog.base(this, 'initializeInternal');

  this.applyMaxLength(this.getMaxLength());
  this.applyAutoComplete(this.isAutoComplete());
};

/**
 * @return {string}
 * @override
 */
npf.ui.form.Text.prototype.getValue = function() {
  return /** @type {string} */ (goog.base(this, 'getValue'));
};

/** @inheritDoc */
npf.ui.form.Text.prototype.correctValue = function(value) {
  if (this.isTrimedValue()) {
    return goog.string.trim(/** @type {string} */ (value));
  }

  return value;
};

/** @inheritDoc */
npf.ui.form.Text.prototype.isEmpty = function() {
  return !this.getValue();
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
  if (this.isAutoComplete() != autoComplete) {
    this.setAutoCompleteInternal(autoComplete);
    this.applyAutoComplete(this.isAutoComplete());
  }
};

/**
 * @param {boolean} autoComplete
 * @protected
 */
npf.ui.form.Text.prototype.setAutoCompleteInternal = function(autoComplete) {
  this.autoComplete_ = autoComplete;
};

/**
 * @param {boolean} autoComplete
 * @protected
 */
npf.ui.form.Text.prototype.applyAutoComplete = function(autoComplete) {
  var renderer = /** @type {npf.ui.form.TextRenderer} */ (this.getRenderer());
  renderer.setAutoComplete(this.getValueElement(), autoComplete);
};

/**
 * @param {string} errorMessage
 */
npf.ui.form.Text.prototype.addEmailValidator = function(errorMessage) {
  var validator = new npf.ui.form.validation.Email(errorMessage);
  this.addValidator(validator);
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
  if (this.getMaxLength() != maxLength) {
    this.setMaxLengthInternal(maxLength);
    this.applyMaxLength(this.getMaxLength());
  }
};

/**
 * @param {number} maxLength
 * @protected
 */
npf.ui.form.Text.prototype.setMaxLengthInternal = function(maxLength) {
  this.maxLength_ = maxLength;
};

/**
 * @param {number} maxLength
 * @protected
 */
npf.ui.form.Text.prototype.applyMaxLength = function(maxLength) {
  var renderer = /** @type {npf.ui.form.TextRenderer} */ (this.getRenderer());
  renderer.setMaxLength(this.getValueElement(), maxLength);
};

/**
 * @return {boolean}
 */
npf.ui.form.Text.prototype.isTrimedValue = function() {
  return this.trimedValue_;
};

/**
 * @param {boolean} trim
 */
npf.ui.form.Text.prototype.setTrimedValue = function(trim) {
  this.trimedValue_ = trim;
};

/**
 * @param {goog.events.BrowserEvent} evt
 * @private
 */
npf.ui.form.Text.prototype.onInput_ = function(evt) {
  this.onInput();
};

/**
 * @protected
 */
npf.ui.form.Text.prototype.onInput = function() {
  var value = this.getValueFromElement();
  this.setValue(value, true);
};
