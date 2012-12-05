goog.provide('npf.Application');

goog.require('goog.events.EventTarget');
goog.require('goog.userAgent');
goog.require('npf.application.Settings');


/**
 * @param {npf.application.Settings=} opt_settings
 * @constructor
 * @extends {goog.events.EventTarget}
 */
npf.Application = function(opt_settings) {
  goog.base(this);

  this.settings_ = opt_settings || null;
  this.registerDisposable(this.settings_);
};
goog.inherits(npf.Application, goog.events.EventTarget);


/**
 * @type {npf.application.Settings}
 * @private
 */
npf.Application.prototype.settings_;

/**
 * @type {boolean}
 * @private
 */
npf.Application.prototype.inited_ = false;


/** @inheritDoc */
npf.Application.prototype.disposeInternal = function() {
	goog.base(this, 'disposeInternal');

	this.settings_ = null;
};

npf.Application.prototype.init = function() {
	if (!this.inited_) {
		this.inited_ = true;
		this.initInternal();
	}
};

/**
 * @protected
 */
npf.Application.prototype.initInternal = goog.nullFunction;

/**
 * @return {boolean}
 */
npf.Application.prototype.isInited = function() {
	return this.inited_;
};

/**
 * @param {string} urlType
 * @param {Object=} opt_params
 * @return {string}
 */
npf.Application.prototype.getUrl = function(urlType, opt_params) {
  return this.settings_ ? this.settings_.getUrl(urlType, opt_params) : '';
};

/**
 * @param {string} optionType
 * @return {*}
 */
npf.Application.prototype.getOption = function(optionType) {
  return this.settings_ ? this.settings_.getOption(optionType) : undefined;
};
