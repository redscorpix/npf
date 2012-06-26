goog.provide('npf.fx.AwaitingAnimation');

goog.require('goog.events');
goog.require('goog.events.EventTarget');
goog.require('goog.fx.TransitionBase');
goog.require('goog.fx.Transition.EventType');


/**
 * @constructor
 * @extends {goog.events.EventTarget}
 */
npf.fx.AwaitingAnimation = function() {
	goog.base(this);
};
goog.inherits(npf.fx.AwaitingAnimation, goog.events.EventTarget);


/**
 * @enum {string}
 */
npf.fx.AwaitingAnimation.EventType = {
	ADD: goog.events.getUniqueId('add'),
	REMOVE: goog.events.getUniqueId('remove'),
	PLAY: goog.events.getUniqueId('play')
};

/**
 * @type {goog.fx.TransitionBase}
 * @private
 */
npf.fx.AwaitingAnimation.prototype._animation = null;

/**
 * @type {goog.fx.TransitionBase}
 * @private
 */
npf.fx.AwaitingAnimation.prototype._awaitingAnimation = null;


/** @inheritDoc */
npf.fx.AwaitingAnimation.prototype.disposeInternal = function() {
	if (this._awaitingAnimation) {
		this.dispatchRemoveEvent(this._awaitingAnimation);
		this._awaitingAnimation.dispose();
	}

	if (this._animation) {
		this.dispatchRemoveEvent(this._animation);
		this._animation.dispose();
	}

	goog.base(this, 'disposeInternal');

	delete this._animation;
	delete this._awaitingAnimation;
};

/**
 * @param {goog.fx.TransitionBase} animation
 * @return {boolean}
 */
npf.fx.AwaitingAnimation.prototype.play = function(animation) {
	this.dispatchAddEvent(animation);

	if (this._animation) {
		if (this._awaitingAnimation) {
			this.dispatchRemoveEvent(this._awaitingAnimation);
			this._awaitingAnimation.dispose();
		}

		this._awaitingAnimation = animation;

		return false;
	}

	this._animation = animation;
	this._animation.addEventListener(goog.fx.Transition.EventType.FINISH, this._onFinish, false, this);
	this.dispatchPlayEvent(this._animation);
	this._animation.play();

	return true;
};

/**
 * @param {goog.events.Event} evt
 */
npf.fx.AwaitingAnimation.prototype._onFinish = function(evt) {
	this.dispatchRemoveEvent(this._animation);
	this._animation.dispose();
	this._animation = null;

	if (this._awaitingAnimation) {
		/** @type {!goog.fx.TransitionBase} */
		var animation = this._awaitingAnimation;
		this._awaitingAnimation = null;
		this.play(animation);
	}
};

/**
 * @param {goog.fx.TransitionBase} animation
 * @protected
 */
npf.fx.AwaitingAnimation.prototype.dispatchAddEvent = function(animation) {
	this.dispatchEvent({
		type: npf.fx.AwaitingAnimation.EventType.ADD,
		animation: animation
	});
};

/**
 * @param {goog.fx.TransitionBase} animation
 * @protected
 */
npf.fx.AwaitingAnimation.prototype.dispatchRemoveEvent = function(animation) {
	this.dispatchEvent({
		type: npf.fx.AwaitingAnimation.EventType.REMOVE,
		animation: animation
	});
};

/**
 * @param {goog.fx.TransitionBase} animation
 * @protected
 */
npf.fx.AwaitingAnimation.prototype.dispatchPlayEvent = function(animation) {
	this.dispatchEvent({
		type: npf.fx.AwaitingAnimation.EventType.PLAY,
		animation: animation
	});
};
