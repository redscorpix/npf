goog.provide('npf.ui.form.FileUploaderRenderer');

goog.require('goog.dom.TagName');
goog.require('npf.ui.form.FieldRenderer');


/**
 * @constructor
 * @struct
 * @extends {npf.ui.form.FieldRenderer}
 */
npf.ui.form.FileUploaderRenderer = function() {
  npf.ui.form.FileUploaderRenderer.base(this, 'constructor');
};
goog.inherits(npf.ui.form.FileUploaderRenderer, npf.ui.form.FieldRenderer);
goog.addSingletonGetter(npf.ui.form.FileUploaderRenderer);


/** @inheritDoc */
npf.ui.form.FileUploaderRenderer.prototype.appendContent = function(component,
    element) {
  /** @type {Element} */
  var contentElement = this.getContentElement(element);

  if (contentElement) {
    /** @type {goog.dom.DomHelper} */
    var domHelper = component.getDomHelper();
    /** @type {!Element} */
    var valueElement = domHelper.createDom(
      goog.dom.TagName.DIV, this.getValueCssClass());
    domHelper.appendChild(contentElement, valueElement);
  }
};

/**
 * @return {string}
 */
npf.ui.form.FileUploaderRenderer.prototype.getFieldCssClass = function() {
  return goog.getCssName('npf-form-fileUploader');
};
