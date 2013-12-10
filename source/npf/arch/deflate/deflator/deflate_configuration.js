goog.provide('npf.arch.deflate.deflator.DeflateConfiguration');


/**
 * Values for this.maxLazyMatch, this.goodMatch and this.maxChainLength,
 * depending on the desired pack level (0..9). The values given below have
 * been tuned to exclude worst case performance for pathological files.
 * Better values may be found for specific files.
 * @param {number} a
 * @param {number} b
 * @param {number} c
 * @param {number} d
 * @constructor
 */
npf.arch.deflate.deflator.DeflateConfiguration = function(a, b, c, d) {

  /**
   * Reduce lazy search above this match length
   * @type {number}
   */
  this.goodLength = a;

  /**
   * @type {number}
   */
  this.maxChain = d;

  /**
   * Do not perform lazy search above this match length
   * @type {number}
   */
  this.maxLazy = b;

  /**
   * Quit search above this match length
   * @type {number}
   */
  this.niceLength = c;
};
