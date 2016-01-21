goog.provide('npf.ui.form.Select');
goog.provide('npf.ui.form.Select.Item');

goog.require('npf.ui.form.Field');
goog.require('npf.ui.form.SelectRenderer');


/**
 * @param {string} name
 * @param {npf.ui.form.SelectRenderer=} opt_renderer
 * @param {goog.dom.DomHelper=} opt_domHelper
 * @constructor
 * @struct
 * @extends {npf.ui.form.Field}
 */
npf.ui.form.Select = function(name, opt_renderer, opt_domHelper) {
  /** @type {!npf.ui.form.SelectRenderer} */
  var renderer = opt_renderer || npf.ui.form.SelectRenderer.getInstance();

  npf.ui.form.Select.base(this, 'constructor', name, renderer, opt_domHelper);

  /**
   * @private {Array.<npf.ui.form.Select.Item>}
   */
  this.items_ = [];

  this.addClassName(renderer.getFieldCssClass());
};
goog.inherits(npf.ui.form.Select, npf.ui.form.Field);


/**
 * @typedef {{
 *  value: string,
 *  label: string
 * }}
 */
npf.ui.form.Select.Item;


/** @inheritDoc */
npf.ui.form.Select.prototype.disposeInternal = function() {
  npf.ui.form.Select.base(this, 'disposeInternal');

  this.items_ = null;
};

/**
 * @return {string}
 * @override
 */
npf.ui.form.Select.prototype.getValue = function() {
  return /** @type {string} */ (npf.ui.form.Select.base(this, 'getValue'));
};

/** @inheritDoc */
npf.ui.form.Select.prototype.setValue = function(value, opt_noRender,
    opt_force) {
  if (!goog.isString(value)) {
    throw Error(npf.ui.form.Field.Error.TYPE_INVALID);
  }

  npf.ui.form.Select.base(this, 'setValue', value, opt_noRender, opt_force);
};

/** @inheritDoc */
npf.ui.form.Select.prototype.isEmpty = function() {
  return !this.getValue();
};

/** @inheritDoc */
npf.ui.form.Select.prototype.initializeInternal = function() {
  npf.ui.form.Select.base(this, 'initializeInternal');

  this.applyItems(this.getItems());
};

/**
 * @return {Array.<npf.ui.form.Select.Item>}
 */
npf.ui.form.Select.prototype.getItems = function() {
  return this.items_;
};

/**
 * @param {Array.<npf.ui.form.Select.Item>} items
 */
npf.ui.form.Select.prototype.setItems = function(items) {
  this.setItemsInternal(items);
  this.applyItems(items);
};

/**
 * @param {Array.<npf.ui.form.Select.Item>} items
 * @protected
 */
npf.ui.form.Select.prototype.setItemsInternal = function(items) {
  this.items_ = items || [];
};

/**
 * @param {Array.<npf.ui.form.Select.Item>} items
 * @protected
 */
npf.ui.form.Select.prototype.applyItems = function(items) {
  var renderer = /** @type {npf.ui.form.SelectRenderer} */ (this.getRenderer());
  renderer.setItems(this, items);
};
