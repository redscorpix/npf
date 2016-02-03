goog.provide('npf.ui.form.Checkbox');
goog.provide('npf.ui.form.Checkbox.Item');

goog.require('goog.dom.InputType');
goog.require('goog.events.EventType');
goog.require('npf.ui.form.Field');
goog.require('npf.ui.form.CheckboxRenderer');


/**
 * @param {string} name
 * @param {npf.ui.form.CheckboxRenderer=} opt_renderer
 * @param {goog.dom.DomHelper=} opt_domHelper
 * @constructor
 * @struct
 * @extends {npf.ui.form.Field}
 */
npf.ui.form.Checkbox = function(name, opt_renderer, opt_domHelper) {
  /** @type {!npf.ui.form.CheckboxRenderer} */
  var renderer = opt_renderer || npf.ui.form.CheckboxRenderer.getInstance();

  npf.ui.form.Checkbox.base(
    this, 'constructor', name, renderer, opt_domHelper);

  this.addClassName(renderer.getFieldCssClass());
};
goog.inherits(npf.ui.form.Checkbox, npf.ui.form.Field);


/** @inheritDoc */
npf.ui.form.Checkbox.prototype.enterDocument = function() {
  npf.ui.form.Checkbox.base(this, 'enterDocument');

  this.getHandler().
    listen(this.getValueElement(), goog.events.EventType.CHANGE,
      this._onChange);
};

/**
 * @return {boolean}
 * @override
 */
npf.ui.form.Checkbox.prototype.getRequestValue = function() {
  return /** @type {boolean} */ (
    npf.ui.form.Checkbox.base(this, 'getRequestValue'));
};

/**
 * @return {boolean}
 * @override
 */
npf.ui.form.Checkbox.prototype.getValue = function() {
  return /** @type {boolean} */ (npf.ui.form.Checkbox.base(this, 'getValue'));
};

/** @inheritDoc */
npf.ui.form.Checkbox.prototype.setValue = function(value, opt_noRender,
    opt_force) {
  if (!goog.isBoolean(value)) {
    throw Error(npf.ui.form.Field.Error.TYPE_INVALID);
  }

  npf.ui.form.Checkbox.base(this, 'setValue', value, opt_noRender, opt_force);
};

/**
 * @param {goog.events.BrowserEvent} evt
 * @private
 */
npf.ui.form.Checkbox.prototype._onChange = function(evt) {
  var element = /** @type {Element} */ (evt.target);

  if (
    element instanceof HTMLInputElement &&
    goog.dom.InputType.CHECKBOX == element.type.toLowerCase()
  ) {
    this.setValue(element.checked);
  }
};
