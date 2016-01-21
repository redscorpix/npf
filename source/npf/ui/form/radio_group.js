goog.provide('npf.ui.form.RadioGroup');
goog.provide('npf.ui.form.RadioGroup.Item');

goog.require('goog.dom.InputType');
goog.require('goog.events.EventType');
goog.require('npf.ui.form.Field');
goog.require('npf.ui.form.RadioGroupRenderer');


/**
 * @param {string} name
 * @param {npf.ui.form.RadioGroupRenderer=} opt_renderer
 * @param {goog.dom.DomHelper=} opt_domHelper
 * @constructor
 * @struct
 * @extends {npf.ui.form.Field}
 */
npf.ui.form.RadioGroup = function(name, opt_renderer, opt_domHelper) {
  /** @type {!npf.ui.form.RadioGroupRenderer} */
  var renderer = opt_renderer || npf.ui.form.RadioGroupRenderer.getInstance();

  npf.ui.form.RadioGroup.base(
    this, 'constructor', name, renderer, opt_domHelper);

  /**
   * @private {Array.<npf.ui.form.RadioGroup.Item>}
   */
  this.items_ = [];

  this.addClassName(renderer.getFieldCssClass());
};
goog.inherits(npf.ui.form.RadioGroup, npf.ui.form.Field);


/**
 * @typedef {{
 *  value: string,
 *  label: string
 * }}
 */
npf.ui.form.RadioGroup.Item;


/** @inheritDoc */
npf.ui.form.RadioGroup.prototype.enterDocument = function() {
  npf.ui.form.RadioGroup.base(this, 'enterDocument');

  this.getHandler().
    listen(this.getContentElement(), goog.events.EventType.CHANGE,
      this._onChange);
};

/** @inheritDoc */
npf.ui.form.RadioGroup.prototype.disposeInternal = function() {
  npf.ui.form.RadioGroup.base(this, 'disposeInternal');

  this.items_ = null;
};

/**
 * @return {string}
 * @override
 */
npf.ui.form.RadioGroup.prototype.getValue = function() {
  return /** @type {string} */ (npf.ui.form.RadioGroup.base(this, 'getValue'));
};

/** @inheritDoc */
npf.ui.form.RadioGroup.prototype.setValue = function(value, opt_noRender,
    opt_force) {
  if (!goog.isString(value)) {
    throw Error(npf.ui.form.Field.Error.TYPE_INVALID);
  }

  npf.ui.form.RadioGroup.base(this, 'setValue', value, opt_noRender, opt_force);
};

/** @inheritDoc */
npf.ui.form.RadioGroup.prototype.isEmpty = function() {
  return !this.getValue();
};

/** @inheritDoc */
npf.ui.form.RadioGroup.prototype.initializeInternal = function() {
  npf.ui.form.RadioGroup.base(this, 'initializeInternal');

  this.applyItems(this.getItems());
};

/**
 * @return {Array.<npf.ui.form.RadioGroup.Item>}
 */
npf.ui.form.RadioGroup.prototype.getItems = function() {
  return this.items_;
};

/**
 * @param {Array.<npf.ui.form.RadioGroup.Item>} items
 */
npf.ui.form.RadioGroup.prototype.setItems = function(items) {
  this.setItemsInternal(items);
  this.applyItems(items);
};

/**
 * @param {Array.<npf.ui.form.RadioGroup.Item>} items
 * @protected
 */
npf.ui.form.RadioGroup.prototype.setItemsInternal = function(items) {
  this.items_ = items || [];
};

/**
 * @param {Array.<npf.ui.form.RadioGroup.Item>} items
 * @protected
 */
npf.ui.form.RadioGroup.prototype.applyItems = function(items) {
  var renderer = /** @type {npf.ui.form.RadioGroupRenderer} */ (
    this.getRenderer());
  renderer.setItems(this, items);
};

/**
 * @param {goog.events.BrowserEvent} evt
 * @private
 */
npf.ui.form.RadioGroup.prototype._onChange = function(evt) {
  var element = /** @type {Element} */ (evt.target);

  if (
    element instanceof HTMLInputElement &&
    goog.dom.InputType.RADIO == element.type.toLowerCase()
  ) {
    this.setValue(element.value);
  }
};
