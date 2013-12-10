goog.provide('npf.ui.PagePaginator');
goog.provide('npf.ui.PagePaginator.EventType');

goog.require('goog.events');
goog.require('goog.events.EventType');
goog.require('goog.ui.Component.Error');
goog.require('npf.ui.RenderedComponent');
goog.require('npf.ui.pagePaginator.Changer');
goog.require('npf.ui.pagePaginator.Changer.EventType');
goog.require('npf.ui.pagePaginator.Renderer');


/**
 * @param {number} pageCount
 * @param {number=} opt_page
 * @param {npf.ui.pagePaginator.Renderer=} opt_renderer
 * @param {goog.dom.DomHelper=} opt_domHelper
 * @constructor
 * @extends {npf.ui.RenderedComponent}
 */
npf.ui.PagePaginator = function(pageCount, opt_page, opt_renderer,
    opt_domHelper) {
  goog.base(this, opt_renderer ||
    npf.ui.pagePaginator.Renderer.getInstance(), opt_domHelper);

  /**
   * @private {npf.ui.pagePaginator.Changer}
   */
  this.changer_ = null;

  /**
   * @private {boolean}
   */
  this.draggable_ = true;

  /**
   * @private {boolean}
   */
  this.loopback_ = false;

  /**
   * @private {goog.ui.Component}
   */
  this.nextPage_ = null;

  /**
   * @private {goog.ui.Component}
   */
  this.page_ = null;

  /**
   * @private {number}
   */
  this.pageCount_ = pageCount;

  /**
   * @private {number}
   */
  this.pageIndex_ = goog.isNumber(opt_page) ? opt_page % pageCount : 0;

  /**
   * @private {goog.ui.Component}
   */
  this.prevPage_ = null;
};
goog.inherits(npf.ui.PagePaginator, npf.ui.RenderedComponent);


/**
 * @enum {string}
 */
npf.ui.PagePaginator.EventType = {
  CHANGE: goog.events.getUniqueId('change')
};


/** @inheritDoc */
npf.ui.PagePaginator.prototype.createDom = function() {
  goog.base(this, 'createDom');

  this.initializeDom();
};

/** @inheritDoc */
npf.ui.PagePaginator.prototype.decorateInternal = function(element) {
  goog.base(this, 'decorateInternal', element);

  this.initializeDom();
};

/**
 * @protected
 */
npf.ui.PagePaginator.prototype.initializeDom = function() {
  /** @type {number} */
  var index;
  /** @type {number} */
  var pageCount = this.getPageCount();
  /** @type {number} */
  var pageIndex = this.getPageIndex();

  this.page_ = this.appendPage_(pageIndex);

  if (this.isLoopback() || pageIndex) {
    index = (pageCount + pageIndex - 1) % pageCount;
    this.prevPage_ = this.appendPage_(index);
  }

  if (this.isLoopback() || pageCount - 1 > pageIndex) {
    index = (pageCount + pageIndex + 1) % pageCount;
    this.nextPage_ = this.appendPage_(index);
  }
};

/** @inheritDoc */
npf.ui.PagePaginator.prototype.enterDocument = function() {
  goog.base(this, 'enterDocument');

  /** @type {goog.events.EventHandler} */
  var handler = this.getHandler();

  this.changer_ = new npf.ui.pagePaginator.Changer(this.getContainerElement(),
    this.getContentElement(), this.getPageIndex(), this.getPageCount());
  this.changer_.setDraggable(this.isDraggable());
  this.changer_.setLoopback(this.isLoopback());

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
  this.changer_.dispose();
  this.changer_ = null;

  goog.base(this, 'exitDocument');
};

/** @inheritDoc */
npf.ui.PagePaginator.prototype.disposeInternal = function() {
  goog.base(this, 'disposeInternal');

  this.changer_ = null;
  this.nextPage_ = null;
  this.page_ = null;
  this.prevPage_ = null;
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
npf.ui.PagePaginator.prototype.isLoopback = function() {
  return this.loopback_;
};

/**
 * @param {boolean} enable
 * @throws {Error} If the control is already in the document.
 */
npf.ui.PagePaginator.prototype.setLoopback = function(enable) {
  if (this.isInDocument()) {
    // Too late.
    throw Error(goog.ui.Component.Error.ALREADY_RENDERED);
  }

  this.loopback_ = enable;
};

/**
 * @return {goog.ui.Component}
 */
npf.ui.PagePaginator.prototype.getNextPage = function() {
  return this.nextPage_;
};

/**
 * @return {goog.ui.Component}
 */
npf.ui.PagePaginator.prototype.getPage = function() {
  return this.page_;
};

/**
 * @return {number}
 */
npf.ui.PagePaginator.prototype.getPageCount = function() {
  return this.pageCount_;
};

/**
 * @return {number}
 */
npf.ui.PagePaginator.prototype.getPageIndex = function() {
  return this.pageIndex_;
};

/**
 * @param {number} index
 * @protected
 */
npf.ui.PagePaginator.prototype.setPageIndexInternal = function(index) {
  this.pageIndex_ = index;
};

/**
 * @return {goog.ui.Component}
 */
npf.ui.PagePaginator.prototype.getPrevPage = function() {
  return this.prevPage_;
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
  /** @type {number} */
  var pageIndex = this.getPageIndex();
  renderer.setPrevEnabled(this, this.isLoopback() || !!pageIndex);
  renderer.setNextEnabled(
    this, this.isLoopback() || this.getPageCount() - 1 > pageIndex);
  renderer.setSelected(this, pageIndex, true);
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
 * @return {Element}
 */
npf.ui.PagePaginator.prototype.getContainerElement = function() {
  return this.getRenderer().getContainerElement(this.getElement());
};

/**
 * @return {Element}
 */
npf.ui.PagePaginator.prototype.getNextElement = function() {
  return this.getRenderer().getNextElement(this.getElement());
};

/**
 * @return {Element}
 */
npf.ui.PagePaginator.prototype.getPrevElement = function() {
  return this.getRenderer().getPrevElement(this.getElement());
};

/**
 * @protected
 */
npf.ui.PagePaginator.prototype.onChange = function() {
  this.dispatchEvent(npf.ui.PagePaginator.EventType.CHANGE);
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

/**
 * @param {npf.ui.pagePaginator.Changer.Event} evt
 * @private
 */
npf.ui.PagePaginator.prototype.onPageChange_ = function(evt) {
  /** @type {number} */
  var pageIndex = evt.page;
  /** @type {boolean} */
  var next = evt.next;
  /** @type {number} */
  var index;
  /** @type {number} */
  var pageCount = this.getPageCount();

  if (next) {
    if (this.prevPage_) {
      this.removeChild(this.prevPage_);
      this.prevPage_.dispose();
    }

    this.prevPage_ = this.page_;
    this.page_ = this.nextPage_;

    if (this.isLoopback() || pageCount - 1 > pageIndex) {
      index = (pageIndex + 1) % pageCount;
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

    if (this.isLoopback() || pageIndex) {
      index = (pageCount + pageIndex - 1) % pageCount;
      this.prevPage_ = this.appendPage_(index);
    } else {
      this.prevPage_ = null;
    }
  }

  this.getRenderer().setSelected(this, this.getPageIndex(), false);
  this.setPageIndexInternal(pageIndex);
  this.updateContent_();
  this.onChange();
};
