goog.provide('npf.ui.scrollable.Animation');

goog.require('npf.fx.Animation');
goog.require('npf.fx.Animation.Timing');


/**
 * @param {number} fromX
 * @param {number} fromY
 * @param {number} toX
 * @param {number} toY
 * @param {number=} opt_duration
 * @param {npf.fx.Animation.Timing=} opt_timing
 * @constructor
 * @extends {npf.fx.Animation}
 */
npf.ui.scrollable.Animation = function(fromX, fromY, toX, toY, opt_duration,
    opt_timing) {
  /** @type {number} */
  var duration = opt_duration || npf.ui.scrollable.Animation.ANIMATION_DURATION;
  /** @type {npf.fx.Animation.Timing} */
  var timing = opt_timing || npf.fx.Animation.Timing.EASE_IN_OUT;

  npf.ui.scrollable.Animation.base(
    this,
    'constructor',
    [fromX, fromY],
    [toX, toY],
    duration,
    timing);
};
goog.inherits(npf.ui.scrollable.Animation, npf.fx.Animation);


/**
 * @const {number}
 */
npf.ui.scrollable.Animation.ANIMATION_DURATION = 300;
