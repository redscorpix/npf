goog.provide('npf.events.TouchHandler');

goog.require('goog.Timer');
goog.require('goog.dom');
goog.require('goog.events.BrowserEvent');
goog.require('goog.events.EventHandler');
goog.require('goog.events.EventTarget');
goog.require('goog.events.EventType');
goog.require('goog.math.Coordinate');
goog.require('goog.object');
goog.require('goog.style');
goog.require('npf.events');
goog.require('npf.events.EventType');
goog.require('npf.userAgent.support');


/**
 * Hammer.JS, version 0.6.1, https://github.com/EightMedia/hammer.js
 */

/**
 * @param {Node} element
 * @constructor
 * @extends {goog.events.EventTarget}
 */
npf.events.TouchHandler = function(element) {
  goog.base(this);

  this.element = element;
  this.domHelper_ = goog.dom.getDomHelper(element);
  this.prevTapPos_ = [new goog.math.Coordinate(0, 0)];

  if (this.cssHacks && this.element instanceof Element) {
    goog.style.setStyle(this.element, {
      "userSelect": "none",
      "touchCallout": "none",
      "userDrag": "none",
      "tapHighlightColor": "rgba(0,0,0,0)"
    });
  }

  var handler = new goog.events.EventHandler(this);
  this.registerDisposable(handler);
  var EventType = goog.events.EventType;

  if (npf.userAgent.support.getTouch()) {
    // bind events for touch devices
    // except for windows phone 7.5, it doesnt support touch events..!
    handler
      .listen(this.element, EventType.TOUCHSTART, this.onStart_)
      .listen(this.element, EventType.TOUCHMOVE, this.onProgress_)
      .listen(this.element, EventType.TOUCHEND, this.onEnd_)
      .listen(this.element, EventType.TOUCHCANCEL, this.onEnd_);
  } else {
    // for non-touch
    handler
      .listen(this.element, EventType.MOUSEDOWN, this.onStart_)
      .listen(this.element, EventType.MOUSEMOVE, this.onProgress_)
      .listen(this.element, EventType.MOUSEOUT, this.onMouseOut_)
      .listen(this.element, EventType.MOUSEUP, this.onEnd_);
  }
};
goog.inherits(npf.events.TouchHandler, goog.events.EventTarget);


/**
 * @enum {string}
 */
npf.events.TouchHandler.Direction = {
  DOWN: 'down',
  LEFT: 'left',
  RIGHT: 'right',
  UP: 'up'
};

/**
 * @enum {string}
 */
npf.events.TouchHandler.Gesture = {
  DRAG: 'drag',
  DOUBLETAP: 'doubletap',
  HOLD: 'hold',
  SWIPE: 'swipe',
  TAP: 'tap',
  TRANSFORM: 'transform'
};

/**
 * Angle to direction define.
 * @param {number} angle
 * @return {npf.events.TouchHandler.Direction?} direction
 */
npf.events.TouchHandler.getDirectionFromAngle = function(angle) {
  var Direction = npf.events.TouchHandler.Direction;
  var directions = goog.object.create(
    Direction.DOWN, angle >= 45 && angle < 135, // 90
    Direction.LEFT, angle >= 135 || angle <= -135, // 180
    Direction.UP, angle < -45 && angle > -135, // 270
    Direction.RIGHT, angle >= -45 && angle <= 45 // 0
  );

  return /** @type {npf.events.TouchHandler.Direction?} */ (
    goog.object.findKey(directions, function(value) {
      return /** @type {boolean} */ (value);
    }) || null);
};

/**
 * count the number of fingers in the event
 * when no fingers are detected, one finger is returned (mouse pointer)
 * @param {Event} nativeEvent
 * @return {number}
 */
npf.events.TouchHandler.countFingers = function(nativeEvent) {
  // there is a bug on android (until v4?) that touches is always 1,
  // so no multitouch is supported, e.g. no, zoom and rotation...
  return nativeEvent['touches'] ? nativeEvent['touches'].length : 1;
};

/**
 * Calculate the angle between two points.
 * @param {goog.math.Coordinate} pos1
 * @param {goog.math.Coordinate} pos2
 * @return {number}
 */
npf.events.TouchHandler.getAngle = function(pos1, pos2) {
  return Math.atan2(pos2.y - pos1.y, pos2.x - pos1.x) * 180 / Math.PI;
};

/**
 * @type {Node}
 */
npf.events.TouchHandler.prototype.element;

