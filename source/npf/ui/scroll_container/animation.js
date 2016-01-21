goog.provide('npf.ui.scrollContainer.Animation');

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
npf.ui.scrollContainer.Animation = function(fromX, fromY, toX, toY,
    opt_duration, opt_timing) {
  /** @type {number} */
  var duration = opt_duration || npf.ui.scrollContainer.Animation.DURATION;
  /** @type {npf.fx.Animation.Timing} */
  var timing = opt_timing || npf.fx.Animation.Timing.EASE_IN_OUT;

  npf.ui.scrollContainer.Animation.base(this, 'constructor',
    [fromX, fromY], [toX, toY], duration, timing);
};
goog.inherits(npf.ui.scrollContainer.Animation, npf.fx.Animation);


/**
 * @const {number}
 */
npf.ui.scrollContainer.Animation.DURATION = 300;
