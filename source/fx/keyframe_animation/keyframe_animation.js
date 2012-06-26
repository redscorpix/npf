goog.provide('npf.fx.KeyframeAnimation');
goog.provide('npf.fx.KeyframeAnimation.PreferredTimingFunction');

goog.require('goog.array');
goog.require('goog.dom');
goog.require('goog.dom.TagName');
goog.require('goog.events.EventHandler');
goog.require('goog.fx.Transition');
goog.require('goog.fx.TransitionBase');
goog.require('goog.math.Coordinate');
goog.require('goog.math.Rect');
goog.require('goog.math.Size');
goog.require('goog.object');
goog.require('goog.style');
goog.require('npf.fx.Animation');
goog.require('npf.fx.keyframeAnimation.Event');
goog.require('npf.fx.keyframeAnimation.EventType');
goog.require('npf.userAgent.Support');
goog.require('npf.userAgent.support');


/**
 * @param {Element} element
 * @param {number} duration in ms
 * @param {Array.<number>=} opt_acc defaults to npf.fx.KeyframeAnimation.PreferredTimingFunction.LINEAR
 * @constructor
 * @implements {goog.fx.Transition}
 * @extends {goog.fx.TransitionBase}
 */
npf.fx.KeyframeAnimation = function(element, duration, opt_acc) {
	goog.base(this);

	this.element = element;
	this.duration = duration;
	this._accel = opt_acc || npf.fx.KeyframeAnimation.PreferredTimingFunction.LINEAR;

	this._name = npf.fx.KeyframeAnimation.getNextKeyframeName();
	this._keyframesMap = {};

	this._handler = new goog.events.EventHandler();
	this.registerDisposable(this._handler);
};
goog.inherits(npf.fx.KeyframeAnimation, goog.fx.TransitionBase);


/**
 * @enum {string}
 */
npf.fx.KeyframeAnimation.Direction = {
	NORMAL: 'normal',
	ALTERNATE: 'alternate'
};

/**
 * @enum {string}
 */
npf.fx.KeyframeAnimation.PlayState = {
	RUNNING: 'running',
	PAUSED: 'paused'
};

/**
 * @enum {string}
 */
npf.fx.KeyframeAnimation.CssProperty = {
	ANIMATION: npf.userAgent.support.getCssPropertyName('animation'),
	ANIMATION_DELAY: npf.userAgent.support.getCssPropertyName('animation-delay'),
	ANIMATION_DIRECTION: npf.userAgent.support.getCssPropertyName('animation-direction'),
	ANIMATION_DURATION: npf.userAgent.support.getCssPropertyName('animation-duration'),
	ANIMATION_ITERATION_COUNT: npf.userAgent.support.getCssPropertyName('animation-iteration-count'),
	ANIMATION_NAME: npf.userAgent.support.getCssPropertyName('animation-name'),
	ANIMATION_PLAY_STATE: npf.userAgent.support.getCssPropertyName('animation-play-state'),
	ANIMATION_TIMING_FUNCTION: npf.userAgent.support.getCssPropertyName('animation-timing-function')
};

/**
 * @type {string}
 * @const
 */
npf.fx.KeyframeAnimation.KEYFRAME_NAME_PREFIX = 'kf_';

/**
 * @enum {Array.<number>}
 */
npf.fx.KeyframeAnimation.PreferredTimingFunction = {
	EASE: [0.25, 0.1, 0.25, 1],
	LINEAR: [0, 0, 1, 1],
	EASE_IN: [0.42, 0, 1, 1],
	EASE_OUT: [0, 0, 0.58, 1],
	EASE_IN_OUT: [0.42, 0, 0.58, 1]
};

/**
 * @return {boolean}
 */
npf.fx.KeyframeAnimation.isSupported = function() {
	return npf.userAgent.support.isCssAnimationSupported() && npf.fx.Animation.enabled;
};

/**
 * @return {string}
 */
npf.fx.KeyframeAnimation.getNextKeyframeName = function() {
	/** @type {number} */
	var counter = 0;

	return function() {
		return npf.fx.KeyframeAnimation.KEYFRAME_NAME_PREFIX + (++counter);
	};
}();


/**
 * @type {Element}
 * @protected
 */
npf.fx.KeyframeAnimation.prototype.element;

/**
 * @type {number}
 * @protected
 */
npf.fx.KeyframeAnimation.prototype.duration;

/**
 * @type {!Object.<string,!Object>}
 * @private
 */
npf.fx.KeyframeAnimation.prototype._keyframesMap;

/**
 * @type {Array.<number>}
 * @private
 */
npf.fx.KeyframeAnimation.prototype._accel;

/**
 * @type {number}
 * @private
 */
npf.fx.KeyframeAnimation.prototype._delay = 0;

/**
 * 0 — infinite.
 * @type {number}
 * @private
 */
npf.fx.KeyframeAnimation.prototype._iterationCount = 1;

