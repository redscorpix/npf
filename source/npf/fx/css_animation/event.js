goog.provide('npf.fx.cssAnimation.Event');

goog.require('goog.events.Event');


/**
 * @param {npf.fx.cssAnimation.EventType} type
 * @param {npf.fx.CssAnimation} animation
 * @constructor
 * @extends {goog.events.Event}
 */
npf.fx.cssAnimation.Event = function(type, animation) {
  goog.base(this, type);

  /**
   * @type {number}
   */
  this.duration = animation.getDuration();

  /**
   * @type {npf.style.animation.PlayState}
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
   * @type {npf.style.animation.Direction}
   */
  this.direction = animation.getDirection();
};
goog.inherits(npf.fx.cssAnimation.Event, goog.events.Event);
