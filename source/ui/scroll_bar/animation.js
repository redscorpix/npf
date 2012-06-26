goog.provide('npf.ui.scrollBar.Animation');

goog.require('npf.fx.Animation');


/**
 * @constructor
 * @extends {npf.fx.Animation}
 */
npf.ui.scrollBar.Animation = function() {
	goog.base(this, [0, 0], [1, 1], npf.ui.scrollBar.Animation.ANIMATION_DURATION, npf.fx.Animation.Timing.EASE_IN_OUT);
};
goog.inherits(npf.ui.scrollBar.Animation, npf.fx.Animation);


/**
 * @type {number}
 * @const
 */
npf.ui.scrollBar.Animation.ANIMATION_DURATION = 300;
