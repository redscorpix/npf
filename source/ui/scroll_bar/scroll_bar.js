goog.provide('npf.ui.ScrollBar');

goog.require('goog.async.Delay');
goog.require('goog.events');
goog.require('goog.math.Coordinate');
goog.require('goog.math.Size');
goog.require('goog.style');
goog.require('goog.ui.Control');
goog.require('npf.events.ResizeHandler');
goog.require('npf.fx.Animation');
goog.require('npf.ui.RenderComponent');
goog.require('npf.ui.scrollBar.Animation');
goog.require('npf.ui.scrollBar.ButtonAnimation');
goog.require('npf.ui.scrollBar.HorizontalScroller');
goog.require('npf.ui.scrollBar.Renderer');
goog.require('npf.ui.scrollBar.SizeMonitor');
goog.require('npf.ui.scrollBar.VerticalScroller');


/**
 * @param {npf.ui.scrollBar.Renderer=} opt_renderer Renderer used to render or decorate the release.
 * @param {goog.dom.DomHelper=} opt_domHelper DOM helper, used for document interaction.
 * @constructor
 * @extends {npf.ui.RenderComponent}
 */
npf.ui.ScrollBar = function(opt_renderer, opt_domHelper) {
	goog.base(this, opt_renderer || npf.ui.scrollBar.Renderer.getInstance(), opt_domHelper);

	this._scrollPosition = new goog.math.Coordinate(0, 0);

	this._updateDelay = new goog.async.Delay(this.update, 0, this);
	this.registerDisposable(this._updateDelay);

	this._buttonAnimation = new npf.ui.scrollBar.ButtonAnimation();
	this._buttonAnimation.addEventListener(npf.ui.scrollBar.ButtonAnimation.EventType.ANIMATE, this._onAnimateByButton, false, this);
	this.registerDisposable(this._buttonAnimation);
};
goog.inherits(npf.ui.ScrollBar, npf.ui.RenderComponent);


/**
 * @enum {string}
 */
npf.ui.ScrollBar.EventType = {
	RESIZE: goog.events.getUniqueId('resize'),
	/**
	 * scrollLeft (number)
	 * scrollTop (number)
	 */
	SCROLL: goog.events.getUniqueId('scroll')
};

/**
 * @type {!goog.math.Coordinate}
 * @private
 */
npf.ui.ScrollBar.prototype._scrollPosition;

/**
 * @type {goog.async.Delay}
 * @private
 */
npf.ui.ScrollBar.prototype._updateDelay;

/**
 * @type {!npf.ui.scrollBar.ButtonAnimation}
 * @private
 */
npf.ui.ScrollBar.prototype._buttonAnimation;

/**
 * @type {goog.math.Size}
 * @private
 */
npf.ui.ScrollBar.prototype._size = null;

/**
 * @type {goog.math.Size}
 * @private
 */
npf.ui.ScrollBar.prototype._contentSize = null;

/**
 * @type {npf.ui.scrollBar.SizeMonitor}
 * @private
 */
npf.ui.ScrollBar.prototype._contentSizeMonitor = null;

/**
 * @type {npf.events.ResizeHandler}
 * @private
 */
npf.ui.ScrollBar.prototype._sizeHandler = null;

/**
 * @type {boolean}
 * @private
 */
npf.ui.ScrollBar.prototype._isAutoUpdate = false;

/**
 * @type {boolean}
 * @private
 */
npf.ui.ScrollBar.prototype._isEnabled = true;

/**
 * @type {npf.ui.scrollBar.VerticalScroller}
 * @private
 */
npf.ui.ScrollBar.prototype._verticalScroller = null;

/**
 * @type {npf.ui.scrollBar.HorizontalScroller}
 * @private
 */
npf.ui.ScrollBar.prototype._horizontalScroller = null;

/**
 * @type {npf.ui.scrollBar.Animation}
 * @private
 */
npf.ui.ScrollBar.prototype._animation = null;

/**
 * @type {goog.ui.Control}
 * @private
 */
npf.ui.ScrollBar.prototype._downButton = null;

/**
 * @type {goog.ui.Control}
 * @private
 */
npf.ui.ScrollBar.prototype._upButton = null;


