goog.provide('npf.ui.StatedComponent');

goog.require('goog.events.Event');
goog.require('goog.events.EventType');
goog.require('goog.events.KeyCodes');
goog.require('goog.events.KeyHandler');
goog.require('goog.events.KeyHandler.EventType');
goog.require('goog.ui.Component');
goog.require('goog.ui.Component.Error');
goog.require('goog.ui.Component.EventType');
goog.require('goog.ui.Component.State');
goog.require('goog.userAgent');
goog.require('npf.ui.RenderedComponent');
goog.require('npf.ui.StatedRenderer');


/**
 * Base class for UI components.  Extends {@link npf.ui.RenderedComponent}
 * by adding the following:
 *  <ul>
 *    <li>a {@link goog.events.KeyHandler}, to simplify keyboard handling,
 *    <li>a pluggable <em>renderer</em> framework, to simplify the creation of
 *        simple components without the need to subclass this class,
 *    <li>the notion of component <em>content</em>, like a text caption or DOM
 *        structure displayed in the component (e.g. a button label),
 *    <li>getter and setter for component content, as well as a getter and
 *        setter specifically for caption text (for convenience),
 *    <li>support for hiding/showing the component,
      <li>fine-grained component over supported states and state transition
          events, and
 *    <li>default mouse and keyboard event handling.
 *  </ul>
 * This class has sufficient built-in functionality for most simple UI
 * components. All components dispatch SHOW, HIDE, ENTER, LEAVE, and ACTION
 * events on show, hide, mouseover, mouseout, and user action, respectively.
 * Additional states are also supported.
 * @param {npf.ui.StatedRenderer=} opt_renderer Renderer used to render or
 *     decorate the component; defaults to {@link npf.ui.StatedRenderer}.
 * @param {goog.dom.DomHelper=} opt_domHelper Optional DOM helper, used for
 *     document interaction.
 * @constructor
 * @extends {npf.ui.RenderedComponent}
 */
npf.ui.StatedComponent = function(opt_renderer, opt_domHelper) {
  goog.base(this, opt_renderer || npf.ui.StatedRenderer.getInstance(),
    opt_domHelper);

  /**
   * Current component state; a bit mask of {@link goog.ui.Component.State}s.
   * @private {number}
   */
  this.state_ = 0x00;

  /**
   * A bit mask of {@link goog.ui.Component.State}s this component supports.
   * @private {number}
   */
  this.supportedStates_ = 0x00;

  /**
   * A bit mask of {@link goog.ui.Component.State}s for which this component
   * provides default event handling.  For example, a component that handles
   * the HOVER state automatically will highlight itself on mouseover, whereas
   * a component that doesn't handle HOVER automatically will only dispatch
   * ENTER and LEAVE events but not call {@link setHighlighted} on itself.
   * By default, components provide default event handling for all states.
   * Components hosted in containers (e.g. menu items in a menu, or buttons in a
   * toolbar) will typically want to have their container manage their highlight
   * state.  Selectable components managed by a selection model will also
   * typically want their selection state to be managed by the model.
   * @private {number}
   */
  this.autoStates_ = goog.ui.Component.State.ALL;

  /**
   * A bit mask of {@link goog.ui.Component.State}s for which this component
   * dispatches state transition events. Because events are expensive, the
   * default behavior is to not dispatch any state transition events at all.
   * Use the {@link #setDispatchTransitionEvents} API to request transition
   * events  as needed.  Subclasses may enable transition events by default.
   * Components hosted in containers or managed by a selection model will
   * typically want to dispatch transition events.
   * @private {number}
   */
  this.statesWithTransitionEvents_ = 0x00;

  /**
   * Component visibility.
   * @private {boolean}
   */
  this.visible_ = true;

  /**
   * Keyboard event handler.
   * @private {goog.events.KeyHandler}
   */
  this.keyHandler_ = null;

  /**
   * Whether the component should listen for and handle mouse events; defaults to
   * true.
   * @private {boolean}
   */
  this.handleMouseEvents_ = true;


  /**
   * Whether the component allows text selection within its DOM.  Defaults to
   * false.
   * @private {boolean}
   */
  this.allowTextSelection_ = false;

  /**
   * The component's preferred ARIA role.
   * @private {?goog.a11y.aria.Role}
   */
  this.preferredAriaRole_ = null;
};
goog.inherits(npf.ui.StatedComponent, npf.ui.RenderedComponent);


