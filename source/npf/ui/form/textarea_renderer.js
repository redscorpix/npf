goog.provide('npf.ui.form.TextareaRenderer');

goog.require('goog.dom');
goog.require('goog.dom.TagName');
goog.require('goog.dom.forms');
goog.require('npf.ui.form.FieldRenderer');


/**
 * @constructor
 * @extends {npf.ui.form.FieldRenderer}
 */
npf.ui.form.TextareaRenderer = function() {
  goog.base(this);
};
goog.inherits(npf.ui.form.TextareaRenderer, npf.ui.form.FieldRenderer);
goog.addSingletonGetter(npf.ui.form.TextareaRenderer);


/**
 * @type {string}
 */
npf.ui.form.TextareaRenderer.CSS_CLASS = goog.getCssName('npf-form-textarea');


/** @inheritDoc */
npf.ui.form.TextareaRenderer.prototype.appendContent = function(component,
    element) {
  var properties = {
    'class': this.getValueCssClass(),
    'name': component.getName()
  };

  /** @type {!Element} */
  var valueElement = component.getDomHelper().createDom(
    goog.dom.TagName.TEXTAREA, properties);
  goog.dom.forms.setValue(valueElement, component.getValue());
  goog.dom.appendChild(this.getContentElement(element), valueElement);

  if (component.isLabelEnabled()) {
    this.bindLabel(this.getLabelElement(element), valueElement);
  }
};

/**
 * @return {string}
 */
npf.ui.form.TextareaRenderer.prototype.getFieldCssClass = function() {
  return npf.ui.form.TextareaRenderer.CSS_CLASS;
};
