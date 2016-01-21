goog.provide('npf.ui.form.validation');
goog.provide('npf.ui.form.validation.Base');
goog.provide('npf.ui.form.validation.Compare');
goog.provide('npf.ui.form.validation.Email');
goog.provide('npf.ui.form.validation.MaxLength');
goog.provide('npf.ui.form.validation.MinLength');
goog.provide('npf.ui.form.validation.RegExp');
goog.provide('npf.ui.form.validation.Required');

goog.require('goog.format.EmailAddress');


/**
 * @param {string} errorMessage
 * @constructor
 * @struct
 */
npf.ui.form.validation.Base = function(errorMessage) {

  /**
   * @private {string}
   */
  this.errorMessage_ = errorMessage;
};


/**
 * @param {npf.ui.form.Field} field
 * @return {boolean}
 */
npf.ui.form.validation.Base.prototype.isValid = function(field) {
  return this.check(field);
};

/**
 * @param {npf.ui.form.Field} field
 * @return {boolean}
 * @protected
 */
npf.ui.form.validation.Base.prototype.check = function(field) {
  return true;
};

/**
 * @return {string}
 */
npf.ui.form.validation.Base.prototype.getErrorMessage = function() {
  return this.errorMessage_;
};

/**
 * @param {string} message
 * @protected
 */
npf.ui.form.validation.Base.prototype.setErrorMessage = function(message) {
  this.errorMessage_ = message;
};


/**
 * @param {string} errorMessage
 * @param {npf.ui.form.Field} field
 * @constructor
 * @struct
 * @extends {npf.ui.form.validation.Base}
 */
npf.ui.form.validation.Compare = function(errorMessage, field) {
  npf.ui.form.validation.Compare.base(this, 'constructor', errorMessage);

  /**
   * @type {npf.ui.form.Field}
   */
  this.field = field;
};
goog.inherits(npf.ui.form.validation.Compare, npf.ui.form.validation.Base);


/** @inheritDoc */
npf.ui.form.validation.Compare.prototype.check = function(field) {
  return this.field.equalsValue(field.getValue());
};


/**
 * @param {string} errorMessage
 * @constructor
 * @struct
 * @extends {npf.ui.form.validation.Base}
 */
npf.ui.form.validation.Email = function(errorMessage) {
  npf.ui.form.validation.Email.base(this, 'constructor', errorMessage);
};
goog.inherits(npf.ui.form.validation.Email, npf.ui.form.validation.Base);


/** @inheritDoc */
npf.ui.form.validation.Email.prototype.check = function(field) {
  /** @type {string} */
  var value = field.getValue() + '';

  return !value || goog.format.EmailAddress.isValidAddress(value);
};


/**
 * @param {string} errorMessage
 * @param {number} maxLength
 * @constructor
 * @struct
 * @extends {npf.ui.form.validation.Base}
 */
npf.ui.form.validation.MaxLength = function(errorMessage, maxLength) {
  npf.ui.form.validation.MaxLength.base(this, 'constructor', errorMessage);

  /**
   * @type {number}
   */
  this.maxLength = maxLength;
};
goog.inherits(npf.ui.form.validation.MaxLength, npf.ui.form.validation.Base);


/** @inheritDoc */
npf.ui.form.validation.MaxLength.prototype.check = function(field) {
  /** @type {string} */
  var value = field.getValue() + '';

  return value.length <= this.maxLength;
};


/**
 * @param {string} errorMessage
 * @param {number} minLength
 * @constructor
 * @struct
 * @extends {npf.ui.form.validation.Base}
 */
npf.ui.form.validation.MinLength = function(errorMessage, minLength) {
  npf.ui.form.validation.MinLength.base(this, 'constructor', errorMessage);

  /**
   * @type {number}
   */
  this.minLength = minLength;
};
goog.inherits(npf.ui.form.validation.MinLength, npf.ui.form.validation.Base);


/** @inheritDoc */
npf.ui.form.validation.MinLength.prototype.check = function(field) {
  /** @type {string} */
  var value = field.getValue() + '';

  return value.length >= this.minLength;
};


/**
 * @param {string} errorMessage
 * @param {RegExp} regExp
 * @constructor
 * @struct
 * @extends {npf.ui.form.validation.Base}
 */
npf.ui.form.validation.RegExp = function(errorMessage, regExp) {
  npf.ui.form.validation.RegExp.base(this, 'constructor', errorMessage);

  /**
   * @type {RegExp}
   */
  this.regExp = regExp;
};
goog.inherits(npf.ui.form.validation.RegExp, npf.ui.form.validation.Base);


/** @inheritDoc */
npf.ui.form.validation.RegExp.prototype.check = function(field) {
  /** @type {string} */
  var value = field.getValue() + '';

  return this.regExp.test(value);
};


/**
 * @param {string} errorMessage
 * @constructor
 * @struct
 * @extends {npf.ui.form.validation.Base}
 */
npf.ui.form.validation.Required = function(errorMessage) {
  npf.ui.form.validation.Required.base(this, 'constructor', errorMessage);
};
goog.inherits(npf.ui.form.validation.Required, npf.ui.form.validation.Base);


/** @inheritDoc */
npf.ui.form.validation.Required.prototype.check = function(field) {
  return !field.isEmpty();
};
