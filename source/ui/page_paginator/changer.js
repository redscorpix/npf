goog.provide('npf.ui.pagePaginator.Changer');

goog.require('goog.Timer');
goog.require('goog.dom');
goog.require('goog.dom.TagName');
goog.require('goog.events');
goog.require('goog.events.EventHandler');
goog.require('goog.events.EventTarget');
goog.require('goog.math');
goog.require('goog.math.Rect');
goog.require('goog.object');
goog.require('goog.style');
goog.require('goog.userAgent');
goog.require('npf.fx.KeyframeAnimation');
goog.require('npf.userAgent.support');
goog.require('npf.ui.pagePaginator.Dragger');


/**
 * @param {!Element} element
 * @param {!Element} contentElement
 * @param {number} page
 * @param {number} pageCount
 * @constructor
 * @extends {goog.events.EventTarget}
 */
npf.ui.pagePaginator.Changer = function(element, contentElement, page, pageCount) {
	goog.base(this);

	this._element = element;
	this._contentElement = contentElement;
	this._pageIndex = page;
	this._pageCount = pageCount;

	this._handler = new goog.events.EventHandler();
	this.registerDisposable(this._handler);

	this._handler.listen(window, goog.events.EventType.RESIZE, this._onResize, false, this);

	this._update();
};
goog.inherits(npf.ui.pagePaginator.Changer, goog.events.EventTarget);


/**
 * @typedef {{
 * 	time: number,
 * 	x: number
 * }}
 */
npf.ui.pagePaginator.Changer.Stamp;

/**
 * @enum {string}
 */
npf.ui.pagePaginator.Changer.EventType = {
	/**
	 * page (number)
	 */
	PAGE_CHANGE: goog.events.getUniqueId('pageChange')
};

/**
 * @type {number}
 * @const
 */
npf.ui.pagePaginator.Changer.DURATION = 500;

/**
 * @type {!Element}
 * @private
 */
npf.ui.pagePaginator.Changer.prototype._element;

/**
 * @type {!Element}
 * @private
 */
npf.ui.pagePaginator.Changer.prototype._contentElement;

/**
 * @type {number}
 * @private
 */
npf.ui.pagePaginator.Changer.prototype._pageIndex;

/**
 * @type {number}
 * @private
 */
npf.ui.pagePaginator.Changer.prototype._pageCount;

/**
 * @type {!goog.events.EventHandler}
 * @private
 */
npf.ui.pagePaginator.Changer.prototype._handler;

/**
 * @type {npf.ui.pagePaginator.Dragger}
 * @private
 */
npf.ui.pagePaginator.Changer.prototype._dragger = null;

/**
 * @type {?boolean}
 * @private
 */
npf.ui.pagePaginator.Changer.prototype._queueNext = null;

/**
 * @type {npf.fx.KeyframeAnimation}
 * @private
 */
npf.ui.pagePaginator.Changer.prototype._animation = null;

/**
 * @type {Array.<npf.ui.pagePaginator.Changer.Stamp>}
 * @private
 */
npf.ui.pagePaginator.Changer.prototype._dragStamps = null;

/**
 * @type {number}
 * @private
 */
npf.ui.pagePaginator.Changer.prototype._width;

/**
 * @type {Element}
 * @private
 */
npf.ui.pagePaginator.Changer.prototype._emptyElement = null;

/**
 * @type {boolean}
 * @private
 */
npf.ui.pagePaginator.Changer.prototype._isDraggable = true;


/** @inheritDoc */
npf.ui.pagePaginator.Changer.prototype.disposeInternal = function() {
	goog.dispose(this._dragger);
	goog.dispose(this._animation);

	goog.base(this, 'disposeInternal');

	delete this._element;
	delete this._contentElement;
	delete this._pageIndex;
	delete this._pageCount;
	delete this._dragger;
	delete this._queueNext;
	delete this._animation;
	delete this._dragStamps;
	delete this._width;
	delete this._emptyElement;
	delete this._isDraggable;
};

/**
 * @param {goog.events.BrowserEvent} evt
 * @private
 */
npf.ui.pagePaginator.Changer.prototype._onResize = function(evt) {
	this._update();
};

npf.ui.pagePaginator.Changer.prototype._update = function() {
	this._width = goog.style.getBorderBoxSize(this._element).width;

	if (this._isDraggable) {
		this._reinitDragger();
	}
};

/**
 * @return {!Element}
 */
npf.ui.pagePaginator.Changer.prototype.getElement = function() {
	return this._element;
};

/**
 * @return {!Element}
 */
npf.ui.pagePaginator.Changer.prototype.getContentElement = function() {
	return this._contentElement;
};

/**
 * @return {number}
 */
npf.ui.pagePaginator.Changer.prototype.getPageIndex = function() {
	return this._pageIndex;
};

/**
 * @return {number}
 */
