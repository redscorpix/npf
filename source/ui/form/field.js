goog.provide('npf.ui.form.Field');

goog.require('goog.array');
goog.require('goog.events');
goog.require('goog.object');
goog.require('goog.ui.IdGenerator');
goog.require('npf.ui.Container');
goog.require('npf.ui.form.EventType');
goog.require('npf.ui.form.FieldRenderer');


/**
 * @param {string} name
 * @param {npf.ui.form.FieldRenderer=} opt_renderer
 * @param {goog.dom.DomHelper=} opt_domHelper
 * @constructor
 * @extends {npf.ui.Container}
 */
npf.ui.form.Field = function(name, opt_renderer, opt_domHelper) {
  goog.base(this, opt_renderer || npf.ui.form.FieldRenderer.getInstance(),
    opt_domHelper);

  this.setSupportedState(goog.ui.Component.State.DISABLED, true);

  this.name_ = name;
  this.validators_ = [];
};
goog.inherits(npf.ui.form.Field, npf.ui.Container);


/**
 * @enum {string}
 */
npf.ui.form.Field.ErrorMessage = {
  REQUIRED: 'Необходимо заполнить поле'
};

/**
 * @type {string}
 * @private
 */
npf.ui.form.Field.prototype.name_;

/**
 * @type {*}
 * @private
 */
npf.ui.form.Field.prototype.value_;

/**
 * @type {Array.<function(*):string>}
 * @private
 */
npf.ui.form.Field.prototype.validators_;

/**
 * @type {boolean}
 * @private
 */
npf.ui.form.Field.prototype.required_ = false;

/**
 * @type {string}
 * @private
 */
npf.ui.form.Field.prototype.label_ = '';

/**
 * @type {string}
 * @private
 */
npf.ui.form.Field.prototype.notice_ = '';

/**
 * @type {string}
 * @private
 */
npf.ui.form.Field.prototype.error_ = '';

/**
 * @type {boolean}
 * @private
 */
npf.ui.form.Field.prototype.errorVisible_ = false;

/**
 * @type {boolean}
 * @private
 */
npf.ui.form.Field.prototype.hideErrorOnChange_ = true;


/** @inheritDoc */
npf.ui.form.Field.prototype.disposeInternal = function() {
  goog.base(this, 'disposeInternal');

  this.value_ = null;
  this.validators_ = null;
};

/**
 * @protected
 */
npf.ui.form.Field.prototype.initializeInternal = function() {
  this.renderValueInternal(this.getValue());
  this.setErrorInternal(this.error_);
  this.setErrorVisibleInternal(this.errorVisible_);
};

/**
 * @return {string}
 */
npf.ui.form.Field.prototype.getName = function() {
  return this.name_;
};

/**
 * @return {*}
 */
npf.ui.form.Field.prototype.getValue = function() {
  return this.value_;
};

/**
 * @return {string}
 */
npf.ui.form.Field.prototype.getRequestValue = function() {
  return this.value_ + '';
};

/**
 * @param {*} value
 * @param {boolean=} opt_noRender
 */
npf.ui.form.Field.prototype.setValue = function(value, opt_noRender) {
  var correctedValue = this.correctValueInternal(value);

  if (!this.isSameValue(correctedValue)) {
    if (this.hideErrorOnChange_) {
      this.setErrorVisible(false);
    }

    this.setValueInternal(correctedValue);

    if (!opt_noRender) {
      this.renderValueInternal(this.getValue());
    }

    /** @type {string} */
    var error = this.validateInternal();
    this.setError(error);

    this.onChange();
  }
};

/**
 * @protected
 */
npf.ui.form.Field.prototype.onChange = function() {
  this.dispatchEvent({
    type: npf.ui.form.EventType.CHANGE,
    value: this.getValue()
  });
};

/**
 * @param {*} value
 * @protected
 */
npf.ui.form.Field.prototype.setValueInternal = function(value) {
  this.value_ = value;
};

/**
 * @param {*} value
 * @return {boolean}
 */
npf.ui.form.Field.prototype.isSameValue = function(value) {
  return this.getValue() === value;
};

/**
 * @param {*} value
 * @return {*}
 * @protected
 */
npf.ui.form.Field.prototype.correctValueInternal = function(value) {
  return value;
};

/**
 * @param {*} value
 * @protected
 */
npf.ui.form.Field.prototype.renderValueInternal = function(value) {
  this.getRenderer().setValue(this.getValueElement(), value);
};

/**
 * @return {string}
 * @protected
 */
npf.ui.form.Field.prototype.validateInternal = function() {
  /** @type {string} */
  var error = '';

  if (this.isRequired() && this.isEmpty()) {
    error = this.getRequiredError();
  } else {
    goog.array.every(this.validators_, function(validator) {
      error = validator(this.getValue());

      return !error;
    }, this);
  }

  return error;
};

/**
 * @return {boolean}
 */
npf.ui.form.Field.prototype.isEmpty = function() {
  return false;
};

/**
 * @param {Element} valueElement
 * @protected
 */
npf.ui.form.Field.prototype.bindLabel = function(valueElement) {
  if (!valueElement.id) {
    valueElement.id = goog.ui.IdGenerator.getInstance().getNextUniqueId();
  }

  /** @type {Element} */
  var labelElement = this.getLabelElement();

  if (labelElement) {
    labelElement.setAttribute('for', valueElement.id);
  }
};

