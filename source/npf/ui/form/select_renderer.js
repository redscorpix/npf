goog.provide('npf.ui.form.SelectRenderer');

goog.require('goog.array');
goog.require('goog.dom.TagName');
goog.require('goog.dom.forms');
goog.require('npf.ui.form.FieldRenderer');


/**
 * @constructor
 * @struct
 * @extends {npf.ui.form.FieldRenderer}
 */
npf.ui.form.SelectRenderer = function() {
  npf.ui.form.SelectRenderer.base(this, 'constructor');
};
goog.inherits(npf.ui.form.SelectRenderer, npf.ui.form.FieldRenderer);
goog.addSingletonGetter(npf.ui.form.SelectRenderer);


/**
 * @type {string}
 */
npf.ui.form.SelectRenderer.CSS_CLASS = goog.getCssName('npf-form-select');


/** @inheritDoc */
npf.ui.form.SelectRenderer.prototype.appendContent = function(component,
    element) {
  var field = /** @type {npf.ui.form.Select} */ (component);
  /** @type {goog.dom.DomHelper} */
  var domHelper = component.getDomHelper();
  /** @type {!Element} */
  var valueElement = domHelper.createDom(goog.dom.TagName.SELECT, {
    'class': this.getValueCssClass(),
    'name': field.getName()
  });
  domHelper.appendChild(this.getContentElement(element), valueElement);

  if (field.isLabelEnabled()) {
    this.bindLabel(this.getLabelElement(element), valueElement);
  }
};

/**
 * @param {npf.ui.form.Select} component
 * @param {Array.<npf.ui.form.Select.Item>} items
 */
npf.ui.form.SelectRenderer.prototype.setItems = function(component, items) {
  /** @type {Element} */
  var valueElement = component.getValueElement();

  if (valueElement) {
    /** @type {!Array.<string>} */
    var htmlOptions = goog.array.map(items, function(item) {
      return this.getOptionHtml_(item.value, item.label);
    }, this);
    valueElement.innerHTML = htmlOptions.join('');
    goog.dom.forms.setValue(valueElement, component.getValue());
  }
};

/**
 * @param {string} value
 * @param {string} label
 * @return {string}
 * @private
 */
npf.ui.form.SelectRenderer.prototype.getOptionHtml_ = function(value, label) {
  return '<option value="' + value + '">' + label + '</option>';
};

/**
 * @return {string}
 */
npf.ui.form.SelectRenderer.prototype.getFieldCssClass = function() {
  return npf.ui.form.SelectRenderer.CSS_CLASS;
};