/** @inheritDoc */
npf.ui.StatedComponent.prototype.createDom = function() {
  goog.base(this, 'createDom');

  /** @type {Element} */
  var element = this.getElement();
  var renderer = /** @type {npf.ui.StatedRenderer} */ (this.getRenderer());

  // Initialize ARIA role.
  renderer.setAriaRole(element, this.getPreferredAriaRole());

  // Initialize text selection.
  if (!this.isAllowTextSelection()) {
    // The renderer is assumed to create selectable elements.  Since making
    // elements unselectable is expensive, only do it if needed (bug 1037090).
    renderer.setAllowTextSelection(element, false);
  }

  // Initialize visibility.
  if (!this.isVisible()) {
    // The renderer is assumed to create visible elements. Since hiding
    // elements can be expensive, only do it if needed (bug 1037105).
    renderer.setVisible(element, false);
  }
};

/**
 * Decorates the given element with this component. Overrides {@link}
 * npf.ui.RenderedComponent#decorateInternal} by delegating DOM manipulation
 * to the component's renderer.
 * @param {Element} element Element to decorate.
 * @protected
 * @override
 */
npf.ui.StatedComponent.prototype.decorateInternal = function(element) {
  goog.base(this, 'decorateInternal', element);

  var renderer = /** @type {npf.ui.StatedRenderer} */ (this.getRenderer());

  // Initialize ARIA role.
  renderer.setAriaRole(element, this.getPreferredAriaRole());

  // Initialize text selection.
  if (!this.isAllowTextSelection()) {
    renderer.setAllowTextSelection(element, false);
  }

  // Initialize visibility based on the decorated element's styling.
  this.visible_ = renderer.isElementShown(element);
};

/** @inheritDoc */
npf.ui.StatedComponent.prototype.enterDocument = function() {
  goog.base(this, 'enterDocument');

  var renderer = /** @type {npf.ui.StatedRenderer} */ (this.getRenderer());

  // Call the renderer's initializeDom method to configure properties of the
  // component's DOM that can only be done once it's in the document.
  renderer.initializeDom(this);

  // Initialize event handling if at least one state other than DISABLED is
  // supported.
  if (this.supportedStates_ & ~goog.ui.Component.State.DISABLED) {
    // Initialize mouse event handling if the component is configured to handle
    // its own mouse events.  (Components hosted in containers don't need to
    // handle their own mouse events.)
    if (this.isHandleMouseEvents()) {
      this.enableMouseEventHandling_(true);
    }

    // Initialize keyboard event handling if the component is focusable and has
    // a key event target.  (Components hosted in containers typically aren't
    // focusable, allowing their container to handle keyboard events for them.)
    if (this.isSupportedState(goog.ui.Component.State.FOCUSED)) {
      var keyTarget = this.getKeyEventTarget();

      if (keyTarget) {
        var keyHandler = this.getKeyHandler();
        keyHandler.attach(keyTarget);

        this.getHandler()
          .listen(keyHandler, goog.events.KeyHandler.EventType.KEY,
            this.handleKeyEvent)
          .listen(keyTarget, goog.events.EventType.FOCUS, this.handleFocus)
          .listen(keyTarget, goog.events.EventType.BLUR, this.handleBlur);
      }
    }
  }
};

/**
 * Returns true if the component is configured to handle its own mouse events,
 * false otherwise.  Components not hosted in {@link goog.ui.Container}s have
 * to handle their own mouse events, but components hosted in containers may
 * allow their parent to handle mouse events on their behalf.  Considered
 * protected; should only be used within this package and by subclasses.
 * @return {boolean} Whether the component handles its own mouse events.
 */
npf.ui.StatedComponent.prototype.isHandleMouseEvents = function() {
  return this.handleMouseEvents_;
};


/**
 * Enables or disables mouse event handling for the component.  Containers may
 * use this method to disable mouse event handling in their child components.
 * Considered protected; should only be used within this package and by
 * subclasses.
 * @param {boolean} enable Whether to enable or disable mouse event handling.
 */
npf.ui.StatedComponent.prototype.setHandleMouseEvents = function(enable) {
  if (this.isInDocument() && enable != this.handleMouseEvents_) {
    // Already in the document; need to update event handler.
    this.enableMouseEventHandling_(enable);
  }

  this.handleMouseEvents_ = enable;
};


/**
 * Returns the DOM element on which the component is listening for keyboard
 * events (null if none).
 * @return {Element} Element on which the component is listening for key
 *     events.
 */
npf.ui.StatedComponent.prototype.getKeyEventTarget = function() {
  var renderer = /** @type {npf.ui.StatedRenderer} */ (this.getRenderer());

  return renderer.getKeyEventTarget(this);
};


