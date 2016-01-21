goog.provide('npf.userAgent.elements');

goog.require('goog.dom');
goog.require('goog.dom.TagName');
goog.require('npf.userAgent.utils');


/**
 * @private {boolean?}
 */
npf.userAgent.elements.details_ = null;

/**
 * @return {boolean}
 */
npf.userAgent.elements.isDetailsSupported = function() {
  if (goog.isNull(npf.userAgent.elements.details_)) {
    npf.userAgent.elements.details_ = false;

    /** @type {!Element} */
    var el = goog.dom.createElement(goog.dom.TagName.DETAILS);

    if ('open' in el) {
      /** @type {string} */
      var styles = '#' + npf.userAgent.utils.ID + ' details{display:block}';

      npf.userAgent.elements.details_ =
        npf.userAgent.utils.testStyles(styles, function(node) {
          node.appendChild(el);
          el.innerHTML = '<summary>a</summary>b';
          var diff = el.offsetHeight;
          el.open = true;

          return diff != el.offsetHeight;
        });
    }
  }

  return /** @type {boolean} */ (npf.userAgent.elements.details_);
};

/**
 * @private {boolean?}
 */
npf.userAgent.elements.downloadAttr_ = null;

/**
 * @return {boolean}
 */
npf.userAgent.elements.isDownloadAttributeSupported = function() {
  if (goog.isNull(npf.userAgent.elements.downloadAttr_)) {
    npf.userAgent.elements.downloadAttr_ =
      !goog.dom.getDomHelper().getWindow()['externalHost'] &&
      'download' in goog.dom.createElement(goog.dom.TagName.A);
  }

  return /** @type {boolean} */ (npf.userAgent.elements.downloadAttr_);
};

/**
 * @private {boolean?}
 */
npf.userAgent.elements.frameSandboxAttr_ = null;

/**
 * Test for `sandbox` attribute in iframes.
 * @return {boolean}
 */
npf.userAgent.elements.isIframeSandboxAttributeSupported = function() {
  if (goog.isNull(npf.userAgent.elements.frameSandboxAttr_)) {
    npf.userAgent.elements.frameSandboxAttr_ =
      'sandbox' in goog.dom.createElement(goog.dom.TagName.IFRAME);
  }

  return /** @type {boolean} */ (npf.userAgent.elements.frameSandboxAttr_);
};

/**
 * @private {boolean?}
 */
npf.userAgent.elements.frameSeamlessAttr_ = null;

/**
 * Test for `seamless` attribute in iframes.
 * @return {boolean}
 */
npf.userAgent.elements.isIframeSeamlessAttributeSupported = function() {
  if (goog.isNull(npf.userAgent.elements.frameSeamlessAttr_)) {
    npf.userAgent.elements.frameSeamlessAttr_ =
      'seamless' in goog.dom.createElement(goog.dom.TagName.IFRAME);
  }

  return /** @type {boolean} */ (npf.userAgent.elements.frameSeamlessAttr_);
};

/**
 * @private {boolean?}
 */
npf.userAgent.elements.iframeSrcdocAttr_ = null;

/**
 * Test for `srcdoc` attribute in iframes.
 * @return {boolean}
 */
npf.userAgent.elements.isIframeSrcdocAttributeSupported = function() {
  if (goog.isNull(npf.userAgent.elements.iframeSrcdocAttr_)) {
    npf.userAgent.elements.iframeSrcdocAttr_ =
      'srcdoc' in goog.dom.createElement(goog.dom.TagName.IFRAME);
  }

  return /** @type {boolean} */ (npf.userAgent.elements.iframeSrcdocAttr_);
};

/**
 * @private {boolean?}
 */
npf.userAgent.elements.imgSizesAttr_ = null;

/**
 * Test for the `sizes` attribute on images.
 * @return {boolean}
 */
npf.userAgent.elements.isImgSizesAttributeSupported = function() {
  if (goog.isNull(npf.userAgent.elements.imgSizesAttr_)) {
    npf.userAgent.elements.imgSizesAttr_ =
      'sizes' in goog.dom.createElement(goog.dom.TagName.IMG);
  }

  return /** @type {boolean} */ (npf.userAgent.elements.imgSizesAttr_);
};

/**
 * @private {boolean?}
 */
npf.userAgent.elements.imgSrcSetAttr_ = null;

/**
 * Test for the srcset attribute of images.
 * @return {boolean}
 */
