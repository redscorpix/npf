goog.provide('npf.labs.events.ResizeHandler');

goog.require('goog.dom');
goog.require('goog.dom.classlist');
goog.require('goog.events.EventTarget');
goog.require('goog.events.EventType');
goog.require('npf.labs.events.resizeHandler.Emulator');


/**
 * Detect Element Resize
 * Source https://github.com/sdecima/javascript-detect-element-resize, 0.5.3
 * @param {!Element} handlerElement Element will transform.
 * @constructor
 * @struct
 * @extends {goog.events.EventTarget}
 */
npf.labs.events.ResizeHandler = function(handlerElement) {
  npf.labs.events.ResizeHandler.base(this, 'constructor');

  goog.dom.classlist.add(
    handlerElement, npf.labs.events.ResizeHandler.CSS_CLASS);

  /**
   * @private {Document}
   */
  this.doc_ = goog.dom.getDomHelper(handlerElement).getDocument();

  /**
   * @private {Element}
   */
  this.element_ = handlerElement;

  /**
   * @private {npf.labs.events.resizeHandler.Emulator}
   */
  this.emulator_ = null;

  /**
   * @private {boolean}
   */
  this.enabled_ = false;

  /**
   * @private {Function}
   */
  this.onResizeWrap_ = null;
};
goog.inherits(npf.labs.events.ResizeHandler, goog.events.EventTarget);


/**
 * @type {string}
 */
npf.labs.events.ResizeHandler.CSS_CLASS =
  goog.getCssName('npfLabs-resizeHandler');


/** @inheritDoc */
npf.labs.events.ResizeHandler.prototype.disposeInternal = function() {
  this.setEnabled(false);

  npf.labs.events.ResizeHandler.base(this, 'disposeInternal');

  this.element_ = null;
  this.emulator_ = null;
  this.onResizeWrap_ = null;
};

/**
 * @return {boolean}
 */
npf.labs.events.ResizeHandler.prototype.isEnabled = function() {
  return this.enabled_;
};

/**
 * @param {boolean} enable
 */
npf.labs.events.ResizeHandler.prototype.setEnabled = function(enable) {
  if (this.enabled_ != enable) {
    this.enabled_ = enable;

    /** @type {string} */
    var actionFunc = enable ? 'attachEvent' : 'detachEvent';

    if (this.doc_[actionFunc]) {
      if (!this.onResizeWrap_) {
        this.onResizeWrap_ = goog.bind(this.onResize_, this);
      }

      this.element_[actionFunc]('onresize', this.onResizeWrap_);
    } else {
      if (!this.emulator_) {
        this.emulator_ = new npf.labs.events.resizeHandler.Emulator(
          /** @type {!Element} */ (this.element_), this.onResize_, this);
        this.registerDisposable(this.emulator_);
      }

      this.emulator_.setEnabled(enable);
    }
  }
};

/**
 * @private
 */
npf.labs.events.ResizeHandler.prototype.onResize_ = function() {
  this.dispatchEvent(goog.events.EventType.RESIZE);
};
