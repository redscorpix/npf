goog.provide('npf.ui.richScrollBar.Renderer');

goog.require('npf.ui.scrollBar.Renderer');


/**
 * @constructor
 * @extends {npf.ui.scrollBar.Renderer}
 */
npf.ui.richScrollBar.Renderer = function() {
  goog.base(this);
};
goog.inherits(npf.ui.richScrollBar.Renderer, npf.ui.scrollBar.Renderer);
goog.addSingletonGetter(npf.ui.richScrollBar.Renderer);


/** @inheritDoc */
npf.ui.richScrollBar.Renderer.prototype.createDom = function(component) {
  /** @type {Element} */
  var element = goog.base(this, 'createDom', component);
  /** @type {Element} */
  var containerElement = this.getScrollElement(element);
  /** @type {Element} */
  var contentElement = this.getContentElement(element);
  /** @type {!Element} */
  var contentWrapperElement = component.getDomHelper().createDom(
    goog.dom.TagName.DIV, this.getContentWrapperCssClass());

  goog.dom.appendChild(element, containerElement);
  goog.dom.appendChild(containerElement, contentWrapperElement);
  goog.dom.appendChild(contentWrapperElement, contentElement);

  return element;
};

/**
 * @param {Element} element
 * @return {Element}
 */
npf.ui.richScrollBar.Renderer.prototype.getContentWrapperElement = function(
    element) {
  if (element) {
    return goog.dom.getElementByClass(this.getContentWrapperCssClass(), element);
  }

  return null;
};

/**
 * @return {string}
 */
npf.ui.richScrollBar.Renderer.prototype.getContentWrapperCssClass = function() {
  return goog.getCssName(this.getStructuralCssClass(), 'contentWrapper');
};
