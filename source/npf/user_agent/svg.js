goog.provide('npf.userAgent.svg');

goog.require('goog.dom');
goog.require('goog.dom.TagName');
goog.require('npf.svg.Ns');


/**
 * @private {boolean?}
 */
npf.userAgent.svg.supported_ = null;

/**
 * Detects support for SVG in `<embed>` or `<object>` elements.
 * @return {boolean}
 */
npf.userAgent.svg.isSupported = function() {
  if (goog.isNull(npf.userAgent.svg.supported_)) {
    /** @type {!Document} */
    var doc = goog.dom.getDomHelper().getDocument();

    npf.userAgent.svg.supported_ = !!doc.createElementNS &&
      !!doc.createElementNS(npf.svg.Ns.SVG, 'svg').createSVGRect;
  }

  return /** @type {boolean} */ (npf.userAgent.svg.supported_);
};

/**
 * @private {boolean?}
 */
npf.userAgent.svg.clipPath_ = null;

/**
 * Detects support for clip paths in SVG (only, not on HTML content).
 * @return {boolean}
 */
npf.userAgent.svg.isClipPathSupported = function() {
  if (goog.isNull(npf.userAgent.svg.clipPath_)) {
    /** @type {!Document} */
    var doc = goog.dom.getDomHelper().getDocument();

    npf.userAgent.svg.clipPath_ = !!doc.createElementNS &&
      /SVGClipPath/.test(({}).toString.call(
        doc.createElementNS(npf.svg.Ns.SVG, 'clipPath')));
  }

  return /** @type {boolean} */ (npf.userAgent.svg.clipPath_);
};

/**
 * @private {boolean?}
 */
npf.userAgent.svg.filter_ = null;

/**
 * @return {boolean}
 */
npf.userAgent.svg.isFilterSupported = function() {
  if (goog.isNull(npf.userAgent.svg.filter_)) {
    npf.userAgent.svg.filter_ = false;

    // Should fail in Safari:
    // http://stackoverflow.com/questions/9739955/feature-detecting-support-for-svg-filters.

    try {
      npf.userAgent.svg.filter_ = 'SVGFEColorMatrixElement' in goog.global &&
        2 == SVGFEColorMatrixElement.SVG_FECOLORMATRIX_TYPE_SATURATE;
    } catch (e) {}
  }

  return /** @type {boolean} */ (npf.userAgent.svg.filter_);
};

/**
 * @private {boolean?}
 */
npf.userAgent.svg.foreignObject_ = null;

/**
 * Detects support for foreignObject tag in SVG.
 * @return {boolean}
 */
npf.userAgent.svg.isForeignObjectSupported = function() {
  if (goog.isNull(npf.userAgent.svg.foreignObject_)) {
    /** @type {!Document} */
    var doc = goog.dom.getDomHelper().getDocument();

    npf.userAgent.svg.foreignObject_ = !!doc.createElementNS &&
      /SVGForeignObject/.test(({}).toString.call(doc.createElementNS(
        npf.svg.Ns.SVG, 'foreignObject')));
  }

  return /** @type {boolean} */ (npf.userAgent.svg.foreignObject_);
};

/**
 * @private {boolean?}
 */
npf.userAgent.svg.inline_ = null;

/**
 * Detects support for inline SVG in HTML (not within XHTML).
 * @return {boolean}
 */
npf.userAgent.svg.isInlineSupported = function() {
  if (goog.isNull(npf.userAgent.svg.inline_)) {
    /** @type {!Element} */
    var div = goog.dom.createDom(goog.dom.TagName.DIV, {
      'innerHTML': '<svg/>'
    });

    npf.userAgent.svg.inline_ = goog.isDef(SVGRect) && !!div.firstChild &&
      npf.svg.Ns.SVG == div.firstChild.namespaceURI;
  }

  return /** @type {boolean} */ (npf.userAgent.svg.inline_);
};

/**
 * @private {boolean?}
 */
npf.userAgent.svg.smil_ = null;

/**
 * Detects support for SVG SMIL animation.
 * @return {boolean}
 */
npf.userAgent.svg.isSmilSupported = function() {
  if (goog.isNull(npf.userAgent.svg.smil_)) {
    /** @type {!Document} */
    var doc = goog.dom.getDomHelper().getDocument();
    /** @type {Element} */
    var element = doc.createElementNS ?
      doc.createElementNS(npf.svg.Ns.SVG, 'animate') : null;

    npf.userAgent.svg.smil_ = !!element &&
      /SVGAnimate/.test(({}).toString.call(element));
  }

  return /** @type {boolean} */ (npf.userAgent.svg.smil_);
};

/**
 * @private {boolean?}
 */
npf.userAgent.svg.svgAsImg_ = null;

/**
 * @return {boolean}
 */
npf.userAgent.svg.isSvgAsImgSupported = function() {
  if (goog.isNull(npf.userAgent.svg.svgAsImg_)) {
    /** @type {!Document} */
    var doc = goog.dom.getDomHelper().getDocument();
    // Note http://www.w3.org/TR/SVG11/feature#Image is *supposed* to represent
    // support for the `<image>` tag in SVG, not an SVG file linked from
    // an `<img>` tag in HTML – but it’s a heuristic which works
    npf.userAgent.svg.svgAsImg_ = doc.implementation.hasFeature(
      'http://www.w3.org/TR/SVG11/feature#Image', '1.1');
  }

  return /** @type {boolean} */ (npf.userAgent.svg.svgAsImg_);
};
