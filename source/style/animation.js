goog.provide('npf.style.animation');
goog.provide('npf.style.animation.Direction');
goog.provide('npf.style.animation.PlayState');
goog.provide('npf.style.animation.Property');

goog.require('goog.array');
goog.require('goog.style');
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
 * @param {Element} element
 * @return {!Array.<string>}
 */
npf.style.animation.getNames = function(element) {
  return npf.style.animation.getValues_(element,
    npf.style.animation.Property.ANIMATION_NAME);
};

/**
 * @param {Element} element
 * @param {string} name
 * @param {number=} opt_index Default is 0.
 */
npf.style.animation.insertName = function(element, name, opt_index) {
  /** @type {!Array.<string>} */
  var values = npf.style.animation.getNames(element);
  npf.style.animation.insertValue(element,
    npf.style.animation.Property.ANIMATION_NAME, values, name, '__fake',
    opt_index);
};

/**
 * @param {Element} element
 * @param {string} name
 * @param {number=} opt_index Default is 0.
 */
npf.style.animation.setName = function(element, name, opt_index) {
  /** @type {!Array.<string>} */
  var values = npf.style.animation.getNames(element);
  npf.style.animation.setValue(element,
    npf.style.animation.Property.ANIMATION_NAME, values, name, '__fake',
    opt_index);
};

/**
 * @param {Element} element
 * @param {string} name
 * @return {boolean}
 */
npf.style.animation.removeName = function(element, name) {
  /** @type {!Array.<string>} */
  var values = npf.style.animation.getNames(element);
  /** @type {boolean} */
  var removed = goog.array.remove(values, name);

  if (removed) {
    npf.style.animation.setValue_(element,
      npf.style.animation.Property.ANIMATION_NAME, values);
  }

  return removed;
};

/**
 * @param {Element} element
 * @param {number} index
 * @return {boolean}
 */
npf.style.animation.removeNameAt = function(element, index) {
  /** @type {!Array.<string>} */
  var values = npf.style.animation.getNames(element);

  return npf.style.animation.removeValueAt(element,
    npf.style.animation.Property.ANIMATION_NAME, values, index);
};

/**
 * @param {Element} element
 * @return {!Array.<string>}
 */
npf.style.animation.getDelays = function(element) {
  return npf.style.animation.getValues_(element,
    npf.style.animation.Property.ANIMATION_DELAY);
};

/**
 * @param {Element} element
 * @param {number} delay
 * @param {number=} opt_index Default is 0.
 */
npf.style.animation.insertDelay = function(element, delay, opt_index) {
  /** @type {!Array.<string>} */
  var values = npf.style.animation.getDelays(element);
  npf.style.animation.insertValue(element,
    npf.style.animation.Property.ANIMATION_DELAY, values, delay, 0, opt_index);
};

/**
 * @param {Element} element
 * @param {number} delay
 * @param {number=} opt_index Default is 0.
 */
npf.style.animation.setDelay = function(element, delay, opt_index) {
  /** @type {!Array.<string>} */
  var values = npf.style.animation.getDelays(element);
  npf.style.animation.setValue(element,
    npf.style.animation.Property.ANIMATION_DELAY, values, delay, 0, opt_index);
};

/**
 * @param {Element} element
 * @param {number} index
 * @return {boolean}
 */
npf.style.animation.removeDelayAt = function(element, index) {
  /** @type {!Array.<string>} */
  var values = npf.style.animation.getDelays(element);

  return npf.style.animation.removeValueAt(element,
    npf.style.animation.Property.ANIMATION_DELAY, values, index);
};

/**
 * @param {Element} element
 * @return {!Array.<npf.style.animation.Direction>}
 */
npf.style.animation.getDirections = function(element) {
  return npf.style.animation.getValues_(element,
    npf.style.animation.Property.ANIMATION_DIRECTION);
};

/**
 * @param {Element} element
 * @param {npf.style.animation.Direction} direction
 * @param {number=} opt_index Default is 0.
 */
npf.style.animation.insertDirection = function(element, direction, opt_index) {
  /** @type {!Array.<npf.style.animation.Direction>} */
  var values = npf.style.animation.getDirections(element);
  npf.style.animation.insertValue(element,
    npf.style.animation.Property.ANIMATION_DIRECTION, values, direction,
    npf.style.animation.Direction.NORMAL, opt_index);
};

/**
 * @param {Element} element
 * @param {npf.style.animation.Direction} direction
 * @param {number=} opt_index Default is 0.
 */
npf.style.animation.setDirection = function(element, direction, opt_index) {
  /** @type {!Array.<npf.style.animation.Direction>} */
  var values = npf.style.animation.getDirections(element);
  npf.style.animation.setValue(element,
    npf.style.animation.Property.ANIMATION_DIRECTION, values, direction,
    npf.style.animation.Direction.NORMAL, opt_index);
};

