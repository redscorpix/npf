goog.provide('npf.ui.form.TextRenderer');

goog.require('goog.dom.InputType');
goog.require('goog.dom.TagName');
goog.require('npf.ui.form.FieldRenderer');


/**
 * @constructor
 * @struct
 * @extends {npf.ui.form.FieldRenderer}
 */
npf.ui.form.TextRenderer = function() {
  npf.ui.form.TextRenderer.base(this, 'constructor');
};
goog.inherits(npf.ui.form.TextRenderer, npf.ui.form.FieldRenderer);
goog.addSingletonGetter(npf.ui.form.TextRenderer);


/**
 * @type {string}
 */
npf.ui.form.TextRenderer.CSS_CLASS = goog.getCssName('npf-form-text');


/** @inheritDoc */
npf.ui.form.TextRenderer.prototype.appendContent = function(component,
    element) {
  var field = /** @type {npf.ui.form.Text} */ (component);
  var properties = {
    'class': this.getValueCssClass(),
    'name': field.getName(),
    'type': this.getInputType(),
    'value': field.getValue()
  };

  if (!field.isAutoComplete()) {
    properties['autocomplete'] = 'off';
  }

  /** @type {goog.dom.DomHelper} */
  var domHelper = field.getDomHelper();
  /** @type {!Element} */
  var valueElement = domHelper.createDom(goog.dom.TagName.INPUT, properties);
  domHelper.appendChild(this.getContentElement(element), valueElement);

  if (field.isLabelEnabled()) {
    this.bindLabel(this.getLabelElement(element), valueElement);
  }
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
 * @return {string}
 */
npf.ui.form.TextRenderer.prototype.getInputType = function() {
  return goog.dom.InputType.TEXT;
};

/**
 * @param {Element} element
 * @param {number} maxLength
 */
npf.ui.form.TextRenderer.prototype.setMaxLength = function(element, maxLength) {
  if (element) {
    if (-1 < maxLength) {
      element.setAttribute('maxlength', maxLength);
    } else {
      element.removeAttribute('maxlength');
    }
  }
};

/**
 * @return {string}
 */
npf.ui.form.TextRenderer.prototype.getFieldCssClass = function() {
  return npf.ui.form.TextRenderer.CSS_CLASS;
};
