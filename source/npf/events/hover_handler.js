goog.provide('npf.events.HoverHandler');
goog.provide('npf.events.HoverHandler.EventType');

goog.require('goog.events');
goog.require('goog.events.BrowserEvent');
goog.require('goog.events.EventTarget');
goog.require('goog.events.EventType');
goog.require('npf.events');



/**
 * @param {Element} element The node to listen on.
 * @constructor
 * @struct
 * @extends {goog.events.EventTarget}
 */
npf.events.HoverHandler = function(element) {
  npf.events.HoverHandler.base(this, 'constructor');

  /**
   * @private {Element}
   */
  this.element_ = element;

  /**
   * Store the listen key so it easier to unlisten in dispose.
   * @private {goog.events.Key}
   */
  this.listenKeyIn_ = goog.events.listen(
    element, goog.events.EventType.MOUSEOVER, this);

  /**
   * Store the listen key so it easier to unlisten in dispose.
   * @private {goog.events.Key}
   */
  this.listenKeyOut_ = goog.events.listen(
    element, goog.events.EventType.MOUSEOUT, this);
};
goog.inherits(npf.events.HoverHandler, goog.events.EventTarget);


/**
 * @enum {string}
 */
npf.events.HoverHandler.EventType = {
  HOVERIN: 'hoverin',
  HOVEROUT: 'hoverout'
};


/** @inheritDoc */
npf.events.HoverHandler.prototype.disposeInternal = function() {
  goog.events.unlistenByKey(this.listenKeyIn_);
  goog.events.unlistenByKey(this.listenKeyOut_);

  npf.events.HoverHandler.base(this, 'disposeInternal');

  this.element_ = null;
};

/**
 * This handles the underlying events and dispatches a new event.
 * @param {goog.events.BrowserEvent} e The underlying browser event.
 */
npf.events.HoverHandler.prototype.handleEvent = function(e) {
  if (!npf.events.isMouseEventWithinElement(e, this.element_)) {
    var be = e.getBrowserEvent();
    var event = new goog.events.BrowserEvent(be);
    event.type = goog.events.EventType.MOUSEOVER == e.type ?
      npf.events.HoverHandler.EventType.HOVERIN :
      npf.events.HoverHandler.EventType.HOVEROUT;
    this.dispatchEvent(event);
  }
};
