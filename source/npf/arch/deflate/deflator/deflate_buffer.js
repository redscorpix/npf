goog.provide('npf.arch.deflate.deflator.DeflateBuffer');


/**
 * @constructor
 */
npf.arch.deflate.deflator.DeflateBuffer = function() {

  /**
   * @type {number}
   */
  this.len = 0;

  /**
   * @type {npf.arch.deflate.deflator.DeflateBuffer}
   */
  this.next = null;

  /**
   * @type {number}
   */
  this.off = 0;

  /**
   * @type {Array.<number>}
   */
  this.ptr = []; // new Array(OUTBUFSIZ); // ptr.length is never read
};
