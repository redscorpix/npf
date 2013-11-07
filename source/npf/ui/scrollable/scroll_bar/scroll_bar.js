goog.provide('npf.ui.scrollable.ScrollBar');
goog.provide('npf.ui.scrollable.ScrollBar.EventType');
goog.provide('npf.ui.scrollable.ScrollBarEvent');

goog.require('goog.events');
goog.require('goog.events.Event');
goog.require('goog.events.EventType');
goog.require('goog.fx.Dragger');
goog.require('goog.fx.Dragger.EventType');
goog.require('goog.math');
goog.require('goog.math.Coordinate');
goog.require('goog.math.Size');
goog.require('goog.style');
goog.require('goog.ui.Component.State');
goog.require('npf.ui.StatedComponent');
goog.require('npf.ui.scrollable.scrollBar.Renderer');


/**
 * @param {npf.ui.scrollable.scrollBar.Renderer=} opt_renderer
 * @param {goog.dom.DomHelper=} opt_domHelper
 * @constructor
 * @extends {npf.ui.StatedComponent}
 */
npf.ui.scrollable.ScrollBar = function(opt_renderer, opt_domHelper) {
  goog.base(this, opt_renderer ||
    npf.ui.scrollable.scrollBar.Renderer.getInstance(), opt_domHelper);

  this.setSupportedState(goog.ui.Component.State.DISABLED, true);
};
goog.inherits(npf.ui.scrollable.ScrollBar, npf.ui.StatedComponent);


/**
 * @const {number}
 */
npf.ui.scrollable.ScrollBar.MIN_SIZE = 20;

/**
 * @enum {string}
 */
npf.ui.scrollable.ScrollBar.EventType = {

  /**
   * npf.ui.scrollable.ScrollBarEvent
   */
  SCROLL: goog.events.getUniqueId('scroll')
};


/**
 * @private {npf.ui.scrollable.Container}
 */
npf.ui.scrollable.ScrollBar.prototype.container_ = null;

/**
 * @private {goog.math.Size}
 */
npf.ui.scrollable.ScrollBar.prototype.containerContentSize_ = null;

/**
 * @private {goog.math.Size}
 */
npf.ui.scrollable.ScrollBar.prototype.containerSize_ = null;

/**
 * @private {boolean}
 */
npf.ui.scrollable.ScrollBar.prototype.draggable_ = true;

/**
 * @private {goog.fx.Dragger}
 */
npf.ui.scrollable.ScrollBar.prototype.dragger_ = null;

/**
 * @private {number}
 */
npf.ui.scrollable.ScrollBar.prototype.minSize_ =
  npf.ui.scrollable.ScrollBar.MIN_SIZE;

/**
 * @private {number}
 */
npf.ui.scrollable.ScrollBar.prototype.position_ = 0;


/** @inheritDoc */
npf.ui.scrollable.ScrollBar.prototype.createDom = function() {
  goog.base(this, 'createDom');

  this.applySize(this.getSize());
  this.applyRunnerSize(this.getRunnerSize());
  this.applyDraggable(this.isDraggable());
};

/** @inheritDoc */
npf.ui.scrollable.ScrollBar.prototype.enterDocument = function() {
  goog.base(this, 'enterDocument');

  this.update();

  /** @type {goog.events.EventHandler} */
  var handler = this.getHandler();

  handler.listen(this.getElement(), [
    goog.events.EventType.TOUCHSTART,
    goog.events.EventType.MOUSEDOWN
  ], this.onBeforeDrag_, true);

  if (this.dragger_) {
    handler
      .listen(this.dragger_, goog.fx.Dragger.EventType.START, this.onDragStart_)
      .listen(this.dragger_, goog.fx.Dragger.EventType.DRAG, this.onDrag_)
      .listen(this.dragger_, goog.fx.Dragger.EventType.END, this.onDragEnd_);
  }

  if (this.container_) {
    this.setListenedContainer(this.container_, true);
  }
};

/** @inheritDoc */
npf.ui.scrollable.ScrollBar.prototype.disposeInternal = function() {
  goog.dispose(this.dragger_);
  this.setContainer(null);

  goog.base(this, 'disposeInternal');

  this.container_ = null;
  this.containerContentSize_ = null;
  this.containerSize_ = null;
  this.dragger_ = null;
};

/**
 * @return {Element}
 */
