goog.provide('npf.graphics.Scale');

goog.require('goog.math.Size');


/**
 * @param {number|null=} opt_limitWidth
 * @param {number|null=} opt_limitHeight
 * @constructor
 */
npf.graphics.Scale = function(opt_limitWidth, opt_limitHeight) {
  /** @type {number} */
  var width = goog.isNumber(opt_limitWidth) ? opt_limitWidth : Infinity;
  /** @type {number} */
  var height = goog.isNumber(opt_limitHeight) ? opt_limitHeight : Infinity;

  /**
   * @type {!goog.math.Size}
   */
  this.limits = new goog.math.Size(width, height);
};


/**
 * @param {number|goog.math.Size} width
 * @param {number|null=} opt_height
 * @return {!goog.math.Size}
 */
npf.graphics.Scale.getSize = function(width, opt_height) {
  var w = /** @type {number} */ (goog.isNumber(width) ? width : width.width);
  var h = /** @type {number} */ (
    goog.isNumber(opt_height) ? opt_height : width.height);

  return new goog.math.Size(w, h);
};

/**
 * @param {goog.math.Size} size
 * @param {goog.math.Size} limits
 * @param {number|null=} opt_maxScale Defaults to 1.
 * @return {!goog.math.Size}
 */
npf.graphics.Scale.contain = function(size, limits, opt_maxScale) {
  return (new npf.graphics.Scale(limits.width, limits.height)).
    contain(size, opt_maxScale);
};

/**
 * @param {goog.math.Size} size
 * @param {goog.math.Size} limits
 * @return {!goog.math.Size}
 */
npf.graphics.Scale.cover = function(size, limits) {
  return (new npf.graphics.Scale(limits.width, limits.height)).cover(size);
};

/**
 * @param {goog.math.Size} size
 * @param {goog.math.Size} limits
 * @param {number|null=} opt_xScale
 * @param {number|null=} opt_yScale
 * @return {!goog.math.Size}
 */
npf.graphics.Scale.percentage = function(size, limits, opt_xScale, opt_yScale) {
  return (new npf.graphics.Scale(limits.width, limits.height)).
    percentage(size, opt_xScale, opt_yScale);
};


/**
 * @param {goog.math.Size} size
 * @param {number|null=} opt_maxScale Defaults to 1.
 * @return {!goog.math.Size}
 */
npf.graphics.Scale.prototype.contain = function(size, opt_maxScale) {
  /** @type {number} */
  var xScale = size.width ? this.limits.width / size.width : 0;
  /** @type {number} */
  var yScale = size.height ? this.limits.height / size.height : 0;
  /** @type {number} */
  var scale = Math.min(
    xScale || Infinity, yScale || Infinity, opt_maxScale || 1);

  return this.percentage(size, scale);
};

/**
 * @param {goog.math.Size} size
 * @return {!goog.math.Size}
 */
npf.graphics.Scale.prototype.cover = function(size) {
  /** @type {number} */
  var xScale = size.width ? this.limits.width / size.width : 0;
  /** @type {number} */
  var yScale = size.height ? this.limits.height / size.height : 0;
  /** @type {number} */
  var scale = Math.max(xScale || Infinity, yScale || Infinity);

  return this.percentage(size, scale);
};

/**
 * @param {goog.math.Size} size
 * @param {number|null=} opt_xScale
 * @param {number|null=} opt_yScale
 * @return {!goog.math.Size}
 */
npf.graphics.Scale.prototype.percentage = function(size, opt_xScale,
    opt_yScale) {
  /** @type {number} */
  var xScale = opt_xScale || opt_yScale || 1;
  /** @type {number} */
  var yScale = opt_yScale || opt_xScale || 1;

  return size.clone().scale(xScale, yScale).round();
};
