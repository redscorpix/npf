goog.provide('npfTransition.JsAnimation');

goog.require('goog.object');
goog.require('npf.fx.Animation');
goog.require('npf.fx.DomAnimation');
goog.require('npf.fx.easing');


/**
 * @param {Element} element
 * @param {number} time
 * @param {Array.<number>|string|function(number):number|null=} opt_acc
 * @constructor
 * @extends {npf.fx.DomAnimation}
 */
npfTransition.JsAnimation = function(element, time, opt_acc) {
	goog.base(this, element, time, this._getEasing(opt_acc));

	this._helper = new npf.fx.Animation([0], [1], 0);
	this._helper.addEventListener(goog.fx.Animation.EventType.ANIMATE, function(evt) {
		this._runHandler(this.onProgressHandler);
	}, false, this);
	this._helper.addEventListener(goog.fx.Transition.EventType.PLAY, function(evt) {
		this._runHandler(this.onPlayHandler);
	}, false, this);
	this._helper.addEventListener(goog.fx.Transition.EventType.BEGIN, function(evt) {
		this._runHandler(this.onBeginHandler);
	}, false, this);
	this._helper.addEventListener(goog.fx.Transition.EventType.RESUME, function(evt) {
		this._runHandler(this.onResumeHandler);
	}, false, this);
	this._helper.addEventListener(goog.fx.Transition.EventType.END, function(evt) {
		this._runHandler(this.onEndHandler);
	}, false, this);
	this._helper.addEventListener(goog.fx.Transition.EventType.STOP, function(evt) {
		this._runHandler(this.onStopHandler);
	}, false, this);
	this._helper.addEventListener(goog.fx.Transition.EventType.FINISH, function(evt) {
		this._runHandler(this.onFinishHandler);
	}, false, this);
	this._helper.addEventListener(goog.fx.Transition.EventType.PAUSE, function(evt) {
		this._runHandler(this.onPauseHandler);
	}, false, this);
	this.add(this._helper);
};
goog.inherits(npfTransition.JsAnimation, npf.fx.DomAnimation);


/**
 * @enum {Function}
 */
npfTransition.JsAnimation.Easing = {
	'easeInQuad': npf.fx.easing.easeInQuad,
	'easeOutQuad': npf.fx.easing.easeOutQuad,
	'easeInOutQuad': npf.fx.easing.easeInOutQuad,
	'easeInCubic': npf.fx.easing.easeInCubic,
	'easeOutCubic': npf.fx.easing.easeOutCubic,
	'easeInOutCubic': npf.fx.easing.easeInOutCubic,
	'easeInQuart': npf.fx.easing.easeInQuart,
	'easeOutQuart': npf.fx.easing.easeOutQuart,
	'easeInOutQuart': npf.fx.easing.easeInOutQuart,
	'easeInQuint': npf.fx.easing.easeInQuint,
	'easeOutQuint': npf.fx.easing.easeOutQuint,
	'easeInOutQuint': npf.fx.easing.easeInOutQuint,
	'easeInSine': npf.fx.easing.easeInSine,
	'easeOutSine': npf.fx.easing.easeOutSine,
	'easeInOutSine': npf.fx.easing.easeInOutSine,
	'easeInExpo': npf.fx.easing.easeInExpo,
	'easeOutExpo': npf.fx.easing.easeOutExpo,
	'easeInOutExpo': npf.fx.easing.easeInOutExpo,
	'easeInCirc': npf.fx.easing.easeInCirc,
	'easeOutCirc': npf.fx.easing.easeOutCirc,
	'easeInOutCirc': npf.fx.easing.easeInOutCirc,
	'easeInElastic': npf.fx.easing.easeInElastic,
	'easeOutElastic': npf.fx.easing.easeOutElastic,
	'easeInOutElastic': npf.fx.easing.easeInOutElastic,
	'easeInBack': npf.fx.easing.easeInBack,
	'easeOutBack': npf.fx.easing.easeOutBack,
	'easeInOutBack': npf.fx.easing.easeInOutBack,
	'easeInBounce': npf.fx.easing.easeInBounce,
	'easeOutBounce': npf.fx.easing.easeOutBounce,
	'easeInOutBounce': npf.fx.easing.easeInOutBounce
};

/**
 * @type {?function(number, number, Element)}
 */