/**
 * Returns the keyboard event handler for this component, lazily created the
 * first time this method is called.  Considered protected; should only be
 * used within this package and by subclasses.
 * @return {goog.events.KeyHandler} Keyboard event handler for this component.
 * @protected
 */
npf.ui.StatedComponent.prototype.getKeyHandler = function() {
  return this.keyHandler_ || (this.keyHandler_ = new goog.events.KeyHandler());
};



/**
 * Returns the component's preferred ARIA role. This can be used by a component
 * to override the role that would be assigned by the renderer.  This is useful
 * in cases where a different ARIA role is appropriate for a component because
 * of the context in which it's used.  E.g., a {@link goog.ui.MenuButton} added
 * to a {@link goog.ui.Select} should have an ARIA role of LISTBOX and not
 * MENUITEM.
 * @return {?goog.a11y.aria.Role} This component's preferred ARIA role or null
 *    if no preferred ARIA role is set.
 */
npf.ui.StatedComponent.prototype.getPreferredAriaRole = function() {
  return this.preferredAriaRole_;
};


/**
 * Sets the component's preferred ARIA role. This can be used to override the
 * role that would be assigned by the renderer.  This is useful in cases where a
 * different ARIA role is appropriate for a component because of the
 * context in which it's used.  E.g., a {@link goog.ui.MenuButton} added to a
 * {@link goog.ui.Select} should have an ARIA role of LISTBOX and not MENUITEM.
 * @param {goog.a11y.aria.Role} role This component's preferred ARIA role.
 */
npf.ui.StatedComponent.prototype.setPreferredAriaRole = function(role) {
  this.preferredAriaRole_ = role;
};


/**
 * Enables or disables mouse event handling on the component.
 * @param {boolean} enable Whether to enable mouse event handling.
 * @private
 */
npf.ui.StatedComponent.prototype.enableMouseEventHandling_ = function(enable) {
  /** @type {goog.events.EventHandler} */
  var handler = this.getHandler();
  /** @type {Element} */
  var element = this.getElement();
  /** @type {Element} */
  var hoverableElement = this.getHoverableElement();

  if (enable) {
    handler
      .listen(hoverableElement, goog.events.EventType.MOUSEOVER,
        this.handleMouseOver)
      .listen(element, goog.events.EventType.MOUSEDOWN, this.handleMouseDown)
      .listen(element, goog.events.EventType.MOUSEUP, this.handleMouseUp)
      .listen(hoverableElement, goog.events.EventType.MOUSEOUT,
        this.handleMouseOut);

    if (goog.userAgent.IE) {
      handler.listen(element, goog.events.EventType.DBLCLICK,
        this.handleDblClick);
    }
  } else {
    handler
      .unlisten(hoverableElement, goog.events.EventType.MOUSEOVER,
        this.handleMouseOver)
      .unlisten(element, goog.events.EventType.MOUSEDOWN, this.handleMouseDown)
      .unlisten(element, goog.events.EventType.MOUSEUP, this.handleMouseUp)
      .unlisten(hoverableElement, goog.events.EventType.MOUSEOUT,
        this.handleMouseOut);

    if (goog.userAgent.IE) {
      handler.unlisten(element, goog.events.EventType.DBLCLICK,
        this.handleDblClick);
    }
  }
};


/**
 * Cleans up the component before its DOM is removed from the document, and
 * removes event handlers.  Overrides
 * {@link npf.ui.RenderedComponent#exitDocument} by making sure that components
 * that are removed from the document aren't focusable (i.e. have no tab index).
 * @override
 */
npf.ui.StatedComponent.prototype.exitDocument = function() {
  goog.base(this, 'exitDocument');

  if (this.keyHandler_) {
    this.keyHandler_.detach();
  }

  if (this.isVisible() && this.isEnabled()) {
    var renderer = /** @type {npf.ui.StatedRenderer} */ (this.getRenderer());
    renderer.setFocusable(this, false);
  }
};


/** @override */
npf.ui.StatedComponent.prototype.disposeInternal = function() {
  goog.base(this, 'disposeInternal');

  goog.dispose(this.keyHandler_);
  this.keyHandler_ = null;
};

/** @override */
npf.ui.StatedComponent.prototype.setRightToLeft = function(rightToLeft) {
  // The superclass implementation ensures the component isn't in the document.
  goog.base(this, 'setRightToLeft', rightToLeft);

  var element = this.getElement();

  if (element) {
    var renderer = /** @type {npf.ui.StatedRenderer} */ (this.getRenderer());
    renderer.setRightToLeft(element, rightToLeft);
  }
};


