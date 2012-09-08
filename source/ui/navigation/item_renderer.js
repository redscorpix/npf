goog.provide('npf.ui.navigation.ItemRenderer');

goog.require('goog.dom');
goog.require('goog.dom.TagName');
goog.require('goog.dom.classes');
goog.require('npf.ui.renderComponent.Renderer');


/**
 * @constructor
 * @extends {npf.ui.renderComponent.Renderer}
 */
npf.ui.navigation.ItemRenderer = function() {
  goog.base(this);
};
goog.inherits(npf.ui.navigation.ItemRenderer, npf.ui.renderComponent.Renderer);
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
npf.ui.navigation.ItemRenderer.prototype.createDom = function(item) {
  /** @type {!Element} */
  var element = item.getDomHelper().createDom(goog.dom.TagName.A, {
    'class': this.getClassNames(item).join(' '),
    'href': item.getUrl()
  });
  this.initializeDom(/** @type {npf.ui.navigation.Item} */ (item), element);

  return element;
};

/**
 * @param {npf.ui.navigation.Item} item
 * @param {Element} element
 */
npf.ui.navigation.ItemRenderer.prototype.initializeDom = function(item,
                                                                  element) {
  this.setCaption(this.getCaptionElement(element), item.getCaption());
  this.setSelected(element, item.isSelected());
  this.setEnabled(element, item.isEnabled());
};

/**
 * @param {Element} element
 * @param {boolean} select
 */
npf.ui.navigation.ItemRenderer.prototype.setSelected = function(element,
                                                                select) {
  if (element) {
    goog.dom.classes.enable(element,
      goog.getCssName(this.getCssClass(), 'selected'), select);
  }
};

/**
 * @param {Element} element
 * @param {boolean} enable
 */
npf.ui.navigation.ItemRenderer.prototype.setEnabled = function(element,
                                                               enable) {
  if (element) {
    goog.dom.classes.enable(element,
      goog.getCssName(this.getCssClass(), 'disabled'), !enable);
  }
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
