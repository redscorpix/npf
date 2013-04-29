goog.provide('npf.ui.spinner.Renderer');

goog.require('goog.a11y.aria');
goog.require('goog.a11y.aria.Role');
goog.require('goog.dom');
goog.require('goog.dom.TagName');
goog.require('goog.style');
goog.require('npf.ui.Renderer');


/**
 * @constructor
 * @extends {npf.ui.Renderer}
 */
npf.ui.spinner.Renderer = function() {
  goog.base(this);
};
goog.inherits(npf.ui.spinner.Renderer, npf.ui.Renderer);
goog.addSingletonGetter(npf.ui.spinner.Renderer);


/**
 * @type {string}
 */
npf.ui.spinner.Renderer.CSS_CLASS = goog.getCssName('npf-spinner');


/** @inheritDoc */
npf.ui.spinner.Renderer.prototype.getCssClass = function() {
  return npf.ui.spinner.Renderer.CSS_CLASS;
};

/** @inheritDoc */
npf.ui.spinner.Renderer.prototype.createDom = function(component) {
  /** @type {!Element} */
  var element = component.getDomHelper().createDom(goog.dom.TagName.INS,
    this.getClassNames(component).join(' '));
  goog.a11y.aria.setRole(element, goog.a11y.aria.Role.PROGRESSBAR);

  /** @type {number} */
  var segmentCount = component.getSegmentCount();
  /** @type {number} */
  var rotation = component.getRotation();
  /** @type {number} */
  var radius = component.getRadius();
  /** @type {number} */
  var opacity = component.getOpacity();

  for (var i = 0; i < segmentCount; i++) {
    /** @type {!Element} */
    var segmentElement = component.getDomHelper().createDom(
      goog.dom.TagName.INS, this.getSegmentCssClass());
    /** @type {!Element} */
    var lineElement = component.getDomHelper().createDom(
      goog.dom.TagName.INS, this.getLineCssClass());
    /** @type {number} */
    var rotate = Math.round(360 / segmentCount * i + rotation);

    goog.style.setStyle(lineElement, {
      'opacity': opacity,
      'transform': 'rotate(' + rotate + 'deg) translate(' + radius + 'px,0)'
    });
    goog.dom.appendChild(segmentElement, lineElement);
    goog.dom.appendChild(element, segmentElement);
  }

  return element;
};

/**
 * @param {Element} element
 * @param {number} opacity
 */
npf.ui.spinner.Renderer.prototype.setOpacity = function(element, opacity) {
  if (element) {
    goog.style.setStyle(element, 'opacity', opacity);
  }
};

/**
 * @param {Element} element
 * @return {{length: number}?}
 */
npf.ui.spinner.Renderer.prototype.getSegmentElements = function(element) {
  return this.getElementsByClass(this.getSegmentCssClass(), element);
};

/**
 * @return {string}
 */
npf.ui.spinner.Renderer.prototype.getSegmentCssClass = function() {
  return goog.getCssName(this.getStructuralCssClass(), 'segment');
};

/**
 * @return {string}
 */
npf.ui.spinner.Renderer.prototype.getLineCssClass = function() {
  return goog.getCssName(this.getStructuralCssClass(), 'line');
};
