goog.provide('npf.ui.Button');

goog.require('goog.events.EventType');
goog.require('goog.events.KeyCodes');
goog.require('goog.events.KeyHandler.EventType');
goog.require('goog.ui.Component.State');
goog.require('npf.ui.StatedComponent');
goog.require('npf.ui.button.Renderer');



/**
 * A button control, rendered as a native browser button by default.
 *
 * @param {npf.dom.Content=} opt_content Text caption or existing DOM
 *     structure to display as the button's caption (if any).
 * @param {npf.ui.button.Renderer=} opt_renderer Renderer used to render or
 *     decorate the button.
 * @param {goog.dom.DomHelper=} opt_domHelper Optional DOM helper, used for
 *     document interaction.
 * @constructor
 * @struct
 * @extends {npf.ui.StatedComponent}
 */
npf.ui.Button = function(opt_content, opt_renderer, opt_domHelper) {
  npf.ui.Button.base(this, 'constructor', opt_renderer ||
    npf.ui.button.Renderer.getInstance(), opt_domHelper);

  /**
   * Tooltip text for the button, displayed on hover.
   * @private {string?}
   */
  this.tooltip_ = null;

  /**
   * Value associated with the button.
   * @private {*}
   */
  this.value_ = null;

  this.setSupportedState(goog.ui.Component.State.ACTIVE, true);
  this.setSupportedState(goog.ui.Component.State.DISABLED, true);
  this.setSupportedState(goog.ui.Component.State.FOCUSED, true);
  this.setSupportedState(goog.ui.Component.State.HOVER, true);
  this.setContentInternal(goog.isDef(opt_content) ? opt_content : null);
};
goog.inherits(npf.ui.Button, npf.ui.StatedComponent);



/** @override */
npf.ui.Button.prototype.enterDocument = function() {
  npf.ui.Button.base(this, 'enterDocument');

  if (this.isSupportedState(goog.ui.Component.State.FOCUSED)) {
    var keyTarget = this.getKeyEventTarget();

    if (keyTarget) {
      this.getHandler().
        listen(keyTarget, goog.events.EventType.KEYUP,
          this.handleKeyEventInternal);
    }
  }
};

/** @override */
npf.ui.Button.prototype.disposeInternal = function() {
  npf.ui.Button.base(this, 'disposeInternal');

  this.tooltip_ = null;
  this.value_ = null;
};

/**
 * Collapses the border on one or both sides of the button, allowing it to be
 * combined with the adjancent button(s), forming a single UI componenet with
 * multiple targets.
 * @param {number} sides Bitmap of one or more {@link goog.ui.ButtonSide}s for
 *     which borders should be collapsed.
 */
npf.ui.Button.prototype.setCollapsed = function(sides) {
  var renderer = /** @type {!npf.ui.button.Renderer} */ (this.getRenderer());
  renderer.setCollapsed(this, sides);
};

/**
 * Returns the tooltip for the button.
 * @return {string?} Tooltip text (undefined if none).
 */
npf.ui.Button.prototype.getTooltip = function() {
  return this.tooltip_;
};

/**
 * Sets the tooltip for the button, and updates its DOM.
 * @param {string} tooltip New tooltip text.
 */
npf.ui.Button.prototype.setTooltip = function(tooltip) {
  if (this.tooltip_ !== tooltip) {
    this.setTooltipInternal(tooltip);
    var renderer = /** @type {!npf.ui.button.Renderer} */ (this.getRenderer());
    renderer.setTooltip(this.getElement(), tooltip);
  }
};

/**
 * Sets the tooltip for the button.  Unlike {@link #setTooltip}, doesn't update
 * the button's DOM.  Considered protected; to be called only by renderer code
 * during element decoration.
 * @param {string} tooltip New tooltip text.
 * @protected
 */
npf.ui.Button.prototype.setTooltipInternal = function(tooltip) {
  this.tooltip_ = tooltip;
};

/**
 * Returns the value associated with the button.
 * @return {*} Button value.
 */
npf.ui.Button.prototype.getValue = function() {
  return this.value_;
};

/**
 * Sets the value associated with the button, and updates its DOM.
 * @param {*} value New button value.
 */
npf.ui.Button.prototype.setValue = function(value) {
  this.value_ = value;

  var renderer = /** @type {!npf.ui.button.Renderer} */ (this.getRenderer());
  renderer.setValue(this.getElement(), /** @type {string} */ (value));
};

/**
 * Sets the value associated with the button.  Unlike {@link #setValue},
 * doesn't update the button's DOM.  Considered protected; to be called only
 * by renderer code during element decoration.
 * @param {*} value New button value.
 * @protected
 */
npf.ui.Button.prototype.setValueInternal = function(value) {
  this.value_ = value;
};

/**
 * Attempts to handle a keyboard event; returns true if the event was handled,
 * false otherwise.  If the button is enabled and the Enter/Space key was
 * pressed, handles the event by dispatching an {@code ACTION} event,
 * and returns true.
 * @param {goog.events.KeyEvent} e Key event to handle.
 * @return {boolean} Whether the key event was handled.
 * @protected
 * @override
 */
npf.ui.Button.prototype.handleKeyEventInternal = function(e) {
  if (
    e.keyCode == goog.events.KeyCodes.ENTER &&
    e.type == goog.events.KeyHandler.EventType.KEY ||
    e.keyCode == goog.events.KeyCodes.SPACE &&
    e.type == goog.events.EventType.KEYUP
  ) {
    return this.performActionInternal(e);
  }

  // Return true for space keypress (even though the event is handled on keyup)
  // as preventDefault needs to be called up keypress to take effect in IE and
  // WebKit.
  return e.keyCode == goog.events.KeyCodes.SPACE;
};
