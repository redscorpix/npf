goog.provide('npf.ui.form.CheckboxRenderer');

goog.require('goog.dom.InputType');
goog.require('goog.dom.TagName');
goog.require('npf.ui.form.FieldRenderer');


/**
 * @constructor
 * @struct
 * @extends {npf.ui.form.FieldRenderer}
 */
npf.ui.form.CheckboxRenderer = function() {
  npf.ui.form.CheckboxRenderer.base(this, 'constructor');
};
goog.inherits(npf.ui.form.CheckboxRenderer, npf.ui.form.FieldRenderer);
goog.addSingletonGetter(npf.ui.form.CheckboxRenderer);


/**
 * @type {string}
 */
npf.ui.form.CheckboxRenderer.CSS_CLASS = goog.getCssName('npf-form-checkbox');


/** @inheritDoc */
npf.ui.form.CheckboxRenderer.prototype.appendContent = function(component,
    element) {
  var field = /** @type {npf.ui.form.Checkbox} */ (component);
  var properties = {
    'class': this.getValueCssClass(),
    'name': field.getName(),
    'type': goog.dom.InputType.CHECKBOX,
    'value': '1'
  };

  /** @type {goog.dom.DomHelper} */
  var domHelper = field.getDomHelper();
  /** @type {!Element} */
  var valueElement = domHelper.createDom(goog.dom.TagName.INPUT, properties);
  domHelper.appendChild(this.getContentElement(element), valueElement);

  if (field.isLabelEnabled()) {
    this.bindLabel(this.getLabelElement(element), valueElement);
  }
};

/** @inheritDoc */
npf.ui.form.CheckboxRenderer.prototype.getValue = function(component) {
  var element = /** @type {HTMLInputElement} */ (component.getValueElement());

  return element ? !!element.checked : null;
};

/** @inheritDoc */
npf.ui.form.CheckboxRenderer.prototype.setValue = function(component, value) {
  /** @type {Element} */
  var element = component.getValueElement();

  if (element) {
    element.checked = !!value;
  }
};

/**
 * @return {string}
 */
npf.ui.form.CheckboxRenderer.prototype.getFieldCssClass = function() {
  return npf.ui.form.CheckboxRenderer.CSS_CLASS;
};
