goog.provide('npf.ui.form.Renderer');

goog.require('goog.dom.TagName');
goog.require('npf.ui.StatedRenderer');


/**
 * @constructor
 * @extends {npf.ui.StatedRenderer}
 */
npf.ui.form.Renderer = function() {
  goog.base(this);
};
goog.inherits(npf.ui.form.Renderer, npf.ui.StatedRenderer);
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

/** @inheritDoc */
npf.ui.form.Renderer.prototype.createDom = function(component) {
  /** @type {!Element} */
  var element = component.getDomHelper().createDom(goog.dom.TagName.FORM,
    this.getClassNames(component).join(' '));
  this.setAriaStates(/** @type {!npf.ui.Form} */ (component), element);

  return element;
};