/**
 * Returns true if the component allows text selection within its DOM, false
 * otherwise.  Components that disallow text selection have the appropriate
 * unselectable styling applied to their elements.  Note that components hosted
 * in containers will report that they allow text selection even if their
 * container disallows text selection.
 * @return {boolean} Whether the component allows text selection.
 */
npf.ui.StatedComponent.prototype.isAllowTextSelection = function() {
  return this.allowTextSelection_;
};


/**
 * Allows or disallows text selection within the component's DOM.
 * @param {boolean} allow Whether the component should allow text selection.
 */
npf.ui.StatedComponent.prototype.setAllowTextSelection = function(allow) {
  this.allowTextSelection_ = allow;

  var element = this.getElement();

  if (element) {
    var renderer = /** @type {npf.ui.StatedRenderer} */ (this.getRenderer());
    renderer.setAllowTextSelection(element, allow);
  }
};


/**
 * Returns true if the component's visibility is set to visible, false if
 * it is set to hidden.  A component that is set to hidden is guaranteed
 * to be hidden from the user, but the reverse isn't necessarily true.
 * A component may be set to visible but can otherwise be obscured by another
 * element, rendered off-screen, or hidden using direct CSS manipulation.
 * @return {boolean} Whether the component is visible.
 */
npf.ui.StatedComponent.prototype.isVisible = function() {
  return this.visible_;
};


/**
 * Shows or hides the component.  Does nothing if the component already has
 * the requested visibility.  Otherwise, dispatches a SHOW or HIDE event as
 * appropriate, giving listeners a chance to prevent the visibility change.
 * When showing a component that is both enabled and focusable, ensures that
 * its key target has a tab index.  When hiding a component that is enabled
 * and focusable, blurs its key target and removes its tab index.
 * @param {boolean} visible Whether to show or hide the component.
 * @param {boolean=} opt_force If true, doesn't check whether the component
 *     already has the requested visibility, and doesn't dispatch any events.
 * @return {boolean} Whether the visibility was changed.
 */
npf.ui.StatedComponent.prototype.setVisible = function(visible, opt_force) {
  if (opt_force || (this.visible_ != visible && this.dispatchEvent(visible ?
      goog.ui.Component.EventType.SHOW : goog.ui.Component.EventType.HIDE))) {
    var element = this.getElement();
    var renderer = /** @type {npf.ui.StatedRenderer} */ (this.getRenderer());

    if (element) {
      renderer.setVisible(element, visible);
    }

    if (this.isEnabled()) {
      renderer.setFocusable(this, visible);
    }

    this.visible_ = visible;

    return true;
  }

  return false;
};


/**
 * Returns true if the component is enabled, false otherwise.
 * @return {boolean} Whether the component is enabled.
 */
npf.ui.StatedComponent.prototype.isEnabled = function() {
  return !this.hasState(goog.ui.Component.State.DISABLED);
};


/**
 * Enables or disables the component.  Does nothing if this state transition
 * is disallowed.  If the component is both visible and focusable, updates its
 * focused state and tab index as needed.  If the component is being disabled,
 * ensures that it is also deactivated and un-highlighted first.  Note that the
 * component's enabled/disabled state is "locked" as long as it is hosted in a
 * {@link goog.ui.Container} that is itself disabled; this is to prevent clients
 * from accidentally re-enabling a component that is in a disabled container.
 * @param {boolean} enable Whether to enable or disable the component.
 * @see #isTransitionAllowed
 */
npf.ui.StatedComponent.prototype.setEnabled = function(enable) {
  if (this.isTransitionAllowed(goog.ui.Component.State.DISABLED, !enable)) {
    if (!enable) {
      this.setActive(false);
      this.setHighlighted(false);
    }
    if (this.isVisible()) {
      var renderer = /** @type {npf.ui.StatedRenderer} */ (this.getRenderer());
      renderer.setFocusable(this, enable);
    }
    this.setState(goog.ui.Component.State.DISABLED, !enable);
  }
};


/**
 * Returns true if the component is currently highlighted, false otherwise.
 * @return {boolean} Whether the component is highlighted.
 */
npf.ui.StatedComponent.prototype.isHighlighted = function() {
  return this.hasState(goog.ui.Component.State.HOVER);
};


/**
 * Highlights or unhighlights the component.  Does nothing if this state
 * transition is disallowed.
 * @param {boolean} highlight Whether to highlight or unhighlight the component.
 * @see #isTransitionAllowed
 */
npf.ui.StatedComponent.prototype.setHighlighted = function(highlight) {
  if (this.isTransitionAllowed(goog.ui.Component.State.HOVER, highlight)) {
    this.setState(goog.ui.Component.State.HOVER, highlight);
  }
};