/** @inheritDoc */
npf.ui.ScrollBar.prototype.enterDocument = function() {
	goog.base(this, 'enterDocument');

	/** @type {goog.math.Coordinate} */
	var scrollPosition = this.getScrollPosition();
	this.setScrollPosition(scrollPosition.x, scrollPosition.y);
	this._size = this.getSizeInternal();
	this._contentSize = this.getContentSizeInternal();

	this._updateScrollerPositions();
	this._updateScrollers();
	this._updateButtons();

	if (this._isAutoUpdate) {
		this.setAutoUpdateInternal(true);
	}

	/** @type {goog.events.EventHandler} */
	var handler = this.getHandler();
	handler.listen(this.getScrollElement(), goog.events.EventType.SCROLL, this._onScroll, false, this);

	this._sizeHandler = new npf.events.ResizeHandler();
	this._sizeHandler.addEventListener(npf.events.ResizeHandler.EventType.RESIZE, this._onUpdateDelay, false, this);

	if (this._verticalScroller) {
		handler.listen(this._verticalScroller, npf.ui.scrollBar.Scroller.EventType.SCROLL, this._onVerticalScroll, false, this);
	}

	if (this._horizontalScroller) {
		handler.listen(this._horizontalScroller, npf.ui.scrollBar.Scroller.EventType.SCROLL, this._onHorizontalScroll, false, this);
	}

	if (this._downButton) {
		handler.listen(this._downButton, goog.ui.Component.EventType.CHECK, this._onDownButtonCheck, false, this);
		handler.listen(this._downButton, goog.ui.Component.EventType.UNCHECK, this._onDownButtonUncheck, false, this);
	}

	if (this._upButton) {
		handler.listen(this._upButton, goog.ui.Component.EventType.CHECK, this._onUpButtonCheck, false, this);
		handler.listen(this._upButton, goog.ui.Component.EventType.UNCHECK, this._onUpButtonUncheck, false, this);
	}
};

/** @inheritDoc */
npf.ui.ScrollBar.prototype.exitDocument = function() {
	if (this._animation) {
		this._animation.stop(false);
	}

	this._buttonAnimation.stop();
	this._updateDelay.stop();

	this._sizeHandler.dispose();
	this._sizeHandler = null;

	this.setAutoUpdateInternal(false);

	goog.base(this, 'exitDocument');
};

/** @inheritDoc */
npf.ui.ScrollBar.prototype.disposeInternal = function() {
	goog.base(this, 'disposeInternal');

	delete this._scrollPosition;
	delete this._updateDelay;
	delete this._buttonAnimation;
	delete this._size;
	delete this._contentSize;
	delete this._contentSizeMonitor;
	delete this._sizeHandler;
	delete this._isAutoUpdate;
	delete this._isEnabled;
	delete this._verticalScroller;
	delete this._horizontalScroller;
	delete this._animation;
	delete this._downButton;
	delete this._upButton;
};

/**
 * @return {npf.ui.scrollBar.Renderer}
 */
npf.ui.ScrollBar.prototype.getRenderer = function() {
	return /** @type {npf.ui.scrollBar.Renderer} */ (goog.base(this, 'getRenderer'));
};

/**
 * @param {npf.ui.scrollBar.Renderer} renderer
 */
npf.ui.ScrollBar.prototype.setRenderer = function(renderer) {
	goog.base(this, 'setRenderer', renderer);
};

/** @inheritDoc */
npf.ui.ScrollBar.prototype.getContentElement = function() {
	/** @type {Element} */
	var element = this.getElement();

	return element ? this.getRenderer().getContentElement(element) : null;
};

/**
 * @param {goog.events.BrowserEvent} evt
 * @private
 */
npf.ui.ScrollBar.prototype._onScroll = function(evt) {
	evt.preventDefault();
	evt.stopPropagation();

	if (this._isEnabled) {
		this._checkScrollPosition();
	}
};

/**
 * @return {boolean}
 */
npf.ui.ScrollBar.prototype.isAutoUpdate = function() {
	return this._isAutoUpdate;
};

/**
 * @param {boolean} update
 */
npf.ui.ScrollBar.prototype.setAutoUpdate = function(update) {
	if (this._isAutoUpdate == update) {
		return;
	}

	this._isAutoUpdate = update;

	if (this.isInDocument()) {
		this.setAutoUpdateInternal(this._isAutoUpdate);

		if (this._isAutoUpdate) {
			this.update();
		}
	}
};

/**
 * @param {boolean} update
 * @protected
 */
