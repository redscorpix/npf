goog.provide('npf.application.Settings');

goog.require('goog.Uri');
goog.require('goog.array');
goog.require('goog.events.EventTarget');
goog.require('goog.object');
goog.require('npf.string');


/**
 * Class for application settings.
 * @param {Object.<string>|Array.<string>=} opt_urlKeys
 * @param {Object.<string>|Array.<string>=} opt_optionKeys
 * @constructor
 * @extends {goog.events.EventTarget}
 */
npf.application.Settings = function(opt_urlKeys, opt_optionKeys) {
  if (opt_urlKeys) {
    if (goog.isArray(opt_urlKeys)) {
      this.urlKeys_ = opt_urlKeys;
    } else {
      this.urlKeys_ = goog.object.getValues(opt_urlKeys);
    }
  } else {
    this.urlKeys_ = [];
  }

  if (opt_optionKeys) {
    if (goog.isArray(opt_optionKeys)) {
      this.optionKeys_ = opt_optionKeys;
    } else {
      this.optionKeys_ = goog.object.getValues(opt_optionKeys);
    }
  } else {
    this.optionKeys_ = [];
  }

  this.defaultsMap_ = {};
  this.optionsMap_ = {};
  this.undefinedSettings_ = [];
  this.urlsMap_ = {};
};
goog.inherits(npf.application.Settings, goog.events.EventTarget);


/**
 * @const {string}
 */
npf.application.Settings.OPTIONS = 'options';

/**
 * @const {string}
 */
npf.application.Settings.URLS = 'urls';


/**
 * @private {Object}
 */
npf.application.Settings.prototype.defaultsMap_;

/**
 * @private {Array.<string>}
 */
npf.application.Settings.prototype.optionKeys_;

/**
 * @private {Object}
 */
npf.application.Settings.prototype.optionsMap_;

/**
 * @type {string}
 */
npf.application.Settings.prototype.optionsRootKey =
  npf.application.Settings.OPTIONS;

/**
 * @private {Array.<string>}
 */
npf.application.Settings.prototype.undefinedSettings_;

/**
 * @private {Array.<string>}
 */
npf.application.Settings.prototype.urlKeys_;

/**
 * @private {Object.<string>}
 */
npf.application.Settings.prototype.urlsMap_;

/**
 * @type {string}
 */
npf.application.Settings.prototype.urlsRootKey = npf.application.Settings.URLS;


/** @inheritDoc */
npf.application.Settings.prototype.disposeInternal = function() {
  goog.base(this, 'disposeInternal');

  this.defaultsMap_ = null;
  this.optionKeys_ = null;
  this.optionsMap_ = null;
  this.undefinedSettings_ = null;
  this.urlKeys_ = null;
  this.urlsMap_ = null;
};

/**
 * @param {!Object} jsonSettings
 * @return {boolean}
 */
npf.application.Settings.prototype.parse = function(jsonSettings) {
  goog.array.forEach(this.optionKeys_, function(key) {
    /** @type {Array.<string>} */
    var parts = [this.optionsRootKey].concat(key.split('.'));
    var value = this.getValue_(jsonSettings, parts);

    if (goog.isDef(value) && this.checkOption(key, value)) {
      this.setOption(key, value);
    } else {
      this.undefinedSettings_.push(parts.join('.'));
    }
  }, this);

  goog.array.forEach(this.urlKeys_, function(key) {
    /** @type {Array.<string>} */
    var parts = [this.urlsRootKey].concat(key.split('.'));
    var value = this.getValue_(jsonSettings, parts);

    if (goog.isString(value)) {
      this.setUrl(key, value);
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

  if (!goog.isDef(checking) && goog.isDef(this.defaultsMap_[option])) {
    checking = this.defaultsMap_[option];
  }

  return checking;
};

/**
 * @param {string} key
 * @return {*}
 */
npf.application.Settings.prototype.getOption = function(key) {
  var option = this.optionsMap_[key];

  if (!goog.isDef(option)) {
    throw Error('Option key "' + key + '" not found in settings.');
  }

	return option;
};

/**
 * @param {string} key
 * @param {*} value
 * @return {!npf.application.Settings}
 */
npf.application.Settings.prototype.setOption = function(key, value) {
  this.optionsMap_[key] = value;

  return this;
};

/**
 * @param {string} key
 * @param {*} value
 * @return {!npf.application.Settings}
 */
npf.application.Settings.prototype.setDefaultOption = function(key, value) {
  this.defaultsMap_[this.optionsRootKey + '.' + key] = value;

  return this;
};

/**
 * @param {string} key
 * @return {!npf.application.Settings}
 */
npf.application.Settings.prototype.removeOption = function(key) {
  goog.object.remove(this.optionsMap_, key);

  return this;
};

/**
 * @param {string} key
 * @param {*} value
 * @return {boolean}
 * @protected
 */
npf.application.Settings.prototype.checkOption = function(key, value) {
  return true;
};

/**
 * @param {string} key
 * @param {Object=} opt_params
 * @return {!goog.Uri}
 */
npf.application.Settings.prototype.getUri = function(key, opt_params) {
  return new goog.Uri(this.getUrl(key, opt_params));
};

/**
 * @param {string} key
 * @param {Object=} opt_params
 * @return {string}
 */
npf.application.Settings.prototype.getUrl = function(key, opt_params) {
  /** @type {string} */
  var url = this.urlsMap_[key];

  if (!goog.isDef(url)) {
    throw Error('Url key "' + key + '" not found in settings.');
  }

  return npf.string.supplant(url, opt_params);
};

/**
 * @param {string} key
 * @param {string|goog.Uri} uri
 * @return {!npf.application.Settings}
 */
npf.application.Settings.prototype.setUrl = function(key, uri) {
  this.urlsMap_[key] = goog.isString(uri) ? uri : uri.toString();

  return this;
};

/**
 * @param {string} key
 * @param {string} url
 * @return {!npf.application.Settings}
 */
npf.application.Settings.prototype.setDefaultUrl = function(key, url) {
  this.defaultsMap_[this.urlsRootKey + '.' + key] = url;

  return this;
};

/**
 * @param {string} key
 * @return {!npf.application.Settings}
 */
npf.application.Settings.prototype.removeUrl = function(key) {
  goog.object.remove(this.urlsMap_, key);

  return this;
};

/**
 * @return {Array.<string>}
 */
npf.application.Settings.prototype.getUndefinedSettings = function() {
  return this.undefinedSettings_;
};
