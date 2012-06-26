goog.provide('npf.ui.pagePaginator.Dragger');

goog.require('goog.fx.Dragger');


/**
 * @param {Element} target The element that will be dragged.
 * @param {Element=} opt_handle An optional handle to control the drag, if null
 *     the target is used.
 * @param {goog.math.Rect=} opt_limits Object containing left, top, width,
 *     and height.
 * @constructor
 * @extends {goog.fx.Dragger}
 */
npf.ui.pagePaginator.Dragger = function(target, opt_handle, opt_limits) {
	goog.base(this, target, opt_handle, opt_limits);
};
goog.inherits(npf.ui.pagePaginator.Dragger, goog.fx.Dragger);


/**
 * @type {boolean}
 * @private
 */
npf.ui.pagePaginator.Dragger.prototype._isLeftLimit = false;

/**
 * @type {boolean}
 * @private
 */
npf.ui.pagePaginator.Dragger.prototype._isRightLimit = false;

/**
 * @type {number}
 * @private
 */
npf.ui.pagePaginator.Dragger.prototype._timeoutId;


/** @inheritDoc */
npf.ui.pagePaginator.Dragger.prototype.disposeInternal = function() {
	goog.base(this, 'disposeInternal');

	delete this._isLeftLimit;
	delete this._isRightLimit;
	delete this._timeoutId;
};

/** @inheritDoc */
npf.ui.pagePaginator.Dragger.prototype.startDrag = function(e) {
	goog.base(this, 'startDrag', e);

	if (goog.events.EventType.TOUCHSTART == e.type) {
		e.stopPropagation();
	}
};

/** @inheritDoc */
npf.ui.pagePaginator.Dragger.prototype.doDrag = function(e, x, y, dragFromScroll) {
	goog.base(this, 'doDrag', e, x, y, dragFromScroll);

	if (goog.events.EventType.TOUCHMOVE == e.type) {
		e.stopPropagation();
	}
};

/** @inheritDoc */
npf.ui.pagePaginator.Dragger.prototype.endDrag = function(e, opt_dragCanceled) {
	goog.base(this, 'endDrag', e, opt_dragCanceled);

	if (
		goog.events.EventType.TOUCHEND == e.type &&
		goog.events.EventType.TOUCHCANCEL == e.type
	) {
		e.stopPropagation();
	}
};

/** @inheritDoc */
npf.ui.pagePaginator.Dragger.prototype.defaultAction = function(x, y) {
	/** @type {number} */
	var left;

	if (
		(this._isLeftLimit && 0 < x) ||
		(this._isRightLimit && 0 > x)
	) {
		left = x / 2;
	} else {
		left = x;
	}

	this.target.style.left = left + 'px';
};

/**
 * @return {boolean}
 */
npf.ui.pagePaginator.Dragger.prototype.isLeftLimit = function() {
	return this._isLeftLimit;
};

/**
 * @param {boolean} limit
 */
npf.ui.pagePaginator.Dragger.prototype.setLeftLimit = function(limit) {
	this._isLeftLimit = limit;
};

/**
 * @return {boolean}
 */
npf.ui.pagePaginator.Dragger.prototype.isRightLimit = function() {
	return this._isRightLimit;
};

/**
 * @param {boolean} limit
 */
npf.ui.pagePaginator.Dragger.prototype.setRightLimit = function(limit) {
	this._isRightLimit = limit;
};
