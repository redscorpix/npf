goog.provide('npf.ui.StatedRenderer');

goog.require('goog.a11y.aria');
goog.require('goog.a11y.aria.Role');
goog.require('goog.a11y.aria.State');
goog.require('goog.array');
goog.require('goog.asserts');
goog.require('goog.dom');
goog.require('goog.dom.classlist');
goog.require('goog.object');
goog.require('goog.string');
goog.require('goog.style');
goog.require('goog.ui.Component.State');
goog.require('goog.userAgent');
goog.require('npf.dom');
goog.require('npf.dom.Content');
goog.require('npf.ui.Renderer');


/**
 * @constructor
 * @struct
 * @extends {npf.ui.Renderer}
 */
npf.ui.StatedRenderer = function() {
  npf.ui.StatedRenderer.base(this, 'constructor');
};
goog.inherits(npf.ui.StatedRenderer, npf.ui.Renderer);
goog.addSingletonGetter(npf.ui.StatedRenderer);


/**
 * Map of component states to corresponding ARIA attributes.  Since the mapping
 * of component states to ARIA attributes is neither component- nor
 * renderer-specific, this is a static property of the renderer class, and is
 * initialized on first use.
 * @private {Object<goog.ui.Component.State, goog.a11y.aria.State>}
 */
npf.ui.StatedRenderer.ariaAttributeMap_ = null;

/**
 * Map of certain ARIA states to ARIA roles that support them. Used for checked
 * and selected Component states because they are used on Components with ARIA
 * roles that do not support the corresponding ARIA state.
 * @private {!Object<goog.a11y.aria.Role, goog.a11y.aria.State>}
 * @const
 */
npf.ui.StatedRenderer.TOGGLE_ARIA_STATE_MAP_ = goog.object.create(
  goog.a11y.aria.Role.BUTTON,             goog.a11y.aria.State.PRESSED,
  goog.a11y.aria.Role.CHECKBOX,           goog.a11y.aria.State.CHECKED,
  goog.a11y.aria.Role.MENU_ITEM,          goog.a11y.aria.State.SELECTED,
  goog.a11y.aria.Role.MENU_ITEM_CHECKBOX, goog.a11y.aria.State.CHECKED,
  goog.a11y.aria.Role.MENU_ITEM_RADIO,    goog.a11y.aria.State.CHECKED,
  goog.a11y.aria.Role.RADIO,              goog.a11y.aria.State.CHECKED,
  goog.a11y.aria.Role.TAB,                goog.a11y.aria.State.SELECTED,
  goog.a11y.aria.Role.TREEITEM,           goog.a11y.aria.State.SELECTED
);

/**
 * @param {function(new: OBJECT, ...)} ctor
 * @param {string} cssClassName
 * @return {!OBJECT}
 * @template OBJECT
 */
npf.ui.StatedRenderer.getCustomRenderer = function(ctor, cssClassName) {
  var renderer = new ctor();

  /**
   * Returns the CSS class to be applied to the root element of components
   * rendered using this renderer.
   * @return {string} Renderer-specific CSS class.
   */
  renderer.getCssClass = function() {
    return cssClassName;
  };

  return renderer;
};


/**
 * Returns the ARIA role to be applied to the component.
 * See http://wiki/Main/ARIA for more info.
 * @return {goog.a11y.aria.Role|undefined} ARIA role.
 */
npf.ui.StatedRenderer.prototype.getAriaRole = function() {
  // By default, the ARIA role is unspecified.
  return undefined;
};


/**
 * Default implementation of {@code decorate} for
 * {@link npf.ui.StatedComponent}s.
 * Initializes the component's ID, content, and state based on the ID of the
 * element, its child nodes, and its CSS classes, respectively.  Returns the
 * element.
 * @param {!npf.ui.RenderedComponent} component Component instance to decorate
 *                                              the element.
 * @param {Element} element Element to decorate.
 * @return {Element} Decorated element.
 */
