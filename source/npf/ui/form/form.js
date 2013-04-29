goog.provide('npf.ui.Form');

goog.require('goog.events');
goog.require('goog.object');
goog.require('npf.ui.StatedComponent');
goog.require('npf.ui.form.EventType');
goog.require('npf.ui.form.Field');
goog.require('npf.ui.form.Renderer');
goog.require('npf.ui.form.SubmitButton');


/**
 * @param {npf.ui.form.Renderer=} opt_renderer Renderer used to render or
 *                                             decorate the component.
 * @param {goog.dom.DomHelper=} opt_domHelper DOM helper, used for document
 *                                            interaction.
 * @constructor
 * @extends {npf.ui.StatedComponent}
 */
npf.ui.Form = function(opt_renderer, opt_domHelper) {
  goog.base(this, opt_renderer || npf.ui.form.Renderer.getInstance(),
    opt_domHelper);

  this.fieldsMap_ = {};
};
goog.inherits(npf.ui.Form, npf.ui.StatedComponent);


/**
 * @type {Object.<string,npf.ui.form.Field>}
 * @private
 */
npf.ui.Form.prototype.fieldsMap_;

/**
 * @type {npf.ui.form.SubmitButton}
 * @private
 */
npf.ui.Form.prototype.submitButton_ = null;

/**
 * @type {boolean}
 * @private
 */
npf.ui.Form.prototype.prevented_ = true;


/** @inheritDoc */
npf.ui.Form.prototype.enterDocument = function() {
  goog.base(this, 'enterDocument');

  this.getHandler()
    .listen(this.getElement(), goog.events.EventType.SUBMIT, this.onSubmit_);
};

/** @inheritDoc */
npf.ui.Form.prototype.disposeInternal = function() {
  goog.base(this, 'disposeInternal');

  this.fieldsMap_ = null;
  this.submitButton_ = null;
};

/** @inheritDoc */
npf.ui.Form.prototype.addChildAt = function(child, index, opt_render) {
  goog.base(this, 'addChildAt', child, index, opt_render);

  if (child instanceof npf.ui.form.Field) {
    goog.object.add(this.fieldsMap_, child.getName(), child);
  }
};

/** @inheritDoc */
npf.ui.Form.prototype.removeChild = function(child, opt_unrender) {
  if (child) {
    var id = goog.isString(child) ? child : child.getId();
    child = this.getChild(id);

    if (child && child instanceof npf.ui.form.Field) {
      goog.object.remove(this.fieldsMap_, child.getName());
    }
  }

  return goog.base(this, 'removeChild', child, opt_unrender);
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
  this.dispatchEvent(npf.ui.form.EventType.SUBMIT);
};

/**
 * @protected
 */
npf.ui.Form.prototype.onSubmit = function() {
};

/**
 * @return {boolean}
 */
npf.ui.Form.prototype.hasErrors = function() {
  return !goog.object.every(this.fieldsMap_, function(field) {
    return !field.hasError();
  }, this);
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
npf.ui.Form.prototype.getValue = function(name) {
  /** @type {npf.ui.form.Field|undefined} */
  var field = this.fieldsMap_[name];

  return field ? field.getValue() : undefined;
};

/**
 * @param {string} name
 * @return {string}
 */
npf.ui.Form.prototype.getRequestValue = function(name) {
  /** @type {npf.ui.form.Field|undefined} */
  var field = this.fieldsMap_[name];

  return field ? field.getRequestValue() : '';
};

/**
 * @param {string} name
 * @return {npf.ui.form.Field}
 */
npf.ui.Form.prototype.getField = function(name) {
  return this.fieldsMap_[name] || null;
};

/**
 * @return {npf.ui.form.SubmitButton}
 */
npf.ui.Form.prototype.getSubmitButton = function() {
  return this.submitButton_;
};

/**
 * @param {npf.ui.form.SubmitButton} submitButton
 */
npf.ui.Form.prototype.setSubmitButton = function(submitButton) {
  this.submitButton_ = submitButton;
};

/**
 * @return {boolean}
 */
npf.ui.Form.prototype.isSubmitEnabled = function() {
  return !!this.submitButton_ && this.submitButton_.isEnabled();
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
 * @param {Function} f
 * @param {Object=} opt_obj
 */
npf.ui.Form.prototype.forEachField = function(f, opt_obj) {
  var index = 0;

  this.forEachChild(function(child) {
    if (child instanceof npf.ui.form.Field) {
      f.call(opt_obj, child, index++);
    }
  }, this);
};
