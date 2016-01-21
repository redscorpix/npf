goog.provide('npf.userAgent.contentEditable');

goog.require('goog.dom');
goog.require('goog.dom.TagName');


/**
 * @private {boolean?}
 */
npf.userAgent.contentEditable.supported_ = null;

/**
 * Detects support for the `contenteditable` attribute of elements, allowing
 * their DOM text contents to be edited directly by the user.
 * @return {boolean}
 */
npf.userAgent.contentEditable.isSupported = function() {
  if (goog.isNull(npf.userAgent.contentEditable.supported_)) {
    /** @type {!goog.dom.DomHelper} */
    var domHelper = goog.dom.getDomHelper();
    npf.userAgent.contentEditable.supported_ = false;

    // early bail out
    if ('contentEditable' in domHelper.getDocument().documentElement) {
      // some mobile browsers (android < 3.0, iOS < 5) claim to support
      // contentEditable, but but don't really. This test checks to see
      // confirms whether or not it actually supports it.

      npf.userAgent.contentEditable.supported_ =
        'true' === domHelper.createDom(goog.dom.TagName.DIV, {
          'contentEditable': true
        })['contentEditable'];
    }
  }

  return /** @type {boolean} */ (npf.userAgent.contentEditable.supported_);
};
