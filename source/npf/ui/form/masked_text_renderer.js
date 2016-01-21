goog.provide('npf.ui.form.MaskedTextRenderer');

goog.require('goog.array');
goog.require('goog.dom.TagName');
goog.require('goog.dom.classlist');
goog.require('goog.dom.selection');
goog.require('npf.ui.form.TextRenderer');


/**
 * @constructor
 * @struct
 * @extends {npf.ui.form.TextRenderer}
 */
npf.ui.form.MaskedTextRenderer = function() {
  npf.ui.form.MaskedTextRenderer.base(this, 'constructor');
};
goog.inherits(npf.ui.form.MaskedTextRenderer, npf.ui.form.TextRenderer);
goog.addSingletonGetter(npf.ui.form.MaskedTextRenderer);


/** @inheritDoc */
npf.ui.form.MaskedTextRenderer.prototype.appendContent = function(component,
    element) {
  npf.ui.form.MaskedTextRenderer.base(
    this, 'appendContent', component, element);

  var field = /** @type {npf.ui.form.MaskedText} */ (component);
  /** @type {goog.dom.DomHelper} */
  var domHelper = component.getDomHelper();
  /** @type {!Element} */
  var maskPlaceholderElement = domHelper.createDom(
    goog.dom.TagName.DIV, this.getMaskPlaceholderCssClass());
  /** @type {number} */
  var maskLength = field.getMask().length;
  /** @type {Element} */
  var valueElement = this.getValueElement(element);

  for (var i = 0; i < maskLength; i++) {
    /** @type {!Element} */
    var maskPlaceholderSymbolElement =
      this.createMaskPlaceholderSymbolElement(field, i);
    domHelper.appendChild(maskPlaceholderElement, maskPlaceholderSymbolElement);
  }

  domHelper.insertSiblingBefore(maskPlaceholderElement, valueElement);
};

/** @inheritDoc */
npf.ui.form.MaskedTextRenderer.prototype.setValue = function(component, value) {
  var field = /** @type {npf.ui.form.MaskedText} */ (component);
  /** @type {string} */
  var text = field.convertValueToMaskedText(/** @type {string} */ (value));

  if (field.isPlaceholderEnabled() && !field.isFocused() && !value) {
    text = '';
  }

  /** @type {string} */
  var mask = field.getMask();
  /** @type {{length: number}?} */
  var maskSymbolElements = field.getMaskPlaceholderSymbolElements();
  /** @type {string} */
  var maskPlaceholderSymbol = field.getMaskPlaceholderSymbol();

  if (maskSymbolElements) {
    goog.array.forEach(maskSymbolElements, function(element, i) {
      /** @type {string} */
      var valueChar = text.charAt(i);
      var ch = valueChar;

      if (!ch) {
        ch = field.isMaskedSymbol(i) ? maskPlaceholderSymbol : mask.charAt(i);
      }

      // Меняем обычный пробел на неразрывный
      if (' ' == ch) {
        ch = ' ';
      }

      element.innerHTML = ch;
      this.setMaskPlaceholderSymbolElementVisible(element, i, !valueChar);
    }, this);
  }

  npf.ui.form.MaskedTextRenderer.base(this, 'setValue', component, text);
};

/**
 * @param {npf.ui.form.MaskedText} component
 * @return {Array.<number>}
 */
npf.ui.form.MaskedTextRenderer.prototype.getCaret = function(component) {
  /** @type {Element} */
  var valueElement = component.getValueElement();

  return valueElement ? goog.dom.selection.getEndPoints(valueElement) : [0, 0];
};

/**
 * @param {npf.ui.form.MaskedText} component
 * @param {number} start
 * @param {number=} opt_end
 */
npf.ui.form.MaskedTextRenderer.prototype.setCaret = function(component, start,
    opt_end) {
  /** @type {Element} */
  var valueElement = component.getValueElement();

  if (valueElement) {
    /** @type {number} */
    var end = goog.isNumber(opt_end) ? opt_end : start;

    goog.dom.selection.setStart(valueElement, start);
    goog.dom.selection.setEnd(valueElement, end);
  }
};

/**
 * @param {Element} element
 * @return {Element}
 */
npf.ui.form.MaskedTextRenderer.prototype.getMaskPlaceholderElement = function(
    element) {
  return this.getElementByClass(this.getMaskPlaceholderCssClass(), element);
};

/**
 * @param {npf.ui.form.MaskedText} component
 * @param {boolean} visible
 */
npf.ui.form.MaskedTextRenderer.prototype.setMaskPlaceholderVisible = function(
    component, visible) {
  this.setVisible(component.getMaskPlaceholderElement(), visible);
};

/**
 * @param {npf.ui.form.MaskedText} component
 * @param {number} index
 * @return {!Element}
 */
npf.ui.form.MaskedTextRenderer.prototype.createMaskPlaceholderSymbolElement =
    function(component, index) {
  var field = /** @type {npf.ui.form.MaskedText} */ (component);
  /** @type {!Array.<string>} */
  var cssClasses = [this.getMaskPlaceholderSymbolCssClass()];

  if (field.isMaskedSymbol(index)) {
    cssClasses.push(this.getMaskPlaceholderMaskSymbolCssClass());
  }

  return component.getDomHelper().createDom(goog.dom.TagName.DIV, cssClasses);
};

/**
 * @param {Element} element
 * @param {number} index
 * @param {boolean} visible
 */
npf.ui.form.MaskedTextRenderer.prototype.setMaskPlaceholderSymbolElementVisible =
    function(element, index, visible) {
  if (element) {
    goog.dom.classlist.enable(
      element, this.getMaskPlaceholderSymbolHiddenCssClass(), !visible);
  }
};

/**
 * @param {Element} element
 * @return {{length: number}?}
 */
npf.ui.form.MaskedTextRenderer.prototype.getMaskPlaceholderSymbolElements =
    function(element) {
  return this.getElementsByClass(
    this.getMaskPlaceholderSymbolCssClass(), element);
};

/**
 * @return {string}
 */
npf.ui.form.MaskedTextRenderer.prototype.getMaskPlaceholderCssClass =
    function() {
  return goog.getCssName(this.getStructuralCssClass(), 'maskPlaceholder');
};

/**
 * @return {string}
 */
npf.ui.form.MaskedTextRenderer.prototype.getMaskPlaceholderSymbolCssClass =
    function() {
  return goog.getCssName(
    this.getStructuralCssClass(), 'maskPlaceholder-symbol');
};

/**
 * @return {string}
 */
npf.ui.form.MaskedTextRenderer.prototype.getMaskPlaceholderMaskSymbolCssClass =
    function() {
  return goog.getCssName(
    this.getStructuralCssClass(), 'maskPlaceholder-maskSymbol');
};

/**
 * @return {string}
 */
npf.ui.form.MaskedTextRenderer.prototype.getMaskPlaceholderSymbolHiddenCssClass =
    function() {
  return goog.getCssName(
    this.getStructuralCssClass(), 'maskPlaceholder-symbol-hidden');
};
