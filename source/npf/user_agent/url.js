goog.provide('npf.userAgent.url');

goog.require('goog.userAgent');
goog.require('npf.userAgent.utils');


/**
 * @private {boolean?}
 */
npf.userAgent.url.blobUrl_ = null;

/**
 * Detects support for creating Blob URLs.
 * @return {boolean}
 */
npf.userAgent.url.isBlobUrlSupported = function() {
  if (goog.isNull(npf.userAgent.url.blobUrl_)) {
    var key = npf.userAgent.utils.prefixed('URL', goog.global, true);
    var url = key && goog.global[key];

    npf.userAgent.url.blobUrl_ =
      !!url && 'revokeObjectURL' in url && 'createObjectURL' in url;
  }

  return /** @type {boolean} */ (npf.userAgent.url.blobUrl_);
};

/**
 * @private {boolean?}
 */
npf.userAgent.url.dataUri_ = null;

/**
 * @private {boolean?}
 */
npf.userAgent.url.dataUriBig_ = null;

/**
 * @const {string}
 */
npf.userAgent.url.DATA_URI_HALF_SRC =
  'R0lGODlhAQABAIAAAAAAAP///ywAAAAAAQABAAACAUwAOw==';

/**
 * @const {string}
 */
npf.userAgent.url.DATA_URI_PREFIX_SRC = 'data:image/gif;base64,';

/**
 * Detects support for data URIs. Provides a second argument to report support
 * for data URIs over 32kb in size (false in IE8).
 * @param {function(this:SCOPE,boolean,boolean)} callback
 * @param {SCOPE=} opt_scope
 * @template SCOPE
 */
npf.userAgent.url.isDataUriSupported = function(callback, opt_scope) {
  if (
    goog.isBoolean(npf.userAgent.url.dataUri_) &&
    goog.isBoolean(npf.userAgent.url.dataUriBig_)
  ) {
    callback.call(
      opt_scope, npf.userAgent.url.dataUri_, npf.userAgent.url.dataUriBig_);
  } else {
    /** @type {function(boolean=,boolean=)} */
    var complete = function(opt_support, opt_bigSupport) {
      npf.userAgent.url.dataUri_ = !!opt_support;
      npf.userAgent.url.dataUriBig_ = !!opt_bigSupport;
      callback.call(
        opt_scope, npf.userAgent.url.dataUri_, npf.userAgent.url.dataUriBig_);
    };

    // IE7 throw a mixed content warning on HTTPS for this test, so we'll
    // just blacklist it (we know it doesn't support data URIs anyway)
    if (-1 < goog.userAgent.getUserAgentString().indexOf('MSIE 7.')) {
      // Keep the test async
      setTimeout(complete, 10);
    }

    var datauri = new Image();
    datauri.onerror = function() {
      complete();
    };
    datauri.onload = function() {
      if (1 == datauri.width && 1 == datauri.height) {
        // Once we have datauri, let's check to see if we can use data URIs over
        // 32kb (IE8 can't).
        var datauriBig = new Image();
        datauriBig.onerror = function() {
          complete(true, false);
        };
        datauriBig.onload = function() {
          complete(true, 1 == datauriBig.width && 1 == datauriBig.height);
        };

        /** @type {string} */
        var base64str = npf.userAgent.url.DATA_URI_HALF_SRC;

        while (33000 > base64str.length) {
          base64str = '\r\n' + base64str;
        }

        datauriBig.src = npf.userAgent.url.DATA_URI_PREFIX_SRC + base64str;
      } else {
        complete();
      }
    };
    datauri.src = npf.userAgent.url.DATA_URI_PREFIX_SRC +
      npf.userAgent.url.DATA_URI_HALF_SRC;
  }
};

/**
 * @private {boolean?}
 */
npf.userAgent.url.parser_ = null;

/**
 * Check if browser implements the URL constructor for parsing URLs.
 * @return {boolean}
 */
npf.userAgent.url.isParserSupported = function() {
  if (goog.isNull(npf.userAgent.url.parser_)) {
    npf.userAgent.url.parser_ = false;

    try {
      /** @type {string} */
      var urlStr = 'http://123.com/';
      // have to actually try use it, because Safari defines a dud constructor
      var url = new URL(urlStr);

      npf.userAgent.url.parser_ = url['href'] === urlStr;
    } catch (e) { }
  }

  return /** @type {boolean} */ (npf.userAgent.url.parser_);
};
