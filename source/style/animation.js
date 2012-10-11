goog.provide('npf.style.Animation');
goog.provide('npf.style.animation');
goog.provide('npf.style.animation.Direction');
goog.provide('npf.style.animation.PlayState');
goog.provide('npf.style.animation.Property');

goog.require('goog.array');
goog.require('goog.object');
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
  npf.style.animation.setValue_(element, goog.object.create(
    npf.style.animation.Property.ANIMATION_DELAY,           [],
    npf.style.animation.Property.ANIMATION_DIRECTION,       [],
    npf.style.animation.Property.ANIMATION_DURATION,        [],
    npf.style.animation.Property.ANIMATION_ITERATION_COUNT, [],
    npf.style.animation.Property.ANIMATION_NAME,            [],
    npf.style.animation.Property.ANIMATION_PLAY_STATE,      [],
    npf.style.animation.Property.ANIMATION_TIMING_FUNCTION, []
  ));
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
      npf.style.animation.Property.ANIMATION_PLAY_STATE, playStates);

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
  var delays = [];
  /** @type {!Array.<string>} */
  var directions = [];
  /** @type {!Array.<string>} */
  var durations = [];
  /** @type {!Array.<number|string>} */
  var iterationCounts = [];
  /** @type {!Array.<string>} */
  var names = [];
  /** @type {!Array.<string>} */
  var timingFunctions = [];
  /** @type {!Array.<string>} */
  var playStates = [];

  goog.array.forEach(animations, function(animation) {
    delays.push(animation.delay + 'ms');
    directions.push(animation.direction);
    durations.push(animation.duration + 'ms');
    iterationCounts.push(animation.iterationCount ?
      animation.iterationCount : 'infinite');
    names.push(animation.name);
    timingFunctions.push(
      'cubic-bezier(' + animation.timingFunction.join(',') + ')');
    playStates.push(animation.playState);
  });

  npf.style.animation.setValue_(element, goog.object.create(
    npf.style.animation.Property.ANIMATION_DELAY,           delays,
    npf.style.animation.Property.ANIMATION_DIRECTION,       directions,
    npf.style.animation.Property.ANIMATION_DURATION,        durations,
    npf.style.animation.Property.ANIMATION_ITERATION_COUNT, iterationCounts,
    npf.style.animation.Property.ANIMATION_NAME,            names,
    npf.style.animation.Property.ANIMATION_PLAY_STATE,      playStates,
    npf.style.animation.Property.ANIMATION_TIMING_FUNCTION, timingFunctions
  ));
};

/**
 * @param {Element} element
 * @return {!Array.<npf.style.Animation>}
 */
