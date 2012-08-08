goog.provide('npf.ui.Component');

goog.require('goog.events.EventTarget');
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
npf.ui.Component.prototype.disposableOnExitDocument_ = null;

/**
 * @type {goog.events.EventTarget}
 * @private
 */
npf.ui.Component.prototype.dataManager_ = null;


/** @inheritDoc */
npf.ui.Component.prototype.exitDocument = function() {
  goog.base(this, 'exitDocument');

  if (this.disposableOnExitDocument_) {
    goog.array.forEach(this.disposableOnExitDocument_, function(obj) {
      obj.dispose();
    }, this);
  }

  this.disposableOnExitDocument_ = null;
};

/** @inheritDoc */
npf.ui.Component.prototype.disposeInternal = function() {
  goog.dispose(this.dataManager_);

  goog.base(this, 'disposeInternal');

  delete this.disposableOnExitDocument_;
  delete this.dataManager_;
};

/**
 * @return {goog.events.EventTarget}
 */
npf.ui.Component.prototype.getDataManager = function() {
  return this.dataManager_;
};

/**
 * @param {goog.events.EventTarget} dataManager
 */
npf.ui.Component.prototype.setDataManager = function(dataManager) {
  this.dataManager_ = dataManager;
};

/**
 * @param {goog.Disposable} obj
 * @protected
 */
npf.ui.Component.prototype.disposeOnExitDocument = function(obj) {
  if (!this.disposableOnExitDocument_) {
    this.disposableOnExitDocument_ = [];
  }

  this.disposableOnExitDocument_.push(obj);
};
