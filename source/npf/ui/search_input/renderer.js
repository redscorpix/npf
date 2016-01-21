goog.provide('npf.ui.searchInput.Renderer');

goog.require('goog.dom.InputType');
goog.require('goog.dom.TagName');
goog.require('goog.dom.forms');
goog.require('goog.style');
goog.require('npf.ui.Renderer');


/**
 * @constructor
 * @extends {npf.ui.Renderer}
 */
npf.ui.searchInput.Renderer = function() {
  npf.ui.searchInput.Renderer.base(this, 'constructor');
};
goog.inherits(npf.ui.searchInput.Renderer, npf.ui.Renderer);
goog.addSingletonGetter(npf.ui.searchInput.Renderer);


/**
 * @type {string}
 */
npf.ui.searchInput.Renderer.CSS_CLASS = goog.getCssName('npf-searchInput');


/** @inheritDoc */
npf.ui.searchInput.Renderer.prototype.getCssClass = function() {
  return npf.ui.searchInput.Renderer.CSS_CLASS;
};

/** @inheritDoc */
npf.ui.searchInput.Renderer.prototype.createDom = function(component) {
  var inputContainer = /** @type {npf.ui.SearchInput} */ (component);
  /** @type {!Element} */
  var element = npf.ui.searchInput.Renderer.base(this, 'createDom', component);
  /** @type {Element} */
  var placeholderElement = this.createPlaceholderElement(inputContainer);
  /** @type {!Element} */
  var queryElement = this.createQueryElement(inputContainer);
  /** @type {Element} */
  var clearElement = this.createClearElement(inputContainer);
  /** @type {Element} */
  var iconElement = this.createIconElement(inputContainer);
  /** @type {!Array<Element>} */
  var childElements = [];

  if (placeholderElement) {
    childElements.push(placeholderElement);
  }

  childElements.push(queryElement);

  if (clearElement) {
    childElements.push(clearElement);
  }

  if (iconElement) {
    childElements.push(iconElement);
  }

  component.getDomHelper().append(element, childElements);

  return element;
};

/**
 * @param {npf.ui.SearchInput} component
 * @return {Element}
 * @protected
 */
npf.ui.searchInput.Renderer.prototype.createPlaceholderElement = function(
    component) {
  /** @type {string} */
  var placeholderValue = component.getPlaceholderValue();

  if (placeholderValue) {
    return component.getDomHelper().createDom(goog.dom.TagName.SPAN, {
      'class': this.getPlaceholderCssClass(),
      'innerHTML': placeholderValue
    });
  }

  return null;
};

/**
 * @param {npf.ui.SearchInput} component
 * @return {!Element}
 * @protected
 */
npf.ui.searchInput.Renderer.prototype.createQueryElement = function(component) {
  return component.getDomHelper().createDom(goog.dom.TagName.INPUT, {
    'autocomplete': 'off',
    'class': this.getQueryCssClass(),
    'type': goog.dom.InputType.TEXT
  });
};

/**
 * @param {npf.ui.SearchInput} component
 * @return {Element}
 * @protected
 */
npf.ui.searchInput.Renderer.prototype.createClearElement = function(component) {
  if (component.isClearable()) {
    return component.getDomHelper().createDom(
      goog.dom.TagName.DIV, this.getClearCssClass());
  }

  return null;
};

/**
 * @param {npf.ui.SearchInput} component
 * @return {Element}
 * @protected
 */
npf.ui.searchInput.Renderer.prototype.createIconElement = function(component) {
  if (component.hasIcon()) {
    return component.getDomHelper().createDom(
      goog.dom.TagName.DIV, this.getIconCssClass());
  }

  return null;
};

/**
 * @param {Element} element
 * @param {boolean=} opt_select
 */
npf.ui.searchInput.Renderer.prototype.focus = function(element, opt_select) {
  if (element) {
    if (opt_select) {
      goog.dom.forms.focusAndSelect(element);
    } else {
      element.focus();
    }
  }
};

/**
 * @param {Element} element
 */
npf.ui.searchInput.Renderer.prototype.blur = function(element) {
  if (element) {
    element.blur();
  }
};

/**
 * @param {Element} element
 * @return {string}
 */
npf.ui.searchInput.Renderer.prototype.getValue = function(element) {
  var value;

  if (element) {
    value = goog.dom.forms.getValue(element);
  }

  return goog.isString(value) ? value : '';
};

/**
 * @param {Element} element
 * @param {string} value
 */
npf.ui.searchInput.Renderer.prototype.setValue = function(element, value) {
  if (element) {
    goog.dom.forms.setValue(element, value);
  }
};

/**
 * @param {Element} element
 * @param {boolean} visible
 */
npf.ui.searchInput.Renderer.prototype.setVisible = function(element, visible) {
  if (element) {
    goog.style.setElementShown(element, visible);
  }
};

/**
 * @param {Element} element
 * @return {Element}
 */
npf.ui.searchInput.Renderer.prototype.getClearElement = function(element) {
  return this.getElementByClass(this.getClearCssClass(), element);
};

/**
 * @param {Element} element
 * @return {Element}
 */
npf.ui.searchInput.Renderer.prototype.getIconElement = function(element) {
  return this.getElementByClass(this.getIconCssClass(), element);
};

/**
 * @param {Element} element
 * @return {Element}
 */
npf.ui.searchInput.Renderer.prototype.getPlaceholderElement = function(
    element) {
  return this.getElementByClass(this.getPlaceholderCssClass(), element);
};

/**
 * @param {Element} element
 * @return {Element}
 */
npf.ui.searchInput.Renderer.prototype.getQueryElement = function(element) {
  return this.getElementByClass(this.getQueryCssClass(), element);
};

/**
 * @return {string}
 */
npf.ui.searchInput.Renderer.prototype.getClearCssClass = function() {
  return goog.getCssName(this.getStructuralCssClass(), 'clear');
};

/**
 * @return {string}
 */
npf.ui.searchInput.Renderer.prototype.getIconCssClass = function() {
  return goog.getCssName(this.getStructuralCssClass(), 'icon');
};

/**
 * @return {string}
 */
npf.ui.searchInput.Renderer.prototype.getPlaceholderCssClass = function() {
  return goog.getCssName(this.getStructuralCssClass(), 'placeholder');
};

/**
 * @return {string}
 */
npf.ui.searchInput.Renderer.prototype.getQueryCssClass = function() {
  return goog.getCssName(this.getStructuralCssClass(), 'query');
};