/**
 * @private {goog.dom.DomHelper}
 */
npf.events.TouchHandler.prototype.domHelper_;

/**
 * @type {boolean}
 */
npf.events.TouchHandler.prototype.preventDefault = false;

/**
 * @type {boolean}
 */
npf.events.TouchHandler.prototype.cssHacks = true;

/**
 * @type {boolean}
 */
npf.events.TouchHandler.prototype.swipeEnabled = true;

/**
 * @type {number}
 */
npf.events.TouchHandler.prototype.swipeTime = 200; // ms

/**
 * @type {number}
 */
npf.events.TouchHandler.prototype.swipeMinDistance = 20; // pixels

/**
 * @type {boolean}
 */
npf.events.TouchHandler.prototype.dragEnabled = true;

/**
 * @type {boolean}
 */
npf.events.TouchHandler.prototype.dragVertical = true;

/**
 * @type {boolean}
 */
npf.events.TouchHandler.prototype.dragHorizontal = true;

/**
 * Minimum distance before the drag event starts.
 * @type {number}
 */
npf.events.TouchHandler.prototype.dragMinDistance = 20; // pixels

/**
 * Pinch zoom and rotation.
 * @type {boolean}
 */
npf.events.TouchHandler.prototype.transformEnabled = true;

/**
 * @type {number}
 */
npf.events.TouchHandler.prototype.scaleTreshold = 0.1;

/**
 * @type {number}
 */
npf.events.TouchHandler.prototype.rotationTreshold = 15; // degrees

/**
 * @type {boolean}
 */
npf.events.TouchHandler.prototype.tapEnabled = true;

/**
 * @type {boolean}
 */
npf.events.TouchHandler.prototype.tapDouble = true;

/**
 * @type {number}
 */
npf.events.TouchHandler.prototype.tapMaxInterval = 300;

/**
 * @type {number}
 */
npf.events.TouchHandler.prototype.tapMaxDistance = 10;

/**
 * @type {number}
 */
npf.events.TouchHandler.prototype.tapDoubleDistance = 20;

/**
 * @type {boolean}
 */
npf.events.TouchHandler.prototype.holdEnabled = true;

/**
 * @type {number}
 */
npf.events.TouchHandler.prototype.holdTimeout = 500;

/**
 * Holds the distance that has been moved.
 * @private {number}
 */
npf.events.TouchHandler.prototype.distance_ = 0;

/**
 * Holds the exact angle that has been moved.
 * @private {number}
 */
npf.events.TouchHandler.prototype.angle_ = 0;

/**
 * Holds the diraction that has been moved.
 * @private {?npf.events.TouchHandler.Direction}
 */
npf.events.TouchHandler.prototype.direction_ = null;

/**
 * How many fingers are on the screen.
 * @private {number}
 */
npf.events.TouchHandler.prototype.fingers_ = 0;

/**
 * @private {boolean}
 */
npf.events.TouchHandler.prototype.first_ = false;

/**
 * @private {?npf.events.TouchHandler.Gesture}
 */
npf.events.TouchHandler.prototype.gesture_ = null;

/**
 * @private {?npf.events.TouchHandler.Gesture}
 */
npf.events.TouchHandler.prototype.prevGesture_ = null;

/**
 * @private {?number}
 */
npf.events.TouchHandler.prototype.touchStartTime_ = null;

/**
 * @private {Array.<goog.math.Coordinate>}
 */
npf.events.TouchHandler.prototype.prevTapPos_;

/**
 * @private {?number}
 */
npf.events.TouchHandler.prototype.prevTapEndTime_ = null;

/**
 * @type {?number}
 */
npf.events.TouchHandler.prototype.holdTimer_ = null;

/**
 * @private {goog.math.Coordinate}
 */
npf.events.TouchHandler.prototype.offset_ = null;

/**
 * Keep track of the mouse status.
 * @private {boolean}
 */
npf.events.TouchHandler.prototype.mousedown_ = false;

/**
 * @private {Event}
 */
npf.events.TouchHandler.prototype.startEvent_ = null;

/**
 * @private {Event}
 */
npf.events.TouchHandler.prototype.moveEvent_ = null;

/**
 * @private {Event}
 */
npf.events.TouchHandler.prototype.endEvent_ = null;

/**
 * @private {Array.<goog.math.Coordinate>}
 */
npf.events.TouchHandler.prototype.startPos_ = null;

/**
 * @private {Array.<goog.math.Coordinate>}
 */
