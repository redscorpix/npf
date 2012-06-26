goog.provide('npf.ui.scrollBar.Scroller');

goog.require('goog.dom');
goog.require('goog.events');
goog.require('goog.fx.Dragger');
goog.require('goog.style');
goog.require('npf.ui.RenderComponent');
goog.require('npf.ui.scrollBar.ScrollerRenderer');


/**
 * @param {npf.ui.scrollBar.ScrollerRenderer=} opt_renderer Renderer used to render or decorate the release.
 * @param {goog.dom.DomHelper=} opt_domHelper DOM helper, used for document interaction.
 * @constructor
 * @extends {npf.ui.RenderComponent}
 */
npf.ui.scrollBar.Scroller = function(opt_renderer, opt_domHelper) {
	goog.base(this, opt_renderer || npf.ui.scrollBar.ScrollerRenderer.getInstance(), opt_domHelper);
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
npf.ui.scrollBar.Scroller.prototype._minWidth = npf.ui.scrollBar.Scroller.MIN_WIDTH;

/**
 * @type {boolean}
 * @private
 */
npf.ui.scrollBar.Scroller.prototype._isDraggable = true;

/**
 * @type {goog.fx.Dragger}
 * @private
 */
npf.ui.scrollBar.Scroller.prototype._dragger = null;

/**
 * @type {number}
 * @private
 */
npf.ui.scrollBar.Scroller.prototype._position = 0;

/**
 * @type {number}
 * @private
 */
npf.ui.scrollBar.Scroller.prototype._containerSize = 0;

/**
 * @type {number}
 * @private
 */
npf.ui.scrollBar.Scroller.prototype._contentSize = 0;

/**
 * @type {number}
 * @private
 */
npf.ui.scrollBar.Scroller.prototype._maxScrollPosition = 0;

/**
 * @type {boolean}
 * @private
 */
npf.ui.scrollBar.Scroller.prototype._isVisible = true;

/**
 * @type {number}
 * @private
 */
npf.ui.scrollBar.Scroller.prototype._size = 0;


/** @inheritDoc */
npf.ui.scrollBar.Scroller.prototype.enterDocument = function() {
	goog.base(this, 'enterDocument');

	this.setSizeInternal(this._size);
	this._setVisible(!!this._maxScrollPosition);

	/** @type {goog.events.EventHandler} */
	var handler = this.getHandler();

	if (this._isDraggable) {
		this._createDragger();
	}
};

/** @inheritDoc */
npf.ui.scrollBar.Scroller.prototype.exitDocument = function() {
	this._removeDragger();

	goog.base(this, 'exitDocument');
};

/** @inheritDoc */
npf.ui.scrollBar.Scroller.prototype.disposeInternal = function() {
	goog.base(this, 'disposeInternal');

	delete this._minWidth;
	delete this._isDraggable;
	delete this._dragger;
	delete this._position;
	delete this._containerSize;
	delete this._contentSize;
	delete this._maxScrollPosition;
	delete this._isVisible;
	delete this._size;
};

/**
 * @return {npf.ui.scrollBar.ScrollerRenderer}
 */
npf.ui.scrollBar.Scroller.prototype.getRenderer = function() {
	return /** @type {npf.ui.scrollBar.ScrollerRenderer} */ (goog.base(this, 'getRenderer'));
};

/**
 * @param {npf.ui.scrollBar.ScrollerRenderer} renderer
 */
npf.ui.scrollBar.Scroller.prototype.setRenderer = function(renderer) {
	goog.base(this, 'setRenderer', renderer);
};

/**
 * @return {number}
 */
npf.ui.scrollBar.Scroller.prototype.getMinWidth = function() {
	return this._minWidth;
};

/**
 * @param {number} minWidth
 */
npf.ui.scrollBar.Scroller.prototype.setMinWidth = function(minWidth) {
	this._minWidth = minWidth;
};

/**
 * @param {number} containerSize
 * @param {number} contentSize
 * @param {number} maxScrollPosition
 */
npf.ui.scrollBar.Scroller.prototype.setSizes = function(containerSize, contentSize, maxScrollPosition) {
	if (!(
		this._containerSize == containerSize &&
		this._contentSize == contentSize &&
		this._maxScrollPosition == maxScrollPosition
	)) {
		this._containerSize = containerSize;
		this._contentSize = contentSize;
		this._maxScrollPosition = maxScrollPosition;

		this.setPositionInternal(this._position);
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
	if (this._isDraggable == drag) {
		return;
	}

	this._isDraggable = drag;

	if (this.isInDocument()) {
		if (this._isDraggable) {
			this._createDragger();
		} else {
			this._removeDragger();
		}
	}
};

/**
 * @private
 */
npf.ui.scrollBar.Scroller.prototype._createDragger = function() {
	if (!this._dragger) {
		/** @type {number} */
		var size = this.getSize();
		/** @type {number} */
		var runnerSize = Math.round(this._containerSize / this._contentSize * size);
		runnerSize = Math.max(this._minWidth, runnerSize);
		var maxPosition = Math.max(0, this._size - runnerSize);
		this._dragger = new goog.fx.Dragger(this.getRunnerElement(), this.getElement(), this.getLimits(maxPosition));
		this._dragger.addEventListener(goog.fx.Dragger.EventType.START, this._onDragStart, false, this);
		this._dragger.addEventListener(goog.fx.Dragger.EventType.DRAG, this._onDrag, false, this);
		this._dragger.addEventListener(goog.fx.Dragger.EventType.END, this._onDragEnd, false, this);
	}
};

/**
 * @private
 */
npf.ui.scrollBar.Scroller.prototype._removeDragger = function() {
	goog.dispose(this._dragger);
	this._dragger = null;
};

/**
 * @param {goog.fx.DragEvent} evt
 * @private
 */
npf.ui.scrollBar.Scroller.prototype._onDragStart = function(evt) {
	var mouseMove2dPosition = new goog.math.Coordinate(evt.left, evt.top);
	/** @type {number} */
	var position = this.getDimenstionCoordinate(mouseMove2dPosition);

	if (this._position != position) {
		this._position = position;
		this.dispatchEvent({
			type: npf.ui.scrollBar.Scroller.EventType.SCROLL,
			position: this._position
		});
	}

	goog.style.setUnselectable(document.body, true, true);
};

/**
 * @param {goog.fx.DragEvent} evt
 * @private
 */
npf.ui.scrollBar.Scroller.prototype._onDrag = function(evt) {
	var mouseMove2dPosition = new goog.math.Coordinate(evt.left, evt.top);
	this._position = this.getDimenstionCoordinate(mouseMove2dPosition);

	this.dispatchEvent({
		type: npf.ui.scrollBar.Scroller.EventType.SCROLL,
		position: this._position
	});
};

/**
 * @param {goog.fx.DragEvent} evt
 * @private
 */
npf.ui.scrollBar.Scroller.prototype._onDragEnd = function(evt) {
	goog.style.setUnselectable(document.body, false, true);
};

/**
 * @return {number}
 */
npf.ui.scrollBar.Scroller.prototype.getPosition = function() {
	return this._position;
};

/**
 * @param {number} position
 */
npf.ui.scrollBar.Scroller.prototype.setPosition = function(position) {
	if (this._position != position) {
		this._position = position;
		this.setPositionInternal(this._position);
	}
};

/**
 * @param {number} position
 * @protected
 */
npf.ui.scrollBar.Scroller.prototype.setPositionInternal = function(position) {
	this._setVisible(!!this._maxScrollPosition);

	if (this._maxScrollPosition) {
		/** @type {number} */
		var size = this.getSize();
		/** @type {number} */
		var runnerSize = Math.round(this._containerSize / this._contentSize * size);
		runnerSize = Math.max(this._minWidth, runnerSize);
		/** @type {number} */
		var runnerPosition = Math.round(position / this._maxScrollPosition * Math.max(0, size - runnerSize)) || 0;
		this.setRunnerElementSize(runnerSize);
		this.setRunnerElementPosition(runnerPosition);
	}
};

/**
 * @return {boolean}
 */
npf.ui.scrollBar.Scroller.prototype.isVisible = function() {
	return this._isVisible;
};

/**
 * @param {boolean} visible
 * @private
 */
npf.ui.scrollBar.Scroller.prototype._setVisible = function(visible) {
	if (this._isVisible != visible) {
		this._isVisible = visible;
		goog.style.setStyle(this.getElement(), 'display', this._isVisible ? '' : 'none');
	}
};

/**
 * @return {number}
 */
npf.ui.scrollBar.Scroller.prototype.getSize = function() {
	return this._size;
};

/**
 * @param {number} size
 */
npf.ui.scrollBar.Scroller.prototype.setSize = function(size) {
	if (this._size == size) {
		return;
	}

	this._size = size;

	if (this.isInDocument()) {
		this.setSizeInternal(this._size);
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
npf.ui.scrollBar.Scroller.prototype.getDimenstionCoordinate = goog.abstractMethod;

/**
 * @param {number} position
 * @protected
 */
npf.ui.scrollBar.Scroller.prototype.setRunnerElementPosition = goog.abstractMethod;

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
