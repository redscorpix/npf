goog.provide('npf.ui.scrollable.ContainerRenderer');

goog.require('goog.dom');
goog.require('goog.dom.TagName');
goog.require('goog.math.Coordinate');
goog.require('goog.math.Size');
goog.require('goog.style');
goog.require('npf.ui.StatedRenderer');


/**
 * @constructor
 * @extends {npf.ui.StatedRenderer}
 */
npf.ui.scrollable.ContainerRenderer = function() {
  goog.base(this);
};
goog.inherits(
  npf.ui.scrollable.ContainerRenderer, npf.ui.StatedRenderer);
goog.addSingletonGetter(npf.ui.scrollable.ContainerRenderer);


/**
 * @type {string}
 */
npf.ui.scrollable.ContainerRenderer.CSS_CLASS =
  goog.getCssName('npf-scrollable-container');


/** @inheritDoc */
npf.ui.scrollable.ContainerRenderer.prototype.getCssClass = function() {
  return npf.ui.scrollable.ContainerRenderer.CSS_CLASS;
};

/** @override */
npf.ui.scrollable.ContainerRenderer.prototype.createDom = function(component) {
  /** @type {Element} */
  var element = goog.base(this, 'createDom', component);
  /** @type {!Element} */
  var scrollElement = component.getDomHelper().createDom(
    goog.dom.TagName.DIV, this.getScrollCssClass());
  /** @type {!Element} */
  var contentElement = component.getDomHelper().createDom(
    goog.dom.TagName.DIV, this.getContentCssClass());
  /** @type {number} */
  var scrollBarWidth = this.getScrollBarWidth();

  if (scrollBarWidth) {
    goog.style.setStyle(scrollElement, {
      'right': -scrollBarWidth + 'px',
      'bottom': -scrollBarWidth + 'px'
    });
  }

  // Webkit bug fixing.
  // if (goog.userAgent.WEBKIT) {
  //   goog.style.setStyle(element, 'direction', 'rtl');
  //   goog.style.setStyle(scrollElement, 'direction', 'ltr');
  // }

  goog.dom.appendChild(element, scrollElement);
  goog.dom.appendChild(scrollElement, contentElement);

  return element;
};

/** @inheritDoc */
npf.ui.scrollable.ContainerRenderer.prototype.decorate = function(component,
    element) {
  goog.base(this, 'decorate', component, element);

  /** @type {number} */
  var scrollBarWidth = this.getScrollBarWidth();

  if (scrollBarWidth) {
    /** @type {Element} */
    var scrollElement = this.getScrollElement(element);

    if (scrollElement) {
      goog.style.setStyle(scrollElement, {
        'right': -scrollBarWidth + 'px',
        'bottom': -scrollBarWidth + 'px'
      });
    }
  }

  return element;
};

/**
 * @return {number}
 * @protected
 */
npf.ui.scrollable.ContainerRenderer.prototype.getScrollBarWidth = function() {
  return goog.style.getScrollbarWidth();
};

/**
 * @param {Element} element
 * @return {!goog.math.Size}
 */
npf.ui.scrollable.ContainerRenderer.prototype.getSize = function(element) {
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
npf.ui.scrollable.ContainerRenderer.prototype.setSize = function(element, width,
    height) {
  if (element) {
    goog.style.setSize(element, width, height);
  }
};

/**
 * @param {Element} element
 */
npf.ui.scrollable.ContainerRenderer.prototype.resetSize = function(element) {
  if (element) {
    goog.style.setStyle(element, {
      'height': '',
      'width': ''
    });
  }
};

/**
 * @param {Element} element
 * @return {!goog.math.Coordinate}
 */
npf.ui.scrollable.ContainerRenderer.prototype.getScrollPosition = function(
    element) {
  /** @type {number} */
  var left = 0;
  /** @type {number} */
  var top = 0;

  if (element) {
    left = element.scrollLeft;
    top = element.scrollTop;
  }

  return new goog.math.Coordinate(left, top);
};

/**
 * @param {Element} element
 * @param {number} x
 * @param {number} y
 */
npf.ui.scrollable.ContainerRenderer.prototype.setScrollPosition = function(
    element, x, y) {
  if (element) {
    element.scrollLeft = x;
    element.scrollTop = y;
  }
};

/** @inheritDoc */
npf.ui.scrollable.ContainerRenderer.prototype.getContentElement = function(
    element) {
  return this.getElementByClass(this.getContentCssClass(), element);
};

/**
 * @param {Element} element
 * @return {Element}
 */
npf.ui.scrollable.ContainerRenderer.prototype.getScrollElement = function(
    element) {
  return this.getElementByClass(this.getScrollCssClass(), element);
};

/**
 * @return {string}
 */
npf.ui.scrollable.ContainerRenderer.prototype.getScrollCssClass = function() {
  return goog.getCssName(this.getStructuralCssClass(), 'scroll');
};

/**
 * @return {string}
 */
npf.ui.scrollable.ContainerRenderer.prototype.getContentCssClass = function() {
  return goog.getCssName(this.getStructuralCssClass(), 'content');
};
