goog.provide('npf.application.Settings');

goog.require('npf.string');
goog.require('goog.Disposable');
goog.require('goog.object');


/**
 * @param {Object} urlTypesMap
 * @param {Object} optionTypesMap
 * @constructor
 * @extends {goog.Disposable}
 */
npf.application.Settings = function(urlTypesMap, optionTypesMap) {
  goog.base(this);

  this.urlTypesMap_ = urlTypesMap || {};
  this.optionTypesMap_ = optionTypesMap || {};
  this.optionsMap_ = {};
  this.urlsMap_ = {};
  this.undefinedSettings_ = [];
  this.defaultSettingsMap_ = {};
};
goog.inherits(npf.application.Settings, goog.Disposable);


/**
 * @type {string}
 * @const
 */
npf.application.Settings.URLS = 'urls';

/**
 * @type {string}
 * @const
 */
npf.application.Settings.OPTIONS = 'options';

/**
 * @type {Object}
 * @private
 */
npf.application.Settings.prototype.urlTypesMap_;

/**
 * @type {Object}
 * @private
 */
npf.application.Settings.prototype.optionTypesMap_;

/**
 * @type {Object}
 * @private
 */
npf.application.Settings.prototype.optionsMap_;

/**
 * @type {Object}
 * @private
 */
npf.application.Settings.prototype.urlsMap_;

/**
 * @type {Array.<string>}
 * @private
 */
npf.application.Settings.prototype.undefinedSettings_;

/**
 * @type {Object.<string,*>}
 * @private
 */
npf.application.Settings.prototype.defaultSettingsMap_;


/** @inheritDoc */
npf.application.Settings.prototype.disposeInternal = function() {
  goog.base(this, 'disposeInternal');

  this.urlTypesMap_ = null;
  this.optionTypesMap_ = null;
  this.optionsMap_ = null;
  this.urlsMap_ = null;
  this.undefinedSettings_ = null;
  this.defaultSettingsMap_ = null;
};

/**
 * @param {!Object} jsonSettings
 * @return {boolean}
 */
npf.application.Settings.prototype.parse = function(jsonSettings) {
  goog.object.forEach(this.urlTypesMap_, function(urlType) {
    /** @type {Array.<string>} */
    var parts = [npf.application.Settings.URLS].concat(urlType.split('.'));
    var value = this.getValue_(jsonSettings, parts);

    if (goog.isDef(value)) {
      this.urlsMap_[urlType] = value;
    } else {
      this.undefinedSettings_.push(parts.join('.'));
    }
  }, this);

  goog.object.forEach(this.optionTypesMap_, function(optionType) {
    /** @type {Array.<string>} */
    var parts = [npf.application.Settings.OPTIONS]
      .concat(optionType.split('.'));
    var value = this.getValue_(jsonSettings, parts);

    if (goog.isDef(value)) {
      this.optionsMap_[optionType] = value;
    } else {
      this.undefinedSettings_.push(parts.join('.'));
    }
  }, this);

  return !this.undefinedSettings_.length;
};

/**
 * @param {Object} jsonSettings
 * @param {Array.<string>} keys
 * @return {*}
 * @private
 */
npf.application.Settings.prototype.getValue_ = function(jsonSettings, keys) {
  var checking = jsonSettings;
  var option = keys.join('.');
  var i = 0;

  while (goog.isDef(checking) && i < keys.length) {
    checking = checking[keys[i]];
    i++;
  }

  if (!goog.isDef(checking) && goog.isDef(this.defaultSettingsMap_[option])) {
    checking = this.defaultSettingsMap_[option];
  }

  return checking;
};

/**
 * @param {string} urlType
 * @param {Object=} opt_params
 * @return {string}
 */
npf.application.Settings.prototype.getUrl = function(urlType, opt_params) {
  /** @type {string} */
  var url = this.urlsMap_[urlType];

  if (!goog.isDef(url)) {
    throw Error('urlType "' + urlType + '" not found in settings.');
  }

  return npf.string.supplant(url, opt_params);
};

/**
 * @param {string} optionType
 * @return {*}
 */
npf.application.Settings.prototype.getOption = function(optionType) {
  var option = this.optionsMap_[optionType];

  if (!goog.isDef(option)) {
    throw Error('optionType "' + optionType + '" not found in settings.');
  }

	return option;
};

/**
 * @return {Array.<string>}
 */
npf.application.Settings.prototype.getUndefinedSettings = function() {
  return this.undefinedSettings_;
};

/**
 * @param {string} urlType
 * @param {string} url
 * @return {npf.application.Settings}
 */
npf.application.Settings.prototype.setDefaultUrl = function(urlType, url) {
  this.defaultSettingsMap_[npf.application.Settings.URLS + '.' + urlType] = url;

  return this;
};

/**
 * @param {string} optionType
 * @param {*} value
 * @return {npf.application.Settings}
 */
npf.application.Settings.prototype.setDefaultOption = function(optionType, value) {
  /** @type {string} */
  var key = npf.application.Settings.OPTIONS + '.' + optionType;

  this.defaultSettingsMap_[key] = value;

  return this;
};
