goog.provide('npf.ui.form.Password');

goog.require('npf.ui.form.PasswordRenderer');
goog.require('npf.ui.form.Text');


/**
 * @param {string} name
 * @param {npf.ui.form.PasswordRenderer=} opt_renderer
 * @param {goog.dom.DomHelper=} opt_domHelper
 * @constructor
 * @extends {npf.ui.form.Text}
 */
npf.ui.form.Password = function(name, opt_renderer, opt_domHelper) {
  goog.base(this, name, opt_renderer ||
    npf.ui.form.PasswordRenderer.getInstance(), opt_domHelper);
};
goog.inherits(npf.ui.form.Password, npf.ui.form.Text);


/**
 * @enum {string}
 */
npf.ui.form.Password.ErrorMessage = {
  COMPARE: 'Пароли не&nbsp;совпадают.'
};

/**
 * @param {npf.ui.form.Password} passwordField
 * @param {string=} opt_error
 */
npf.ui.form.Password.prototype.addCompareValidator = function(passwordField,
                                                              opt_error) {
  /** @type {function(string):string} */
  var validator = function(/** @type {string} */ value) {
    if (passwordField.getValue() == value) {
      return '';
    } else {
      return opt_error || this.getCompareError();
    }
  };

  this.addValidator(goog.bind(validator, this));
};

/**
 * @return {string}
 */
npf.ui.form.Password.prototype.getCompareError = function() {
  return npf.ui.form.Password.ErrorMessage.COMPARE;
};
