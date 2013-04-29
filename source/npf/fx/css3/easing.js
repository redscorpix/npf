goog.provide('npf.fx.css3.easing');


/**
 * Jared Hardy’s Ceaser
 * http://matthewlein.com/ceaser/
 * https://github.com/jhardy/compass-ceaser-easing/blob/master/stylesheets/ceaser-easing/_ease-types.sass
 */

/**
 * @enum {Array.<number>}
 */
npf.fx.css3.easing = {
  LINEAR: [0.250, 0.250, 0.750, 0.750],
  EASE: [0.250, 0.100, 0.250, 1.000],
  EASE_IN: [0.420, 0.000, 1.000, 1.000],
  EASE_OUT: [0.000, 0.000, 0.580, 1.000],
  EASE_IN_OUT: [0.420, 0.000, 0.580, 1.000],
  EASE_IN_QUAD: [0.550, 0.085, 0.680, 0.530],
  EASE_IN_CUBIC: [0.550, 0.055, 0.675, 0.190],
  EASE_IN_QUART: [0.895, 0.030, 0.685, 0.220],
  EASE_IN_QUINT: [0.755, 0.050, 0.855, 0.060],
  EASE_IN_SINE: [0.470, 0.000, 0.745, 0.715],
  EASE_IN_EXPO: [0.950, 0.050, 0.795, 0.035],
  EASE_IN_CIRC: [0.600, 0.040, 0.980, 0.335],
  EASE_IN_BACK: [0.600, -0.280, 0.735, 0.045],
  EASE_OUT_QUAD: [0.250, 0.460, 0.450, 0.940],
  EASE_OUT_CUBIC: [0.215, 0.610, 0.355, 1.000],
  EASE_OUT_QUART: [0.165, 0.840, 0.440, 1.000],
  EASE_OUT_QUINT: [0.230, 1.000, 0.320, 1.000],
  EASE_OUT_SINE: [0.390, 0.575, 0.565, 1.000],
  EASE_OUT_EXPO: [0.190, 1.000, 0.220, 1.000],
  EASE_OUT_CIRC: [0.075, 0.820, 0.165, 1.000],
  EASE_OUT_BACK: [0.175, 0.885, 0.320, 1.275],
  EASE_IN_OUT_QUAD: [0.455, 0.030, 0.515, 0.955],
  EASE_IN_OUT_CUBIC: [0.645, 0.045, 0.355, 1.000],
  EASE_IN_OUT_QUART: [0.770, 0.000, 0.175, 1.000],
  EASE_IN_OUT_QUINT: [0.860, 0.000, 0.070, 1.000],
  EASE_IN_OUT_SINE: [0.445, 0.050, 0.550, 0.950],
  EASE_IN_OUT_EXPO: [1.000, 0.000, 0.000, 1.000],
  EASE_IN_OUT_CIRC: [0.785, 0.135, 0.150, 0.860],
  EASE_IN_OUT_BACK: [0.680, -0.550, 0.265, 1.550]
};