/**
 * @type {npf.fx.KeyframeAnimation.Direction}
 * @private
 */
npf.fx.KeyframeAnimation.prototype._direction = npf.fx.KeyframeAnimation.Direction.NORMAL;

/**
 * @type {string}
 * @private
 */
npf.fx.KeyframeAnimation.prototype._name;

/**
 * @type {goog.events.EventHandler}
 * @private
 */
npf.fx.KeyframeAnimation.prototype._handler;

/**
 * @type {Element}
 * @private
 */
npf.fx.KeyframeAnimation.prototype._styleElement;

/**
 * @type {boolean}
 * @private
 */
npf.fx.KeyframeAnimation.prototype._domSet = false;

/**
 * @type {boolean}
 * @private
 */
npf.fx.KeyframeAnimation.prototype._isCleared = true;

/**
 * @type {Object.<string,string>}
 * @private
 */
npf.fx.KeyframeAnimation.prototype._endStyles = null;

/**
 * @type {npf.fx.KeyframeAnimation.PlayState}
 */
npf.fx.KeyframeAnimation.prototype._playState = npf.fx.KeyframeAnimation.PlayState.PAUSED;


/** @inheritDoc */
npf.fx.KeyframeAnimation.prototype.disposeInternal = function() {
	if (!this.isStopped()) {
		this.stop(false);
	}

	goog.base(this, 'disposeInternal');

	delete this.element;
	delete this.duration;
	delete this._keyframesMap;
	delete this._accel;
	delete this._delay;
	delete this._iterationCount;
	delete this._direction;
	delete this._name;
	delete this._handler;
	delete this._styleElement;
	delete this._domSet;
	delete this._isCleared;
	delete this._endStyles;
	delete this._playState;
};

/**
 * @return {npf.fx.KeyframeAnimation.PlayState}
 */
npf.fx.KeyframeAnimation.prototype.getState = function() {
	return this._playState;
};

/**
 * @return {number} 0 — infinite
 */
npf.fx.KeyframeAnimation.prototype.getIterationCount = function() {
	return this._iterationCount;
};

/**
 * @param {number} count 0 — infinite
 */
npf.fx.KeyframeAnimation.prototype.setIterationCount = function(count) {
	this._iterationCount = count;

	if (this._domSet) {
		this._setAnimationIterationCount(this._iterationCount);
	}
};

/**
 * @return {number} in ms
 */
npf.fx.KeyframeAnimation.prototype.getDuration = function() {
	return this.duration;
};

/**
 * @return {number} in ms
 */
npf.fx.KeyframeAnimation.prototype.getDelay = function() {
	return this._delay;
};

/**
 * @param {number} delay in ms
 */
npf.fx.KeyframeAnimation.prototype.setDelay = function(delay) {
	this._delay = delay;

	if (this._domSet) {
		this._setAnimationDelay(this._delay);
	}
};

/**
 * @return {npf.fx.KeyframeAnimation.Direction}
 */
npf.fx.KeyframeAnimation.prototype.getDirection = function() {
	return this._direction;
};

/**
 * @param {npf.fx.KeyframeAnimation.Direction} direction
 */
npf.fx.KeyframeAnimation.prototype.setDirection = function(direction) {
	this._direction = direction;

	if (this._domSet) {
		this._setAnimationDirection(this._direction);
	}
};

/**
 * @return {Array.<number>}
 */
npf.fx.KeyframeAnimation.prototype.getAccel = function() {
	return this._accel;
};

/**
 * @param {Object.<string,string|number>} fromRules
 * @param {Object.<string,string|number>} toRules
 * @param {Array.<number>=} opt_fromAcc
 * @param {Array.<number>=} opt_toAcc
 * @return {!npf.fx.KeyframeAnimation}
 */
npf.fx.KeyframeAnimation.prototype.fromTo = function(fromRules, toRules, opt_fromAcc, opt_toAcc) {
  this.from(fromRules, opt_fromAcc);

  return this.to(toRules, opt_toAcc);
};

/**
 * @param {Object.<string,string|number>} rules
 * @param {Array.<number>=} opt_acc
 * @return {!npf.fx.KeyframeAnimation}
 */
npf.fx.KeyframeAnimation.prototype.from = function(rules, opt_acc) {
	return this.insertKeyframe(rules, 0, opt_acc);
};

/**
 * @param {Object.<string,string|number>} rules
 * @param {Array.<number>=} opt_acc
 * @return {!npf.fx.KeyframeAnimation}
 */
npf.fx.KeyframeAnimation.prototype.to = function(rules, opt_acc) {
	return this.insertKeyframe(rules, 100, opt_acc);
};

/**
 * @param {Object.<string,string|number>} rules
 * @param {number} position from 0 to 100
 * @param {Array.<number>=} opt_acc
 * @return {!npf.fx.KeyframeAnimation}
 */
