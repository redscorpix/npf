goog.provide('npf.userAgent.file');

goog.require('npf.userAgent.utils');


/**
 * Tests for the File API specification.
 *
 * Tests for objects specific to the File API W3C specification without
 * being redundant (don't bother testing for Blob since it is assumed
 * to be the File object's prototype.)
 * @return {boolean}
 */
npf.userAgent.file.isFileReaderSupported = function() {
  return !!(goog.global.File && goog.global.FileList && goog.global.FileReader);
};

/**
 * @return {boolean}
 */
npf.userAgent.file.isFileSystemSupported = function() {
  return !!npf.userAgent.utils.prefixed('requestFileSystem', goog.global);
};
