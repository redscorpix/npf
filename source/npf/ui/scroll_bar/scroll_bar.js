goog.provide('npf.ui.ScrollBar');
goog.provide('npf.ui.ScrollBar.EventType');
goog.provide('npf.ui.ScrollBar.Type');

goog.require('goog.events');
goog.require('goog.events.EventType');
goog.require('goog.fx.Dragger');
goog.require('goog.fx.Dragger.EventType');
goog.require('goog.math.Coordinate');
goog.require('goog.math.Rect');
goog.require('goog.math.Size');
goog.require('goog.style');
goog.require('goog.ui.Component.State');
goog.require('npf.ui.StatedComponent');
goog.require('npf.ui.scrollBar.Renderer');


/**
 * @param {npf.ui.ScrollBar.Type=} opt_type
 * @param {npf.ui.scrollBar.Renderer=} opt_renderer
 * @param {goog.dom.DomHelper=} opt_domHelper
 * @constructor
 * @extends {npf.ui.StatedComponent}
 */
npf.ui.ScrollBar = function(opt_type, opt_renderer, opt_domHelper) {
  npf.ui.ScrollBar.base(this, 'constructor', opt_renderer ||
    npf.ui.scrollBar.Renderer.getInstance(), opt_domHelper);

  /**
   * @private {boolean}
   */
  this.autoSize_ = true;

  /**
   * @private {npf.ui.ScrollContainer}
   */
  this.container_ = null;

  /**
   * @private {boolean}
   */
  this.draggable_ = true;

  /**
   * @private {goog.fx.Dragger}
   */
  this.dragger_ = null;

  /**
   * @private {!goog.math.Size}
   */
  this.runnerSize_ = new goog.math.Size(0, 0);

  /**
   * @private {!goog.math.Coordinate}
   */
  this.scrollPosition_ = new goog.math.Coordinate(0, 0);

  /**
   * @private {!goog.math.Size}
   */
  this.size_ = new goog.math.Size(0, 0);

  /**
   * @private {npf.ui.ScrollBar.Type}
   */
  this.type_ = opt_type || npf.ui.ScrollBar.Type.VERTICAL;

  this.setSupportedState(goog.ui.Component.State.DISABLED, true);
};
goog.inherits(npf.ui.ScrollBar, npf.ui.StatedComponent);


/**
 * @enum {string}
 */
npf.ui.ScrollBar.EventType = {
  MOVE: goog.events.getUniqueId('move')
};

/**
 * @enum {number}
 */
npf.ui.ScrollBar.Type = {
  HORIZONTAL: 0x1,
  VERTICAL: 0x2,
  BOTH: 0x3
};


/** @inheritDoc */
npf.ui.ScrollBar.prototype.createDom = function() {
  npf.ui.ScrollBar.base(this, 'createDom');

  this.applyDraggable(this.draggable_);
  this.applyType(this.type_);
};

/** @inheritDoc */
npf.ui.ScrollBar.prototype.enterDocument = function() {
  npf.ui.ScrollBar.base(this, 'enterDocument');

  this.update();
  this.updateDragger_();

  this.getHandler().listen(this.getElement(), [
    goog.events.EventType.TOUCHSTART,
    goog.events.EventType.MOUSEDOWN
  ], this.onBeforeDrag_, true);
};

/** @inheritDoc */
npf.ui.ScrollBar.prototype.exitDocument = function() {
  npf.ui.ScrollBar.base(this, 'exitDocument');

  this.updateDragger_();
};

/** @inheritDoc */
npf.ui.ScrollBar.prototype.disposeInternal = function() {
  goog.dispose(this.dragger_);
  this.setContainer(null);

  npf.ui.ScrollBar.base(this, 'disposeInternal');

  this.container_ = null;
  this.dragger_ = null;
};

