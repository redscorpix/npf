goog.provide('npf.ui.ContextPopup');

goog.require('goog.dom');
goog.require('goog.positioning.AnchoredPosition');
goog.require('goog.positioning.Corner');
goog.require('goog.ui.Popup');
goog.require('goog.ui.PopupBase.EventType');
goog.require('npf.fx.KeyframeAnimation');
goog.require('npf.ui.RenderedComponent');
goog.require('npf.ui.contextPopup.Renderer');


/**
 * @param {Element=} opt_anchorElement
 * @param {npf.ui.contextPopup.Renderer=} opt_renderer
 * @param {goog.dom.DomHelper=} opt_domHelper
 * @constructor
 * @extends {npf.ui.RenderedComponent}
 */
npf.ui.ContextPopup = function(opt_anchorElement, opt_renderer, opt_domHelper) {
  var renderer = opt_renderer || npf.ui.contextPopup.Renderer.getInstance();
  goog.base(this, renderer, opt_domHelper);

  this.anchorElement_ = opt_anchorElement || null;
  this.fadeElement_ = renderer.createFaderElement(this);
};
goog.inherits(npf.ui.ContextPopup, npf.ui.RenderedComponent);


/**
 * @const {number}
 */
npf.ui.ContextPopup.ANIMATION_DURATION = 300;


/**
 * @private {Element}
 */
npf.ui.ContextPopup.prototype.anchorElement_;

/**
 * @private {Element}
 */
npf.ui.ContextPopup.prototype.fadeElement_;

/**
 * @private {goog.ui.Popup}
 */
npf.ui.ContextPopup.prototype.popup_ = null;

/**
 * @private {npf.fx.KeyframeAnimation}
 */
npf.ui.ContextPopup.prototype.showTransition_ = null;

/**
 * @private {boolean}
 */
npf.ui.ContextPopup.prototype.visible_ = false;


/** @inheritDoc */
npf.ui.ContextPopup.prototype.enterDocument = function() {
  goog.base(this, 'enterDocument');

  /** @type {Element} */
  var element = this.getElement();

  this.showTransition_ = new npf.fx.KeyframeAnimation(
    element, npf.ui.ContextPopup.ANIMATION_DURATION);
  this.registerDisposable(this.showTransition_);
  this.showTransition_.setEndStylesUsed(true);
  this.showTransition_.fromToOpacity(0, 1);

  this.popup_ = this.createPopup(element);
  this.popup_.setTransition(this.showTransition_);
  this.popup_.setParentEventTarget(this);

  var PopupEventType = goog.ui.PopupBase.EventType;

  this.getHandler()
    .listen(this.popup_, PopupEventType.BEFORE_SHOW, this.onBeforeShow_)
    .listen(this.popup_, PopupEventType.BEFORE_HIDE, this.onBeforeHide_);

  this.setVisibleInternal(this.visible_);
};

/** @inheritDoc */
npf.ui.ContextPopup.prototype.exitDocument = function() {
  this.popup_.dispose();
  this.popup_ = null;
  this.showTransition_ = null;

  if (this.visible_) {
    this.setFaderVisible(false);
  }

  goog.base(this, 'exitDocument');
};

/** @inheritDoc */
npf.ui.ContextPopup.prototype.disposeInternal = function() {
  goog.base(this, 'disposeInternal');

  this.anchorElement_ = null;
  this.fadeElement_ = null;
};

/**
 * @param {Element} element
 * @return {!goog.ui.Popup}
 */
npf.ui.ContextPopup.prototype.createPopup = function(element) {
  var position = new goog.positioning.AnchoredPosition(
    this.getAnchorElement(), goog.positioning.Corner.BOTTOM_LEFT);

  return new goog.ui.Popup(element, position);
};

/**
 * @return {Element}
 */
npf.ui.ContextPopup.prototype.getAnchorElement = function() {
  return this.anchorElement_;
};

/**
 * @param {Element} element
 */
npf.ui.ContextPopup.prototype.setAnchorElement = function(element) {
  this.anchorElement_ = element;
};

/**
 * @return {goog.ui.Popup}
 */
npf.ui.ContextPopup.prototype.getPopup = function() {
  return this.popup_;
};

/**
 * @param {boolean} visible
 */
npf.ui.ContextPopup.prototype.setVisible = function(visible) {
  if (this.visible_ != visible) {
    this.visible_ = visible;
    this.setVisibleInternal(this.visible_);
  }
};

/**
 * @param {boolean} visible
 * @protected
 */
npf.ui.ContextPopup.prototype.setVisibleInternal = function(visible) {
  if (this.popup_) {
    this.popup_.setVisible(visible);
  }
};

/**
 * @param {goog.events.Event} evt
 * @private
 */
npf.ui.ContextPopup.prototype.onBeforeShow_ = function(evt) {
  this.visible_ = true;
  this.setFaderVisible(this.visible_);
};

/**
 * @param {goog.events.Event} evt
 * @private
 */
npf.ui.ContextPopup.prototype.onBeforeHide_ = function(evt) {
  this.visible_ = false;
  this.setFaderVisible(this.visible_);
};

/**
 * @param {boolean} visible
 * @protected
 */
npf.ui.ContextPopup.prototype.setFaderVisible = function(visible) {
  if (this.fadeElement_) {
    if (visible) {
      goog.dom.appendChild(this.getDomHelper().getDocument().body,
        this.fadeElement_);
    } else {
      goog.dom.removeNode(this.fadeElement_);
    }
  }
};
