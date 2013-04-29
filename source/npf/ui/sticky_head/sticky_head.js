goog.provide('npf.ui.StickyHead');

goog.require('goog.style');
goog.require('npf.ui.RenderedComponent');
goog.require('npf.ui.stickyHead.Body');
goog.require('npf.ui.stickyHead.Head');
goog.require('npf.ui.stickyHead.Renderer');


/**
 * @param {npf.ui.stickyHead.Renderer=} opt_renderer Renderer used to render or
 *                                                   decorate the component.
 * @param {goog.dom.DomHelper=} opt_domHelper DOM helper, used for document
 *                                            interaction.
 * @constructor
 * @extends {npf.ui.RenderedComponent}
 * @deprecated
 */
npf.ui.StickyHead = function(opt_renderer, opt_domHelper) {
	goog.base(this, opt_renderer ||
		npf.ui.stickyHead.Renderer.getInstance(), opt_domHelper);
};
goog.inherits(npf.ui.StickyHead, npf.ui.RenderedComponent);


/**
 * @type {npf.ui.stickyHead.Head}
 * @private
 */
npf.ui.StickyHead.prototype._head = null;

/**
 * @type {npf.ui.stickyHead.Body}
 * @private
 */
npf.ui.StickyHead.prototype._body = null;

/**
 * @type {npf.ui.stickyHead.Head}
 * @private
 */
npf.ui.StickyHead.prototype._stickyHead = null;

/**
 * @type {Element}
 * @private
 */
npf.ui.StickyHead.prototype._viewportElement = null;


/** @inheritDoc */
npf.ui.StickyHead.prototype.createDom = function() {
	goog.base(this, 'createDom');

	this.initializaDom();
};

/** @inheritDoc */
npf.ui.StickyHead.prototype.enterDocument = function() {
	goog.base(this, 'enterDocument');

	/** @type {goog.events.EventHandler} */
	var handler = this.getHandler();
	/** @type {Element|Window} */
	var scrollElement = this._viewportElement ? this._viewportElement : window;
	handler.listen(scrollElement, goog.events.EventType.SCROLL, this._onScroll);

	this.update();
};

/** @inheritDoc */
npf.ui.StickyHead.prototype.exitDocument = function() {
	this.setStickyVisible(false);

	goog.base(this, 'exitDocument');
};

/** @inheritDoc */
npf.ui.StickyHead.prototype.disposeInternal = function() {
	goog.base(this, 'disposeInternal');

	this._head = null;
	this._body = null;
	this._stickyHead = null;
	this._viewportElement = null;
};

/**
 * @param {goog.events.BrowserEvent} evt
 * @private
 */
npf.ui.StickyHead.prototype._onScroll = function(evt) {
	this.update();
};

/**
 * @protected
 */
npf.ui.StickyHead.prototype.initializaDom = function() {
	this._stickyHead = this.createStickyHead();
	this._stickyHead.setVisible(false);
	this.registerDisposable(this._stickyHead);
	this._stickyHead.render(this._viewportElement || document.body);

	this._head = this.createHead();
	this._body = this.createBody();

	this.addChild(this._head, true);
	this.addChild(this._body, true);
};

/**
 * @return {npf.ui.stickyHead.Head}
 * @protected
 */
npf.ui.StickyHead.prototype.createHead = function() {
	return new npf.ui.stickyHead.Head(false);
};

/**
 * @return {npf.ui.stickyHead.Body}
 * @protected
 */
npf.ui.StickyHead.prototype.createBody = function() {
	return new npf.ui.stickyHead.Body();
};

/**
 * @return {npf.ui.stickyHead.Head}
 * @protected
 */
npf.ui.StickyHead.prototype.createStickyHead = function() {
	return new npf.ui.stickyHead.Head(true);
};

/**
 * @return {npf.ui.stickyHead.Head}
 */
npf.ui.StickyHead.prototype.getHead = function() {
	return this._head;
};

/**
 * @return {npf.ui.stickyHead.Body}
 */
npf.ui.StickyHead.prototype.getBody = function() {
	return this._body;
};

/**
 * @return {npf.ui.stickyHead.Head}
 */
npf.ui.StickyHead.prototype.getStickyHead = function() {
	return this._stickyHead;
};

npf.ui.StickyHead.prototype.update = function() {
	if (!this.isInDocument()) {
		return;
	}

	/** @type {Element} */
	var headElement = this._head.getElement();
	/** @type {Element} */
	var bodyElement = this._body.getElement();
	/** @type {number} */
	var headTop;
	/** @type {number} */
	var bodyTop;
	/** @type {number} */
	var bodyHeight = goog.style.getBorderBoxSize(bodyElement).height;

	if (this._viewportElement) {
		headTop = goog.style.getRelativePosition(headElement, this._viewportElement).y;
		bodyTop = goog.style.getRelativePosition(bodyElement, this._viewportElement).y;
	} else {
		headTop = goog.style.getClientPosition(headElement).y;
		bodyTop = goog.style.getClientPosition(bodyElement).y;
	}

	/** @type {boolean} */
	var visible = 0 > headTop && 0 < bodyTop + bodyHeight;

	this.setStickyVisible(visible);
};

/**
 * @return {boolean}
 */
npf.ui.StickyHead.prototype.isStickyVisible = function() {
	return this._stickyHead.isVisible();
};

/**
 * @param {boolean} visible
 */
npf.ui.StickyHead.prototype.setStickyVisible = function(visible) {
	this._stickyHead.setVisible(visible);
};

/**
 * @return {Element}
 */
npf.ui.StickyHead.prototype.getViewportElement = function() {
	return this._viewportElement;
};

/**
 * @param {Element} viewportElement
 */
npf.ui.StickyHead.prototype.setViewportElement = function(viewportElement) {
	this._viewportElement = viewportElement;
};
