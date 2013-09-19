goog.provide('npf.Application');

goog.require('goog.dom');
goog.require('goog.events.EventTarget');
goog.require('npf.application.Settings');


/**
 * Application class.
 * @param {npf.application.Settings=} opt_settings
 * @param {goog.dom.DomHelper=} opt_domHelper
 * @constructor
 * @extends {goog.events.EventTarget}
 */
npf.Application = function(opt_settings, opt_domHelper) {
  goog.base(this);

  this.domHelper_ = opt_domHelper || goog.dom.getDomHelper();

  this.settings_ = opt_settings || new npf.application.Settings();
  this.registerDisposable(this.settings_);
  this.settings_.setParentEventTarget(this);
};
goog.inherits(npf.Application, goog.events.EventTarget);


/**
 * @private {goog.dom.DomHelper}
 */
npf.Application.prototype.domHelper_;

/**
 * @private {boolean}
 */
npf.Application.prototype.inited_ = false;

/**
 * @private {npf.application.Settings}
 */
npf.Application.prototype.settings_;


/** @inheritDoc */
npf.Application.prototype.disposeInternal = function() {
	goog.base(this, 'disposeInternal');

	this.domHelper_ = null;
  this.settings_ = null;
};

npf.Application.prototype.init = function() {
	if (!this.isInited()) {
		this.initInternal();
	}
};

/**
 * @protected
 */
npf.Application.prototype.initInternal = function() {
  this.inited_ = true;
};

/**
 * @return {boolean}
 */
npf.Application.prototype.isInited = function() {
	return this.inited_;
};

/**
 * @return {goog.dom.DomHelper}
 */
npf.Application.prototype.getDomHelper = function() {
  return this.domHelper_;
};

/**
 * @param {goog.dom.DomHelper} domHelper
 */
npf.Application.prototype.setDomHelper = function(domHelper) {
  this.domHelper_ = domHelper;
};

/**
 * @param {string} key
 * @return {*}
 */
npf.Application.prototype.getOption = function(key) {
  return this.settings_.getOption(key);
};

/**
 * @return {npf.application.Settings}
 */
npf.Application.prototype.getSettings = function() {
  return this.settings_;
};

/**
 * @param {string} key
 * @param {Object=} opt_params
 * @return {!goog.Uri}
 */
npf.Application.prototype.getUri = function(key, opt_params) {
  return this.settings_.getUri(key, opt_params);
};

/**
 * @param {string} key
 * @param {Object=} opt_params
 * @return {string}
 */
npf.Application.prototype.getUrl = function(key, opt_params) {
  return this.settings_.getUrl(key, opt_params);
};
