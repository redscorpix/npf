goog.provide('npf.ui.RenderComponent');

goog.require('goog.array');
goog.require('goog.ui.Component.Error');
goog.require('npf.ui.Component');
goog.require('npf.ui.renderComponent.Renderer');


/**
 * @param {npf.ui.renderComponent.Renderer=} opt_renderer Renderer used to render or decorate the component.
 * @param {goog.dom.DomHelper=} opt_domHelper DOM helper, used for document interaction.
 * @constructor
 * @extends {npf.ui.Component}
 */
npf.ui.RenderComponent = function(opt_renderer, opt_domHelper) {
  goog.base(this, opt_domHelper);

  this.renderer_ = opt_renderer || npf.ui.renderComponent.Renderer.getInstance();
};
goog.inherits(npf.ui.RenderComponent, npf.ui.Component);


/**
 * @type {npf.ui.renderComponent.Renderer}
 * @private
 */
npf.ui.RenderComponent.prototype.renderer_;

/**
 * Additional class name(s) to apply to the component's root element, if any.
 * @type {Array.<string>?}
 * @private
 */
npf.ui.RenderComponent.prototype.extraClassNames_ = null;


/**
 * Creates the component's DOM.  Overrides {@link goog.ui.Component#createDom} by
 * delegating DOM manipulation to the component's renderer.
 * @override
 */
npf.ui.RenderComponent.prototype.createDom = function() {
  /** @type {Element} */
  var element = this.renderer_.createDom(this);
  this.setElementInternal(element);
};

/**
 * Decorates the given element with this component. Overrides {@link}
 * goog.ui.Component#decorateInternal} by delegating DOM manipulation
 * to the component's renderer.
 * @param {Element} element Element to decorate.
 * @protected
 * @override
 */
npf.ui.RenderComponent.prototype.decorateInternal = function(element) {
  element = this.renderer_.decorate(this, element);
  this.setElementInternal(element);
};

/** @inheritDoc */
npf.ui.RenderComponent.prototype.disposeInternal = function() {
  goog.base(this, 'disposeInternal');

  this.renderer_ = null;
  this.extraClassNames_ = null;
};

/**
 * Returns the DOM element into which child components are to be rendered,
 * or null if the component itself hasn't been rendered yet.  Overrides
 * {@link goog.ui.Component#getContentElement} by delegating to the renderer.
 * @return {Element} Element to contain child elements (null if none).
 */
npf.ui.RenderComponent.prototype.getContentElement = function() {
  // Delegate to renderer.
  return this.renderer_.getContentElement(this.getElement());
};

/**
 * Returns true if the given element can be decorated by this component.
 * Overrides {@link goog.ui.Component#canDecorate}.
 * @param {Element} element Element to decorate.
 * @return {boolean} Whether the element can be decorated by this component.
 */
npf.ui.RenderComponent.prototype.canDecorate = function(element) {
  // Blocks support pluggable renderers; delegate to the renderer.
  return this.renderer_.canDecorate(element);
};

/**
 * @return {npf.ui.renderComponent.Renderer}
 */
npf.ui.RenderComponent.prototype.getRenderer = function() {
  return this.renderer_;
};

/**
 * Registers the given renderer with the component.  Changing renderers after
 * the component has entered the document is an error.
 * @param {npf.ui.renderComponent.Renderer} renderer Renderer used by the component.
 * @throws {Error} If the component is already in the document.
 */
npf.ui.RenderComponent.prototype.setRenderer = function(renderer) {
  if (this.isInDocument()) {
    // Too late.
    throw Error(goog.ui.Component.Error.ALREADY_RENDERED);
  }

  if (this.getElement()) {
    // The component has already been rendered, but isn't yet in the document.
    // Replace the renderer and delete the current DOM, so it can be re-rendered
    // using the new renderer the next time someone calls render().
    this.setElementInternal(null);
  }

  this.renderer_ = renderer;
};

/**
 * Returns any additional class name(s) to be applied to the component's
 * root element, or null if no extra class names are needed.
 * @return {Array.<string>?} Additional class names to be applied to
 *     the component's root element (null if none).
 */
npf.ui.RenderComponent.prototype.getExtraClassNames = function() {
  return this.extraClassNames_;
};

/**
 * Adds the given class name to the list of classes to be applied to the
 * component's root element.
 * @param {string} className Additional class name to be applied to the component's root element.
 */
npf.ui.RenderComponent.prototype.addClassName = function(className) {
  if (className) {
    if (this.extraClassNames_) {
      if (!goog.array.contains(this.extraClassNames_, className)) {
        this.extraClassNames_.push(className);
      }
    } else {
      this.extraClassNames_ = [className];
    }

    this.renderer_.enableExtraClassName(this, className, true);
  }
};


/**
 * Removes the given class name from the list of classes to be applied to
 * the component's root element.
 * @param {string} className Class name to be removed from the component's root element.
 */
npf.ui.RenderComponent.prototype.removeClassName = function(className) {
  if (className && this.extraClassNames_) {
    goog.array.remove(this.extraClassNames_, className);

    if (!this.extraClassNames_.length) {
      this.extraClassNames_ = null;
    }

    this.renderer_.enableExtraClassName(this, className, false);
  }
};


/**
 * Adds or removes the given class name to/from the list of classes to be
 * applied to the component's root element.
 * @param {string} className CSS class name to add or remove.
 * @param {boolean} enable Whether to add or remove the class name.
 */
npf.ui.RenderComponent.prototype.enableClassName = function(className, enable) {
  if (enable) {
    this.addClassName(className);
  } else {
    this.removeClassName(className);
  }
};
