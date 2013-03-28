goog.provide('npf.social.Facebook');

goog.require('goog.dom');
goog.require('goog.dom.TagName');
goog.require('goog.events');
goog.require('goog.events.EventTarget');


/**
 * @param {number} appId
 * @param {goog.dom.DomHelper=} opt_domHelper
 * @constructor
 * @extends {goog.events.EventTarget}
 */
npf.social.Facebook = function(appId, opt_domHelper) {
  goog.base(this);

  this._appId = appId;
  this._domHelper = opt_domHelper || goog.dom.getDomHelper();
};
goog.inherits(npf.social.Facebook, goog.events.EventTarget);


/**
 * @enum {string}
 */
npf.social.Facebook.EventType = {

  /**
   * appId (number)
   */
  LOAD: goog.events.getUniqueId('load')
};

/**
 * @type {string}
 * @const
 */
npf.social.Facebook.API_URL = '//connect.facebook.net/en_US/all.js';

/**
 * @type {string}
 */
npf.social.Facebook.ID = 'fb-root';

/**
 * @type {string}
 */
npf.social.Facebook.INIT_FUNCTION = 'fbAsyncInit';

/**
 * @type {number}
 * @private
 */
npf.social.Facebook.prototype._appId;

/**
 * @type {goog.dom.DomHelper}
 * @private
 */
npf.social.Facebook.prototype._domHelper;

/**
 * @type {boolean}
 * @private
 */
npf.social.Facebook.prototype._isAutoGrow = false;

/**
 * @type {boolean}
 * @private
 */
npf.social.Facebook.prototype._loading = false;

/**
 * @type {boolean}
 * @private
 */
npf.social.Facebook.prototype._loaded = false;


/** @inheritDoc */
npf.social.Facebook.prototype.disposeInternal = function() {
  goog.base(this, 'disposeInternal');

  this._domHelper = null;
};

npf.social.Facebook.prototype.init = function() {
  if (!this._loading && !this._loaded) {
    this._loading = true;
    this.initInternal();
  }
};

/**
 * @protected
 */
npf.social.Facebook.prototype.initInternal = function() {
  this._domHelper.getWindow()[npf.social.Facebook.INIT_FUNCTION] =
    goog.bind(this._onLoad, this);

  /** @type {!Element} */
  var fbElement = this._domHelper.createDom(goog.dom.TagName.DIV, {
    'id': npf.social.Facebook.ID
  });
  /** @type {Element} */
  var scriptElement = this._domHelper.createDom(goog.dom.TagName.SCRIPT, {
    'async': true,
    'src': npf.social.Facebook.API_URL
  });
  /** @type {Element} */
  var bodyElement = this._domHelper.getDocument().body;

  this._domHelper.appendChild(bodyElement, fbElement);
  this._domHelper.appendChild(bodyElement, scriptElement);
};

/**
 * @private
 */
npf.social.Facebook.prototype._onLoad = function() {
  if (!this.isDisposed()) {
    /** @type {!Window} */
    var win = this._domHelper.getWindow();

    delete win[npf.social.Facebook.INIT_FUNCTION];

    this._loading = false;
    this._loaded = true;

    if (this._isAutoGrow) {
      win['FB']['Canvas']['setAutoGrow']();
    }

    /** @type {!Object} */
    var params = this.getFbParamsInternal();
    win['FB']['init'](params);

    this.dispatchEvent({
      type: npf.social.Facebook.EventType.LOAD,
      appId: this._appId
    });
  }
};

/**
 * @return {!Object}
 * @protected
 */
npf.social.Facebook.prototype.getFbParamsInternal = function() {
  return {
    'appId': this._appId,
    'status': true,
    'cookie': true,
    'xfbml': true
  };
};

/**
 * @return {boolean}
 */
npf.social.Facebook.prototype.isLoaded = function() {
  return this._loaded;
};

/**
 * @return {boolean}
 */
npf.social.Facebook.prototype.isAutoGrow = function() {
  return this._isAutoGrow;
};

/**
 * @param {boolean} isAutoGrow
 */
npf.social.Facebook.prototype.setAutoGrow = function(isAutoGrow) {
  if (this._isAutoGrow == isAutoGrow) {
    return;
  }

  this._isAutoGrow = !!isAutoGrow;

  /** @type {!Window} */
  var win = this._domHelper.getWindow();

  if (win['FB']) {
    win['FB']['Canvas']['setAutoGrow'](this._isAutoGrow);
  }
};