npfTransition.JsAnimation.prototype.onBeginHandler = null;

/**
 * @type {?function(number, number, Element)}
 */
npfTransition.JsAnimation.prototype.onEndHandler = null;

/**
 * @type {?function(number, number, Element)}
 */
npfTransition.JsAnimation.prototype.onFinishHandler = null;

/**
 * @type {?function(number, number, Element)}
 */
npfTransition.JsAnimation.prototype.onPauseHandler = null;

/**
 * @type {?function(number, number, Element)}
 */
npfTransition.JsAnimation.prototype.onPlayHandler = null;

/**
 * @type {?function(number, number, Element)}
 */
npfTransition.JsAnimation.prototype.onResumeHandler = null;

/**
 * @type {?function(number, number, Element)}
 */
npfTransition.JsAnimation.prototype.onStopHandler = null;

/**
 * @type {?function(number, number, Element)}
 */
npfTransition.JsAnimation.prototype.onProgressHandler = null;

/**
 * @type {!npf.fx.Animation}
 * @private
 */
npfTransition.JsAnimation.prototype._helper;

/**
 * @type {number}
 * @private
 */
npfTransition.JsAnimation.prototype._maxDuration = 0;

/**
 * @type {number}
 * @private
 */
npfTransition.JsAnimation.prototype._progress = 0;


/** @inheritDoc */
npfTransition.JsAnimation.prototype.disposeInternal = function() {
	goog.base(this, 'disposeInternal');

	delete this.onBeginHandler;
	delete this.onEndHandler;
	delete this.onFinishHandler;
	delete this.onPauseHandler;
	delete this.onPlayHandler;
	delete this.onResumeHandler;
	delete this.onStopHandler;
	delete this.onProgressHandler;
	delete this._helper;
	delete this._helper.duration;
	delete this._progress;
};

/**
 * @param {boolean=} opt_restart
 * @return {!npfTransition.JsAnimation}
 */
npfTransition.JsAnimation.prototype.play = function(opt_restart) {
	goog.base(this, 'play', opt_restart);

	return this;
};

/**
 * @return {!npfTransition.JsAnimation}
 */
npfTransition.JsAnimation.prototype.pause = function() {
	goog.base(this, 'pause');

	return this;
};

/**
 * @param {boolean=} opt_gotoEnd
 * @return {!npfTransition.JsAnimation}
 */
npfTransition.JsAnimation.prototype.stop = function(opt_gotoEnd) {
	goog.base(this, 'stop', opt_gotoEnd);

	return this;
};

/**
 * @param {Array.<number>} start 3D Array for RGB of start color.
 * @param {Array.<number>} end 3D Array for RGB of end color.
 * @param {number=} opt_time Length of animation in milliseconds.
 * @param {Array.<number>|string|function(number):number|null=} opt_acc
 * @return {!npfTransition.JsAnimation}
 */
npfTransition.JsAnimation.prototype.addBgColorTransform = function(start, end, opt_time, opt_acc) {
	goog.base(this, 'addBgColorTransform', start, end, opt_time, this._getEasing(opt_acc));

	this._helper.duration = Math.max(this._helper.duration, opt_time || 0, this.time);

	return this;
};

/**
 * @param {Array.<number>} start 3D Array representing R,G,B.
 * @param {Array.<number>} end 3D Array representing R,G,B.
 * @param {number=} opt_time Length of animation in milliseconds.
 * @param {Array.<number>|string|function(number):number|null=} opt_acc
 * @return {!npfTransition.JsAnimation}
 */
npfTransition.JsAnimation.prototype.addColorTransform = function(start, end, opt_time, opt_acc) {
	goog.base(this, 'addColorTransform', start, end, opt_time, this._getEasing(opt_acc));

	this._helper.duration = Math.max(this._helper.duration, opt_time || 0, this.time);

	return this;
};

/**
 * @param {Array.<number>|number} start 1D Array or Number with start opacity.
 * @param {Array.<number>|number} end 1D Array or Number for end opacity.
 * @param {number=} opt_time Length of animation in milliseconds.
 * @param {Array.<number>|string|function(number):number|null=} opt_acc
 * @return {!npfTransition.JsAnimation}
 */
