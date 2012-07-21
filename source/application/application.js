goog.provide('npf.Application');

goog.require('goog.events.EventTarget');
goog.require('goog.userAgent');


/**
 * @param {npf.application.Settings} settings
 * @constructor
 * @extends {goog.events.EventTarget}
 */
npf.Application = function(settings) {
	goog.base(this);

	this._settings = settings;
	this.registerDisposable(this._settings);
};
goog.inherits(npf.Application, goog.events.EventTarget);


/**
 * @type {npf.application.Settings}
 * @private
 */
npf.Application.prototype._settings;


npf.Application.prototype.init = function() {

};

/**
 * @param {string} urlType
 * @param {Object=} opt_params
 * @return {string}
 */
npf.Application.prototype.getUrl = function(urlType, opt_params) {
	return this._settings.getUrl(urlType, opt_params);
};

/**
 * @param {string} optionType
 * @return {*}
 */
npf.Application.prototype.getOption = function(optionType) {
	return this._settings.getOption(optionType);
};
