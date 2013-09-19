goog.provide('npf.ui.form.FieldRenderer');

goog.require('goog.dom');
goog.require('goog.dom.TagName');
goog.require('goog.dom.classes');
goog.require('goog.dom.forms');
goog.require('goog.style');
goog.require('goog.ui.IdGenerator');
goog.require('npf.ui.StatedRenderer');


/**
 * @constructor
 * @extends {npf.ui.StatedRenderer}
 */
npf.ui.form.FieldRenderer = function() {
  goog.base(this);
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
  /** @type {Element} */
  var element = goog.base(this, 'createDom', fieldContainer);

  if (fieldContainer.isLabelEnabled()) {
    /** @type {!Element} */
    var labelElement = this.createLabelElement(fieldContainer);
    goog.dom.appendChild(element, labelElement);
  }

  /** @type {!Element} */
  var contentElement = fieldContainer.getDomHelper().createDom(
    goog.dom.TagName.DIV, this.getContentCssClass());
  goog.dom.appendChild(element, contentElement);

  if (fieldContainer.isErrorEnabled()) {
    /** @type {!Element} */
    var errorMessageElement = this.createErrorMessageElement(fieldContainer);
    goog.dom.appendChild(element, errorMessageElement);
  }

  if (fieldContainer.isNoticeEnabled()) {
    /** @type {!Element} */
    var noticeElement = this.createNoticeElement(fieldContainer);
    goog.dom.appendChild(element, noticeElement);
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

  goog.base(this, 'setState', component, state, enable);
};

/** @inheritDoc */
npf.ui.form.FieldRenderer.prototype.getContentElement = function(element) {
  return this.getElementByClass(this.getContentCssClass(), element);
};

/** @inheritDoc */
npf.ui.form.FieldRenderer.prototype.getKeyEventTarget = function(component) {
  return component.getValueElement();
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
    goog.dom.TagName.DIV, this.getLabelCssClass());
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
        var childHandler = function(child) {
          if (child) {
            var doc = goog.dom.getOwnerDocument(element);
            element.appendChild(goog.isString(child) ?
              doc.createTextNode(child) : child);
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
          // Node or string.
          childHandler(content);
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
    goog.dom.classes.enable(element, this.getErrorCssClass(), error);
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
npf.ui.form.FieldRenderer.prototype.getValueCssClass = function() {
  return goog.getCssName(this.getStructuralCssClass(), 'value');
};
