goog.provide('npf.ui.pagePaginator.Renderer');

goog.require('goog.dom.TagName');
goog.require('goog.dom.classlist');
goog.require('npf.ui.Renderer');


/**
 * @constructor
 * @extends {npf.ui.Renderer}
 */
npf.ui.pagePaginator.Renderer = function() {
  npf.ui.pagePaginator.Renderer.base(this, 'constructor');
};
goog.inherits(npf.ui.pagePaginator.Renderer, npf.ui.Renderer);
goog.addSingletonGetter(npf.ui.pagePaginator.Renderer);


/**
 * @type {string}
 */
npf.ui.pagePaginator.Renderer.CSS_CLASS = goog.getCssName('npf-pagePaginator');


/** @override */
npf.ui.pagePaginator.Renderer.prototype.createDom = function(component) {
  /** @type {!Element} */
  var element = npf.ui.pagePaginator.Renderer.base(
    this, 'createDom', component);
  /** @type {Element} */
  var prevElement = this.createPrevElement(
    /** @type {npf.ui.PagePaginator} */ (component));
  /** @type {Element} */
  var nextElement = this.createNextElement(
    /** @type {npf.ui.PagePaginator} */ (component));
  /** @type {Element} */
  var containerElement = this.createContainerElement(
    /** @type {npf.ui.PagePaginator} */ (component));
  /** @type {Element} */
  var contentElement = this.createContentElement(
    /** @type {npf.ui.PagePaginator} */ (component));
  /** @type {Element} */
  var indicatorsElement = this.createPageIndicatorsElement(
    /** @type {npf.ui.PagePaginator} */ (component));
  /** @type {goog.dom.DomHelper} */
  var domHelper = component.getDomHelper();

  if (prevElement) {
    domHelper.appendChild(element, prevElement);
  }

  if (nextElement) {
    domHelper.appendChild(element, nextElement);
  }

  if (indicatorsElement) {
    domHelper.appendChild(element, indicatorsElement);
  }

  if (contentElement) {
    domHelper.appendChild(containerElement, contentElement);
  }

  if (containerElement) {
    domHelper.appendChild(element, containerElement);
  }

  return element;
};

/**
 * @param {npf.ui.PagePaginator} component
 * @return {Element}
 */
npf.ui.pagePaginator.Renderer.prototype.createPrevElement = function(
    component) {
  return component.getDomHelper().createDom(goog.dom.TagName.DIV,
    this.getPrevCssClass());
};

/**
 * @param {npf.ui.PagePaginator} component
 * @return {Element}
 */
npf.ui.pagePaginator.Renderer.prototype.createNextElement = function(
    component) {
  return component.getDomHelper().createDom(goog.dom.TagName.DIV,
    this.getNextCssClass());
};

/**
 * @param {npf.ui.PagePaginator} component
 * @return {Element}
 */
npf.ui.pagePaginator.Renderer.prototype.createContainerElement = function(
    component) {
  return component.getDomHelper().createDom(goog.dom.TagName.DIV,
    this.getContainerCssClass());
};

/**
 * @param {npf.ui.PagePaginator} component
 * @return {Element}
 */
npf.ui.pagePaginator.Renderer.prototype.createContentElement = function(
    component) {
  return component.getDomHelper().createDom(goog.dom.TagName.DIV,
    this.getContentCssClass());
};

/**
 * @param {npf.ui.PagePaginator} component
 * @return {Element}
 */
npf.ui.pagePaginator.Renderer.prototype.createPageIndicatorsElement = function(
    component) {
  /** @type {!Element} */
  var element = component.getDomHelper().createDom(goog.dom.TagName.DIV,
    this.getPageIndicatorsCssClass());
  /** @type {number} */
  var pageCount = component.getPageCount();
  /** @type {goog.dom.DomHelper} */
  var domHelper = component.getDomHelper();

  for (var i = 0; i < pageCount; i++) {
    /** @type {!Element} */
    var subElement = domHelper.createDom(
      goog.dom.TagName.DIV, this.getPageIndicatorCssClass());
    domHelper.appendChild(element, subElement);
  }

  return element;
};

/** @inheritDoc */
npf.ui.pagePaginator.Renderer.prototype.getCssClass = function() {
  return npf.ui.pagePaginator.Renderer.CSS_CLASS;
};

/** @inheritDoc */
npf.ui.pagePaginator.Renderer.prototype.getContentElement = function(element) {
  return this.getElementByClass(this.getContentCssClass(), element);
};

/**
 * @param {Element} element
 * @return {Element}
 */
npf.ui.pagePaginator.Renderer.prototype.getContainerElement = function(
    element) {
  return this.getElementByClass(this.getContainerCssClass(), element);
};

