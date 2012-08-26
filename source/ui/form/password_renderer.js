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
 * @param {npf.ui.form.Password} component
 * @param {Element} element
 * @protected
 */
npf.ui.form.PasswordRenderer.prototype.appendFieldElement = function(component,
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
