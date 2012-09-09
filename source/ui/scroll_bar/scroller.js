goog.provide('npf.ui.scrollBar.Scroller');
goog.provide('npf.ui.scrollBar.Scroller.EventType');

goog.require('goog.dom');
goog.require('goog.events');
goog.require('goog.fx.Dragger');
goog.require('goog.style');
goog.require('npf.ui.RenderComponent');
goog.require('npf.ui.scrollBar.ScrollerRenderer');


/**
 * @param {npf.ui.scrollBar.ScrollerRenderer=} opt_renderer Renderer used to render or decorate the component.
 * @param {goog.dom.DomHelper=} opt_domHelper DOM helper, used for document interaction.
 * @constructor
 * @extends {npf.ui.RenderComponent}
 */
npf.ui.scrollBar.Scroller = function(opt_renderer, opt_domHelper) {
  goog.base(this, opt_renderer ||
    npf.ui.scrollBar.ScrollerRenderer.getInstance(), opt_domHelper);
};
goog.inherits(npf.ui.scrollBar.Scroller, npf.ui.RenderComponent);


/**
 * @enum {string}
 */
npf.ui.scrollBar.Scroller.EventType = {
  /**
   * position (number)
   */
  SCROLL: goog.events.getUniqueId('scroll')
};

/**
 * @type {number}
 * @const
 */
npf.ui.scrollBar.Scroller.MIN_WIDTH = 20;

/**
 * @type {number}
 * @private
 */
npf.ui.scrollBar.Scroller.prototype.minWidth_ =
  npf.ui.scrollBar.Scroller.MIN_WIDTH;

/**
 * @type {boolean}
 * @private
 */
npf.ui.scrollBar.Scroller.prototype.draggable_ = true;

/**
 * @type {goog.fx.Dragger}
 * @private
 */
npf.ui.scrollBar.Scroller.prototype.dragger_ = null;

/**
 * @type {number}
 * @private
 */
npf.ui.scrollBar.Scroller.prototype.position_ = 0;

/**
 * @type {number}
 * @private
 */
npf.ui.scrollBar.Scroller.prototype.containerSize_ = 0;

/**
 * @type {number}
 * @private
 */
npf.ui.scrollBar.Scroller.prototype.contentSize_ = 0;

/**
 * @type {number}
 * @private
 */
npf.ui.scrollBar.Scroller.prototype.maxScrollPosition_ = 0;

/**
 * @type {boolean}
 * @private
 */
npf.ui.scrollBar.Scroller.prototype.visible_ = true;

/**
 * @type {number}
 * @private
 */
npf.ui.scrollBar.Scroller.prototype.size_ = 0;


/** @inheritDoc */
npf.ui.scrollBar.Scroller.prototype.enterDocument = function() {
  goog.base(this, 'enterDocument');

  this.setSizeInternal(this.size_);
  this.setVisible_(!!this.maxScrollPosition_);

  /** @type {goog.events.EventHandler} */
  var handler = this.getHandler();

  if (this.draggable_) {
    this.createDragger_();
  }
};

/** @inheritDoc */
npf.ui.scrollBar.Scroller.prototype.exitDocument = function() {
  this.removeDragger_();

  goog.base(this, 'exitDocument');
};

/** @inheritDoc */
npf.ui.scrollBar.Scroller.prototype.disposeInternal = function() {
  goog.base(this, 'disposeInternal');

  delete this.minWidth_;
  delete this.draggable_;
  delete this.dragger_;
  delete this.position_;
  delete this.containerSize_;
  delete this.contentSize_;
  delete this.maxScrollPosition_;
  delete this.visible_;
  delete this.size_;
};

/**
 * @return {number}
 */
npf.ui.scrollBar.Scroller.prototype.getMinWidth = function() {
  return this.minWidth_;
};

/**
 * @param {number} minWidth
 */
npf.ui.scrollBar.Scroller.prototype.setMinWidth = function(minWidth) {
  this.minWidth_ = minWidth;
};

/**
 * @param {number} containerSize
 * @param {number} contentSize
 * @param {number} maxScrollPosition
 */
npf.ui.scrollBar.Scroller.prototype.setSizes = function(containerSize,
                                                        contentSize,
                                                        maxScrollPosition) {
  if (!(
    this.containerSize_ == containerSize &&
    this.contentSize_ == contentSize &&
    this.maxScrollPosition_ == maxScrollPosition
  )) {
    this.containerSize_ = containerSize;
    this.contentSize_ = contentSize;
    this.maxScrollPosition_ = maxScrollPosition;

    this.setPositionInternal(this.position_);
  }
};

/**
 * @return {Element}
 */
npf.ui.scrollBar.Scroller.prototype.getRunnerElement = function() {
  /** @type {Element} */
  var element = this.getElement();

  return element ? this.getRenderer().getRunnerElement(element) : null;
};

/**
 * @return {Element}
 */
npf.ui.scrollBar.Scroller.prototype.getBackgroundElement = function() {
  /** @type {Element} */
  var element = this.getElement();

  return element ? this.getRenderer().getBackgroundElement(element) : null;
};

/**
 * @param {boolean} drag
 */
npf.ui.scrollBar.Scroller.prototype.setDraggable = function(drag) {
  if (this.draggable_ == drag) {
    return;
  }

  this.draggable_ = drag;

  if (this.isInDocument()) {
    if (this.draggable_) {
      this.createDragger_();
    } else {
      this.removeDragger_();
    }
  }
};

