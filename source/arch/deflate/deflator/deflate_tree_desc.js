goog.provide('npf.arch.deflate.deflator.DeflateTreeDesc');


/**
 * @constructor
 */
npf.arch.deflate.deflator.DeflateTreeDesc = function() {

  /**
   * The dynamic tree
   * @type {Array.<npf.arch.deflate.deflator.DeflateCt>}
   */
  this.dynTree = null;

  /**
   * corresponding static tree or NULL
   * @type {Array.<npf.arch.deflate.deflator.DeflateCt>}
   */
  this.staticTree = null;

  /**
   * Extra bits for each code or NULL
   * @type {Array.<number>}
   */
  this.extraBits = null;

  /**
   * Base index for extraBits
   * @type {number}
   */
  this.extraBase = 0;

  /**
   * Max number of elements in the tree
   * @type {number}
   */
  this.elems = 0;

  /**
   * Max bit length for the codes
   * @type {number}
   */
  this.maxLength = 0;

  /**
   * Largest code with non zero frequency
   * @type {number}
   */
  this.maxCode = 0;
};
