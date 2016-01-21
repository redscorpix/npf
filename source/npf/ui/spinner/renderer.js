goog.provide('npf.ui.spinner.Renderer');

goog.require('goog.a11y.aria');
goog.require('goog.a11y.aria.Role');
goog.require('goog.dom.TagName');
goog.require('npf.ui.Renderer');


/**
 * @constructor
 * @extends {npf.ui.Renderer}
 */
npf.ui.spinner.Renderer = function() {
  npf.ui.spinner.Renderer.base(this, 'constructor');
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
  var element = npf.ui.spinner.Renderer.base(this, 'createDom', component);
  goog.a11y.aria.setRole(element, goog.a11y.aria.Role.PROGRESSBAR);

  /** @type {number} */
  var segmentCount = component.getSegmentCount();
  /** @type {number} */
  var rotation = component.getRotation();
  /** @type {number} */
  var radius = component.getRadius();
  /** @type {number} */
  var opacity = component.getOpacity();
  /** @type {goog.dom.DomHelper} */
  var domHelper = component.getDomHelper();

  for (var i = 0; i < segmentCount; i++) {
    /** @type {number} */
    var rotate = Math.round(360 / segmentCount * i + rotation);
    /** @type {string} */
    var transformValue =
      'rotate(' + rotate + 'deg) translate(' + radius + 'px,0)';
    /** @type {string} */
    var styleValue = 'opacity:' + opacity + ';transform:' + transformValue;
    /** @type {string} */
    var lineElementHtml = '<div class="' + this.getLineCssClass() +
      '" style="' + styleValue + '"></div>';
    /** @type {!Element} */
    var segmentElement = domHelper.createDom(goog.dom.TagName.DIV, {
      'class': this.getSegmentCssClass(),
      'innerHTML': lineElementHtml
    });
    domHelper.appendChild(element, segmentElement);
  }

  return element;
};

/**
 * @param {Element} element
 * @param {number} opacity
 */
npf.ui.spinner.Renderer.prototype.setOpacity = function(element, opacity) {
  if (element) {
    element.style.opacity = opacity;
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
npf.ui.spinner.Renderer.prototype.getLineCssClass = function() {
  return goog.getCssName(this.getStructuralCssClass(), 'line');
};

/**
 * @return {string}
 */
npf.ui.spinner.Renderer.prototype.getSegmentCssClass = function() {
  return goog.getCssName(this.getStructuralCssClass(), 'segment');
};