npf.fx.KeyframeAnimation.prototype.insertKeyframe = function(rules, position, opt_acc) {
	position = parseInt(position, 10);

	if (0 <= position && position <= 100) {
		/** @type {Object.<string,string>} */
		var properties = goog.object.clone(rules);

		if (opt_acc) {
			properties[npf.fx.KeyframeAnimation.CssProperty.ANIMATION_TIMING_FUNCTION] = 'cubic-bezier(' + opt_acc.join(',') + ')';
		}

		if (100 == position) {
			this._endStyles = goog.object.clone(rules);
		}

		if (!this._keyframesMap[/** @type {string} */ (position)]) {
			this._keyframesMap[/** @type {string} */ (position)] = {};
		}

		goog.object.extend(this._keyframesMap[/** @type {string} */ (position)], properties);
	}

	return this;
};

/**
 * @param {boolean=} opt_restart
 * @return {boolean}
 */
npf.fx.KeyframeAnimation.prototype.play = function(opt_restart) {
	if (opt_restart || this.isStopped()) {
		this._isCleared = true;

		if (this._domSet) {
			this.clearDom();
		}
	} else if (this.isPlaying()) {
		return false;
	}

	if (this._isCleared) {
		this.onBegin();
	}

	this.onPlay();

	if (this.isPaused()) {
		this.onResume();
	}

	if (this._isCleared) {
		this._isCleared = false;
		this.setDom();
	}

	this.setStatePlaying();

	return true;
};

/**
 * @protected
 */
npf.fx.KeyframeAnimation.prototype.setDom = function() {
	var rules = [];

	goog.object.forEach(this._keyframesMap, function(properties, position) {
		/** @type {string} */
		var keyframeText = position + '% {';

		for (var key in properties) {
			keyframeText += key + ':' + properties[key] + ';';
		}

		keyframeText += '}';
		rules.push(keyframeText);
	}, this);

	this._styleElement = /** @type {Element} */ (goog.dom.htmlToDocumentFragment('<style>@-' + npf.userAgent.Support.vendorPrefix + '-keyframes ' + this._name + ' {' + rules.join('') + '}</style>'));
	goog.dom.appendChild(document.head, this._styleElement);

	this._handler.listen(this.element, [
		npf.userAgent.Support.vendorPrefix + 'AnimationStart',
		'animationstart'
	], this._onAnimationStart, false, this);
	this._handler.listen(this.element, [
		npf.userAgent.Support.vendorPrefix + 'AnimationEnd',
		'animationend'
	], this._onAnimationEnd, false, this);
	this._handler.listen(this.element, [
		npf.userAgent.Support.vendorPrefix + 'AnimationIteration',
		'animationiteration'
	], this._onAnimationIteration, false, this);

	this._setAnimationDelay(this._delay);
	this._setAnimationDirection(this._direction);
	this._setAnimationDuration(this.duration);
	this._setAnimationIterationCount(this._iterationCount);
	this._setAnimationName(this._name);
	this._setAnimationTimingFunction(this._accel);
	this._setAnimationPlayState(npf.fx.KeyframeAnimation.PlayState.RUNNING);

	if (this._endStyles) {
		goog.style.setStyle(this.element, this._endStyles);
	}

	this._domSet = true;
};

/**
 * Stops the animation.
 * @param {boolean} gotoEnd If true the animation will move to the end coords.
 */
npf.fx.KeyframeAnimation.prototype.stop = function(gotoEnd) {
	this.setStateStopped();

	this._setAnimationPlayState(npf.fx.KeyframeAnimation.PlayState.PAUSED);

	if (gotoEnd) {
		this.clearDom();
	}

	this._isCleared = true;

	this.onStop();
	this.onEnd();
};

npf.fx.KeyframeAnimation.prototype.pause = function() {
	if (this.isPlaying()) {
		this._setAnimationPlayState(npf.fx.KeyframeAnimation.PlayState.PAUSED);
		this.setStatePaused();
		this.onPause();
	}
};

/**
 * @protected
 */
npf.fx.KeyframeAnimation.prototype.clearDom = function() {
	this._handler.removeAll();

	for (var name in npf.fx.KeyframeAnimation.CssProperty) {
		goog.style.setStyle(this.element, npf.fx.KeyframeAnimation.CssProperty[name], '');
	}

	if (this._styleElement) {
		goog.dom.removeNode(this._styleElement);
		this._styleElement = null;
	}

	this._domSet = false;
};

/**
 * @param {goog.events.Event} evt
 * @private
 */
npf.fx.KeyframeAnimation.prototype._onAnimationStart = function(evt) {

};

/**
 * @param {goog.events.Event} evt
 * @private
 */
npf.fx.KeyframeAnimation.prototype._onAnimationEnd = function(evt) {
	this.clearDom();

	this._isCleared = true;
	this.setStateStopped();
	this.onFinish();
	this.onEnd();
};

/**
 * @param {goog.events.Event} evt
 * @private
 */
