goog.provide('npf.ui.form.Field');
goog.provide('npf.ui.form.FieldEvent');

goog.require('goog.array');
goog.require('goog.events');
goog.require('goog.events.Event');
goog.require('npf.ui.StatedComponent');
goog.require('npf.ui.form.EventType');
goog.require('npf.ui.form.FieldRenderer');
goog.require('npf.ui.form.validation.RegExp');
goog.require('npf.ui.form.validation.Required');


/**
 * @param {string} name
 * @param {npf.ui.form.FieldRenderer=} opt_renderer
 * @param {goog.dom.DomHelper=} opt_domHelper
 * @constructor
 * @extends {npf.ui.StatedComponent}
 */
npf.ui.form.Field = function(name, opt_renderer, opt_domHelper) {
  goog.base(this, opt_renderer || npf.ui.form.FieldRenderer.getInstance(),
    opt_domHelper);

  this.setAllowTextSelection(true);
  this.setSupportedState(goog.ui.Component.State.DISABLED, true);
  this.setSupportedState(goog.ui.Component.State.FOCUSED, true);

  this.name_ = name;
  this.validators_ = [];
};
goog.inherits(npf.ui.form.Field, npf.ui.StatedComponent);


/**
 * @private {boolean}
 */
npf.ui.form.Field.prototype.error_ = false;

/**
 * @private {boolean}
 */
npf.ui.form.Field.prototype.errorEnabled_ = true;

/**
 * @type {string|Node|Array.<Node>|NodeList}
 * @private
 */
npf.ui.form.Field.prototype.errorMessage_ = '';

/**
 * @private {boolean}
 */
npf.ui.form.Field.prototype.hideErrorOnChange_ = true;

/**
 * @type {string|Node|Array.<Node>|NodeList}
 * @private
 */
npf.ui.form.Field.prototype.label_ = '';

/**
 * @private {boolean}
 */
npf.ui.form.Field.prototype.labelAsPlaceholder_ = false;

/**
 * @private {boolean}
 */
npf.ui.form.Field.prototype.labelEnabled_ = true;

/**
 * @private {boolean}
 */
npf.ui.form.Field.prototype.labelVisible_ = true;

/**
 * @private {string}
 */
npf.ui.form.Field.prototype.name_;

/**
 * @type {string|Node|Array.<Node>|NodeList}
 * @private
 */
npf.ui.form.Field.prototype.notice_ = '';

/**
 * @private {boolean}
 */
npf.ui.form.Field.prototype.noticeEnabled_ = true;

/**
 * @private {boolean}
 */
npf.ui.form.Field.prototype.valid_ = true;

/**
 * @private {Array.<npf.ui.form.validation.Base>}
 */
npf.ui.form.Field.prototype.validators_;

/**
 * @type {*}
 * @private
 */
npf.ui.form.Field.prototype.value_;


/** @inheritDoc */
npf.ui.form.Field.prototype.createDom = function() {
  goog.base(this, 'createDom');

  this.initializeInternal();
};

/** @inheritDoc */
npf.ui.form.Field.prototype.decorateInternal = function(element) {
  goog.base(this, 'decorateInternal', element);

  this.initializeInternal();
};

/** @inheritDoc */
npf.ui.form.Field.prototype.disposeInternal = function() {
  goog.base(this, 'disposeInternal');

  this.validators_ = null;
  this.value_ = null;
};

/** @inheritDoc */
npf.ui.form.Field.prototype.handleKeyEventInternal = function(e) {
  goog.base(this, 'handleKeyEventInternal', e);

  return false;
};

/**
 * @protected
 */
npf.ui.form.Field.prototype.initializeInternal = function() {
  if (this.isErrorEnabled()) {
    this.applyError(this.isError());
    this.applyErrorMessage(this.getErrorMessage());
  }

  if (this.isLabelEnabled() && this.isLabelAsPlaceholder()) {
    this.applyLabelAsPlaceholder(this.isLabelVisible());
  }

  this.applyValue(this.getValue());
};

/**
 * @return {boolean}
 */
npf.ui.form.Field.prototype.isEmpty = function() {
  return false;
};

/**
 * @return {boolean}
 */
npf.ui.form.Field.prototype.isError = function() {
  return this.error_;
};

/**
 * @param {boolean} visible
 */
npf.ui.form.Field.prototype.setError = function(visible) {
  if (this.isErrorEnabled() && this.isError() != visible) {
    this.setErrorInternal(visible);
    this.applyError(this.isError());
  }
};

/**
 * @param {boolean} visible
 * @protected
 */
npf.ui.form.Field.prototype.setErrorInternal = function(visible) {
  this.error_ = visible;
};

/**
 * @param {boolean} visible
 * @protected
 */
npf.ui.form.Field.prototype.applyError = function(visible) {
  this.getRenderer().setError(this, visible);
};

/**
 * @return {boolean}
 */
npf.ui.form.Field.prototype.isErrorEnabled = function() {
  return this.errorEnabled_;
};

/**
 * @param {boolean} enable
 */
npf.ui.form.Field.prototype.setErrorEnabled = function(enable) {
  this.errorEnabled_ = enable;
};

