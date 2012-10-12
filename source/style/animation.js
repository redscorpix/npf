goog.provide('npf.style.Animation');
goog.provide('npf.style.animation');
goog.provide('npf.style.animation.Direction');
goog.provide('npf.style.animation.PlayState');
goog.provide('npf.style.animation.Property');

goog.require('goog.array');
goog.require('goog.string');
goog.require('goog.style');
goog.require('npf.fx.css3.easing');
goog.require('npf.userAgent.support');


/**
 * @enum {string}
 */
npf.style.animation.Direction = {
  NORMAL: 'normal',
  ALTERNATE: 'alternate'
};

/**
 * @enum {string}
 */
npf.style.animation.PlayState = {
  RUNNING: 'running',
  PAUSED: 'paused'
};

/**
 * @enum {string}
 */
npf.style.animation.Property = {
  ANIMATION: 'animation',
  ANIMATION_DELAY: 'animation-delay',
  ANIMATION_DIRECTION: 'animation-direction',
  ANIMATION_DURATION: 'animation-duration',
  ANIMATION_ITERATION_COUNT: 'animation-iteration-count',
  ANIMATION_NAME: 'animation-name',
  ANIMATION_PLAY_STATE: 'animation-play-state',
  ANIMATION_TIMING_FUNCTION: 'animation-timing-function'
};

/**
 * @typedef {{
 *  name: string,
 *  delay: number,
 *  direction: npf.style.animation.Direction,
 *  duration: number,
 *  iterationCount: number,
 *  playState: npf.style.animation.PlayState,
 *  timingFunction: Array.<number>
 * }}
 */
npf.style.Animation;


/**
 * @param {Element} element
 * @param {string} name
 */
npf.style.animation.removeAnimation = function(element, name) {
  /** @type {!Array.<npf.style.Animation>} */
  var animations = npf.style.animation.getAnimations(element);
  /** @type {number} */
  var index = goog.array.findIndex(animations, function(anim) {
    return anim.name == name;
  });

  if (-1 < index && goog.array.removeAt(animations, index)) {
    npf.style.animation.setAnimations_(element, animations);
  }
};

/**
 * @param {Element} element
 */
npf.style.animation.removeAnimations = function(element) {
  npf.style.animation.setValue_(element,
    npf.style.animation.Property.ANIMATION, '');
  npf.style.animation.setValue_(element,
    npf.style.animation.Property.ANIMATION_PLAY_STATE, '');
};

/**
 * @param {Element} element
 * @param {string} name
 * @return {npf.style.Animation?}
 */
npf.style.animation.getAnimation = function(element, name) {
  /** @type {!Array.<npf.style.Animation>} */
  var animations = npf.style.animation.getAnimations(element);

  return /** @type {npf.style.Animation?} */ (goog.array.find(animations, function(animation) {
    return animation.name == name;
  }));
};

/**
 * @param {Element} element
 * @param {string|npf.style.Animation} name
 * @param {npf.style.animation.PlayState=} opt_playState
 * @return {boolean}
 */
npf.style.animation.setPlayState = function(element, name, opt_playState) {
  var animationName =
    /** @type {string} */ (goog.isString(name) ? name : name.name);
  var playState =
    /** @type {npf.style.animation.PlayState} */ (goog.isString(name) ?
    opt_playState : name.playState);

  /** @type {!Array.<npf.style.Animation>} */
  var animations = npf.style.animation.getAnimations(element);
  /** @type {number} */
  var index = goog.array.findIndex(animations, function(anim) {
    return anim.name == animationName;
  });

  if (-1 < index) {
    /** @type {!Array.<string>} */
    var playStates = [];

    goog.array.forEach(animations, function(animation) {
      playStates.push(animation.playState);
    });
    playStates[index] = playState;

    npf.style.animation.setValue_(element,
      npf.style.animation.Property.ANIMATION_PLAY_STATE, playStates.join(','));

    return true;
  }

  return false;
};

/**
 * @param {Element} element
 * @param {npf.style.Animation} animation
 */
npf.style.animation.setAnimation = function(element, animation) {
  /** @type {!Array.<npf.style.Animation>} */
  var animations = npf.style.animation.getAnimations(element);
  /** @type {number} */
  var index = goog.array.findIndex(animations, function(anim) {
    return anim.name == animation.name;
  });
  /** @type {npf.style.Animation} */
  var oldAnimation = animations[index] || null;

  if (!(
    oldAnimation &&
    oldAnimation.delay == animation.delay &&
    oldAnimation.direction == animation.direction &&
    oldAnimation.duration == animation.duration &&
    oldAnimation.iterationCount == animation.iterationCount &&
    oldAnimation.playState == animation.playState &&
    oldAnimation.timingFunction.join(',') == animation.timingFunction.join(',')
  )) {
    if (-1 < index) {
      animations[index] = animation;
    } else {
      animations.push(animation);
    }

    npf.style.animation.setAnimations_(element, animations);
  }
};

