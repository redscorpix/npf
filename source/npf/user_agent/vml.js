goog.provide('npf.userAgent.vml');

goog.require('goog.dom');
goog.require('goog.dom.TagName');
goog.require('npf.userAgent.utils');


/**
 * @private {boolean?}
 */
npf.userAgent.vml.supported_ = null;

/**
 * Detects support for VML.
 * @return {boolean}
 */
npf.userAgent.vml.isSupported = function() {
  if (goog.isNull(npf.userAgent.vml.supported_)) {
    /** @type {!Element} */
    var containerDiv = goog.dom.createElement(goog.dom.TagName.DIV);
    npf.userAgent.vml.supported_ = false;

    if (!npf.userAgent.utils.isSvg()) {
      containerDiv.innerHTML = '<v:shape id="vml_flag1" adj="1"/>';
      var shape = containerDiv.firstChild;
      shape.style.behavior = 'url(#default#VML)';
      npf.userAgent.vml.supported_ =
        shape ? 'object' == typeof shape.adj : true;
    }
  }

  return /** @type {boolean} */ (npf.userAgent.vml.supported_);
};