npf.ui.ScrollBar.prototype.setAutoUpdateInternal = function(update) {
	if (update) {
		/** @type {Element} */
		var contentWrapperElement = this.getContentWrapperElement();

		if (contentWrapperElement) {
			this._contentSizeMonitor = new npf.ui.scrollBar.SizeMonitor(contentWrapperElement);
			this._contentSizeMonitor.addEventListener(npf.ui.scrollBar.SizeMonitor.EventType.CHANGE, this._onUpdate, false, this);
		}
	} else {
		goog.dispose(this._contentSizeMonitor);
		this._contentSizeMonitor = null;
	}
};

/**
 * @param {goog.events.Event} evt
 * @private
 */
npf.ui.ScrollBar.prototype._onUpdateDelay = function(evt) {
	if (this._isEnabled) {
		this._updateDelay.start();
	}
};

/**
 * @param {goog.events.Event} evt
 * @private
 */
npf.ui.ScrollBar.prototype._onUpdate = function(evt) {
	if (this._isEnabled) {
		this.update();
	}
};

/**
 * @return {Element}
 */
npf.ui.ScrollBar.prototype.getScrollElement = function() {
	/** @type {Element} */
	var element = this.getElement();

	return element ? this.getRenderer().getScrollElement(element) : null;
};

/**
 * @return {Element}
 */
npf.ui.ScrollBar.prototype.getContentWrapperElement = function() {
	/** @type {Element} */
	var element = this.getElement();

	return element ? this.getRenderer().getContentWrapperElement(element) : null;
};

npf.ui.ScrollBar.prototype.update = function() {
	if (this.isInDocument() && this._isEnabled) {
		this._checkSize();
		this._checkScrollPosition();
	}
};

/**
 * @private
 */
npf.ui.ScrollBar.prototype._checkSize = function() {
	/** @type {goog.math.Size} */
	var size = this.getSizeInternal();
	/** @type {goog.math.Size} */
	var contentSize = this.getContentSizeInternal();

	if (!(goog.math.Size.equals(this._size, size) && goog.math.Size.equals(this._contentSize, contentSize))) {
		this._size = size;
		this._contentSize = contentSize;

		this._updateScrollers();
		this.dispatchEvent(npf.ui.ScrollBar.EventType.RESIZE);
	}
};

/**
 * @private
 */
npf.ui.ScrollBar.prototype._checkScrollPosition = function() {
	/** @type {!goog.math.Coordinate} */
	var scrollPosition = this.getScrollPositionInternal();

	if (!goog.math.Coordinate.equals(this._scrollPosition, scrollPosition)) {
		this._scrollPosition = scrollPosition;
		this.onScroll();
		this.dispatchEvent({
			type: npf.ui.ScrollBar.EventType.SCROLL,
			scrollLeft: this._scrollPosition.x,
			scrollTop: this._scrollPosition.y
		});
	}
};

/**
 * @protected
 */
npf.ui.ScrollBar.prototype.onScroll = function() {
	this._updateScrollerPositions();
	this._updateButtons();
};

/**
 * @return {boolean}
 */
npf.ui.ScrollBar.prototype.isEnabled = function() {
	return this._isEnabled;
};

/**
 * @param {boolean} enable
 */
npf.ui.ScrollBar.prototype.setEnabled = function(enable) {
	if (this._isEnabled == enable) {
		return;
	}

	this._isEnabled = enable;

	if (this._isEnabled) {
		this._updateScrollers();
		this._updateScrollerPositions();
		this._updateButtons();
	} else {
		if (this._animation) {
			this._animation.stop(false);
		}

		this._buttonAnimation.stop();
	}
};

/**
 * @return {goog.math.Size}
 */
npf.ui.ScrollBar.prototype.getSize = function() {
	return this._size;
};

/**
 * @return {goog.math.Size}
 * @protected
 */
npf.ui.ScrollBar.prototype.getSizeInternal = function() {
	/** @type {Element} */
	var element = this.getElement();

	return goog.style.getBorderBoxSize(element);
};

/**
 * @return {goog.math.Size}
 */
npf.ui.ScrollBar.prototype.getContentSize = function() {
	return this._contentSize;
};

/**
 * @return {goog.math.Size}
 * @protected
 */
npf.ui.ScrollBar.prototype.getContentSizeInternal = function() {
	/** @type {Element} */
	var contentElement = this.getContentElement();

	return goog.style.getBorderBoxSize(contentElement);
};

/**
 * @return {number}
 */
npf.ui.ScrollBar.prototype.getScrollLeft = function() {
	return this.getScrollPosition().x;
};

/**
 * @return {number}
 */
npf.ui.ScrollBar.prototype.getScrollTop = function() {
	return this.getScrollPosition().y;
};

/**
 * @return {goog.math.Coordinate}
 */
