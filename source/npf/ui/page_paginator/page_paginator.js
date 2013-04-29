goog.provide('npf.ui.PagePaginator');
goog.provide('npf.ui.PagePaginator.EventType');

goog.require('goog.events');
goog.require('npf.ui.RenderedComponent');
goog.require('npf.ui.pagePaginator.Changer');
goog.require('npf.ui.pagePaginator.Renderer');


/**
 * @param {number} pageCount
 * @param {number=} opt_page
 * @param {npf.ui.pagePaginator.Renderer=} opt_renderer Renderer used to render or decorate the component.
 * @param {goog.dom.DomHelper=} opt_domHelper DOM helper, used for document interaction.
 * @constructor
 * @extends {npf.ui.RenderedComponent}
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
goog.inherits(npf.ui.PagePaginator, npf.ui.RenderedComponent);


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

/**
 * @type {boolean}
 * @private
 */
npf.ui.PagePaginator.prototype.ring_ = false;


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
  var renderer = this.getRenderer();
  /** @type {number} */
  var index;

  this.page_ = this.appendPage_(this.pageIndex_);

  if (this.ring_ || this.pageIndex_) {
    index = (this.pageCount_ + this.pageIndex_ - 1) % this.pageCount_;
    this.prevPage_ = this.appendPage_(index);
  }

  if (this.ring_ || this.pageCount_ - 1 > this.pageIndex_) {
    index = (this.pageCount_ + this.pageIndex_ + 1) % this.pageCount_;
    this.nextPage_ = this.appendPage_(index);
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
  this.changer_.setRing(this.ring_);
  handler.listen(this.changer_,
    npf.ui.pagePaginator.Changer.EventType.PAGE_CHANGE, this.onPageChange_);
  this.changer_.init();

  /** @type {Element} */
  var prevElement = this.getPrevElement();
  /** @type {Element} */
  var nextElement = this.getNextElement();

  if (prevElement) {
    handler.listen(prevElement, goog.events.EventType.CLICK, this.onPrevClick_);
  }

  if (nextElement) {
    handler.listen(nextElement, goog.events.EventType.CLICK, this.onNextClick_);
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

  this.page_ = null;
  this.nextPage_ = null;
  this.prevPage_ = null;
  this.changer_ = null;
};

/**
 * @param {goog.events.BrowserEvent} evt
 * @private
 */
npf.ui.PagePaginator.prototype.onPrevClick_ = function(evt) {
  this.prev();
};

/**
 * @param {goog.events.BrowserEvent} evt
 * @private
 */
npf.ui.PagePaginator.prototype.onNextClick_ = function(evt) {
  this.next();
};

npf.ui.PagePaginator.prototype.next = function() {
  if (this.changer_) {
    this.changer_.animatePage(true);
  }
};

npf.ui.PagePaginator.prototype.prev = function() {
  if (this.changer_) {
    this.changer_.animatePage(false);
  }
};

/**
 * @param {goog.events.Event} evt
 * @private
 */
npf.ui.PagePaginator.prototype.onPageChange_ = function(evt) {
  var pageIndex = /** @type {number} */ (evt.page);
  var next = /** @type {boolean} */ (evt.next);
  /** @type {number} */
  var index;

  if (next) {
    if (this.prevPage_) {
      this.removeChild(this.prevPage_);
      this.prevPage_.dispose();
    }

    this.prevPage_ = this.page_;
    this.page_ = this.nextPage_;

    if (this.ring_ || this.pageCount_ - 1 > pageIndex) {
      index = (pageIndex + 1) % this.pageCount_;
      this.nextPage_ = this.appendPage_(index);
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

    if (this.ring_ || pageIndex) {
      index = (this.pageCount_ + pageIndex - 1) % this.pageCount_;
      this.prevPage_ = this.appendPage_(index);
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
  this.getRenderer().setLeft(this.page_.getElement(), 0);

  if (this.prevPage_) {
    this.getRenderer().setLeft(this.prevPage_.getElement(), '-100%');
  }

  if (this.nextPage_) {
    this.getRenderer().setLeft(this.nextPage_.getElement(), '100%');
  }

  var renderer = this.getRenderer();
  renderer.setPrevEnabled(this, this.ring_ || !!this.pageIndex_);
  renderer.setNextEnabled(
    this, this.ring_ || this.pageCount_ - 1 > this.pageIndex_);
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
 * @return {boolean}
 */
npf.ui.PagePaginator.prototype.isRing = function() {
  return this.ring_;
};

/**
 * @param {boolean} enable
 * @throws {Error} If the control is already in the document.
 */
npf.ui.PagePaginator.prototype.setRing = function(enable) {
  if (this.isInDocument()) {
    // Too late.
    throw Error(goog.ui.Component.Error.ALREADY_RENDERED);
  }

  this.ring_ = enable;
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