npf.fx.KeyframeAnimation.prototype._onAnimationIteration = function(evt) {
	this.onIteration();
};

/**
 * @protected
 */
npf.fx.KeyframeAnimation.prototype.onIteration = function() {
  this.dispatchAnimationEvent(npf.fx.keyframeAnimation.EventType.ITERATION);
};

/**
 * @param {npf.fx.keyframeAnimation.EventType} type
 * @protected
 */
npf.fx.KeyframeAnimation.prototype.dispatchAnimationEvent = function(type) {
  this.dispatchEvent(new npf.fx.keyframeAnimation.Event(type, this));
};

/**
 * @param {number} delay
 * @private
 */
npf.fx.KeyframeAnimation.prototype._setAnimationDelay = function(delay) {
	goog.style.setStyle(this.element, npf.fx.KeyframeAnimation.CssProperty.ANIMATION_DELAY, delay + 'ms');
};

/**
 * @param {npf.fx.KeyframeAnimation.Direction} direction
 * @private
 */
npf.fx.KeyframeAnimation.prototype._setAnimationDirection = function(direction) {
	goog.style.setStyle(this.element, npf.fx.KeyframeAnimation.CssProperty.ANIMATION_DIRECTION, direction);
};

/**
 * @param {number} duration
 * @private
 */
npf.fx.KeyframeAnimation.prototype._setAnimationDuration = function(duration) {
	goog.style.setStyle(this.element, npf.fx.KeyframeAnimation.CssProperty.ANIMATION_DURATION, duration + 'ms');
};

/**
 * @param {number} count 0 — infinite
 * @private
 */
npf.fx.KeyframeAnimation.prototype._setAnimationIterationCount = function(count) {
	/** @type {string} */
	var value = count ? count + '' : 'infinite';
	goog.style.setStyle(this.element, npf.fx.KeyframeAnimation.CssProperty.ANIMATION_ITERATION_COUNT, value);
};

/**
 * @param {string} name
 * @private
 */
npf.fx.KeyframeAnimation.prototype._setAnimationName = function(name) {
	goog.style.setStyle(this.element, npf.fx.KeyframeAnimation.CssProperty.ANIMATION_NAME, name);
};

/**
 * @param {Array.<string>} accel
 * @private
 */
npf.fx.KeyframeAnimation.prototype._setAnimationTimingFunction = function(accel) {
	goog.style.setStyle(this.element, npf.fx.KeyframeAnimation.CssProperty.ANIMATION_TIMING_FUNCTION, 'cubic-bezier(' + accel.join(',') + ')');
};

/**
 * @param {npf.fx.KeyframeAnimation.PlayState} state
 * @private
 */
npf.fx.KeyframeAnimation.prototype._setAnimationPlayState = function(state) {
	this._playState = state;
	goog.style.setStyle(this.element, npf.fx.KeyframeAnimation.CssProperty.ANIMATION_PLAY_STATE, state);
};

/**
 * @param {number|string} fromOpacity
 * @param {number|string} toOpacity
 * @param {Array.<number>=} opt_fromAcc
 * @param {Array.<number>=} opt_toAcc
 * @return {!npf.fx.KeyframeAnimation}
 */
npf.fx.KeyframeAnimation.prototype.fromToOpacityRule = function(fromOpacity, toOpacity, opt_fromAcc, opt_toAcc) {
	this.setOpacityRule(fromOpacity, 0, opt_fromAcc);

	return this.setOpacityRule(toOpacity, 100, opt_toAcc);
};

/**
 * @param {number|string} opacity
 * @param {Array.<number>=} opt_acc
 * @return {!npf.fx.KeyframeAnimation}
 */
npf.fx.KeyframeAnimation.prototype.fromOpacityRule = function(opacity, opt_acc) {
	return this.setOpacityRule(opacity, 0, opt_acc);
};

/**
 * @param {number|string} opacity
 * @param {Array.<number>=} opt_acc
 * @return {!npf.fx.KeyframeAnimation}
 */
npf.fx.KeyframeAnimation.prototype.toOpacityRule = function(opacity, opt_acc) {
	return this.setOpacityRule(opacity, 100, opt_acc);
};

/**
 * @param {number|string} opacity
 * @param {number} position
 * @param {Array.<number>=} opt_acc
 * @return {!npf.fx.KeyframeAnimation}
 */
npf.fx.KeyframeAnimation.prototype.setOpacityRule = function(opacity, position, opt_acc) {
	return this.insertKeyframe({
		'opacity': opacity
	}, position, opt_acc);
};

/**
 * @param {Array.<number|string>|goog.math.Coordinate} fromCoords
 * @param {Array.<number|string>|goog.math.Coordinate} toCoords
 * @param {Array.<number>=} opt_fromAcc
 * @param {Array.<number>=} opt_toAcc
 * @return {!npf.fx.KeyframeAnimation}
 */