/**
 * Returns true if the component is active (pressed), false otherwise.
 * @return {boolean} Whether the component is active.
 */
npf.ui.StatedComponent.prototype.isActive = function() {
  return this.hasState(goog.ui.Component.State.ACTIVE);
};


/**
 * Activates or deactivates the component.  Does nothing if this state
 * transition is disallowed.
 * @param {boolean} active Whether to activate or deactivate the component.
 * @see #isTransitionAllowed
 */
npf.ui.StatedComponent.prototype.setActive = function(active) {
  if (this.isTransitionAllowed(goog.ui.Component.State.ACTIVE, active)) {
    this.setState(goog.ui.Component.State.ACTIVE, active);
  }
};


/**
 * Returns true if the component is selected, false otherwise.
 * @return {boolean} Whether the component is selected.
 */
npf.ui.StatedComponent.prototype.isSelected = function() {
  return this.hasState(goog.ui.Component.State.SELECTED);
};


/**
 * Selects or unselects the component.  Does nothing if this state transition
 * is disallowed.
 * @param {boolean} select Whether to select or unselect the component.
 * @see #isTransitionAllowed
 */
npf.ui.StatedComponent.prototype.setSelected = function(select) {
  if (this.isTransitionAllowed(goog.ui.Component.State.SELECTED, select)) {
    this.setState(goog.ui.Component.State.SELECTED, select);
  }
};


/**
 * Returns true if the component is checked, false otherwise.
 * @return {boolean} Whether the component is checked.
 */
npf.ui.StatedComponent.prototype.isChecked = function() {
  return this.hasState(goog.ui.Component.State.CHECKED);
};


/**
 * Checks or unchecks the component.  Does nothing if this state transition
 * is disallowed.
 * @param {boolean} check Whether to check or uncheck the component.
 * @see #isTransitionAllowed
 */
npf.ui.StatedComponent.prototype.setChecked = function(check) {
  if (this.isTransitionAllowed(goog.ui.Component.State.CHECKED, check)) {
    this.setState(goog.ui.Component.State.CHECKED, check);
  }
};


/**
 * Returns true if the component is styled to indicate that it has keyboard
 * focus, false otherwise.  Note that {@code isFocused()} returning true
 * doesn't guarantee that the component's key event target has keyborad focus,
 * only that it is styled as such.
 * @return {boolean} Whether the component is styled to indicate as having
 *     keyboard focus.
 */
npf.ui.StatedComponent.prototype.isFocused = function() {
  return this.hasState(goog.ui.Component.State.FOCUSED);
};


/**
 * Applies or removes styling indicating that the component has keyboard focus.
 * Note that unlike the other "set" methods, this method is called as a result
 * of the component's element having received or lost keyboard focus, not the
 * other way around, so calling {@code setFocused(true)} doesn't guarantee that
 * the component's key event target has keyboard focus, only that it is styled
 * as such.
 * @param {boolean} focused Whether to apply or remove styling to indicate that
 *     the component's element has keyboard focus.
 */
npf.ui.StatedComponent.prototype.setFocused = function(focused) {
  if (this.isTransitionAllowed(goog.ui.Component.State.FOCUSED, focused)) {
    this.setState(goog.ui.Component.State.FOCUSED, focused);
  }
};


/**
 * Returns true if the component is open (expanded), false otherwise.
 * @return {boolean} Whether the component is open.
 */
npf.ui.StatedComponent.prototype.isOpen = function() {
  return this.hasState(goog.ui.Component.State.OPENED);
};


/**
 * Opens (expands) or closes (collapses) the component.  Does nothing if this
 * state transition is disallowed.
 * @param {boolean} open Whether to open or close the component.
 * @see #isTransitionAllowed
 */
npf.ui.StatedComponent.prototype.setOpen = function(open) {
  if (this.isTransitionAllowed(goog.ui.Component.State.OPENED, open)) {
    this.setState(goog.ui.Component.State.OPENED, open);
  }
};


/**
 * Returns the component's state as a bit mask of {@link
 * goog.ui.Component.State}s.
 * @return {number} Bit mask representing component state.
 */
npf.ui.StatedComponent.prototype.getState = function() {
  return this.state_;
};


/**
 * Returns true if the component is in the specified state, false otherwise.
 * @param {goog.ui.Component.State} state State to check.
 * @return {boolean} Whether the component is in the given state.
 */
npf.ui.StatedComponent.prototype.hasState = function(state) {
  return !!(this.state_ & state);
};


