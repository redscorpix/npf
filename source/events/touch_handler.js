goog.provide('npf.events.TouchHandler');

goog.require('goog.events.BrowserEvent');
goog.require('goog.events.EventHandler');
goog.require('goog.events.EventTarget');
goog.require('goog.events.EventType');
goog.require('goog.math.Coordinate');
goog.require('goog.object');
goog.require('npf.events');
goog.require('npf.events.EventType');
goog.require('npf.userAgent.support');


/**
 * @source Hammer.JS, version 0.6.1, https://github.com/EightMedia/hammer.js
 * @constructor
 * @extends {goog.events.EventTarget}
 */
npf.events.TouchHandler = function(element) {
	goog.base(this);

	this.element = element;
	this._prevTapPos = [new goog.math.Coordinate(0, 0)];

	this._handler = new goog.events.EventHandler();
	this.registerDisposable(this._handler);

	if (this.cssHacks) {
		var vendors = ['webkit', 'moz', 'ms', 'o', ''];
		var cssProps = {
			"userSelect": "none",
			"touchCallout": "none",
			"userDrag": "none",
			"tapHighlightColor": "rgba(0,0,0,0)"
		};

		for (var i = 0; i < vendors.length; i++) {
			for (var p in cssProps) {
				varprop = p;

				if (vendors[i]) {
					prop = vendors[i] + prop.substring(0, 1).toUpperCase() + prop.substring(1);
				}

				this.element.style[prop] = cssProps[p];
			}
		}
	}

	if (npf.userAgent.support.isTouchSupported()) {
		// bind events for touch devices
		// except for windows phone 7.5, it doesnt support touch events..!
		this._handler
			.listen(this.element, goog.events.EventType.TOUCHSTART, this._onStart, false, this)
			.listen(this.element, goog.events.EventType.TOUCHMOVE, this._onProgress, false, this)
			.listen(this.element, goog.events.EventType.TOUCHEND, this._onEnd, false, this)
			.listen(this.element, goog.events.EventType.TOUCHCANCEL, this._onEnd, false, this);
	} else {
		// for non-touch
		this._handler
			.listen(this.element, goog.events.EventType.MOUSEDOWN, this._onStart, false, this)
			.listen(this.element, goog.events.EventType.MOUSEMOVE, this._onProgress, false, this)
			.listen(this.element, goog.events.EventType.MOUSEOUT, this._onMouseOut, false, this)
			.listen(this.element, goog.events.EventType.MOUSEUP, this._onEnd, false, this);
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
 * @return {npf.events.TouchHandler.Direction|undefined} direction
 */
npf.events.TouchHandler.getDirectionFromAngle = function(angle) {
	var directions = goog.object.create(
		npf.events.TouchHandler.Direction.DOWN, angle >= 45 && angle < 135, // 90
		npf.events.TouchHandler.Direction.LEFT, angle >= 135 || angle <= -135, // 180
		npf.events.TouchHandler.Direction.UP, angle < -45 && angle > -135, // 270
		npf.events.TouchHandler.Direction.RIGHT, angle >= -45 && angle <= 45 // 0
	);

	var direction;

	for (var key in directions) {
		if (directions[key]) {
			direction = key;
			break;
		}
	}

	return direction;
};

/**
 * count the number of fingers in the event
 * when no fingers are detected, one finger is returned (mouse pointer)
 * @param {goog.events.BrowserEvent} event
 * @return {number}
 */
npf.events.TouchHandler.countFingers = function(event) {
	/** @type {Event} */
	var browserEvent = event.getBrowserEvent();

	// there is a bug on android (until v4?) that touches is always 1,
	// so no multitouch is supported, e.g. no, zoom and rotation...
	return browserEvent['touches'] ? browserEvent['touches'].length : 1;
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
 * @type {Element}
 */
npf.events.TouchHandler.prototype.element;

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
 * @type {number}
 * @private
 */
npf.events.TouchHandler.prototype._distance = 0;

/**
 * Holds the exact angle that has been moved.
 * @type {number}
 * @private
 */
npf.events.TouchHandler.prototype._angle = 0;

/**
 * Holds the diraction that has been moved.
 * @type {npf.events.TouchHandler.Direction}
 * @private
 */
npf.events.TouchHandler.prototype._direction = 0;

/**
 * How many fingers are on the screen.
 * @type {number}
 * @private
 */
npf.events.TouchHandler.prototype._fingers = 0;

/**
 * @type {boolean}
 * @private
 */
npf.events.TouchHandler.prototype._first = false;

/**
 * @type {?npf.events.TouchHandler.Gesture}
 * @private
 */
npf.events.TouchHandler.prototype._gesture = null;

/**
 * @type {?npf.events.TouchHandler.Gesture}
 * @private
 */
npf.events.TouchHandler.prototype._prevGesture = null;

/**
 * @type {?number}
 * @private
 */
npf.events.TouchHandler.prototype._touchStartTime = null;

/**
 * @type {Array.<goog.math.Coordinate>}
 * @private
 */
npf.events.TouchHandler.prototype._prevTapPos;

/**
 * @type {?number}
 * @private
 */
npf.events.TouchHandler.prototype._prevTapEndTime = null;

/**
 * @type {?number}
 */
npf.events.TouchHandler.prototype._holdTimer = null;

/**
 * @type {goog.math.Coordinate}
 * @private
 */
npf.events.TouchHandler.prototype._offset = null;

/**
 * Keep track of the mouse status.
 * @type {boolean}
 * @private
 */
npf.events.TouchHandler.prototype._mousedown = false;

/**
 * @type {goog.events.BrowserEvent}
 * @private
 */
npf.events.TouchHandler.prototype._startEvent = null;

/**
 * @type {goog.events.BrowserEvent}
 * @private
 */
npf.events.TouchHandler.prototype._moveEvent = null;

/**
 * @type {goog.events.BrowserEvent}
 * @private
 */
npf.events.TouchHandler.prototype._endEvent = null;

/**
 * @type {goog.events.EventHandler}
 * @private
 */
npf.events.TouchHandler.prototype._handler;

/**
 * @type {Array.<goog.math.Coordinate>}
 * @private
 */
npf.events.TouchHandler.prototype._startPos = null;

/**
 * @type {Array.<goog.math.Coordinate>}
 * @private
 */
npf.events.TouchHandler.prototype._movePos = null;

/**
 * @type {goog.math.Coordinate}
 * @private
 */
npf.events.TouchHandler.prototype._centerPos = null;


/** @inheritDoc */
npf.events.TouchHandler.prototype.disposeInternal = function() {
	goog.base(this, 'disposeInternal');

	delete this.element;
	delete this.preventDefault;
	delete this.cssHacks;
	delete this.swipeEnabled;
	delete this.swipeTime;
	delete this.swipeMinDistance;
	delete this.dragEnabled;
	delete this.dragVertical;
	delete this.dragHorizontal;
	delete this.dragMinDistance;
	delete this.transformEnabled;
	delete this.scaleTreshold;
	delete this.rotationTreshold;
	delete this.tapEnabled;
	delete this.tapDouble;
	delete this.tapMaxInterval;
	delete this.tapMaxDistance;
	delete this.tapDoubleDistance;
	delete this.holdEnabled;
	delete this.holdTimeout;
	delete this._distance;
	delete this._angle;
	delete this._direction;
	delete this._fingers;
	delete this._first;
	delete this._gesture;
	delete this._prevGesture;
	delete this._touchStartTime;
	delete this._prevTapPos;
	delete this._prevTapEndTime;
	delete this._holdTimer;
	delete this._offset;
	delete this._mousedown;
	delete this._startEvent;
	delete this._moveEvent;
	delete this._endEvent;
	delete this._handler;
	delete this._startPos;
	delete this._movePos;
	delete this._centerPos;
};

/**
 * Get the x and y positions from the event object.
 * @param {goog.events.BrowserEvent} event
 * @return {Array.<goog.math.Coordinate>}
 * @private
 */
npf.events.TouchHandler.prototype._getPositionFromEvent = function(event) {
	if (npf.userAgent.support.isTouchSupported()) {
		// multitouch, return array with positions

		var pos = [];
		/** @type {Event} */
		var browserEvent = event.getBrowserEvent();
		var touches = browserEvent['touches'].length > 0 ? browserEvent['touches'] : browserEvent['changedTouches'];

		for (var t = 0; t < touches.length; t++) {
			pos.push(new goog.math.Coordinate(touches[t].pageX, touches[t].pageY));
		}

		return pos;
	} else {
		// no touches, use the event pageX and pageY
		return [new goog.math.Coordinate(event.clientX, event.clientY)];
	}
};

/**
 * Calculate the scale size between two fingers.
 * @param {Array.<goog.math.Coordinate>} posStart
 * @param {Array.<goog.math.Coordinate>} posMove
 * @return {number}
 * @private
 */
npf.events.TouchHandler.prototype._calculateScale = function(posStart, posMove) {
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
npf.events.TouchHandler.prototype._calculateRotation = function(posStart, posMove) {
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
 * @param {goog.events.BrowserEvent} event
 * @private
 */
npf.events.TouchHandler.prototype._cancelEvent = function(event) {
	if (event.preventDefault) {
		event.preventDefault();
		event.stopPropagation();
	} else {
		event.returnValue = false;
		event.cancelBubble = true;
	}
};

/**
 * Reset the internal vars to the start values.
 * @private
 */
npf.events.TouchHandler.prototype._reset = function() {
	this._first = false;
	this._fingers = 0;
	this._distance = 0;
	this._angle = 0;
	this._gesture = null;
};

/**
 * Hold gesture.
 * Fired on touchstart.
 * @param {goog.events.BrowserEvent} event
 * @private
 */
npf.events.TouchHandler.prototype._gesturesHold = function(event) {
	// only when one finger is on the screen
	if (this.holdEnabled) {
		this._gesture = npf.events.TouchHandler.Gesture.HOLD;
		clearTimeout(this._holdTimer);

		this._holdTimer = setTimeout(function() {
			if (this._gesture == npf.events.TouchHandler.Gesture.HOLD) {
				this._dispatchAndDispose(npf.events.EventType.HOLD, event, {
					position: this._startPos
				});
			}
		}, this.holdTimeout);
	}
};

/**
 * Swipe gesture.
 * Fired on touchend.
 * @param {goog.events.BrowserEvent} event
 * @private
 */
npf.events.TouchHandler.prototype._gesturesSwipe = function(event) {
	if (!this._movePos) {
		return;
	}

	// get the distance we moved
	var distanceX = this._movePos[0].x - this._startPos[0].x;
	var distanceY = this._movePos[0].y - this._startPos[0].y;
	this._distance = Math.sqrt(distanceX * distanceX + distanceY * distanceY);

	// compare the kind of gesture by time
	var now = new Date().getTime();
	var touch_time = now - this._touchStartTime;

	if (this.swipeEnabled && (this.swipeTime > touch_time) && (this._distance > this.swipeMinDistance)) {
		// calculate the angle
		this._angle = npf.events.TouchHandler.getAngle(new goog.math.Coordinate(this._startPos[0], this._movePos[0]));
		this._direction = npf.events.TouchHandler.getDirectionFromAngle(this._angle);

		this._gesture = npf.events.TouchHandler.Gesture.SWIPE;

		var position = new goog.math.Coordinate(this._movePos[0].x - this._offset.x, this._movePos[0].y - this._offset.y);

		this._dispatchAndDispose(npf.events.EventType.SWIPE, event, {
			position: position,
			direction: this._direction,
			distance: this._distance,
			distanceX: distanceX,
			distanceY: distanceY,
			angle: this._angle
		});
	}
};

/**
 * Drag gesture
 * Fired on mousemove
 * @param {goog.events.BrowserEvent} event
 * @private
 */
npf.events.TouchHandler.prototype._gesturesDrag = function(event) {
	// get the distance we moved
	var distanceX = this._movePos[0].x - this._startPos[0].x;
	var distanceY = this._movePos[0].y - this._startPos[0].y;

	this._distance = Math.sqrt(distanceX * distanceX + distanceY * distanceY);

	// drag
	// minimal movement required
	if (this.dragEnabled && (this._distance > this.dragMinDistance) || this._gesture == npf.events.TouchHandler.Gesture.DRAG) {
		// calculate the angle
		this._angle = npf.events.TouchHandler.getAngle(new goog.math.Coordinate(this._startPos[0], this._movePos[0]));
		this._direction = npf.events.TouchHandler.getDirectionFromAngle(this._angle);

		// check the movement and stop if we go in the wrong direction
		var is_vertical = (this._direction == npf.events.TouchHandler.Direction.UP || this._direction == npf.events.TouchHandler.Direction.DOWN);

		if (
			((is_vertical && !this.dragVertical) || (!is_vertical && !this.dragHorizontal)) &&
			(this._distance > this.dragMinDistance)
		) {
			return;
		}

		this._gesture = npf.events.TouchHandler.Gesture.DRAG;

		var position = new goog.math.Coordinate(this._movePos[0].x - this._offset.x, this._movePos[0].y - this._offset.y);

		var eventObj = {
			angle: this._angle
			direction: this._direction,
			distance: this._distance,
			distanceX: distanceX,
			distanceY: distanceY,
			position: position
		};

		// on the first time trigger the start event
		if (this._first) {
			this._dispatchAndDispose(npf.events.EventType.DRAGSTART, event, eventObj);
			this._first = false;
		}

		this._dispatchAndDispose(npf.events.EventType.DRAG, event, eventObj);
		this._cancelEvent(event);
	}
};

/**
 * Transform gesture.
 * Fired on touchmove.
 * @param {goog.events.BrowserEvent} event
 * @private
 */
npf.events.TouchHandler.prototype._gesturesTransform = function(event) {
	if (this.transformEnabled) {
		if (npf.events.TouchHandler.countFingers(event) != 2) {
			return false;
		}

		var rotation = this._calculateRotation(this._startPos, this._movePos);
		var scale = this._calculateScale(this._startPos, this._movePos);

		if (
			this._gesture != npf.events.TouchHandler.Gesture.DRAG &&
			(this._gesture == npf.events.TouchHandler.Gesture.TRANSFORM || Math.abs(1-scale) > this.scaleTreshold || Math.abs(rotation) > this.rotationTreshold)
		) {
			this._gesture = npf.events.TouchHandler.Gesture.TRANSFORM;

		 var x = (this._movePos[0].x + this._movePos[1].x) / 2 - this._offset.x;
		 var y = (this._movePos[0].y + this._movePos[1].y) / 2 - this._offset.y;

			this._centerPos = new goog.math.Coordinate(x, y);

			var eventObj = {
				position: this._centerPos,
				rotation: rotation,
				scale: scale
			};

			if (this._first) {
				this._dispatchAndDispose(npf.events.EventType.TRANSFORMSTART, event, eventObj);
				this._first = false;
			}

			this._dispatchAndDispose(npf.events.EventType.TRANSFORM, event, eventObj);
			this._cancelEvent(event);

			return true;
		}
	}

	return false;
};

/**
 * Tap and double tap gesture.
 * Fired on touchend.
 * @param {goog.events.BrowserEvent} event
 * @private
 */
npf.events.TouchHandler.prototype._gesturesTap = function(event) {
	// compare the kind of gesture by time
	var now = goog.now();
	var touchTime = now - this._touchStartTime;

	// dont fire when hold is fired
	if (this.holdEnabled && !(this.holdEnabled && this.holdTimeout > touchTime)) {
		return;
	}

	// when previous event was tap and the tap was max_interval ms ago
	var isDoubleTap = (function() {
		if (
			this._prevTapPos &&
			this.tapDouble &&
			this._prevGesture == npf.events.TouchHandler.Gesture.TAP &&
			this._touchStartTime - this._prevTapEndTime < this.tapMaxInterval
		) {
			var xDistance = Math.abs(this._prevTapPos[0].x - this._startPos[0].x);
			var yDistance = Math.abs(this._prevTapPos[0].y - this._startPos[0].y);

			return (this._prevTapPos && this._startPos && Math.max(xDistance, yDistance) < this.tapDoubleDistance);
		}

		return false;
	})();

	if (isDoubleTap) {
		this._gesture = npf.events.TouchHandler.Gesture.DOUBLETAP;
		this._prevTapEndTime = null;

		this._dispatchAndDispose(npf.events.EventType.DOUBLETAP, event, {
			position: this._startPos
		});

		this._cancelEvent(event);
	} else {
		// single tap is single touch
		var xDistance = this._movePos ? Math.abs(this._movePos[0].x - this._startPos[0].x) : 0;
		var yDistance = this._movePos ? Math.abs(this._movePos[0].y - this._startPos[0].y) : 0;

		this._distance = Math.max(xDistance, yDistance);

		if (this._distance < this.tapMaxDistance) {
			this._gesture = npf.events.TouchHandler.Gesture.TAP;
			this._prevTapEndTime = now;
			this._prevTapPos = this._startPos;

			if (this.tapEnabled) {
				this._dispatchAndDispose(npf.events.EventType.TAP, event, {
					position: this._startPos
				});

				this._cancelEvent(event);
			}
		}
	}
};

/**
 * @param {goog.events.BrowserEvent} evt
 * @private
 */
npf.events.TouchHandler.prototype._onStart = function(evt) {
	this._startPos = this._getPositionFromEvent(evt);
	this._touchStartTime = goog.now();
	this._fingers = npf.events.TouchHandler.countFingers(evt);
	this._first = true;
	this._startEvent = evt;

	// borrowed from jquery offset https://github.com/jquery/jquery/blob/master/src/offset.js
	var box = this.element.getBoundingClientRect();
	var clientTop  = this.element.clientTop  || document.body.clientTop  || 0;
	var clientLeft = this.element.clientLeft || document.body.clientLeft || 0;
	var scrollTop  = window.pageYOffset || this.element.scrollTop  || document.body.scrollTop;
	var scrollLeft = window.pageXOffset || this.element.scrollLeft || document.body.scrollLeft;

	this._offset = new goog.math.Coordinate(box.left + scrollLeft - clientLeft, box.top + scrollTop - clientTop);
	this._mousedown = true;

	// hold gesture
	this._gesturesHold(evt);

	if (this.preventDefault) {
		this._cancelEvent(evt);
	}
};

/**
 * @param {goog.events.BrowserEvent} evt
 * @private
 */
npf.events.TouchHandler.prototype._onProgress = function(evt) {
	if (!this._mousedown) {
		return false;
	}

	this._moveEvent = evt;
	this._movePos = this._getPositionFromEvent(evt);

	if (!this._gesturesTransform(evt)) {
		this._gesturesDrag(evt);
	}
};

/**
 * @param {goog.events.BrowserEvent} evt
 * @private
 */
npf.events.TouchHandler.prototype._onMouseOut = function(evt) {
	if (!npf.events.isMouseEventWithinElement(evt, this.element)) {
		this._onEnd(evt);
	}
};

/**
 * @param {goog.events.BrowserEvent} evt
 * @private
 */
npf.events.TouchHandler.prototype._onEnd = function(evt) {
	/** @type {Event} */
	var browserEvent = evt.getBrowserEvent();

	if (
		!this._mousedown ||
		(this._gesture != npf.events.TouchHandler.Gesture.TRANSFORM && browserEvent['touches'] && browserEvent['touches'].length > 0)
	) {
		return false;
	}

	this._mousedown = false;
	this._endEvent = evt;

	var dragging = this._gesture == npf.events.TouchHandler.Gesture.DRAG;

	// swipe gesture
	this._gesturesSwipe(evt);

	if (dragging) {
		this._dispatchAndDispose(npf.events.EventType.DRAGEND, evt, {
			angle: this._angle,
			direction: this._direction,
			distance: this._distance
		});
	} else if (this._gesture == npf.events.TouchHandler.Gesture.TRANSFORM) {
		this._dispatchAndDispose(npf.events.EventType.TRANSFORMEND, evt, {
			position: this._centerPos,
			rotation: this._calculateRotation(this._startPos, this._movePos),
			scale: this._calculateScale(this._startPos, this._movePos)
		});
	} else {
		this._gesturesTap(this._startEvent);
	}

	this._prevGesture = this._gesture;

	this._dispatchAndDispose(npf.events.EventType.RELEASE, evt, {
		gesture: this._gesture
	});

	// reset vars
	reset();
};

/**
 * @param {npf.events.EventType} type
 * @param {goog.events.BrowserEvent} evt
 * @param {Object=} opt_params
 * @private
 */
npf.events.TouchHandler.prototype._dispatchAndDispose = function(type, evt, opt_params) {
	var event = new goog.events.BrowserEvent(evt.getBrowserEvent());
	event.type = type;
	event.touches = this._getPositionFromEvent(evt);

	if (opt_params) {
		goog.object.extend(event, opt_params);
	}

	try {
		this.dispatchEvent(event);
	} finally {
		event.dispose();
	}
};
