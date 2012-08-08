goog.provide('npf.fx.keyframeAnimation.Event');

goog.require('goog.events.Event');


/**
 * @param {npf.fx.keyframeAnimation.EventType} type
 * @param {npf.fx.KeyframeAnimation} animation
 * @constructor
 * @extends {goog.events.Event}
 */
npf.fx.keyframeAnimation.Event = function(type, animation) {
  goog.base(this, type);

  /**
   * @type {number}
   */
  this.duration = animation.getDuration();

  /**
   * @type {npf.fx.KeyframeAnimation.PlayState}
   */
  this.state = animation.getState();

  /**
   * @type {number}
   */
  this.iterationCount = animation.getIterationCount();

  /**
   * @type {number}
   */
  this.delay = animation.getDelay();

  /**
   * @type {npf.fx.KeyframeAnimation.Direction}
   */
  this.direction = animation.getDirection();
};
goog.inherits(npf.fx.keyframeAnimation.Event, goog.events.Event);
