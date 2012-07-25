goog.provide('npfTransition.Queue');
goog.provide('npfTransition.ParallelQueue');
goog.provide('npfTransition.SerialQueue');

goog.require('goog.fx.AnimationParallelQueue');
goog.require('goog.fx.AnimationQueue');
goog.require('goog.fx.AnimationSerialQueue');


/**
 * @constructor
 * @extends {goog.fx.AnimationQueue}
 */
npfTransition.Queue = function() {
    goog.base(this);
};
goog.inherits(npfTransition.Queue, goog.fx.AnimationQueue);

/**
 * @constructor
 * @extends {goog.fx.AnimationParallelQueue}
 */
npfTransition.ParallelQueue = function() {
    goog.base(this);
};
goog.inherits(npfTransition.ParallelQueue, goog.fx.AnimationParallelQueue);

/**
 * @constructor
 * @extends {goog.fx.AnimationSerialQueue}
 */
npfTransition.SerialQueue = function() {
    goog.base(this);
};
goog.inherits(npfTransition.SerialQueue, goog.fx.AnimationSerialQueue);