npf.ui.scrollable.ScrollBar.prototype.getBackgroundElement = function() {
  var renderer = /** @type {npf.ui.scrollable.scrollBar.Renderer} */ (
    this.getRenderer());

  return renderer.getBackgroundElement(this.getElement());
};

/**
 * @return {npf.ui.scrollable.Container}
 */
npf.ui.scrollable.ScrollBar.prototype.getContainer = function() {
  return this.container_;
};

/**
 * @param {npf.ui.scrollable.Container} container
 */
npf.ui.scrollable.ScrollBar.prototype.setContainer = goog.nullFunction;

/**
 * @param {npf.ui.scrollable.Container} container
 * @protected
 */
npf.ui.scrollable.ScrollBar.prototype.setContainerInternal = function(
    container) {
  this.container_ = container;
};

/**
 * @return {goog.math.Size}
 */
npf.ui.scrollable.ScrollBar.prototype.getContainerSize = function() {
  return this.containerSize_;
};

/**
 * @return {goog.math.Size}
 */
npf.ui.scrollable.ScrollBar.prototype.getContainerContentSize = function() {
  return this.containerContentSize_;
};

/**
 * @return {boolean}
 */
npf.ui.scrollable.ScrollBar.prototype.isDraggable = function() {
  return this.draggable_;
};

/**
 * @param {boolean} drag
 */
npf.ui.scrollable.ScrollBar.prototype.setDraggable = function(drag) {
  if (this.isDraggable() != drag) {
    this.setDraggableInternal(drag);
    this.applyDraggable(this.isDraggable());
  }
};

/**
 * @param {boolean} drag
 * @protected
 */
npf.ui.scrollable.ScrollBar.prototype.setDraggableInternal = function(drag) {
  this.draggable_ = drag;
};

/**
 * @param {boolean} drag
 * @protected
 */
npf.ui.scrollable.ScrollBar.prototype.applyDraggable = function(drag) {
  if (this.getElement()) {
    if (drag) {
      this.dragger_ = new goog.fx.Dragger(this.getRunnerElement(),
        this.getElement(), this.getLimits());

      if (this.isInDocument()) {
        var EventType = goog.fx.Dragger.EventType;

        this.getHandler()
          .listen(this.dragger_, EventType.START, this.onDragStart_)
          .listen(this.dragger_, EventType.DRAG, this.onDrag_)
          .listen(this.dragger_, EventType.END, this.onDragEnd_);
      }
    } else if (this.dragger_) {
      this.dragger_.dispose();
      this.dragger_ = null;
    }
  }
};

/**
 * @param {goog.events.BrowserEvent} evt
 * @private
 */
npf.ui.scrollable.ScrollBar.prototype.onBeforeDrag_ = function(evt) {
  if (this.isEnabled()) {
    /** @type {!goog.math.Coordinate} */
    var position = goog.style.getRelativePosition(evt, this.getElement());
    /** @type {number} */
    var diff = Math.round(this.getRunnerSize() / 2);

    if (this.onDrag(position.x - diff, position.y - diff)) {
      this.applyPosition(this.getPosition());
    }
  }
};

/**
 * @param {goog.fx.DragEvent} evt
 * @private
 */
npf.ui.scrollable.ScrollBar.prototype.onDragStart_ = function(evt) {
  if (this.isEnabled()) {
    var renderer = /** @type {npf.ui.scrollable.scrollBar.Renderer} */ (
      this.getRenderer());
    renderer.setUnselectable(this.getDomHelper().getDocument().body, true);
  } else {
    evt.preventDefault();
  }
};

/**
 * @param {goog.fx.DragEvent} evt
 * @private
 */
npf.ui.scrollable.ScrollBar.prototype.onDrag_ = function(evt) {
  if (this.isEnabled()) {
    this.onDrag(evt.left, evt.top);
  }
};

/**
 * @param {goog.fx.DragEvent} evt
 * @private
 */
npf.ui.scrollable.ScrollBar.prototype.onDragEnd_ = function(evt) {
  if (!this.isEnabled()) {
    evt.preventDefault();
  }

  var renderer = /** @type {npf.ui.scrollable.scrollBar.Renderer} */ (
    this.getRenderer());
  renderer.setUnselectable(this.getDomHelper().getDocument().body, false);
};

/**
 * @return {goog.math.Rect}
 * @protected
 */
npf.ui.scrollable.ScrollBar.prototype.getLimits = goog.abstractMethod;

/**
 * @return {number}
 */
