goog.provide('npf.fx.Parallax');

goog.require('goog.dom');
goog.require('goog.events');
goog.require('goog.events.EventTarget');
goog.require('goog.math');


/**
 * @param {number=} opt_maxPosition
 * @param {number=} opt_position
 * @constructor
 * @extends {goog.events.EventTarget}
 */
npf.fx.Parallax = function(opt_maxPosition, opt_position) {
  goog.base(this);

  this._maxPosition = Math.max(opt_maxPosition || 0, 0);
  this._position = goog.math.clamp(opt_position || 0, 0, this._maxPosition);
};
goog.inherits(npf.fx.Parallax, goog.events.EventTarget);


/**
 * @enum {string}
 */
npf.fx.Parallax.EventType = {

  /**
   * position (number)
   * value (number)
   * maxPosition (number)
   */
  UPDATE: goog.events.getUniqueId('update')
};


/**
 * @type {number}
 * @private
 */
npf.fx.Parallax.prototype._maxPosition;

/**
 * @type {number}
 * @private
 */
npf.fx.Parallax.prototype._position;

/**
 * @type {boolean}
 * @private
 */
npf.fx.Parallax.prototype._documentMonitoring = false;


/** @inheritDoc */
npf.fx.Parallax.prototype.disposeInternal = function() {
  this.setDocumentMonitoring(false);

  goog.base(this, 'disposeInternal');
};

/**
 * @return {number}
 */
npf.fx.Parallax.prototype.getValue = function() {
  return this._maxPosition ?  this._position / this._maxPosition : 0;
};

/**
 * @return {number}
 */
npf.fx.Parallax.prototype.getMaxPosition = function() {
  return this._maxPosition;
};

/**
 * @param {number} maxPosition
 */
npf.fx.Parallax.prototype.setMaxPosition = function(maxPosition) {
  this.setOptions(maxPosition, this._position);
};

/**
 * @return {number}
 */
npf.fx.Parallax.prototype.getPosition = function() {
  return this._position;
};

/**
 * @param {number} position
 */
npf.fx.Parallax.prototype.setPosition = function(position) {
  this.setOptions(this._maxPosition, position);
};

/**
 * @param {number} maxPosition
 * @param {number} position
 */
npf.fx.Parallax.prototype.setOptions = function(maxPosition, position) {
  maxPosition = Math.max(maxPosition, 0);
  position = goog.math.clamp(position, 0, maxPosition);

  if (!(this._position == position && this._maxPosition == maxPosition)) {
    this._position = position;
    this._maxPosition = maxPosition;
    this.setOptionsInternal(this._maxPosition, this._position);
    this.dispatchEvent({
      type: npf.fx.Parallax.EventType.UPDATE,
      position: this.getPosition(),
      maxPosition: this.getMaxPosition(),
      value: this.getValue()
    });
  }
};

npf.fx.Parallax.prototype.updateToDocument = function() {
  /** @type {number} */
  var maxScroll = this.getMaxScrollInternal();
  /** @type {number} */
  var scroll = this.getScrollInternal();
  this.setMaxPosition(maxScroll);
  this.setPosition(scroll);
};

/**
 * @param {number} maxPosition
 * @param {number} position
 * @protected
 */
npf.fx.Parallax.prototype.setOptionsInternal = goog.nullFunction;

/**
 * @return {boolean}
 */
npf.fx.Parallax.prototype.isDocumentMonitoring = function() {
  return this._documentMonitoring;
};

/**
 * @param {boolean} enable
 */
npf.fx.Parallax.prototype.setDocumentMonitoring = function(enable) {
  if (this._documentMonitoring != enable) {
    this._documentMonitoring = enable;

    var EventType = goog.events.EventType;

    if (this._documentMonitoring) {
      this.updateToDocument();

      goog.events.listen(window, EventType.SCROLL, this._onScroll, false, this);
      goog.events.listen(window, EventType.RESIZE, this._onResize, false, this);
    } else {
      goog.events.unlisten(
        window, EventType.SCROLL, this._onScroll, false, this);
      goog.events.unlisten(
        window, EventType.RESIZE, this._onResize, false, this);
    }
  }
};

/**
 * @param {goog.events.BrowserEvent} evt
 * @private
 */
npf.fx.Parallax.prototype._onScroll = function(evt) {
  /** @type {number} */
  var scroll = this.getScrollInternal();
  this.setPosition(scroll);
};

/**
 * @param {goog.events.BrowserEvent} evt
 * @private
 */
npf.fx.Parallax.prototype._onResize = function(evt) {
  /** @type {number} */
  var maxScroll = this.getMaxScrollInternal();
  this.setMaxPosition(maxScroll);
};

/**
 * @return {number}
 * @protected
 */
npf.fx.Parallax.prototype.getMaxScrollInternal = function() {
  return goog.dom.getDocumentHeight() - goog.dom.getViewportSize().height;
};

/**
 * @return {number}
 * @protected
 */
npf.fx.Parallax.prototype.getScrollInternal = function() {
  return goog.dom.getDocumentScroll().y;
};
