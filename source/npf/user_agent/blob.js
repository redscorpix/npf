goog.provide('npf.userAgent.blob');


/**
 * Detects support for the Blob constructor, for creating file-like objects
 * of immutable, raw data.
 * @return {boolean}
 */
npf.userAgent.blob.isSupported = function() {
  try {
    return !!new Blob();
  } catch (e) {
    return false;
  }
};