npf.ui.ScrollBar.prototype.getScrollPosition = function() {
	return this._scrollPosition;
};

/**
 * @return {!goog.math.Coordinate}
 * @protected
 */
npf.ui.ScrollBar.prototype.getScrollPositionInternal = function() {
	/** @type {Element} */
	var scrollElement = this.getScrollElement();

	return new goog.math.Coordinate(scrollElement.scrollLeft, scrollElement.scrollTop);
};

/**
 * @param {number} left
 */
npf.ui.ScrollBar.prototype.setScrollLeft = function(left) {
	this.setScrollPosition(left, this.getScrollTop());
};

/**
 * @param {number} top
 */
npf.ui.ScrollBar.prototype.setScrollTop = function(top) {
	this.setScrollPosition(this.getScrollLeft(), top);
};

/**
 * @param {number|goog.math.Coordinate} left
 * @param {number=} opt_top
 */
npf.ui.ScrollBar.prototype.setScrollPosition = function(left, opt_top) {
	if (this._animation) {
		this._animation.stop(false);
	}

	/** @type {number} */
	var x = goog.isNumber(left) ? left : /** @type {number} */ (left.x);
	/** @type {number} */
	var y = goog.isNumber(left) ? /** @type {number} */ (opt_top) : /** @type {number} */ (left.y);

	this.setScrollPositionInternal(x, y);
};

/**
 * @param {number} x
 * @param {number} y
 */
npf.ui.ScrollBar.prototype.setScrollPositionInternal = function(x, y) {
	/** @type {Element} */
	var scrollElement = this.getScrollElement();

	if (scrollElement) {
		scrollElement.scrollLeft = x;
		scrollElement.scrollTop = y;
	}
};

/**
 * @return {goog.math.Coordinate}
 */
npf.ui.ScrollBar.prototype.getMaxScrollPosition = function() {
	/** @type {number} */
	var left = 0;
	/** @type {number} */
	var top = 0;
	/** @type {goog.math.Size} */
	var size = this.getSize();
	/** @type {goog.math.Size} */
	var contentSize = this.getContentSize();

	if (contentSize && size) {
		left = Math.max(0, contentSize.width - size.width);
		top = Math.max(0, contentSize.height - size.height);
	}

	return new goog.math.Coordinate(left, top);
};

/**
 * @return {goog.ui.Control}
 */
npf.ui.ScrollBar.prototype.getDownButton = function() {
	return this._downButton;
};

/**
 * @param {goog.ui.Control} button
 */
npf.ui.ScrollBar.prototype.setDownButton = function(button) {
	/** @type {goog.events.EventHandler} */
	var handler = this.getHandler();

	if (this._downButton && this.isInDocument()) {
		handler.unlisten(this._downButton, goog.ui.Component.EventType.CHECK, this._onDownButtonCheck, false, this);
		handler.unlisten(this._downButton, goog.ui.Component.EventType.UNCHECK, this._onDownButtonUncheck, false, this);
	}

	this._downButton = button;

	if (this.isInDocument()) {
		this._updateButtons();
		handler.listen(this._downButton, goog.ui.Component.EventType.CHECK, this._onDownButtonCheck, false, this);
		handler.listen(this._downButton, goog.ui.Component.EventType.UNCHECK, this._onDownButtonUncheck, false, this);
	}
};

/**
 * @return {goog.ui.Control}
 */
npf.ui.ScrollBar.prototype.getUpButton = function() {
	return this._upButton;
};

/**
 * @param {goog.ui.Control} button
 */
npf.ui.ScrollBar.prototype.setUpButton = function(button) {
	/** @type {goog.events.EventHandler} */
	var handler = this.getHandler();

	if (this._upButton && this.isInDocument()) {
		handler.unlisten(this._upButton, goog.ui.Component.EventType.CHECK, this._onUpButtonCheck, false, this);
		handler.unlisten(this._upButton, goog.ui.Component.EventType.UNCHECK, this._onUpButtonUncheck, false, this);
	}

	this._upButton = button;

	if (this.isInDocument()) {
		this._updateButtons();
		handler.listen(this._upButton, goog.ui.Component.EventType.CHECK, this._onUpButtonCheck, false, this);
		handler.listen(this._upButton, goog.ui.Component.EventType.UNCHECK, this._onUpButtonUncheck, false, this);
	}
};

/**
 * @private
 */
