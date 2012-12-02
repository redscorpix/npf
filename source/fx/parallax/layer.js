goog.provide('npf.fx.parallax.Layer');

goog.require('goog.array');
goog.require('goog.events');
goog.require('goog.events.EventTarget');
goog.require('goog.math');


/**
 * @param {npf.fx.Parallax} viewport
 * @constructor
 * @extends {goog.events.EventTarget}
 */
npf.fx.parallax.Layer = function(viewport) {
  goog.base(this);

  this._viewport = viewport;
  this._start = [];
  this._end = [];

  goog.events.listen(this._viewport, npf.fx.Parallax.EventType.UPDATE,
    this._onUpdate, false, this);
};
goog.inherits(npf.fx.parallax.Layer, goog.events.EventTarget);


/**
 * @enum {string}
 */
npf.fx.parallax.Layer.EventType = {

  /**
   * position (number)
   * value (number)
   * coords (!Array.<number>)
   */
  UPDATE: goog.events.getUniqueId('update')
};

/**
 * @type {npf.fx.Parallax}
 * @private
 */
npf.fx.parallax.Layer.prototype._viewport;

/**
 * @type {Array.<number>}
 * @private
 */
npf.fx.parallax.Layer.prototype._start;

/**
 * @type {Array.<number>}
 * @private
 */
npf.fx.parallax.Layer.prototype._end;

/**
 * @type {number}
 * @private
 */
npf.fx.parallax.Layer.prototype._minPosition = 0;

/**
 * @type {number}
 * @private
 */
npf.fx.parallax.Layer.prototype._maxPosition = 0;

/**
 * @type {number}
 * @private
 */
npf.fx.parallax.Layer.prototype._position = 0;


/** @inheritDoc */
npf.fx.parallax.Layer.prototype.disposeInternal = function() {
  goog.events.unlisten(this._viewport, npf.fx.Parallax.EventType.UPDATE,
    this._onUpdate, false, this);

  goog.base(this, 'disposeInternal');

  this._viewport = null;
  this._start = null;
  this._end = null;
};

/**
 * @return {npf.fx.Parallax}
 */
npf.fx.parallax.Layer.prototype.getViewport = function() {
  return this._viewport;
};

/**
 * @return {!Array.<number>}
 */
npf.fx.parallax.Layer.prototype.getCoords = function() {
  /** @type {number} */
  var value = this.getValue();
  /** @type {!Array.<number>} */
  var coords = [];

  for (var i = 0; i < this._start.length; i++) {
    coords.push(this._start[i] + (this._end[i] - this._start[i]) * value);
  }

  return coords;
};

/**
 * @return {number}
 */
npf.fx.parallax.Layer.prototype.getValue = function() {
  /** @type {number} */
  var p = this._maxPosition - this._minPosition;

  return 0 < p ? (this._position - this._minPosition) / p : 0;
};

/**
 * @param {number} value
 */
npf.fx.parallax.Layer.prototype.setValue = function(value) {
  /** @type {number} */
  var position = Math.round(this._minPosition +
    (value * (this._maxPosition - this._minPosition)));

  this.setPosition(position);
};

/**
 * @return {number}
 */
npf.fx.parallax.Layer.prototype.getPosition = function() {
  return this._position;
};

/**
 * @param {number} position
 */
npf.fx.parallax.Layer.prototype.setPosition = function(position) {
  this.setOptions(this._minPosition, this._maxPosition, position);
};

/**
 * @return {number}
 */
npf.fx.parallax.Layer.prototype.getMaxPosition = function() {
  return this._maxPosition;
};

/**
 * @param {number} max
 */
npf.fx.parallax.Layer.prototype.setMaxPosition = function(max) {
  this.setRange(this._minPosition, max);
};

/**
 * @return {number}
 */
npf.fx.parallax.Layer.prototype.getMinPosition = function() {
  return this._minPosition;
};

/**
 * @param {number} min
 */
npf.fx.parallax.Layer.prototype.setMinPosition = function(min) {
  this.setRange(min, this._maxPosition);
};

/**
 * @param {number} min
 * @param {number} max
 */
npf.fx.parallax.Layer.prototype.setRange = function(min, max) {
  this.setOptions(min, max, this._position);
};

/**
 * @param {number} min
 * @param {number} max
 * @param {number} position
 */
npf.fx.parallax.Layer.prototype.setOptions = function(min, max, position) {
  /** @type {number} */
  var maxViewportPosition = this._viewport.getMaxPosition();
  min = goog.math.clamp(min, 0, maxViewportPosition);
  max = goog.math.clamp(max, min, maxViewportPosition);
  position = goog.math.clamp(position, min, max);

  if (!(
    this._maxPosition == max &&
    this._minPosition == min &&
    this._position == position
  )) {
    this._maxPosition = max;
    this._minPosition = min;
    this._position = position;
    this.setOptionsInternal(
      this._minPosition, this._maxPosition, this._position);
    this.dispatchUpdateEvent();
  }
};

/**
 * @param {number} min
 * @param {number} max
 * @param {number} position
 * @protected
 */
npf.fx.parallax.Layer.prototype.setOptionsInternal = goog.nullFunction;

/**
 * @return {Array.<number>}
 */
npf.fx.parallax.Layer.prototype.getStartCoordinates = function() {
  return /** @type {Array.<number>} */ (goog.array.clone(this._start));
};

/**
 * @return {Array.<number>}
 */
npf.fx.parallax.Layer.prototype.getEndCoordinates = function() {
  return /** @type {Array.<number>} */ (goog.array.clone(this._end));
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

  this._start = start;
  this._end = end;

  this.dispatchUpdateEvent();
};

/**
 * @param {goog.events.Event} evt
 * @private
 */
npf.fx.parallax.Layer.prototype._onUpdate = function(evt) {
  var position = /** @type {number} */ (evt.position);
  this.setOptions(this._minPosition, this._maxPosition, position);
};

/**
 * @protected
 */
npf.fx.parallax.Layer.prototype.dispatchUpdateEvent = function() {
  this.dispatchEvent({
    type: npf.fx.parallax.Layer.EventType.UPDATE,
    position: this.getPosition(),
    value: this.getValue(),
    coords: this.getCoords()
  });
};
