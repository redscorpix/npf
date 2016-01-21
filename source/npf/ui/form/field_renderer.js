goog.provide('npf.ui.form.FieldRenderer');

goog.require('goog.array');
goog.require('goog.dom');
goog.require('goog.dom.TagName');
goog.require('goog.dom.classlist');
goog.require('goog.dom.forms');
goog.require('goog.style');
goog.require('goog.ui.Component.State');
goog.require('goog.ui.IdGenerator');
goog.require('npf.ui.StatedRenderer');


/**
 * @constructor
 * @struct
 * @extends {npf.ui.StatedRenderer}
 */
npf.ui.form.FieldRenderer = function() {
  npf.ui.form.FieldRenderer.base(this, 'constructor');
};
goog.inherits(npf.ui.form.FieldRenderer, npf.ui.StatedRenderer);
goog.addSingletonGetter(npf.ui.form.FieldRenderer);


/**
 * @type {string}
 */
npf.ui.form.FieldRenderer.CSS_CLASS = goog.getCssName('npf-form-field');


/** @inheritDoc */
npf.ui.form.FieldRenderer.prototype.getCssClass = function() {
  return npf.ui.form.FieldRenderer.CSS_CLASS;
};

/** @inheritDoc */
npf.ui.form.FieldRenderer.prototype.createDom = function(component) {
  var fieldContainer = /** @type {!npf.ui.form.Field} */ (component);
  /** @type {!Element} */
  var element = npf.ui.form.FieldRenderer.base(
    this, 'createDom', fieldContainer);
  /** @type {goog.dom.DomHelper} */
  var domHelper = component.getDomHelper();

  if (fieldContainer.isLabelEnabled()) {
    /** @type {!Element} */
    var labelElement = this.createLabelElement(fieldContainer);
    domHelper.appendChild(element, labelElement);
  }

  /** @type {!Element} */
  var contentElement = fieldContainer.getDomHelper().createDom(
    goog.dom.TagName.DIV, this.getContentCssClass());
  domHelper.appendChild(element, contentElement);

  if (fieldContainer.isPlaceholderEnabled()) {
    /** @type {!Element} */
    var placeholderElement = this.createPlaceholderElement(fieldContainer);
    domHelper.appendChild(contentElement, placeholderElement);
  }

  if (fieldContainer.isErrorEnabled()) {
    /** @type {!Element} */
    var errorMessageElement = this.createErrorMessageElement(fieldContainer);
    domHelper.appendChild(element, errorMessageElement);
  }

  if (fieldContainer.isNoticeEnabled()) {
    /** @type {!Element} */
    var noticeElement = this.createNoticeElement(fieldContainer);
    domHelper.appendChild(element, noticeElement);
  }

  this.appendContent(fieldContainer, element);

  return element;
};

/** @inheritDoc */
npf.ui.form.FieldRenderer.prototype.setState = function(component, state,
    enable) {
  if (goog.ui.Component.State.DISABLED == state) {
    this.setDisabled(/** @type {npf.ui.form.Field} */ (component), enable);
  }

  npf.ui.form.FieldRenderer.base(this, 'setState', component, state, enable);
};

/** @inheritDoc */
npf.ui.form.FieldRenderer.prototype.getContentElement = function(element) {
  return this.getElementByClass(this.getContentCssClass(), element);
};

/** @inheritDoc */
npf.ui.form.FieldRenderer.prototype.getKeyEventTarget = function(component) {
  var field = /** @type {npf.ui.form.Field} */ (component);

  return field.getValueElement();
};

/**
 * @param {npf.ui.form.Field} component
 * @param {Element} element
 * @protected
 */
npf.ui.form.FieldRenderer.prototype.appendContent = goog.nullFunction;

/**
 * @param {Element} labelElement
 * @param {Element} valueElement
 * @protected
 */
npf.ui.form.FieldRenderer.prototype.bindLabel = function(labelElement,
    valueElement) {
  if (
    labelElement && valueElement &&
    labelElement instanceof HTMLLabelElement
  ) {
    var id = valueElement.id;

    if (!id) {
      id = goog.ui.IdGenerator.getInstance().getNextUniqueId();
      valueElement.id = id;
    }

    labelElement.setAttribute('for', id);
  }
};

