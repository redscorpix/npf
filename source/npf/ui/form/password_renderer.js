goog.provide('npf.ui.form.PasswordRenderer');

goog.require('goog.dom.InputType');
goog.require('goog.dom.TagName');
goog.require('npf.ui.form.TextRenderer');


/**
 * @constructor
 * @struct
 * @extends {npf.ui.form.TextRenderer}
 */
npf.ui.form.PasswordRenderer = function() {
  npf.ui.form.PasswordRenderer.base(this, 'constructor');
};
goog.inherits(npf.ui.form.PasswordRenderer, npf.ui.form.TextRenderer);
goog.addSingletonGetter(npf.ui.form.PasswordRenderer);


/**
 * @type {string}
 */
npf.ui.form.PasswordRenderer.CSS_CLASS = goog.getCssName('npf-form-password');


/** @inheritDoc */
npf.ui.form.PasswordRenderer.prototype.appendContent = function(component,
    element) {
  /** @type {goog.dom.DomHelper} */
  var domHelper = component.getDomHelper();
  /** @type {!Element} */
  var valueElement = domHelper.createDom(goog.dom.TagName.INPUT, {
    'class': this.getValueCssClass(),
    'name': component.getName(),
    'type': goog.dom.InputType.PASSWORD
  });
  domHelper.appendChild(this.getContentElement(element), valueElement);

  if (component.isLabelEnabled()) {
    this.bindLabel(this.getLabelElement(element), valueElement);
  }
};

/**
 * @return {string}
 */
npf.ui.form.PasswordRenderer.prototype.getFieldCssClass = function() {
  return npf.ui.form.PasswordRenderer.CSS_CLASS;
};