/**
 * @return {boolean}
 */
npf.ui.form.Field.prototype.isRequired = function() {
  return this.required_;
};

/**
 * @param {boolean} require
 */
npf.ui.form.Field.prototype.setRequired = function(require) {
  this.required_ = require;
};

/**
 * @return {string}
 */
npf.ui.form.Field.prototype.getLabel = function() {
  return this.label_;
};

/**
 * @param {string} label
 * @throws {Error} If the component is already in the document.
 */
npf.ui.form.Field.prototype.setLabel = function(label) {
  if (this.isInDocument()) {
    // Too late.
    throw Error(goog.ui.Component.Error.ALREADY_RENDERED);
  }

  this.label_ = label;
};

/**
 * @return {string}
 */
npf.ui.form.Field.prototype.getNotice = function() {
  return this.notice_;
};

/**
 * @param {string} notice
 * @throws {Error} If the component is already in the document.
 */
npf.ui.form.Field.prototype.setNotice = function(notice) {
  if (this.isInDocument()) {
    // Too late.
    throw Error(goog.ui.Component.Error.ALREADY_RENDERED);
  }

  this.notice_ = notice;
};

/**
 * @return {string}
 * @protected
 */
npf.ui.form.Field.prototype.getRequiredError = function() {
  return npf.ui.form.Field.ErrorMessage.REQUIRED;
};

/**
 * @param {function(*):string} validator
 */
npf.ui.form.Field.prototype.addValidator = function(validator) {
  this.validators_.push(validator);
};

/**
 * @param {RegExp} regExp
 * @param {string} error
 */
npf.ui.form.Field.prototype.addRegExpValidator = function(regExp, error) {
  this.addValidator(function(value) {
    return goog.isString(value) && !regExp.test(value) ? error : '';
  });
};

npf.ui.form.Field.prototype.focus = function() {
  this.getRenderer().focus(this.getValueElement());
};

npf.ui.form.Field.prototype.focusAndSelect = function() {
  this.getRenderer().focusAndSelect(this.getValueElement());
};

/**
 * @return {boolean}
 */
npf.ui.form.Field.prototype.isHiddenErrorOnChange = function() {
  return this.hideErrorOnChange_;
};

/**
 * @param {boolean} hide
 */
npf.ui.form.Field.prototype.setHiddenErrorOnChange = function(hide) {
  this.hideErrorOnChange_ = hide;
};

/**
 * Показывает сообщение об ошибке.
 * @param {string=} opt_error
 */
npf.ui.form.Field.prototype.showError = function(opt_error) {
  if (goog.isString(opt_error)) {
    this.setError(opt_error);
  }

  this.setErrorVisible(this.hasError());
};

npf.ui.form.Field.prototype.hideError = function() {
  this.setError('');
  this.setErrorVisible(false);
};

/**
 * @return {boolean}
 */
npf.ui.form.Field.prototype.isErrorVisible = function() {
  return this.errorVisible_;
};

/**
 * @param {boolean} visible
 */
npf.ui.form.Field.prototype.setErrorVisible = function(visible) {
  if (this.errorVisible_ != visible) {
    this.errorVisible_ = visible;
    this.setErrorVisibleInternal(this.errorVisible_);
  }
};

/**
 * @param {boolean} visible
 */
npf.ui.form.Field.prototype.setErrorVisibleInternal = function(visible) {
  this.getRenderer().setErrorVisible(this.getElement(), visible);
};

/**
 * @return {boolean}
 */
npf.ui.form.Field.prototype.hasError = function() {
  return !!this.error_;
};

/**
 * @return {string}
 */
npf.ui.form.Field.prototype.getError = function() {
  return this.error_;
};

/**
 * @param {?string=} opt_error
 */
npf.ui.form.Field.prototype.setError = function(opt_error) {
  /** @type {string} */
  var error = goog.isString(opt_error) ? opt_error : '';

  if (this.error_ != error) {
    this.error_ = error;
    this.setErrorInternal(this.error_);

    if (this.error_) {
      this.dispatchEvent({
        type: npf.ui.form.EventType.ERROR,
        value: this.getValue(),
        error: this.getError()
      });
    } else {
      this.dispatchEvent({
        type: npf.ui.form.EventType.VALID,
        value: this.getValue()
      });
    }
  }
};

/**
 * @param {string} error
 * @protected
 */
npf.ui.form.Field.prototype.setErrorInternal = function(error) {
  this.getRenderer().setContent(this.getErrorElement(), error);
};

/**
 * @return {Element}
 */
npf.ui.form.Field.prototype.getLabelContainerElement = function() {
  return this.getRenderer().getLabelContainerElement(this.getElement());
};

/**
 * @return {Element}
 */
npf.ui.form.Field.prototype.getLabelElement = function() {
  return this.getRenderer().getLabelElement(this.getElement());
};

/**
 * @return {Element}
 */
npf.ui.form.Field.prototype.getNoticeElement = function() {
  return this.getRenderer().getNoticeElement(this.getElement());
};

/**
 * @return {Element}
 */
npf.ui.form.Field.prototype.getErrorElement = function() {
  return this.getRenderer().getErrorElement(this.getElement());
};

/**
 * @return {Element}
 */
npf.ui.form.Field.prototype.getValueElement = function() {
  return this.getRenderer().getValueElement(this.getElement());
};
