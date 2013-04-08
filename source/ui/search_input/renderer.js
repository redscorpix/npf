goog.provide('npf.ui.searchInput.Renderer');

goog.require('goog.dom');
goog.require('goog.dom.TagName');
goog.require('goog.dom.forms');
goog.require('goog.style');
goog.require('npf.ui.renderComponent.Renderer');


/**
 * @constructor
 * @extends {npf.ui.renderComponent.Renderer}
 */
npf.ui.searchInput.Renderer = function() {
  goog.base(this);
};
goog.inherits(npf.ui.searchInput.Renderer, npf.ui.renderComponent.Renderer);
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
npf.ui.searchInput.Renderer.prototype.createDom = function(input) {
  /** @type {Element} */
  var element = goog.base(this, 'createDom', input);
  /** @type {Element} */
  var placeholderElement = this.createPlaceholderElement(/** @type {npf.ui.SearchInput} */ (input));
  /** @type {!Element} */
  var queryElement = this.createQueryElement(/** @type {npf.ui.SearchInput} */ (input));
  /** @type {Element} */
  var clearElement = this.createClearElement(/** @type {npf.ui.SearchInput} */ (input));
  /** @type {Element} */
  var iconElement = this.createIconElement(/** @type {npf.ui.SearchInput} */ (input));

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
 * @param {npf.ui.SearchInput} input
 * @return {Element}
 * @protected
 */
npf.ui.searchInput.Renderer.prototype.createPlaceholderElement = function(input) {
  /** @type {string} */
  var placeholderValue = input.getPlaceholderValue();
  /** @type {Element} */
  var placeholderElement = null;

  if ('' != placeholderValue) {
    placeholderElement = input.getDomHelper().createDom(goog.dom.TagName.SPAN,
      this.getPlaceholderCssClass());
    placeholderElement.innerHTML = placeholderValue;
  }

  return placeholderElement;
};

/**
 * @param {npf.ui.SearchInput} input
 * @return {!Element}
 * @protected
 */
npf.ui.searchInput.Renderer.prototype.createQueryElement = function(input) {
  return input.getDomHelper().createDom(goog.dom.TagName.INPUT, {
    'class': this.getQueryCssClass(),
    'type': 'text',
    'autocomplete': 'off'
  });
};

/**
 * @param {npf.ui.SearchInput} input
 * @return {Element}
 * @protected
 */
npf.ui.searchInput.Renderer.prototype.createClearElement = function(input) {
  /** @type {Element} */
  var clearElement = null;

  if (input.isClearable()) {
    clearElement = input.getDomHelper().createDom(goog.dom.TagName.INS,
      this.getClearCssClass());
  }

  return clearElement;
};

/**
 * @param {npf.ui.SearchInput} input
 * @return {Element}
 * @protected
 */
npf.ui.searchInput.Renderer.prototype.createIconElement = function(input) {
  /** @type {Element} */
  var iconElement = null;

  if (input.hasIcon()) {
    iconElement = input.getDomHelper().createDom(goog.dom.TagName.INS,
      this.getIconCssClass());
  }

  return iconElement;
};

/**
 * @param {Element} element
 * @return {Element}
 */
npf.ui.searchInput.Renderer.prototype.getPlaceholderElement = function(element) {
  if (element) {
    return goog.dom.getElementByClass(this.getPlaceholderCssClass(), element);
  }

  return element;
};

/**
 * @param {Element} element
 * @return {Element}
 */
npf.ui.searchInput.Renderer.prototype.getQueryElement = function(element) {
  if (element) {
    return goog.dom.getElementByClass(this.getQueryCssClass(), element);
  }

  return element;
};

/**
 * @param {Element} element
 * @return {Element}
 */
npf.ui.searchInput.Renderer.prototype.getIconElement = function(element) {
  if (element) {
    return goog.dom.getElementByClass(this.getIconCssClass(), element);
  }

  return element;
};

/**
 * @param {Element} element
 * @return {Element}
 */
npf.ui.searchInput.Renderer.prototype.getClearElement = function(element) {
  if (element) {
    return goog.dom.getElementByClass(this.getClearCssClass(), element);
  }

  return element;
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

/**
 * @return {string}
 */
npf.ui.searchInput.Renderer.prototype.getIconCssClass = function() {
  return goog.getCssName(this.getStructuralCssClass(), 'icon');
};

/**
 * @return {string}
 */
npf.ui.searchInput.Renderer.prototype.getClearCssClass = function() {
  return goog.getCssName(this.getStructuralCssClass(), 'clear');
};

/**
 * @param {Element} element
 */
npf.ui.searchInput.Renderer.prototype.focusAndSelect = function(element) {
  if (element) {
    goog.dom.forms.focusAndSelect(element);
  }
};

/**
 * @param {Element} element
 */
npf.ui.searchInput.Renderer.prototype.focus = function(element) {
  if (element) {
    element.focus();
  }
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
 * @param {boolean} visible
 */
npf.ui.searchInput.Renderer.prototype.setVisible = function(element, visible) {
  if (element) {
    goog.style.setElementShown(element, visible);
  }
};