/**
 * @private
 */
npf.ui.scrollBar.Scroller.prototype.createDragger_ = function() {
  if (!this.dragger_) {
    /** @type {number} */
    var size = this.getSize();
    /** @type {number} */
    var runnerSize = Math.round(this.containerSize_ / this.contentSize_ * size);
    runnerSize = Math.max(this.minWidth_, runnerSize);
    var maxPosition = Math.max(0, this.size_ - runnerSize);
    this.dragger_ = new goog.fx.Dragger(this.getRunnerElement(),
      this.getElement(), this.getLimits(maxPosition));
    this.dragger_.addEventListener(goog.fx.Dragger.EventType.START,
      this.onDragStart_, false, this);
    this.dragger_.addEventListener(goog.fx.Dragger.EventType.DRAG,
      this.onDrag_, false, this);
    this.dragger_.addEventListener(goog.fx.Dragger.EventType.END,
      this.onDragEnd_, false, this);
  }
};

/**
 * @private
 */
npf.ui.scrollBar.Scroller.prototype.removeDragger_ = function() {
  goog.dispose(this.dragger_);
  this.dragger_ = null;
};

/**
 * @param {goog.fx.DragEvent} evt
 * @private
 */
npf.ui.scrollBar.Scroller.prototype.onDragStart_ = function(evt) {
  var mouseMove2dPosition = new goog.math.Coordinate(evt.left, evt.top);
  /** @type {number} */
  var position = this.getDimenstionCoordinate(mouseMove2dPosition);

  if (this.position_ != position) {
    this.position_ = position;
    this.dispatchEvent({
      type: npf.ui.scrollBar.Scroller.EventType.SCROLL,
      position: this.position_
    });
  }

  goog.style.setUnselectable(document.body, true, true);
};

/**
 * @param {goog.fx.DragEvent} evt
 * @private
 */
npf.ui.scrollBar.Scroller.prototype.onDrag_ = function(evt) {
  var mouseMove2dPosition = new goog.math.Coordinate(evt.left, evt.top);
  this.position_ = this.getDimenstionCoordinate(mouseMove2dPosition);

  this.dispatchEvent({
    type: npf.ui.scrollBar.Scroller.EventType.SCROLL,
    position: this.position_
  });
};

/**
 * @param {goog.fx.DragEvent} evt
 * @private
 */
npf.ui.scrollBar.Scroller.prototype.onDragEnd_ = function(evt) {
  goog.style.setUnselectable(document.body, false, true);
};

/**
 * @return {number}
 */
npf.ui.scrollBar.Scroller.prototype.getPosition = function() {
  return this.position_;
};

/**
 * @param {number} position
 */
npf.ui.scrollBar.Scroller.prototype.setPosition = function(position) {
  if (this.position_ != position) {
    this.position_ = position;
    this.setPositionInternal(this.position_);
  }
};

/**
 * @param {number} position
 * @protected
 */
npf.ui.scrollBar.Scroller.prototype.setPositionInternal = function(position) {
  this.setVisible_(!!this.maxScrollPosition_);

  if (this.maxScrollPosition_) {
    /** @type {number} */
    var size = this.getSize();
    /** @type {number} */
    var runnerSize = Math.round(this.containerSize_ / this.contentSize_ * size);
    runnerSize = Math.max(this.minWidth_, runnerSize);
    /** @type {number} */
    var runnerPosition = Math.round(position / this.maxScrollPosition_ *
      Math.max(0, size - runnerSize)) || 0;
    this.setRunnerElementSize(runnerSize);
    this.setRunnerElementPosition(runnerPosition);
  }
};

/**
 * @return {boolean}
 */
npf.ui.scrollBar.Scroller.prototype.isVisible = function() {
  return this.visible_;
};

/**
 * @param {boolean} visible
 * @private
 */
npf.ui.scrollBar.Scroller.prototype.setVisible_ = function(visible) {
  if (this.visible_ != visible) {
    this.visible_ = visible;
    goog.style.setStyle(this.getElement(), 'display', this.visible_ ? '' : 'none');
  }
};

/**
 * @return {number}
 */
npf.ui.scrollBar.Scroller.prototype.getSize = function() {
  return this.size_;
};

/**
 * @param {number} size
 */
npf.ui.scrollBar.Scroller.prototype.setSize = function(size) {
  if (this.size_ == size) {
    return;
  }

  this.size_ = size;

  if (this.isInDocument()) {
    this.setSizeInternal(this.size_);
  }
};

/**
 * @param {number} size
 * @protected
 */
npf.ui.scrollBar.Scroller.prototype.setSizeInternal = function(size) {

};

/**
 * @param {goog.math.Coordinate} coordinate
 * @return {number}
 * @protected
 */
npf.ui.scrollBar.Scroller.prototype.getDimenstionCoordinate =
  goog.abstractMethod;

/**
 * @param {number} position
 * @protected
 */
npf.ui.scrollBar.Scroller.prototype.setRunnerElementPosition =
  goog.abstractMethod;

/**
 * @param {number} size
 * @protected
 */
npf.ui.scrollBar.Scroller.prototype.setRunnerElementSize = goog.abstractMethod;

/**
 * @param {number} maxPosition
 * @return {goog.math.Rect}
 * @protected
 */
npf.ui.scrollBar.Scroller.prototype.getLimits = goog.abstractMethod;
