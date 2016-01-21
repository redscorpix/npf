goog.provide('npf.events.ClickHandler');

goog.require('goog.dom');
goog.require('goog.events.BrowserEvent');
goog.require('goog.events.EventHandler');
goog.require('goog.events.EventTarget');
goog.require('goog.events.EventType');
goog.require('goog.math.Coordinate');
goog.require('goog.userAgent');
goog.require('npf.userAgent.events');


/**
 * @param {!Node} element
 * @constructor
 * @struct
 * @extends {goog.events.EventTarget}
 */
npf.events.ClickHandler = function(element) {
  npf.events.ClickHandler.base(this, 'constructor');

  /**
   * @private {goog.dom.DomHelper}
   */
  this.domHelper_ = goog.dom.getDomHelper(element);

  /**
   * @type {Node}
   */
  this.element = element;

  /**
   * @private {goog.math.Coordinate}
   */
  this.movePos_ = null;

  /**
   * @private {goog.math.Coordinate}
   */
  this.startPos_ = null;

  /**
   * @type {number}
   */
  this.tapMaxDistance = 10;

  var handler = new goog.events.EventHandler(this);
  this.registerDisposable(handler);

  if (goog.isNull(npf.events.ClickHandler._isTouch)) {
    npf.events.ClickHandler._isTouch =
      npf.userAgent.events.isTouchEventSupported();
  }

  var touch = /** @type {boolean} */ (npf.events.ClickHandler._isTouch);
  /** @type {boolean} */
  var click =
    !touch || (touch && !goog.userAgent.MOBILE && !goog.userAgent.ANDROID);

  if (touch) {
    handler.
      listen(element, goog.events.EventType.TOUCHSTART, this.onStart_).
      listen(element, goog.events.EventType.TOUCHMOVE, this.onProgress_).
      listen(element, [
        goog.events.EventType.TOUCHEND,
        goog.events.EventType.TOUCHCANCEL
      ], this.onEnd_);
  }

  if (click) {
    handler.
      listen(element, goog.events.EventType.CLICK, this.onClick_);
  }
};
goog.inherits(npf.events.ClickHandler, goog.events.EventTarget);


/**
 * @private {boolean?}
 */
npf.events.ClickHandler._isTouch = null;

/**
 * @param {!Event} nativeEvent
 * @return {!goog.math.Coordinate}
 */
npf.events.ClickHandler.getPositionFromEvent = function(nativeEvent) {
  if (npf.userAgent.events.isTouchEventSupported()) {
    var touches = nativeEvent['touches'].length ?
      nativeEvent['touches'] : nativeEvent['changedTouches'];

    return new goog.math.Coordinate(touches[0].pageX, touches[0].pageY);
  } else {
    return new goog.math.Coordinate(nativeEvent.pageX, nativeEvent.pageY);
  }
};


/** @inheritDoc */
npf.events.ClickHandler.prototype.disposeInternal = function() {
  npf.events.ClickHandler.base(this, 'disposeInternal');

  this.domHelper_ = null;
  this.element = null;
  this.movePos_ = null;
  this.startPos_ = null;
};

/**
 * @param {goog.events.BrowserEvent} evt
 * @private
 */
npf.events.ClickHandler.prototype.onClick_ = function(evt) {
  var event = new goog.events.BrowserEvent(evt.getBrowserEvent());
  this.dispatchEvent(event);
};

/**
 * @param {goog.events.BrowserEvent} evt
 * @private
 */
npf.events.ClickHandler.prototype.onEnd_ = function(evt) {
  var nativeEvent = /** @type {!Event} */ (evt.getBrowserEvent());

  if (
    this.startPos_ &&
    !(nativeEvent['touches'] && nativeEvent['touches'].length)
  ) {
    /** @type {number} */
    var xDistance = this.movePos_ ?
      Math.abs(this.movePos_.x - this.startPos_.x) : 0;
    /** @type {number} */
    var yDistance = this.movePos_ ?
      Math.abs(this.movePos_.y - this.startPos_.y) : 0;

    if (Math.max(xDistance, yDistance) < this.tapMaxDistance) {
      var event = new goog.events.BrowserEvent(nativeEvent);
      event.type = goog.events.EventType.CLICK;
      this.dispatchEvent(event);
    }

    this.startPos_ = null;
  }
};

/**
 * @param {goog.events.BrowserEvent} evt
 * @private
 */
npf.events.ClickHandler.prototype.onProgress_ = function(evt) {
  if (this.startPos_) {
    var nativeEvent = /** @type {!Event} */ (evt.getBrowserEvent());
    this.movePos_ = npf.events.ClickHandler.getPositionFromEvent(nativeEvent);
  }
};

/**
 * @param {goog.events.BrowserEvent} evt
 * @private
 */
npf.events.ClickHandler.prototype.onStart_ = function(evt) {
  var nativeEvent = /** @type {!Event} */ (evt.getBrowserEvent());

  if (nativeEvent['touches'] && 1 == nativeEvent['touches'].length) {
    this.startPos_ = npf.events.ClickHandler.getPositionFromEvent(nativeEvent);
    this.movePos_ = null;
  }
};
