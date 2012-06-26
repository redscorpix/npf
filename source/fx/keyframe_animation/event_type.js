goog.provide('npf.fx.keyframeAnimation.EventType');

goog.require('goog.events');
goog.require('goog.fx.Transition.EventType');


/**
 * Events fired by the animation.
 * @enum {string}
 */
npf.fx.keyframeAnimation.EventType = {
  /**
   * Dispatched when played for the first time OR when it is resumed.
   */
  PLAY: goog.fx.Transition.EventType.PLAY,

  /**
   * Dispatched only when the animation starts from the beginning.
   */
  BEGIN: goog.fx.Transition.EventType.BEGIN,

  /**
   * Dispatched only when animation is restarted after a pause.
   */
  RESUME: goog.fx.Transition.EventType.RESUME,

  /**
   * Dispatched when animation comes to the end of its duration OR stop
   * is called.
   */
  END: goog.fx.Transition.EventType.END,

  /**
   * Dispatched only when stop is called.
   */
  STOP: goog.fx.Transition.EventType.STOP,

  /**
   * Dispatched only when animation comes to its end naturally.
   */
  FINISH: goog.fx.Transition.EventType.FINISH,

  /**
   * Dispatched when an animation is paused.
   */
  PAUSE: goog.fx.Transition.EventType.PAUSE,

  /**
   * Only if this._iterationCount > 1
   */
  ITERATION: goog.events.getUniqueId('iteration')
};
