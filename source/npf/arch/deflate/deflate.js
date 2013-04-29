goog.provide('npf.arch.deflate');

goog.require('npf.arch.deflate.Deflator');
goog.require('npf.arch.deflate.Inflator');


/**
 * Does deflate compression/decompression.
 * Source: https://github.com/beatgammit/deflate-js
 * @param {Array.<number>} arr
 * @param {number=} opt_level
 * @return {!Array.<number>}
 */
npf.arch.deflate.deflate = function(arr, opt_level) {
  var deflator = new npf.arch.deflate.Deflator();

  return deflator.deflate(arr, opt_level);
};

/**
 * @param {Array.<number>} arr
 * @return {!Array.<number>}
 */
npf.arch.deflate.inflate = function(arr) {
  var inflator = new npf.arch.deflate.Inflator();

  return inflator.inflate(arr);
};
