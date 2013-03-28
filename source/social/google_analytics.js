goog.provide('npf.social.GoogleAnalytics');

goog.require('goog.dom');
goog.require('goog.dom.TagName');
goog.require('goog.events');
goog.require('goog.events.EventTarget');


/**
 * @param {string} accountId
 * @param {goog.dom.DomHelper=} opt_domHelper
 * @constructor
 * @extends {goog.events.EventTarget}
 */
npf.social.GoogleAnalytics = function(accountId, opt_domHelper) {
  goog.base(this);

  this._accountId = accountId;
  this._domHelper = opt_domHelper || goog.dom.getDomHelper();
};
goog.inherits(npf.social.GoogleAnalytics, goog.events.EventTarget);


/**
 * @enum {string}
 */
npf.social.GoogleAnalytics.EventType = {
  /**
   * accountId (string)
   */
  LOAD: goog.events.getUniqueId('load')
};

/**
 * @type {string}
 * @const
 */
npf.social.GoogleAnalytics.ID = '_gaq';

/**
 * @type {string}
 * @private
 */
npf.social.GoogleAnalytics.prototype._accountId;

/**
 * @type {goog.dom.DomHelper}
 * @private
 */
npf.social.GoogleAnalytics.prototype._domHelper;

/**
 * @type {boolean}
 * @private
 */
npf.social.GoogleAnalytics.prototype._loaded = false;


/** @inheritDoc */
npf.social.GoogleAnalytics.prototype.disposeInternal = function() {
  goog.base(this, 'disposeInternal');

  this._domHelper = null;
};

/**
 * @return {boolean}
 */
npf.social.GoogleAnalytics.prototype.isLoaded = function() {
  return this._loaded;
};

npf.social.GoogleAnalytics.prototype.init = function() {
  if (!this._loaded) {
    this._loaded = true;
    this.initInternal();
    this.dispatchEvent({
      type: npf.social.GoogleAnalytics.EventType.LOAD,
      accountId: this._accountId
    });
  }
};

/**
 * @protected
 */
npf.social.GoogleAnalytics.prototype.initInternal = function() {
  /** @type {Object|Array} */
  var ga = this.getGa();
  ga.push(['_setAccount', this._accountId]);
  ga.push(['_trackPageview']);

  /** @type {string} */
  var src = ('https:' == this._domHelper.getWindow().location.protocol ?
    'https://ssl' : 'http://www') + '.google-analytics.com/ga.js';
  /** @type {Element} */
  var gaElement = this._domHelper.createDom(goog.dom.TagName.SCRIPT, {
    'async': true,
    'src': src
  });
  this._domHelper.appendChild(this._domHelper.getDocument().body, gaElement);
};

/**
 * @return {string}
 */
npf.social.GoogleAnalytics.prototype.getAccountId = function() {
  return this._accountId;
};

/**
 * @return {Object|Array}
 */
npf.social.GoogleAnalytics.prototype.getGa = function() {
  return this._domHelper.getWindow()[npf.social.GoogleAnalytics.ID] || [];
};

/**
 * @param {string} category
 * @param {string} action
 * @param {string=} opt_label
 * @param {number=} opt_value
 */
npf.social.GoogleAnalytics.prototype.addEvent = function(
    category, action, opt_label, opt_value) {
  this.getGa().push(['_trackEvent', category, action, opt_label, opt_value]);
};

/**
 * @param {string} url
 */
npf.social.GoogleAnalytics.prototype.addPage = function(url) {
  this.getGa().push(['_trackPageview', url]);
};

/**
 * @param {string} category
 * @param {string} action
 * @param {string} value
 */
npf.social.GoogleAnalytics.prototype.addSocial = function(
    category, action, value) {
  this.getGa().push(['_trackSocial', category, action, value]);
};
