goog.provide('npf.events');

goog.require('goog.array');
goog.require('goog.dom');
goog.require('goog.events');
goog.require('goog.events.EventType');
goog.require('npf.events.MouseSimulator');
goog.require('npf.userAgent.support');


/**
 * @type {!Object.<number>}
 * @private
 */
npf.events.uidsMap_ = {};

/**
 * @type {!Object.<npf.events.MouseSimulator>}
 * @private
 */
npf.events.simulatorsMap_ = {};

/**
 * @type {!Array.<goog.events.EventType>}
 */
npf.events.simulatedMouseEventTypes = [
  goog.events.EventType.CLICK,
  goog.events.EventType.MOUSEDOWN,
  goog.events.EventType.MOUSEMOVE,
  goog.events.EventType.MOUSEOUT,
  goog.events.EventType.MOUSEOVER,
  goog.events.EventType.MOUSEUP
];

/**
 * @param {goog.events.EventType|string} eventType
 * @return {boolean}
 */
npf.events.isEmulatedEventType = (function() {
  var map = {};

  goog.array.forEach(npf.events.simulatedMouseEventTypes, function(eventType) {
    map[eventType] = 1;
  });

  return function(eventType) {
    return !!map[eventType];
  };
})();

/**
 * Emulates browser events: mouseover, mousemove, mousedown, mouseup, mouseout,
 * click.
 */
npf.events.simulateMouseEvents = function() {
  if (!npf.userAgent.support.getTouch()) {
    return;
  }

  var listen = goog.events.listen_;
  var unlistenByKey = goog.events.unlistenByKey;

  /**
   * Adds an event listener for a specific event on a DOM Node or an object that
   * has implemented {@link goog.events.EventTarget}. A listener can only be
   * added once to an object and if it is added again the key for the listener
   * is returned.
   *
   * Note that a one-off listener will not change an existing listener,
   * if any. On the other hand a normal listener will change existing
   * one-off listener to become a normal listener.
   *
   * @param {EventTarget|goog.events.EventTarget} src The node to listen to
   *     events on.
   * @param {?string} type Event type or array of event types.
   * @param {Function|Object} listener Callback method, or an object with a
   *     handleEvent function.
   * @param {boolean} callOnce Whether the listener is a one-off
   *     listener or otherwise.
   * @param {boolean=} opt_capt Whether to fire in capture phase (defaults to
   *     false).
   * @param {Object=} opt_handler Element in whose scope to call the listener.
   * @return {goog.events.ListenableKey} Unique key for the listener.
   * @private
   */
  goog.events.listen_ = function(src, type, listener, callOnce, opt_capt,
      opt_handler) {
    /** @type {goog.events.ListenableKey} */
    var listenableKey = listen(
      src, type, listener, callOnce, opt_capt, opt_handler);
    /** @type {number} */
    var key = listenableKey.key;

    if (
      type &&
      npf.events.isEmulatedEventType(type) &&
      src instanceof Node
    ) {
      if (npf.events.uidsMap_[key]) {
        npf.events.uidsMap_[key]++;
      } else {
        npf.events.uidsMap_[key] = 1;
        npf.events.simulatorsMap_[key] = new npf.events.MouseSimulator(src);
      }
    }

    return listenableKey;
  };

  /**
   * Removes an event listener which was added with listen() by the key
   * returned by listen().
   *
   * @param {goog.events.Key} key The key returned by listen() for this
   *     event listener.
   * @return {boolean} indicating whether the listener was there to remove.
   */
  goog.events.unlistenByKey = function(key) {
    if (npf.events.uidsMap_[key]) {
      npf.events.uidsMap_[key]--;

      if (!npf.events.uidsMap_[key]) {
        npf.events.simulatorsMap_[key].dispose();

        delete npf.events.uidsMap_[key];
        delete npf.events.simulatorsMap_[key];
      }
    }

    return unlistenByKey(key);
  };
};

/**
 * Checks if a mouse event (mouseover or mouseout) occured below an element.
 * @param {goog.events.BrowserEvent} evt Mouse event (should be mouseover or
 *                                       mouseout).
 * @param {Node} element The ancestor element.
 * @return {boolean} Whether the event has a relatedTarget (the element the
 *                   mouse is coming from) and it's a descendent of elem.
 */
npf.events.isMouseEventWithinElement = function(evt, element) {
  // If relatedTarget is null, it means there was no previous element (e.g.
  // the mouse moved out of the window).  Assume this means that the mouse
  // event was not within the element.
	return !!evt.relatedTarget && goog.dom.contains(element, evt.relatedTarget);
};
