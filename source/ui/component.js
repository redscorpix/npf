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
npf.ui.Component.prototype._disposableOnExitDocument = null;

/**
 * @type {goog.events.EventTarget}
 * @private
 */
npf.ui.Component.prototype._dataManager = null;


/** @inheritDoc */
npf.ui.Component.prototype.exitDocument = function() {
	goog.base(this, 'exitDocument');

	if (this._disposableOnExitDocument) {
		goog.array.forEach(this._disposableOnExitDocument, function(obj) {
			obj.dispose();
		}, this);
	}

	this._disposableOnExitDocument = null;
};

/** @inheritDoc */
npf.ui.Component.prototype.disposeInternal = function() {
	goog.dispose(this._dataManager);

	goog.base(this, 'disposeInternal');

	delete this._disposableOnExitDocument;
	delete this._dataManager;
};

/**
 * @return {goog.events.EventTarget}
 */
npf.ui.Component.prototype.getDataManager = function() {
	return this._dataManager;
};

/**
 * @param {goog.events.EventTarget} dataManager
 */
npf.ui.Component.prototype.setDataManager = function(dataManager) {
	this._dataManager = dataManager;
};

/**
 * @param {goog.Disposable} obj
 * @protected
 */
npf.ui.Component.prototype.disposeOnExitDocument = function(obj) {
	if (!this._disposableOnExitDocument) {
		this._disposableOnExitDocument = [];
	}

	this._disposableOnExitDocument.push(obj);
};
