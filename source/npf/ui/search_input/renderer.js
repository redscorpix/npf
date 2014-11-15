goog.provide('npf.ui.searchInput.Renderer');

goog.require('goog.dom');
goog.require('goog.dom.TagName');
goog.require('goog.dom.forms');
goog.require('goog.style');
goog.require('npf.ui.Renderer');


/**
 * @constructor
 * @extends {npf.ui.Renderer}
 */
npf.ui.searchInput.Renderer = function() {
  goog.base(this);
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

/** @override */
npf.ui.searchInput.Renderer.prototype.createDom = function(component) {
  var inputContainer = /** @type {npf.ui.SearchInput} */ (component);
  /** @type {Element} */
  var element = goog.base(this, 'createDom', component);
  /** @type {Element} */
  var placeholderElement = this.createPlaceholderElement(inputContainer);
  /** @type {!Element} */
  var queryElement = this.createQueryElement(inputContainer);
  /** @type {Element} */
  var clearElement = this.createClearElement(inputContainer);
  /** @type {Element} */
  var iconElement = this.createIconElement(inputContainer);

  if (placeholderElement) {
    goog.dom.appendChild(element, placeholderElement);
  }

  goog.dom.appendChild(element, queryElement);

  if (clearElement) {
    goog.dom.appendChild(element, clearElement);
  }

  if (iconElement) {
    goog.dom.appendChild(element, iconElement);
  }

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
  /** @type {Element} */
  var placeholderElement = null;

  if ('' != placeholderValue) {
    placeholderElement = component.getDomHelper().createDom(
      goog.dom.TagName.SPAN, this.getPlaceholderCssClass());
    placeholderElement.innerHTML = placeholderValue;
  }

  return placeholderElement;
};

/**
 * @param {npf.ui.SearchInput} component
 * @return {!Element}
 * @protected
 */
npf.ui.searchInput.Renderer.prototype.createQueryElement = function(component) {
  return component.getDomHelper().createDom(goog.dom.TagName.INPUT, {
    'class': this.getQueryCssClass(),
    'type': 'text',
    'autocomplete': 'off'
  });
};

/**
 * @param {npf.ui.SearchInput} component
 * @return {Element}
 * @protected
 */
npf.ui.searchInput.Renderer.prototype.createClearElement = function(component) {
  /** @type {Element} */
  var clearElement = null;

  if (component.isClearable()) {
    clearElement = component.getDomHelper().createDom(goog.dom.TagName.INS,
      this.getClearCssClass());
  }

  return clearElement;
};

/**
 * @param {npf.ui.SearchInput} component
 * @return {Element}
 * @protected
 */
npf.ui.searchInput.Renderer.prototype.createIconElement = function(component) {
  /** @type {Element} */
  var iconElement = null;

  if (component.hasIcon()) {
    iconElement = component.getDomHelper().createDom(goog.dom.TagName.INS,
      this.getIconCssClass());
  }

  return iconElement;
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
<<<<<<< HEAD
npf.ui.searchInput.Renderer.prototype.setVisible = function(element, visible) {
  if (element) {
    goog.style.setElementShown(element, visible);
  }
=======
npf.ui.searchInput.Renderer.prototype.getQueryCssClass = function() {
  return goog.getCssName(this.getStructuralCssClass(), 'query');
>>>>>>> 5b6e092b0dc9f1e7bfa126dd948a17868bb57405
};
