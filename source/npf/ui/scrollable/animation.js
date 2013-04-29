goog.provide('npf.ui.scrollable.Animation');

goog.require('npf.fx.Animation');


/**
 * @constructor
 * @extends {npf.fx.Animation}
 */
npf.ui.scrollable.Animation = function() {
  goog.base(this, [0, 0], [1, 1], npf.ui.scrollable.Animation.ANIMATION_DURATION,
    npf.fx.Animation.Timing.EASE_IN_OUT);
};
goog.inherits(npf.ui.scrollable.Animation, npf.fx.Animation);


/**
 * @type {number}
 * @const
 */
npf.ui.scrollable.Animation.ANIMATION_DURATION = 300;
