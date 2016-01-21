goog.provide('npf.ui.scrollContainer.Renderer');

goog.require('goog.dom.classlist');
goog.require('goog.object');
goog.require('goog.style');
goog.require('npf.ui.StatedRenderer');


/**
 * @constructor
 * @extends {npf.ui.StatedRenderer}
 */
npf.ui.scrollContainer.Renderer = function() {
  npf.ui.scrollContainer.Renderer.base(this, 'constructor');

  /**
   * @private {Object<string>}
   */
  this.cornerToCssClass_ = null;

  /**
   * @private {number?}
   */
  this.scrollBarWidth_ = null;
};
goog.inherits(
  npf.ui.scrollContainer.Renderer, npf.ui.StatedRenderer);
goog.addSingletonGetter(npf.ui.scrollContainer.Renderer);


/**
 * @type {string}
 */
npf.ui.scrollContainer.Renderer.CSS_CLASS =
  goog.getCssName('npf-scrollContainer');


/** @inheritDoc */
npf.ui.scrollContainer.Renderer.prototype.getCssClass = function() {
  return npf.ui.scrollContainer.Renderer.CSS_CLASS;
};

/** @inheritDoc */
npf.ui.scrollContainer.Renderer.prototype.createDom = function(component) {
  /** @type {!Element} */
  var element = npf.ui.scrollContainer.Renderer.base(
    this, 'createDom', component);
  element.innerHTML =
    '<div class="' + this.getResizeHandlerCssClass() + '"></div>' +
    '<div class="' + this.getScrollCssClass() + '">' +
      '<div class="' + this.getMovingCssClass() + '">' +
        '<div class="' + this.getContentResizeHandlerCssClass() + '"></div>' +
        '<div class="' + this.getContentCssClass() + '"></div>' +
      '</div>' +
    '<div>';

  return element;
};

/**
 * @param {!npf.ui.ScrollContainer} component
 */
npf.ui.scrollContainer.Renderer.prototype.checkNativeScrollBar = function(
    component) {
  if (!component.isTouch()) {
    if (goog.isNull(this.scrollBarWidth_)) {
      this.scrollBarWidth_ = goog.style.getScrollbarWidth();
    }

    /** @type {Element} */
    var scrollElement = component.getScrollElement();
    /** @type {Element} */
    var movingElement = component.getMovingElement();

    if (scrollElement) {
      scrollElement.style.bottom = -(this.scrollBarWidth_ + 30) + 'px';
      scrollElement.style.right = -(this.scrollBarWidth_ + 30) + 'px';
    }

    if (movingElement) {
      movingElement.style.marginBottom = '30px';
      movingElement.style.marginRight = '30px';
    }
  }
};

/**
 * @param {!npf.ui.ScrollContainer} component
 * @param {boolean} touch
 */
npf.ui.scrollContainer.Renderer.prototype.setTouch = function(component,
    touch) {
  /** @type {Element} */
  var element = component.getElement();

  if (element) {
    goog.dom.classlist.enable(element, this.getNativeCssClass(), !touch);
    goog.dom.classlist.enable(element, this.getTouchCssClass(), touch);
  }
};

/**
 * @param {Element} element
 * @return {goog.math.Size}
 */
npf.ui.scrollContainer.Renderer.prototype.getSize = function(element) {
  return element ? goog.style.getBorderBoxSize(element) : null;
};

/**
 * @param {Element} element
 * @param {!goog.math.Size} size
 */
npf.ui.scrollContainer.Renderer.prototype.setSize = function(element, size) {
  if (element) {
    element.style.width = size.width + 'px';
    element.style.height = size.height + 'px';
  }
};

/**
 * @param {!npf.ui.ScrollContainer} component
 * @param {npf.ui.ScrollContainer.Corner} corner
 * @param {npf.ui.ScrollContainer.Corner=} opt_removeCorner
 */
