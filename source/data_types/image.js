goog.provide('npf.dataTypes.Image');

goog.require('goog.math.Size');


/**
 * @param {string} src
 * @param {number} width
 * @param {number} height
 * @constructor
 */
npf.dataTypes.Image = function(src, width, height) {

  /**
   * @type {string}
   */
  this.src = src;

  /**
   * @type {number}
   */
  this.width = width;

  /**
   * @type {number}
   */
  this.height = height;
};


/**
 * @param {number} sourceWidth
 * @param {number} sourceHeight
 * @param {number|null=} opt_maxWidth
 * @param {number|null=} opt_maxHeight
 * @return {!goog.math.Size}
 */
npf.dataTypes.Image.getSize = function(sourceWidth, sourceHeight, opt_maxWidth,
    opt_maxHeight) {
  /** @type {number} */
  var width = sourceWidth;
  /** @type {number} */
  var height = sourceHeight;

  if (goog.isNumber(opt_maxWidth) && goog.isNumber(opt_maxHeight)) {
    if (width > opt_maxWidth || height > opt_maxHeight) {
      if (opt_maxHeight < height * opt_maxWidth / width) {
        height = opt_maxHeight;
        width = Math.round(width * opt_maxHeight / sourceHeight);
      } else {
        width = opt_maxWidth;
        height = Math.round(height * opt_maxWidth / sourceWidth);
      }
    }
  } else if (goog.isNumber(opt_maxWidth)) {
    if (width > opt_maxWidth) {
      width = opt_maxWidth;
      height = Math.round(height * opt_maxWidth / sourceWidth);
    }
  } else if (goog.isNumber(opt_maxHeight)) {
    if (height > opt_maxHeight) {
      height = opt_maxHeight;
      width = Math.round(width * opt_maxHeight / sourceHeight);
    }
  }

  return new goog.math.Size(width, height);
};

/**
 * @return {!npf.dataTypes.Image}
 */
npf.dataTypes.Image.prototype.clone = function() {
  return new npf.dataTypes.Image(this.src, this.width, this.height);
};

/**
 * @param {number|null=} opt_maxWidth
 * @param {number|null=} opt_maxHeight
 * @return {!goog.math.Size}
 */
npf.dataTypes.Image.prototype.getSize = function(opt_maxWidth, opt_maxHeight) {
  return npf.dataTypes.Image.getSize(
    this.width, this.height, opt_maxWidth, opt_maxHeight);
};
