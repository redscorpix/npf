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
  var names = npf.style.animation.getNames(element);
  /** @type {!Array.<npf.style.animation.PlayState>} */
  var playStates = [];
  /** @type {!Array.<number>} */
  var durations = [];
  /** @type {!Array.<Array.<number>>} */
  var timingFunctions = [];
  /** @type {!Array.<number>} */
  var delays = [];
  /** @type {!Array.<number>} */
  var iterationCounts = [];
  /** @type {!Array.<npf.style.animation.Direction>} */
  var directions = [];

  if (names.length) {
    playStates = npf.style.animation.getPlayStates(element, names.length);
    durations = npf.style.animation.getDurations(element, names.length);
    timingFunctions = npf.style.animation.getTimingFunctions(
      element, names.length);
    delays = npf.style.animation.getDelays(element, names.length);
    iterationCounts = npf.style.animation.getIterationCounts(
      element, names.length);
    directions = npf.style.animation.getDirections(element, names.length);
  }

  /** @type {!Array.<npf.style.Animation>} */
  var animations = [];

  goog.array.forEach(names, function(name, i) {
    animations.push({
      name: name,
      duration: durations[i],
      timingFunction: timingFunctions[i],
      delay: delays[i],
      iterationCount: iterationCounts[i],
      direction: directions[i],
      playState: playStates[i]
    });
  });

  return animations;
};

/**
 * @param {Element} element
 * @return {!Array.<string>}
 */
npf.style.animation.getNames = function(element) {
  /** @type {string} */
  var style = npf.style.animation.Property.ANIMATION_NAME;
  /** @type {!Array.<string>} */
  var names = npf.style.animation.getValues_(element, style);

  if (!names.length || '' == names[0]) {
    return [];
  }

  return names;
};

/**
 * @param {Element} element
 * @param {number=} opt_count
 * @return {!Array.<npf.style.animation.PlayState>}
 */
npf.style.animation.getPlayStates = function(element, opt_count) {
  /** @type {string} */
  var style = npf.style.animation.Property.ANIMATION_PLAY_STATE;
  /** @type {!Array.<string>} */
  var values = npf.style.animation.getValues_(element, style);
  /** @type {npf.style.animation.PlayState} */
  var defValue = npf.style.animation.PlayState.PAUSED;

  var states =
    /** @type {!Array.<npf.style.animation.PlayState>} */ (goog.array.map(values, function(value) {
      return '' == value ? defValue : value;
    }));

  if (goog.isNumber(opt_count) && states.length != opt_count) {
    states = npf.style.animation.normalize_(states, opt_count, defValue);
  }

  return states;
};

/**
 * @param {Element} element
 * @param {number=} opt_count
 * @return {!Array.<Array.<number>>}
 */
npf.style.animation.getTimingFunctions = function(element, opt_count) {
  /** @type {!Array.<Array.<number>>} */
  var result = [];
  /** @type {string} */
  var style = npf.style.animation.Property.ANIMATION_TIMING_FUNCTION;
  /** @type {!Array.<string>} */
  var values = npf.style.animation.getValues_(element, style);
  /** @type {Array.<number>} */
  var timingFunction;

  goog.array.forEach(values, function(value, i) {
    switch (i % 4) {
      case 0:
        timingFunction = [goog.string.toNumber(value.substr(13, value.length - 13))];
        break;

      case 1:
      case 2:
        timingFunction.push(goog.string.toNumber(value));
        break;

      case 3:
        timingFunction.push(goog.string.toNumber(value.substr(0, value.length - 1)));
        result.push(timingFunction);
        break;
    }
  });

  if (goog.isNumber(opt_count) && result.length != opt_count) {
    result = npf.style.animation.normalize_(result, opt_count, npf.fx.css3.easing.LINEAR);
  }

  return result;
};

/**
 * @param {Element} element
 * @param {number=} opt_count
 * @return {!Array.<number>}
 */
