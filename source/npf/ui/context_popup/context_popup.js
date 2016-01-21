goog.provide('npf.ui.ContextPopup');

goog.require('goog.positioning.AnchoredPosition');
goog.require('goog.positioning.Corner');
goog.require('goog.ui.Component.Error');
goog.require('goog.ui.Component.EventType');
goog.require('goog.Disposable');
goog.require('goog.ui.Popup');
goog.require('goog.ui.PopupBase.EventType');
goog.require('npf.fx.KeyframeAnimation');
goog.require('npf.ui.StatedComponent');
goog.require('npf.ui.contextPopup.Renderer');


/**
 * @param {Element=} opt_anchorElement
 * @param {npf.ui.contextPopup.Renderer=} opt_renderer
 * @param {goog.dom.DomHelper=} opt_domHelper
 * @constructor
 * @struct
 * @extends {npf.ui.StatedComponent}
 */
npf.ui.ContextPopup = function(opt_anchorElement, opt_renderer, opt_domHelper) {
  var renderer = opt_renderer || npf.ui.contextPopup.Renderer.getInstance();
  npf.ui.ContextPopup.base(this, 'constructor', renderer, opt_domHelper);

  /**
   * Whether the menu can move the focus to its key event target when it is
   * shown.
   * @private {boolean}
   */
  this.allowAutoFocus_ = true;

  /**
   * @private {Element}
   */
  this.anchorElement_ = opt_anchorElement || null;

  /**
   * @private {Element}
   */
  this.fadeElement_ = renderer.createFaderElement(this);

  /**
   * @private {Node}
   */
  this.fadeParentElement_ = this.getDomHelper().getDocument().body;

  /**
   * @private {boolean}
   */
  this.faderVisible_ = false;

  /**
   * @private {goog.ui.Popup}
   */
  this.popup_ = this.createPopup();
  this.popup_.setParentEventTarget(this);
  this.registerDisposable(this.popup_);

  this.setVisible(false);
};
goog.inherits(npf.ui.ContextPopup, npf.ui.StatedComponent);


/**
 * @const {number}
 */
npf.ui.ContextPopup.ANIMATION_DURATION = 300;


/** @inheritDoc */
npf.ui.ContextPopup.prototype.enterDocument = function() {
  npf.ui.ContextPopup.base(this, 'enterDocument');

  var element = /** @type {!Element} */ (this.getElement());
  /** @type {goog.fx.Transition} */
  var showTransition = this.createShowTransition(element);

  if (showTransition) {
    if (showTransition instanceof goog.Disposable) {
      this.disposeOnExitDocument(showTransition);
    }

    this.popup_.setTransition(showTransition);
  }

  this.popup_.setElement(element);

  this.getHandler().
    listen(this, goog.ui.Component.EventType.ENTER, this.handleEnter).
    listen(this.popup_, [
      goog.ui.PopupBase.EventType.BEFORE_HIDE,
      goog.ui.PopupBase.EventType.BEFORE_SHOW
    ], this.onBeforeShowOrHide_);

  if (this.isVisible()) {
    this._setFaderVisible(true);
  }
};

/** @inheritDoc */
npf.ui.ContextPopup.prototype.exitDocument = function() {
  this._setFaderVisible(false);

  npf.ui.ContextPopup.base(this, 'exitDocument');
};

/** @inheritDoc */
npf.ui.ContextPopup.prototype.disposeInternal = function() {
  npf.ui.ContextPopup.base(this, 'disposeInternal');

  this.anchorElement_ = null;
  this.fadeElement_ = null;
  this.fadeParentElement_ = null;
  this.popup_ = null;
};

/**
 * @param {goog.events.Event} evt
 * @protected
 */
npf.ui.ContextPopup.prototype.handleEnter = function(evt) {
  if (this.allowAutoFocus_) {
    this.getKeyEventTarget().focus();
  }
};

