goog.provide('npf.ui.Component');

goog.require('goog.array');
goog.require('goog.ui.Component');


/**
 * @param {goog.dom.DomHelper=} opt_domHelper Optional DOM helper.
 * @constructor
 * @extends {goog.ui.Component}
 */
npf.ui.Component = function(opt_domHelper) {
  goog.base(this, opt_domHelper);
};
goog.inherits(npf.ui.Component, goog.ui.Component);


/**
 * @type {Array.<goog.Disposable>}
 * @private
 */
npf.ui.Component.prototype.disposeOnExitDocument_ = null;


/** @inheritDoc */
npf.ui.Component.prototype.exitDocument = function() {
  goog.base(this, 'exitDocument');

  if (this.disposeOnExitDocument_) {
    goog.array.forEach(this.disposeOnExitDocument_, function(obj) {
      obj.dispose();
    }, this);
  }

  this.disposeOnExitDocument_ = null;
};

/** @inheritDoc */
npf.ui.Component.prototype.disposeInternal = function() {
  goog.base(this, 'disposeInternal');

  this.disposeOnExitDocument_ = null;
};

/**
 * @param {goog.Disposable} obj
 * @protected
 */
npf.ui.Component.prototype.disposeOnExitDocument = function(obj) {
  if (!this.disposeOnExitDocument_) {
    this.disposeOnExitDocument_ = [];
  }

  this.disposeOnExitDocument_.push(obj);
};
