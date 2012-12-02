goog.provide('npf.ui.scrollBar.Renderer');

goog.require('goog.dom');
goog.require('goog.dom.TagName');
goog.require('goog.style');
goog.require('goog.userAgent');
goog.require('npf.ui.renderComponent.Renderer');


/**
 * @constructor
 * @extends {npf.ui.renderComponent.Renderer}
 */
npf.ui.scrollBar.Renderer = function() {
  goog.base(this);
};
goog.inherits(npf.ui.scrollBar.Renderer, npf.ui.renderComponent.Renderer);
goog.addSingletonGetter(npf.ui.scrollBar.Renderer);


/**
 * @type {string}
 */
npf.ui.scrollBar.Renderer.CSS_CLASS = goog.getCssName('npf-scrollBar');

/**
 * @type {number}
 * @private
 */
npf.ui.scrollBar.Renderer.scrollBarWidth_;


/**
 * @return {number}
 */
npf.ui.scrollBar.Renderer.getScrollBarWidth = function() {
  if (!goog.isDef(npf.ui.scrollBar.Renderer.scrollBarWidth_)) {
    npf.ui.scrollBar.Renderer.scrollBarWidth_ = goog.style.getScrollbarWidth();
  }

  return npf.ui.scrollBar.Renderer.scrollBarWidth_;
};

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
  var scrollBarWidth = npf.ui.scrollBar.Renderer.getScrollBarWidth();

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
  if (element) {
    return goog.dom.getElementByClass(this.getContentCssClass(), element);
  }

  return null;
};

/**
 * @param {Element} element
 * @return {Element}
 */
npf.ui.scrollBar.Renderer.prototype.getScrollElement = function(element) {
  if (element) {
    return goog.dom.getElementByClass(this.getContainerCssClass(), element);
  }

  return null;
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
