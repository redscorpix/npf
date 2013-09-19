goog.provide('npf.ui.RenderedComponent');

goog.require('goog.array');
goog.require('goog.object');
goog.require('goog.ui.Component.Error');
goog.require('npf.ui.Component');
goog.require('npf.ui.Renderer');


/**
 * @param {npf.ui.Renderer=} opt_renderer Renderer used to render
 *                                        or decorate the component.
 * @param {goog.dom.DomHelper=} opt_domHelper DOM helper, used for document
 *                                            interaction.
 * @constructor
 * @extends {npf.ui.Component}
 */
npf.ui.RenderedComponent = function(opt_renderer, opt_domHelper) {
  goog.base(this, opt_domHelper);

  this.renderer_ = opt_renderer || npf.ui.Renderer.getInstance();
};
goog.inherits(npf.ui.RenderedComponent, npf.ui.Component);


/**
 * Map of DOM IDs to child components.  Each key is the DOM ID of a child
 * component's root element; each value is a reference to the child component
 * itself.  Used for looking up the child component corresponding to a DOM
 * node in O(1) time.
 * @private {Object.<goog.ui.Component>}
 */
npf.ui.RenderedComponent.prototype.childElementIdMap_ = null;

/**
 * Additional class name(s) to apply to the component's root element, if any.
 * @private {Array.<string>?}
 */
npf.ui.RenderedComponent.prototype.extraClassNames_ = null;

/**
 * @private {npf.ui.Renderer}
 */
npf.ui.RenderedComponent.prototype.renderer_;


/**
 * Creates the component's DOM.  Overrides {@link goog.ui.Component#createDom}
 * by delegating DOM manipulation to the component's renderer.
 * @override
 */
