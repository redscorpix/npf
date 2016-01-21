goog.provide('npf.ui.form.Textarea');

goog.require('goog.events.InputHandler');
goog.require('goog.events.InputHandler.EventType');
goog.require('goog.string');
goog.require('npf.ui.form.Field');
goog.require('npf.ui.form.TextareaRenderer');


/**
 * @param {string} name
 * @param {npf.ui.form.TextareaRenderer=} opt_renderer
 * @param {goog.dom.DomHelper=} opt_domHelper
 * @constructor
 * @struct
 * @extends {npf.ui.form.Field}
 */
npf.ui.form.Textarea = function(name, opt_renderer, opt_domHelper) {
  /** @type {!npf.ui.form.TextareaRenderer} */
  var renderer = opt_renderer || npf.ui.form.TextareaRenderer.getInstance();
  npf.ui.form.Textarea.base(this, 'constructor', name, renderer, opt_domHelper);

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
goog.inherits(npf.ui.form.Textarea, npf.ui.form.Field);


/** @inheritDoc */
npf.ui.form.Textarea.prototype.enterDocument = function() {
  npf.ui.form.Textarea.base(this, 'enterDocument');

  var inputHandler = new goog.events.InputHandler(this.getValueElement());
  this.disposeOnExitDocument(inputHandler);

  this.getHandler().listen(inputHandler,
    goog.events.InputHandler.EventType.INPUT, this.onInput);
};

/** @inheritDoc */
npf.ui.form.Textarea.prototype.initializeInternal = function() {
  npf.ui.form.Textarea.base(this, 'initializeInternal');

  this.applyMaxLength(this.getMaxLength());
};

/**
 * @return {string}
 * @override
 */
npf.ui.form.Textarea.prototype.getValue = function() {
  return /** @type {string} */ (npf.ui.form.Textarea.base(this, 'getValue'));
};

/** @inheritDoc */
npf.ui.form.Textarea.prototype.setValue = function(value, opt_noRender,
    opt_force) {
  if (!goog.isString(value)) {
    throw Error(npf.ui.form.Field.Error.TYPE_INVALID);
  }

  npf.ui.form.Textarea.base(this, 'setValue', value, opt_noRender, opt_force);
};

/** @inheritDoc */
npf.ui.form.Textarea.prototype.correctValue = function(value) {
  if (this.isTrimedValue()) {
    return goog.string.trim(/** @type {string} */ (value));
  }

  return value;
};

/** @inheritDoc */
npf.ui.form.Textarea.prototype.isEmpty = function() {
  return !this.getValue();
};

/**
 * @return {number}
 */
npf.ui.form.Textarea.prototype.getMaxLength = function() {
  return this.maxLength_;
};

/**
 * @param {number} maxLength
 */
npf.ui.form.Textarea.prototype.setMaxLength = function(maxLength) {
  if (this.getMaxLength() != maxLength) {
    this.setMaxLengthInternal(maxLength);
    this.applyMaxLength(this.getMaxLength());
  }
};

/**
 * @param {number} maxLength
 * @protected
 */
npf.ui.form.Textarea.prototype.setMaxLengthInternal = function(maxLength) {
  this.maxLength_ = maxLength;
};

/**
 * @param {number} maxLength
 * @protected
 */
npf.ui.form.Textarea.prototype.applyMaxLength = function(maxLength) {
  var renderer = /** @type {npf.ui.form.TextareaRenderer} */ (
    this.getRenderer());
  renderer.setMaxLength(this.getValueElement(), maxLength);
};

/**
 * @return {boolean}
 */
npf.ui.form.Textarea.prototype.isTrimedValue = function() {
  return this.trimedValue_;
};

/**
 * @param {boolean} trim
 */
npf.ui.form.Textarea.prototype.setTrimedValue = function(trim) {
  this.trimedValue_ = trim;
};

/**
 * @param {goog.events.BrowserEvent} evt
 * @protected
 */
npf.ui.form.Textarea.prototype.onInput = function(evt) {
  var value = this.getValueFromElement();

  if (-1 < this.maxLength_) {
    value = value.substr(0, this.maxLength_);
  }

  this.setValue(value, true);
};