npf.ui.scrollable.ScrollBar.prototype.getMaxRunnerPosition = function() {
  /** @type {number} */
  var size = this.getSize();
  /** @type {number} */
  var runnerSize = this.getRunnerSize();

  return Math.max(0, size - runnerSize);
};

/**
 * @return {number}
 */
npf.ui.scrollable.ScrollBar.prototype.getMinSize = function() {
  return this.minSize_;
};

/**
 * @param {number} size
 */
npf.ui.scrollable.ScrollBar.prototype.setMinSize = function(size) {
  this.minSize_ = Math.max(0, size);
};

/**
 * @return {number}
 */
npf.ui.scrollable.ScrollBar.prototype.getPosition = function() {
  return this.position_;
};

/**
 * @param {number} position
 */
npf.ui.scrollable.ScrollBar.prototype.setPosition = function(position) {
  if (this.isEnabled()) {
    /** @type {number} */
    var containerSize = this.getValueFromSize(this.getContainerSize());
    /** @type {number} */
    var containerContentSize = this.getValueFromSize(
      this.getContainerContentSize());
    /** @type {number} */
    var maxScroll = Math.max(0, containerContentSize - containerSize);

    position = goog.math.clamp(position, 0, maxScroll);

    if (this.getPosition() != position) {
      this.setPositionInternal(position);
      this.applyPosition(this.getPosition());
    }
  }
};

/**
 * @param {number} position
 * @protected
 */
npf.ui.scrollable.ScrollBar.prototype.setPositionInternal = function(position) {
  this.position_ = position;
};

/**
 * @param {number} position
 * @protected
 */
npf.ui.scrollable.ScrollBar.prototype.applyPosition = function(position) {
  /** @type {number} */
  var runnerPosition = this.getRunnerPositionByPosition(position);
  var renderer = /** @type {npf.ui.scrollable.scrollBar.Renderer} */ (
    this.getRenderer());
  renderer.setPosition(this.getRunnerElement(), runnerPosition);
};

/**
 * @param {number} runnerPosition
 * @return {number}
 */
npf.ui.scrollable.ScrollBar.prototype.getPositionByRunner = function(
    runnerPosition) {
  /** @type {number} */
  var containerSize = this.getValueFromSize(this.getContainerSize());
  /** @type {number} */
  var containerContentSize = this.getValueFromSize(
    this.getContainerContentSize());
  /** @type {number} */
  var maxScroll = Math.max(0, containerContentSize - containerSize);
  /** @type {number} */
  var maxRunnerScroll = this.getMaxRunnerPosition();

  if (maxRunnerScroll) {
    return Math.round(runnerPosition / maxRunnerScroll * maxScroll);
  }

  return 0;
};

/**
 * @return {Element}
 */
npf.ui.scrollable.ScrollBar.prototype.getRunnerElement = function() {
  var renderer = /** @type {npf.ui.scrollable.scrollBar.Renderer} */ (
    this.getRenderer());

  return renderer.getRunnerElement(this.getElement());
};

/**
 * @return {number}
 */
npf.ui.scrollable.ScrollBar.prototype.getRunnerPosition = function() {
  return this.getRunnerPositionByPosition(this.getPosition());
};

/**
 * @param {number} position
 * @return {number}
 */
npf.ui.scrollable.ScrollBar.prototype.getRunnerPositionByPosition = function(
    position) {
  /** @type {number} */
  var containerSize = this.getValueFromSize(this.getContainerSize());
  /** @type {number} */
  var containerContentSize = this.getValueFromSize(
    this.getContainerContentSize());
  /** @type {number} */
  var maxScroll = Math.max(0, containerContentSize - containerSize);
  /** @type {number} */
  var maxRunnerScroll = this.getMaxRunnerPosition();

  if (maxScroll) {
    return Math.round(position / maxScroll * maxRunnerScroll);
  }

  return 0;
};

/**
 * @return {number}
 */
npf.ui.scrollable.ScrollBar.prototype.getRunnerSize = function() {
  /** @type {number} */
  var size = this.getSize();
  /** @type {number} */
  var containerSize = this.getValueFromSize(this.getContainerSize());
  /** @type {number} */
  var containerContentSize = this.getValueFromSize(
    this.getContainerContentSize());
  /** @type {number} */
  var runnerSize = Math.round(containerSize / containerContentSize * size);

  return Math.max(this.getMinSize(), runnerSize);
};

/**
 * @param {number} size
 * @protected
 */
