goog.provide('npf.Application');

goog.require('goog.events.EventTarget');
goog.require('goog.userAgent');
goog.require('npf.fx.Animation');


/**
 * @param {npf.application.Settings} settings
 * @constructor
 * @extends {goog.events.EventTarget}
 */
npf.Application = function(settings) {
  goog.base(this);

  this.settings_ = settings;
  this.registerDisposable(this.settings_);
};
goog.inherits(npf.Application, goog.events.EventTarget);


/**
 * @type {npf.application.Settings}
 * @private
 */
npf.Application.prototype.settings_;


npf.Application.prototype.init = function() {

};

/**
 * @param {string} urlType
 * @param {Object=} opt_params
 * @return {string}
 */
npf.Application.prototype.getUrl = function(urlType, opt_params) {
  return this.settings_.getUrl(urlType, opt_params);
};

/**
 * @param {string} optionType
 * @return {*}
 */
npf.Application.prototype.getOption = function(optionType) {
  return this.settings_.getOption(optionType);
};