/**
 * @param {Element} element
 * @param {!Array.<npf.style.Animation>} animations
 * @private
 */
npf.style.animation.setAnimations_ = function(element, animations) {
  /** @type {!Array.<string>} */
  var values = [];
  /** @type {!Array.<string>} */
  var playStates = [];

  goog.array.forEach(animations, function(animation) {
    values.push([
      animation.name,
      animation.duration + 'ms',
      'cubic-bezier(' + animation.timingFunction.join(',') + ')',
      animation.delay + 'ms',
      animation.iterationCount ? animation.iterationCount : 'infinite',
      animation.direction
    ].join(' '));
    playStates.push(animation.playState);
  });

  npf.style.animation.setValue_(element,
    npf.style.animation.Property.ANIMATION, values.join(','));
  npf.style.animation.setValue_(element,
    npf.style.animation.Property.ANIMATION_PLAY_STATE, playStates.join(','));
};

/**
 * @param {Element} element
 * @return {!Array.<npf.style.Animation>}
 */
npf.style.animation.getAnimations = function(element) {
  /** @type {!Array.<string>} */
  var strAnimations = npf.style.animation.getValue_(element,
    npf.style.animation.Property.ANIMATION).split(' ');
  /** @type {string} */
  var strPlayStates = npf.style.animation.getValue_(element,
    npf.style.animation.Property.ANIMATION_PLAY_STATE);
  /** @type {!Array.<npf.style.animation.PlayState>} */
  var playStates = [];

  if ('' != strPlayStates) {
    playStates =
      /** @type {!Array.<npf.style.animation.PlayState>} */ (strPlayStates.replace(/\s/g, '').split(','));
  }

  /** @type {string} */
  var name;
  /** @type {number} */
  var duration;
  /** @type {Array.<number>} */
  var timingFunctions;
  /** @type {Array.<number>} */
  var timingFunction;
  /** @type {number} */
  var delay;
  /** @type {number} */
  var iterationCount;
  /** @type {npf.style.animation.Direction} */
  var direction;
  /** @type {!Array.<npf.style.Animation>} */
  var animations = [];

  goog.array.forEach(strAnimations, function(part, i) {
    var count = 9;

    switch (i % count) {
      case 0:
        name = part;
        break;

      case 1:
        duration = npf.style.animation.getMilliseconds_(part);
        break;

      case 2:
        timingFunction = [goog.string.toNumber(part.substr(13, part.length - 14))];
        break;

      case 3:
      case 4:
      case 5:
        timingFunction.push(goog.string.toNumber(part.substr(0, part.length - 1)));
        break;

      case 6:
        delay = npf.style.animation.getMilliseconds_(part);
        break;

      case 7:
        iterationCount = 'infinite' == part ? 0 : goog.string.toNumber(part);
        break;

      case 8:
        if (strAnimations.length - 1 == i) {
          direction = /** @type {npf.style.animation.Direction} */ (part);
        } else {
          direction = /** @type {npf.style.animation.Direction} */ (part.substr(
            0, part.length - 1));
        }

        var animation = {
          name: name,
          duration: duration,
          timingFunction: timingFunction,
          delay: delay,
          iterationCount: iterationCount,
          direction: direction,
          playState: playStates[Math.floor(i / count)] ||
            npf.style.animation.PlayState.PAUSED
        };
        animations.push(animation);

        break;
    }
  });

  return animations;
};

/**
 * @param {string} value
 * @return {number}
 * @private
 */
npf.style.animation.getMilliseconds_ = function(value) {
  var msRegExp = /[\.\d]+ms/;
  var sRegExp = /[\.\d]+s/;
  /** @type {number} */
  var result = 0;

  if (msRegExp.test(value)) {
    result = goog.string.toNumber(value.substr(0, value.length - 2));
  } else if (sRegExp.test(value)) {
    result =  1000 * goog.string.toNumber(value.substr(0, value.length - 1));
  }

  return result;
};

/**
 * @param {Element} element
 * @param {string} key
 * @param {string} value
 * @private
 */
npf.style.animation.setValue_ = function(element, key, value) {
  /** @type {string} */
  var style = npf.userAgent.support.getCssPropertyName(key);
  goog.style.setStyle(element, style, value);
};

/**
 * @param {Element} element
 * @param {string} style
 * @return {string}
 * @private
 */
npf.style.animation.getValue_ = function(element, style) {
  /** @type {string} */
  var property = npf.userAgent.support.getCssPropertyName(style);
  /** @type {string} */
  var value;

  if (property) {
    value = npf.style.animation.getStyle_(element, property);
  }

  if (!value || 'none' == value) {
    value = npf.style.animation.getStyle_(element, style);
  }

  return value && 'none' != value ? value : '';
};

/**
 * @param {Element} element
 * @param {string} style
 * @return {string}
 * @private
 */
npf.style.animation.getStyle_ = function(element, style) {
  return goog.style.getComputedStyle(element, style) ||
      goog.style.getCascadedStyle(element, style) || element.style[style];
};