npf.ui.pagePaginator.Changer.prototype.getPageCount = function() {
	return this._pageCount;
};

/**
 * @private
 */
npf.ui.pagePaginator.Changer.prototype._reinitDragger = function() {
	goog.dispose(this._dragger);

	/** @type {!goog.math.Rect} */
	var draggerLimits = new goog.math.Rect(-this._width, 0, 2 * this._width, 0);

	this._dragger = new npf.ui.pagePaginator.Dragger(this._contentElement, this._element, draggerLimits);
	this._dragger.addEventListener(goog.fx.Dragger.EventType.START, this._onDragStart, false, this);
	this._dragger.addEventListener(goog.fx.Dragger.EventType.DRAG, this._onDrag, false, this);
	this._dragger.addEventListener(goog.fx.Dragger.EventType.END, this._onDragEnd, false, this);

	if (!this._pageIndex) {
		this._dragger.setLeftLimit(true);
	}

	if (this._pageCount - 1 == this._pageIndex) {
		this._dragger.setRightLimit(true);
	}
};

/**
 * @param {goog.fx.DragEvent} evt
 * @private
 */
npf.ui.pagePaginator.Changer.prototype._onDragStart = function(evt) {
	/** @type {number} */
	var left = evt.left;

	this._dragStamps = [{
		time: goog.now(),
		x: left
	}];
};

/**
 * @param {goog.fx.DragEvent} evt
 * @private
 */
npf.ui.pagePaginator.Changer.prototype._onDrag = function(evt) {
	/** @type {number} */
	var left = evt.left;

	if (1 < this._dragStamps.length) {
		/** @type {number} */
		var x1 = this._dragStamps[this._dragStamps.length - 2].x;
		/** @type {number} */
		var x2 = this._dragStamps[this._dragStamps.length - 1].x;

		if (goog.math.sign(x2 - x1) != goog.math.sign(left - x2)) {
			this._dragStamps = [this._dragStamps[this._dragStamps.length - 1]];
		}
	}

	this._dragStamps.push({
		time: goog.now(),
		x: left
	});

	if (!this._emptyElement && 10 < Math.abs(this._dragStamps[0].x - left)) {
		this._emptyElement = goog.dom.createElement(goog.dom.TagName.DIV);
		goog.style.setStyle(this._emptyElement, {
			'height': '100%',
			'left': '0px',
			'position': 'absolute',
			'top': '0px',
			'width': '100%'
		});
		goog.dom.appendChild(this._element, this._emptyElement);
	}
};

/**
 * @param {goog.fx.DragEvent} evt
 * @private
 */
npf.ui.pagePaginator.Changer.prototype._onDragEnd = function(evt) {
	/** @type {number} */
	var direction = 0;
	/** @type {number} */
	var pointCount = this._dragStamps.length;
	/** @type {Array.<number>} */
	var timing = null;

	if (2 < pointCount) {
		// По двум последним точкам с помощью уравнения прямой узнаем, остановил ли пользователь анимацию.

		/** @type {number} */
		var x1 = this._dragStamps[pointCount - 2].time - this._dragStamps[pointCount - 3].time;
		/** @type {number} */
		var y1 = Math.abs(this._dragStamps[pointCount - 2].x - this._dragStamps[pointCount - 3].x);
		/** @type {number} */
		var x2 = this._dragStamps[pointCount - 1].time - this._dragStamps[pointCount - 2].time;
		/** @type {number} */
		var y2 = Math.abs(this._dragStamps[pointCount - 1].x - this._dragStamps[pointCount - 2].x);
		/**
		 * timestamp при y3 = 0
		 * @type {number}
		 */
		var x3 = y1 - y2 ? (x2 * y1 - x1 * y2) / (y1 - y2) : 0;

		if (10 < x3) {
			direction = 0 < this._dragStamps[pointCount - 1].x - this._dragStamps[pointCount - 2].x ? 1 : -1;
			timing = [0, 0, 0, 1];
		}
	}

	this._dragStamps = null;

	/** @type {number} */
	var left = parseInt(goog.style.getStyle(this._contentElement, 'left'), 10);
	/** @type {number} */
	var pageIndex = this._pageIndex;

	if (
		this._pageCount - 1 > this._pageIndex &&
		((left < -this._width / 2 && 0 >= direction) || (left < this._width / 2 && 0 > direction))
	) {
		pageIndex++;
		left += this._width;
	} else if (
		this._pageIndex &&
		((left > this._width / 2 && 0 <= direction) || (left > -this._width / 2 && 0 < direction))
	) {
		pageIndex--;
		left -= this._width;
	}

	if (this._pageIndex != pageIndex) {
		this._pageIndex = pageIndex;

		this.dispatchEvent({
			type: npf.ui.pagePaginator.Changer.EventType.PAGE_CHANGE,
			page: this._pageIndex
		});

		if (this._isDraggable) {
			this._reinitDragger();
		}
	}

	goog.style.setStyle(this._contentElement, 'left', '');
	goog.dom.removeNode(this._emptyElement);
	this._emptyElement = null;
	this._animateReturn(left, direction ? timing : null);
};

