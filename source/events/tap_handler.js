goog.provide('npf.events.TapHandler');
goog.provide('npf.events.TapHandler.EventType');

goog.require('goog.events.BrowserEvent');
goog.require('goog.events.EventHandler');
goog.require('goog.events.EventTarget');
goog.require('goog.events.EventType');
goog.require('npf.userAgent.support');


/**
 * @param {Node} element
 * @constructor
 * @extends {goog.events.EventTarget}
 */
npf.events.TapHandler = function(element) {
  goog.base(this);

  var EventType = goog.events.EventType;
  var handler = new goog.events.EventHandler();
  this.registerDisposable(handler);

  if (npf.userAgent.support.isTouchSupported()) {
    handler
      .listen(element, EventType.TOUCHCANCEL, this.onTouchCancel_, false, this)
      .listen(element, EventType.TOUCHEND, this.onTouchEnd_, false, this)
      .listen(element, EventType.TOUCHMOVE, this.onTouchMove_, false, this)
      .listen(element, EventType.TOUCHSTART, this.onTouchStart_, false, this);
  } else {
    handler.listen(element, EventType.CLICK, this.onClick_, false, this);
  }
};
goog.inherits(npf.events.TapHandler, goog.events.EventTarget);


/**
 * @enum {string}
 */
npf.events.TapHandler.EventType = {
  TAP: goog.events.getUniqueId('tap')
};

/**
 * @type {number}
 * @const
 */
npf.events.TapHandler.MAX_MOVING = 5;

/**
 * @type {Node}
 * @private
 */
npf.events.TapHandler.prototype.element_;

/**
 * @type {boolean}
 * @private
 */
npf.events.TapHandler.prototype.started_ = false;

/**
 * @type {number}
 * @private
 */
npf.events.TapHandler.prototype.startLeft_;

/**
 * @type {number}
 * @private
 */
npf.events.TapHandler.prototype.startTop_;


/** @inheritDoc */
npf.events.TapHandler.prototype.disposeInternal = function() {
  goog.base(this, 'disposeInternal');

  delete this.started_;
  delete this.startLeft_;
  delete this.startTop_;
};

/**
 * @param {goog.events.BrowserEvent} evt
 * @private
 */
npf.events.TapHandler.prototype.onClick_ = function(evt) {
  this.dispatchAndDispose_(evt);
};

/**
 * @param {goog.events.BrowserEvent} evt
 * @private
 */
npf.events.TapHandler.prototype.onTouchCancel_ = function(evt) {
  this.started_ = false;
};

/**
 * @param {goog.events.BrowserEvent} evt
 * @private
 */
npf.events.TapHandler.prototype.onTouchEnd_ = function(evt) {
  if (this.started_) {
    this.dispatchAndDispose_(evt);
  }
};

/**
 * @param {goog.events.BrowserEvent} evt
 * @private
 */
npf.events.TapHandler.prototype.onTouchMove_ = function(evt) {
  var touches = evt.getBrowserEvent()['touches'];
  /** @type {number} */
  var maxMoving = npf.events.TapHandler.MAX_MOVING;

  if (this.started_ && touches && 1 == touches.length) {
    if (
      maxMoving < Math.abs(touches[0].pageX - this.startLeft_) ||
      maxMoving < Math.abs(touches[0].pageY - this.startTop_)
    ) {
      this.started_ = false;
    }
  }
};

/**
 * @param {goog.events.BrowserEvent} evt
 * @private
 */
npf.events.TapHandler.prototype.onTouchStart_ = function(evt) {
  var touches = evt.getBrowserEvent()['touches'];

  if (touches && 1 == touches.length) {
    this.started_ = true;
    this.startLeft_ = /** @type {number} */ (touches[0].pageX);
    this.startTop_ = /** @type {number} */ (touches[0].pageY);
  }
};

/**
 * @param {goog.events.BrowserEvent} evt
 * @private
 */
npf.events.TapHandler.prototype.dispatchAndDispose_ = function(evt) {
  var event = new goog.events.BrowserEvent(evt.getBrowserEvent());
  event.type = npf.events.TapHandler.EventType.TAP;

  try {
    this.dispatchEvent(event);
  } finally {
    event.dispose();
  }
};
