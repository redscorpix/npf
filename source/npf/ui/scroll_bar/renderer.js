goog.provide('npf.ui.scrollBar.Renderer');

goog.require('goog.dom');
goog.require('goog.dom.TagName');
goog.require('goog.math.Size');
goog.require('goog.style');
goog.require('goog.userAgent');
goog.require('npf.ui.Renderer');


/**
 * @constructor
 * @extends {npf.ui.Renderer}
 */
npf.ui.scrollBar.Renderer = function() {
  goog.base(this);
};
goog.inherits(npf.ui.scrollBar.Renderer, npf.ui.Renderer);
goog.addSingletonGetter(npf.ui.scrollBar.Renderer);


/**
 * @type {string}
 */
npf.ui.scrollBar.Renderer.CSS_CLASS = goog.getCssName('npf-scrollBar');


/** @inheritDoc */
npf.ui.scrollBar.Renderer.prototype.getCssClass = function() {
  return npf.ui.scrollBar.Renderer.CSS_CLASS;
};

/** @override */
npf.ui.scrollBar.Renderer.prototype.createDom = function(component) {
  /** @type {Element} */
  var element = goog.base(this, 'createDom', component);
  /** @type {!Element} */
  var containerElement = component.getDomHelper().createDom(
    goog.dom.TagName.DIV, this.getContainerCssClass());
  /** @type {!Element} */
  var contentElement = component.getDomHelper().createDom(
    goog.dom.TagName.DIV, this.getContentCssClass());
  /** @type {number} */
  var scrollBarWidth = this.getScrollBarWidth();

  if (scrollBarWidth) {
    goog.style.setStyle(containerElement, {
      'right': -scrollBarWidth + 'px',
      'bottom': -scrollBarWidth + 'px'
    });
  }

  // Webkit bug fixing.
  if (goog.userAgent.WEBKIT) {
    goog.style.setStyle(element, 'direction', 'rtl');
    goog.style.setStyle(containerElement, 'direction', 'ltr');
  }

  goog.dom.appendChild(element, containerElement);
  goog.dom.appendChild(containerElement, contentElement);

  return element;
};

/**
 * @return {number}
 * @protected
 */
npf.ui.scrollBar.Renderer.prototype.getScrollBarWidth = function() {
  return goog.style.getScrollbarWidth();
};

/**
 * @param {Element} element
 * @return {!goog.math.Size}
 */
npf.ui.scrollBar.Renderer.prototype.getSize = function(element) {
  if (element) {
    return goog.style.getBorderBoxSize(element);
  }

  return new goog.math.Size(0, 0);
};

/**
 * @param {Element} element
 * @param {number} width
 * @param {number} height
 */
npf.ui.scrollBar.Renderer.prototype.setSize = function(element, width, height) {
  if (element) {
    goog.style.setSize(element, width, height);
  }
};

/**
 * @param {Element} element
 */
npf.ui.scrollBar.Renderer.prototype.resetSize = function(element) {
  if (element) {
    goog.style.setStyle(element, {
      'width': '',
      'height': ''
    });
  }
};

/** @inheritDoc */
npf.ui.scrollBar.Renderer.prototype.getContentElement = function(element) {
  return this.getElementByClass(this.getContentCssClass(), element);
};

/**
 * @param {Element} element
 * @return {Element}
 */
npf.ui.scrollBar.Renderer.prototype.getScrollElement = function(element) {
  return this.getElementByClass(this.getContainerCssClass(), element);
};

/**
 * @return {string}
 */
npf.ui.scrollBar.Renderer.prototype.getContainerCssClass = function() {
  return goog.getCssName(this.getStructuralCssClass(), 'container');
};

/**
 * @return {string}
 */
npf.ui.scrollBar.Renderer.prototype.getContentCssClass = function() {
  return goog.getCssName(this.getStructuralCssClass(), 'content');
};