npfTransition.JsAnimation.prototype.addFade = function(start, end, opt_time, opt_acc) {
	goog.base(this, 'addFade', start, end, opt_time, this._getEasing(opt_acc));

	this._helper.duration = Math.max(this._helper.duration, opt_time || 0, this.time);

	return this;
};

/**
 * @param {number=} opt_time Length of animation in milliseconds.
 * @param {Array.<number>|string|function(number):number|null=} opt_acc
 * @return {!npfTransition.JsAnimation}
 */
npfTransition.JsAnimation.prototype.addFadeIn = function(opt_time, opt_acc) {
	goog.base(this, 'addFadeIn', opt_time, this._getEasing(opt_acc));

	this._helper.duration = Math.max(this._helper.duration, opt_time || 0, this.time);

	return this;
};

/**
 * @param {number=} opt_time Length of animation in milliseconds.
 * @param {Array.<number>|string|function(number):number|null=} opt_acc
 * @return {!npfTransition.JsAnimation}
 */
npfTransition.JsAnimation.prototype.addFadeInAndShow = function(opt_time, opt_acc) {
	goog.base(this, 'addFadeInAndShow', opt_time, this._getEasing(opt_acc));

	this._helper.duration = Math.max(this._helper.duration, opt_time || 0, this.time);

	return this;
};

/**
 * @param {number=} opt_time Length of animation in milliseconds.
 * @param {Array.<number>|string|function(number):number|null=} opt_acc
 * @return {!npfTransition.JsAnimation}
 */
npfTransition.JsAnimation.prototype.addFadeOut = function(opt_time, opt_acc) {
	goog.base(this, 'addFadeOut', opt_time, this._getEasing(opt_acc));

	this._helper.duration = Math.max(this._helper.duration, opt_time || 0, this.time);

	return this;
};

/**
 * @param {number=} opt_time Length of animation in milliseconds.
 * @param {Array.<number>|string|function(number):number|null=} opt_acc
 * @return {!npfTransition.JsAnimation}
 */
npfTransition.JsAnimation.prototype.addFadeOutAndHide = function(opt_time, opt_acc) {
	goog.base(this, 'addFadeOutAndHide', opt_time, this._getEasing(opt_acc));

	this._helper.duration = Math.max(this._helper.duration, opt_time || 0, this.time);

	return this;
};

/**
 * @param {Array.<number>} start 2D array for start width and height.
 * @param {Array.<number>} end 2D array for end width and height.
 * @param {number=} opt_time Length of animation in milliseconds.
 * @param {Array.<number>|string|function(number):number|null=} opt_acc
 * @return {!npfTransition.JsAnimation}
 */
npfTransition.JsAnimation.prototype.addResize = function(start, end, opt_time, opt_acc) {
	goog.base(this, 'addResize', start, end, opt_time, this._getEasing(opt_acc));

	return this;
};

/**
 * @param {number} start Start width.
 * @param {number} end End width.
 * @param {number=} opt_time Length of animation in milliseconds.
 * @param {Array.<number>|string|function(number):number|null=} opt_acc
 * @return {!npfTransition.JsAnimation}
 */
npfTransition.JsAnimation.prototype.addResizeWidth = function(start, end, opt_time, opt_acc) {
	goog.base(this, 'addResizeWidth', start, end, opt_time, this._getEasing(opt_acc));

	this._helper.duration = Math.max(this._helper.duration, opt_time || 0, this.time);

	return this;
};

/**
 * @param {number} start Start height.
 * @param {number} end End height.
 * @param {number=} opt_time Length of animation in milliseconds.
 * @param {Array.<number>|string|function(number):number|null=} opt_acc
 * @return {!npfTransition.JsAnimation}
 */
npfTransition.JsAnimation.prototype.addResizeHeight = function(start, end, opt_time, opt_acc) {
	goog.base(this, 'addResizeHeight', start, end, opt_time, this._getEasing(opt_acc));

	this._helper.duration = Math.max(this._helper.duration, opt_time || 0, this.time);

	return this;
};

/**
 * @param {Array.<number>} start 2D array for start scroll left and top.
 * @param {Array.<number>} end 2D array for end scroll left and top.
 * @param {number=} opt_time Length of animation in milliseconds.
 * @param {Array.<number>|string|function(number):number|null=} opt_acc
 * @return {!npfTransition.JsAnimation}
 */