/** @inheritDoc */
npf.ui.ContextPopup.prototype.applyVisible = function(visible) {
  npf.ui.ContextPopup.base(this, 'applyVisible', visible);

  if (this.isInDocument()) {
    this._setFaderVisible(visible);
    this.popup_.setVisible(visible);

    if (
      visible &&
      this.allowAutoFocus_ &&
      this.isEnabled()
    ) {
      this.getKeyEventTarget().focus();
    }
  }
};

/**
 * @return {boolean} Whether the component can automatically move focus to its
 *    key event target when it is set to visible.
 */
npf.ui.ContextPopup.prototype.getAllowAutoFocus = function() {
  return this.allowAutoFocus_;
};

/**
 * Sets whether the component can automatically move focus to its key event
 * target when it is set to visible.
 * @param {boolean} allow Whether the component can automatically move focus
 *    to its key event target when it is set to visible.
 */
npf.ui.ContextPopup.prototype.setAllowAutoFocus = function(allow) {
  this.allowAutoFocus_ = allow;

  if (allow) {
    this.getRenderer().setFocusable(this, true);
  }
};

/**
 * @return {Element}
 */
npf.ui.ContextPopup.prototype.getAnchorElement = function() {
  return this.anchorElement_;
};

/**
 * @return {Element}
 */
npf.ui.ContextPopup.prototype.getFadeElement = function() {
  return this.fadeElement_;
};

/**
 * @return {Node}
 */
npf.ui.ContextPopup.prototype.getFadeParentElement = function() {
  return this.fadeParentElement_;
};

/**
 * @param {Node} element
 */
npf.ui.ContextPopup.prototype.setFadeParentElement = function(element) {
  if (this.isInDocument()) {
    throw Error(goog.ui.Component.Error.ALREADY_RENDERED);
  }

  this.fadeParentElement_ = element;
};

/**
 * @param {boolean} visible
 * @private
 */
npf.ui.ContextPopup.prototype._setFaderVisible = function(visible) {
  if (this.faderVisible_ != visible) {
    this.faderVisible_ = visible;
    this.applyFaderVisible(visible);
  }
};

/**
 * @param {boolean} visible
 * @protected
 */
npf.ui.ContextPopup.prototype.applyFaderVisible = function(visible) {
  if (this.fadeElement_) {
    /** @type {goog.dom.DomHelper} */
    var domHelper = this.getDomHelper();

    if (visible) {
      domHelper.appendChild(this.fadeParentElement_, this.fadeElement_);
    } else {
      domHelper.removeNode(this.fadeElement_);
    }
  }
};

/**
 * @return {!goog.ui.Popup}
 * @protected
 */
npf.ui.ContextPopup.prototype.createPopup = function() {
  /** @type {goog.positioning.AnchoredPosition} */
  var position = this.anchorElement_ ?
    new goog.positioning.AnchoredPosition(
      this.anchorElement_, goog.positioning.Corner.BOTTOM_LEFT) : null;

  return new goog.ui.Popup(null, position);
};

/**
 * @return {goog.ui.Popup}
 */
npf.ui.ContextPopup.prototype.getPopup = function() {
  return this.popup_;
};

/**
 * @param {!Element} element
 * @return {goog.fx.Transition}
 * @protected
 */
npf.ui.ContextPopup.prototype.createShowTransition = function(element) {
  var transition = new npf.fx.KeyframeAnimation(
    element, npf.ui.ContextPopup.ANIMATION_DURATION);
  transition.setEndStylesUsed(true);
  transition.fromToOpacity(0, 1);

  return transition;
};

/**
 * @param {goog.events.Event} evt
 * @private
 */
npf.ui.ContextPopup.prototype.onBeforeShowOrHide_ = function(evt) {
  /** @type {boolean} */
  var visible = goog.ui.PopupBase.EventType.BEFORE_SHOW == evt.type;
  this.setVisible(visible);
};
