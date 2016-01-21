goog.provide('npf.ui.scrollable.ContainerRenderer');

goog.require('goog.math.Coordinate');
goog.require('goog.math.Size');
goog.require('goog.style');
goog.require('npf.ui.StatedRenderer');


/**
 * @constructor
 * @extends {npf.ui.StatedRenderer}
 */
npf.ui.scrollable.ContainerRenderer = function() {
  npf.ui.scrollable.ContainerRenderer.base(this, 'constructor');
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
  /** @type {number} */
  var scrollBarWidth = this.getScrollBarWidth();
  /** @type {string} */
  var scrollStyle = scrollBarWidth ?
    'bottom:-' + scrollBarWidth + 'px;right:-' + scrollBarWidth + 'px' : '';
  /** @type {!Element} */
  var element = npf.ui.scrollable.ContainerRenderer.base(
    this, 'createDom', component);
  element.innerHTML =
    '<div class="' + this.getScrollCssClass() + '" style="' +
        scrollStyle + '">' +
      '<div class="' + this.getContentCssClass() + '"></div>' +
    '</div>';

  return element;
};

/** @inheritDoc */
npf.ui.scrollable.ContainerRenderer.prototype.decorate = function(component,
    element) {
  npf.ui.scrollable.ContainerRenderer.base(
    this, 'decorate', component, element);

  /** @type {number} */
  var scrollBarWidth = this.getScrollBarWidth();

  if (scrollBarWidth) {
    /** @type {Element} */
    var scrollElement = this.getScrollElement(element);

    if (scrollElement) {
      scrollElement.style.bottom = -scrollBarWidth + 'px';
      scrollElement.style.right = -scrollBarWidth + 'px';
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
    element.style.width = width + 'px';
    element.style.height = height + 'px';
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
    if (element.scrollLeft != x) {
      element.scrollLeft = x;
    }

    if (element.scrollTop != y) {
      element.scrollTop = y;
    }
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