/**
 * @return {string|Node|Array.<Node>|NodeList}
 */
npf.ui.form.Field.prototype.getErrorMessage = function() {
  return this.errorMessage_;
};

/**
 * @param {string|Node|Array.<Node>|NodeList} message
 */
npf.ui.form.Field.prototype.setErrorMessage = function(message) {
  if (this.isErrorEnabled()) {
    this.setErrorMessageInternal(message);
    this.applyErrorMessage(this.getErrorMessage());
  }
};

/**
 * @param {string|Node|Array.<Node>|NodeList} message
 * @protected
 */
npf.ui.form.Field.prototype.setErrorMessageInternal = function(message) {
  this.errorMessage_ = message;
};

/**
 * @param {string|Node|Array.<Node>|NodeList} message
 * @protected
 */
npf.ui.form.Field.prototype.applyErrorMessage = function(message) {
  this.getRenderer().setContent(this.getErrorMessageElement(), message);
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
 * @param {boolean=} opt_select
 */
npf.ui.form.Field.prototype.focus = function(opt_select) {
  this.getRenderer().focus(this.getValueElement(), opt_select);
};

/**
 * @return {string|Node|Array.<Node>|NodeList}
 */
npf.ui.form.Field.prototype.getLabel = function() {
  return this.label_;
};

/**
 * @param {string|Node|Array.<Node>|NodeList} label
 */
npf.ui.form.Field.prototype.setLabel = function(label) {
  if (this.isLabelEnabled()) {
    this.setLabelInternal(label);
    this.applyLabel(this.getLabel());
  }
};

/**
 * @param {string|Node|Array.<Node>|NodeList} label
 * @protected
 */
npf.ui.form.Field.prototype.setLabelInternal = function(label) {
  this.label_ = label;
};

/**
 * @param {string|Node|Array.<Node>|NodeList} label
 * @protected
 */
npf.ui.form.Field.prototype.applyLabel = function(label) {
  this.getRenderer().setContent(this.getLabelElement(), label);
};

/**
 * @return {boolean}
 */
npf.ui.form.Field.prototype.isLabelAsPlaceholder = function() {
  return this.labelAsPlaceholder_;
};

/**
 * @param {boolean} enable
 */
npf.ui.form.Field.prototype.setLabelAsPlaceholder = function(enable) {
  if (this.isLabelEnabled() && this.isLabelAsPlaceholder() != enable) {
    this.setLabelAsPlaceholderInternal(enable);
    this.applyLabelAsPlaceholder(this.isLabelAsPlaceholder());
  }
};

/**
 * @param {boolean} enable
 * @protected
 */
npf.ui.form.Field.prototype.setLabelAsPlaceholderInternal = function(enable) {
  this.labelAsPlaceholder_ = enable;
};

/**
 * @param {boolean} enable
 */
npf.ui.form.Field.prototype.applyLabelAsPlaceholder = function(enable) {
  this.setLabelVisible(!enable || this.isEmpty());
};

/**
 * @return {boolean}
 */
npf.ui.form.Field.prototype.isLabelEnabled = function() {
  return this.labelEnabled_;
};

/**
 * @param {boolean} enable
 */
npf.ui.form.Field.prototype.setLabelEnabled = function(enable) {
  this.labelEnabled_ = enable;
};

/**
 * @return {boolean}
 */
npf.ui.form.Field.prototype.isLabelVisible = function() {
  return this.labelVisible_;
};

/**
 * @param {boolean} visible
 */
npf.ui.form.Field.prototype.setLabelVisible = function(visible) {
  if (this.isLabelEnabled() && this.isLabelVisible() != visible) {
    this.setLabelVisibleInternal(visible);
    this.applyLabelVisible(this.isLabelVisible());
  }
};

/**
 * @param {boolean} visible
 * @protected
 */
npf.ui.form.Field.prototype.setLabelVisibleInternal = function(visible) {
  this.labelVisible_ = visible;
};

/**
 * @param {boolean} visible
 * @protected
 */
npf.ui.form.Field.prototype.applyLabelVisible = function(visible) {
  this.getRenderer().setLabelVisible(this, visible);
};

/**
 * @return {string}
 */
npf.ui.form.Field.prototype.getName = function() {
  return this.name_;
};

/**
 * @return {string|Node|Array.<Node>|NodeList}
 */
npf.ui.form.Field.prototype.getNotice = function() {
  return this.notice_;
};

/**
 * @param {string|Node|Array.<Node>|NodeList} notice
 */
npf.ui.form.Field.prototype.setNotice = function(notice) {
  if (this.isNoticeEnabled()) {
    this.setNoticeInternal(notice);
    this.applyNotice(this.getNotice());
  }
};

/**
 * @param {string|Node|Array.<Node>|NodeList} notice
 */
npf.ui.form.Field.prototype.setNoticeInternal = function(notice) {
  this.notice_ = notice;
};

/**
 * @param {string|Node|Array.<Node>|NodeList} notice
 */
npf.ui.form.Field.prototype.applyNotice = function(notice) {
  this.getRenderer().setContent(this.getNoticeElement(), notice);
};

/**
 * @return {boolean}
 */
npf.ui.form.Field.prototype.isNoticeEnabled = function() {
  return this.noticeEnabled_;
};

/**
 * @param {boolean} enable
 */
npf.ui.form.Field.prototype.setNoticeEnabled = function(enable) {
  this.noticeEnabled_ = enable;
};

/**
 * @return {*}
 */
npf.ui.form.Field.prototype.getRequestValue = function() {
  return this.getValue();
};

/**
 * @return {*}
 */
npf.ui.form.Field.prototype.getValue = function() {
  return this.value_;
};

/**
 * @return {*}
 */
npf.ui.form.Field.prototype.getValueFromElement = function() {
  return this.getRenderer().getValue(this);
};

/**
 * @param {*} value
 * @param {boolean=} opt_noRender
 * @param {boolean=} opt_force
 */
npf.ui.form.Field.prototype.setValue = function(value, opt_noRender,
    opt_force) {
  var correctedValue = this.correctValue(value);

  if (opt_force || !this.equalsValue(correctedValue)) {
    this.setValueInternal(correctedValue);
    this.applyValue(this.getValue(), opt_noRender);
    this.onChange();
  }
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
 * @param {boolean=} opt_noRender
 * @protected
 */
npf.ui.form.Field.prototype.applyValue = function(value, opt_noRender) {
  if (!opt_noRender) {
    this.getRenderer().setValue(this, value);
  }

  if (this.isHiddenErrorOnChange()) {
    this.setError(false);
  }

  if (this.isLabelAsPlaceholder()) {
    this.setLabelVisible(this.isEmpty());
  }

  this.validate();
};

/**
 * @param {*} value
 * @return {*}
 * @protected
 */
npf.ui.form.Field.prototype.correctValue = function(value) {
  return value;
};

/**
 * @param {*} value
 * @return {boolean}
 */
npf.ui.form.Field.prototype.equalsValue = function(value) {
  return this.getValue() === value;
};

npf.ui.form.Field.prototype.validate = function() {
  /** @type {boolean} */
  var valid = goog.array.every(this.validators_, function(validator) {
    /** @type {boolean} */
    var valid = validator.isValid(this);

    if (!valid) {
      this.setErrorMessage(validator.getErrorMessage());
    }

    return valid;
  }, this);

  this.setValid(valid);
};

/**
 * @return {boolean}
 */
npf.ui.form.Field.prototype.isValid = function() {
  return this.valid_;
};

/**
 * @param {boolean} valid
 * @protected
 */
npf.ui.form.Field.prototype.setValid = function(valid) {
  if (this.valid_ != valid) {
    this.valid_ = valid;

    if (this.valid_) {
      this.onValid();
    } else {
      this.onError();
    }
  }
};

/**
 * @param {npf.ui.form.validation.Base} validator
 */
npf.ui.form.Field.prototype.addValidator = function(validator) {
  this.validators_.push(validator);
  this.applyValue(this.getValue());
};

npf.ui.form.Field.prototype.clearValidators = function() {
  this.validators_ = [];
  this.applyValue(this.getValue());
};

/**
 * @param {string} errorMessage
 * @param {RegExp} regExp
 */
npf.ui.form.Field.prototype.addRegExpValidator = function(errorMessage,
    regExp) {
  var validator = new npf.ui.form.validation.RegExp(errorMessage, regExp);
  this.addValidator(validator);
};

/**
 * @param {string} errorMessage
 */
npf.ui.form.Field.prototype.addRequiredValidator = function(errorMessage) {
  var validator = new npf.ui.form.validation.Required(errorMessage);
  this.addValidator(validator);
};

/**
 * @protected
 */
npf.ui.form.Field.prototype.onChange = function() {
  var event = new npf.ui.form.FieldEvent(
    npf.ui.form.EventType.CHANGE, this.getName(), this.getValue());
  this.dispatchEvent(event);
};

/**
 * @protected
 */
npf.ui.form.Field.prototype.onError = function() {
  var event = new npf.ui.form.FieldEvent(
    npf.ui.form.EventType.ERROR, this.getName(), this.getValue());
  this.dispatchEvent(event);
};

/**
 * @protected
 */
npf.ui.form.Field.prototype.onValid = function() {
  var event = new npf.ui.form.FieldEvent(
    npf.ui.form.EventType.VALID, this.getName(), this.getValue());
  this.dispatchEvent(event);
};

/**
 * @return {Element}
 */
npf.ui.form.Field.prototype.getErrorMessageElement = function() {
  return this.getRenderer().getErrorMessageElement(this.getElement());
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
npf.ui.form.Field.prototype.getValueElement = function() {
  return this.getRenderer().getValueElement(this.getElement());
};


/**
 * @param {npf.ui.form.EventType} type
 * @param {string} name
 * @param {*} value
 * @constructor
 * @extends {goog.events.Event}
 */
npf.ui.form.FieldEvent = function(type, name, value) {
  goog.base(this, type);

  /**
   * @type {string}
   */
  this.name = name;

  /**
   * @type {*}
   */
  this.value = value;
};
goog.inherits(npf.ui.form.FieldEvent, goog.events.Event);