npf.ui.ScrollBar.prototype._updateButtons = function() {
	/** @type {goog.math.Coordinate} */
	var scrollPosition = this.getScrollPosition();
	/** @type {goog.math.Coordinate} */
	var maxScrollPosition = this.getMaxScrollPosition();
	/** @type {boolean} */
	var enabled;

	if (this._upButton) {
		enabled = !!scrollPosition.y;

		this._upButton.setEnabled(enabled);

		if (!enabled && npf.ui.scrollBar.ButtonAnimation.Direction.UP == this._buttonAnimation.getDirection()) {
			this._buttonAnimation.stop();
		}
	}

	if (this._downButton) {
		enabled = !!(maxScrollPosition.y - scrollPosition.y);
		this._downButton.setEnabled(enabled);

		if (!enabled && npf.ui.scrollBar.ButtonAnimation.Direction.DOWN == this._buttonAnimation.getDirection()) {
			this._buttonAnimation.stop();
		}
	}
};

/**
 * @param {goog.events.Event} evt
 * @private
 */
npf.ui.ScrollBar.prototype._onUpButtonCheck = function(evt) {
	this._buttonAnimation.start(npf.ui.scrollBar.ButtonAnimation.Direction.UP);
};

/**
 * @param {goog.events.Event} evt
 * @private
 */
npf.ui.ScrollBar.prototype._onUpButtonUncheck = function(evt) {
	this._buttonAnimation.stop();
};

/**
 * @param {goog.events.Event} evt
 * @private
 */
npf.ui.ScrollBar.prototype._onDownButtonCheck = function(evt) {
	this._buttonAnimation.start(npf.ui.scrollBar.ButtonAnimation.Direction.DOWN);
};

/**
 * @param {goog.events.Event} evt
 * @private
 */
npf.ui.ScrollBar.prototype._onDownButtonUncheck = function(evt) {
	this._buttonAnimation.stop();
};

/**
 * @return {npf.ui.scrollBar.VerticalScroller}
 */
npf.ui.ScrollBar.prototype.getVerticalScroller = function() {
	return this._verticalScroller;
};

/**
 * @param {npf.ui.scrollBar.VerticalScroller} scrollBar
 */
npf.ui.ScrollBar.prototype.setVerticalScroller = function(scrollBar) {
	/** @type {goog.events.EventHandler} */
	var handler = this.getHandler();

	if (this._verticalScroller && this.isInDocument()) {
		handler.unlisten(this._verticalScroller, npf.ui.scrollBar.Scroller.EventType.SCROLL, this._onVerticalScroll, false, this);
	}

	this._verticalScroller = scrollBar;

	if (this.isInDocument()) {
		this._updateScrollerPositions();
		this._updateScrollers();
		handler.listen(this._verticalScroller, npf.ui.scrollBar.Scroller.EventType.SCROLL, this._onVerticalScroll, false, this);
	}
};

/**
 * @return {npf.ui.scrollBar.HorizontalScroller}
 */
npf.ui.ScrollBar.prototype.getHorizontalScroller = function() {
	return this._horizontalScroller;
};

/**
 * @param {npf.ui.scrollBar.HorizontalScroller} scrollBar
 */
npf.ui.ScrollBar.prototype.setHorizontalScroller = function(scrollBar) {
	/** @type {goog.events.EventHandler} */
	var handler = this.getHandler();

	if (this._horizontalScroller && this.isInDocument()) {
		handler.unlisten(this._horizontalScroller, npf.ui.scrollBar.Scroller.EventType.SCROLL, this._onHorizontalScroll, false, this);
	}

	this._horizontalScroller = scrollBar;

	if (this.isInDocument()) {
		this._updateScrollerPositions();
		this._updateScrollers();
		handler.listen(this._horizontalScroller, npf.ui.scrollBar.Scroller.EventType.SCROLL, this._onHorizontalScroll, false, this);
	}
};

/**
 * @param {goog.events.Event} evt
 */
npf.ui.ScrollBar.prototype._onVerticalScroll = function(evt) {
	if (this._isEnabled) {
		var position = /** @type {number} */ (evt.position);
		this.setScrollTop(position);
	}
};

/**
 * @param {goog.events.Event} evt
 */
npf.ui.ScrollBar.prototype._onHorizontalScroll = function(evt) {
	if (this._isEnabled) {
		var position = /** @type {number} */ (evt.position);
		this.setScrollLeft(position);
	}
};

/**
 * @private
 */
