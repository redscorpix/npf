goog.provide('npf.fx.parallax.Layer');
goog.provide('npf.fx.parallax.Layer.Event');
goog.provide('npf.fx.parallax.Layer.EventType');

goog.require('goog.array');
goog.require('goog.events');
goog.require('goog.events.Event');
goog.require('goog.events.EventTarget');
goog.require('goog.math');


/**
 * @param {npf.fx.Parallax} viewport
 * @constructor
 * @extends {goog.events.EventTarget}
 */
npf.fx.parallax.Layer = function(viewport) {
  goog.base(this);

  this.end_ = [];
  this.start_ = [];

  this.viewport_ = viewport;
  this.viewport_.listen(
    npf.fx.Parallax.EventType.UPDATE, this.onUpdate_, false, this);
};
goog.inherits(npf.fx.parallax.Layer, goog.events.EventTarget);


/**
 * @enum {string}
 */
npf.fx.parallax.Layer.EventType = {

  /**
   * npf.fx.parallax.Layer.Event
   */
  UPDATE: goog.events.getUniqueId('update')
};


/**
 * @private {Array.<number>}
 */
npf.fx.parallax.Layer.prototype.end_;

/**
 * @private {number}
 */
npf.fx.parallax.Layer.prototype.maxPosition_ = 0;

/**
 * @private {number}
 */
npf.fx.parallax.Layer.prototype.minPosition_ = 0;

/**
 * @private {number}
 */
npf.fx.parallax.Layer.prototype.position_ = 0;

/**
 * @private {Array.<number>}
 */
npf.fx.parallax.Layer.prototype.start_;

/**
 * @private {npf.fx.Parallax}
 */
npf.fx.parallax.Layer.prototype.viewport_;


/** @inheritDoc */
npf.fx.parallax.Layer.prototype.disposeInternal = function() {
  this.viewport_.unlisten(
    npf.fx.Parallax.EventType.UPDATE, this.onUpdate_, false, this);

  goog.base(this, 'disposeInternal');

  this.end_ = null;
  this.start_ = null;
  this.viewport_ = null;
};

/**
 * @return {!Array.<number>}
 */
npf.fx.parallax.Layer.prototype.getCoords = function() {
  /** @type {number} */
  var value = this.getValue();
  /** @type {!Array.<number>} */
  var coords = [];

  for (var i = 0; i < this.start_.length; i++) {
    coords.push(this.start_[i] + (this.end_[i] - this.start_[i]) * value);
  }

  return coords;
};

/**
 * @return {Array.<number>}
 */
npf.fx.parallax.Layer.prototype.getStartCoordinates = function() {
  return this.start_;
};

/**
 * @return {Array.<number>}
 */
npf.fx.parallax.Layer.prototype.getEndCoordinates = function() {
  return this.end_;
};

/**
 * @param {Array.<number>} start
 * @param {Array.<number>} end
 */
npf.fx.parallax.Layer.prototype.setCoordinateRange = function(start, end) {
  if (!goog.isArray(start) || !goog.isArray(end)) {
    throw Error('Start and end parameters must be arrays');
  }

  if (start.length != end.length) {
    throw Error('Start and end points must be the same length');
  }

  this.start_ = start;
  this.end_ = end;

  this.dispatchUpdateEvent();
};

/**
 * @return {number}
 */
npf.fx.parallax.Layer.prototype.getMaxPosition = function() {
  return this.maxPosition_;
};

/**
 * @param {number} max
 */
npf.fx.parallax.Layer.prototype.setMaxPosition = function(max) {
  this.setRange(this.getMinPosition(), max);
};

/**
 * @return {number}
 */
npf.fx.parallax.Layer.prototype.getMinPosition = function() {
  return this.minPosition_;
};

/**
 * @param {number} min
 */
npf.fx.parallax.Layer.prototype.setMinPosition = function(min) {
  this.setRange(min, this.getMaxPosition());
};

/**
 * @param {number} min
 * @param {number} max
 * @param {number} position
 */
npf.fx.parallax.Layer.prototype.setOptions = function(min, max, position) {
  /** @type {number} */
  var maxViewportPosition = this.viewport_.getMaxPosition();
  min = goog.math.clamp(min, 0, maxViewportPosition);
  max = goog.math.clamp(max, min, maxViewportPosition);
  position = goog.math.clamp(position, min, max);

  if (!(
    this.getMaxPosition() == max &&
    this.getMinPosition() == min &&
    this.getPosition() == position
  )) {
    this.setOptionsInternal(min, max, position);
    this.dispatchUpdateEvent();
  }
};

/**
 * @param {number} min
 * @param {number} max
 * @param {number} position
 * @protected
 */
npf.fx.parallax.Layer.prototype.setOptionsInternal = function(min, max,
    position) {
  this.maxPosition_ = max;
  this.minPosition_ = min;
  this.position_ = position;
};

/**
 * @return {number}
 */
npf.fx.parallax.Layer.prototype.getPosition = function() {
  return this.position_;
};

/**
 * @param {number} position
 */
npf.fx.parallax.Layer.prototype.setPosition = function(position) {
  this.setOptions(this.getMinPosition(), this.getMaxPosition(), position);
};

/**
 * @param {number} min
 * @param {number} max
 */
npf.fx.parallax.Layer.prototype.setRange = function(min, max) {
  this.setOptions(min, max, this.getPosition());
};

/**
 * @return {number}
 */
npf.fx.parallax.Layer.prototype.getValue = function() {
  /** @type {number} */
  var minPosition = this.getMinPosition();
  /** @type {number} */
  var p = this.getMaxPosition() - minPosition;

  return 0 < p ? (this.getPosition() - minPosition) / p : 0;
};

/**
 * @param {number} value
 */
npf.fx.parallax.Layer.prototype.setValue = function(value) {
  /** @type {number} */
  var maxPosition = this.getMaxPosition();
  /** @type {number} */
  var minPosition = this.getMinPosition();
  /** @type {number} */
  var position = Math.round(
    minPosition + (value * (maxPosition - minPosition)));

  this.setPosition(position);
};

/**
 * @return {npf.fx.Parallax}
 */
npf.fx.parallax.Layer.prototype.getViewport = function() {
  return this.viewport_;
};

/**
 * @param {goog.events.Event} evt
 * @private
 */
npf.fx.parallax.Layer.prototype.onUpdate_ = function(evt) {
  var position = /** @type {number} */ (evt.position);
  this.setOptions(this.getMinPosition(), this.getMaxPosition(), position);
};

/**
 * @protected
 */
npf.fx.parallax.Layer.prototype.dispatchUpdateEvent = function() {
  var event = new npf.fx.parallax.Layer.Event(
    npf.fx.parallax.Layer.EventType.UPDATE,
    this.getCoords(), this.getPosition(), this.getValue()
  );
  this.dispatchEvent(event);
};


/**
 * @param {npf.fx.parallax.Layer.EventType} type
 * @param {Array.<number>} coords
 * @param {number} position
 * @param {number} value
 * @constructor
 * @extends {goog.events.Event}
 */
npf.fx.parallax.Layer.Event = function(type, coords, position, value) {
  goog.base(this, type);

  /**
   * @type {Array.<number>}
   */
  this.coords = coords;

  /**
   * @type {number}
   */
  this.position = position;

  /**
   * @type {number}
   */
  this.value = value;
};
goog.inherits(npf.fx.parallax.Layer.Event, goog.events.Event);