npf.fx.KeyframeAnimation.prototype.fromToPositionRule = function(fromCoords, toCoords, opt_fromAcc, opt_toAcc) {
	this.setPositionRule(fromCoords, 0, opt_fromAcc);

	return this.setPositionRule(toCoords, 100, opt_toAcc);
};

/**
 * @param {Array.<number|string>|goog.math.Coordinate} coords
 * @param {Array.<number>=} opt_acc
 * @return {!npf.fx.KeyframeAnimation}
 */
npf.fx.KeyframeAnimation.prototype.fromPositionRule = function(coords, opt_acc) {
	return this.setPositionRule(coords, 0, opt_acc);
};

/**
 * @param {Array.<number|string>|goog.math.Coordinate} coords
 * @param {Array.<number>=} opt_acc
 * @return {!npf.fx.KeyframeAnimation}
 */
npf.fx.KeyframeAnimation.prototype.toPositionRule = function(coords, opt_acc) {
	return this.setPositionRule(coords, 100, opt_acc);
};

/**
 * @param {Array.<number|string>|goog.math.Coordinate} coords
 * @param {number} position
 * @param {Array.<number>=} opt_acc
 * @return {!npf.fx.KeyframeAnimation}
 */
npf.fx.KeyframeAnimation.prototype.setPositionRule = function(coords, position, opt_acc) {
	/** @type {number} */
	var left;
	/** @type {number} */
	var top;

	if (goog.isArray(coords)) {
		if (2 == coords.length) {
			left = coords[0];
			top = coords[1];
		} else {
			throw Error('Position must be 2D');
		}
	} else {
		left = coords.x;
		top = coords.y;
	}

	return this.insertKeyframe({
		'left': goog.isNumber(left) ? left + 'px' : left,
		'top': goog.isNumber(top) ? top + 'px' : top
	}, position, opt_acc);
};

/**
 * @param {number|string} fromLeft
 * @param {number|string} toLeft
 * @param {Array.<number>=} opt_fromAcc
 * @param {Array.<number>=} opt_toAcc
 * @return {!npf.fx.KeyframeAnimation}
 */
npf.fx.KeyframeAnimation.prototype.fromToLeftRule = function(fromLeft, toLeft, opt_fromAcc, opt_toAcc) {
	this.setLeftRule(fromLeft, 0, opt_fromAcc);

	return this.setLeftRule(toLeft, 100, opt_toAcc);
};

/**
 * @param {number|string} left
 * @param {Array.<number>=} opt_acc
 * @return {!npf.fx.KeyframeAnimation}
 */
npf.fx.KeyframeAnimation.prototype.fromLeftRule = function(left, opt_acc) {
	return this.setLeftRule(left, 0, opt_acc);
};

/**
 * @param {number|string} left
 * @param {Array.<number>=} opt_acc
 * @return {!npf.fx.KeyframeAnimation}
 */
npf.fx.KeyframeAnimation.prototype.toLeftRule = function(left, opt_acc) {
	return this.setLeftRule(left, 100, opt_acc);
};

/**
 * @param {number|string} left
 * @param {number} position
 * @param {Array.<number>=} opt_acc
 * @return {!npf.fx.KeyframeAnimation}
 */
npf.fx.KeyframeAnimation.prototype.setLeftRule = function(left, position, opt_acc) {
	return this.insertKeyframe({
		'left': goog.isNumber(left) ? left + 'px' : left
	}, position, opt_acc);
};

/**
 * @param {number|string} fromTop
 * @param {number|string} toTop
 * @param {Array.<number>=} opt_fromAcc
 * @param {Array.<number>=} opt_toAcc
 * @return {!npf.fx.KeyframeAnimation}
 */
npf.fx.KeyframeAnimation.prototype.fromToTopRule = function(fromTop, toTop, opt_fromAcc, opt_toAcc) {
	this.setTopRule(fromTop, 0, opt_fromAcc);

	return this.setTopRule(toTop, 100, opt_toAcc);
};

/**
 * @param {number|string} top
 * @param {Array.<number>=} opt_acc
 * @return {!npf.fx.KeyframeAnimation}
 */
npf.fx.KeyframeAnimation.prototype.fromTopRule = function(top, opt_acc) {
	return this.setTopRule(top, 0, opt_acc);
};

/**
 * @param {number|string} top
 * @param {Array.<number>=} opt_acc
 * @return {!npf.fx.KeyframeAnimation}
 */
npf.fx.KeyframeAnimation.prototype.toTopRule = function(top, opt_acc) {
	return this.setTopRule(top, 100, opt_acc);
};

/**
 * @param {number|string} top
 * @param {number} position
 * @param {Array.<number>=} opt_acc
 * @return {!npf.fx.KeyframeAnimation}
 */
npf.fx.KeyframeAnimation.prototype.setTopRule = function(top, position, opt_acc) {
	return this.insertKeyframe({
		'top': goog.isNumber(top) ? top + 'px' : top
	}, position, opt_acc);
};