npf.ui.StatedRenderer.prototype.decorate = function(component, element) {
  var statedComponent = /** @type {npf.ui.StatedComponent} */ (component);

  // Set the component's ID to the decorated element's DOM ID, if any.
  if (element.id) {
    component.setId(element.id);
  }

  var contentElem = this.getContentElement(element);

  // Initialize the component's state based on the decorated element's CSS class.
  // This implementation is optimized to minimize object allocations, string
  // comparisons, and DOM access.
  var state = 0x00;
  var rendererClassName = this.getCssClass();
  var structuralClassName = this.getStructuralCssClass();
  var hasRendererClassName = false;
  var hasStructuralClassName = false;
  var hasCombinedClassName = false;
  var classNames = goog.array.toArray(goog.dom.classlist.get(element));

  goog.array.forEach(classNames, function(className) {
    if (!hasRendererClassName && className == rendererClassName) {
      hasRendererClassName = true;

      if (structuralClassName == rendererClassName) {
        hasStructuralClassName = true;
      }
    } else if (!hasStructuralClassName && className == structuralClassName) {
      hasStructuralClassName = true;
    } else {
      state |= this.getStateFromClass(className);
    }

    if (this.getStateFromClass(className) == goog.ui.Component.State.DISABLED) {
      goog.asserts.assertElement(contentElem);

      if (goog.dom.isFocusableTabIndex(contentElem)) {
        goog.dom.setFocusableTabIndex(contentElem, false);
      }
    }
  }, this);
  statedComponent.setStateInternal(state);

  // Make sure the element has the renderer's CSS classes applied, as well as
  // any extra class names set on the component.
  if (!hasRendererClassName) {
    classNames.push(rendererClassName);

    if (structuralClassName == rendererClassName) {
      hasStructuralClassName = true;
    }
  }

  if (!hasStructuralClassName) {
    classNames.push(structuralClassName);
  }

  var extraClassNames = component.getExtraClassNames();

  if (extraClassNames) {
    classNames.push.apply(classNames, extraClassNames);
  }

  // Only write to the DOM if new class names had to be added to the element.
  if (!hasRendererClassName || !hasStructuralClassName ||
      extraClassNames || hasCombinedClassName) {
    goog.dom.classlist.addAll(element, classNames);
  }

  return element;
};


/**
 * Initializes the component's DOM by configuring properties that can only be
 * set after the DOM has entered the document.  This implementation sets up BiDi
 * and keyboard focus.  Called from {@link npf.ui.StatedComponent#enterDocument}.
 * @param {npf.ui.StatedComponent} component Component whose DOM is to be
 *                                 initialized as it enters the document.
 */
npf.ui.StatedRenderer.prototype.initializeDom = function(component) {
  // Initialize render direction (BiDi).  We optimize the left-to-right render
  // direction by assuming that elements are left-to-right by default, and only
  // updating their styling if they are explicitly set to right-to-left.
  if (component.isRightToLeft()) {
    this.setRightToLeft(component.getElement(), true);
  }

  // Initialize keyboard focusability (tab index).  We assume that components
  // aren't focusable by default (i.e have no tab index), and only touch the
  // DOM if the component is focusable, enabled, and visible, and therfore
  // needs a tab index.
  if (component.isEnabled()) {
    this.setFocusable(component, component.isVisible());
  }
};


/**
 * Sets the element's ARIA role.
 * @param {Element} element Element to update.
 * @param {?goog.a11y.aria.Role=} opt_preferredRole The preferred ARIA role.
 */
npf.ui.StatedRenderer.prototype.setAriaRole = function(element,
    opt_preferredRole) {
  var ariaRole = opt_preferredRole || this.getAriaRole();

  if (ariaRole) {
    goog.asserts.assert(
      element, 'The element passed as a first parameter cannot be null.');

    var currentRole = goog.a11y.aria.getRole(element);

    if (ariaRole == currentRole) {
      return;
    }

    goog.a11y.aria.setRole(element, ariaRole);
  }
};


