goog.provide('npf.ui.form.FileTypeValidator');

goog.require('goog.array');
goog.require('npf.ui.form.validation.Base');


/**
 * @param {string} errorMessage
 * @param {Array.<string>} types
 * @constructor
 * @struct
 * @extends {npf.ui.form.validation.Base}
 */
npf.ui.form.FileTypeValidator = function(errorMessage, types) {
  npf.ui.form.FileTypeValidator.base(this, 'constructor', errorMessage);

  /**
   * @private {Array.<string>}
   */
  this.types_ = types;
};
goog.inherits(npf.ui.form.FileTypeValidator, npf.ui.form.validation.Base);


/**
 * @param {*} value
 * @param {Array.<string>} types
 * @return {boolean}
 */
npf.ui.form.FileTypeValidator.check = function(value, types) {
  if (value instanceof File) {
    /** @type {string} */
    var fileType = value.type.toUpperCase();

    return goog.array.some(types, function(type) {
      return -1 < fileType.indexOf(type.toUpperCase());
    });
  }

  return false;
};

/** @inheritDoc */
npf.ui.form.FileTypeValidator.prototype.check = function(field) {
  var value = field.getValue();
  return npf.ui.form.FileTypeValidator.check(value, this.types_);
};

/**
 * @return {Array.<string>}
 */
npf.ui.form.FileTypeValidator.prototype.getTypes = function() {
  return this.types_;
};

/**
 * @param {Array.<string>} types
 */
npf.ui.form.FileTypeValidator.prototype.setTypes = function(types) {
  this.types_ = types;
};
