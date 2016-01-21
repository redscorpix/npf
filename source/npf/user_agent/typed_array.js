goog.provide('npf.userAgent.typedArray');


/**
 * Detects support for native binary data manipulation via Typed Arrays
 * in JavaScript.
 * Does not check for DataView support;
 * use `npf.userAgent.dataView.isSupported` for that.
 * @return {boolean}
 */
npf.userAgent.typedArray.isSupported = function() {
  // Should fail in:
  // Internet Explorer <= 9
  // Firefox <= 3.6
  // Chrome <= 6.0
  // iOS Safari < 4.2
  // Safari < 5.1
  // Opera < 11.6
  // Opera Mini, <= 7.0
  // Android Browser < 4.0
  // Blackberry Browser < 10.0

  return 'ArrayBuffer' in goog.global;
};
