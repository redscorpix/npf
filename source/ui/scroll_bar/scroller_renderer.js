goog.provide('npf.ui.scrollBar.ScrollerRenderer');

goog.require('goog.dom');
goog.require('goog.dom.TagName');
goog.require('npf.ui.renderComponent.Renderer');


/**
 * @constructor
 * @extends {npf.ui.renderComponent.Renderer}
 */
npf.ui.scrollBar.ScrollerRenderer = function() {
  goog.base(this);
};
goog.inherits(npf.ui.scrollBar.ScrollerRenderer, npf.ui.renderComponent.Renderer);
goog.addSingletonGetter(npf.ui.scrollBar.ScrollerRenderer);


/**
 * @type {string}
 */
npf.ui.scrollBar.ScrollerRenderer.CSS_CLASS =
  goog.getCssName('npf-scrollBar-scroller');


/** @inheritDoc */
npf.ui.scrollBar.ScrollerRenderer.prototype.getCssClass = function() {
  return npf.ui.scrollBar.ScrollerRenderer.CSS_CLASS;
};

/** @override */
npf.ui.scrollBar.ScrollerRenderer.prototype.createDom = function(scroller) {
  /** @type {Element} */
  var element = goog.base(this, 'createDom', scroller);
  /** @type {!Element} */
  var backgroundElement = scroller.getDomHelper().createDom(
    goog.dom.TagName.DIV, this.getBackgroundCssClass());
  /** @type {!Element} */
  var runnerElement = scroller.getDomHelper().createDom(goog.dom.TagName.DIV,
    this.getRunnerCssClass());

  goog.dom.appendChild(element, backgroundElement);
  goog.dom.appendChild(element, runnerElement);

  return element;
};

/**
 * @param {Element} element
 * @return {Element}
 */
npf.ui.scrollBar.ScrollerRenderer.prototype.getRunnerElement = function(element) {
  return goog.dom.getElementByClass(this.getRunnerCssClass(), element);
};

/**
 * @param {Element} element
 * @return {Element}
 */
npf.ui.scrollBar.ScrollerRenderer.prototype.getBackgroundElement = function(element) {
  return goog.dom.getElementByClass(this.getBackgroundCssClass(), element);
};

/**
 * @return {string}
 */
npf.ui.scrollBar.ScrollerRenderer.prototype.getRunnerCssClass = function() {
  return goog.getCssName(this.getStructuralCssClass(), 'runner');
};

/**
 * @return {string}
 */
npf.ui.scrollBar.ScrollerRenderer.prototype.getBackgroundCssClass = function() {
  return goog.getCssName(this.getStructuralCssClass(), 'background');
};
