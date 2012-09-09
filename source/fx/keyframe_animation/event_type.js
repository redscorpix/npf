goog.provide('npf.fx.keyframeAnimation.EventType');

goog.require('npf.fx.keyframeAnimation.EventType');


/**
 * Events fired by the animation.
 * @enum {string}
 * @deprecated Use npf.fx.keyframeAnimation.EventType.
 */
npf.fx.keyframeAnimation.EventType = {
  /**
   * Dispatched when played for the first time OR when it is resumed.
   */
  PLAY: npf.fx.keyframeAnimation.EventType.PLAY,

  /**
   * Dispatched only when the animation starts from the beginning.
   */
  BEGIN: npf.fx.keyframeAnimation.EventType.BEGIN,

  /**
   * Dispatched only when animation is restarted after a pause.
   */
  RESUME: npf.fx.keyframeAnimation.EventType.RESUME,

  /**
   * Dispatched when animation comes to the end of its duration OR stop
   * is called.
   */
  END: npf.fx.keyframeAnimation.EventType.END,

  /**
   * Dispatched only when stop is called.
   */
  STOP: npf.fx.keyframeAnimation.EventType.STOP,

  /**
   * Dispatched only when animation comes to its end naturally.
   */
  FINISH: npf.fx.keyframeAnimation.EventType.FINISH,

  /**
   * Dispatched when an animation is paused.
   */
  PAUSE: npf.fx.keyframeAnimation.EventType.PAUSE,

  /**
   * Only if iteration count > 1
   */
  ITERATION: npf.fx.keyframeAnimation.EventType.ITERATION
};