/**
 * @param {Element} element
 * @param {number} index
 * @return {boolean}
 */
npf.style.animation.removeDirectionAt = function(element, index) {
  /** @type {!Array.<npf.style.animation.Direction>} */
  var values = npf.style.animation.getDirections(element);

  return npf.style.animation.removeValueAt(element,
    npf.style.animation.Property.ANIMATION_DIRECTION, values, index);
};

/**
 * @param {Element} element
 * @return {!Array.<string>}
 */
npf.style.animation.getDurations = function(element) {
  return npf.style.animation.getValues_(element,
    npf.style.animation.Property.ANIMATION_DURATION);
};

/**
 * @param {Element} element
 * @param {number} duration
 * @param {number=} opt_index Default is 0.
 */
npf.style.animation.insertDuration = function(element, duration, opt_index) {
  /** @type {!Array.<string>} */
  var values = npf.style.animation.getDurations(element);
  npf.style.animation.insertValue(element,
    npf.style.animation.Property.ANIMATION_DURATION, values, duration + 'ms',
    0, opt_index);
};

/**
 * @param {Element} element
 * @param {number} duration
 * @param {number=} opt_index Default is 0.
 */
npf.style.animation.setDuration = function(element, duration, opt_index) {
  /** @type {!Array.<string>} */
  var values = npf.style.animation.getDurations(element);
  npf.style.animation.setValue(element,
    npf.style.animation.Property.ANIMATION_DURATION, values, duration + 'ms', 0,
    opt_index);
};

/**
 * @param {Element} element
 * @param {number} index
 * @return {boolean}
 */
npf.style.animation.removeDurationAt = function(element, index) {
  /** @type {!Array.<string>} */
  var values = npf.style.animation.getDurations(element);

  return npf.style.animation.removeValueAt(element,
    npf.style.animation.Property.ANIMATION_DURATION, values, index);
};

/**
 * @param {Element} element
 * @return {!Array.<string>}
 */
npf.style.animation.getIterationCounts = function(element) {
  return npf.style.animation.getValues_(element,
    npf.style.animation.Property.ANIMATION_ITERATION_COUNT);
};

/**
 * @param {Element} element
 * @param {number} count
 * @param {number=} opt_index Default is 0.
 */
npf.style.animation.insertIterationCount = function(element, count, opt_index) {
  var iterationCount = count ? count + '' : 'infinite';
  /** @type {!Array.<string>} */
  var values = npf.style.animation.getIterationCounts(element);
  npf.style.animation.insertValue(element,
    npf.style.animation.Property.ANIMATION_ITERATION_COUNT, values,
    iterationCount, 1, opt_index);
};

/**
 * @param {Element} element
 * @param {number} count
 * @param {number=} opt_index Default is 0.
 */
npf.style.animation.setIterationCount = function(element, count, opt_index) {
  var iterationCount = count ? count + '' : 'infinite';
  /** @type {!Array.<string>} */
  var values = npf.style.animation.getIterationCounts(element);
  npf.style.animation.setValue(element,
    npf.style.animation.Property.ANIMATION_ITERATION_COUNT, values,
    iterationCount, 1, opt_index);
};

/**
 * @param {Element} element
 * @param {number} index
 * @return {boolean}
 */
npf.style.animation.removeIterationCountAt = function(element, index) {
  /** @type {!Array.<string>} */
  var values = npf.style.animation.getIterationCounts(element);

  return npf.style.animation.removeValueAt(element,
    npf.style.animation.Property.ANIMATION_ITERATION_COUNT, values, index);
};

/**
 * @param {Element} element
 * @return {!Array.<npf.style.animation.PlayState>}
 */
npf.style.animation.getPlayStates = function(element) {
  return npf.style.animation.getValues_(element,
    npf.style.animation.Property.ANIMATION_PLAY_STATE);
};

/**
 * @param {Element} element
 * @param {npf.style.animation.PlayState} state
 * @param {number=} opt_index Default is 0.
 */
npf.style.animation.insertPlayState = function(element, state, opt_index) {
  /** @type {!Array.<npf.style.animation.PlayState>} */
  var values = npf.style.animation.getPlayStates(element);
  npf.style.animation.insertValue(element,
    npf.style.animation.Property.ANIMATION_PLAY_STATE, values, state,
    npf.style.animation.PlayState.PAUSED, opt_index);
};

/**
 * @param {Element} element
 * @param {npf.style.animation.PlayState} state
 * @param {number=} opt_index Default is 0.
 */
npf.style.animation.setPlayState = function(element, state, opt_index) {
  /** @type {!Array.<npf.style.animation.PlayState>} */
  var values = npf.style.animation.getPlayStates(element);
  npf.style.animation.setValue(element,
    npf.style.animation.Property.ANIMATION_PLAY_STATE, values, state,
    npf.style.animation.PlayState.PAUSED, opt_index);
};

