goog.provide('npf.fx.Parallax');
goog.provide('npf.fx.Parallax.Event');
goog.provide('npf.fx.Parallax.EventType');

goog.require('goog.dom');
goog.require('goog.events');
goog.require('goog.events.Event');
goog.require('goog.events.EventTarget');
goog.require('goog.events.EventType');
goog.require('goog.math');


/**
 * @param {number=} opt_maxPosition
 * @param {number=} opt_position
 * @param {goog.dom.DomHelper=} opt_domHelper
 * @constructor
 * @struct
 * @extends {goog.events.EventTarget}
 */
npf.fx.Parallax = function(opt_maxPosition, opt_position, opt_domHelper) {
  npf.fx.Parallax.base(this, 'constructor');

  /**
   * @private {boolean}
   */
  this.documentMonitoring_ = false;

  /**
   * @private {goog.dom.DomHelper}
   */
  this.domHelper_ = opt_domHelper || goog.dom.getDomHelper();

  /**
   * @private {number}
   */
  this.maxPosition_ = Math.max(opt_maxPosition || 0, 0);

  /**
   * @private {number}
   */
  this.position_ = goog.math.clamp(opt_position || 0, 0, this.maxPosition_);
};
goog.inherits(npf.fx.Parallax, goog.events.EventTarget);


/**
 * @enum {string}
 */
npf.fx.Parallax.EventType = {

  /**
   * npf.fx.Parallax.Event
   */
  UPDATE: goog.events.getUniqueId('update')
};


/** @inheritDoc */
npf.fx.Parallax.prototype.disposeInternal = function() {
  this.setDocumentMonitoring(false);

  npf.fx.Parallax.base(this, 'disposeInternal');

  this.domHelper_ = null;
};

npf.fx.Parallax.prototype.update = function() {
  /** @type {number} */
  var maxScroll = this.getMaxScrollInternal();
  /** @type {number} */
  var scroll = this.getScrollInternal();
  this.setMaxPosition(maxScroll);
  this.setPosition(scroll);
};

/**
 * @return {boolean}
 */
npf.fx.Parallax.prototype.isDocumentMonitoring = function() {
  return this.documentMonitoring_;
};

/**
 * @param {boolean} enable
 */
npf.fx.Parallax.prototype.setDocumentMonitoring = function(enable) {
  if (this.documentMonitoring_ != enable) {
    this.documentMonitoring_ = enable;

    var EventType = goog.events.EventType;

    if (this.documentMonitoring_) {
      this.update();

      /** @type {!Window} */
      var win = this.domHelper_.getWindow();

      goog.events.listen(win, EventType.LOAD, this.onResize_, false, this);
      goog.events.listen(win, EventType.SCROLL, this.onScroll_, false, this);
      goog.events.listen(win, EventType.RESIZE, this.onResize_, false, this);
    } else {
      goog.events.unlisten(win, EventType.LOAD, this.onResize_, false, this);
      goog.events.unlisten(win, EventType.SCROLL, this.onScroll_, false, this);
      goog.events.unlisten(win, EventType.RESIZE, this.onResize_, false, this);
    }
  }
};

/**
 * @return {goog.dom.DomHelper}
 */
npf.fx.Parallax.prototype.getDomHelper = function() {
  return this.domHelper_;
};

/**
 * @param {goog.dom.DomHelper} domHelper
 */
npf.fx.Parallax.prototype.setDomHelper = function(domHelper) {
  this.domHelper_ = domHelper;
};

/**
 * @return {number}
 */
npf.fx.Parallax.prototype.getMaxPosition = function() {
  return this.maxPosition_;
};

/**
 * @param {number} maxPosition
 */
npf.fx.Parallax.prototype.setMaxPosition = function(maxPosition) {
  this.setOptions(maxPosition, this.getPosition());
};

/**
 * @return {number}
 * @protected
 */
npf.fx.Parallax.prototype.getMaxScrollInternal = function() {
  return this.domHelper_.getDocumentHeight() -
    this.domHelper_.getViewportSize().height;
};

/**
 * @param {number} maxPosition
 * @param {number} position
 */
npf.fx.Parallax.prototype.setOptions = function(maxPosition, position) {
  maxPosition = Math.max(maxPosition, 0);
  position = goog.math.clamp(position, 0, maxPosition);

  if (this.getPosition() != position || this.getMaxPosition() != maxPosition) {
    this.setOptionsInternal(maxPosition, position);
    this.onUpdate();
  }
};

/**
 * @param {number} maxPosition
 * @param {number} position
 * @protected
 */
npf.fx.Parallax.prototype.setOptionsInternal = function(maxPosition, position) {
  this.position_ = position;
  this.maxPosition_ = maxPosition;
};

/**
 * @return {number}
 */
npf.fx.Parallax.prototype.getPosition = function() {
  return this.position_;
};

/**
 * @param {number} position
 */
npf.fx.Parallax.prototype.setPosition = function(position) {
  this.setOptions(this.getMaxPosition(), position);
};

/**
 * @return {number}
 * @protected
 */
npf.fx.Parallax.prototype.getScrollInternal = function() {
  return this.domHelper_.getDocumentScroll().y;
};

/**
 * @return {number}
 */
npf.fx.Parallax.prototype.getValue = function() {
  /** @type {number} */
  var maxPosition = this.getMaxPosition();

  return maxPosition ? this.getPosition() / maxPosition : 0;
};

/**
 * @param {goog.events.BrowserEvent} evt
 * @private
 */
npf.fx.Parallax.prototype.onResize_ = function(evt) {
  /** @type {number} */
  var maxScroll = this.getMaxScrollInternal();
  this.setMaxPosition(maxScroll);
};

/**
 * @param {goog.events.BrowserEvent} evt
 * @private
 */
npf.fx.Parallax.prototype.onScroll_ = function(evt) {
  /** @type {number} */
  var scroll = this.getScrollInternal();
  this.setPosition(scroll);
};

/**
 * @protected
 */
npf.fx.Parallax.prototype.onUpdate = function() {
  var event = new npf.fx.Parallax.Event(
    npf.fx.Parallax.EventType.UPDATE,
    this.getMaxPosition(), this.getPosition(), this.getValue()
  );
  this.dispatchEvent(event);
};


/**
 * @param {npf.fx.Parallax.EventType} type
 * @param {number} maxPosition
 * @param {number} position
 * @param {number} value
 * @constructor
 * @struct
 * @extends {goog.events.Event}
 */
npf.fx.Parallax.Event = function(type, maxPosition, position, value) {
  npf.fx.Parallax.Event.base(this, 'constructor', type);

  /**
   * @type {number}
   */
  this.maxPosition = maxPosition;

  /**
   * @type {number}
   */
  this.position = position;

  /**
   * @type {number}
   */
  this.value = value;
};
goog.inherits(npf.fx.Parallax.Event, goog.events.Event);