/**
 * @param {Element} element
 * @return {Element}
 */
npf.ui.pagePaginator.Renderer.prototype.getPrevElement = function(element) {
  return this.getElementByClass(this.getPrevCssClass(), element);
};

/**
 * @param {Element} element
 * @return {Element}
 */
npf.ui.pagePaginator.Renderer.prototype.getNextElement = function(element) {
  return this.getElementByClass(this.getNextCssClass(), element);
};

/**
 * @return {{length:number}?}
 */
npf.ui.pagePaginator.Renderer.prototype.getPageIndicatorElements = function(
    element) {
  return this.getElementsByClass(this.getPageIndicatorCssClass(), element);
};

/**
 * @param {npf.ui.PagePaginator} component
 * @param {boolean} enable
 */
npf.ui.pagePaginator.Renderer.prototype.setPrevEnabled = function(component,
    enable) {
  /** @type {Element} */
  var prevElement = component.getPrevElement();

  if (prevElement) {
    goog.dom.classlist.enable(prevElement, this.getPrevDisabledCssClass(),
      !enable);
  }
};

/**
 * @param {npf.ui.PagePaginator} component
 * @param {boolean} enable
 */
npf.ui.pagePaginator.Renderer.prototype.setNextEnabled = function(component,
    enable) {
  /** @type {Element} */
  var nextElement = component.getNextElement();

  if (nextElement) {
    goog.dom.classlist.enable(nextElement, this.getNextDisabledCssClass(),
      !enable);
  }
};

/**
 * @return {string}
 */
npf.ui.pagePaginator.Renderer.prototype.getContainerCssClass = function() {
  /** @type {string} */
  var baseClass = this.getStructuralCssClass();

  return goog.getCssName(baseClass, 'container');
};

/**
 * @return {string}
 */
npf.ui.pagePaginator.Renderer.prototype.getContentCssClass = function() {
  /** @type {string} */
  var baseClass = this.getStructuralCssClass();

  return goog.getCssName(baseClass, 'content');
};

/**
 * @return {string}
 */
npf.ui.pagePaginator.Renderer.prototype.getPrevCssClass = function() {
  /** @type {string} */
  var baseClass = this.getStructuralCssClass();

  return goog.getCssName(baseClass, 'prev');
};

/**
 * @return {string}
 */
npf.ui.pagePaginator.Renderer.prototype.getPrevDisabledCssClass = function() {
  /** @type {string} */
  var baseClass = this.getStructuralCssClass();

  return goog.getCssName(baseClass, 'prev-disabled');
};

/**
 * @return {string}
 */
npf.ui.pagePaginator.Renderer.prototype.getNextCssClass = function() {
  /** @type {string} */
  var baseClass = this.getStructuralCssClass();

  return goog.getCssName(baseClass, 'next');
};

/**
 * @return {string}
 */
npf.ui.pagePaginator.Renderer.prototype.getNextDisabledCssClass = function() {
  /** @type {string} */
  var baseClass = this.getStructuralCssClass();

  return goog.getCssName(baseClass, 'next-disabled');
};

/**
 * @return {string}
 */
npf.ui.pagePaginator.Renderer.prototype.getPageIndicatorsCssClass = function() {
  /** @type {string} */
  var baseClass = this.getStructuralCssClass();

  return goog.getCssName(baseClass, 'pageIndicators');
};

/**
 * @return {string}
 */
npf.ui.pagePaginator.Renderer.prototype.getPageIndicatorCssClass = function() {
  /** @type {string} */
  var baseClass = this.getStructuralCssClass();

  return goog.getCssName(baseClass, 'pageIndicator');
};

/**
 * @return {string}
 */
npf.ui.pagePaginator.Renderer.prototype.getSelectedPageIndicatorCssClass = function() {
  /** @type {string} */
  var baseClass = this.getStructuralCssClass();

  return goog.getCssName(baseClass, 'pageIndicator-selected');
};

/**
 * @param {npf.ui.PagePaginator} component
 * @param {number} index
 * @param {boolean} select
 */
npf.ui.pagePaginator.Renderer.prototype.setSelected = function(component, index,
    select) {
  /** @type {Element} */
  var element = component.getElement();

  if (element) {
    /** @type {{length:number}?} */
    var indicatorElements = this.getPageIndicatorElements(element);

    if (indicatorElements && indicatorElements[index]) {
      goog.dom.classlist.enable(indicatorElements[index],
        this.getSelectedPageIndicatorCssClass(), select);
    }
  }
};

/**
 * @param {Element} element
 * @param {number|string} left
 */
npf.ui.pagePaginator.Renderer.prototype.setLeft = function(element, left) {
  if (element) {
    element.style.left = goog.isNumber(left) ? left + 'px' : left;
  }
};
