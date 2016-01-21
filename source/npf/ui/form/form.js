goog.provide('npf.ui.Form');

goog.require('goog.events.EventType');
goog.require('goog.object');
goog.require('goog.ui.Component.State');
goog.require('goog.ui.Control');
goog.require('npf.ui.StatedComponent');
goog.require('npf.ui.form.EventType');
goog.require('npf.ui.form.Field');
goog.require('npf.ui.form.Renderer');
goog.require('npf.ui.form.SubmitButton');


/**
 * @param {npf.ui.form.Renderer=} opt_renderer
 * @param {goog.dom.DomHelper=} opt_domHelper
 * @constructor
 * @struct
 * @extends {npf.ui.StatedComponent}
 */
npf.ui.Form = function(opt_renderer, opt_domHelper) {
  npf.ui.Form.base(this, 'constructor', opt_renderer ||
    npf.ui.form.Renderer.getInstance(), opt_domHelper);

  /**
   * @private {Object.<npf.ui.form.Field>}
   */
  this.fieldsMap_ = {};

  /**
   * @private {boolean}
   */
  this.prevented_ = true;

  /**
   * @type {goog.ui.Control|npf.ui.StatedComponent|npf.ui.form.SubmitButton}
   * @private
   */
  this.submitButton_ = null;

  this.setAllowTextSelection(true);
  this.setSupportedState(goog.ui.Component.State.DISABLED, true);
};
goog.inherits(npf.ui.Form, npf.ui.StatedComponent);


/** @inheritDoc */
npf.ui.Form.prototype.enterDocument = function() {
  npf.ui.Form.base(this, 'enterDocument');

  this.getHandler().
    listen(this.getElement(), goog.events.EventType.SUBMIT, this.onSubmit_);
};

/** @inheritDoc */
npf.ui.Form.prototype.disposeInternal = function() {
  this.setSubmitButton(null);

  npf.ui.Form.base(this, 'disposeInternal');

  this.fieldsMap_ = null;
};

npf.ui.Form.prototype.submit = function() {
  if (this.getElement()) {
    this.onSubmit();
  }
};

/** @inheritDoc */
npf.ui.Form.prototype.setState = function(state, enable, opt_calledFrom) {
  npf.ui.Form.base(this, 'setState', state, enable, opt_calledFrom);

  if (goog.ui.Component.State.DISABLED == state) {
    this.forEachField(function(field) {
      field.setEnabled(!enable);
    });

    if (this.submitButton_ && this.submitButton_.setEnabled) {
      this.submitButton_.setEnabled(!enable);
    }
  }
};

/**
 * @return {boolean}
 */
npf.ui.Form.prototype.hasErrors = function() {
  return !goog.object.every(this.fieldsMap_, function(field) {
    return !field.isError();
  }, this);
};

/**
 * @param {npf.ui.form.Field} field
 */
npf.ui.Form.prototype.addField = function(field) {
  goog.object.set(this.fieldsMap_, field.getName(), field);
  field.setEnabled(this.isEnabled());
};

/**
 * @param {string} name
 * @return {npf.ui.form.Field}
 */
npf.ui.Form.prototype.getField = function(name) {
  return this.fieldsMap_[name] || null;
};

/**
 * @param {npf.ui.form.Field} field
 */
npf.ui.Form.prototype.removeField = function(field) {
  goog.object.remove(this.fieldsMap_, field.getName());
};

/**
 * @return {boolean}
 */
npf.ui.Form.prototype.isPrevented = function() {
  return this.prevented_;
};

/**
 * @param {boolean} prevent
 */
npf.ui.Form.prototype.setPrevented = function(prevent) {
  this.prevented_ = prevent;
};

/**
 * @return {!Object}
 */
npf.ui.Form.prototype.getRequestData = function() {
  /** @type {!Object} */
  var result = {};

  goog.object.forEach(this.fieldsMap_, function(field) {
    result[field.getName()] = field.getRequestValue();
  }, this);

  return result;
};

/**
 * @param {string} name
 * @return {*}
 */
npf.ui.Form.prototype.getRequestValue = function(name) {
  /** @type {npf.ui.form.Field|undefined} */
  var field = this.fieldsMap_[name];

  return field ? field.getRequestValue() : undefined;
};

/**
 * @return {boolean}
 */
npf.ui.Form.prototype.isSubmitEnabled = function() {
  return !!this.submitButton_ && this.submitButton_.isEnabled();
};

/**
 * @return {goog.ui.Control|npf.ui.StatedComponent|npf.ui.form.SubmitButton}
 */
npf.ui.Form.prototype.getSubmitButton = function() {
  return this.submitButton_;
};

/**
 * @param {goog.ui.Control|npf.ui.StatedComponent|npf.ui.form.SubmitButton}
 *    submitButton
 */
npf.ui.Form.prototype.setSubmitButton = function(submitButton) {
  this.submitButton_ = submitButton;
};

/**
 * @param {boolean} enable
 */
npf.ui.Form.prototype.setSubmitButtonEnabled = function(enable) {
  if (this.submitButton_) {
    this.submitButton_.setEnabled(enable);
  }
};

/**
 * @return {boolean}
 */
npf.ui.Form.prototype.isValid = function() {
  return goog.object.every(this.fieldsMap_, function(field) {
    return field.isValid();
  }, this);
};

/**
 * @param {string} name
 * @return {*}
 */
npf.ui.Form.prototype.getValue = function(name) {
  /** @type {npf.ui.form.Field|undefined} */
  var field = this.fieldsMap_[name];

  return field ? field.getValue() : undefined;
};

/**
 * @param {function(this:T,npf.ui.form.Field,number):?} f
 * @param {T=} opt_obj
 * @template T
 */
npf.ui.Form.prototype.forEachField = function(f, opt_obj) {
  /** @type {number} */
  var index = 0;

  goog.object.forEach(this.fieldsMap_, function(field) {
    f.call(opt_obj, field, index++);
  });
};

/**
 * @param {goog.events.BrowserEvent} evt
 * @private
 */
npf.ui.Form.prototype.onSubmit_ = function(evt) {
  if (this.prevented_ && evt) {
    evt.preventDefault();
  }

  this.onSubmit();
};

/**
 * @protected
 */
npf.ui.Form.prototype.onSubmit = function() {
  this.dispatchEvent(npf.ui.form.EventType.SUBMIT);
};
