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
   * Max number of elements in the tree
   * @type {number}
   */
  this.elems = 0;

  /**
   * Base index for extraBits
   * @type {number}
   */
  this.extraBase = 0;

  /**
   * Extra bits for each code or NULL
   * @type {Array.<number>}
   */
  this.extraBits = null;

  /**
   * Largest code with non zero frequency
   * @type {number}
   */
  this.maxCode = 0;

  /**
   * Max bit length for the codes
   * @type {number}
   */
  this.maxLength = 0;

  /**
   * corresponding static tree or NULL
   * @type {Array.<npf.arch.deflate.deflator.DeflateCt>}
   */
  this.staticTree = null;
};
