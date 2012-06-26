goog.provide('npf.events.TapHandler');

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

	var handler = new goog.events.EventHandler();
	this.registerDisposable(handler);

	if (npf.userAgent.support.isTouchSupported()) {
		handler
			.listen(element, goog.events.EventType.TOUCHCANCEL, this._onTouchCancel, false, this)
			.listen(element, goog.events.EventType.TOUCHEND, this._onTouchEnd, false, this)
			.listen(element, goog.events.EventType.TOUCHMOVE, this._onTouchMove, false, this)
			.listen(element, goog.events.EventType.TOUCHSTART, this._onTouchStart, false, this);
	} else {
		handler.listen(element, goog.events.EventType.CLICK, this._onClick, false, this);
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
npf.events.TapHandler.prototype._element;

/**
 * @type {boolean}
 * @private
 */
npf.events.TapHandler.prototype._started = false;

/**
 * @type {number}
 * @private
 */
npf.events.TapHandler.prototype._startLeft;

/**
 * @type {number}
 * @private
 */
npf.events.TapHandler.prototype._startTop;


/** @inheritDoc */
npf.events.TapHandler.prototype.disposeInternal = function() {
	goog.base(this, 'disposeInternal');

	delete this._started;
	delete this._startLeft;
	delete this._startTop;
};

/**
 * @param {goog.events.BrowserEvent} evt
 * @private
 */
npf.events.TapHandler.prototype._onClick = function(evt) {
	this._dispatchAndDispose(evt);
};

/**
 * @param {goog.events.BrowserEvent} evt
 * @private
 */
npf.events.TapHandler.prototype._onTouchCancel = function(evt) {
	this._started = false;
};

/**
 * @param {goog.events.BrowserEvent} evt
 * @private
 */
npf.events.TapHandler.prototype._onTouchEnd = function(evt) {
	if (this._started) {
		this._dispatchAndDispose(evt);
	}
};

/**
 * @param {goog.events.BrowserEvent} evt
 * @private
 */
npf.events.TapHandler.prototype._onTouchMove = function(evt) {
	var touches = evt['touches'];

	if (this._started && goog.isArray(touches) && 1 == touches.length) {
		if (
			npf.events.TapHandler.MAX_MOVING < Math.abs(touches[0].pageX - this._startLeft) ||
			npf.events.TapHandler.MAX_MOVING < Math.abs(touches[0].pageY - this._startTop)
		) {
			this._started = false;
		}
	}
};

/**
 * @param {goog.events.BrowserEvent} evt
 * @private
 */
npf.events.TapHandler.prototype._onTouchStart = function(evt) {
	var touches = evt['touches'];

	if (goog.isArray(touches) && 1 == touches.length) {
		this._started = true;
		this._startLeft = /** @type {number} */ (touches[0].pageX);
		this._startTop = /** @type {number} */ (touches[0].pageY);
	}
};

/**
 * @param {goog.events.BrowserEvent} evt
 * @private
 */
npf.events.TapHandler.prototype._dispatchAndDispose = function(evt) {
	var event = new goog.events.BrowserEvent(evt.getBrowserEvent());
	event.type = npf.events.TapHandler.EventType.TAP;

	try {
		this.dispatchEvent(event);
	} finally {
		event.dispose();
	}
};