/**
 * @param {Element} element
 * @param {number} index
 * @return {boolean}
 */
npf.style.animation.removePlayStateAt = function(element, index) {
  /** @type {!Array.<npf.style.animation.PlayState>} */
  var values = npf.style.animation.getPlayStates(element);

  return npf.style.animation.removeValueAt(element,
    npf.style.animation.Property.ANIMATION_PLAY_STATE, values, index);
};

/**
 * @param {Element} element
 * @return {!Array.<string>}
 */
npf.style.animation.getTimingFunctions = function(element) {
  var key = npf.style.animation.Property.ANIMATION_TIMING_FUNCTION;

  return npf.style.animation.getValues_(element, key, function(value) {
    var reg = /cubic\-bezier\((?:[\d,\.]*)\)|[\w\-]+/g;
    /** @type {Array.<string>} */
    var values = reg.exec(value);
    /** @type {!Array.<string>} */
    var result = [];

    while (values && values[0]) {
      result.push(value[0]);
      values = reg.exec(value);
    }

    return result;
  });
};

/**
 * @param {Element} element
 * @param {Array.<string>} func
 * @param {number=} opt_index Default is 0.
 */
npf.style.animation.insertTimingFunction = function(element, func, opt_index) {
  var accel = 'cubic-bezier(' + func.join(',') + ')';
  /** @type {!Array.<string>} */
  var values = npf.style.animation.getTimingFunctions(element);
  npf.style.animation.insertValue(element,
    npf.style.animation.Property.ANIMATION_TIMING_FUNCTION, values, accel,
    'linear', opt_index);
};

/**
 * @param {Element} element
 * @param {Array.<string>} func
 * @param {number=} opt_index Default is 0.
 */
npf.style.animation.setTimingFunction = function(element, func, opt_index) {
  var accel = 'cubic-bezier(' + func.join(',') + ')';
  /** @type {!Array.<string>} */
  var values = npf.style.animation.getTimingFunctions(element);
  npf.style.animation.setValue(element,
    npf.style.animation.Property.ANIMATION_TIMING_FUNCTION, values, accel,
    'linear', opt_index);
};

/**
 * @param {Element} element
 * @param {number} index
 * @return {boolean}
 */
npf.style.animation.removeTimingFunctionAt = function(element, index) {
  /** @type {!Array.<string>} */
  var values = npf.style.animation.getTimingFunctions(element);

  return npf.style.animation.removeValueAt(element,
    npf.style.animation.Property.ANIMATION_TIMING_FUNCTION, values, index);
};

/**
 * @param {Element} element
 * @param {string} key
 * @param {!Array.<string>} values
 * @param {string|number} value
 * @param {string|number} defaultValue
 * @param {number=} opt_index Default is 0.
 */
npf.style.animation.insertValue = function(element, key, values, value,
                                           defaultValue, opt_index) {
  /** @type {number} */
  var index = opt_index || 0;

  values = npf.style.animation.normalizeValues_(values, index, defaultValue);
  goog.array.insertAt(values, value, index);

  npf.style.animation.setValue_(element, key, values);
};

/**
 * @param {Element} element
 * @param {string} key
 * @param {!Array.<string>} values
 * @param {string|number} value
 * @param {string|number} defaultValue
 * @param {number=} opt_index Default is 0.
 */
npf.style.animation.setValue = function(element, key, values, value,
                                        defaultValue, opt_index) {
  /** @type {number} */
  var index = opt_index || 0;

  values = npf.style.animation.normalizeValues_(values, index + 1,
    defaultValue);
  values[index] = value + '';

  npf.style.animation.setValue_(element, key, values);
};

/**
 * @param {Element} element
 * @param {string} key
 * @param {Array.<string>} values
 * @param {number} index
 * @return {boolean}
 */
npf.style.animation.removeValueAt = function(element, key, values, index) {
  /** @type {boolean} */
  var removed = goog.array.removeAt(values, index);

  if (removed) {
    npf.style.animation.setValue_(element, key, values);
  }

  return removed;
};

/**
 * @param {Element} element
 * @param {string} key
 * @param {Array.<string>} values
 * @private
 */
npf.style.animation.setValue_ = function(element, key, values) {
  /** @type {string} */
  var style = npf.userAgent.support.getCssPropertyName(key);

  goog.style.setStyle(element, style, values.join(','));
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

  if (!value || 'none' == value) {
    value = '';
  }

  if ('' == value) {
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
 * @param {!Array.<string>} values
 * @param {number} count
 * @param {number|string} defaultValue
 * @return {!Array.<string>}
 * @private
 */
npf.style.animation.normalizeValues_ = function(values, count, defaultValue) {
  for (var i = values.length; i < count; i++) {
    values.push(defaultValue + '');
  }

  return values;
};
