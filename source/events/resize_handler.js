goog.provide('npf.events.ResizeHandler');

goog.require('goog.dom.FontSizeMonitor');
goog.require('goog.events');
goog.require('goog.events.BrowserEvent');
goog.require('goog.events.EventHandler');
goog.require('goog.events.EventTarget');


/**
 * Event handler for goog.events.EventType.RESIZE and goog.dom.FontSizeMonitor.EventType.CHANGE.
 * @constructor
 * @extends {goog.events.EventTarget}
 */
npf.events.ResizeHandler = function() {
	goog.base(this);

	this._eventHandler = new goog.events.EventHandler();
	this._eventHandler.listen(window, goog.events.EventType.RESIZE, this);

	if (this._fontSizeMonitor) {
		this._eventHandler.listen(this._fontSizeMonitor, goog.dom.FontSizeMonitor.EventType.CHANGE, this);
	}
};
goog.inherits(npf.events.ResizeHandler, goog.events.EventTarget);


/**
 * @enum {string}
 */
npf.events.ResizeHandler.EventType = {
	RESIZE: goog.events.getUniqueId('resize')
};

/**
 * @type {number}
 * @private
 */
npf.events.ResizeHandler._counter = 0;

/**
 * @type {goog.dom.FontSizeMonitor}
 * @private
 */
npf.events.ResizeHandler._fontSizeMonitor = null;

/**
 * @return {goog.dom.FontSizeMonitor}
 * @private
 */
npf.events.ResizeHandler._addListener = function() {
	npf.events.ResizeHandler._counter++;

	if (!npf.events.ResizeHandler._fontSizeMonitor) {
		npf.events.ResizeHandler._fontSizeMonitor = new goog.dom.FontSizeMonitor();
	}

	return npf.events.ResizeHandler._fontSizeMonitor;
};

/**
 * @private
 */
npf.events.ResizeHandler._removeListener = function() {
	npf.events.ResizeHandler._counter--;

	if (!--npf.events.ResizeHandler._counter) {
		npf.events.ResizeHandler._fontSizeMonitor.dispose();
		npf.events.ResizeHandler._fontSizeMonitor = null;
	}
};

/**
 * @type {goog.dom.FontSizeMonitor}
 * @private
 */
npf.events.ResizeHandler.prototype._fontSizeMonitor;

/**
 * @type {goog.events.EventHandler}
 * @private
 */
npf.events.ResizeHandler.prototype._eventHandler;

/**
 * @param {goog.events.Event} evt
 */
npf.events.ResizeHandler.prototype.handleEvent = function(evt) {
  this.dispatchEvent(npf.events.ResizeHandler.EventType.RESIZE);
};

npf.events.ResizeHandler.prototype.disposeInternal = function() {
	goog.base(this, 'disposeInternal');

	this._eventHandler.dispose();

	if (this._fontSizeMonitor) {
		npf.events.ResizeHandler._removeListener();
	}

	delete this._fontSizeMonitor;
	delete this._eventHandler;
};
