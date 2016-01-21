goog.provide('npf.ui.scrollContainer.Scroller');
goog.provide('npf.ui.scrollContainer.Scroller.Event');
goog.provide('npf.ui.scrollContainer.Scroller.Type');

goog.require('goog.events.Event');
goog.require('goog.events.EventHandler');
goog.require('goog.events.EventTarget');
goog.require('goog.events.EventType');


/**
 * @param {npf.ui.scrollContainer.Scroller.Type} type
 * @param {!npf.ui.ScrollContainer} container
 * @constructor
 * @extends {goog.events.EventTarget}
 */
npf.ui.scrollContainer.Scroller = function(type, container) {
  npf.ui.scrollContainer.Scroller.base(this, 'constructor');

  /**
   * @protected {npf.ui.ScrollContainer}
   */
  this.container = container;

  /**
   * @protected {goog.events.EventHandler<!npf.ui.scrollContainer.Scroller>}
   */
  this.handler = new goog.events.EventHandler(this);

  /**
   * @private {npf.ui.scrollContainer.Scroller.Type}
   */
  this.type_ = type;
};
goog.inherits(npf.ui.scrollContainer.Scroller, goog.events.EventTarget);


/**
 * @enum {number}
 */
npf.ui.scrollContainer.Scroller.Type = {
  NATIVE: 1,
  TOUCH: 2
};


/** @inheritDoc */
npf.ui.scrollContainer.Scroller.prototype.disposeInternal = function() {
  this.handler.dispose();

  npf.ui.scrollContainer.Scroller.base(this, 'disposeInternal');

  this.container = null;
  this.handler = null;
};

npf.ui.scrollContainer.Scroller.prototype.update = function() {
  /** @type {!goog.math.Coordinate} */
  var scrollPosition = this.container.getScrollPosition();
  var event = new npf.ui.scrollContainer.Scroller.Event(
    scrollPosition.x, scrollPosition.y);
  this.dispatchEvent(event);
};

/**
 * @param {!goog.math.Coordinate} position
 */
npf.ui.scrollContainer.Scroller.prototype.setScrollPosition =
  goog.abstractMethod;

/**
 * @return {npf.ui.scrollContainer.Scroller.Type}
 */
npf.ui.scrollContainer.Scroller.prototype.getType = function() {
  return this.type_;
};


/**
 * @param {number} left
 * @param {number} top
 * @constructor
 * @struct
 * @extends {goog.events.Event}
 */
npf.ui.scrollContainer.Scroller.Event = function(left, top) {
  npf.ui.scrollContainer.Scroller.Event.base(
    this, 'constructor', goog.events.EventType.SCROLL);

  /**
   * @type {number}
   */
  this.scrollLeft = left;

  /**
   * @type {number}
   */
  this.scrollTop = top;
};
goog.inherits(npf.ui.scrollContainer.Scroller.Event, goog.events.Event);
