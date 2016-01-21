goog.provide('npf.ui.button.Renderer');

goog.require('goog.a11y.aria');
goog.require('goog.a11y.aria.Role');
goog.require('goog.a11y.aria.State');
goog.require('goog.asserts');
goog.require('goog.ui.Component.State');
goog.require('goog.ui.ButtonSide');
goog.require('npf.ui.StatedRenderer');



/**
 * @constructor
 * @struct
 * @extends {npf.ui.StatedRenderer}
 */
npf.ui.button.Renderer = function() {
  npf.ui.button.Renderer.base(this, 'constructor');
};
goog.inherits(npf.ui.button.Renderer, npf.ui.StatedRenderer);
goog.addSingletonGetter(npf.ui.button.Renderer);


/**
 * Default CSS class to be applied to the root element of components rendered
 * by this renderer.
 * @type {string}
 */
npf.ui.button.Renderer.CSS_CLASS = goog.getCssName('npf-button');


/** @override */
npf.ui.button.Renderer.prototype.getCssClass = function() {
  return npf.ui.button.Renderer.CSS_CLASS;
};

/** @override */
npf.ui.button.Renderer.prototype.createDom = function(component) {
  var button = /** @type {!npf.ui.Button} */ (component);
  /** @type {!Element} */
  var element = npf.ui.button.Renderer.base(this, 'createDom', button);
  this.setContent(element, button.getContent());
  this.setTooltip(element, button.getTooltip() || '');

  var value = button.getValue();

  if (value) {
    this.setValue(element, String(value));
  }

  // If this is a toggle button, set ARIA state
  if (button.isSupportedState(goog.ui.Component.State.CHECKED)) {
    this.updateAriaState(
      element, goog.ui.Component.State.CHECKED, button.isChecked());
  }

  return element;
};

/** @override */
npf.ui.button.Renderer.prototype.decorate = function(component, element) {
  var button = /** @type {!npf.ui.Button} */ (component);
  // The superclass implementation takes care of common attributes; we only
  // need to set the value and the tooltip.
  element = npf.ui.button.Renderer.base(this, 'decorate', button, element);

  button.setValue(this.getValue(element));
  button.setTooltip(this.getTooltip(element) || '');

  // If this is a toggle button, set ARIA state
  if (button.isSupportedState(goog.ui.Component.State.CHECKED)) {
    this.updateAriaState(
      element, goog.ui.Component.State.CHECKED, button.isChecked());
  }

  return element;
};

/**
 * Returns the ARIA role to be applied to buttons.
 * @return {goog.a11y.aria.Role|undefined} ARIA role.
 * @override
 */
npf.ui.button.Renderer.prototype.getAriaRole = function() {
  return goog.a11y.aria.Role.BUTTON;
};


/**
 * Updates the button's ARIA (accessibility) state if the button is being
 * treated as a checkbox. Also makes sure that attributes which aren't
 * supported by buttons aren't being added.
 * @param {Element} element Element whose ARIA state is to be updated.
 * @param {goog.ui.Component.State} state Component state being enabled or
 *     disabled.
 * @param {boolean} enable Whether the state is being enabled or disabled.
 * @protected
 * @override
 */
npf.ui.button.Renderer.prototype.updateAriaState = function(element, state,
    enable) {
  switch (state) {
    // If button has CHECKED or SELECTED state, assign aria-pressed
    case goog.ui.Component.State.SELECTED:
    case goog.ui.Component.State.CHECKED:
      goog.asserts.assert(element, 'The button DOM element cannot be null.');
      goog.a11y.aria.setState(element, goog.a11y.aria.State.PRESSED, enable);
      break;
    default:
    case goog.ui.Component.State.OPENED:
    case goog.ui.Component.State.DISABLED:
      npf.ui.button.Renderer.base(
        this, 'updateAriaState', element, state, enable);
      break;
  }
};

/**
 * Takes a button's root element, and returns the value associated with it.
 * No-op in the base class.
 * @param {Element} element The button's root element.
 * @return {string|undefined} The button's value (undefined if none).
 */
npf.ui.button.Renderer.prototype.getValue = goog.nullFunction;

/**
 * Takes a button's root element and a value, and updates the element to reflect
 * the new value.  No-op in the base class.
 * @param {Element} element The button's root element.
 * @param {string} value New value.
 */
npf.ui.button.Renderer.prototype.setValue = goog.nullFunction;

/**
 * Takes a button's root element, and returns its tooltip text.
 * @param {Element} element The button's root element.
 * @return {string|undefined} The tooltip text.
 */
npf.ui.button.Renderer.prototype.getTooltip = function(element) {
  return element.title;
};

/**
 * Takes a button's root element and a tooltip string, and updates the element
 * with the new tooltip.
 * @param {Element} element The button's root element.
 * @param {string} tooltip New tooltip text.
 */
npf.ui.button.Renderer.prototype.setTooltip = function(element, tooltip) {
  if (element) {
    // Don't set a title attribute if there isn't a tooltip. Blank title
    // attributes can be interpreted incorrectly by screen readers.
    if (tooltip) {
      element.title = tooltip;
    } else {
      element.removeAttribute('title');
    }
  }
};

/**
 * Collapses the border on one or both sides of the button, allowing it to be
 * combined with the adjacent button(s), forming a single UI componenet with
 * multiple targets.
 * @param {npf.ui.Button} button Button to update.
 * @param {number} sides Bitmap of one or more {@link goog.ui.ButtonSide}s for
 *     which borders should be collapsed.
 */
npf.ui.button.Renderer.prototype.setCollapsed = function(button, sides) {
  /** @type {boolean} */
  var isRtl = button.isRightToLeft();
  /** @type {string} */
  var collapseLeftClassName = this.getCollapseLeftCssClass();
  /** @type {string} */
  var collapseRightClassName = this.getCollapseRightCssClass();

  button.enableClassName(isRtl ? collapseRightClassName : collapseLeftClassName,
    !!(sides & goog.ui.ButtonSide.START));
  button.enableClassName(isRtl ? collapseLeftClassName : collapseRightClassName,
    !!(sides & goog.ui.ButtonSide.END));
};

/**
 * @return {string}
 */
npf.ui.button.Renderer.prototype.getCollapseLeftCssClass = function() {
  return goog.getCssName(this.getStructuralCssClass(), 'collapse-left');
};

/**
 * @return {string}
 */
npf.ui.button.Renderer.prototype.getCollapseRightCssClass = function() {
  return goog.getCssName(this.getStructuralCssClass(), 'collapse-right');
};
