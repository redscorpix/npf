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
 * @extends {npf.ui.form.Field}
 */
npf.ui.form.Textarea = function(name, opt_renderer, opt_domHelper) {
  goog.base(this, name, opt_renderer ||
    npf.ui.form.TextareaRenderer.getInstance(), opt_domHelper);

  this.addClassName(this.getRenderer().getFieldCssClass());
  this.setValue('');
};
goog.inherits(npf.ui.form.Textarea, npf.ui.form.Field);


/**
 * @private {boolean}
 */
npf.ui.form.Textarea.prototype.trimedValue_ = true;


/** @inheritDoc */
npf.ui.form.Textarea.prototype.enterDocument = function() {
  goog.base(this, 'enterDocument');

  var inputHandler = new goog.events.InputHandler(this.getValueElement());
  this.disposeOnExitDocument(inputHandler);

  this.getHandler(inputHandler,
    goog.events.InputHandler.EventType.INPUT, this.onInput_);
};

/**
 * @return {string}
 * @override
 */
npf.ui.form.Textarea.prototype.getValue = function() {
  return /** @type {string} */ (goog.base(this, 'getValue'));
};

/** @inheritDoc */
npf.ui.form.Field.prototype.correctValue = function(value) {
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
 * @private
 */
npf.ui.form.Textarea.prototype.onInput_ = function(evt) {
  this.onInput();
};

/**
 * @protected
 */
npf.ui.form.Textarea.prototype.onInput = function() {
  var value = this.getValueFromElement();
  this.setValue(value, true);
};
