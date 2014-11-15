goog.provide('npf.ui.form.validation');
goog.provide('npf.ui.form.validation.Base');
goog.provide('npf.ui.form.validation.Compare');
goog.provide('npf.ui.form.validation.Email');
goog.provide('npf.ui.form.validation.RegExp');
goog.provide('npf.ui.form.validation.Required');

goog.require('goog.format.EmailAddress');


/**
 * @param {string} errorMessage
 * @constructor
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
 * @extends {npf.ui.form.validation.Base}
 */
npf.ui.form.validation.Compare = function(errorMessage, field) {
  goog.base(this, errorMessage);

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
 * @extends {npf.ui.form.validation.Base}
 */
npf.ui.form.validation.Email = function(errorMessage) {
  goog.base(this, errorMessage);
};
goog.inherits(npf.ui.form.validation.Email, npf.ui.form.validation.Base);


/** @inheritDoc */
npf.ui.form.validation.Email.prototype.check = function(field) {
  /** @type {string} */
  var value = String(field.getValue());

  return !value || goog.format.EmailAddress.isValidAddress(value);
};


/**
 * @param {string} errorMessage
 * @param {RegExp} regExp
 * @constructor
 * @extends {npf.ui.form.validation.Base}
 */
npf.ui.form.validation.RegExp = function(errorMessage, regExp) {
  goog.base(this, errorMessage);

  this.regExp = regExp;
};
goog.inherits(npf.ui.form.validation.RegExp, npf.ui.form.validation.Base);


/** @inheritDoc */
npf.ui.form.validation.RegExp.prototype.check = function(field) {
  /** @type {string} */
  var value = String(field.getValue());

  return this.regExp.test(value);
};


/**
 * @param {string} errorMessage
 * @constructor
 * @extends {npf.ui.form.validation.Base}
 */
npf.ui.form.validation.Required = function(errorMessage) {
  goog.base(this, errorMessage);
};
goog.inherits(npf.ui.form.validation.Required, npf.ui.form.validation.Base);


/** @inheritDoc */
npf.ui.form.validation.Required.prototype.check = function(field) {
  return !field.isEmpty();
};