npf.ui.scrollContainer.Renderer.prototype.setStartCorner = function(component,
    corner, opt_removeCorner) {
  /** @type {Element} */
  var element = component.getElement();

  if (element) {
    if (!this.cornerToCssClass_) {
      this.cornerToCssClass_ = goog.object.create(
        npf.ui.ScrollContainer.Corner.LEFT_BOTTOM,
          this.getStartLeftBottomCssClass(),
        npf.ui.ScrollContainer.Corner.LEFT_TOP,
          this.getStartLeftTopCssClass(),
        npf.ui.ScrollContainer.Corner.RIGHT_BOTTOM,
          this.getStartRightBottomCssClass(),
        npf.ui.ScrollContainer.Corner.RIGHT_TOP,
          this.getStartRightTopCssClass()
      );
    }

    if (opt_removeCorner) {
      goog.dom.classlist.remove(
        element, this.cornerToCssClass_[opt_removeCorner]);
    }

    goog.dom.classlist.add(element, this.cornerToCssClass_[corner]);
  }
};

/** @inheritDoc */
npf.ui.scrollContainer.Renderer.prototype.getContentElement = function(
    element) {
  return this.getElementByClass(this.getContentCssClass(), element);
};

/**
 * @param {Element} element
 * @return {Element}
 */
npf.ui.scrollContainer.Renderer.prototype.getContentResizeHandlerElement =
    function(element) {
  return this.getElementByClass(
    this.getContentResizeHandlerCssClass(), element);
};

/**
 * @param {Element} element
 * @return {Element}
 */
npf.ui.scrollContainer.Renderer.prototype.getResizeHandlerElement = function(
    element) {
  return this.getElementByClass(this.getResizeHandlerCssClass(), element);
};

/**
 * @param {Element} element
 * @return {Element}
 */
npf.ui.scrollContainer.Renderer.prototype.getScrollElement = function(element) {
  return this.getElementByClass(this.getScrollCssClass(), element);
};

/**
 * @param {Element} element
 * @return {Element}
 */
npf.ui.scrollContainer.Renderer.prototype.getMovingElement = function(element) {
  return this.getElementByClass(this.getMovingCssClass(), element);
};

/**
 * @return {string}
 */
npf.ui.scrollContainer.Renderer.prototype.getContentCssClass = function() {
  return goog.getCssName(this.getStructuralCssClass(), 'content');
};

/**
 * @return {string}
 */
npf.ui.scrollContainer.Renderer.prototype.getContentResizeHandlerCssClass =
    function() {
  return goog.getCssName(this.getStructuralCssClass(), 'contentResizeHandler');
};

/**
 * @return {string}
 */
npf.ui.scrollContainer.Renderer.prototype.getNativeCssClass = function() {
  return goog.getCssName(this.getStructuralCssClass(), 'native');
};

/**
 * @return {string}
 */
npf.ui.scrollContainer.Renderer.prototype.getResizeHandlerCssClass =
    function() {
  return goog.getCssName(this.getStructuralCssClass(), 'resizeHandler');
};

/**
 * @return {string}
 */
npf.ui.scrollContainer.Renderer.prototype.getScrollCssClass = function() {
  return goog.getCssName(this.getStructuralCssClass(), 'scroll');
};

/**
 * @return {string}
 */
npf.ui.scrollContainer.Renderer.prototype.getStartLeftBottomCssClass =
    function() {
  return goog.getCssName(this.getStructuralCssClass(), 'startLeftBottom');
};

/**
 * @return {string}
 */
npf.ui.scrollContainer.Renderer.prototype.getStartLeftTopCssClass = function() {
  return goog.getCssName(this.getStructuralCssClass(), 'startLeftTop');
};

/**
 * @return {string}
 */
npf.ui.scrollContainer.Renderer.prototype.getStartRightBottomCssClass =
    function() {
  return goog.getCssName(this.getStructuralCssClass(), 'startRightBottom');
};

/**
 * @return {string}
 */
npf.ui.scrollContainer.Renderer.prototype.getStartRightTopCssClass =
    function() {
  return goog.getCssName(this.getStructuralCssClass(), 'startRightTop');
};

/**
 * @return {string}
 */
npf.ui.scrollContainer.Renderer.prototype.getMovingCssClass = function() {
  return goog.getCssName(this.getStructuralCssClass(), 'moving');
};

/**
 * @return {string}
 */
npf.ui.scrollContainer.Renderer.prototype.getTouchCssClass = function() {
  return goog.getCssName(this.getStructuralCssClass(), 'touch');
};
