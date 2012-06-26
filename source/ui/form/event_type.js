goog.provide('npf.ui.form.EventType');

goog.require('goog.events');


/**
 * @enum {string}
 */
npf.ui.form.EventType = {
	/**
	 * value (*)
	 */
	CHANGE: goog.events.getUniqueId('change'),
	/**
	 * value (*)
	 * error (string)
	 */
	ERROR: goog.events.getUniqueId('error'),
	/**
	 * value (*)
	 */
	VALID: goog.events.getUniqueId('valid'),

	SUBMIT: goog.events.getUniqueId('submit')
};