/**
 * Sets or clears the given state on the component, and updates its styling
 * accordingly.  Does nothing if the component is already in the correct state
 * or if it doesn't support the specified state.  Doesn't dispatch any state
 * transition events; use advisedly.
 * @param {goog.ui.Component.State} state State to set or clear.
 * @param {boolean} enable Whether to set or clear the state (if supported).
 */
npf.ui.StatedComponent.prototype.setState = function(state, enable) {
  if (this.isSupportedState(state) && enable != this.hasState(state)) {
    var renderer = /** @type {npf.ui.StatedRenderer} */ (this.getRenderer());
    // Delegate actual styling to the renderer, since it is DOM-specific.
    renderer.setState(this, state, enable);
    this.state_ = enable ? this.state_ | state : this.state_ & ~state;
  }
};


/**
 * Sets the component's state to the state represented by a bit mask of
 * {@link goog.ui.Component.State}s.  Unlike {@link #setState}, doesn't
 * update the component's styling, and doesn't reject unsupported states.
 * Called by renderers during element decoration.  Considered protected;
 * should only be used within this package and by subclasses.
 *
 * This should only be used by subclasses and its associated renderers.
 *
 * @param {number} state Bit mask representing component state.
 */
npf.ui.StatedComponent.prototype.setStateInternal = function(state) {
  this.state_ = state;
};


/**
 * Returns true if the component supports the specified state, false otherwise.
 * @param {goog.ui.Component.State} state State to check.
 * @return {boolean} Whether the component supports the given state.
 */
npf.ui.StatedComponent.prototype.isSupportedState = function(state) {
  return !!(this.supportedStates_ & state);
};


/**
 * Enables or disables support for the given state. Disabling support
 * for a state while the component is in that state is an error.
 * @param {goog.ui.Component.State} state State to support or de-support.
 * @param {boolean} support Whether the component should support the state.
 * @throws {Error} If disabling support for a state the component is currently
 *    in.
 */
npf.ui.StatedComponent.prototype.setSupportedState = function(state, support) {
  if (this.isInDocument() && this.hasState(state) && !support) {
    // Since we hook up event handlers in enterDocument(), this is an error.
    throw Error(goog.ui.Component.Error.ALREADY_RENDERED);
  }

  if (!support && this.hasState(state)) {
    // We are removing support for a state that the component is currently in.
    this.setState(state, false);
  }

  this.supportedStates_ = support ?
    this.supportedStates_ | state : this.supportedStates_ & ~state;
};


/**
 * Returns true if the component provides default event handling for the state,
 * false otherwise.
 * @param {goog.ui.Component.State} state State to check.
 * @return {boolean} Whether the component provides default event handling for
 *     the state.
 */
npf.ui.StatedComponent.prototype.isAutoState = function(state) {
  return !!(this.autoStates_ & state) && this.isSupportedState(state);
};


/**
 * Enables or disables automatic event handling for the given state(s).
 * @param {number} states Bit mask of {@link goog.ui.Component.State}s for which
 *     default event handling is to be enabled or disabled.
 * @param {boolean} enable Whether the component should provide default event
 *     handling for the state(s).
 */
npf.ui.StatedComponent.prototype.setAutoStates = function(states, enable) {
  this.autoStates_ = enable ?
    this.autoStates_ | states : this.autoStates_ & ~states;
};


/**
 * Returns true if the component is set to dispatch transition events for the
 * given state, false otherwise.
 * @param {goog.ui.Component.State} state State to check.
 * @return {boolean} Whether the component dispatches transition events for
 *     the state.
 */
npf.ui.StatedComponent.prototype.isDispatchTransitionEvents = function(state) {
  return !!(this.statesWithTransitionEvents_ & state) &&
    this.isSupportedState(state);
};


/**
 * Enables or disables transition events for the given state(s).  Components
 * handle state transitions internally by default, and only dispatch state
 * transition events if explicitly requested to do so by calling this method.
 * @param {number} states Bit mask of {@link goog.ui.Component.State}s for
 *     which transition events should be enabled or disabled.
 * @param {boolean} enable Whether transition events should be enabled.
 */
npf.ui.StatedComponent.prototype.setDispatchTransitionEvents = function(states,
    enable) {
  this.statesWithTransitionEvents_ = enable ?
      this.statesWithTransitionEvents_ | states :
      this.statesWithTransitionEvents_ & ~states;
};