npf.style.animation.getDurations = function(element, opt_count) {
  /** @type {string} */
  var style = npf.style.animation.Property.ANIMATION_DURATION;

  return npf.style.animation.getNumberValues_(element, style, opt_count);
};

/**
 * @param {Element} element
 * @param {number=} opt_count
 * @return {!Array.<number>}
 */
npf.style.animation.getDelays = function(element, opt_count) {
  /** @type {string} */
  var style = npf.style.animation.Property.ANIMATION_DELAY;

  return npf.style.animation.getNumberValues_(element, style, opt_count);
};

/**
 * @param {Element} element
 * @param {string} style
 * @param {number=} opt_count
 * @return {!Array.<number>}
 * @private
 */
npf.style.animation.getNumberValues_ = function(element, style, opt_count) {
  /** @type {!Array.<string>} */
  var values = npf.style.animation.getValues_(element, style);
  var msRegExp = /[\.\d]+ms/;
  var sRegExp = /[\.\d]+s/;

  var result =
    /** @type {!Array.<number>} */ (goog.array.map(values, function(value) {
      /** @type {number} */
      var result = 0;

      if (msRegExp.test(value)) {
        result = goog.string.toNumber(value.substr(0, value.length - 2));
      } else if (sRegExp.test(value)) {
        result =  1000 * goog.string.toNumber(value.substr(0, value.length - 1));
      }

      return result;
    }));

  if (goog.isNumber(opt_count) && result.length != opt_count) {
    result = npf.style.animation.normalize_(result, opt_count, 0);
  }

  return result;
};

/**
 * @param {Element} element
 * @param {number=} opt_count
 * @return {!Array.<number>}
 */
npf.style.animation.getIterationCounts = function(element, opt_count) {
  /** @type {string} */
  var style = npf.style.animation.Property.ANIMATION_ITERATION_COUNT;
  /** @type {!Array.<string>} */
  var values = npf.style.animation.getValues_(element, style);
  var defValue = 1;

  var counts =
    /** @type {!Array.<number>} */ (goog.array.map(values, function(value) {
      if ('' == value) {
        return defValue;
      } else if ('infinite' == value) {
        return 0;
      }

      return goog.string.toNumber(value);
    }));

  if (goog.isNumber(opt_count) && counts.length != opt_count) {
    counts = npf.style.animation.normalize_(counts, opt_count, defValue);
  }

  return counts;
};

/**
 * @param {Element} element
 * @param {number=} opt_count
 * @return {!Array.<npf.style.animation.Direction>}
 */
npf.style.animation.getDirections = function(element, opt_count) {
  /** @type {string} */
  var style = npf.style.animation.Property.ANIMATION_DIRECTION;
  /** @type {!Array.<string>} */
  var values = npf.style.animation.getValues_(element, style);
  var defValue = npf.style.animation.Direction.NORMAL;
  var directions =
    /** @type {!Array.<npf.style.animation.Direction>} */ (goog.array.map(values, function(value) {
      return '' == value ? defValue : value;
    }));

  if (goog.isNumber(opt_count) && directions.length != opt_count) {
    directions = npf.style.animation.normalize_(directions, opt_count, defValue);
  }

  return directions;
};

/**
 * @param {!Array} values
 * @param {number} count
 * @param {*} defValue
 * @return {!Array}
 * @private
 */
npf.style.animation.normalize_ = function(values, count, defValue) {
  if (values.length > count) {
    values = goog.array.slice(values, 0, count);
  }

  for (var i = values.length; i < count; i++) {
    values.push(defValue);
  }

  return values;
};

/**
 * @param {Element} element
 * @param {string} style
 * @return {!Array.<string>}
 * @private
 */
npf.style.animation.getValues_ = function(element, style) {
  /** @type {string} */
  var value = npf.style.animation.getValue_(element, style).replace(/\s/g, '');

  if ('' == value) {
    return [];
  }

  return value.split(',');
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
npf.style.animation.getStyle_ = function(element, style) {
  return goog.style.getComputedStyle(element, style) ||
      goog.style.getCascadedStyle(element, style) || element.style[style];
};