npf.events.TouchHandler.prototype.movePos_ = null;

/**
 * @private {goog.math.Coordinate}
 */
npf.events.TouchHandler.prototype.centerPos_ = null;


/** @inheritDoc */
npf.events.TouchHandler.prototype.disposeInternal = function() {
  goog.base(this, 'disposeInternal');

  this.element = null;
  this.domHelper_ = null;
  this.prevTapPos_ = null;
  this.offset_ = null;
  this.startEvent_ = null;
  this.moveEvent_ = null;
  this.endEvent_ = null;
  this.startPos_ = null;
  this.movePos_ = null;
  this.centerPos_ = null;
};

/**
 * @return {goog.dom.DomHelper}
 */
npf.events.TouchHandler.prototype.getDomHelper = function() {
  return this.domHelper_;
};

/**
 * Get the x and y positions from the event object.
 * @param {Event} nativeEvent
 * @return {Array.<goog.math.Coordinate>}
 * @private
 */
npf.events.TouchHandler.prototype.getPositionFromEvent_ = function(
    nativeEvent) {
  if (npf.userAgent.support.getTouch()) {
    // multitouch, return array with positions

    var pos = [];
    var touches = nativeEvent['touches'].length > 0
      ? nativeEvent['touches']
      : nativeEvent['changedTouches'];

    for (var t = 0; t < touches.length; t++) {
      pos.push(new goog.math.Coordinate(touches[t].pageX, touches[t].pageY));
    }

    return pos;
  } else {
    var evt = new goog.events.BrowserEvent(nativeEvent);

    // no touches, use the event pageX and pageY
    return [new goog.math.Coordinate(evt.clientX, evt.clientY)];
  }
};

/**
 * Calculate the scale size between two fingers.
 * @param {Array.<goog.math.Coordinate>} posStart
 * @param {Array.<goog.math.Coordinate>} posMove
 * @return {number}
 * @private
 */
npf.events.TouchHandler.prototype.calculateScale_ = function(posStart,
    posMove) {
  if (posStart.length == 2 && posMove.length == 2) {
    /** @type {number} */
    var x = posStart[0].x - posStart[1].x;
    /** @type {number} */
    var y = posStart[0].y - posStart[1].y;
    /** @type {number} */
    var startDistance = Math.sqrt(x * x + y * y);

    x = posMove[0].x - posMove[1].x;
    y = posMove[0].y - posMove[1].y;

    /** @type {number} */
    var endDistance = Math.sqrt((x*x) + (y*y));

    return endDistance / startDistance;
  }

  return 0;
};

/**
 * Calculate the rotation degrees between two fingers.
 * @param {Array.<goog.math.Coordinate>} posStart
 * @param {Array.<goog.math.Coordinate>} posMove
 * @return {number}
 * @private
 */
npf.events.TouchHandler.prototype.calculateRotation_ = function(posStart,
    posMove) {
  if (posStart.length == 2 && posMove.length == 2) {
    /** @type {number} */
    var x = posStart[0].x - posStart[1].x;
    /** @type {number} */
    var y = posStart[0].y - posStart[1].y;
    /** @type {number} */
    var startRotation = Math.atan2(y, x) * 180 / Math.PI;

    x = posMove[0].x - posMove[1].x;
    y = posMove[0].y - posMove[1].y;

    /** @type {number} */
    var endRotation = Math.atan2(y, x) * 180 / Math.PI;

    return endRotation - startRotation;
  }

  return 0;
};

/**
 * Cancel event.
 * @param {Event} nativeEvent
 * @private
 */
npf.events.TouchHandler.prototype.cancelEvent_ = function(nativeEvent) {
  if (nativeEvent.preventDefault) {
    nativeEvent.preventDefault();
    nativeEvent.stopPropagation();
  } else {
    nativeEvent.returnValue = false;
    nativeEvent.cancelBubble = true;
  }
};

/**
 * Reset the internal vars to the start values.
 * @private
 */
npf.events.TouchHandler.prototype.reset_ = function() {
  this.first_ = false;
  this.fingers_ = 0;
  this.distance_ = 0;
  this.angle_ = 0;
  this.gesture_ = null;
};

/**
 * Hold gesture.
 * Fired on touchstart.
 * @param {Event} nativeEvent
 * @private
 */
