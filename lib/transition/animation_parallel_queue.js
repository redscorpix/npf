goog.provide('npfTransition.AnimationParallelQueue');

goog.require('goog.fx.AnimationSerialQueue');


/**
 * @constructor
 * @extends {goog.fx.AnimationSerialQueue}
 */
npfTransition.AnimationParallelQueue = function() {
	goog.base(this);
};
goog.inherits(npfTransition.AnimationParallelQueue, goog.fx.AnimationSerialQueue);


/**
 * @type {?function()}
 */
npfTransition.AnimationParallelQueue.prototype.onFinishHandler = null;


/** @inheritDoc */
npfTransition.AnimationParallelQueue.prototype.disposeInternal = function() {
	goog.base(this, 'disposeInternal');

	delete this.onFinishHandler;
};

/**
 * Plays the animation.
 *
 * @param {boolean=} opt_restart Optional parameter to restart the animation.
 * @return {npfTransition.AnimationParallelQueue}
 */
npfTransition.AnimationParallelQueue.prototype.play = function(opt_restart) {
	goog.base(this, 'play', opt_restart);

	return this;
};

/**
 * Pauses the animation.
 * @return {npfTransition.AnimationParallelQueue}
 */
npfTransition.AnimationParallelQueue.prototype.pause = function() {
	goog.base(this, 'pause');

	return this;
};

/**
 * Stops the animation.
 *
 * @param {boolean=} opt_gotoEnd Optional boolean parameter to go the the end of
 *     the animation.
 * @return {npfTransition.AnimationParallelQueue}
 */
npfTransition.AnimationParallelQueue.prototype.stop = function(opt_gotoEnd) {
	goog.base(this, 'stop', opt_gotoEnd);

	return this;
};

/**
 * Pushes an Animation to the end of the queue.
 * @param {goog.fx.TransitionBase} animation The animation to add to the queue.
 * @return {npfTransition.AnimationParallelQueue}
 */
npfTransition.AnimationParallelQueue.prototype.add = function(animation) {
	goog.base(this, 'add', animation);

	return this;
};

/**
 * Removes an Animation from the queue.
 * @param {goog.fx.Animation} animation The animation to remove.
 * @return {npfTransition.AnimationParallelQueue}
 */
npfTransition.AnimationParallelQueue.prototype.remove = function(animation) {
	goog.base(this, 'remove', animation);

	return this;
};

/** @inheritDoc */
npfTransition.AnimationParallelQueue.prototype.onAnimationFinish = function(e) {
	goog.base(this, 'onAnimationFinish', e);

	if (goog.isFunction(this.onFinishHandler)) {
		this.onFinishHandler();
	}
};
