goog.provide('NpfEventDispatcher');

goog.require('goog.debug.ErrorHandler');
goog.require('goog.events');
goog.require('goog.events.Event');
goog.require('goog.events.EventHandler');
goog.require('goog.events.EventTarget');


/**
 * @constructor
 * @extends {goog.events.EventTarget}
 */
NpfEventDispatcher = function() {
	goog.base(this);
};
goog.inherits(NpfEventDispatcher, goog.events.EventTarget);


/**
 * Removes an event listener from the event target. The handler must be the
 * same object as the one added. If the handler has not been added then
 * nothing is done.
 * @param {string=} opt_type The type of the event to listen for.
 * @param {boolean=} opt_capture In DOM-compliant browsers, this determines
 *     whether the listener is fired during the capture or bubble phase
 *     of the event.
 */
NpfEventDispatcher.prototype.removeAllListeners = function(opt_type, opt_capture) {
	goog.events.removeAll(this, opt_type, opt_capture);
};

goog.exportSymbol('NpfEventDispatcher', NpfEventDispatcher);
goog.exportSymbol('NpfEventDispatcher.prototype.addListener', NpfEventDispatcher.prototype.addEventListener);
goog.exportSymbol('NpfEventDispatcher.prototype.removeListener', NpfEventDispatcher.prototype.removeEventListener);
goog.exportSymbol('NpfEventDispatcher.prototype.removeAll', NpfEventDispatcher.prototype.removeAllListeners);
goog.exportSymbol('NpfEventDispatcher.prototype.dispatch', NpfEventDispatcher.prototype.dispatchEvent);
goog.exportSymbol('NpfEventDispatcher.prototype.dispose', NpfEventDispatcher.prototype.dispose);
goog.exportSymbol('NpfEventDispatcher.prototype.isDisposed', NpfEventDispatcher.prototype.isDisposed);
goog.exportSymbol('NpfEventDispatcher.prototype.setParent', NpfEventDispatcher.prototype.setParentEventTarget);
goog.exportSymbol('NpfEventDispatcher.prototype.getParent', NpfEventDispatcher.prototype.getParentEventTarget);
goog.exportSymbol('NpfEventDispatcher.prototype.disposeInternal', NpfEventDispatcher.prototype.disposeInternal);

goog.exportSymbol('NpfEvent', goog.events.Event);
goog.exportSymbol('NpfEvent.prototype.type', goog.events.Event.prototype.type);
goog.exportSymbol('NpfEvent.prototype.taget', goog.events.Event.prototype.target);
goog.exportSymbol('NpfEvent.prototype.currentTarget', goog.events.Event.prototype.currentTarget);