npf.events.TouchHandler.prototype.gesturesHold_ = function(nativeEvent) {
  // only when one finger is on the screen
  if (this.holdEnabled) {
    this.gesture_ = npf.events.TouchHandler.Gesture.HOLD;
    clearTimeout(this.holdTimer_);

    this.holdTimer_ = goog.Timer.callOnce(function() {
      if (this.gesture_ == npf.events.TouchHandler.Gesture.HOLD) {
        this.dispatchAndDispose_(npf.events.EventType.HOLD, nativeEvent, {
          position: this.startPos_
        });
      }
    }, this.holdTimeout, this);
  }
};

/**
 * Swipe gesture.
 * Fired on touchend.
 * @param {Event} nativeEvent
 * @private
 */
npf.events.TouchHandler.prototype.gesturesSwipe_ = function(nativeEvent) {
  if (!this.movePos_) {
    return;
  }

  // get the distance we moved

  /** @type {number} */
  var distanceX = this.movePos_[0].x - this.startPos_[0].x;
  /** @type {number} */
  var distanceY = this.movePos_[0].y - this.startPos_[0].y;
  this.distance_ = Math.sqrt(distanceX * distanceX + distanceY * distanceY);

  // compare the kind of gesture by time

  /** @type {number} */
  var now = new Date().getTime();
  /** @type {number} */
  var touchTime = now - this.touchStartTime_;

  if (
    this.swipeEnabled &&
    this.swipeTime > touchTime &&
    this.distance_ > this.swipeMinDistance
  ) {
    // calculate the angle
    this.angle_ = npf.events.TouchHandler.getAngle(
      this.startPos_[0], this.movePos_[0]);
    this.direction_ =
      npf.events.TouchHandler.getDirectionFromAngle(this.angle_);
    this.gesture_ = npf.events.TouchHandler.Gesture.SWIPE;

    /** @type {number} */
    var x = this.movePos_[0].x - this.offset_.x;
    /** @type {number} */
    var y = this.movePos_[0].y - this.offset_.y;

    this.dispatchAndDispose_(npf.events.EventType.SWIPE, nativeEvent, {
      position: new goog.math.Coordinate(x, y),
      direction: this.direction_,
      distance: this.distance_,
      distanceX: distanceX,
      distanceY: distanceY,
      angle: this.angle_
    });
  }
};

/**
 * Drag gesture
 * Fired on mousemove
 * @param {Event} nativeEvent
 * @private
 */
npf.events.TouchHandler.prototype.gesturesDrag_ = function(nativeEvent) {
  // get the distance we moved

  /** @type {number} */
  var distanceX = this.movePos_[0].x - this.startPos_[0].x;
  /** @type {number} */
  var distanceY = this.movePos_[0].y - this.startPos_[0].y;

  this.distance_ = Math.sqrt(distanceX * distanceX + distanceY * distanceY);

  // drag
  // minimal movement required
  if (
    this.dragEnabled &&
    this.distance_ > this.dragMinDistance ||
    this.gesture_ == npf.events.TouchHandler.Gesture.DRAG
  ) {
    // calculate the angle
    this.angle_ = npf.events.TouchHandler.getAngle(
      this.startPos_[0], this.movePos_[0]);
    this.direction_ =
      npf.events.TouchHandler.getDirectionFromAngle(this.angle_);

    var Direction = npf.events.TouchHandler.Direction;
    // check the movement and stop if we go in the wrong direction
    var is_vertical =
      (this.direction_ == Direction.UP || this.direction_ == Direction.DOWN);

    if (
      (
        (is_vertical && !this.dragVertical) ||
        (!is_vertical && !this.dragHorizontal)
      ) &&
      this.distance_ > this.dragMinDistance
    ) {
      return;
    }

    this.gesture_ = npf.events.TouchHandler.Gesture.DRAG;

    /** @type {number} */
    var x = this.movePos_[0].x - this.offset_.x;
    /** @type {number} */
    var y = this.movePos_[0].y - this.offset_.y;

    var eventObj = {
      angle: this.angle_,
      direction: this.direction_,
      distance: this.distance_,
      distanceX: distanceX,
      distanceY: distanceY,
      position: new goog.math.Coordinate(x, y)
    };

    // on the first time trigger the start event
    if (this.first_) {
      this.dispatchAndDispose_(
        npf.events.EventType.DRAGSTART, nativeEvent, eventObj);
      this.first_ = false;
    }

    this.dispatchAndDispose_(npf.events.EventType.DRAG, nativeEvent, eventObj);
    this.cancelEvent_(nativeEvent);
  }
};

