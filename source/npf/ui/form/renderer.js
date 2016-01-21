goog.provide('npf.ui.form.Renderer');

goog.require('goog.dom.TagName');
goog.require('npf.ui.StatedRenderer');


/**
 * @constructor
 * @struct
 * @extends {npf.ui.StatedRenderer}
 */
npf.ui.form.Renderer = function() {
  npf.ui.form.Renderer.base(this, 'constructor');
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
  return component.getDomHelper().createDom(goog.dom.TagName.FORM,
    this.getClassNames(component).join(' '));
};