npfTransition.JsAnimation.prototype.addScroll = function(start, end, opt_time, opt_acc) {
	goog.base(this, 'addScroll', start, end, opt_time, this._getEasing(opt_acc));

	this._helper.duration = Math.max(this._helper.duration, opt_time || 0, this.time);

	return this;
};

/**
 * @param {Array.<number>} start 2D array for start coordinates (X, Y).
 * @param {Array.<number>} end 2D array for end coordinates (X, Y).
 * @param {number=} opt_time Length of animation in milliseconds.
 * @param {Array.<number>|string|function(number):number|null=} opt_acc
 * @return {!npfTransition.JsAnimation}
 */
npfTransition.JsAnimation.prototype.addSlide = function(start, end, opt_time, opt_acc) {
	goog.base(this, 'addSlide', start, end, opt_time, this._getEasing(opt_acc));

	this._helper.duration = Math.max(this._helper.duration, opt_time || 0, this.time);

	return this;
};

/**
 * @param {number} start Start X coordinate.
 * @param {number} end End X coordinate.
 * @param {number=} opt_time Length of animation in milliseconds.
 * @param {Array.<number>|string|function(number):number|null=} opt_acc
 * @return {!npfTransition.JsAnimation}
 */
npfTransition.JsAnimation.prototype.addSlideLeft = function(start, end, opt_time, opt_acc) {
	goog.base(this, 'addSlideLeft', start, end, opt_time, this._getEasing(opt_acc));

	this._helper.duration = Math.max(this._helper.duration, opt_time || 0, this.time);

	return this;
};

/**
 * @param {number} start Start X coordinate.
 * @param {number} end End X coordinate.
 * @param {number=} opt_time Length of animation in milliseconds.
 * @param {Array.<number>|string|function(number):number|null=} opt_acc
 * @return {!npfTransition.JsAnimation}
 */
npfTransition.JsAnimation.prototype.addSlideRight = function(start, end, opt_time, opt_acc) {
	goog.base(this, 'addSlideRight', start, end, opt_time, this._getEasing(opt_acc));

	this._helper.duration = Math.max(this._helper.duration, opt_time || 0, this.time);

	return this;
};

/**
 * @param {number} start Start Y coordinate.
 * @param {number} end End Y coordinate.
 * @param {number=} opt_time Length of animation in milliseconds.
 * @param {Array.<number>|string|function(number):number|null=} opt_acc
 * @return {!npfTransition.JsAnimation}
 */
npfTransition.JsAnimation.prototype.addSlideTop = function(start, end, opt_time, opt_acc) {
	goog.base(this, 'addSlideTop', start, end, opt_time, this._getEasing(opt_acc));

	this._helper.duration = Math.max(this._helper.duration, opt_time || 0, this.time);

	return this;
};

/**
 * @param {Array.<number>} end 2D array for end coordinates (X, Y).
 * @param {number=} opt_time Length of animation in milliseconds.
 * @param {Array.<number>|string|function(number):number|null=} opt_acc
 * @return {!npfTransition.JsAnimation}
 */
npfTransition.JsAnimation.prototype.addSlideFrom = function(end, opt_time, opt_acc) {
	goog.base(this, 'addSlideFrom', end, opt_time, this._getEasing(opt_acc));

	this._helper.duration = Math.max(this._helper.duration, opt_time || 0, this.time);

	return this;
};

/**
 * @param {number} end End X coordinate.
 * @param {number=} opt_time Length of animation in milliseconds.
 * @param {Array.<number>|string|function(number):number|null=} opt_acc
 * @return {!npfTransition.JsAnimation}
 */
npfTransition.JsAnimation.prototype.addSlideLeftFrom = function(end, opt_time, opt_acc) {
	goog.base(this, 'addSlideLeftFrom', end, opt_time, this._getEasing(opt_acc));

	this._helper.duration = Math.max(this._helper.duration, opt_time || 0, this.time);

	return this;
};

/**
 * @param {number} end End Y coordinate.
 * @param {number=} opt_time Length of animation in milliseconds.
 * @param {Array.<number>|string|function(number):number|null=} opt_acc
 * @return {!npfTransition.JsAnimation}
 */