/**
 * @param {npf.ui.form.Field} component
 * @param {boolean} visible
 */
npf.ui.form.FieldRenderer.prototype.setLabelVisible = function(component,
    visible) {
  this.setVisible(component.getLabelElement(), visible);
};

/**
 * @param {npf.ui.form.Field} component
 * @return {!Element}
 * @protected
 */
npf.ui.form.FieldRenderer.prototype.createLabelElement = function(component) {
  /** @type {!Element} */
  var element = component.getDomHelper().createDom(
    goog.dom.TagName.LABEL, this.getLabelCssClass());
  this.setContent(element, component.getLabel());

  return element;
};

/**
 * @param {npf.ui.form.Field} component
 * @return {!Element}
 * @protected
 */
npf.ui.form.FieldRenderer.prototype.createErrorMessageElement = function(
    component) {
  /** @type {!Element} */
  var element = component.getDomHelper().createDom(
    goog.dom.TagName.DIV, this.getErrorMessageCssClass());
  this.setContent(element, component.getErrorMessage());

  return element;
};

/**
 * @param {npf.ui.form.Field} component
 * @return {!Element}
 * @protected
 */
npf.ui.form.FieldRenderer.prototype.createNoticeElement = function(component) {
  /** @type {!Element} */
  var element = component.getDomHelper().createDom(
    goog.dom.TagName.DIV, this.getNoticeCssClass());
  this.setContent(element, component.getNotice());

  return element;
};

/**
 * @param {npf.ui.form.Field} component
 * @param {boolean} visible
 */
npf.ui.form.FieldRenderer.prototype.setPlaceholderVisible = function(component,
    visible) {
  this.setVisible(component.getPlaceholderElement(), visible);
};

/**
 * @param {npf.ui.form.Field} component
 * @return {!Element}
 * @protected
 */
npf.ui.form.FieldRenderer.prototype.createPlaceholderElement = function(
    component) {
  /** @type {!Element} */
  var element = component.getDomHelper().createDom(
    goog.dom.TagName.DIV, this.getPlaceholderCssClass());
  this.setContent(element, component.getPlaceholder());

  return element;
};

/**
 * @param {Element} element
 * @param {boolean=} opt_select
 */
npf.ui.form.FieldRenderer.prototype.focus = function(element, opt_select) {
  if (element) {
    if (opt_select) {
      goog.dom.forms.focusAndSelect(element);
    } else {
      element.focus();
    }
  }
};

/**
 * @param {npf.ui.form.Field} component
 * @return {boolean}
 */
npf.ui.form.FieldRenderer.prototype.isFocused = function(component) {
  /** @type {Element} */
  var valueElement = component.getValueElement();

  return !!valueElement &&
    valueElement === component.getDomHelper().getDocument().activeElement;
};

/**
 * @param {Element} element
 * @param {string|Node|Array.<Node>|NodeList} content
 */
npf.ui.form.FieldRenderer.prototype.setContent = function(element, content) {
  if (element) {
    goog.dom.removeChildren(element);

    if (content) {
      if (goog.isString(content)) {
        goog.dom.setTextContent(element, content);
      } else {
        /** @type {function((string|Node))} */
        var childHandler = function(child) {
          if (child) {
            /** @type {!Document} */
            var doc = goog.dom.getOwnerDocument(element);
            element.appendChild(goog.isString(child) ?
              doc.createTextNode(child) : /** @type {Node} */ (child));
          }
        };

        if (goog.isArray(content)) {
          // Array of nodes.
          goog.array.forEach(content, childHandler);
        } else if (goog.isArrayLike(content) && !('nodeType' in content)) {
          // NodeList. The second condition filters out TextNode which also has
          // length attribute but is not array like. The nodes have to be cloned
          // because childHandler removes them from the list during iteration.
          goog.array.forEach(goog.array.clone(/** @type {NodeList} */(content)),
            childHandler);
        } else {
          childHandler(/** @type {string|Node} */ (content));
        }
      }
    }
  }
};