/**
 * @param {number|string} fromRight
 * @param {number|string} toRight
 * @param {Array.<number>=} opt_fromAcc
 * @param {Array.<number>=} opt_toAcc
 * @return {!npf.fx.KeyframeAnimation}
 */
npf.fx.KeyframeAnimation.prototype.fromToRightRule = function(fromRight, toRight, opt_fromAcc, opt_toAcc) {
	this.setRightRule(fromRight, 0, opt_fromAcc);

	return this.setRightRule(toRight, 100, opt_toAcc);
};

/**
 * @param {number|string} right
 * @param {Array.<number>=} opt_acc
 * @return {!npf.fx.KeyframeAnimation}
 */
npf.fx.KeyframeAnimation.prototype.fromRightRule = function(right, opt_acc) {
	return this.setRightRule(right, 0, opt_acc);
};

/**
 * @param {number|string} right
 * @param {Array.<number>=} opt_acc
 * @return {!npf.fx.KeyframeAnimation}
 */
npf.fx.KeyframeAnimation.prototype.toRightRule = function(right, opt_acc) {
	return this.setRightRule(right, 100, opt_acc);
};

/**
 * @param {number|string} right
 * @param {number} position
 * @param {Array.<number>=} opt_acc
 * @return {!npf.fx.KeyframeAnimation}
 */
npf.fx.KeyframeAnimation.prototype.setRightRule = function(right, position, opt_acc) {
	return this.insertKeyframe({
		'right': goog.isNumber(right) ? right + 'px' : right
	}, position, opt_acc);
};

/**
 * @param {number|string} fromBottom
 * @param {number|string} toBottom
 * @param {Array.<number>=} opt_fromAcc
 * @param {Array.<number>=} opt_toAcc
 * @return {!npf.fx.KeyframeAnimation}
 */
npf.fx.KeyframeAnimation.prototype.fromToBottomRule = function(fromBottom, toBottom, opt_fromAcc, opt_toAcc) {
	this.setBottomRule(fromBottom, 0, opt_fromAcc);

	return this.setBottomRule(toBottom, 100, opt_toAcc);
};

/**
 * @param {number|string} bottom
 * @param {Array.<number>=} opt_acc
 * @return {!npf.fx.KeyframeAnimation}
 */
npf.fx.KeyframeAnimation.prototype.fromBottomRule = function(bottom, opt_acc) {
	return this.setBottomRule(bottom, 0, opt_acc);
};

/**
 * @param {number|string} bottom
 * @param {Array.<number>=} opt_acc
 * @return {!npf.fx.KeyframeAnimation}
 */
npf.fx.KeyframeAnimation.prototype.toBottomRule = function(bottom, opt_acc) {
	return this.setBottomRule(bottom, 100, opt_acc);
};

/**
 * @param {number|string} bottom
 * @param {number} position
 * @param {Array.<number>=} opt_acc
 * @return {!npf.fx.KeyframeAnimation}
 */
npf.fx.KeyframeAnimation.prototype.setBottomRule = function(bottom, position, opt_acc) {
	return this.insertKeyframe({
		'bottom': goog.isNumber(bottom) ? bottom + 'px' : bottom
	}, position, opt_acc);
};

/**
 * @param {Array.<number|string>|goog.math.Size|goog.math.Rect} fromSize
 * @param {Array.<number|string>|goog.math.Size|goog.math.Rect} toSize
 * @param {Array.<number>=} opt_fromAcc
 * @param {Array.<number>=} opt_toAcc
 * @return {!npf.fx.KeyframeAnimation}
 */
npf.fx.KeyframeAnimation.prototype.fromToSizeRule = function(fromSize, toSize, opt_fromAcc, opt_toAcc) {
	this.setSizeRule(fromSize, 0, opt_fromAcc);

	return this.setSizeRule(toSize, 100, opt_toAcc);
};

/**
 * @param {Array.<number|string>|goog.math.Size|goog.math.Rect} size
 * @param {Array.<number>=} opt_acc
 * @return {!npf.fx.KeyframeAnimation}
 */
npf.fx.KeyframeAnimation.prototype.fromSizeRule = function(size, opt_acc) {
	return this.setSizeRule(size, 0, opt_acc);
};

/**
 * @param {Array.<number|string>|goog.math.Size|goog.math.Rect} size
 * @param {Array.<number>=} opt_acc
 * @return {!npf.fx.KeyframeAnimation}
 */
npf.fx.KeyframeAnimation.prototype.toSizeRule = function(size, opt_acc) {
	return this.setSizeRule(size, 100, opt_acc);
};

/**
 * @param {Array.<number|string>|goog.math.Size|goog.math.Rect} size
 * @param {number} position
 * @param {Array.<number>=} opt_acc
 * @return {!npf.fx.KeyframeAnimation}
 */
