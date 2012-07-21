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

	this._urlTypesMap = urlTypesMap;
	this._optionTypesMap = optionTypesMap;
	this._optionsMap = {};
	this._urlsMap = {};
	this._undefinedSettings = [];
	this._defaultSettingsMap = {};
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
npf.application.Settings.prototype._urlTypesMap;

/**
 * @type {Object}
 * @private
 */
npf.application.Settings.prototype._optionTypesMap;

/**
 * @type {!Object}
 * @private
 */
npf.application.Settings.prototype._optionsMap;

/**
 * @type {!Object}
 * @private
 */
npf.application.Settings.prototype._urlsMap;

/**
 * @type {!Array.<string>}
 * @private
 */
npf.application.Settings.prototype._undefinedSettings;

/**
 * @type {!Object.<string,*>}
 * @private
 */
npf.application.Settings.prototype._defaultSettingsMap;


/** @inheritDoc */
npf.application.Settings.prototype.disposeInternal = function() {
	goog.base(this, 'disposeInternal');

	delete this._urlTypesMap;
	delete this._optionTypesMap;
	delete this._undefinedSettings;
	delete this._optionsMap;
	delete this._urlsMap;
	delete this._defaultSettingsMap;
};

/**
 * @param {Object} jsonSettings
 * @return {boolean}
 */
npf.application.Settings.prototype.parse = function(jsonSettings) {
	goog.object.forEach(this._urlTypesMap, function(urlType) {
		/** @type {Array.<string>} */
		var parts = [npf.application.Settings.URLS].concat(urlType.split('.'));
		var value = this._getValue(jsonSettings, parts);

		if (goog.isDef(value)) {
			this._urlsMap[urlType] = value;
		} else {
			this._undefinedSettings.push(parts.join('.'));
		}
	}, this);

	goog.object.forEach(this._optionTypesMap, function(optionType) {
		/** @type {Array.<string>} */
		var parts = [npf.application.Settings.OPTIONS].concat(optionType.split('.'));
		var value = this._getValue(jsonSettings, parts);

		if (goog.isDef(value)) {
			this._optionsMap[optionType] = value;
		} else {
			this._undefinedSettings.push(parts.join('.'));
		}
	}, this);

	return !this._undefinedSettings.length;
};

/**
 * @param {Object} jsonSettings
 * @param {Array.<string>} keys
 * @return {*}
 * @private
 */
npf.application.Settings.prototype._getValue = function(jsonSettings, keys) {
	var checking = jsonSettings;
	var i = 0;

	while (goog.isDef(checking) && i < keys.length) {
		checking = checking[keys[i]];
		i++;
	}

	var option = keys.join('.');

	if (!goog.isDef(checking) && goog.isDef(this._defaultSettingsMap[option])) {
		checking = this._defaultSettingsMap[option];
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
	var url = this._urlsMap[urlType];

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
	var option = this._optionsMap[optionType];

	if (!goog.isDef(option)) {
		throw Error('optionType "' + optionType + '" not found in settings.');
	}

	return option;
};

/**
 * @return {!Array.<string>}
 */
npf.application.Settings.prototype.getUndefinedSettings = function() {
	return this._undefinedSettings;
};

/**
 * @param {string} urlType
 * @param {string} url
 * @return {npf.application.Settings}
 */
npf.application.Settings.prototype.setDefaultUrl = function(urlType, url) {
	this._defaultSettingsMap[npf.application.Settings.URLS + '.' + urlType] = url;

	return this;
};

/**
 * @param {string} optionType
 * @param {*} value
 * @return {npf.application.Settings}
 */
npf.application.Settings.prototype.setDefaultOption = function(optionType, value) {
	this._defaultSettingsMap[npf.application.Settings.OPTIONS + '.' + optionType] = value;

	return this;
};
