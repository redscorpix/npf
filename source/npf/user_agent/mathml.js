goog.provide('npf.userAgent.mathml');

goog.require('npf.userAgent.utils');


/**
 * @private {boolean?}
 */
npf.userAgent.mathml.supported_ = null;

/**
 * Detects support for MathML, for mathematic equations in web pages.
 * @return {boolean}
 */
npf.userAgent.mathml.isSupported = function() {
  if (goog.isNull(npf.userAgent.mathml.supported_)) {
    /** @type {string} */
    var styles = '#' + npf.userAgent.utils.ID +
      '{position:absolute;display:inline-block}';

    npf.userAgent.mathml.supported_ =
      npf.userAgent.utils.testStyles(styles, function(node) {
        node.innerHTML += '<math><mfrac><mi>xx</mi><mi>yy</mi></mfrac></math>';

        return node.offsetHeight > node.offsetWidth;
      });
  }

  return /** @type {boolean} */ (npf.userAgent.mathml.supported_);
};
