goog.provide('npf.userAgent.xhr');


/**
 * @private {boolean?}
 */
npf.userAgent.xhr.cors_ = null;

/**
 * Detects support for Cross-Origin Resource Sharing: method of performing
 * XMLHttpRequests across domains.
 * @return {boolean}
 */
npf.userAgent.xhr.isCorsSupported = function() {
  if (goog.isNull(npf.userAgent.xhr.cors_)) {
    npf.userAgent.xhr.cors_ = 'XMLHttpRequest' in goog.global &&
      'withCredentials' in new XMLHttpRequest();
  }

  return /** @type {boolean} */ (npf.userAgent.xhr.cors_);
};

/**
 * @private {boolean?}
 */
npf.userAgent.xhr.responseTypeArrayBuffer_ = null;

/**
 * Tests for XMLHttpRequest xhr.responseType='arraybuffer'.
 * @return {boolean}
 */
npf.userAgent.xhr.isResponseTypeArrayBufferSupported = function() {
  if (goog.isNull(npf.userAgent.xhr.responseTypeArrayBuffer_)) {
    npf.userAgent.xhr.responseTypeArrayBuffer_ =
      npf.userAgent.xhr.isResponseTypeSupported_('arraybuffer');
  }

  return /** @type {boolean} */ (npf.userAgent.xhr.responseTypeArrayBuffer_);
};

/**
 * @private {boolean?}
 */
npf.userAgent.xhr.responseTypeBlob_ = null;

/**
 * Tests for XMLHttpRequest xhr.responseType='blob'.
 * @return {boolean}
 */
npf.userAgent.xhr.isResponseTypeBlobSupported = function() {
  if (goog.isNull(npf.userAgent.xhr.responseTypeBlob_)) {
    npf.userAgent.xhr.responseTypeBlob_ =
      npf.userAgent.xhr.isResponseTypeSupported_('blob');
  }

  return /** @type {boolean} */ (npf.userAgent.xhr.responseTypeBlob_);
};

/**
 * @private {boolean?}
 */
npf.userAgent.xhr.responseTypeDocument_ = null;

/**
 * Tests for XMLHttpRequest xhr.responseType='document'.
 * @return {boolean}
 */
npf.userAgent.xhr.isResponseTypeDocumentSupported = function() {
  if (goog.isNull(npf.userAgent.xhr.responseTypeDocument_)) {
    npf.userAgent.xhr.responseTypeDocument_ =
      npf.userAgent.xhr.isResponseTypeSupported_('document');
  }

  return /** @type {boolean} */ (npf.userAgent.xhr.responseTypeDocument_);
};

/**
 * @private {boolean?}
 */
npf.userAgent.xhr.responseTypeJson_ = null;

/**
 * Tests for XMLHttpRequest xhr.responseType='json'.
 * @return {boolean}
 */
npf.userAgent.xhr.isResponseTypeJsonSupported = function() {
  if (goog.isNull(npf.userAgent.xhr.responseTypeJson_)) {
    npf.userAgent.xhr.responseTypeJson_ =
      npf.userAgent.xhr.isResponseTypeSupported_('json');
  }

  return /** @type {boolean} */ (npf.userAgent.xhr.responseTypeJson_);
};

/**
 * @private {boolean?}
 */
npf.userAgent.xhr.responseTypeText_ = null;

/**
 * Tests for XMLHttpRequest xhr.responseType='text'.
 * @return {boolean}
 */
npf.userAgent.xhr.isResponseTypeTextSupported = function() {
  if (goog.isNull(npf.userAgent.xhr.responseTypeText_)) {
    npf.userAgent.xhr.responseTypeText_ =
      npf.userAgent.xhr.isResponseTypeSupported_('text');
  }

  return /** @type {boolean} */ (npf.userAgent.xhr.responseTypeText_);
};

/**
 * @private {boolean?}
 */
npf.userAgent.xhr.responseType_ = null;

/**
 * Tests for XMLHttpRequest xhr.responseType.
 * @return {boolean}
 */
npf.userAgent.xhr.isResponseTypeSupported = function() {
  if (goog.isNull(npf.userAgent.xhr.responseType_)) {
    npf.userAgent.xhr.responseType_ = false;

    if (goog.isDef(goog.global.XMLHttpRequest)) {
      var xhr = new XMLHttpRequest();
      xhr.open('get', '/', true);

      npf.userAgent.xhr.responseType_ = 'response' in xhr;
    }
  }

  return /** @type {boolean} */ (npf.userAgent.xhr.responseType_);
};

/**
 * http://mathiasbynens.be/notes/xhr-responsetype-json#comment-4
 * @param {string} type String name of the XHR type you want to detect.
 * @return {boolean}
 * @private
 */
npf.userAgent.xhr.isResponseTypeSupported_ = function(type) {
  /** @type {boolean} */
  var support = false;

  if (goog.isDef(goog.global.XMLHttpRequest)) {
    var xhr = new XMLHttpRequest();
    xhr.open('get', '/', true);

    try {
      xhr.responseType = type;
      support = 'response' in xhr && xhr.responseType == type;
    } catch (error) { }
  }

  return support;
};

/**
 * @private {boolean?}
 */
npf.userAgent.xhr.xhr2_ = null;

/**
 * Tests for XHR2.
 * @return {boolean}
 */
npf.userAgent.xhr.isXhr2Supported = function() {
  if (goog.isNull(npf.userAgent.xhr.xhr2_)) {
    // all three of these details report consistently across all target browsers:
    // !!(window.ProgressEvent);
    // 'XMLHttpRequest' in goog.global && 'withCredentials' in new XMLHttpRequest
    npf.userAgent.xhr.xhr2_ = 'XMLHttpRequest' in goog.global &&
      'withCredentials' in new XMLHttpRequest();
  }

  return /** @type {boolean} */ (npf.userAgent.xhr.xhr2_);
};
