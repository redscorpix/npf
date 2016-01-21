goog.provide('npf.fx.cssAnimation.Event');

goog.require('goog.events.Event');


/**
 * @param {npf.fx.cssAnimation.EventType} type
 * @param {npf.fx.CssAnimation} animation
 * @constructor
 * @struct
 * @extends {goog.events.Event}
 */
npf.fx.cssAnimation.Event = function(type, animation) {
  npf.fx.cssAnimation.Event.base(this, 'constructor', type);

  /**
   * @type {number}
   */
  this.delay = animation.getDelay();

  /**
   * @type {npf.style.animation.Direction}
   */
  this.direction = animation.getDirection();

  /**
   * @type {number}
   */
  this.duration = animation.getDuration();

  /**
   * @type {number}
   */
  this.iterationCount = animation.getIterationCount();

  /**
   * @type {npf.style.animation.PlayState}
   */
  this.state = animation.getState();
};
goog.inherits(npf.fx.cssAnimation.Event, goog.events.Event);
