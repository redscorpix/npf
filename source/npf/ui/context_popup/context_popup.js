goog.provide('npf.ui.ContextPopup');

goog.require('goog.dom');
goog.require('goog.positioning.AnchoredPosition');
goog.require('goog.ui.Popup');
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
  goog.base(this, opt_renderer ||
    npf.ui.contextPopup.Renderer.getInstance(), opt_domHelper);

  this._anchorElement = opt_anchorElement || null;
  this._fadeElement = this.getRenderer().createFaderElement(this);
};
goog.inherits(npf.ui.ContextPopup, npf.ui.RenderedComponent);


/**
 * @type {number}
 * @const
 */
npf.ui.ContextPopup.ANIMATION_DURATION = 300;

/**
 * @type {Element}
 * @private
 */
npf.ui.ContextPopup.prototype._anchorElement;

/**
 * @type {Element}
 * @private
 */
npf.ui.ContextPopup.prototype._fadeElement;

/**
 * @type {goog.ui.Popup}
 * @private
 */
npf.ui.ContextPopup.prototype._popup = null;

/**
 * @type {npf.fx.KeyframeAnimation}
 * @private
 */
npf.ui.ContextPopup.prototype._showTransition = null;

/**
 * @type {boolean}
 * @private
 */
npf.ui.ContextPopup.prototype._visible = false;


/** @inheritDoc */
npf.ui.ContextPopup.prototype.enterDocument = function() {
  goog.base(this, 'enterDocument');

  /** @type {Element} */
  var element = this.getElement();

  this._showTransition = new npf.fx.KeyframeAnimation(element,
    npf.ui.ContextPopup.ANIMATION_DURATION);
  this.registerDisposable(this._showTransition);
  this._showTransition.setEndStylesUsed(true);
  this._showTransition.fromToOpacity(0, 1);

  this._popup = this.createPopup(element);
  this._popup.setTransition(this._showTransition);
  this._popup.setParentEventTarget(this);

  var PopupEventType = goog.ui.PopupBase.EventType;

  this.getHandler()
    .listen(this._popup, PopupEventType.BEFORE_SHOW, this._onBeforeShow)
    .listen(this._popup, PopupEventType.BEFORE_HIDE, this._onBeforeHide);

  this.setVisibleInternal(this._visible);
};

/** @inheritDoc */
npf.ui.ContextPopup.prototype.exitDocument = function() {
  this._popup.dispose();
  this._popup = null;
  this._showTransition = null;

  if (this._visible) {
    this.setFaderVisible(false);
  }

  goog.base(this, 'exitDocument');
};

/** @inheritDoc */
npf.ui.ContextPopup.prototype.disposeInternal = function() {
  goog.base(this, 'disposeInternal');

  this._anchorElement = null;
  this._fadeElement = null;
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
  return this._anchorElement;
};

/**
 * @param {Element} element
 */
npf.ui.ContextPopup.prototype.setAnchorElement = function(element) {
  this._anchorElement = element;
};

/**
 * @return {goog.ui.Popup}
 */
npf.ui.ContextPopup.prototype.getPopup = function() {
  return this._popup;
};

/**
 * @param {boolean} visible
 */
npf.ui.ContextPopup.prototype.setVisible = function(visible) {
  if (this._visible != visible) {
    this._visible = visible;
    this.setVisibleInternal(this._visible);
  }
};

/**
 * @param {boolean} visible
 * @protected
 */
npf.ui.ContextPopup.prototype.setVisibleInternal = function(visible) {
  if (this._popup) {
    this._popup.setVisible(visible);
  }
};

/**
 * @param {goog.events.Event} evt
 * @private
 */
npf.ui.ContextPopup.prototype._onBeforeShow = function(evt) {
  this._visible = true;
  this.setFaderVisible(this._visible);
};

/**
 * @param {goog.events.Event} evt
 * @private
 */
npf.ui.ContextPopup.prototype._onBeforeHide = function(evt) {
  this._visible = false;
  this.setFaderVisible(this._visible);
};

/**
 * @param {boolean} visible
 * @protected
 */
npf.ui.ContextPopup.prototype.setFaderVisible = function(visible) {
  if (this._fadeElement) {
    if (visible) {
      goog.dom.appendChild(this.getDomHelper().getDocument().body,
        this._fadeElement);
    } else {
      goog.dom.removeNode(this._fadeElement);
    }
  }
};
