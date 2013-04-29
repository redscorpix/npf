goog.provide('npf.ui.form.SubmitButton');


/**
 * @interface
 */
npf.ui.form.SubmitButton = function() {
};


/**
 * @type {function():boolean}
 */
npf.ui.form.SubmitButton.prototype.isEnabled;

/**
 * @type {function(boolean)}
 */
npf.ui.form.SubmitButton.prototype.setEnabled;