/**
 * Transform gesture.
 * Fired on touchmove.
 * @param {Event} nativeEvent
 * @private
 */
npf.events.TouchHandler.prototype.gesturesTransform_ = function(nativeEvent) {
  if (this.transformEnabled) {
    if (npf.events.TouchHandler.countFingers(nativeEvent) != 2) {
      return false;
    }

    var rotation = this.calculateRotation_(this.startPos_, this.movePos_);
    var scale = this.calculateScale_(this.startPos_, this.movePos_);

    if (
      this.gesture_ != npf.events.TouchHandler.Gesture.DRAG &&
      (
        this.gesture_ == npf.events.TouchHandler.Gesture.TRANSFORM ||
        Math.abs(1-scale) > this.scaleTreshold ||
        Math.abs(rotation) > this.rotationTreshold
      )
    ) {
      this.gesture_ = npf.events.TouchHandler.Gesture.TRANSFORM;

      /** @type {number} */
      var x = (this.movePos_[0].x + this.movePos_[1].x) / 2 - this.offset_.x;
      /** @type {number} */
      var y = (this.movePos_[0].y + this.movePos_[1].y) / 2 - this.offset_.y;

      this.centerPos_ = new goog.math.Coordinate(x, y);

      var eventObj = {
        position: this.centerPos_,
        rotation: rotation,
        scale: scale
      };

      if (this.first_) {
        this.dispatchAndDispose_(npf.events.EventType.TRANSFORMSTART,
          nativeEvent, eventObj);
        this.first_ = false;
      }

      this.dispatchAndDispose_(
        npf.events.EventType.TRANSFORM, nativeEvent, eventObj);
      this.cancelEvent_(nativeEvent);

      return true;
    }
  }

  return false;
};

/**
 * Tap and double tap gesture.
 * Fired on touchend.
 * @param {Event} nativeEvent
 * @private
 */
npf.events.TouchHandler.prototype.gesturesTap_ = function(nativeEvent) {
  // compare the kind of gesture by time

  /** @type {number} */
  var now = goog.now();
  /** @type {number} */
  var touchTime = now - this.touchStartTime_;

  // dont fire when hold is fired
  if (this.holdEnabled && !(this.holdEnabled && this.holdTimeout > touchTime)) {
    return;
  }

  // when previous event was tap and the tap was max_interval ms ago
  var isDoubleTap = (function() {
    if (
      this.prevTapPos_ &&
      this.tapDouble &&
      this.prevGesture_ == npf.events.TouchHandler.Gesture.TAP &&
      this.touchStartTime_ - this.prevTapEndTime_ < this.tapMaxInterval
    ) {
      /** @type {number} */
      var xDistance = Math.abs(this.prevTapPos_[0].x - this.startPos_[0].x);
      /** @type {number} */
      var yDistance = Math.abs(this.prevTapPos_[0].y - this.startPos_[0].y);

      return (this.prevTapPos_ && this.startPos_ &&
        Math.max(xDistance, yDistance) < this.tapDoubleDistance);
    }

    return false;
  })();

  if (isDoubleTap) {
    this.gesture_ = npf.events.TouchHandler.Gesture.DOUBLETAP;
    this.prevTapEndTime_ = null;

    this.dispatchAndDispose_(npf.events.EventType.DOUBLETAP, nativeEvent, {
      position: this.startPos_
    });
    this.cancelEvent_(nativeEvent);
  } else {
    // single tap is single touch

    /** @type {number} */
    var xDistance = this.movePos_
      ? Math.abs(this.movePos_[0].x - this.startPos_[0].x)
      : 0;
    /** @type {number} */
    var yDistance = this.movePos_
      ? Math.abs(this.movePos_[0].y - this.startPos_[0].y)
      : 0;

    this.distance_ = Math.max(xDistance, yDistance);

    if (this.distance_ < this.tapMaxDistance) {
      this.gesture_ = npf.events.TouchHandler.Gesture.TAP;
      this.prevTapEndTime_ = now;
      this.prevTapPos_ = this.startPos_;

      if (this.tapEnabled) {
        this.dispatchAndDispose_(npf.events.EventType.TAP, nativeEvent, {
          position: this.startPos_
        });
        this.cancelEvent_(nativeEvent);
      }
    }
  }
};

/**
 * @param {goog.events.BrowserEvent} evt
 * @private
 */
