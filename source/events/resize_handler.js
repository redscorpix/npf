goog.provide('npf.events.ResizeHandler');
goog.provide('npf.events.ResizeHandler.EventType');

goog.require('goog.dom.FontSizeMonitor');
goog.require('goog.events');
goog.require('goog.events.EventHandler');
goog.require('goog.events.EventTarget');


/**
 * Event handler for goog.events.EventType.RESIZE and
 * goog.dom.FontSizeMonitor.EventType.CHANGE.
 * @constructor
 * @extends {goog.events.EventTarget}
 */
npf.events.ResizeHandler = function() {
  goog.base(this);

  this.eventHandler_ = new goog.events.EventHandler(this);
  this.registerDisposable(this.eventHandler_);
  this.eventHandler_.listen(window, goog.events.EventType.RESIZE);

  if (this.fontSizeMonitor_) {
    this.eventHandler_.listen(this.fontSizeMonitor_,
      goog.dom.FontSizeMonitor.EventType.CHANGE, this);
  }
};
goog.inherits(npf.events.ResizeHandler, goog.events.EventTarget);


/**
 * @enum {string}
 */
npf.events.ResizeHandler.EventType = {
  RESIZE: goog.events.getUniqueId('resize')
};

/**
 * @type {number}
 * @private
 */
npf.events.ResizeHandler._counter = 0;

/**
 * @type {goog.dom.FontSizeMonitor}
 * @private
 */
npf.events.ResizeHandler.fontSizeMonitor_ = null;

/**
 * @return {goog.dom.FontSizeMonitor}
 * @private
 */
npf.events.ResizeHandler.addListener_ = function() {
  npf.events.ResizeHandler._counter++;

  if (!npf.events.ResizeHandler.fontSizeMonitor_) {
    npf.events.ResizeHandler.fontSizeMonitor_ = new goog.dom.FontSizeMonitor();
  }

  return npf.events.ResizeHandler.fontSizeMonitor_;
};

/**
 * @private
 */
npf.events.ResizeHandler.removeListener_ = function() {
  npf.events.ResizeHandler._counter--;

  if (!--npf.events.ResizeHandler._counter) {
    npf.events.ResizeHandler.fontSizeMonitor_.dispose();
    npf.events.ResizeHandler.fontSizeMonitor_ = null;
  }
};

/**
 * @type {goog.dom.FontSizeMonitor}
 * @private
 */
npf.events.ResizeHandler.prototype.fontSizeMonitor_;

/**
 * @type {goog.events.EventHandler}
 * @private
 */
npf.events.ResizeHandler.prototype.eventHandler_;


/** @inheritDoc */
npf.events.ResizeHandler.prototype.disposeInternal = function() {
  goog.base(this, 'disposeInternal');

  if (this.fontSizeMonitor_) {
    npf.events.ResizeHandler.removeListener_();
  }

  this.fontSizeMonitor_ = null;
  this.eventHandler_ = null;
};

/**
 * @param {goog.events.Event} evt
 */
npf.events.ResizeHandler.prototype.handleEvent = function(evt) {
  this.dispatchEvent(npf.events.ResizeHandler.EventType.RESIZE);
};
