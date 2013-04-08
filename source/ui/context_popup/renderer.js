goog.provide('npf.ui.contextPopup.Renderer');

goog.require('goog.dom');
goog.require('goog.dom.TagName');
goog.require('goog.style');
goog.require('npf.ui.renderComponent.Renderer');


/**
 * @constructor
 * @extends {npf.ui.renderComponent.Renderer}
 */
npf.ui.contextPopup.Renderer = function() {
  goog.base(this);
};
goog.inherits(npf.ui.contextPopup.Renderer, npf.ui.renderComponent.Renderer);
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
  /** @type {Element} */
  var element = goog.base(this, 'createDom', component);
  goog.style.setElementShown(element, false);
  /** @type {!Element} */
  var contentElement = component.getDomHelper().createDom(goog.dom.TagName.DIV,
    this.getContentCssClass());

  goog.dom.appendChild(element, contentElement);

  return element;
};

/**
 * @param {npf.ui.ContextPopup} component
 * @return {Element}
 */
npf.ui.contextPopup.Renderer.prototype.createFaderElement = function(component) {
  return component.getDomHelper().createDom(goog.dom.TagName.INS,
    this.getFaderCssClass());
};

/** @inheritDoc */
npf.ui.contextPopup.Renderer.prototype.getContentElement = function(element) {
  if (element) {
    return goog.dom.getElementByClass(this.getContentCssClass(), element);
  }

  return null;
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