npf.events.TouchHandler.prototype.onStart_ = function(evt) {
  var nativeEvent = evt.getBrowserEvent();

  this.startPos_ = this.getPositionFromEvent_(nativeEvent);
  this.touchStartTime_ = goog.now();
  this.fingers_ = npf.events.TouchHandler.countFingers(nativeEvent);
  this.first_ = true;
  this.startEvent_ = nativeEvent;

  // borrowed from jquery offset
  // https://github.com/jquery/jquery/blob/master/src/offset.js

  var box = this.element.getBoundingClientRect();
  /** @type {Element} */
  var bodyElement = this.domHelper_.getDocument().body;
  /** @type {!Window} */
  var win = this.domHelper_.getWindow();
  /** @type {number} */
  var clientTop = this.element.clientTop  || bodyElement.clientTop  || 0;
  /** @type {number} */
  var clientLeft = this.element.clientLeft || bodyElement.clientLeft || 0;
  /** @type {number} */
  var scrollTop = win.pageYOffset || this.element.scrollTop ||
    bodyElement.scrollTop;
  /** @type {number} */
  var scrollLeft = win.pageXOffset || this.element.scrollLeft ||
    bodyElement.scrollLeft;
  /** @type {number} */
  var x = box.left + scrollLeft - clientLeft;
  /** @type {number} */
  var y = box.top + scrollTop - clientTop;

  this.offset_ = new goog.math.Coordinate(x, y);
  this.mousedown_ = true;

  // hold gesture
  this.gesturesHold_(nativeEvent);

  if (this.preventDefault) {
    this.cancelEvent_(nativeEvent);
  }
};

/**
 * @param {goog.events.BrowserEvent} evt
 * @private
 */
npf.events.TouchHandler.prototype.onProgress_ = function(evt) {
  if (!this.mousedown_) {
    return false;
  }

  /** @type {Event} */
  var nativeEvent = evt.getBrowserEvent();

  this.moveEvent_ = nativeEvent;
  this.movePos_ = this.getPositionFromEvent_(nativeEvent);

  if (!this.gesturesTransform_(nativeEvent)) {
    this.gesturesDrag_(nativeEvent);
  }
};

/**
 * @param {goog.events.BrowserEvent} evt
 * @private
 */
npf.events.TouchHandler.prototype.onMouseOut_ = function(evt) {
  if (!npf.events.isMouseEventWithinElement(evt, this.element)) {
    this.onEnd_(evt);
  }
};

/**
 * @param {goog.events.BrowserEvent} evt
 * @private
 */
npf.events.TouchHandler.prototype.onEnd_ = function(evt) {
  /** @type {Event} */
  var nativeEvent = evt.getBrowserEvent();

  if (
    !this.mousedown_ ||
    (
      this.gesture_ != npf.events.TouchHandler.Gesture.TRANSFORM &&
      nativeEvent['touches'] &&
      nativeEvent['touches'].length > 0
    )
  ) {
    return false;
  }

  this.mousedown_ = false;
  this.endEvent_ = nativeEvent;

  var dragging = this.gesture_ == npf.events.TouchHandler.Gesture.DRAG;

  // swipe gesture
  this.gesturesSwipe_(nativeEvent);

  if (dragging) {
    this.dispatchAndDispose_(npf.events.EventType.DRAGEND, nativeEvent, {
      angle: this.angle_,
      direction: this.direction_,
      distance: this.distance_
    });
  } else if (this.gesture_ == npf.events.TouchHandler.Gesture.TRANSFORM) {
    this.dispatchAndDispose_(npf.events.EventType.TRANSFORMEND, nativeEvent, {
      position: this.centerPos_,
      rotation: this.calculateRotation_(this.startPos_, this.movePos_),
      scale: this.calculateScale_(this.startPos_, this.movePos_)
    });
  } else {
    this.gesturesTap_(nativeEvent);
  }

  this.prevGesture_ = this.gesture_;
  this.dispatchAndDispose_(npf.events.EventType.RELEASE, nativeEvent, {
    gesture: this.gesture_
  });

  this.reset_();
};

/**
 * @param {npf.events.EventType} type
 * @param {Event} nativeEvent
 * @param {Object=} opt_params
 * @private
 */
npf.events.TouchHandler.prototype.dispatchAndDispose_ = function(type,
    nativeEvent, opt_params) {
  var event = new goog.events.BrowserEvent(nativeEvent);
  event.type = type;
  event.touches = this.getPositionFromEvent_(nativeEvent);

  if (opt_params) {
    goog.object.extend(event, opt_params);
  }

  this.dispatchEvent(event);
};
