goog.provide('npf.ui.FullScreen');
goog.provide('npf.ui.FullScreen.EventType');

goog.require('goog.dom');
goog.require('goog.dom.classlist');
goog.require('goog.events');
goog.require('goog.events.EventHandler');
goog.require('goog.events.EventTarget');
goog.require('npf.userAgent.fullscreen');
goog.require('npf.userAgent.utils');


/**
 * @param {!Element} element
 * @constructor
 * @struct
 * @extends {goog.events.EventTarget}
 */
npf.ui.FullScreen = function(element) {
  npf.ui.FullScreen.base(this, 'constructor');

  /**
   * @private {Document}
   */
  this.document_ = goog.dom.getDomHelper(element).getDocument();

  /**
   * @private {Element}
   */
  this.element_ = element;

  /**
   * @private {boolean}
   */
  this.fullScreen_ = this.isFullScreen_();

  var handler = new goog.events.EventHandler(this);
  this.registerDisposable(handler);

  handler.listen(this.document_, 'fullscreenchange', this.onFullScreenChange_);

  if (npf.userAgent.utils.VENDOR_PREFIX) {
    handler.listen(this.document_,
      npf.userAgent.utils.VENDOR_PREFIX + 'fullscreenchange',
      this.onFullScreenChange_);
  }
};
goog.inherits(npf.ui.FullScreen, goog.events.EventTarget);


/**
 * @type {string}
 */
npf.ui.FullScreen.CSS_CLASS = goog.getCssName('npf-fullScreen');

/**
 * @enum {string}
 */
npf.ui.FullScreen.EventType = {
  FULL_SCREEN_CHANGE: goog.events.getUniqueId('fullScreenChange')
};

/**
 * @return {boolean}
 */
npf.ui.FullScreen.isSupported = npf.userAgent.fullscreen.isSupported;


/** @inheritDoc */
npf.ui.FullScreen.prototype.disposeInternal = function() {
  this.setFullScreen(false);

  npf.ui.FullScreen.base(this, 'disposeInternal');

  this.document_ = null;
  this.element_ = null;
};

/**
 * @return {boolean}
 */
npf.ui.FullScreen.prototype.isFullScreen = function() {
  return this.fullScreen_;
};

/**
 * @return {boolean}
 * @private
 */
npf.ui.FullScreen.prototype.isFullScreen_ = function() {
  return !!(this.document_['fullScreen'] ||
    this.document_['webkitIsFullScreen'] || this.document_['mozFullScreen'] ||
    this.document_['msFullscreenElement'] ||
    this.document_['fullscreenElement']);
};

/**
 * @param {boolean} fullScreen
 */
npf.ui.FullScreen.prototype.setFullScreen = function(fullScreen) {
  if (this.fullScreen_ != fullScreen) {
    this.fullScreen_ = fullScreen;

    goog.dom.classlist.enable(
      this.element_, npf.ui.FullScreen.CSS_CLASS, fullScreen);

    if (this.isFullScreen_() != fullScreen) {
      /** @type {string} */
      var vendorPrefix = npf.userAgent.utils.VENDOR_PREFIX;

      if (fullScreen) {
        if (this.element_['requestFullscreen']) {
          this.element_['requestFullscreen']();
        } else if (
          vendorPrefix && this.element_[vendorPrefix + 'RequestFullScreen']
        ) {
          this.element_[vendorPrefix + 'RequestFullScreen']();
        } else if (
          vendorPrefix && this.element_[vendorPrefix + 'RequestFullscreen']
        ) {
          this.element_[vendorPrefix + 'RequestFullscreen']();
        }
      } else {
        if (this.document_['cancelFullScreen']) {
          this.document_['cancelFullScreen']();
        } else if (
          vendorPrefix && this.document_[vendorPrefix + 'CancelFullScreen']
        ) {
          this.document_[vendorPrefix + 'CancelFullScreen']();
        }
      }
    }

    this.dispatchEvent(npf.ui.FullScreen.EventType.FULL_SCREEN_CHANGE);
  }
};

/**
 * @param {goog.events.BrowserEvent} evt
 * @private
 */
npf.ui.FullScreen.prototype.onFullScreenChange_ = function(evt) {
  this.setFullScreen(this.isFullScreen_());
};
