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

	npf.fx.Animation.enabled = this.isAnimationEnabled();
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

/**
 * @return {boolean}
 */
npf.Application.prototype.isAnimationEnabled = function() {
  /** @type {boolean} */
  var oldIe = goog.userAgent.IE && 9 > parseInt(goog.userAgent.VERSION, 10);
  /** @type {boolean} */
  var fineResolution = window.screen.width && 1024 < window.screen.width;
  /** @type {boolean} */
  var oldNotWinGecko = goog.userAgent.GECKO && 2 > parseInt(goog.userAgent.VERSION, 10) && !goog.userAgent.WINDOWS;

  return !oldIe && fineResolution && !oldNotWinGecko;
};
