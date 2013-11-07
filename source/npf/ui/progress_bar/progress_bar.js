goog.provide('npf.ui.ProgressBar');
goog.provide('npf.ui.ProgressBar.Orientation');

goog.require('goog.ui.Component.EventType');
goog.require('goog.ui.RangeModel');
goog.require('npf.ui.RenderedComponent');
goog.require('npf.ui.progressBar.Renderer');



/**
 * This creates a progress bar object.
 * @param {npf.ui.progressBar.Renderer=} opt_renderer
 * @param {goog.dom.DomHelper=} opt_domHelper Optional DOM helper.
 * @constructor
 * @extends {npf.ui.RenderedComponent}
 */
npf.ui.ProgressBar = function(opt_renderer, opt_domHelper) {
  goog.base(this, opt_renderer ||
    npf.ui.progressBar.Renderer.getInstance(), opt_domHelper);

  this.rangeModel_ = new goog.ui.RangeModel;
  this.registerDisposable(this.rangeModel_);
  this.rangeModel_.listen(
    goog.ui.Component.EventType.CHANGE, this.handleChange_, false, this);
};
goog.inherits(npf.ui.ProgressBar, npf.ui.RenderedComponent);


/**
 * Enum for representing the orientation of the progress bar.
 * @enum {string}
 */
npf.ui.ProgressBar.Orientation = {
  HORIZONTAL: 'horizontal',
  VERTICAL: 'vertical'
};


/**
 * @private {npf.ui.ProgressBar.Orientation}
 */
npf.ui.ProgressBar.prototype.orientation_ =
  npf.ui.ProgressBar.Orientation.HORIZONTAL;

/**
 * The underlying data model for the progress bar.
 * @private {goog.ui.RangeModel}
 */
npf.ui.ProgressBar.prototype.rangeModel_;


/** @inheritDoc */
npf.ui.ProgressBar.prototype.createDom = function() {
  goog.base(this, 'createDom');

  this.applyMaximum(this.getMaximum());
  this.applyMinimum(this.getMinimum());
  this.applyValue(this.getValue());
};

/** @inheritDoc */
npf.ui.ProgressBar.prototype.enterDocument = function() {
  goog.base(this, 'enterDocument');

  this.updateUi();
};

/** @inheritDoc */
npf.ui.ProgressBar.prototype.disposeInternal = function() {
  goog.base(this, 'disposeInternal');

  this.rangeModel_ = null;
};

/**
 * @return {number} The maximum value.
 */
npf.ui.ProgressBar.prototype.getMaximum = function() {
  return this.rangeModel_.getMaximum();
};

/**
 * Sets the maximum number
 * @param {number} value
 */
npf.ui.ProgressBar.prototype.setMaximum = function(value) {
  if (this.getMaximum() != value) {
    this.setMaximumInternal(value);
    this.applyMaximum(this.getMaximum());
  }
};

/**
 * @param {number} value
 * @protected
 */
npf.ui.ProgressBar.prototype.setMaximumInternal = function(value) {
  this.rangeModel_.setMaximum(value);
};

/**
 * @param {number} value
 * @protected
 */
npf.ui.ProgressBar.prototype.applyMaximum = function(value) {
  var renderer = /** @type {npf.ui.progressBar.Renderer} */ (
    this.getRenderer());
  renderer.setMaximum(this, value);
};

/**
 * @return {number} The minimum value.
 */
npf.ui.ProgressBar.prototype.getMinimum = function() {
  return this.rangeModel_.getMinimum();
};

/**
 * Sets the minimum number
 * @param {number} value
 */
npf.ui.ProgressBar.prototype.setMinimum = function(value) {
  if (this.getMinimum() != value) {
    this.setMinimumInternal(value);
    this.applyMinimum(this.getMinimum());
  }
};

/**
 * @param {number} value
 * @protected
 */
npf.ui.ProgressBar.prototype.setMinimumInternal = function(value) {
  this.rangeModel_.setMinimum(value);
};

/**
 * @param {number} value
 * @protected
 */
npf.ui.ProgressBar.prototype.applyMinimum = function(value) {
  var renderer = /** @type {npf.ui.progressBar.Renderer} */ (
    this.getRenderer());
  renderer.setMinimum(this, value);
};

/**
 * @return {npf.ui.ProgressBar.Orientation}
 */
npf.ui.ProgressBar.prototype.getOrientation = function() {
  return this.orientation_;
};

/**
 * Changes the orientation
 * @param {npf.ui.ProgressBar.Orientation} orient The orientation.
 */
npf.ui.ProgressBar.prototype.setOrientation = function(orient) {
  if (this.orientation_ != orient) {
    var oldOrient = this.orientation_;
    this.orientation_ = orient;

    var renderer = /** @type {npf.ui.progressBar.Renderer} */ (
      this.getRenderer());

    renderer.updateOrientation(this.getElement(), oldOrient, orient);

    // Update the DOM
    if (this.getElement()) {
      renderer.initializeUi(this);
      this.updateUi();
    }
  }
};

/**
 * @return {?number} The step value used to determine how to round the value.
 */
npf.ui.ProgressBar.prototype.getStep = function() {
  return this.rangeModel_.getStep();
};


/**
 * Sets the step value. The step value is used to determine how to round the
 * value.
 * @param {?number} step  The step size.
 */
npf.ui.ProgressBar.prototype.setStep = function(step) {
  this.rangeModel_.setStep(step);
};

/**
 * @return {number} The value.
 */
npf.ui.ProgressBar.prototype.getValue = function() {
  return this.rangeModel_.getValue();
};

/**
 * @param {number} value
 */
npf.ui.ProgressBar.prototype.setValue = function(value) {
  if (this.getValue() != value) {
    this.setValueInternal(value);
    this.applyValue(this.getValue());
  }
};

/**
 * @param {number} value
 * @protected
 */
npf.ui.ProgressBar.prototype.setValueInternal = function(value) {
  this.rangeModel_.setValue(value);
};

/**
 * @param {number} value
 * @protected
 */
npf.ui.ProgressBar.prototype.applyValue = function(value) {
  var renderer = /** @type {npf.ui.progressBar.Renderer} */ (
    this.getRenderer());
  renderer.setValue(this, value);
};

/**
 * Call back when the internal range model changes
 * @param {goog.events.Event} e The event object.
 * @private
 */
npf.ui.ProgressBar.prototype.handleChange_ = function(e) {
  this.updateUi();
  this.dispatchEvent(goog.ui.Component.EventType.CHANGE);
};


/**
 * This is called when we need to update the size of the thumb. This happens
 * when first created as well as when the value and the orientation changes.
 * @protected
 */
npf.ui.ProgressBar.prototype.updateUi = function() {
  var renderer = /** @type {npf.ui.progressBar.Renderer} */ (
    this.getRenderer());
  renderer.updateUi(this);
};

/**
 * @return {Element}
 */
npf.ui.ProgressBar.prototype.getThumbElement = function() {
  var renderer = /** @type {npf.ui.progressBar.Renderer} */ (
    this.getRenderer());
  return renderer.getThumbElement(this.getElement());
};