npf.userAgent.elements.isImgSrcSetAttributeSupported = function() {
  if (goog.isNull(npf.userAgent.elements.imgSrcSetAttr_)) {
    npf.userAgent.elements.imgSrcSetAttr_ =
      'srcset' in goog.dom.createElement(goog.dom.TagName.IMG);
  }

  return /** @type {boolean} */ (npf.userAgent.elements.imgSrcSetAttr_);
};

/**
 * @private {boolean?}
 */
npf.userAgent.elements.listReversed_ = null;

/**
 * Detects support for the `reversed` attribute on the `<ol>` element.
 * @return {boolean}
 */
npf.userAgent.elements.isListReversedSupported = function() {
  if (goog.isNull(npf.userAgent.elements.listReversed_)) {
    npf.userAgent.elements.listReversed_ =
      'reversed' in goog.dom.createElement(goog.dom.TagName.OL);
  }

  return /** @type {boolean} */ (npf.userAgent.elements.listReversed_);
};

/**
 * @private {boolean?}
 */
npf.userAgent.elements.meter_ = null;

/**
 * @return {boolean}
 */
npf.userAgent.elements.isMeterSupported = function() {
  if (goog.isNull(npf.userAgent.elements.meter_)) {
    npf.userAgent.elements.meter_ =
      goog.isDef(goog.dom.createElement(goog.dom.TagName.METER).max);
  }

  return /** @type {boolean} */ (npf.userAgent.elements.meter_);
};

/**
 * @private {boolean?}
 */
npf.userAgent.elements.output_ = null;

/**
 * @return {boolean}
 */
npf.userAgent.elements.isOutputSupported = function() {
  if (goog.isNull(npf.userAgent.elements.output_)) {
    npf.userAgent.elements.output_ =
      'value' in goog.dom.createElement(goog.dom.TagName.OUTPUT);
  }

  return /** @type {boolean} */ (npf.userAgent.elements.output_);
};

/**
 * @return {boolean}
 */
npf.userAgent.elements.isPictureSupported = function() {
  return 'HTMLPictureElement' in goog.global;
};

/**
 * @private {boolean?}
 */
npf.userAgent.elements.progress_ = null;

/**
 * @return {boolean}
 */
npf.userAgent.elements.isProgressSupported = function() {
  if (goog.isNull(npf.userAgent.elements.progress_)) {
    npf.userAgent.elements.progress_ =
      goog.isDef(goog.dom.createElement(goog.dom.TagName.PROGRESS).max);
  }

  return /** @type {boolean} */ (npf.userAgent.elements.progress_);
};

/**
 * @private {boolean?}
 */
npf.userAgent.elements.ruby_ = null;

/**
 * @return {boolean}
 */
npf.userAgent.elements.isRubySupported = function() {
  if (goog.isNull(npf.userAgent.elements.ruby_)) {
    /** @type {!goog.dom.DomHelper} */
    var domHelper = goog.dom.getDomHelper();
    /** @type {!Document} */
    var doc = domHelper.getDocument();
    /** @type {!Window} */
    var win = domHelper.getWindow();
    /** @type {Element} */
    var docElement = doc.documentElement;
    /** @type {Element} */
    var ruby = domHelper.createElement(goog.dom.TagName.RUBY);
    /** @type {Element} */
    var rt = domHelper.createElement(goog.dom.TagName.RT);
    /** @type {Element} */
    var rp = domHelper.createElement(goog.dom.TagName.RP);
    var displayStyleProperty = 'display';
    // 'fontSize' - because it`s only used for IE6 and IE7
    var fontSizeStyleProperty = 'fontSize';

    ruby.appendChild(rp);
    ruby.appendChild(rt);
    docElement.appendChild(ruby);

    /** @type {function(Element,string)} */
    var getStyle = function(element, styleProperty) {
      var result;

      if (win.getComputedStyle) { // for non-IE browsers
        result = doc.defaultView.getComputedStyle(element, null).
          getPropertyValue(styleProperty);
      } else if (element.currentStyle) { // for IE
        result = element.currentStyle[styleProperty];
      }

      return result;
    };
    // browsers that support <ruby> hide the <rp> via "display:none"
    npf.userAgent.elements.ruby_ =
      getStyle(rp, displayStyleProperty) == 'none' || // for non-IE browsers
      // but in IE browsers <rp> has "display:inline" so, the test needs
      // other conditions:
      getStyle(ruby, displayStyleProperty) == 'ruby' &&
      getStyle(rt, displayStyleProperty) == 'ruby-text' || // for IE8+
      getStyle(rp, fontSizeStyleProperty) == '6pt' &&
      getStyle(rt, fontSizeStyleProperty) == '6pt'; // for IE6 & IE7

    docElement.removeChild(ruby);
    // the removed child node still exists in memory, so ...
    ruby = null;
    rt = null;
    rp = null;
  }

  return /** @type {boolean} */ (npf.userAgent.elements.ruby_);
};