/** @inheritDoc */
npf.ui.ScrollBar.prototype.setState = function(state, enable, opt_calledFrom) {
  npf.ui.ScrollBar.base(this, 'setState', state, enable, opt_calledFrom);

  if (goog.ui.Component.State.DISABLED == state && this.isInDocument()) {
    this.updateDragger_();
  }
};

/**
 * @return {boolean}
 */
npf.ui.ScrollBar.prototype.isAutoSize = function() {
  return this.autoSize_;
};

/**
 * @param {boolean} autoSize
 */
npf.ui.ScrollBar.prototype.setAutoSize = function(autoSize) {
  this.autoSize_ = autoSize;
  this.update();
};

npf.ui.ScrollBar.prototype.update = function() {
  if (this.isInDocument()) {
    var renderer = /** @type {npf.ui.scrollBar.Renderer} */ (this.getRenderer());
    /** @type {goog.math.Size} */
    var size = renderer.getSize(this);

    if (size) {
      this.setSize(size, this.autoSize_, true);
    }
  }
};

/**
 * @return {boolean}
 */
npf.ui.ScrollBar.prototype.isHorizontal = function() {
  return !!(npf.ui.ScrollBar.Type.HORIZONTAL & this.type_);
};

/**
 * @return {boolean}
 */
npf.ui.ScrollBar.prototype.isVertical = function() {
  return !!(npf.ui.ScrollBar.Type.VERTICAL & this.type_);
};

/**
 * @return {npf.ui.ScrollContainer}
 */
npf.ui.ScrollBar.prototype.getContainer = function() {
  return this.container_;
};

/**
 * @param {npf.ui.ScrollContainer} container
 */
npf.ui.ScrollBar.prototype.setContainer = function(container) {
  /** @type {npf.ui.ScrollContainer} */
  var oldContainer = this.getContainer();

  if (oldContainer !== container) {
    if (oldContainer) {
      this.setContainerInternal(null);
      oldContainer.removeScrollBar(this);
    }

    if (container) {
      this.setContainerInternal(container);
      container.addScrollBar(this);
    }

    this.update();
  }
};

/**
 * @param {npf.ui.ScrollContainer} container
 * @protected
 */
npf.ui.ScrollBar.prototype.setContainerInternal = function(container) {
  this.container_ = container;
};

/**
 * @return {boolean}
 */
npf.ui.ScrollBar.prototype.isDraggable = function() {
  return this.draggable_;
};

/**
 * @param {boolean} drag
 */
npf.ui.ScrollBar.prototype.setDraggable = function(drag) {
  if (this.draggable_ != drag) {
    this.setDraggableInternal(drag);
    this.applyDraggable(drag);
  }
};

/**
 * @param {boolean} drag
 * @protected
 */
npf.ui.ScrollBar.prototype.setDraggableInternal = function(drag) {
  this.draggable_ = drag;
};

/**
 * @param {boolean} drag
 * @protected
 */
npf.ui.ScrollBar.prototype.applyDraggable = function(drag) {
  /** @type {Element} */
  var element = this.getElement();

  if (element) {
    if (drag) {
      this.dragger_ = new goog.fx.Dragger(
        this.getRunnerElement(), element, this.getLimits());
      this.dragger_.listen(goog.fx.Dragger.EventType.DRAG, this.onDrag_,
        false, this);
      this.updateDragger_();
    } else {
      goog.dispose(this.dragger_);
      this.dragger_ = null;
    }
  }
};

/**
 * @private
 */
npf.ui.ScrollBar.prototype.updateDragger_ = function() {
  if (this.dragger_) {
    this.dragger_.setEnabled(this.isInDocument() && this.isEnabled());
  }
};

/**
 * @return {!goog.math.Rect}
 * @protected
 */
npf.ui.ScrollBar.prototype.getLimits = function() {
  var rect = new goog.math.Rect(0, 0, 0, 0);

  if (this.isHorizontal()) {
    rect.width = this.getMaxRunnerPosition().x;
  }

  if (this.isVertical()) {
    rect.height = this.getMaxRunnerPosition().y;
  }

  return rect;
};