npf.fx.KeyframeAnimation.prototype.setSizeRule = function(size, position, opt_acc) {
	/** @type {number} */
	var width;
	/** @type {number} */
	var height;

	if (goog.isArray(size)) {
		if (2 == size.length) {
			width = size[0];
			height = size[1];
		} else {
			throw Error('Size must be 2D');
		}
	} else {
		width = size.width;
		height = size.height;
	}

	return this.insertKeyframe({
		'width': goog.isNumber(width) ? width + 'px' : width,
		'height': goog.isNumber(height) ? height + 'px' : height
	}, position, opt_acc);
};

/**
 * @param {number|string} fromWidth
 * @param {number|string} toWidth
 * @param {Array.<number>=} opt_fromAcc
 * @param {Array.<number>=} opt_toAcc
 * @return {!npf.fx.KeyframeAnimation}
 */
npf.fx.KeyframeAnimation.prototype.fromToWidthRule = function(fromWidth, toWidth, opt_fromAcc, opt_toAcc) {
	this.setWidthRule(fromWidth, 0, opt_fromAcc);

	return this.setWidthRule(toWidth, 100, opt_toAcc);
};

/**
 * @param {number|string} width
 * @param {Array.<number>=} opt_acc
 * @return {!npf.fx.KeyframeAnimation}
 */
npf.fx.KeyframeAnimation.prototype.fromWidthRule = function(width, opt_acc) {
	return this.setWidthRule(width, 0, opt_acc);
};

/**
 * @param {number|string} width
 * @param {Array.<number>=} opt_acc
 * @return {!npf.fx.KeyframeAnimation}
 */
npf.fx.KeyframeAnimation.prototype.toWidthRule = function(width, opt_acc) {
	return this.setWidthRule(width, 100, opt_acc);
};

/**
 * @param {number|string} width
 * @param {number} position
 * @param {Array.<number>=} opt_acc
 * @return {!npf.fx.KeyframeAnimation}
 */
npf.fx.KeyframeAnimation.prototype.setWidthRule = function(width, position, opt_acc) {
	return this.insertKeyframe({
		'width': goog.isNumber(width) ? width + 'px' : width
	}, position, opt_acc);
};

/**
 * @param {number|string} fromHeight
 * @param {number|string} toHeight
 * @param {Array.<number>=} opt_fromAcc
 * @param {Array.<number>=} opt_toAcc
 * @return {!npf.fx.KeyframeAnimation}
 */
npf.fx.KeyframeAnimation.prototype.fromToHeightRule = function(fromHeight, toHeight, opt_fromAcc, opt_toAcc) {
	this.setHeightRule(fromHeight, 0, opt_fromAcc);

	return this.setHeightRule(toHeight, 100, opt_toAcc);
};

/**
 * @param {number|string} height
 * @param {Array.<number>=} opt_acc
 * @return {!npf.fx.KeyframeAnimation}
 */
npf.fx.KeyframeAnimation.prototype.fromHeightRule = function(height, opt_acc) {
	return this.setHeightRule(height, 0, opt_acc);
};

/**
 * @param {number|string} height
 * @param {Array.<number>=} opt_acc
 * @return {!npf.fx.KeyframeAnimation}
 */
npf.fx.KeyframeAnimation.prototype.toHeightRule = function(height, opt_acc) {
	return this.setHeightRule(height, 100, opt_acc);
};

/**
 * @param {number|string} height
 * @param {number} position
 * @param {Array.<number>=} opt_acc
 * @return {!npf.fx.KeyframeAnimation}
 */
npf.fx.KeyframeAnimation.prototype.setHeightRule = function(height, position, opt_acc) {
	return this.insertKeyframe({
		'height': goog.isNumber(height) ? height + 'px' : height
	}, position, opt_acc);
};

/**
 * @param {string|Array.<number>} fromColor
 * @param {string|Array.<number>} toColor
 * @param {Array.<number>=} opt_fromAcc
 * @param {Array.<number>=} opt_toAcc
 * @return {!npf.fx.KeyframeAnimation}
 */
npf.fx.KeyframeAnimation.prototype.fromToColorRule = function(fromColor, toColor, opt_fromAcc, opt_toAcc) {
	this.setColorRule(fromColor, 0, opt_fromAcc);

	return this.setColorRule(toColor, 100, opt_toAcc);
};

/**
 * @param {string|Array.<number>} color
 * @param {Array.<number>=} opt_acc
 * @return {!npf.fx.KeyframeAnimation}
 */
npf.fx.KeyframeAnimation.prototype.fromColorRule = function(color, opt_acc) {
	return this.setColorRule(color, 0, opt_acc);
};

/**
 * @param {string|Array.<number>} color
 * @param {Array.<number>=} opt_acc
 * @return {!npf.fx.KeyframeAnimation}
 */
npf.fx.KeyframeAnimation.prototype.toColorRule = function(color, opt_acc) {
	return this.setColorRule(color, 100, opt_acc);
};