/**
 * @private {boolean?}
 */
npf.userAgent.elements.scriptAsyncAttr_ = null;

/**
 * Detects support for the `async` attribute on the `<script>` element.
 * @return {boolean}
 */
npf.userAgent.elements.isScriptAsyncAttributeSupported = function() {
  if (goog.isNull(npf.userAgent.elements.scriptAsyncAttr_)) {
    npf.userAgent.elements.scriptAsyncAttr_ =
      'async' in goog.dom.createElement(goog.dom.TagName.SCRIPT);
  }

  return /** @type {boolean} */ (npf.userAgent.elements.scriptAsyncAttr_);
};

/**
 * @private {boolean?}
 */
npf.userAgent.elements.scriptDeferAttr_ = null;

/**
 * Detects support for the `defer` attribute on the `<script>` element.
 * @return {boolean}
 */
npf.userAgent.elements.isScriptDeferAttributeSupported = function() {
  if (goog.isNull(npf.userAgent.elements.scriptDeferAttr_)) {
    npf.userAgent.elements.scriptDeferAttr_ =
      'defer' in goog.dom.createElement(goog.dom.TagName.SCRIPT);
  }

  return /** @type {boolean} */ (npf.userAgent.elements.scriptDeferAttr_);
};

/**
 * @private {boolean?}
 */
npf.userAgent.elements.styleScopedAttr_ = null;

/**
 * Support for the `scoped` attribute of the `<style>` element.
 * @return {boolean}
 */
npf.userAgent.elements.isStyleScopedAttributeSupported = function() {
  if (goog.isNull(npf.userAgent.elements.styleScopedAttr_)) {
    npf.userAgent.elements.styleScopedAttr_ =
      'scoped' in goog.dom.createElement(goog.dom.TagName.STYLE);
  }

  return /** @type {boolean} */ (npf.userAgent.elements.styleScopedAttr_);
};

/**
 * @private {boolean?}
 */
npf.userAgent.elements.template_ = null;

/**
 * @return {boolean}
 */
npf.userAgent.elements.isTemplateSupported = function() {
  if (goog.isNull(npf.userAgent.elements.template_)) {
    npf.userAgent.elements.template_ =
      'content' in goog.dom.createElement(goog.dom.TagName.TEMPLATE);
  }

  return /** @type {boolean} */ (npf.userAgent.elements.template_);
};

/**
 * @private {boolean?}
 */
npf.userAgent.elements.time_ = null;

/**
 * @return {boolean}
 */
npf.userAgent.elements.isTimeSupported = function() {
  if (goog.isNull(npf.userAgent.elements.time_)) {
    npf.userAgent.elements.time_ =
      'valueAsDate' in goog.dom.createElement(goog.dom.TagName.TIME);
  }

  return /** @type {boolean} */ (npf.userAgent.elements.time_);
};

/**
 * @private {boolean?}
 */
npf.userAgent.elements.textTrack_ = null;

/**
 * @return {boolean}
 */
npf.userAgent.elements.isTextTrackSupported = function() {
  if (goog.isNull(npf.userAgent.elements.textTrack_)) {
    npf.userAgent.elements.textTrack_ = 'function' ===
      typeof goog.dom.createElement(goog.dom.TagName.VIDEO).addTextTrack;
  }

  return /** @type {boolean} */ (npf.userAgent.elements.textTrack_);
};

/**
 * @private {boolean?}
 */
npf.userAgent.elements.track_ = null;

/**
 * @return {boolean}
 */
npf.userAgent.elements.isTrackSupported = function() {
  if (goog.isNull(npf.userAgent.elements.track_)) {
    npf.userAgent.elements.track_ =
      'kind' in goog.dom.createElement(goog.dom.TagName.TRACK);
  }

  return /** @type {boolean} */ (npf.userAgent.elements.track_);
};

/**
 * @private {boolean?}
 */
npf.userAgent.elements.unknown_ = null;

/**
 * Does the browser support HTML with non-standard / new elements?
 * @return {boolean}
 */
npf.userAgent.elements.isUnknownSupported = function() {
  if (goog.isNull(npf.userAgent.elements.unknown_)) {
    npf.userAgent.elements.unknown_ =
      1 === goog.dom.createDom(goog.dom.TagName.A, {
        'innerHTML': '<xyz></xyz>'
      }).childNodes.length;
  }

  return /** @type {boolean} */ (npf.userAgent.elements.unknown_);
};
