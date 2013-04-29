goog.provide('npf.Application');

goog.require('goog.dom');
goog.require('goog.events.EventTarget');
goog.require('npf.application.Settings');


/**
 * @param {npf.application.Settings=} opt_settings
 * @param {goog.dom.DomHelper=} opt_domHelper
 * @constructor
 * @extends {goog.events.EventTarget}
 */
npf.Application = function(opt_settings, opt_domHelper) {
  goog.base(this);

  this.settings_ = opt_settings || new npf.application.Settings();
  this.registerDisposable(this.settings_);
  this.settings_.setParentEventTarget(this);

  this.domHelper_ = opt_domHelper || goog.dom.getDomHelper();
};
goog.inherits(npf.Application, goog.events.EventTarget);


/**
 * @type {npf.application.Settings}
 * @private
 */
npf.Application.prototype.settings_;

/**
 * @type {goog.dom.DomHelper}
 * @private
 */
npf.Application.prototype.domHelper_;

/**
 * @type {boolean}
 * @private
 */
npf.Application.prototype.inited_ = false;


/** @inheritDoc */
npf.Application.prototype.disposeInternal = function() {
	goog.base(this, 'disposeInternal');

  this.settings_ = null;
	this.domHelper_ = null;
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
 * @return {npf.application.Settings}
 */
npf.Application.prototype.getSettings = function() {
  return this.settings_;
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

/**
 * @param {string} key
 * @return {*}
 */
npf.Application.prototype.getOption = function(key) {
  return this.settings_.getOption(key);
};
