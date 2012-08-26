goog.provide('npf.ui.PagePaginator');
goog.provide('npf.ui.PagePaginator.EventType');

goog.require('goog.events');
goog.require('npf.events.TapHandler');
goog.require('npf.ui.RenderComponent');
goog.require('npf.ui.pagePaginator.Changer');
goog.require('npf.ui.pagePaginator.Renderer');


/**
 * @param {number} pageCount
 * @param {number=} opt_page
 * @param {npf.ui.pagePaginator.Renderer=} opt_renderer Renderer used to render or decorate the component.
 * @param {goog.dom.DomHelper=} opt_domHelper DOM helper, used for document interaction.
 * @constructor
 * @extends {npf.ui.RenderComponent}
 */
npf.ui.PagePaginator = function(pageCount, opt_page, opt_renderer,
                                opt_domHelper) {
  goog.base(this, opt_renderer ||
    npf.ui.pagePaginator.Renderer.getInstance(), opt_domHelper);

  this.pageCount_ = pageCount;

  if (goog.isNumber(opt_page)) {
    this.pageIndex_ = opt_page % this.pageCount_;
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
npf.ui.PagePaginator.prototype.pageCount_;

/**
 * @type {number}
 * @private
 */
npf.ui.PagePaginator.prototype.pageIndex_ = 0;

/**
 * @type {goog.ui.Component}
 * @private
 */
npf.ui.PagePaginator.prototype.page_ = null;

/**
 * @type {goog.ui.Component}
 * @private
 */
npf.ui.PagePaginator.prototype.nextPage_ = null;

/**
 * @type {goog.ui.Component}
 * @private
 */
npf.ui.PagePaginator.prototype.prevPage_ = null;

/**
 * @type {npf.ui.pagePaginator.Changer}
 * @private
 */
npf.ui.PagePaginator.prototype.changer_ = null;

/**
 * @type {boolean}
 * @private
 */
npf.ui.PagePaginator.prototype.draggable_ = true;


/** @inheritDoc */
npf.ui.PagePaginator.prototype.createDom = function() {
  goog.base(this, 'createDom');

  this.initializeDom_();
};

/** @inheritDoc */
npf.ui.PagePaginator.prototype.decorateInternal = function(element) {
  goog.base(this, 'decorateInternal', element);

  this.initializeDom_();
};

/**
 * @private
 */
npf.ui.PagePaginator.prototype.initializeDom_ = function() {
  /** @type {Element} */
  var element = this.getElement();
  /** @type {npf.ui.pagePaginator.Renderer} */
  var renderer = this.getRenderer();

  this.page_ = this.appendPage_(this.pageIndex_);

  if (this.pageIndex_) {
    this.prevPage_ = this.appendPage_(this.pageIndex_ - 1);
  }

  if (this.pageCount_ - 1 > this.pageIndex_) {
    this.nextPage_ = this.appendPage_(this.pageIndex_ + 1);
  }
};

/** @inheritDoc */
npf.ui.PagePaginator.prototype.enterDocument = function() {
  goog.base(this, 'enterDocument');

  /** @type {Element} */
  var containerElement = this.getContainerElement();
  /** @type {Element} */
  var contentElement = this.getContentElement();
  /** @type {goog.events.EventHandler} */
  var handler = this.getHandler();

  this.changer_ = new npf.ui.pagePaginator.Changer(containerElement,
    contentElement, this.pageIndex_, this.pageCount_);
  this.changer_.setDraggable(this.draggable_);
  this.changer_.addEventListener(
    npf.ui.pagePaginator.Changer.EventType.PAGE_CHANGE, this.onPageChange_,
    false, this);

  /** @type {Element} */
  var prevElement = this.getPrevElement();
  /** @type {Element} */
  var nextElement = this.getNextElement();

  if (prevElement) {
    var prevTapHandler = new npf.events.TapHandler(prevElement);
    this.disposeOnExitDocument(prevTapHandler);
    handler.listen(prevTapHandler, npf.events.TapHandler.EventType.TAP,
      this.onPrevTap_, false, this);
  }

  if (nextElement) {
    var nextTapHandler = new npf.events.TapHandler(nextElement);
    this.disposeOnExitDocument(nextTapHandler);
    handler.listen(nextTapHandler, npf.events.TapHandler.EventType.TAP,
      this.onNextTap_, false, this);
  }

  this.updateContent_();
};

/** @inheritDoc */
npf.ui.PagePaginator.prototype.exitDocument = function() {
  goog.dispose(this.changer_);
  this.changer_ = null;

  goog.base(this, 'exitDocument');
};

/** @inheritDoc */
npf.ui.PagePaginator.prototype.disposeInternal = function() {
  goog.base(this, 'disposeInternal');

  delete this.pageCount_;
  delete this.pageIndex_;
  delete this.page_;
  delete this.nextPage_;
  delete this.prevPage_;
  delete this.changer_;
  delete this.draggable_;
};

/**
 * @return {npf.ui.pagePaginator.Renderer}
 * @override
 */
npf.ui.PagePaginator.prototype.getRenderer = function() {
  return /** @type {npf.ui.pagePaginator.Renderer} */ (goog.base(this, 'getRenderer'));
};

/**
 * @param {npf.ui.pagePaginator.Renderer} renderer
 */
npf.ui.PagePaginator.prototype.setRenderer = function(renderer) {
  goog.base(this, 'setRenderer', renderer);
};

/**
 * @param {goog.events.BrowserEvent} evt
 * @private
 */
npf.ui.PagePaginator.prototype.onPrevTap_ = function(evt) {
  this.changer_.animatePage(false);
};

/**
 * @param {goog.events.BrowserEvent} evt
 * @private
 */
npf.ui.PagePaginator.prototype.onNextTap_ = function(evt) {
  this.changer_.animatePage(true);
};

/**
 * @param {goog.events.Event} evt
 * @private
 */
npf.ui.PagePaginator.prototype.onPageChange_ = function(evt) {
  /** @type {number} */
  var pageIndex = /** @type {number} */ (evt.page);

  if (this.pageIndex_ < pageIndex) {
    if (this.prevPage_) {
      this.removeChild(this.prevPage_);
      this.prevPage_.dispose();
    }

    this.prevPage_ = this.page_;
    this.page_ = this.nextPage_;

    if (this.pageCount_ - 1 > pageIndex) {
      this.nextPage_ = this.appendPage_(pageIndex + 1);
    } else {
      this.nextPage_ = null;
    }
  } else {
    if (this.nextPage_) {
      this.removeChild(this.nextPage_);
      this.nextPage_.dispose();
    }

    this.nextPage_ = this.page_;
    this.page_ = this.prevPage_;

    if (pageIndex) {
      this.prevPage_ = this.appendPage_(pageIndex - 1);
    } else {
      this.prevPage_ = null;
    }
  }

  this.getRenderer().setSelected(this, this.pageIndex_, false);

  this.pageIndex_ = pageIndex;

  this.updateContent_();
  this.onChange(this.pageIndex_);
};

/**
 * @param {number} index
 * @protected
 */
npf.ui.PagePaginator.prototype.onChange = function(index) {
  this.dispatchEvent({
    type: npf.ui.PagePaginator.EventType.CHANGE,
    pageIndex: this.pageIndex_
  });
};

/**
 * @private
 */
npf.ui.PagePaginator.prototype.updateContent_ = function() {
  goog.style.setStyle(this.page_.getElement(), 'left', '0px');

  if (this.prevPage_) {
    goog.style.setStyle(this.prevPage_.getElement(), 'left', '-100%');
  }

  if (this.nextPage_) {
    goog.style.setStyle(this.nextPage_.getElement(), 'left', '100%');
  }

  /** @type {npf.ui.pagePaginator.Renderer} */
  var renderer = this.getRenderer();
  renderer.setPrevEnabled(this, !!this.pageIndex_);
  renderer.setNextEnabled(this, this.pageCount_ - 1 > this.pageIndex_);
  renderer.setSelected(this, this.pageIndex_, true);
};

/**
 * @param {number} index
 * @return {!goog.ui.Component}
 * @private
 */
npf.ui.PagePaginator.prototype.appendPage_ = function(index) {
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
  return this.pageIndex_;
};

/**
 * @return {number}
 */
npf.ui.PagePaginator.prototype.getPageCount = function() {
  return this.pageCount_;
};

/**
 * @return {boolean}
 */
npf.ui.PagePaginator.prototype.isDraggable = function() {
  return this.draggable_;
};

/**
 * @param {boolean} drag
 */
npf.ui.PagePaginator.prototype.setDraggable = function(drag) {
  this.draggable_ = drag;

  if (this.changer_) {
    this.changer_.setDraggable(this.draggable_);
  }
};

/**
 * @return {Element}
 */
npf.ui.PagePaginator.prototype.getContainerElement = function() {
  return this.getRenderer().getContainerElement(this.getElement());
};

/**
 * @return {Element}
 */
npf.ui.PagePaginator.prototype.getPrevElement = function() {
  return this.getRenderer().getPrevElement(this.getElement());
};

/**
 * @return {Element}
 */
npf.ui.PagePaginator.prototype.getNextElement = function() {
  return this.getRenderer().getNextElement(this.getElement());
};
