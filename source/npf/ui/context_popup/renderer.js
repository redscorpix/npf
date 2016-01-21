goog.provide('npf.ui.contextPopup.Renderer');

goog.require('goog.dom.TagName');
goog.require('goog.style');
goog.require('npf.ui.StatedRenderer');


/**
 * @constructor
 * @struct
 * @extends {npf.ui.StatedRenderer}
 */
npf.ui.contextPopup.Renderer = function() {
  npf.ui.contextPopup.Renderer.base(this, 'constructor');
};
goog.inherits(npf.ui.contextPopup.Renderer, npf.ui.StatedRenderer);
goog.addSingletonGetter(npf.ui.contextPopup.Renderer);


/**
 * @type {string}
 */
npf.ui.contextPopup.Renderer.CSS_CLASS = goog.getCssName('npf-contextPopup');


/** @inheritDoc */
npf.ui.contextPopup.Renderer.prototype.getCssClass = function() {
  return npf.ui.contextPopup.Renderer.CSS_CLASS;
};

/** @inheritDoc */
npf.ui.contextPopup.Renderer.prototype.createDom = function(component) {
  /** @type {!Element} */
  var element = npf.ui.contextPopup.Renderer.base(this, 'createDom', component);
  element.innerHTML = '<div class="' + this.getContentCssClass() + '"></div>';
  goog.style.setElementShown(element, false);

  return element;
};

/**
 * @param {npf.ui.ContextPopup} component
 * @return {Element}
 */
npf.ui.contextPopup.Renderer.prototype.createFaderElement = function(
    component) {
  return component.getDomHelper().createDom(goog.dom.TagName.DIV,
    this.getFaderCssClass());
};

/** @inheritDoc */
npf.ui.contextPopup.Renderer.prototype.getContentElement = function(element) {
  return this.getElementByClass(this.getContentCssClass(), element);
};

/**
 * @return {string}
 */
npf.ui.contextPopup.Renderer.prototype.getContentCssClass = function() {
  return goog.getCssName(this.getStructuralCssClass(), 'content');
};

/**
 * @return {string}
 */
npf.ui.contextPopup.Renderer.prototype.getFaderCssClass = function() {
  return goog.getCssName(this.getStructuralCssClass(), 'fader');
};