npfTransition.JsAnimation.prototype.addSlideTopFrom = function(end, opt_time, opt_acc) {
	goog.base(this, 'addSlideTopFrom', end, opt_time, this._getEasing(opt_acc));

	this._helper.duration = Math.max(this._helper.duration, opt_time || 0, this.time);

	return this;
};

/**
 * @param {Array.<number>} start 2D array for start size (W, H).
 * @param {Array.<number>} end 2D array for end size (W, H).
 * @param {number=} opt_time Length of animation in milliseconds.
 * @param {Array.<number>|string|function(number):number|null=} opt_acc
 * @return {!npfTransition.JsAnimation}
 */
npfTransition.JsAnimation.prototype.addSwipe = function(start, end, opt_time, opt_acc) {
	goog.base(this, 'addSwipe', start, end, opt_time, this._getEasing(opt_acc));

	this._helper.duration = Math.max(this._helper.duration, opt_time || 0, this.time);

	return this;
};

/**
 * @param {Object} start
 * @param {Object} end
 * @param {number=} opt_time Length of animation in milliseconds.
 * @param {Array.<number>|string|function(number):number|null=} opt_acc
 * @return {!npfTransition.JsAnimation}
 */
npfTransition.JsAnimation.prototype.addTransform = function(start, end, opt_time, opt_acc) {
	/** @type {!npf.fx.dom.Transform} */
	var animation = goog.base(this, 'addTransform', opt_time, this._getEasing(opt_acc));
	var funcsMap = {
		'matrix': animation.setMatrix,
		'matrix3d': animation.setMatrix3d,
		'translate': animation.setTranslate,
		'translate3d': animation.setTranslate3d,
		'translateX': animation.setTranslateX,
		'translateY': animation.setTranslateY,
		'translateZ': animation.setTranslateZ,
		'scale': animation.setScale,
		'scale3d': animation.setScale3d,
		'scaleX': animation.setScaleX,
		'scaleY': animation.setScaleY,
		'scaleZ': animation.setScaleZ,
		'rotate': animation.setRotate,
		'rotate3d': animation.setRotate3d,
		'rotateX': animation.setRotateX,
		'rotateY': animation.setRotateY,
		'rotateZ': animation.setRotateZ,
		'skew': animation.setSkew,
		'skewX': animation.setSkewX,
		'skewY': animation.setSkewY
	};

	goog.object.forEach(funcsMap, function(func, key) {
		func(start[key], end[key]);
	}, this);

	this._helper.duration = Math.max(this._helper.duration, opt_time || 0, this.time);

	return this;
};

/**
 * @param {function(number)} update
 * @param {number=} opt_time Length of animation in milliseconds.
 * @param {Array.<number>|string|function(number):number|null=} opt_acc
 * @return {!npfTransition.JsAnimation}
 */
npfTransition.JsAnimation.prototype.addCustom = function(update, opt_time, opt_acc) {
	/** @type {!npf.fx.Animation} */
	var animation = goog.base(this, 'addCustom', opt_time, this._getEasing(opt_acc));
	/** @type {function(goog.fx.AnimationEvent)} */
	var func = function(evt) {
		update(evt.x);
	};
	animation.addEventListener(goog.fx.Animation.EventType.ANIMATE, func);
	animation.addEventListener(goog.fx.Transition.EventType.FINISH, func);

	this._helper.duration = Math.max(this._helper.duration, opt_time || 0, this.time);

	return this;
};

/**
 * @param {Array.<number>|string|function(number):number|null=} opt_easing
 * @return {function(number):number|Array.<number>|null}
 * @private
 */
npfTransition.JsAnimation.prototype._getEasing = function(opt_easing) {
	if (goog.isString(opt_easing)) {
		return /** @type {function(number):number|null} */ (npfTransition.JsAnimation.Easing[opt_easing] || null);
	} else if (goog.isFunction(opt_easing)) {
		return /** @type {function(number):number} */ (opt_easing);
	} else if (goog.isArray(opt_easing)) {
		return /** @type {Array.<number>} */ (opt_easing);
	}

	return null;
};

/**
 * @param {function(number,number,Element)?} handler
 * @private
 */
npfTransition.JsAnimation.prototype._runHandler = function(handler) {
	if (goog.isFunction(handler)) {
		handler(this._helper.coords[0], this._helper.duration, this.element);
	}
};
