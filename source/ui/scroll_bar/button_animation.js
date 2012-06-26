goog.provide('npf.ui.scrollBar.ButtonAnimation');

goog.require('goog.async.Delay');
goog.require('goog.events');
goog.require('goog.events.EventTarget');
goog.require('goog.fx.anim');


/**
 * @constructor
 * @extends {goog.events.EventTarget}
 */
npf.ui.scrollBar.ButtonAnimation = function() {
	goog.base(this);

	this._delay = new goog.async.Delay(this._animate, goog.fx.anim.TIMEOUT, this);
	this.registerDisposable(this._delay);
};
goog.inherits(npf.ui.scrollBar.ButtonAnimation, goog.events.EventTarget);


/**
 * @enum {string}
 */
npf.ui.scrollBar.ButtonAnimation.EventType = {
	/**
	 * direction (npf.ui.scrollBar.ButtonAnimation.Direction)
	 */
	START: goog.events.getUniqueId('start'),
	/**
	 * direction (npf.ui.scrollBar.ButtonAnimation.Direction)
	 */
	FINISH: goog.events.getUniqueId('finish'),
	/**
	 * direction (npf.ui.scrollBar.ButtonAnimation.Direction)
	 * move (number)
	 */
	ANIMATE: goog.events.getUniqueId('animate')
};

/**
 * @enum {number}
 */
npf.ui.scrollBar.ButtonAnimation.Direction = {
	DOWN: 1,
	UP: 2
};

/**
 * @type {number}
 * @const
 */
npf.ui.scrollBar.ButtonAnimation.STEP = 20;

/**
 * @type {goog.async.Delay}
 * @private
 */
npf.ui.scrollBar.ButtonAnimation.prototype._delay;

/**
 * @type {npf.ui.scrollBar.ButtonAnimation.Direction}
 * @private
 */
npf.ui.scrollBar.ButtonAnimation.prototype._direction = npf.ui.scrollBar.ButtonAnimation.Direction.DOWN;

/**
 * @type {boolean}
 * @private
 */
npf.ui.scrollBar.ButtonAnimation.prototype._isAnimated = false;


/** @inheritDoc */
npf.ui.scrollBar.ButtonAnimation.prototype.disposeInternal = function() {
	this.stop();

	goog.base(this, 'disposeInternal');

	delete this._delay;
	delete this._isAnimated;
};

/**
 * @return {boolean}
 */
npf.ui.scrollBar.ButtonAnimation.prototype.isAnimated = function() {
	return this._isAnimated;
};

/**
 * @return {npf.ui.scrollBar.ButtonAnimation.Direction}
 */
npf.ui.scrollBar.ButtonAnimation.prototype.getDirection = function() {
	return this._direction;
};

/**
 * @param {npf.ui.scrollBar.ButtonAnimation.Direction} direction
 */
npf.ui.scrollBar.ButtonAnimation.prototype.start = function(direction) {
	if (this._isAnimated && this._direction == direction) {
		return;
	}

	if (this._isAnimated) {
		this.stop();
	}

	this._isAnimated = true;
	this._direction = direction;
	this._delay.start();

	this.dispatchEvent({
		type: npf.ui.scrollBar.ButtonAnimation.EventType.START,
		direction: this._direction
	});
};

npf.ui.scrollBar.ButtonAnimation.prototype.stop = function() {
	if (!this._isAnimated) {
		return;
	}

	this._isAnimated = false;
	this._delay.stop();
	this.dispatchEvent({
		type: npf.ui.scrollBar.ButtonAnimation.EventType.FINISH,
		direction: this._direction
	});
};

/**
 * @private
 */
npf.ui.scrollBar.ButtonAnimation.prototype._animate = function() {
	this._delay.start();

	/** @type {number} */
	var move = npf.ui.scrollBar.ButtonAnimation.STEP;

	if (npf.ui.scrollBar.ButtonAnimation.Direction.UP == this._direction) {
		move = -move;
	}

	this.dispatchEvent({
		type: npf.ui.scrollBar.ButtonAnimation.EventType.ANIMATE,
		direction: this._direction,
		move: move
	});
};