/**
 * @param {string|Array.<number>} color
 * @param {number} position
 * @param {Array.<number>=} opt_acc
 * @return {!npf.fx.KeyframeAnimation}
 */
npf.fx.KeyframeAnimation.prototype.setColorRule = function(color, position, opt_acc) {
	var value = '';

	if (goog.isArray(color)) {
		if (4 == color.length) {
			value = 'rgba(' + color.join(',') + ')';
		} else if (3 == color.length) {
			value = 'rgb(' + color.join(',') + ')';
		} else {
			throw Error('Color must be 3D or 4D');
		}
	} else {
		value = color;
	}

	return this.insertKeyframe({
		'color': value
	}, position, opt_acc);
};

/**
 * @param {string|Array.<number>} fromBgColor
 * @param {string|Array.<number>} toBgColor
 * @param {Array.<number>=} opt_fromAcc
 * @param {Array.<number>=} opt_toAcc
 * @return {!npf.fx.KeyframeAnimation}
 */
npf.fx.KeyframeAnimation.prototype.fromToBgColorRule = function(fromBgColor, toBgColor, opt_fromAcc, opt_toAcc) {
	this.setBgColorRule(fromBgColor, 0, opt_fromAcc);

	return this.setBgColorRule(toBgColor, 100, opt_toAcc);
};

/**
 * @param {string|Array.<number>} bgColor
 * @param {Array.<number>=} opt_acc
 * @return {!npf.fx.KeyframeAnimation}
 */
npf.fx.KeyframeAnimation.prototype.fromBgColorRule = function(bgColor, opt_acc) {
	return this.setBgColorRule(bgColor, 0, opt_acc);
};

/**
 * @param {string|Array.<number>} bgColor
 * @param {Array.<number>=} opt_acc
 * @return {!npf.fx.KeyframeAnimation}
 */
npf.fx.KeyframeAnimation.prototype.toBgColorRule = function(bgColor, opt_acc) {
	return this.setBgColorRule(bgColor, 100, opt_acc);
};

/**
 * @param {string|Array.<number>} bgColor
 * @param {number} position
 * @param {Array.<number>=} opt_acc
 * @return {!npf.fx.KeyframeAnimation}
 */
npf.fx.KeyframeAnimation.prototype.setBgColorRule = function(bgColor, position, opt_acc) {
	var value = '';

	if (goog.isArray(bgColor)) {
		if (4 == bgColor.length) {
			value = 'rgba(' + bgColor.join(',') + ')';
		} else if (3 == bgColor.length) {
			value = 'rgb(' + bgColor.join(',') + ')';
		} else {
			throw Error('Background Color must be 3D or 4D');
		}
	} else {
		value = bgColor;
	}

	return this.insertKeyframe({
		'background-color': value
	}, position, opt_acc);
};

/**
 * @param {string} fromTransform
 * @param {string} toTransform
 * @param {Array.<number>=} opt_fromAcc
 * @param {Array.<number>=} opt_toAcc
 * @return {!npf.fx.KeyframeAnimation}
 */
npf.fx.KeyframeAnimation.prototype.fromToTransformRule = function(fromTransform, toTransform, opt_fromAcc, opt_toAcc) {
	this.setTransformRule(fromTransform, 0, opt_fromAcc);

	return this.setTransformRule(toTransform, 100, opt_toAcc);
};

/**
 * @param {string} transform
 * @param {Array.<number>=} opt_acc
 * @return {!npf.fx.KeyframeAnimation}
 */
npf.fx.KeyframeAnimation.prototype.fromTransformRule = function(transform, opt_acc) {
	return this.setTransformRule(transform, 0, opt_acc);
};

/**
 * @param {string} transform
 * @param {Array.<number>=} opt_acc
 * @return {!npf.fx.KeyframeAnimation}
 */
npf.fx.KeyframeAnimation.prototype.toTransformRule = function(transform, opt_acc) {
	return this.setTransformRule(transform, 100, opt_acc);
};

/**
 * @param {string} transform
 * @param {number} position
 * @param {Array.<number>=} opt_acc
 * @return {!npf.fx.KeyframeAnimation}
 */
npf.fx.KeyframeAnimation.prototype.setTransformRule = function(transform, position, opt_acc) {
	return this.insertKeyframe(goog.object.create(
		npf.userAgent.support.getCssPropertyName('transform'), transform
	), position, opt_acc);
};

/**
 * @param {string|Array.<number|string>} origin
 * @return {!npf.fx.KeyframeAnimation}
 */
npf.fx.KeyframeAnimation.prototype.setTransformOrigin = function(origin) {
	var value;

	if (goog.isArray(origin)) {
		if (2 != origin.length || 3 != origin.length) {
			throw Error('Transform Origin must be 2D or 3D');
		}

		value = origin.join(' ');
	} else {
		value = origin;
	}

	goog.style.setStyle(this.element, npf.userAgent.support.getCssPropertyName('transform-origin'), /** @type {string} */ (value));

	return this;
};
