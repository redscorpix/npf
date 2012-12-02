goog.provide('npf.fx.Animation');
goog.provide('npf.fx.Animation.Timing');

goog.require('goog.fx.Animation');
goog.require('npf.fx.CubicBezier');


/**
 * Constructor for an animation object.
 * @param {Array.<number>} start Array for start coordinates.
 * @param {Array.<number>} end Array for end coordinates.
 * @param {number} duration Length of animation in milliseconds.
 * @param {Array.<number>|npf.fx.Animation.Timing|function(number):number=}
 * 								    opt_acc Acceleration function, returns 0-1 for inputs 0-1.
 * @constructor
 * @extends {goog.fx.Animation}
 */
npf.fx.Animation = function(start, end, duration, opt_acc) {
  var accel = opt_acc;

  if (goog.isArray(opt_acc)) {
    if (4 == opt_acc.length) {
      accel = npf.fx.Animation.getAcceleration(opt_acc, duration);
    } else {
      accel = null;
    }
  }

  goog.base(this, start, end, duration,
    /** @type {Function|null|undefined} */ (accel));
};
goog.inherits(npf.fx.Animation, goog.fx.Animation);


/**
 * @enum {Array.<number>}
 */
npf.fx.Animation.Timing = {
  EASE: [0.25, 0.1, 0.25, 1.0],
  LINEAR: [0.0, 0.0, 1.0, 1.0],
  EASE_IN: [0.42, 0, 1.0, 1.0],
  EASE_OUT: [0, 0, 0.58, 1.0],
  EASE_IN_OUT: [0.42, 0, 0.58, 1.0]
};

/**
 * @type {boolean}
 */
npf.fx.Animation.enabled = true;

/**
 * @param {Array.<number>|npf.fx.Animation.Timing} accel
 * @param {number} duration
 * @return {function(number):number}
 */
npf.fx.Animation.getAcceleration = function(accel, duration) {
  return function(t) {
    return npf.fx.CubicBezier(t, accel[0], accel[1], accel[2], accel[3],
      duration);
  };
};

/**
 * @param {Array.<number>|npf.fx.Animation.Timing} accel
 * @return {string}
 */
npf.fx.Animation.getCssAcceleration = function(accel) {
  return ['cubic-bezier(', accel.join(', ') , ')'].join('');
};

/**
 * Handles the actual iteration of the animation in a timeout
 * @param {number} now The current time.
 */
npf.fx.Animation.prototype.cycle = function(now) {
  /** @type {?number} */
  var time =
    npf.fx.Animation.enabled || now == this.startTime ? now: this.endTime;
  goog.base(this, 'cycle', time || 0);
};
