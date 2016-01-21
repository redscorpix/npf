goog.provide('npf.ui.form.Password');

goog.require('npf.ui.form.PasswordRenderer');
goog.require('npf.ui.form.Text');
goog.require('npf.ui.form.validation.Compare');


/**
 * @param {string} name
 * @param {npf.ui.form.PasswordRenderer=} opt_renderer
 * @param {goog.dom.DomHelper=} opt_domHelper
 * @constructor
 * @struct
 * @extends {npf.ui.form.Text}
 */
npf.ui.form.Password = function(name, opt_renderer, opt_domHelper) {
  npf.ui.form.Password.base(this, 'constructor', name, opt_renderer ||
    npf.ui.form.PasswordRenderer.getInstance(), opt_domHelper);
};
goog.inherits(npf.ui.form.Password, npf.ui.form.Text);


/**
 * @param {string} errorMessage
 * @param {npf.ui.form.Password} field
 */
npf.ui.form.Password.prototype.addCompareValidator = function(errorMessage,
    field) {
  var validator = new npf.ui.form.validation.Compare(errorMessage, field);
  this.addValidator(validator);
};
