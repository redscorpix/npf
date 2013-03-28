goog.provide('npf.arch.deflate.inflator.HuftNode');


/**
 * @constructor
 */
npf.arch.deflate.inflator.HuftNode = function() {
  /**
   * number of extra bits or operation
   * @type {number}
   */
  this.e = 0;

  /**
   * number of bits in this code or subcode
   * @type {number}
   */
  this.b = 0;

  /**
   * literal, length base, or distance base
   * @type {number}
   */
  this.n = 0;

  /**
   * (npf.arch.deflate.inflator.HuftNode) pointer to next level of table
   */
  this.t = null;
};
