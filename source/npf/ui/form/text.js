goog.provide('npf.ui.form.Text');

goog.require('goog.events.InputHandler');
goog.require('goog.events.InputHandler.EventType');
goog.require('goog.string');
goog.require('npf.ui.form.Field');
goog.require('npf.ui.form.TextRenderer');
goog.require('npf.ui.form.validation.Email');
goog.require('npf.ui.form.validation.MaxLength');
goog.require('npf.ui.form.validation.MinLength');


/**
 * @param {string} name
 * @param {npf.ui.form.TextRenderer=} opt_renderer
 * @param {goog.dom.DomHelper=} opt_domHelper
 * @constructor
 * @struct
 * @extends {npf.ui.form.Field}
 */
npf.ui.form.Text = function(name, opt_renderer, opt_domHelper) {
  var renderer = opt_renderer || npf.ui.form.TextRenderer.getInstance();

  npf.ui.form.Text.base(this, 'constructor', name, renderer, opt_domHelper);

  /**
   * @private {boolean}
   */
  this.autoComplete_ = true;

  /**
   * @private {number}
   */
  this.maxLength_ = -1;

  /**
   * @private {boolean}
   */
  this.trimedValue_ = true;

  this.addClassName(renderer.getFieldCssClass());
  this.setValue('');
};
goog.inherits(npf.ui.form.Text, npf.ui.form.Field);


/** @inheritDoc */
npf.ui.form.Text.prototype.enterDocument = function() {
  npf.ui.form.Text.base(this, 'enterDocument');

  var inputHandler = new goog.events.InputHandler(this.getValueElement());
  this.disposeOnExitDocument(inputHandler);

  this.getHandler().listen(inputHandler,
    goog.events.InputHandler.EventType.INPUT, this.onInput);
};

/** @inheritDoc */
npf.ui.form.Text.prototype.initializeInternal = function() {
  npf.ui.form.Text.base(this, 'initializeInternal');

  this.applyMaxLength(this.getMaxLength());
  this.applyAutoComplete(this.isAutoComplete());
};

/**
 * @return {string}
 * @override
 */
npf.ui.form.Text.prototype.getRequestValue = function() {
  return /** @type {string} */ (npf.ui.form.Text.base(this, 'getRequestValue'));
};

/**
 * @return {string}
 * @override
 */
npf.ui.form.Text.prototype.getValue = function() {
  return /** @type {string} */ (npf.ui.form.Text.base(this, 'getValue'));
};

/** @inheritDoc */
npf.ui.form.Text.prototype.setValue = function(value, opt_noRender, opt_force) {
  if (!goog.isString(value)) {
    throw Error(npf.ui.form.Field.Error.TYPE_INVALID);
  }

  npf.ui.form.Text.base(this, 'setValue', value, opt_noRender, opt_force);
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
 * @param {string} errorMessage
 * @param {number} maxLength
 */
npf.ui.form.Text.prototype.addMaxLengthValidator = function(errorMessage,
    maxLength) {
  var validator = new npf.ui.form.validation.MaxLength(errorMessage, maxLength);
  this.addValidator(validator);
};

/**
 * @param {string} errorMessage
 * @param {number} minLength
 */
npf.ui.form.Text.prototype.addMinLengthValidator = function(errorMessage,
    minLength) {
  var validator = new npf.ui.form.validation.MinLength(errorMessage, minLength);
  this.addValidator(validator);
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
 * @protected
 */
npf.ui.form.Text.prototype.onInput = function(evt) {
  var value = this.getValueFromElement();
  this.setValue(value, true);
};
