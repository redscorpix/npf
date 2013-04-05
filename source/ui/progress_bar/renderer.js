goog.provide('npf.ui.progressBar.Renderer');

goog.require('goog.a11y.aria');
goog.require('goog.dom');
goog.require('goog.dom.TagName');
goog.require('goog.dom.classes');
goog.require('goog.style');
goog.require('npf.ui.renderComponent.Renderer');


/**
 * @constructor
 * @extends {npf.ui.renderComponent.Renderer}
 */
npf.ui.progressBar.Renderer = function() {
  goog.base(this);
};
goog.inherits(npf.ui.progressBar.Renderer, npf.ui.renderComponent.Renderer);
goog.addSingletonGetter(npf.ui.progressBar.Renderer);


/**
 * @type {string}
 */
npf.ui.progressBar.Renderer.CSS_CLASS = goog.getCssName('npf-progressBar');


/** @inheritDoc */
npf.ui.progressBar.Renderer.prototype.getCssClass = function() {
  return npf.ui.progressBar.Renderer.CSS_CLASS;
};

/** @inheritDoc */
npf.ui.progressBar.Renderer.prototype.createDom = function(component) {
  /** @type {npf.ui.ProgressBar.Orientation} */
  var orientation = component.getOrientation();
  var element = /** @type {!Element} */ (
    goog.base(this, 'createDom', component));
  goog.dom.classes.add(element, this.getOrientationCssClass(orientation));

  var thumbElement = this.createThumbElement(component);
  goog.dom.appendChild(element, thumbElement);

  // state live = polite will notify the user of updates,
  // but will not interrupt ongoing feedback
  goog.a11y.aria.setRole(element, 'progressbar');
  goog.a11y.aria.setState(element, 'live', 'polite');

  return element;
};

/** @inheritDoc */
npf.ui.progressBar.Renderer.prototype.decorate = function(component, element) {
  element = goog.base(this, 'decorate', component, element);

  /** @type {npf.ui.ProgressBar.Orientation} */
  var orientation = component.getOrientation();
  goog.dom.classes.add(element, this.getOrientationCssClass(orientation));

  // find thumb
  var thumbElement = goog.dom.getElementByClass(this.getThumbCssClass(),
    element);

  if (!thumbElement) {
    thumbElement = this.createThumbElement(component);
    goog.dom.appendChild(element, thumbElement);
  }

  return element;
};

/**
 * @param {npf.ui.ProgressBar} component
 */
npf.ui.progressBar.Renderer.prototype.initializeUi = function(component) {
  /** @type {Element} */
  var thumbElement = component.getThumbElement();

  if (thumbElement) {
    if (npf.ui.ProgressBar.Orientation.VERTICAL == component.getOrientation()) {
      goog.style.setStyle(thumbElement, {
        'left': 0,
        'width': '100%'
      });
    } else {
      goog.style.setStyle(thumbElement, {
        'height': '100%',
        'left': 0,
        'top': 0
      });
    }
  }
};

/**
 * @param {npf.ui.ProgressBar} component
 */
npf.ui.progressBar.Renderer.prototype.updateUi = function(component) {
  /** @type {Element} */
  var thumbElement = component.getThumbElement();

  if (thumbElement) {
    /** @type {number} */
    var min = component.getMinimum();
    /** @type {number} */
    var max = component.getMaximum();
    /** @type {number} */
    var value = component.getValue();
    /** @type {number} */
    var size = Math.round((value - min) / (max - min) * 100);

    if (npf.ui.ProgressBar.Orientation.VERTICAL == component.getOrientation()) {
      goog.style.setStyle(thumbElement, {
        'height': size + '%',
        'top': (100 - size) + '%'
      });
    } else {
      goog.style.setStyle(thumbElement, 'width', size + '%');
    }
  }
};

/**
 * @param {npf.ui.ProgressBar} component
 * @param {number} value
 */
npf.ui.progressBar.Renderer.prototype.setValue = function(component, value) {
  /** @type {Element} */
  var element = component.getElement();

  if (element) {
    goog.a11y.aria.setState(element, 'valuenow', value);
  }
};

/**
 * @param {npf.ui.ProgressBar} component
 * @param {number} value
 */
npf.ui.progressBar.Renderer.prototype.setMinimum = function(component, value) {
  /** @type {Element} */
  var element = component.getElement();

  if (element) {
    goog.a11y.aria.setState(element, 'valuemin', value);
  }
};

/**
 * @param {npf.ui.ProgressBar} component
 * @param {number} value
 */
npf.ui.progressBar.Renderer.prototype.setMaximum = function(component, value) {
  /** @type {Element} */
  var element = component.getElement();

  if (element) {
    goog.a11y.aria.setState(element, 'valuemax', value);
  }
};

/**
 * @param {Element} element
 * @param {npf.ui.ProgressBar.Orientation} oldOrient
 * @param {npf.ui.ProgressBar.Orientation} newOrient
 */
npf.ui.progressBar.Renderer.prototype.updateOrientation = function(element,
                                                                   oldOrient,
                                                                   newOrient) {
  if (element) {
    var oldCssClass = this.getOrientationCssClass(oldOrient);
    var newCssClass = this.getOrientationCssClass(newOrient);
    goog.dom.classes.swap(element, oldCssClass, newCssClass);
  }
};

/**
 * This creates the thumb element.
 * @param {goog.ui.Component} component
 * @return {!Element} The created thumb element.
 * @protected
 */
npf.ui.progressBar.Renderer.prototype.createThumbElement = function(component) {
  return component.getDomHelper().createDom(goog.dom.TagName.DIV,
    this.getThumbCssClass());
};

/**
 * @param {Element} element
 * @return {Element}
 */
npf.ui.progressBar.Renderer.prototype.getThumbElement = function(element) {
  if (element) {
    return goog.dom.getElementByClass(this.getThumbCssClass(), element);
  }

  return null;
};

/**
 * @return {string}
 */
npf.ui.progressBar.Renderer.prototype.getThumbCssClass = function() {
  return goog.getCssName(this.getStructuralCssClass(), 'thumb');
};

/**
 * @param {npf.ui.ProgressBar.Orientation} orientation
 * @return {string}
 */
npf.ui.progressBar.Renderer.prototype.getOrientationCssClass = function(orientation) {
  if (npf.ui.ProgressBar.Orientation.VERTICAL == orientation) {
    return goog.getCssName(this.getStructuralCssClass(), 'vertical');
  } else {
    return goog.getCssName(this.getStructuralCssClass(), 'horizontal');
  }
};