/**
 * Returns true if the transition into or out of the given state is allowed to
 * proceed, false otherwise.  A state transition is allowed under the following
 * conditions:
 * <ul>
 *   <li>the component supports the state,
 *   <li>the component isn't already in the target state,
 *   <li>either the component is configured not to dispatch events for this
 *       state transition, or a transition event was dispatched and wasn't
 *       canceled by any event listener, and
 *   <li>the component hasn't been disposed of
 * </ul>
 * Considered protected; should only be used within this package and by
 * subclasses.
 * @param {goog.ui.Component.State} state State to/from which the component is
 *     transitioning.
 * @param {boolean} enable Whether the component is entering or leaving the
 *    state.
 * @return {boolean} Whether the state transition is allowed to proceed.
 * @protected
 */
npf.ui.StatedComponent.prototype.isTransitionAllowed = function(state, enable) {
  return this.isSupportedState(state) &&
    this.hasState(state) != enable &&
    (!(this.statesWithTransitionEvents_ & state) || this.dispatchEvent(
        goog.ui.Component.getStateTransitionEvent(state, enable))) &&
    !this.isDisposed();
};


/**
 * Handles mouseover events.  Dispatches an ENTER event; if the event isn't
 * canceled, the component is enabled, and it supports auto-highlighting,
 * highlights the component.  Considered protected; should only be used
 * within this package and by subclasses.
 * @param {goog.events.BrowserEvent} e Mouse event to handle.
 */
npf.ui.StatedComponent.prototype.handleMouseOver = function(e) {
  var renderer = /** @type {npf.ui.StatedRenderer} */ (this.getRenderer());

  // Ignore mouse moves between descendants.
  if (
    !renderer.isMouseEventWithinElement(e, this.getHoverableElement()) &&
    this.dispatchEvent(goog.ui.Component.EventType.ENTER) &&
    this.isEnabled() &&
    this.isAutoState(goog.ui.Component.State.HOVER)
  ) {
    this.setHighlighted(true);
  }
};


/**
 * Handles mouseout events.  Dispatches a LEAVE event; if the event isn't
 * canceled, and the component supports auto-highlighting, deactivates and
 * un-highlights the component.  Considered protected; should only be used
 * within this package and by subclasses.
 * @param {goog.events.BrowserEvent} e Mouse event to handle.
 */
npf.ui.StatedComponent.prototype.handleMouseOut = function(e) {
  var renderer = /** @type {npf.ui.StatedRenderer} */ (this.getRenderer());

  if (
    !renderer.isMouseEventWithinElement(e, this.getHoverableElement()) &&
    this.dispatchEvent(goog.ui.Component.EventType.LEAVE)
  ) {
    if (this.isAutoState(goog.ui.Component.State.ACTIVE)) {
      // Deactivate on mouseout; otherwise we lose track of the mouse button.
      this.setActive(false);
    }

    if (this.isAutoState(goog.ui.Component.State.HOVER)) {
      this.setHighlighted(false);
    }
  }
};

/**
 * @return {Element}
 */
npf.ui.StatedComponent.prototype.getHoverableElement = function() {
  return this.getElement();
};

/**
 * Handles mousedown events.  If the component is enabled, highlights and
 * activates it.  If the component isn't configured for keyboard access,
 * prevents it from receiving keyboard focus.  Considered protected; should
 * only be used within this package andy by subclasses.
 * @param {goog.events.BrowserEvent} e Mouse event to handle.
 */
npf.ui.StatedComponent.prototype.handleMouseDown = function(e) {
  if (this.isEnabled()) {
    // Highlight enabled component on mousedown, regardless of the mouse button.
    if (this.isAutoState(goog.ui.Component.State.HOVER)) {
      this.setHighlighted(true);
    }

    // For the left button only, activate the component, and focus its key event
    // target (if supported).
    if (e.isMouseActionButton()) {
      if (this.isAutoState(goog.ui.Component.State.ACTIVE)) {
        this.setActive(true);
      }

      var renderer = /** @type {npf.ui.StatedRenderer} */ (this.getRenderer());

      if (renderer.isFocusable(this)) {
        this.getKeyEventTarget().focus();
      }
    }
  }

  // Cancel the default action unless the component allows text selection.
  if (!this.isAllowTextSelection() && e.isMouseActionButton()) {
    e.preventDefault();
  }
};


/**
 * Handles mouseup events.  If the component is enabled, highlights it.  If
 * the component has previously been activated, performs its associated action
 * by calling {@link performActionInternal}, then deactivates it.  Considered
 * protected; should only be used within this package and by subclasses.
 * @param {goog.events.BrowserEvent} e Mouse event to handle.
 */
npf.ui.StatedComponent.prototype.handleMouseUp = function(e) {
  if (this.isEnabled()) {
    if (this.isAutoState(goog.ui.Component.State.HOVER)) {
      this.setHighlighted(true);
    }
    if (this.isActive() &&
        this.performActionInternal(e) &&
        this.isAutoState(goog.ui.Component.State.ACTIVE)) {
      this.setActive(false);
    }
  }
};