/**
 * Sets the element's ARIA states. An element does not need an ARIA role in
 * order to have an ARIA state. Only states which are initialized to be true
 * will be set.
 * @param {!npf.ui.StatedComponent} component Component whose ARIA state will
 *                                            be updated.
 * @param {!Element} element Element whose ARIA state is to be updated.
 */
npf.ui.StatedRenderer.prototype.setAriaStates = function(component, element) {
  goog.asserts.assert(component);
  goog.asserts.assert(element);

  var ariaLabel = component.getAriaLabel();

  if (goog.isDefAndNotNull(ariaLabel)) {
    this.setAriaLabel(element, ariaLabel);
  }

  if (!component.isVisible()) {
    goog.a11y.aria.setState(
      element, goog.a11y.aria.State.HIDDEN, !component.isVisible());
  }

  if (!component.isEnabled()) {
    this.updateAriaState(element, goog.ui.Component.State.DISABLED, true);
  }

  if (component.isSupportedState(goog.ui.Component.State.SELECTED)) {
    this.updateAriaState(
      element, goog.ui.Component.State.SELECTED, component.isSelected());
  }

  if (component.isSupportedState(goog.ui.Component.State.CHECKED)) {
    this.updateAriaState(
      element, goog.ui.Component.State.CHECKED, component.isChecked());
  }

  if (component.isSupportedState(goog.ui.Component.State.OPENED)) {
    this.updateAriaState(
      element, goog.ui.Component.State.OPENED, component.isOpen());
  }
};


/**
 * Sets the element's ARIA label.
 * @param {!Element} element Element whose ARIA label is to be updated.
 * @param {string} ariaLabel Label to add to the element.
 */
npf.ui.StatedRenderer.prototype.setAriaLabel = function(element, ariaLabel) {
  goog.a11y.aria.setLabel(element, ariaLabel);
};


/**
 * Allows or disallows text selection within the component's DOM.
 * @param {Element} element The component's root element.
 * @param {boolean} allow Whether the element should allow text selection.
 */
npf.ui.StatedRenderer.prototype.setAllowTextSelection = function(element,
    allow) {
  // On all browsers other than IE, Edge and Opera, it isn't necessary
  // to recursively apply unselectable styling to the element's children.
  goog.style.setUnselectable(
    element, !allow, !goog.userAgent.EDGE_OR_IE && !goog.userAgent.OPERA);
};


/**
 * Applies special styling to/from the component's element if it is rendered
 * right-to-left, and removes it if it is rendered left-to-right.
 * @param {Element} element The component's root element.
 * @param {boolean} rightToLeft Whether the component is rendered
 *     right-to-left.
 */
npf.ui.StatedRenderer.prototype.setRightToLeft = function(element,
    rightToLeft) {
  this.enableClassName(element, this.getRtlCssClass(), rightToLeft);
};


/**
 * Returns true if the component's key event target supports keyboard focus
 * (based on its {@code tabIndex} attribute), false otherwise.
 * @param {npf.ui.StatedComponent} component Component whose key event target is
 *                                           to be checked.
 * @return {boolean} Whether the component's key event target is focusable.
 */
npf.ui.StatedRenderer.prototype.isFocusable = function(component) {
  var keyTarget;

  if (
    component.isSupportedState(goog.ui.Component.State.FOCUSED) &&
    (keyTarget = component.getKeyEventTarget())
  ) {
    return goog.dom.isFocusableTabIndex(keyTarget);
  }

  return false;
};


/**
 * Updates the component's key event target to make it focusable or
 * non-focusable via its {@code tabIndex} attribute.  Does nothing if the
 * component doesn't support the {@code FOCUSED} state, or if it has no key
 * event target.
 * @param {npf.ui.StatedComponent} component Component whose key event target is
 *                                           to be updated.
 * @param {boolean} focusable Whether to enable keyboard focus support on the
 *                            component's key event target.
 */
