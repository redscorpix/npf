goog.provide('npf.ui.form.TextRenderer');

goog.require('goog.dom');
goog.require('goog.dom.TagName');
goog.require('npf.ui.form.FieldRenderer');


/**
 * @constructor
 * @extends {npf.ui.form.FieldRenderer}
 */
npf.ui.form.TextRenderer = function() {
  goog.base(this);
};
goog.inherits(npf.ui.form.TextRenderer, npf.ui.form.FieldRenderer);
goog.addSingletonGetter(npf.ui.form.TextRenderer);


/**
 * @param {npf.ui.form.Text} component
 * @return {!Element}
 */
npf.ui.form.TextRenderer.prototype.createDom = function(component) {
  /** @type {!Element} */
  var element = goog.base(this, 'createDom', component);

  this.appendValueElement(component, element);

  return element;
};

/**
 * @param {npf.ui.form.Text} component
 * @param {Element} element
 * @protected
 */
npf.ui.form.TextRenderer.prototype.appendValueElement = function(component,
                                                                 element) {
  var properties = {
    'class': this.getValueCssClass(),
    'name': component.getName(),
    'type': 'text',
    'value': component.getValue()
  };

  if (!component.isAutoComplete()) {
    properties['autocomplete'] = 'off';
  }

  /** @type {!Element} */
  var valueElement = component.getDomHelper().createDom(
    goog.dom.TagName.INPUT, properties);
  goog.dom.appendChild(this.getContentElement(element), valueElement);
};

/**
 * @param {Element} element
 * @param {boolean} enable
 */
npf.ui.form.TextRenderer.prototype.setAutoComplete = function(element, enable) {
  if (element) {
    if (enable) {
      element.removeAttribute('autocomplete');
    } else {
      element.setAttribute('autocomplete', 'off');
    }
  }
};

/**
 * @param {Element} element
 * @param {number} maxLength
 */
npf.ui.form.TextRenderer.prototype.setMaxLength = function(element, maxLength) {
  if (element) {
    if (maxLength) {
      element.setAttribute('maxlength', maxLength);
    } else {
      element.removeAttribute('maxlength');
    }
  }
};

/**
 * @return {string}
 */
npf.ui.form.TextRenderer.prototype.getTextCssClass = function() {
  return goog.getCssName(this.getStructuralCssClass(), 'text');
};