/**
 * @param {npf.ui.form.Field} component
 * @param {boolean} disable
 */
npf.ui.form.FieldRenderer.prototype.setDisabled = function(component, disable) {
  /** @type {Element} */
  var valueElement = component.getValueElement();

  if (valueElement) {
    goog.dom.forms.setDisabled(valueElement, disable);
  }
};

/**
 * @param {npf.ui.form.Field} component
 * @param {boolean} error
 */
npf.ui.form.FieldRenderer.prototype.setError = function(component, error) {
  /** @type {Element} */
  var element = component.getElement();

  if (element) {
    goog.dom.classlist.enable(element, this.getErrorCssClass(), error);
  }
};

/**
 * @param {npf.ui.form.Field} component
 * @return {*}
 */
npf.ui.form.FieldRenderer.prototype.getValue = function(component) {
  /** @type {Element} */
  var element = component.getValueElement();

  if (element) {
    return goog.dom.forms.getValue(element);
  }

  return null;
};

/**
 * @param {npf.ui.form.Field} component
 * @param {*} value
 */
npf.ui.form.FieldRenderer.prototype.setValue = function(component, value) {
  /** @type {Element} */
  var element = component.getValueElement();

  if (element) {
    goog.dom.forms.setValue(element, value);
  }
};

/**
 * @param {Element} element
 * @param {boolean} visible
 */
npf.ui.form.FieldRenderer.prototype.setVisible = function(element, visible) {
  if (element) {
    goog.style.setElementShown(element, visible);
  }
};

/**
 * @param {Element} element
 * @return {Element}
 */
npf.ui.form.FieldRenderer.prototype.getErrorMessageElement = function(element) {
  return this.getElementByClass(this.getErrorMessageCssClass(), element);
};

/**
 * @param {Element} element
 * @return {Element}
 */
npf.ui.form.FieldRenderer.prototype.getLabelElement = function(element) {
  return this.getElementByClass(this.getLabelCssClass(), element);
};

/**
 * @param {Element} element
 * @return {Element}
 */
npf.ui.form.FieldRenderer.prototype.getNoticeElement = function(element) {
  return this.getElementByClass(this.getNoticeCssClass(), element);
};

/**
 * @param {Element} element
 * @return {Element}
 */
npf.ui.form.FieldRenderer.prototype.getPlaceholderElement = function(element) {
  return this.getElementByClass(this.getPlaceholderCssClass(), element);
};

/**
 * @param {Element} element
 * @return {Element}
 */
npf.ui.form.FieldRenderer.prototype.getValueElement = function(element) {
  return this.getElementByClass(this.getValueCssClass(), element);
};

/**
 * @return {string}
 */
npf.ui.form.FieldRenderer.prototype.getContentCssClass = function() {
  return goog.getCssName(this.getStructuralCssClass(), 'content');
};

/**
 * @return {string}
 */
npf.ui.form.FieldRenderer.prototype.getErrorCssClass = function() {
  return goog.getCssName(this.getStructuralCssClass(), 'error');
};

/**
 * @return {string}
 */
npf.ui.form.FieldRenderer.prototype.getErrorMessageCssClass = function() {
  return goog.getCssName(this.getStructuralCssClass(), 'errorMessage');
};

/**
 * @return {string}
 */
npf.ui.form.FieldRenderer.prototype.getLabelCssClass = function() {
  return goog.getCssName(this.getStructuralCssClass(), 'label');
};

/**
 * @return {string}
 */
npf.ui.form.FieldRenderer.prototype.getNoticeCssClass = function() {
  return goog.getCssName(this.getStructuralCssClass(), 'notice');
};

/**
 * @return {string}
 */
npf.ui.form.FieldRenderer.prototype.getPlaceholderCssClass = function() {
  return goog.getCssName(this.getStructuralCssClass(), 'placeholder');
};

/**
 * @return {string}
 */
npf.ui.form.FieldRenderer.prototype.getValueCssClass = function() {
  return goog.getCssName(this.getStructuralCssClass(), 'value');
};