npf.ui.StatedRenderer.prototype.setFocusable = function(component, focusable) {
  var keyTarget;

  if (
    component.isSupportedState(goog.ui.Component.State.FOCUSED) &&
    (keyTarget = component.getKeyEventTarget())
  ) {
    if (!focusable && component.isFocused()) {
      // Blur before hiding.  Note that IE calls onblur handlers asynchronously.
      try {
        keyTarget.blur();
      } catch (e) {
        // TODO(user|user):  Find out why this fails on IE.
      }

      // The blur event dispatched by the key event target element when blur()
      // was called on it should have been handled by the component's
      // handleBlur() method, so at this point the component should no longer be
      // focused.
      // However, blur events are unreliable on IE and FF3, so if at this point
      // the component is still focused, we trigger its handleBlur() method
      // programmatically.
      if (component.isFocused()) {
        component.handleBlur(null);
      }
    }

    // Don't overwrite existing tab index values unless needed.
    if (goog.dom.isFocusableTabIndex(keyTarget) != focusable) {
      goog.dom.setFocusableTabIndex(keyTarget, focusable);
    }
  }
};

/**
 * @param {Element} element
 * @return {boolean}
 */
npf.ui.StatedRenderer.prototype.isElementShown = function(element) {
  return element ? goog.style.isElementShown(element) : false;
};

/**
 * Shows or hides the element.
 * @param {Element} element Element to update.
 * @param {boolean} visible Whether to show the element.
 */
npf.ui.StatedRenderer.prototype.setVisible = function(element, visible) {
  // The base class implementation is trivial; subclasses should override as
  // needed.  It should be possible to do animated reveals, for example.
  if (element) {
    goog.style.setElementShown(element, visible);
    goog.a11y.aria.setState(element, goog.a11y.aria.State.HIDDEN, !visible);
  }
};

/**
 * Updates the appearance of the component in response to a state change.
 * @param {npf.ui.StatedComponent} component Component instance to update.
 * @param {goog.ui.Component.State} state State to enable or disable.
 * @param {boolean} enable Whether the component is entering or exiting the
 *                         state.
 */
npf.ui.StatedRenderer.prototype.setState = function(component, state, enable) {
  var element = component.getElement();

  if (element) {
    var className = this.getClassForState(state);

    if (className) {
      this.enableClassName(component, className, enable);
    }

    this.updateAriaState(element, state, enable);
  }
};


/**
 * Updates the element's ARIA (accessibility) state.
 * @param {Element} element Element whose ARIA state is to be updated.
 * @param {goog.ui.Component.State} state Component state being enabled or
 *     disabled.
 * @param {boolean} enable Whether the state is being enabled or disabled.
 * @protected
 */
npf.ui.StatedRenderer.prototype.updateAriaState = function(element, state,
    enable) {
  // Ensure the ARIA state map exists.
  if (!npf.ui.StatedRenderer.ariaAttributeMap_) {
    npf.ui.StatedRenderer.ariaAttributeMap_ = goog.object.create(
      goog.ui.Component.State.DISABLED, goog.a11y.aria.State.DISABLED,
      goog.ui.Component.State.SELECTED, goog.a11y.aria.State.SELECTED,
      goog.ui.Component.State.CHECKED, goog.a11y.aria.State.CHECKED,
      goog.ui.Component.State.OPENED, goog.a11y.aria.State.EXPANDED
    );
  }

  goog.asserts.assert(
    element, 'The element passed as a first parameter cannot be null.');

  var ariaAttr = npf.ui.StatedRenderer.getAriaStateForAriaRole_(
    element, npf.ui.StatedRenderer.ariaAttributeMap_[state]);

  if (ariaAttr) {
    goog.a11y.aria.setState(element, ariaAttr, enable);
  }
};

/**
 * Returns the appropriate ARIA attribute based on ARIA role if the ARIA
 * attribute is an ARIA state.
 * @param {!Element} element The element from which to get the ARIA role for
 * matching ARIA state.
 * @param {goog.a11y.aria.State} attr The ARIA attribute to check to see if it
 * can be applied to the given ARIA role.
 * @return {goog.a11y.aria.State} An ARIA attribute that can be applied to the
 * given ARIA role.
 * @private
 */
