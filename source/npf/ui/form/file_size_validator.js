goog.provide('npf.ui.form.FileSizeValidator');

goog.require('npf.ui.form.validation.Base');


/**
 * @param {string} errorMessage
 * @param {number=} opt_maxSize
 * @param {number=} opt_minSize
 * @constructor
 * @struct
 * @extends {npf.ui.form.validation.Base}
 */
npf.ui.form.FileSizeValidator = function(errorMessage, opt_maxSize,
    opt_minSize) {
  npf.ui.form.FileSizeValidator.base(this, 'constructor', errorMessage);

  /**
   * @private {number}
   */
  this.maxSize_ = opt_maxSize || Infinity;

  /**
   * @private {number}
   */
  this.minSize_ = opt_minSize || 0;
};
goog.inherits(npf.ui.form.FileSizeValidator, npf.ui.form.validation.Base);


/**
 * @param {*} value
 * @param {number} maxSize
 * @param {number} minSize
 * @return {boolean}
 */
npf.ui.form.FileSizeValidator.check = function(value, maxSize, minSize) {
  return value instanceof File &&
    value.size <= maxSize && value.size >= minSize;
};


/** @inheritDoc */
npf.ui.form.FileSizeValidator.prototype.check = function(field) {
  var value = field.getValue();

  return npf.ui.form.FileSizeValidator.check(
    value, this.maxSize_, this.minSize_);
};

/**
 * @return {number}
 */
npf.ui.form.FileSizeValidator.prototype.getMaxSize = function() {
  return this.maxSize_;
};

/**
 * @param {number} size
 */
npf.ui.form.FileSizeValidator.prototype.setMaxSize = function(size) {
  this.maxSize_ = size;
};

/**
 * @return {number}
 */
npf.ui.form.FileSizeValidator.prototype.getMinSize = function() {
  return this.minSize_;
};

/**
 * @param {number} size
 */
npf.ui.form.FileSizeValidator.prototype.setMinSize = function(size) {
  this.minSize_ = size;
};
