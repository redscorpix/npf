goog.provide('npf.ui.pagePaginator.Renderer');

goog.require('goog.dom');
goog.require('goog.dom.TagName');
goog.require('goog.dom.classes');
goog.require('npf.ui.renderComponent.Renderer');


/**
 * @constructor
 * @extends {npf.ui.renderComponent.Renderer}
 */
npf.ui.pagePaginator.Renderer = function() {
  goog.base(this);
};
goog.inherits(npf.ui.pagePaginator.Renderer, npf.ui.renderComponent.Renderer);
goog.addSingletonGetter(npf.ui.pagePaginator.Renderer);


/**
 * @type {string}
 */
npf.ui.pagePaginator.Renderer.CSS_CLASS = goog.getCssName('pagePaginator');


/**
 * @param {npf.ui.PagePaginator} component
 * @return {!Element}
 */
npf.ui.pagePaginator.Renderer.prototype.createDom = function(component) {
  /** @type {!Element} */
  var element = goog.base(this, 'createDom', component);
  /** @type {Element} */
  var prevElement = this.createPrevElement();
  /** @type {Element} */
  var nextElement = this.createNextElement();
  /** @type {Element} */
  var containerElement = this.createContainerElement();
  /** @type {Element} */
  var contentElement = this.createContentElement();
  /** @type {Element} */
  var indicatorsElement = this.createPageIndicatorsElement(component);

  goog.dom.appendChild(element, prevElement);
  goog.dom.appendChild(element, nextElement);
  goog.dom.appendChild(element, indicatorsElement);
  goog.dom.appendChild(containerElement, contentElement);
  goog.dom.appendChild(element, containerElement);

  return element;
};

/**
 * @return {!Element}
 */
npf.ui.pagePaginator.Renderer.prototype.createPrevElement = function() {
  return goog.dom.createDom(goog.dom.TagName.INS, this.getPrevCssClass());
};

/**
 * @return {!Element}
 */
npf.ui.pagePaginator.Renderer.prototype.createNextElement = function() {
  return goog.dom.createDom(goog.dom.TagName.INS, this.getNextCssClass());
};

/**
 * @return {!Element}
 */
npf.ui.pagePaginator.Renderer.prototype.createContainerElement = function() {
  return goog.dom.createDom(goog.dom.TagName.DIV, this.getContainerCssClass());
};

/**
 * @return {!Element}
 */
npf.ui.pagePaginator.Renderer.prototype.createContentElement = function() {
  return goog.dom.createDom(goog.dom.TagName.DIV, this.getContentCssClass());
};

/**
 * @param {npf.ui.PagePaginator} component
 * @return {Element}
 */
npf.ui.pagePaginator.Renderer.prototype.createPageIndicatorsElement = function(component) {
  /** @type {Element} */
  var element = goog.dom.createDom(goog.dom.TagName.INS,
    this.getPageIndicatorsCssClass());
  /** @type {number} */
  var pageCount = component.getPageCount();

  for (var i = 0; i < pageCount; i++) {
    /** @type {Element} */
    var subElement = goog.dom.createDom(goog.dom.TagName.INS,
      this.getPageIndicatorCssClass());
    goog.dom.appendChild(element, subElement);
  }

  return element;
};

/** @inheritDoc */
npf.ui.pagePaginator.Renderer.prototype.getCssClass = function() {
  return npf.ui.pagePaginator.Renderer.CSS_CLASS;
};

/** @inheritDoc */
npf.ui.pagePaginator.Renderer.prototype.getContentElement = function(element) {
  if (element) {
    return goog.dom.getElementByClass(this.getContentCssClass(), element);
  }

  return null
};

/**
 * @param {Element} element
 * @return {Element}
 */
npf.ui.pagePaginator.Renderer.prototype.getContainerElement = function(element) {
  if (element) {
    return goog.dom.getElementByClass(this.getContainerCssClass(), element);
  }

  return null;
};

/**
 * @param {Element} element
 * @return {Element}
 */
npf.ui.pagePaginator.Renderer.prototype.getPrevElement = function(element) {
  if (element) {
    return goog.dom.getElementByClass(this.getPrevCssClass(), element);
  }

  return null;
};

/**
 * @param {Element} element
 * @return {Element}
 */
npf.ui.pagePaginator.Renderer.prototype.getNextElement = function(element) {
  if (element) {
    return goog.dom.getElementByClass(this.getNextCssClass(), element);
  }

  return null;
};

/**
 * @return {{length:number}}
 */
npf.ui.pagePaginator.Renderer.prototype.getPageIndicatorElements = function(element) {
  return goog.dom.getElementsByClass(this.getPageIndicatorCssClass(), element);
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
    goog.dom.classes.enable(prevElement, this.getPrevDisabledCssClass(),
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
    goog.dom.classes.enable(nextElement, this.getNextDisabledCssClass(),
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
    /** @type {{length:number}} */
    var indicatorElements = this.getPageIndicatorElements(element);

    if (indicatorElements[index]) {
      goog.dom.classes.enable(indicatorElements[index],
        this.getSelectedPageIndicatorCssClass(), select);
    }
  }
};
