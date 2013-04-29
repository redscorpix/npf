goog.provide('npf.social.Vk');

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
npf.social.Vk = function(appId, opt_domHelper) {
  goog.base(this);

  this._appId = appId;
  this._domHelper = opt_domHelper || goog.dom.getDomHelper();
};
goog.inherits(npf.social.Vk, goog.events.EventTarget);


/**
 * @enum {string}
 */
npf.social.Vk.EventType = {
  /**
   * appId (number)
   */
  LOAD: goog.events.getUniqueId('load')
};

/**
 * @type {string}
 * @const
 */
npf.social.Vk.API_URL = '//vk.com/js/api/openapi.js';

/**
 * @type {string}
 */
npf.social.Vk.INIT_FUNCTION = 'vkAsyncInit';

/**
 * @type {number}
 * @private
 */
npf.social.Vk.prototype._appId;

/**
 * @type {goog.dom.DomHelper}
 * @private
 */
npf.social.Vk.prototype._domHelper;

/**
 * @type {boolean}
 * @private
 */
npf.social.Vk.prototype._loaded = false;

/**
 * @type {boolean}
 * @private
 */
npf.social.Vk.prototype._loading = false;

/**
 * @type {boolean}
 */
npf.social.Vk.prototype.onlyWidgets = false;


/** @inheritDoc */
npf.social.Vk.prototype.disposeInternal = function() {
  goog.base(this, 'disposeInternal');

  this._domHelper = null;
};

/**
 * @param {boolean=} opt_noAppend
 */
npf.social.Vk.prototype.init = function(opt_noAppend) {
  if (!this._loading && !this._loaded) {
    this._loading = true;
    this.initInternal(opt_noAppend);
  }
};

/**
 * @param {boolean=} opt_noAppend
 * @protected
 */
npf.social.Vk.prototype.initInternal = function(opt_noAppend) {
  if (opt_noAppend) {
    this._loading = false;
    this._loaded = true;
    this._init();
  } else {
    this._domHelper.getWindow()[npf.social.Vk.INIT_FUNCTION] =
      goog.bind(this._onLoad, this);

    /** @type {Element} */
    var bodyElement = this._domHelper.getDocument().body;
    /** @type {!Element} */
    var scriptElement = this._domHelper.createDom(goog.dom.TagName.SCRIPT, {
      'src': npf.social.Vk.API_URL
    });
    this._domHelper.appendChild(bodyElement, scriptElement);
  }
};

/**
 * @private
 */
npf.social.Vk.prototype._onLoad = function() {
  if (!this.isDisposed()) {
    delete this._domHelper.getWindow()[npf.social.Vk.INIT_FUNCTION];

    this._loading = false;
    this._loaded = true;

    this._init();
  }
};

/**
 * @private
 */
npf.social.Vk.prototype._init = function() {
  this._domHelper.getWindow()['VK']['init']({
    'apiId': this._appId,
    'onlyWidgets': this.onlyWidgets
  });

  this.dispatchEvent({
    type: npf.social.Vk.EventType.LOAD,
    appId: this._appId
  });
};

/**
 * @return {number}
 */
npf.social.Vk.prototype.getAppId = function() {
  return this._appId;
};

/**
 * @return {boolean}
 */
npf.social.Vk.prototype.isLoaded = function() {
  return this._loaded;
};

npf.social.Vk.prototype.setLoaded = function() {
  this._loaded = true;
};
