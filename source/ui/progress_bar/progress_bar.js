goog.provide('npf.ui.ProgressBar');
goog.provide('npf.ui.ProgressBar.Orientation');

goog.require('goog.ui.Component.EventType');
goog.require('goog.ui.RangeModel');
goog.require('npf.ui.RenderComponent');



/**
 * This creates a progress bar object.
 * @param {npf.ui.progressBar.Renderer=} opt_renderer
 * @param {goog.dom.DomHelper=} opt_domHelper Optional DOM helper.
 * @constructor
 * @extends {npf.ui.RenderComponent}
 */
npf.ui.ProgressBar = function(opt_renderer, opt_domHelper) {
  goog.base(this, opt_renderer ||
    npf.ui.progressBar.Renderer.getInstance(), opt_domHelper);

  this.rangeModel_ = new goog.ui.RangeModel;
  this.registerDisposable(this.rangeModel_);
  this.rangeModel_.addEventListener(goog.ui.Component.EventType.CHANGE,
    this.handleChange_, false, this);
};
goog.inherits(npf.ui.ProgressBar, npf.ui.RenderComponent);


/**
 * Enum for representing the orientation of the progress bar.
 * @enum {string}
 */
npf.ui.ProgressBar.Orientation = {
  HORIZONTAL: 'horizontal',
  VERTICAL: 'vertical'
};

/**
 * The underlying data model for the progress bar.
 * @type {goog.ui.RangeModel}
 * @private
 */
npf.ui.ProgressBar.prototype.rangeModel_;

/**
 * @type {npf.ui.ProgressBar.Orientation}
 * @private
 */
npf.ui.ProgressBar.prototype.orientation_ =
  npf.ui.ProgressBar.Orientation.HORIZONTAL;


/** @inheritDoc */
npf.ui.ProgressBar.prototype.createDom = function() {
  goog.base(this, 'createDom');

  this.setValueInternal(this.getValue());
  this.setMinimumInternal(this.getMinimum());
  this.setMaximumInternal(this.getMaximum());
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
    this.rangeModel_.setValue(value);
    this.setValueInternal(this.getValue());
  }
};

/**
 * @param {number} value
 * @protected
 */
npf.ui.ProgressBar.prototype.setValueInternal = function(value) {
  this.getRenderer().setValue(this, value);
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
    this.rangeModel_.setMinimum(value);
    this.setMinimumInternal(this.getMinimum());
  }
};

/**
 * @param {number} value
 * @protected
 */
npf.ui.ProgressBar.prototype.setMinimumInternal = function(value) {
  this.getRenderer().setMinimum(this, value);
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
    this.rangeModel_.setMaximum(value);
    this.setMaximumInternal(this.getMaximum());
  }
};

/**
 * @param {number} value
 * @protected
 */
npf.ui.ProgressBar.prototype.setMaximumInternal = function(value) {
  this.getRenderer().setMaximum(this, value);
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
  this.getRenderer().updateUi(this);
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

    this.getRenderer().updateOrientation(this.getElement, oldOrient, orient);

    // Update the DOM
    if (this.getElement()) {
      this.getRenderer().initializeUi(this);
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
 * @return {Element}
 */
npf.ui.ProgressBar.prototype.getThumbElement = function() {
  return this.getRenderer().getThumbElement(this.getElement());
};
