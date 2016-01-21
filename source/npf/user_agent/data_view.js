goog.provide('npf.userAgent.dataView');


/**
 * Detects support for the DataView interface for reading data from
 * an ArrayBuffer as part of the Typed Array spec.
 * @return {boolean}
 */
npf.userAgent.dataView.isSupported = function() {
  return goog.isDef(goog.global['DataView']) &&
    'getFloat64' in DataView.prototype;
};
