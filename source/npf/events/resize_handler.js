goog.provide('npf.events.ResizeHandler');
goog.provide('npf.events.ResizeHandler.EventType');

goog.require('goog.dom');
goog.require('goog.dom.FontSizeMonitor');
goog.require('goog.dom.FontSizeMonitor.EventType');
goog.require('goog.events');
goog.require('goog.events.EventHandler');
goog.require('goog.events.EventTarget');
goog.require('goog.events.EventType');


/**
 * Event handler for goog.events.EventType.RESIZE and
 * goog.dom.FontSizeMonitor.EventType.CHANGE.
 * @param {goog.dom.DomHelper=} opt_domHelper
 * @constructor
 * @struct
 * @extends {goog.events.EventTarget}
 * @deprecated Use npf.labs.events.ResizeHandler
 */
npf.events.ResizeHandler = function(opt_domHelper) {
  npf.events.ResizeHandler.base(this, 'constructor');

  /**
   * @private {goog.dom.DomHelper}
   */
  this.domHelper_ = opt_domHelper || goog.dom.getDomHelper();

  /**
   * @private {goog.events.EventHandler.<!npf.events.ResizeHandler>}
   */
  this.eventHandler_ = new goog.events.EventHandler(this);
  this.registerDisposable(this.eventHandler_);

  /**
   * @private {goog.dom.FontSizeMonitor}
   */
  this.fontSizeMonitor_ = new goog.dom.FontSizeMonitor(this.domHelper_);
  this.registerDisposable(this.fontSizeMonitor_);

  this.eventHandler_.
    listen(this.domHelper_.getWindow(), goog.events.EventType.RESIZE, this).
    listen(this.fontSizeMonitor_, goog.dom.FontSizeMonitor.EventType.CHANGE,
      this);
};
goog.inherits(npf.events.ResizeHandler, goog.events.EventTarget);


/**
 * @enum {string}
 */
npf.events.ResizeHandler.EventType = {
  RESIZE: goog.events.getUniqueId('resize')
};


/** @inheritDoc */
npf.events.ResizeHandler.prototype.disposeInternal = function() {
  npf.events.ResizeHandler.base(this, 'disposeInternal');

  this.domHelper_ = null;
  this.eventHandler_ = null;
  this.fontSizeMonitor_ = null;
};

/**
 * @param {goog.events.Event} evt
 */
npf.events.ResizeHandler.prototype.handleEvent = function(evt) {
  this.dispatchEvent(npf.events.ResizeHandler.EventType.RESIZE);
};
