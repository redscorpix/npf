goog.provide('npf.messaging.WebWorkify');
goog.provide('npf.messaging.WebWorkify.MessageEvent');

goog.require('goog.events');
goog.require('goog.events.Event');
goog.require('goog.events.EventTarget');
goog.require('goog.object');
goog.require('goog.userAgent');
goog.require('npf.messaging.webWorker');


/**
 * @param {function(!Object)} func
 * @param {Object<boolean|number|string|Object|Function>=} opt_attrs
 * @constructor
 * @struct
 * @extends {goog.events.EventTarget}
 */
npf.messaging.WebWorkify = function(func, opt_attrs) {
  npf.messaging.WebWorkify.base(this, 'constructor');

  /**
   * @private {Object}
   */
  this.object_ = null;

  /**
   * @private {Worker}
   */
  this.worker_ = null;

  if (npf.messaging.webWorker.isSupported() && !goog.userAgent.EDGE_OR_IE) {
    this.worker_ = npf.messaging.webWorker.create(func, opt_attrs);
    this.worker_.onmessage = goog.bind(this.onWorkerMessage_, this);
  } else {
    this.object_ = {
      'onmessage': null,
      'postMessage': goog.bind(this.onObjectMessage_, this)
    };

    if (opt_attrs) {
      goog.object.forEach(opt_attrs, function(attr, key) {
        this.object_[key] = attr;
      }, this);
    }

    func(this.object_);
  }
};
goog.inherits(npf.messaging.WebWorkify, goog.events.EventTarget);


/**
 * @enum {string}
 */
npf.messaging.WebWorkify.EventType = {

  /**
   * npf.messaging.WebWorkify.MessageEvent
   */
  MESSAGE: goog.events.getUniqueId('message')
};


/** @inheritDoc */
npf.messaging.WebWorkify.prototype.disposeInternal = function() {
  if (this.worker_) {
    this.worker_.terminate();
  }

  npf.messaging.WebWorkify.base(this, 'disposeInternal');

  this.object_ = null;
  this.worker_ = null;
};

/**
 * @param {*} message
 * @param {Array.<!Transferable>=} opt_transfer
 */
npf.messaging.WebWorkify.prototype.postMessage = function(message,
    opt_transfer) {
  if (this.worker_) {
    this.worker_.postMessage(message, opt_transfer);
  } else if (this.object_['onmessage']) {
    this.object_['onmessage']({
      'data': message
    }, opt_transfer);
  }
};

/**
 * @param {*} message
 * @param {Array.<!Transferable>=} opt_transfer
 */
npf.messaging.WebWorkify.prototype.onObjectMessage_ = function(message,
    opt_transfer) {
  var event = new npf.messaging.WebWorkify.MessageEvent(message);
  this.dispatchEvent(event);
};

/**
 * @param {!MessageEvent.<*>} evt
 * @private
 */
npf.messaging.WebWorkify.prototype.onWorkerMessage_ = function(evt) {
  var event = new npf.messaging.WebWorkify.MessageEvent(evt.data);
  this.dispatchEvent(event);
};


/**
 * @param {*} data
 * @constructor
 * @struct
 * @extends {goog.events.Event}
 */
npf.messaging.WebWorkify.MessageEvent = function(data) {
  npf.messaging.WebWorkify.MessageEvent.base(
    this, 'constructor', npf.messaging.WebWorkify.EventType.MESSAGE);

  /**
   * @type {*}
   */
  this.data = data;
};
goog.inherits(npf.messaging.WebWorkify.MessageEvent, goog.events.Event);
