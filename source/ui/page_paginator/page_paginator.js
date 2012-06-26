goog.provide('npf.ui.PagePaginator');

goog.require('goog.events');
goog.require('npf.events.TapHandler');
goog.require('npf.ui.RenderComponent');
goog.require('npf.ui.pagePaginator.Changer');
goog.require('npf.ui.pagePaginator.Renderer');


/**
 * @param {number} pageCount
 * @param {number=} opt_page
 * @param {npf.ui.pagePaginator.Renderer=} opt_renderer Renderer used to render or decorate the release.
 * @param {goog.dom.DomHelper=} opt_domHelper DOM helper, used for document interaction.
 * @constructor
 * @extends {npf.ui.RenderComponent}
 */
npf.ui.PagePaginator = function(pageCount, opt_page, opt_renderer, opt_domHelper) {
	goog.base(this, opt_renderer || npf.ui.pagePaginator.Renderer.getInstance(), opt_domHelper);

	this._pageCount = pageCount;

	if (goog.isNumber(opt_page)) {
		this._pageIndex = opt_page % this._pageCount;
	}
};
goog.inherits(npf.ui.PagePaginator, npf.ui.RenderComponent);


/**
 * @enum {string}
 */
npf.ui.PagePaginator.EventType = {
	/**
	 * pageIndex (number)
	 */
	CHANGE: goog.events.getUniqueId('change')
};

/**
 * @type {number}
 * @private
 */
npf.ui.PagePaginator.prototype._pageCount;

/**
 * @type {number}
 * @private
 */
npf.ui.PagePaginator.prototype._pageIndex = 0;

/**
 * @type {Element}
 * @private
 */
npf.ui.PagePaginator.prototype._containerElement = null;

/**
 * @type {Element}
 * @private
 */
npf.ui.PagePaginator.prototype._contentElement = null;

/**
 * @type {goog.ui.Component}
 * @private
 */
npf.ui.PagePaginator.prototype._page = null;

/**
 * @type {goog.ui.Component}
 * @private
 */
npf.ui.PagePaginator.prototype._nextPage = null;

/**
 * @type {goog.ui.Component}
 * @private
 */
npf.ui.PagePaginator.prototype._prevPage = null;

/**
 * @type {Element}
 * @private
 */
npf.ui.PagePaginator.prototype._prevElement = null;

/**
 * @type {Element}
 * @private
 */
npf.ui.PagePaginator.prototype._nextElement = null;

/**
 * @type {npf.ui.pagePaginator.Changer}
 * @private
 */
npf.ui.PagePaginator.prototype._changer = null;

/**
 * @type {boolean}
 * @private
 */
npf.ui.PagePaginator.prototype._isDraggable = true;


/** @inheritDoc */
npf.ui.PagePaginator.prototype.createDom = function() {
	goog.base(this, 'createDom');

	this._initializeDom();
};

/** @inheritDoc */
npf.ui.PagePaginator.prototype.decorateInternal = function(element) {
	goog.base(this, 'decorateInternal', element);

	this._initializeDom();
};

/**
 * @private
 */
npf.ui.PagePaginator.prototype._initializeDom = function() {
	/** @type {!Element} */
	var element = /** @type {!Element} */ (this.getElement());
	/** @type {npf.ui.pagePaginator.Renderer} */
	var renderer = /** @type {npf.ui.pagePaginator.Renderer} */ (this.getRenderer());

	this._containerElement = renderer.getContainerElement(element);
	this._contentElement = renderer.getContentElement(element);
	this._prevElement = renderer.getPrevElement(element);
	this._nextElement = renderer.getNextElement(element);

	this._page = this._appendPage(this._pageIndex);

	if (this._pageIndex) {
		this._prevPage = this._appendPage(this._pageIndex - 1);
	}

	if (this._pageCount - 1 > this._pageIndex) {
		this._nextPage = this._appendPage(this._pageIndex + 1);
	}
};

/** @inheritDoc */
npf.ui.PagePaginator.prototype.enterDocument = function() {
	goog.base(this, 'enterDocument');

	this._changer = new npf.ui.pagePaginator.Changer(/** @type {!Element} */ (this._containerElement), /** @type {!Element} */ (this._contentElement), this._pageIndex, this._pageCount);
	this._changer.setDraggable(this._isDraggable);
	this._changer.addEventListener(npf.ui.pagePaginator.Changer.EventType.PAGE_CHANGE, this._onPageChange, false, this);

	var prevTapHandler = new npf.events.TapHandler(this._prevElement);
	this.disposeOnExitDocument(prevTapHandler);

	var nextTapHandler = new npf.events.TapHandler(this._nextElement);
	this.disposeOnExitDocument(nextTapHandler);

	this.getHandler()
		.listen(prevTapHandler, npf.events.TapHandler.EventType.TAP, this._onPrevTap, false, this)
		.listen(nextTapHandler, npf.events.TapHandler.EventType.TAP, this._onNextTap, false, this);

	this._updateContent();
};

