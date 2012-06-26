goog.provide('npf.fx.easing');

/**
 * jQuery Easing v1.3 — http://gsgd.co.uk/sandbox/jquery/easing/
 */

/**
 * @param {number} t
 * @return {number}
 */
npf.fx.easing.easeInQuad = function(t) {
	return t * t;
};

/**
 * @param {number} t
 * @return {number}
 */
npf.fx.easing.easeOutQuad = function(t) {
	return t * (2 - t);
};

/**
 * @param {number} t
 * @return {number}
 */
npf.fx.easing.easeInOutQuad = function(t) {
	var p = t * 2;

	if (p < 1) {
		return 1 / 2 * p * p;
	}

	return (1 - (--p) * (p - 2)) / 2;
};

/**
 * @param {number} t
 * @return {number}
 */
npf.fx.easing.easeInCubic = function(t) {
	return t * t * t;
};

/**
 * @param {number} t
 * @return {number}
 */
npf.fx.easing.easeOutCubic = function(t) {
	var p = t - 1;

	return p * p * p + 1;
};

/**
 * @param {number} t
 * @return {number}
 */
npf.fx.easing.easeInOutCubic = function (t) {
	var p = t * 2;

	if (p < 1) {
		return p * p * p / 2;
	}

	return ((p -= 2) * p * p + 2) / 2;
};

/**
 * @param {number} t
 * @return {number}
 */
npf.fx.easing.easeInQuart = function(t) {
	return t * t * t * t;
};

/**
 * @param {number} t
 * @return {number}
 */
npf.fx.easing.easeOutQuart = function(t, b, c, d) {
	var p = t - 1;

	return 1 - p * p * p * p;
};

/**
 * @param {number} t
 * @return {number}
 */
npf.fx.easing.easeInOutQuart = function(t, b, c, d) {
	var p = t * 2;

	if (p < 1) {
		return p * p * p * p / 2;
	}

	return (2 - (p -= 2) * p * p * p) / 2;
};

/**
 * @param {number} t
 * @return {number}
 */
npf.fx.easing.easeInQuint = function(t) {
	return t * t * t * t * t;
};

/**
 * @param {number} t
 * @return {number}
 */
npf.fx.easing.easeOutQuint = function(t) {
	var p = t - 1;

	return p * p * p * p * p + 1;
};

/**
 * @param {number} t
 * @return {number}
 */
npf.fx.easing.easeInOutQuint = function(t) {
	var p = t * 2;

	if (p < 1) {
		return p * p * p * p * p / 2;
	}

	return ((p-= 2) * p * p * p * p + 2) / 2;
};

/**
 * @param {number} t
 * @return {number}
 */
npf.fx.easing.easeInSine = function(t) {
	return -Math.cos(t * (Math.PI / 2)) + 1;
};

/**
 * @param {number} t
 * @return {number}
 */
npf.fx.easing.easeOutSine = function(t) {
	return Math.sin(t * (Math.PI / 2));
};

/**
 * @param {number} t
 * @return {number}
 */
npf.fx.easing.easeInOutSine = function(t) {
	return (1 - Math.cos(Math.PI * t)) / 2;
};

/**
 * @param {number} t
 * @return {number}
 */
npf.fx.easing.easeInExpo = function(t) {
	return (0 == t) ? 0 : Math.pow(2, 10 * (t - 1));
};

/**
 * @param {number} t
 * @return {number}
 */
npf.fx.easing.easeOutExpo = function(t) {
	return (1 == t) ? 1 : 1 - Math.pow(2, -10 * t);
};

/**
 * @param {number} t
 * @return {number}
 */
npf.fx.easing.easeInOutExpo = function(t) {
	if (0 == t || 1 == t) {
		return t;
	}

	var p = t * 2;

	if (p < 1) {
		return Math.pow(2, 10 * (p - 1)) / 2;
	}

	return (2 - Math.pow(2, -10 * --p)) / 2;
};

/**
 * @param {number} t
 * @return {number}
 */
npf.fx.easing.easeInCirc = function(t) {
	return 1 - Math.sqrt(1 - t * t);
};

/**
 * @param {number} t
 * @return {number}
 */
npf.fx.easing.easeOutCirc = function(t) {
	var p = t - 1;

	return Math.sqrt(1 - p * p);
};