npf.ui.ScrollBar.prototype._updateScrollerPositions = function() {
	/** @type {goog.math.Coordinate} */
	var scrollPosition = this.getScrollPosition();

	if (this._horizontalScroller) {
		this._horizontalScroller.setPosition(scrollPosition.x);
	}

	if (this._verticalScroller) {
		this._verticalScroller.setPosition(scrollPosition.y);
	}
};

/**
 * @private
 */
npf.ui.ScrollBar.prototype._updateScrollers = function() {
	/** @type {goog.math.Size} */
	var size = this.getSize();
	/** @type {goog.math.Size} */
	var contentSize = this.getContentSize();
	/** @type {goog.math.Coordinate} */
	var maxScrollPosition = this.getMaxScrollPosition();

	this.updateScrollerSizes();

	if (this._verticalScroller) {
		this._verticalScroller.setSizes(size.height, contentSize.height, maxScrollPosition.y);
	}

	if (this._horizontalScroller) {
		this._horizontalScroller.setSizes(size.width, contentSize.width, maxScrollPosition.x);
	}
};

/**
 * @protected
 */
npf.ui.ScrollBar.prototype.updateScrollerSizes = function() {
	/** @type {Element} */
	var backgroundElement;

	if (this._verticalScroller) {
		backgroundElement = this._verticalScroller.getBackgroundElement();

		if (backgroundElement) {
			/** @type {number} */
			var height = goog.style.getBorderBoxSize(backgroundElement).height;
			this._verticalScroller.setSize(height);
		}
	}

	if (this._horizontalScroller) {
		backgroundElement = this._horizontalScroller.getBackgroundElement();

		if (backgroundElement) {
			/** @type {number} */
			var width = goog.style.getBorderBoxSize(backgroundElement).width;
			this._horizontalScroller.setSize(height);
		}
	}
};

/**
 * @return {npf.ui.scrollBar.Animation}
 */
npf.ui.ScrollBar.prototype.getAnimation = function() {
	return this._animation;
};

/**
 * @param {npf.ui.scrollBar.Animation} animation
 */
npf.ui.ScrollBar.prototype.setAnimation = function(animation) {
	if (this._animation) {
		this._animation.removeEventListener(goog.fx.Animation.EventType.ANIMATE, this._onAnimate, false, this);
		this._animation.removeEventListener(goog.fx.Transition.EventType.FINISH, this._onAnimate, false, this);
	}

	this._animation = animation;
	this._animation.stop(true);
	this._animation.addEventListener(goog.fx.Animation.EventType.ANIMATE, this._onAnimate, false, this);
	this._animation.addEventListener(goog.fx.Transition.EventType.FINISH, this._onAnimate, false, this);
};

/**
 * @param {number} x
 */
npf.ui.ScrollBar.prototype.animateToLeft = function(x) {
	this.animate(x, this.getScrollTop());
};

/**
 * @param {number} y
 */
npf.ui.ScrollBar.prototype.animateToTop = function(y) {
	this.animate(this.getScrollLeft(), y);
};

/**
 * @param {number|goog.math.Coordinate} x
 * @param {number=} opt_y
 */
npf.ui.ScrollBar.prototype.animate = function(x, opt_y) {
	/** @type {number} */
	var left = goog.isNumber(x) ? x : /** @type {number} */ (x.x);
	/** @type {number} */
	var top = goog.isNumber(x) ? /** @type {number} */ (opt_y) : /** @type {number} */ (x.y);

	if (!this._animation) {
		this.setScrollPositionInternal(left, top);

		return;
	}

	/** @type {goog.math.Coordinate} */
	var scrollPosition = this.getScrollPosition();
	/** @type {goog.math.Coordinate} */
	var maxScroll = this.getMaxScrollPosition();
	left = goog.math.clamp(left, 0, maxScroll.x);
	top = goog.math.clamp(top, 0, maxScroll.y);

	this._animation.stop(true);
	this._animation.startPoint = [scrollPosition.x, scrollPosition.y];
	this._animation.endPoint = [left, top];
	this._animation.play();
};

/**
 * @param {goog.fx.AnimationEvent} evt
 * @private
 */
npf.ui.ScrollBar.prototype._onAnimate = function(evt) {
	/** @type {number} */
	var x = Math.round(evt.x);
	/** @type {number} */
	var y = Math.round(evt.y);
	this.setScrollPositionInternal(x, y);
};

/**
 * @param {goog.events.Event} evt
 * @private
 */
npf.ui.ScrollBar.prototype._onAnimateByButton = function(evt) {
	var move = /** @type {number} */ (evt.move);
	this.setScrollTop(this.getScrollTop() + move);
};
