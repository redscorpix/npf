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

goog.exportSymbol('npfAnimationQueue', npfTransition.Queue);
goog.exportSymbol('npfAnimationQueue.prototype.add', npfTransition.Queue.prototype.add);
goog.exportSymbol('npfAnimationQueue.prototype.remove', npfTransition.Queue.prototype.remove);
goog.exportSymbol('npfAnimationQueue.prototype.dispose', npfTransition.Queue.prototype.dispose);
goog.exportSymbol('npfAnimationQueue.prototype.isDisposed', npfTransition.Queue.prototype.isDisposed);
goog.exportSymbol('npfAnimationParallelQueue', npfTransition.ParallelQueue);
goog.exportSymbol('npfAnimationParallelQueue.prototype.add', npfTransition.ParallelQueue.prototype.add);
goog.exportSymbol('npfAnimationParallelQueue.prototype.remove', npfTransition.ParallelQueue.prototype.remove);
goog.exportSymbol('npfAnimationParallelQueue.prototype.play', npfTransition.ParallelQueue.prototype.play);
goog.exportSymbol('npfAnimationParallelQueue.prototype.pause', npfTransition.ParallelQueue.prototype.pause);
goog.exportSymbol('npfAnimationParallelQueue.prototype.stop', npfTransition.ParallelQueue.prototype.stop);
goog.exportSymbol('npfAnimationParallelQueue.prototype.dispose', npfTransition.ParallelQueue.prototype.dispose);
goog.exportSymbol('npfAnimationParallelQueue.prototype.isDisposed', npfTransition.ParallelQueue.prototype.isDisposed);
goog.exportSymbol('npfAnimationSerialQueue', npfTransition.SerialQueue);
goog.exportSymbol('npfAnimationSerialQueue.prototype.add', npfTransition.SerialQueue.prototype.add);
goog.exportSymbol('npfAnimationSerialQueue.prototype.remove', npfTransition.SerialQueue.prototype.remove);
goog.exportSymbol('npfAnimationSerialQueue.prototype.play', npfTransition.SerialQueue.prototype.play);
goog.exportSymbol('npfAnimationSerialQueue.prototype.pause', npfTransition.SerialQueue.prototype.pause);
goog.exportSymbol('npfAnimationSerialQueue.prototype.stop', npfTransition.SerialQueue.prototype.stop);
goog.exportSymbol('npfAnimationSerialQueue.prototype.dispose', npfTransition.SerialQueue.prototype.dispose);
goog.exportSymbol('npfAnimationSerialQueue.prototype.isDisposed', npfTransition.SerialQueue.prototype.isDisposed);
