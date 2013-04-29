goog.provide('npf.arch.deflate.inflator.HuftList');


/**
 * @constructor
 */
npf.arch.deflate.inflator.HuftList = function() {
  /**
   * @type {npf.arch.deflate.inflator.HuftList}
   */
  this.next = null;

  /**
   * @type {Array.<npf.arch.deflate.inflator.HuftNode>}
   */
  this.list = null;
};