/**
 * @param {number} t
 * @return {number}
 */
npf.fx.easing.easeInOutCirc = function(t) {
	var p = t * 2;

	if (p < 1) {
		return (1 - Math.sqrt(1 - p * p)) / 2;
	}

	return (Math.sqrt(1 - (p -= 2) * p) + 1) / 2;
};

/**
 * @param {number} t
 * @param {number=} opt_duration
 * @return {number}
 */
npf.fx.easing.easeInElastic = function(t, opt_duration) {
	if (0 == t || 1 == t) {
		return t;
	}

	var duration = opt_duration || 300;
	var p = duration * 0.3;
	var s = p / (2 * Math.PI) * Math.asin(1);

	return -Math.pow(2, 10 * (t -= 1)) * Math.sin((t * duration - s) * (2 * Math.PI) / p);
};

/**
 * @param {number} t
 * @param {number=} opt_duration
 * @return {number}
 */
npf.fx.easing.easeOutElastic = function(t, opt_duration) {
	if (0 == t || 1 == t) {
		return t;
	}

	var duration = opt_duration || 300;
	var p = duration * 0.3;
	var s = p / (2 * Math.PI) * Math.asin(1);

	return Math.pow(2, -10 * t) * Math.sin((t * duration - s) * (2 * Math.PI) / p) + 1;
};

/**
 * @param {number} t
 * @param {number=} opt_duration
 * @return {number}
 */
npf.fx.easing.easeInOutElastic = function(t, opt_duration) {
	if (0 == t || 1 == t) {
		return t;
	}

	var duration = opt_duration || 300;
	var r = t * 2;
	var p = duration * (0.3 * 1.5);
	var s = p / (2 * Math.PI) * Math.asin(1);

	if (r < 1) {
		return -.5 * (Math.pow(2, 10 * (r -= 1)) * Math.sin((r * duration - s) * (2 * Math.PI) / p));
	}

	return Math.pow(2, -10 * (r -= 1)) * Math.sin((r * duration - s) * (2 * Math.PI) / p) * 0.5 + 1;
};

/**
 * @param {number} t
 * @param {number=} opt_s
 * @return {number}
 */
npf.fx.easing.easeInBack = function(t, opt_s) {
	var s = goog.isNumber(opt_s) ? opt_s : 1.70158;

	return t * t * ((s + 1) * t - s);
};

/**
 * @param {number} t
 * @param {number=} opt_s
 * @return {number}
 */
npf.fx.easing.easeOutBack = function(t, opt_s) {
	var s = goog.isNumber(opt_s) ? opt_s : 1.70158;
	var p = t - 1;

	return p * p * ((s + 1) * p + s) + 1;
};

/**
 * @param {number} t
 * @param {number=} opt_s
 * @return {number}
 */
npf.fx.easing.easeInOutBack = function(t, opt_s) {
	var s = goog.isNumber(opt_s) ? opt_s : 1.70158;
	var p = t * 2;

	if (p < 1) {
		return (p * p * (((s *= 1.525) + 1) * p - s)) / 2;
	}

	return ((p -= 2) * p * (((s *= 1.525) + 1) * p + s) + 2) / 2;
};

/**
 * @param {number} t
 * @return {number}
 */
npf.fx.easing.easeInBounce = function(t) {
	return 1 - npf.fx.easing.easeOutBounce(1 - t);
};

/**
 * @param {number} t
 * @return {number}
 */
npf.fx.easing.easeOutBounce = function(t) {
	if (t < 1 / 2.75) {
		return 7.5625 * t * t;
	} else if (t < 2 / 2.75) {
		return 7.5625 * (t -= 1.5 / 2.75) * t + 0.75;
	} else if (t < 2.5/2.75) {
		return 7.5625 * (t -= 2.25 / 2.75) * t + .9375;
	} else {
		return 7.5625 * (t -= 2.625 / 2.75) * t + .984375;
	}
};

/**
 * @param {number} t
 * @return {number}
 */
npf.fx.easing.easeInOutBounce = function(t) {
	if (t < 1 / 2) {
		return npf.fx.easing.easeInBounce(t * 2) / 2;
	}

	return npf.fx.easing.easeOutBounce(1 - t * 2);
};