npf.ui.RenderedComponent.prototype.createDom = function() {
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
npf.ui.RenderedComponent.prototype.decorateInternal = function(element) {
  element = this.renderer_.decorate(this, element);
  this.setElementInternal(element);
};

/** @inheritDoc */
npf.ui.RenderedComponent.prototype.enterDocument = function() {
  goog.base(this, 'enterDocument');

  this.forEachChild(function(child) {
    if (child.isInDocument()) {
      this.registerChildId_(child);
    }
  }, this);
};

/** @inheritDoc */
npf.ui.RenderedComponent.prototype.disposeInternal = function() {
  goog.base(this, 'disposeInternal');

  this.childElementIdMap_ = null;
  this.extraClassNames_ = null;
  this.renderer_ = null;
};

/**
 * Returns the DOM element into which child components are to be rendered,
 * or null if the component itself hasn't been rendered yet.  Overrides
 * {@link goog.ui.Component#getContentElement} by delegating to the renderer.
 * @return {Element} Element to contain child elements (null if none).
 */
npf.ui.RenderedComponent.prototype.getContentElement = function() {
  // Delegate to renderer.
  return this.renderer_.getContentElement(this.getElement());
};

/**
 * Returns true if the given element can be decorated by this component.
 * Overrides {@link goog.ui.Component#canDecorate}.
 * @param {Element} element Element to decorate.
 * @return {boolean} Whether the element can be decorated by this component.
 */
npf.ui.RenderedComponent.prototype.canDecorate = function(element) {
  // Blocks support pluggable renderers; delegate to the renderer.
  return this.renderer_.canDecorate(element);
};

/**
 * @return {npf.ui.Renderer}
 */
npf.ui.RenderedComponent.prototype.getRenderer = function() {
  return this.renderer_;
};

/**
 * Registers the given renderer with the component.  Changing renderers after
 * the component has entered the document is an error.
 * @param {npf.ui.Renderer} renderer Renderer used by the component.
 * @throws {Error} If the component is already in the document.
 */
npf.ui.RenderedComponent.prototype.setRenderer = function(renderer) {
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
 * Adds the component as a child of this component at the given 0-based index.
 * @param {goog.ui.Component} component New child.
 * @param {number} index Index at which the new child is to be added.
 * @param {boolean=} opt_render Whether the new child should be rendered
 *     immediately after being added (defaults to false).
 * @override
 */
npf.ui.RenderedComponent.prototype.addChildAt = function(component, index,
    opt_render) {
  goog.base(this, 'addChildAt', component, index, opt_render);

  if (component.isInDocument() && this.isInDocument()) {
    this.registerChildId_(component);
  }
};

/**
 * Creates a DOM ID for the child component and registers it to an internal
 * hash table to be able to find it fast by id.
 * @param {goog.ui.Component} child The child component. Its root element has
 *     to be created yet.
 * @private
 */
npf.ui.RenderedComponent.prototype.registerChildId_ = function(child) {
  // Map the DOM ID of the component's root element to the component itself.

  /** @type {Element} */
  var childElem = child.getElement();

  // If the component's root element doesn't have a DOM ID assign one.
  var id = childElem.id || (childElem.id = child.getId());

  // Lazily create the child element ID map on first use.
  if (!this.childElementIdMap_) {
    this.childElementIdMap_ = {};
  }

  this.childElementIdMap_[id] = child;
};

/**
 * Removes a child component.
 * @param {string|goog.ui.Component} component The ID of the child to remove, or
 *     the component itself.
 * @param {boolean=} opt_unrender Whether to call {@code exitDocument} on the
 *     removed component, and detach its DOM from the document (defaults to
 *     false).
 * @return {goog.ui.Component} The removed component, if any.
 * @override
 */
npf.ui.RenderedComponent.prototype.removeChild = function(component,
    opt_unrender) {
  component = goog.isString(component) ? this.getChild(component) : component;

  if (component) {
    // Remove the mapping from the child element ID map.

    /** @type {Element} */
    var childElem = component.getElement();

    if (childElem && childElem.id && this.childElementIdMap_) {
      goog.object.remove(this.childElementIdMap_, childElem.id);
    }
  }

  return goog.base(this, 'removeChild', component, opt_unrender);
};

/**
 * Returns the child component that owns the given DOM node, or null if no such
 * component is found.
 * @param {Node} node DOM node whose owner is to be returned.
 * @return {goog.ui.Component?} Component hosted in the container to which
 *     the node belongs (if found).
 * @protected
 */
npf.ui.RenderedComponent.prototype.getOwnerChild = function(node) {
  // Ensure that this container actually has child components before
  // looking up the owner.
  if (this.childElementIdMap_) {
    /** @type {Element} */
    var element = this.getElement();

    // See http://b/2964418 . IE9 appears to evaluate '!=' incorrectly, so
    // using '!==' instead.
    // TODO(user): Possibly revert this change if/when IE9 fixes the issue.
    while (node && node !== element) {
      var id = node.id;

      if (id in this.childElementIdMap_) {
        return this.childElementIdMap_[id];
      }

      node = node.parentNode;
    }
  }

  return null;
};

/**
 * Returns any additional class name(s) to be applied to the component's
 * root element, or null if no extra class names are needed.
 * @return {Array.<string>?} Additional class names to be applied to
 *     the component's root element (null if none).
 */
npf.ui.RenderedComponent.prototype.getExtraClassNames = function() {
  return this.extraClassNames_;
};

/**
 * Adds the given class name to the list of classes to be applied to the
 * component's root element.
 * @param {string} className Additional class name to be applied
 *                           to the component's root element.
 */
npf.ui.RenderedComponent.prototype.addClassName = function(className) {
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
 * @param {string} className Class name to be removed from the component's root
 *                           element.
 */
npf.ui.RenderedComponent.prototype.removeClassName = function(className) {
  if (
    className &&
    this.extraClassNames_ &&
    goog.array.remove(this.extraClassNames_, className)
  ) {
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
npf.ui.RenderedComponent.prototype.enableClassName = function(className,
    enable) {
  if (enable) {
    this.addClassName(className);
  } else {
    this.removeClassName(className);
  }
};