npf.ui.StatedRenderer.getAriaStateForAriaRole_ = function(element, attr) {
  var role = goog.a11y.aria.getRole(element);

  if (!role) {
    return attr;
  }

  role = /** @type {goog.a11y.aria.Role} */ (role);

  var matchAttr = npf.ui.StatedRenderer.TOGGLE_ARIA_STATE_MAP_[role] || attr;

  return npf.ui.StatedRenderer.isAriaState_(attr) ? matchAttr : attr;
};

/**
 * Determines if the given ARIA attribute is an ARIA property or ARIA state.
 * @param {goog.a11y.aria.State} attr The ARIA attribute to classify.
 * @return {boolean} If the ARIA attribute is an ARIA state.
 * @private
 */
npf.ui.StatedRenderer.isAriaState_ = function(attr) {
  return attr == goog.a11y.aria.State.CHECKED ||
    attr == goog.a11y.aria.State.SELECTED;
};

/**
 * Takes a component's root element, and sets its content to the given text
 * caption or DOM structure. The default implementation replaces the children
 * of the given element.  Renderers that create more complex DOM structures
 * must override this method accordingly.
 * @param {Element} element The component's root element.
 * @param {npf.dom.Content} content Text caption or DOM structure to be
 *     set as the component's content. The DOM nodes will not be cloned, they
 *     will only moved under the content element of the component.
 */
npf.ui.StatedRenderer.prototype.setContent = function(element, content) {
  /** @type {Element} */
  var contentElem = this.getContentElement(element);

  if (contentElem) {
    npf.dom.setContent(contentElem, content);
  }
};


/**
 * Returns the element within the component's DOM that should receive keyboard
 * focus (null if none). The default implementation returns the component's
 * root element.
 * @param {npf.ui.StatedComponent} component Component whose key event target is
 *                                           to be returned.
 * @return {Element} The key event target.
 */
npf.ui.StatedRenderer.prototype.getKeyEventTarget = function(component) {
  return component.getElement();
};

/** @inheritDoc */
npf.ui.StatedRenderer.prototype.getClassNames = function(component) {
  /** @type {Array.<string>} */
  var classNames = npf.ui.StatedRenderer.base(this, 'getClassNames', component);
  var statedComponent = /** @type {npf.ui.StatedComponent} */ (component);
  // Add state-specific class names, if any.
  var classNamesForState = this.getClassNamesForState(
    statedComponent.getState());
  classNames.push.apply(classNames, classNamesForState);

  return classNames;
};

/**
 * Takes a bit mask of {@link goog.ui.Component.State}s, and returns an array
 * of the appropriate class names representing the given state, suitable to be
 * applied to the root element of a component rendered using this renderer, or
 * null if no state-specific classes need to be applied.  This default
 * implementation uses the renderer's {@link getClassForState} method to
 * generate each state-specific class.
 * @param {number} state Bit mask of component states.
 * @return {!Array.<string>} Array of CSS class names representing the given
 *     state.
 * @protected
 */
npf.ui.StatedRenderer.prototype.getClassNamesForState = function(state) {
  var classNames = [];

  while (state) {
    // For each enabled state, push the corresponding CSS class name onto
    // the classNames array.
    var mask = state & -state;  // Least significant bit
    classNames.push(this.getClassForState(
        /** @type {goog.ui.Component.State} */ (mask)));
    state &= ~mask;
  }

  return classNames;
};


/**
 * Takes a single {@link goog.ui.Component.State}, and returns the
 * corresponding CSS class name (null if none).
 * @param {goog.ui.Component.State} state Component state.
 * @return {string|undefined} CSS class representing the given state (undefined
 *     if none).
 * @protected
 */
npf.ui.StatedRenderer.prototype.getClassForState = function(state) {
  if (!this.classByState_) {
    this.createClassByStateMap_();
  }

  return this.classByState_[state];
};