/** @inheritDoc */
npf.ui.PagePaginator.prototype.exitDocument = function() {
	goog.dispose(this._changer);
	this._changer = null;

	goog.base(this, 'exitDocument');
};

/** @inheritDoc */
npf.ui.PagePaginator.prototype.disposeInternal = function() {
	goog.base(this, 'disposeInternal');

	delete this._pageCount;
	delete this._pageIndex;
	delete this._containerElement;
	delete this._contentElement;
	delete this._page;
	delete this._nextPage;
	delete this._prevPage;
	delete this._prevElement;
	delete this._nextElement;
	delete this._changer;
	delete this._isDraggable;
};

/** @inheritDoc */
npf.ui.PagePaginator.prototype.getContentElement = function() {
	return this._contentElement;
};

/**
 * @return {Element}
 */
npf.ui.PagePaginator.prototype.getPrevElement = function() {
	return this._prevElement;
};

/**
 * @return {Element}
 */
npf.ui.PagePaginator.prototype.getNextElement = function() {
	return this._nextElement;
};

/**
 * @param {goog.events.BrowserEvent} evt
 * @private
 */
npf.ui.PagePaginator.prototype._onPrevTap = function(evt) {
	this._changer.animatePage(false);
};

/**
 * @param {goog.events.BrowserEvent} evt
 * @private
 */
npf.ui.PagePaginator.prototype._onNextTap = function(evt) {
	this._changer.animatePage(true);
};

/**
 * @param {goog.events.Event} evt
 * @private
 */
npf.ui.PagePaginator.prototype._onPageChange = function(evt) {
	/** @type {number} */
	var pageIndex = /** @type {number} */ (evt.page);

	if (this._pageIndex < pageIndex) {
		if (this._prevPage) {
			this.removeChild(this._prevPage);
			this._prevPage.dispose();
		}

		this._prevPage = this._page;
		this._page = this._nextPage;

		if (this._pageCount - 1 > pageIndex) {
			this._nextPage = this._appendPage(pageIndex + 1);
		} else {
			this._nextPage = null;
		}
	} else {
		if (this._nextPage) {
			this.removeChild(this._nextPage);
			this._nextPage.dispose();
		}

		this._nextPage = this._page;
		this._page = this._prevPage;

		if (pageIndex) {
			this._prevPage = this._appendPage(pageIndex - 1);
		} else {
			this._prevPage = null;
		}
	}

	var renderer = 	/** @type {npf.ui.pagePaginator.Renderer} */ (this.getRenderer());
	renderer.setSelected(this, this._pageIndex, false);

	this._pageIndex = pageIndex;

	this._updateContent();
	this.dispatchEvent({
		type: npf.ui.PagePaginator.EventType.CHANGE,
		pageIndex: this._pageIndex
	});
};

/**
 * @private
 */
npf.ui.PagePaginator.prototype._updateContent = function() {
	goog.style.setStyle(this._page.getElement(), 'left', '0px');

	if (this._prevPage) {
		goog.style.setStyle(this._prevPage.getElement(), 'left', '-100%');
	}

	if (this._nextPage) {
		goog.style.setStyle(this._nextPage.getElement(), 'left', '100%');
	}

	var renderer = 	/** @type {npf.ui.pagePaginator.Renderer} */ (this.getRenderer());
	renderer.setPrevEnabled(this, !!this._pageIndex);
	renderer.setNextEnabled(this, this._pageCount - 1 > this._pageIndex);
	renderer.setSelected(this, this._pageIndex, true);
};

/**
 * @param {number} index
 * @return {!goog.ui.Component}
 * @private
 */
npf.ui.PagePaginator.prototype._appendPage = function(index) {
	var page = this.createPage(index);
	this.addChild(page, true);

	return page;
};

/**
 * @param {number} index
 * @return {!goog.ui.Component}
 * @protected
 */
npf.ui.PagePaginator.prototype.createPage = goog.abstractMethod;

/**
 * @return {number}
 */
npf.ui.PagePaginator.prototype.getPageIndex = function() {
	return this._pageIndex;
};

/**
 * @return {number}
 */
npf.ui.PagePaginator.prototype.getPageCount = function() {
	return this._pageCount;
};

/**
 * @return {boolean}
 */
npf.ui.PagePaginator.prototype.isDraggable = function() {
	return this._isDraggable;
};

/**
 * @param {boolean} drag
 */
npf.ui.PagePaginator.prototype.setDraggable = function(drag) {
	this._isDraggable = drag;

	if (this._changer) {
		this._changer.setDraggable(this._isDraggable);
	}
};