npf.style.animation.getAnimations = function(element) {
  /** @type {!Array.<npf.style.Animation>} */
  var animations = [];
  var Property = npf.style.animation.Property;
  /** @type {!Array.<string>} */
  var names = npf.style.animation.getValues_(element, Property.ANIMATION_NAME);
  /** @type {number} */
  var i;

  if (names.length) {
    /** @type {!Array.<string>} */
    var strDelays = npf.style.animation.getValues_(element,
      Property.ANIMATION_DELAY);
    /** @type {!Array.<number>} */
    var delays = npf.style.animation.getMilliseconds_(strDelays);
    var directions =
      /** @type {!Array.<npf.style.animation.Direction>} */ (npf.style.animation.getValues_(element,
      Property.ANIMATION_DIRECTION));
    /** @type {!Array.<string>} */
    var strDurations = npf.style.animation.getValues_(element,
      Property.ANIMATION_DURATION);
    /** @type {!Array.<number>} */
    var durations = npf.style.animation.getMilliseconds_(strDurations);
    /** @type {!Array.<string>} */
    var strIterationCounts = npf.style.animation.getValues_(element,
      Property.ANIMATION_ITERATION_COUNT);
    /** @type {!Array.<number>} */
    var iterationCounts = [];
    var playStates =
      /** @type {!Array.<npf.style.animation.PlayState>} */ (npf.style.animation.getValues_(element,
      Property.ANIMATION_PLAY_STATE));
    /** @type {!Array.<string>} */
    var strTimingFunctions = npf.style.animation.getValues_(element,
      Property.ANIMATION_TIMING_FUNCTION, function(value) {
        var reg = /cubic\-bezier\((?:[\d,\.]*)\)|[\w\-]+/g;
        /** @type {Array.<string>} */
        var values = reg.exec(value);
        /** @type {!Array.<string>} */
        var result = [];

        while (values && values[0]) {
          result.push(values[0]);
          values = reg.exec(value);
        }

        return result;
      });
    /** @type {!Array.<Array.<number>>} */
    var timingFunctions = [];

    goog.array.forEach(strIterationCounts, function(strCount) {
      iterationCounts.push(
        'infinite' == strCount ? 0 : goog.string.toNumber(strCount));
    });

    goog.array.forEach(strTimingFunctions, function(strFunction) {
      /** @type {!Array.<string>} */
      var strParts = strFunction.split(',');
      /** @type {!Array.<number>} */
      var parts = [];

      goog.array.forEach(strParts, function(strValue) {
        parts.push(goog.string.toNumber(strValue));
      });
      timingFunctions.push(parts);
    });

    delays = npf.style.animation.normalizeValues_(delays, names.length, 0);
    directions = npf.style.animation.normalizeValues_(directions, names.length,
      npf.style.animation.Direction.NORMAL);
    durations = npf.style.animation.normalizeValues_(durations, names.length, 0);
    iterationCounts = npf.style.animation.normalizeValues_(iterationCounts,
      names.length, 1);
    playStates = npf.style.animation.normalizeValues_(playStates, names.length,
      npf.style.animation.PlayState.PAUSED);
    timingFunctions = npf.style.animation.normalizeValues_(timingFunctions,
      names.length, npf.fx.css3.easing.LINEAR);

    goog.array.forEach(names, function(name, index) {
      animations.push({
        name: name,
        delay: delays[index],
        direction: directions[index],
        duration: durations[index],
        iterationCount: iterationCounts[index],
        playState: playStates[index],
        timingFunction: timingFunctions[index]
      });
    });
  }

  return animations;
};

/**
 * @param {!Array.<string>} values
 * @return {!Array.<number>}
 * @private
 */
npf.style.animation.getMilliseconds_ = function(values) {
  var msRegExp = /[\.\d]+ms/;
  var sRegExp = /[\.\d]+s/;
  /** @type {!Array.<number>} */
  var result = [];

  goog.array.forEach(values, function(value) {
    if (msRegExp.test(value)) {
      result.push(
        goog.string.toNumber(value.substr(0, value.length - 2)));
    } else if (sRegExp.test(value)) {
      result.push(
        1000 * goog.string.toNumber(value.substr(0, value.length - 1)));
    } else {
      result.push(0);
    }
  });

  return result;
};

/**
 * @param {Element} element
 * @param {string|Object.<string,Array.<string>>} key
 * @param {Array.<string>=} opt_value
 * @private
 */
npf.style.animation.setValue_ = function(element, key, opt_value) {
  /** @type {Object.<string,Array.<string>>} */
  var values;

  if (goog.isString(key)) {
    values = goog.object.create(key, /** @type {Array.<string>} */ (opt_value));
  } else {
    values = /** @type {Object.<string,Array.<string>>} */ (key);
  }

  goog.object.forEach(values, function(value, key) {
    /** @type {string} */
    var style = npf.userAgent.support.getCssPropertyName(key);
    goog.style.setStyle(element, style, value.join(','));
  });
};

/**
 * @param {Element} element
 * @param {string} style
 * @param {(function(string):!Array.<string>)=} opt_splitFunc
 * @return {!Array.<string>}
 * @private
 */
npf.style.animation.getValues_ = function(element, style, opt_splitFunc) {
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

  if (!value || 'none' == value || '' == value) {
    return [];
  }

  /** @type {function(string):!Array.<string>} */
  var splitFunc = opt_splitFunc || npf.style.animation.defaultSplitFunc_;

  return splitFunc(value.replace(/\s/g, ''));
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

/**
 * @param {string} value
 * @return {!Array.<string>}
 * @private
 */
npf.style.animation.defaultSplitFunc_ = function(value) {
  return value.split(',');
};

/**
 * @param {!Array} values
 * @param {number} count
 * @param {*} defaultValue
 * @return {!Array}
 * @private
 */
npf.style.animation.normalizeValues_ = function(values, count, defaultValue) {
  if (values.length > count) {
    values = goog.array.slice(values, 0, count);
  } else if (values.length < count) {
    for (var i = values.length; i < count; i++) {
      values.push(defaultValue);
    }
  }

  return values;
};