npf.ui.scrollable.ScrollBar.prototype.applyRunnerSize = function(size) {
  var renderer = /** @type {npf.ui.scrollable.scrollBar.Renderer} */ (
    this.getRenderer());
  renderer.setSize(this.getRunnerElement(), size);
};

/**
 * @return {number}
 */
npf.ui.scrollable.ScrollBar.prototype.getSize = function() {
  return this.getValueFromSize(this.getContainerSize());
};

/**
 * @param {number} size
 * @protected
 */
npf.ui.scrollable.ScrollBar.prototype.applySize = function(size) {
  var renderer = /** @type {npf.ui.scrollable.scrollBar.Renderer} */ (
    this.getRenderer());
  renderer.setSize(this.getElement(), size);
};

/**
 * @param {goog.math.Coordinate} coordinate
 * @return {number}
 * @protected
 */
npf.ui.scrollable.ScrollBar.prototype.getValueFromCoordinate =
  goog.abstractMethod;

/**
 * @param {goog.math.Size} size
 * @return {number}
 * @protected
 */
npf.ui.scrollable.ScrollBar.prototype.getValueFromSize = goog.abstractMethod;

npf.ui.scrollable.ScrollBar.prototype.update = function() {
  if (this.container_) {
    /** @type {goog.math.Size} */
    var size = this.container_.getSize();
    /** @type {goog.math.Size} */
    var contentSize = this.container_.getContentSize();

    if (!(
      size && contentSize &&
      goog.math.Size.equals(this.containerSize_, size) &&
      goog.math.Size.equals(this.containerContentSize_, contentSize)
    )) {
      this.containerSize_ = size;
      this.containerContentSize_ = contentSize;

      /** @type {number} */
      var containerSize = this.getValueFromSize(size);
      /** @type {number} */
      var containerContentSize = this.getValueFromSize(contentSize);

      this.applySize(this.getSize());
      this.applyRunnerSize(this.getRunnerSize());
      this.setVisible(0 < containerContentSize - containerSize);

      if (this.isEnabled()) {
        this.applyPosition(this.getPosition());
      }

      if (this.dragger_) {
        this.dragger_.setLimits(this.getLimits());
      }
    }

    /** @type {goog.math.Coordinate} */
    var scrollPosition = this.container_.getScrollPosition();
    this.setPosition(this.getValueFromCoordinate(scrollPosition));
  } else {
    this.setVisible(false);
  }
};

/**
 * @param {npf.ui.scrollable.Container} container
 * @param {boolean} listen
 * @protected
 */
npf.ui.scrollable.ScrollBar.prototype.setListenedContainer = function(
    container, listen) {
  if (this.isInDocument()) {
    /** @type {goog.events.EventHandler} */
    var handler = this.getHandler();
    var eventTypes = [
      npf.ui.scrollable.Container.EventType.RESIZE,
      npf.ui.scrollable.Container.EventType.SCROLL
    ];

    if (listen) {
      handler.listen(container, eventTypes, this.onContainerUpdate_);
    } else {
      handler.unlisten(container, eventTypes, this.onContainerUpdate_);
    }
  }
};

/**
 * @param {npf.ui.scrollable.ContainerEvent} evt
 * @private
 */
npf.ui.scrollable.ScrollBar.prototype.onContainerUpdate_ = function(evt) {
  this.update();
};

/**
 * @param {number} left
 * @param {number} top
 * @return {boolean}
 * @protected
 */
npf.ui.scrollable.ScrollBar.prototype.onDrag = function(left, top) {
  var runnerPosition2d = new goog.math.Coordinate(left, top);
  /** @type {number} */
  var runnerPosition = this.getValueFromCoordinate(runnerPosition2d);
  /** @type {number} */
  var position = this.getPositionByRunner(runnerPosition);

  if (this.getPosition() != position) {
    this.setPositionInternal(position);

    var event = new npf.ui.scrollable.ScrollBarEvent(
      npf.ui.scrollable.ScrollBar.EventType.SCROLL, this.getPosition());
    this.dispatchEvent(event);

    return true;
  }

  return false;
};


/**
 * @param {npf.ui.scrollable.ScrollBar.EventType} type
 * @param {number} position
 * @constructor
 * @extends {goog.events.Event}
 */
npf.ui.scrollable.ScrollBarEvent = function(type, position) {
  goog.base(this, type);

  /**
   * @type {number}
   */
  this.position = position;
};
goog.inherits(npf.ui.scrollable.ScrollBarEvent, goog.events.Event);