/**
 * Takes a single CSS class name which may represent a component state, and
 * returns the corresponding component state (0x00 if none).
 * @param {string} className CSS class name, possibly representing a component
 *     state.
 * @return {goog.ui.Component.State} state Component state corresponding
 *     to the given CSS class (0x00 if none).
 * @protected
 */
npf.ui.StatedRenderer.prototype.getStateFromClass = function(className) {
  if (!this.stateByClass_) {
    this.createStateByClassMap_();
  }

  var state = parseInt(this.stateByClass_[className], 10);

  return /** @type {goog.ui.Component.State} */ (isNaN(state) ? 0x00 : state);
};


/**
 * Creates the lookup table of states to classes, used during state changes.
 * @private
 */
npf.ui.StatedRenderer.prototype.createClassByStateMap_ = function() {
  var baseClass = this.getStructuralCssClass();

  // This ensures space-separated css classnames are not allowed, which some
  // StatedRenderers had been doing.  See http://b/13694665.
  var isValidClassName = !goog.string.contains(
    goog.string.normalizeWhitespace(baseClass), ' ');
  goog.asserts.assert(isValidClassName,
      'StatedRenderer has an invalid css class: \'' + baseClass + '\'');

  /**
   * Map of component states to state-specific structural class names,
   * used when changing the DOM in response to a state change.  Precomputed
   * and cached on first use to minimize object allocations and string
   * concatenation.
   * @private {Object}
   */
  this.classByState_ = goog.object.create(
    goog.ui.Component.State.DISABLED, this.getDisabledCssClass(),
    goog.ui.Component.State.HOVER, this.getHoverCssClass(),
    goog.ui.Component.State.ACTIVE, this.getActiveCssClass(),
    goog.ui.Component.State.SELECTED, this.getSelectedCssClass(),
    goog.ui.Component.State.CHECKED, this.getCheckedCssClass(),
    goog.ui.Component.State.FOCUSED, this.getFocusedCssClass(),
    goog.ui.Component.State.OPENED, this.getOpenCssClass()
  );
};


/**
 * Creates the lookup table of classes to states, used during decoration.
 * @private
 */
npf.ui.StatedRenderer.prototype.createStateByClassMap_ = function() {
  // We need the classByState_ map so we can transpose it.
  if (!this.classByState_) {
    this.createClassByStateMap_();
  }

  /**
   * Map of state-specific structural class names to component states,
   * used during element decoration.  Precomputed and cached on first use
   * to minimize object allocations and string concatenation.
   * @private {Object}
   */
  this.stateByClass_ = goog.object.transpose(this.classByState_);
};

/**
 * @return {string}
 */
npf.ui.StatedRenderer.prototype.getDisabledCssClass = function() {
  return goog.getCssName(this.getStructuralCssClass(), 'disabled');
};

/**
 * @return {string}
 */
npf.ui.StatedRenderer.prototype.getHoverCssClass = function() {
  return goog.getCssName(this.getStructuralCssClass(), 'hover');
};

/**
 * @return {string}
 */
npf.ui.StatedRenderer.prototype.getActiveCssClass = function() {
  return goog.getCssName(this.getStructuralCssClass(), 'active');
};

/**
 * @return {string}
 */
npf.ui.StatedRenderer.prototype.getSelectedCssClass = function() {
  return goog.getCssName(this.getStructuralCssClass(), 'selected');
};

/**
 * @return {string}
 */
npf.ui.StatedRenderer.prototype.getCheckedCssClass = function() {
  return goog.getCssName(this.getStructuralCssClass(), 'checked');
};

/**
 * @return {string}
 */
npf.ui.StatedRenderer.prototype.getFocusedCssClass = function() {
  return goog.getCssName(this.getStructuralCssClass(), 'focused');
};

/**
 * @return {string}
 */
npf.ui.StatedRenderer.prototype.getOpenCssClass = function() {
  return goog.getCssName(this.getStructuralCssClass(), 'open');
};

/**
 * @return {string}
 */
npf.ui.StatedRenderer.prototype.getRtlCssClass = function() {
  return goog.getCssName(this.getStructuralCssClass(), 'rtl');
};
