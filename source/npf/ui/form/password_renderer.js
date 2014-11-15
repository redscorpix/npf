goog.provide('npf.ui.form.PasswordRenderer');

goog.require('goog.dom');
goog.require('goog.dom.TagName');
goog.require('npf.ui.form.TextRenderer');


/**
 * @constructor
 * @extends {npf.ui.form.TextRenderer}
 */
npf.ui.form.PasswordRenderer = function() {
  goog.base(this);
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
  /** @type {!Element} */
  var valueElement = component.getDomHelper().createDom(
    goog.dom.TagName.INPUT, {
      'class': this.getValueCssClass(),
      'name': component.getName(),
      'type': 'password'
    });
  goog.dom.appendChild(this.getContentElement(element), valueElement);
};

/**
 * @return {string}
 */
npf.ui.form.PasswordRenderer.prototype.getFieldCssClass = function() {
  return npf.ui.form.PasswordRenderer.CSS_CLASS;
};
