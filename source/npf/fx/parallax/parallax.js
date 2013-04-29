goog.provide('npf.fx.Parallax');

goog.require('goog.dom');
goog.require('goog.events');
goog.require('goog.events.EventTarget');
goog.require('goog.math');


/**
 * @param {number=} opt_maxPosition
 * @param {number=} opt_position
 * @param {goog.dom.DomHelper=} opt_domHelper
 * @constructor
 * @extends {goog.events.EventTarget}
 */
npf.fx.Parallax = function(opt_maxPosition, opt_position, opt_domHelper) {
  goog.base(this);

  this.maxPosition_ = Math.max(opt_maxPosition || 0, 0);
  this.position_ = goog.math.clamp(opt_position || 0, 0, this.maxPosition_);
  this.domHelper_ = opt_domHelper || goog.dom.getDomHelper();
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
npf.fx.Parallax.prototype.maxPosition_;

/**
 * @type {number}
 * @private
 */
npf.fx.Parallax.prototype.position_;

/**
 * @type {goog.dom.DomHelper}
 * @private
 */
npf.fx.Parallax.prototype.domHelper_;

/**
 * @type {boolean}
 * @private
 */
npf.fx.Parallax.prototype.documentMonitoring_ = false;


/** @inheritDoc */
npf.fx.Parallax.prototype.disposeInternal = function() {
  this.setDocumentMonitoring(false);

  goog.base(this, 'disposeInternal');

  this.domHelper_;
};

/**
 * @return {number}
 */
npf.fx.Parallax.prototype.getValue = function() {
  return this.maxPosition_ ?  this.position_ / this.maxPosition_ : 0;
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
  this.setOptions(maxPosition, this.position_);
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
  this.setOptions(this.maxPosition_, position);
};

/**
 * @param {number} maxPosition
 * @param {number} position
 */
npf.fx.Parallax.prototype.setOptions = function(maxPosition, position) {
  maxPosition = Math.max(maxPosition, 0);
  position = goog.math.clamp(position, 0, maxPosition);

  if (!(this.position_ == position && this.maxPosition_ == maxPosition)) {
    this.position_ = position;
    this.maxPosition_ = maxPosition;
    this.setOptionsInternal(this.maxPosition_, this.position_);
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
      this.updateToDocument();

      /** @type {!Window} */
      var win = this.domHelper_.getWindow();

      goog.events.listen(win, EventType.SCROLL, this.onScroll_, false, this);
      goog.events.listen(win, EventType.RESIZE, this.onResize_, false, this);
    } else {
      goog.events.unlisten(win, EventType.SCROLL, this.onScroll_, false, this);
      goog.events.unlisten(win, EventType.RESIZE, this.onResize_, false, this);
    }
  }
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
 * @param {goog.events.BrowserEvent} evt
 * @private
 */
npf.fx.Parallax.prototype.onResize_ = function(evt) {
  /** @type {number} */
  var maxScroll = this.getMaxScrollInternal();
  this.setMaxPosition(maxScroll);
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
 * @return {number}
 * @protected
 */
npf.fx.Parallax.prototype.getScrollInternal = function() {
  return this.domHelper_.getDocumentScroll().y;
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