/**
 * @return {Element}
 */
npf.ui.ScrollBar.prototype.getRunnerElement = function() {
  var renderer = /** @type {npf.ui.scrollBar.Renderer} */ (this.getRenderer());

  return renderer.getRunnerElement(this.getElement());
};

/**
 * @return {!goog.math.Coordinate}
 */
npf.ui.ScrollBar.prototype.getRunnerPosition = function() {
  var renderer = /** @type {npf.ui.scrollBar.Renderer} */ (this.getRenderer());

  return renderer.
    getRunnerPositionByScrollPosition(this, this.scrollPosition_) ||
      new goog.math.Coordinate(0, 0);
};

/**
 * @param {!goog.math.Coordinate} position
 * @param {boolean=} opt_noRender
 * @protected
 */
npf.ui.ScrollBar.prototype.setRunnerPosition = function(position,
    opt_noRender) {
  var renderer = /** @type {npf.ui.scrollBar.Renderer} */ (this.getRenderer());
  /** @type {goog.math.Coordinate} */
  var scrollPosition = renderer.getScrollPosition(this, position);

  if (scrollPosition) {
    this.setScrollPosition(scrollPosition, opt_noRender);
  }
};

/**
 * @return {!goog.math.Coordinate}
 */
npf.ui.ScrollBar.prototype.getMaxRunnerPosition = function() {
  var renderer = /** @type {npf.ui.scrollBar.Renderer} */ (this.getRenderer());

  return renderer.getMaxRunnerPosition(this) || new goog.math.Coordinate(0, 0);
};

/**
 * @return {!goog.math.Size}
 */
npf.ui.ScrollBar.prototype.getRunnerSize = function() {
  return this.runnerSize_;
};

/**
 * @param {!goog.math.Size} size
 * @protected
 */
npf.ui.ScrollBar.prototype.setRunnerSize = function(size) {
  /** @type {!goog.math.Size} */
  var correctedSize = size.clone();
  var renderer = /** @type {npf.ui.scrollBar.Renderer} */ (this.getRenderer());
  /** @type {!goog.math.Size} */
  var minSize = renderer.getMinRunnerSize();
  correctedSize.width = Math.max(correctedSize.width, minSize.width);
  correctedSize.height = Math.max(correctedSize.height, minSize.height);

  if (!goog.math.Size.equals(this.runnerSize_, correctedSize)) {
    this.setRunnerSizeInternal(correctedSize);
    this.applyRunnerSize(correctedSize);
  }
};

/**
 * @param {!goog.math.Size} size
 * @protected
 */
npf.ui.ScrollBar.prototype.setRunnerSizeInternal = function(size) {
  this.runnerSize_ = size;
};

/**
 * @param {!goog.math.Size} size
 * @protected
 */
npf.ui.ScrollBar.prototype.applyRunnerSize = function(size) {
  if (this.isInDocument()) {
    this.setVisible(
      size.width < this.size_.width || size.height < this.size_.height);
  }

  var renderer = /** @type {npf.ui.scrollBar.Renderer} */ (this.getRenderer());
  renderer.setRunnerSize(this, size);
};

/**
 * @return {!goog.math.Coordinate}
 */
npf.ui.ScrollBar.prototype.getScrollPosition = function() {
  return this.scrollPosition_;
};

/**
 * @param {!goog.math.Coordinate} position
 * @param {boolean=} opt_noRender
 * @param {boolean=} opt_force
 */
npf.ui.ScrollBar.prototype.setScrollPosition = function(position, opt_noRender,
    opt_force) {
  if (
    opt_force ||
    !goog.math.Coordinate.equals(this.scrollPosition_, position)
  ) {
    this.scrollPosition_ = position;
    this.setScrollPositionInternal(position);
    this.applyScrollPosition(position, opt_noRender);
    this.dispatchEvent(npf.ui.ScrollBar.EventType.MOVE);
  }
};

/**
 * @param {!goog.math.Coordinate} position
 * @protected
 */
