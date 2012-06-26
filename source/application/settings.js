goog.provide('npf.application.Settings');

goog.require('npf.string');
goog.require('goog.Disposable');


/**
 * @param {!Object} jsonSettings
 * @param {!Object} urlTypes
 * @param {!Object} optionTypes
 * @constructor
 * @extends {goog.Disposable}
 */
npf.application.Settings = function(jsonSettings, urlTypes, optionTypes) {
	goog.base(this);

	this._jsonSettings = jsonSettings;
	this._urlTypes = urlTypes;
	this._optionTypes = optionTypes;
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
 * @type {!Object}
 * @private
 */
npf.application.Settings.prototype._jsonSettings;

/**
 * @type {Object}
 * @private
 */
npf.application.Settings.prototype._urlTypes = null;

/**
 * @type {Object}
 * @private
 */
npf.application.Settings.prototype._optionTypes = null;

/**
 * @type {Array.<string>}
 * @private
 */
npf.application.Settings.prototype._undefinedSettings = null;


/** @inheritDoc */
npf.application.Settings.prototype.disposeInternal = function() {
	goog.base(this, 'disposeInternal');

	delete this._jsonSettings;
	delete this._urlTypes;
	delete this._optionTypes;
	delete this._undefinedSettings;
};

/**
 * @return {boolean}
 */
npf.application.Settings.prototype.parse = function() {
	goog.object.forEach(this._urlTypes, function(/** @type {string} */ urlType) {
		if (!(
			goog.isDef(this._jsonSettings[npf.application.Settings.URLS]) &&
			goog.isDef(this._jsonSettings[npf.application.Settings.URLS][urlType])
		)) {
			if (!this._undefinedSettings) {
				this._undefinedSettings = [];
			}

			this._undefinedSettings.push(npf.application.Settings.URLS + '.' + urlType);
		}
	}, this);

	goog.object.forEach(this._optionTypes, function(/** @type {string} */ optionType) {
		if (!(
			goog.isDef(this._jsonSettings[npf.application.Settings.OPTIONS]) &&
			goog.isDef(this._jsonSettings[npf.application.Settings.OPTIONS][optionType])
		)) {
			if (!this._undefinedSettings) {
				this._undefinedSettings = [];
			}

			this._undefinedSettings.push(npf.application.Settings.OPTIONS + '.' + optionType);
		}
	}, this);

	return !this._undefinedSettings;
};

/**
 * @param {string} urlType
 * @param {Object=} opt_params
 * @return {string}
 */
npf.application.Settings.prototype.getUrl = function(urlType, opt_params) {
	/** @type {string} */
	var url = this._jsonSettings[npf.application.Settings.URLS][urlType];
	return npf.string.supplant(url, opt_params);
};

/**
 * @param {string} optionType
 * @return {*}
 */
npf.application.Settings.prototype.getOption = function(optionType) {
	return this._jsonSettings[npf.application.Settings.OPTIONS][optionType];
};

/**
 * @return {Array.<string>}
 */
npf.application.Settings.prototype.getUndefinedSettings = function() {
	return this._undefinedSettings;
};
