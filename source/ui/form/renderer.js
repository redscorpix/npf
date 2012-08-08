goog.provide('npf.ui.form.Renderer');

goog.require('goog.dom');
goog.require('goog.dom.TagName');
goog.require('npf.ui.renderComponent.Renderer');


/**
 * @constructor
 * @extends {npf.ui.renderComponent.Renderer}
 */
npf.ui.form.Renderer = function() {
  goog.base(this);
};
goog.inherits(npf.ui.form.Renderer, npf.ui.renderComponent.Renderer);
goog.addSingletonGetter(npf.ui.form.Renderer);


/**
 * Default CSS class to be applied to the root element of components rendered
 * by this renderer.
 * @type {string}
 */
npf.ui.form.Renderer.CSS_CLASS = goog.getCssName('npf-form');

/** @inheritDoc */
npf.ui.form.Renderer.prototype.getCssClass = function() {
  return npf.ui.form.Renderer.CSS_CLASS;
};

/**
 * @param {npf.ui.Form} form
 * @return {!Element}
 */
npf.ui.form.Renderer.prototype.createDom = function(form) {
  /** @type {!Element} */
  var element = goog.dom.createDom(goog.dom.TagName.FORM,
    this.getClassNames(form).join(' '));

  return element;
};