/**
 * @param {boolean} next
 */
npf.ui.pagePaginator.Changer.prototype.animatePage = function(next) {
	if (this._animation) {
		this._queueNext = next;

		return;
	}

	if (
		(next && this._pageCount - 1 == this._pageIndex) ||
		(!next && !this._pageIndex)
	) {
		return;
	}

	if (next) {
		this._pageIndex++;
	} else {
		this._pageIndex--;
	}

	/** @type {number} */
	var from = next ? this._width : -this._width;
	/** @type {!Object} */
	var fromProperties;
	/** @type {!Object} */
	var toProperties;

	if (goog.userAgent.MOBILE) {
		/** @type {string} */
		var transformCss = npf.userAgent.support.getCssPropertyName('transform');

		fromProperties = goog.object.create(
			transformCss, 'translate(' + from + 'px,0px)'
		);
		toProperties = goog.object.create(
			transformCss, 'translate(0px,0px)'
		);
	} else {
		fromProperties = goog.object.create(
			'left', from + 'px'
		);
		toProperties = goog.object.create(
			'left', '0px'
		);
	}

	this.dispatchEvent({
		type: npf.ui.pagePaginator.Changer.EventType.PAGE_CHANGE,
		page: this._pageIndex
	});

	this._animation = new npf.fx.KeyframeAnimation(this._contentElement, npf.ui.pagePaginator.Changer.DURATION, [0.25, 0.1, 0.25, 1]);
	this._animation.addEventListener(npf.fx.keyframeAnimation.EventType.FINISH, this._onAnimationFinish, false, this);
	this._animation.from(fromProperties);
	this._animation.to(toProperties);
	this._animation.play();
};

/**
 * @param {npf.fx.keyframeAnimation.Event} evt
 * @private
 */
npf.ui.pagePaginator.Changer.prototype._onAnimationFinish = function(evt) {
	goog.dispose(this._animation);
	this._animation = null;

	if (this._isDraggable) {
		this._reinitDragger();
	}

	goog.Timer.callOnce(function() {
		if (!this.isDisposed() && goog.isBoolean(this._queueNext)) {
			/** @type {boolean} */
			var direction = this._queueNext;
			this._queueNext = null;
			this.animatePage(direction);
		}
	}, 0, this);
};

/**
 * @param {number} fromX
 * @param {Array.<number>=} opt_timing
 * @private
 */
npf.ui.pagePaginator.Changer.prototype._animateReturn = function(fromX, opt_timing) {
	goog.dispose(this._animation);

	/** @type {!Array.<number>} */
	var timing = opt_timing || [0.25, 0.1, 0.25, 1];
	/** @type {!Object} */
	var fromProperties;
	/** @type {!Object} */
	var toProperties;

	if (goog.userAgent.MOBILE) {
		/** @type {string} */
		var transformCss = npf.userAgent.support.getCssPropertyName('transform');

		fromProperties = goog.object.create(
			transformCss, 'translate(' + fromX + 'px,0px)'
		);
		toProperties = goog.object.create(
			transformCss, 'translate(0px,0px)'
		);
	} else {
		fromProperties = goog.object.create(
			'left', fromX + 'px'
		);
		toProperties = goog.object.create(
			'left', '0px'
		);
	}

	this._animation = new npf.fx.KeyframeAnimation(this._contentElement, npf.ui.pagePaginator.Changer.DURATION, timing);
	this._animation.addEventListener(npf.fx.keyframeAnimation.EventType.FINISH, this._onReturnAnimationFinish, false, this);
	this._animation.from(fromProperties);
	this._animation.to(toProperties);
	this._animation.play();
};

/**
 * @param {npf.fx.keyframeAnimation.Event} evt
 * @private
 */
npf.ui.pagePaginator.Changer.prototype._onReturnAnimationFinish = function(evt) {
	goog.dispose(this._animation);
	this._animation = null;

	goog.Timer.callOnce(function() {
		if (!this.isDisposed() && goog.isBoolean(this._queueNext)) {
			/** @type {boolean} */
			var direction = this._queueNext;
			this._queueNext = null;
			this.animatePage(direction);
		}
	}, 0, this);
};

/**
 * @return {boolean}
 */
npf.ui.pagePaginator.Changer.prototype.isDraggable = function() {
	return this._isDraggable;
};

/**
 * @param {boolean} drag
 */
npf.ui.pagePaginator.Changer.prototype.setDraggable = function(drag) {
	this._isDraggable = drag;

	if (!this._isDraggable) {
		goog.dispose(this._dragger);
		this._dragger = null;
	}
};
