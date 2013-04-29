goog.provide('npf.events.MouseSimulator');

goog.require('goog.Disposable');
goog.require('goog.dom');
goog.require('goog.events.EventHandler');
goog.require('goog.events.EventType');


/**
 * @param {Node} element
 * @constructor
 * @extends {goog.Disposable}
 */
npf.events.MouseSimulator = function(element) {
  goog.base(this);

  this.element_ = element;
  this.handler_ = new goog.events.EventHandler(this);
  this.registerDisposable(this.handler_);

  this.handler_
    .listen(this.element_, goog.events.EventType.TOUCHSTART, this.onStart_)
    .listen(this.element_, goog.events.EventType.TOUCHMOVE, this.onMove_)
    .listen(this.element_, goog.events.EventType.TOUCHEND, this.onEnd_);
};
goog.inherits(npf.events.MouseSimulator, goog.Disposable);


/**
 * @type {Node}
 * @private
 */
npf.events.MouseSimulator.prototype.element_;

/**
 * @type {goog.events.EventHandler}
 * @private
 */
npf.events.MouseSimulator.prototype.handler_;

/**
 * @type {boolean}
 * @private
 */
npf.events.MouseSimulator.prototype.moved_ = false;


/** @inheritDoc */
npf.events.MouseSimulator.prototype.disposeInternal = function() {
  goog.base(this, 'disposeInternal');

  this.element_ = null;
  this.handler_ = null;
};

/**
 * @param {goog.events.BrowserEvent} evt
 * @private
 */
npf.events.MouseSimulator.prototype.onStart_ = function(evt) {
  // Track movement to determine if interaction was a click
  this.moved_ = false;

  this.simulateEvent_(evt, goog.events.EventType.MOUSEOVER);
  this.simulateEvent_(evt, goog.events.EventType.MOUSEMOVE);
  this.simulateEvent_(evt, goog.events.EventType.MOUSEDOWN);
};

/**
 * @param {goog.events.BrowserEvent} evt
 * @private
 */
npf.events.MouseSimulator.prototype.onMove_ = function(evt) {
  // Interaction was not a click
  this.moved_ = true;

  this.simulateEvent_(evt, goog.events.EventType.MOUSEMOVE);
};

/**
 * @param {goog.events.BrowserEvent} evt
 * @private
 */
npf.events.MouseSimulator.prototype.onEnd_ = function(evt) {
  this.simulateEvent_(evt, goog.events.EventType.MOUSEUP);
  this.simulateEvent_(evt, goog.events.EventType.MOUSEOUT);

  // If the touch interaction did not move, it should trigger a click
  if (!this.moved_) {
    this.simulateEvent_(evt, goog.events.EventType.CLICK);
  }
};

/**
 * Simulate a mouse event based on a corresponding touch event
 * @param {goog.events.BrowserEvent} evt
 * @param {string} type
 */
npf.events.MouseSimulator.prototype.simulateEvent_ = function(evt, type) {
  /** @type {Event} */
  var browserEvent = evt.getBrowserEvent();

  // Ignore multi-touch events
  if (1 < browserEvent['touches'].length) {
    return;
  }

  evt.preventDefault();

  var touch = browserEvent['changedTouches'][0];
  /** @type {!goog.dom.DomHelper} */
  var domHelper = goog.dom.getDomHelper(this.element_);
  /** @type {!Window} */
  var win = domHelper.getWindow();
  /** @type {!Document} */
  var doc = domHelper.getDocument();
  var simulatedEvent = doc['createEvent']('MouseEvents');

  // Initialize the simulated mouse event using the touch event's coordinates
  simulatedEvent['initMouseEvent'](
    type,             // type
    true,             // bubbles
    true,             // cancelable
    win,              // view
    1,                // detail
    touch['screenX'], // screenX
    touch['screenY'], // screenY
    touch['clientX'], // clientX
    touch['clientY'], // clientY
    false,            // ctrlKey
    false,            // altKey
    false,            // shiftKey
    false,            // metaKey
    0,                // button
    null              // relatedTarget
  );

  // Dispatch the simulated event to the target element
  evt.target.dispatchEvent(simulatedEvent);
};