/**
 * Handles dblclick events.  Should only be registered if the user agent is
 * IE.  If the component is enabled, performs its associated action by calling
 * {@link performActionInternal}.  This is used to allow more performant
 * buttons in IE.  In IE, no mousedown event is fired when that mousedown will
 * trigger a dblclick event.  Because of this, a user clicking quickly will
 * only cause ACTION events to fire on every other click.  This is a workaround
 * to generate ACTION events for every click.  Unfortunately, this workaround
 * won't ever trigger the ACTIVE state.  This is roughly the same behaviour as
 * if this were a 'button' element with a listener on mouseup.  Considered
 * protected; should only be used within this package and by subclasses.
 * @param {goog.events.BrowserEvent} e Mouse event to handle.
 */
npf.ui.StatedComponent.prototype.handleDblClick = function(e) {
  if (this.isEnabled()) {
    this.performActionInternal(e);
  }
};


/**
 * Performs the appropriate action when the component is activated by the user.
 * The default implementation first updates the checked and selected state of
 * components that support them, then dispatches an ACTION event.  Considered
 * protected; should only be used within this package and by subclasses.
 * @param {goog.events.Event} e Event that triggered the action.
 * @return {boolean} Whether the action is allowed to proceed.
 * @protected
 */
npf.ui.StatedComponent.prototype.performActionInternal = function(e) {
  if (this.isAutoState(goog.ui.Component.State.CHECKED)) {
    this.setChecked(!this.isChecked());
  }

  if (this.isAutoState(goog.ui.Component.State.SELECTED)) {
    this.setSelected(true);
  }

  if (this.isAutoState(goog.ui.Component.State.OPENED)) {
    this.setOpen(!this.isOpen());
  }

  var actionEvent = new goog.events.Event(goog.ui.Component.EventType.ACTION,
    this);

  if (e) {
    /** @type {!Array.<string>} */
    var properties = [
      'altKey', 'ctrlKey', 'metaKey', 'shiftKey', 'platformModifierKey'
    ];

    for (var property, i = 0; property = properties[i]; i++) {
      actionEvent[property] = e[property];
    }
  }

  return this.dispatchEvent(actionEvent);
};


/**
 * Handles focus events on the component's key event target element.  If the
 * component is focusable, updates its state and styling to indicate that it
 * now has keyboard focus.  Considered protected; should only be used within
 * this package and by subclasses.  <b>Warning:</b> IE dispatches focus and
 * blur events asynchronously!
 * @param {goog.events.Event} e Focus event to handle.
 */
npf.ui.StatedComponent.prototype.handleFocus = function(e) {
  if (this.isAutoState(goog.ui.Component.State.FOCUSED)) {
    this.setFocused(true);
  }
};


/**
 * Handles blur events on the component's key event target element.  Always
 * deactivates the component.  In addition, if the component is focusable,
 * updates its state and styling to indicate that it no longer has keyboard
 * focus.  Considered protected; should only be used within this package and
 * by subclasses.  <b>Warning:</b> IE dispatches focus and blur events
 * asynchronously!
 * @param {goog.events.Event} e Blur event to handle.
 */
npf.ui.StatedComponent.prototype.handleBlur = function(e) {
  if (this.isAutoState(goog.ui.Component.State.ACTIVE)) {
    this.setActive(false);
  }

  if (this.isAutoState(goog.ui.Component.State.FOCUSED)) {
    this.setFocused(false);
  }
};


/**
 * Attempts to handle a keyboard event, if the component is enabled and visible,
 * by calling {@link handleKeyEventInternal}.  Considered protected; should only
 * be used within this package and by subclasses.
 * @param {goog.events.KeyEvent} e Key event to handle.
 * @return {boolean} Whether the key event was handled.
 */
npf.ui.StatedComponent.prototype.handleKeyEvent = function(e) {
  if (
    this.isVisible() && this.isEnabled() &&
    this.handleKeyEventInternal(e)
  ) {
    e.preventDefault();
    e.stopPropagation();

    return true;
  }

  return false;
};


/**
 * Attempts to handle a keyboard event; returns true if the event was handled,
 * false otherwise.  Considered protected; should only be used within this
 * package and by subclasses.
 * @param {goog.events.KeyEvent} e Key event to handle.
 * @return {boolean} Whether the key event was handled.
 * @protected
 */
npf.ui.StatedComponent.prototype.handleKeyEventInternal = function(e) {
  return e.keyCode == goog.events.KeyCodes.ENTER &&
    this.performActionInternal(e);
};
