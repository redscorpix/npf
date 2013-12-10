goog.provide('npf.ui.navigation.ItemRenderer');

goog.require('goog.dom');
goog.require('goog.dom.TagName');
goog.require('goog.dom.classlist');
goog.require('npf.ui.Renderer');


/**
 * @constructor
 * @extends {npf.ui.Renderer}
 */
npf.ui.navigation.ItemRenderer = function() {
  goog.base(this);
};
goog.inherits(npf.ui.navigation.ItemRenderer, npf.ui.Renderer);
goog.addSingletonGetter(npf.ui.navigation.ItemRenderer);


/**
 * @type {string}
 */
npf.ui.navigation.ItemRenderer.CSS_CLASS =
  goog.getCssName('npf-navigation-item');


/** @inheritDoc */
npf.ui.navigation.ItemRenderer.prototype.getCssClass = function() {
  return npf.ui.navigation.ItemRenderer.CSS_CLASS;
};

/** @override */
npf.ui.navigation.ItemRenderer.prototype.createDom = function(component) {
  /** @type {!Element} */
  var element = component.getDomHelper().createDom(goog.dom.TagName.A, {
    'class': this.getClassNames(component).join(' '),
    'href': component.getUrl()
  });
  this.applyClassNames(component, element);

  return element;
};

/**
 * @param {Element} element
 * @param {string} caption
 */
npf.ui.navigation.ItemRenderer.prototype.setCaption = function(element,
    caption) {
  if (element) {
    element.innerHTML = caption;
  }
};

/**
 * @param {Element} element
 * @param {boolean} enable
 */
npf.ui.navigation.ItemRenderer.prototype.setEnabled = function(element,
    enable) {
  if (element) {
    goog.dom.classlist.enable(element, this.getDisabledCssClass(), !enable);
  }
};

/**
 * @param {Element} element
 * @param {boolean} select
 */
npf.ui.navigation.ItemRenderer.prototype.setSelected = function(element,
    select) {
  if (element) {
    goog.dom.classlist.enable(element, this.getSelectedCssClass(), select);
  }
};

/**
 * @param {Element} element
 * @param {string} url
 */
npf.ui.navigation.ItemRenderer.prototype.setUrl = function(element, url) {
  if (element) {
    goog.dom.setProperties(element, {
      'href': url
    });
  }
};

/**
 * @param {Element} element
 * @return {Element}
 */
npf.ui.navigation.ItemRenderer.prototype.getCaptionElement = function(element) {
  return element;
};

/**
 * @param {Element} element
 * @return {Element}
 */
npf.ui.navigation.ItemRenderer.prototype.getLinkElement = function(element) {
  return element;
};

/**
 * @return {string}
 */
npf.ui.navigation.ItemRenderer.prototype.getDisabledCssClass = function() {
  return goog.getCssName(this.getStructuralCssClass(), 'disabled');
};

/**
 * @return {string}
 */
npf.ui.navigation.ItemRenderer.prototype.getSelectedCssClass = function() {
  return goog.getCssName(this.getStructuralCssClass(), 'selected');
};