npf.ui.ScrollBar.prototype.setScrollPositionInternal = function(position) {
  this.scrollPosition_ = position;
};

/**
 * @param {!goog.math.Coordinate} position
 * @param {boolean=} opt_noRender
 * @protected
 */
npf.ui.ScrollBar.prototype.applyScrollPosition = function(position,
    opt_noRender) {
  if (!opt_noRender) {
    var renderer = /** @type {npf.ui.scrollBar.Renderer} */ (this.getRenderer());
    /** @type {goog.math.Coordinate} */
    var runnerPosition =
      renderer.getRunnerPositionByScrollPosition(this, position);

    if (runnerPosition) {
      renderer.setRunnerPosition(this, runnerPosition);
    }
  }
};

/**
 * @return {!goog.math.Size}
 */
npf.ui.ScrollBar.prototype.getSize = function() {
  return this.size_;
};

/**
 * @param {!goog.math.Size} size
 * @param {boolean=} opt_noRender
 * @param {boolean=} opt_force
 * @protected
 */
npf.ui.ScrollBar.prototype.setSize = function(size, opt_noRender, opt_force) {
  if (opt_force || !goog.math.Size.equals(this.size_, size)) {
    this.setSizeInternal(size);
    this.applySize(size, opt_noRender);
  }
};

/**
 * @param {!goog.math.Size} size
 * @protected
 */
npf.ui.ScrollBar.prototype.setSizeInternal = function(size) {
  this.size_ = size;
};

/**
 * @param {!goog.math.Size} size
 * @param {boolean=} opt_noRender
 * @protected
 */
npf.ui.ScrollBar.prototype.applySize = function(size, opt_noRender) {
  if (!opt_noRender) {
    renderer.setSize(this, size);
  }

  /** @type {goog.math.Size} */
  var runnerSize = renderer.getRunnerSize(this);

  if (runnerSize) {
    this.setRunnerSize(runnerSize);
  }

  if (this.container_) {
    this.setScrollPosition(this.container_.getScrollPosition(), false, true);
  }

  if (this.dragger_) {
    this.dragger_.setLimits(this.getLimits());
  }
};

/**
 * @return {npf.ui.ScrollBar.Type}
 */
npf.ui.ScrollBar.prototype.getType = function() {
  return this.type_;
};

/**
 * @param {npf.ui.ScrollBar.Type} type
 */
npf.ui.ScrollBar.prototype.setType = function(type) {
  if (this._type != type) {
    /** @type {npf.ui.ScrollBar.Type} */
    var oldType = this._type;
    this._type = type;
    this.applyType(type, oldType);
  }
};

/**
 * @param {npf.ui.ScrollBar.Type} type
 * @param {npf.ui.ScrollBar.Type=} opt_oldType
 * @protected
 */
npf.ui.ScrollBar.prototype.applyType = function(type, opt_oldType) {
  renderer.setType(this, type, opt_oldType);
  this.update();
};

/**
 * @param {goog.events.BrowserEvent} evt
 * @private
 */
npf.ui.ScrollBar.prototype.onBeforeDrag_ = function(evt) {
  /** @type {!goog.math.Coordinate} */
  var position = goog.style.getRelativePosition(evt, this.getElement());
  /** @type {!goog.math.Size} */
  var diff = this.runnerSize_.clone().scale(0.5).round();
  this.onDrag(position.x - diff.width, position.y - diff.height);
};

/**
 * @param {number} left
 * @param {number} top
 * @return {boolean}
 * @protected
 */
npf.ui.ScrollBar.prototype.onDrag = function(left, top) {
  var runnerPosition = new goog.math.Coordinate(left, top);
  this.setRunnerPosition(runnerPosition, true);
};

/**
 * @param {goog.fx.DragEvent} evt
 * @private
 */
npf.ui.ScrollBar.prototype.onDrag_ = function(evt) {
  this.onDrag(evt.left, evt.top);
};
