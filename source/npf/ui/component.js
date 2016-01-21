goog.provide('npf.ui.Component');

goog.require('goog.array');
goog.require('goog.ui.Component');
goog.require('goog.ui.IdGenerator');
goog.require('npf.dom.incremental');


/**
 * @param {goog.dom.DomHelper=} opt_domHelper Optional DOM helper.
 * @constructor
 * @struct
 * @extends {goog.ui.Component}
 */
npf.ui.Component = function(opt_domHelper) {
  npf.ui.Component.base(this, 'constructor', opt_domHelper);

  /**
   * @private {Array.<goog.Disposable>}
   */
  this.disposeOnExitDocument_ = null;

  /**
   * @private {Array.<npf.ui.Component.EventHandler>}
   */
  this.eventHandlers_ = null;

  /**
   * @private {Object<string>}
   */
  this.idsCache_ = null;

  /**
   * @private {?function(Object)}
   */
  this.incrementalUpdateWrapper_ = null;
};
goog.inherits(npf.ui.Component, goog.ui.Component);


/**
 * @typedef {{
 *  capture: boolean,
 *  element: (Node|string),
 *  eventType: string,
 *  listen: function(this:npf.ui.Component,npf.ui.Component.EventHandler),
 *  listener: function(goog.events.BrowserEvent),
 *  scope: Object,
 *  unlisten: function(this:npf.ui.Component,npf.ui.Component.EventHandler)
 * }}
 */
npf.ui.Component.EventHandler;

/**
 * @typedef {{
 *  elementOpen: function(string,?string=,?Array<*>=,...*):!Element,
 *  elementOpenStart: function(string,?string=,?Array<*>=),
 *  elementOpenEnd: function():!Element,
 *  elementClose: function(string):!Element,
 *  elementVoid: function(string,?string=,?Array<*>=,...*):!Element,
 *  elementPlaceholder: function(string,string,?Array<*>=,...*):!Element,
 *  text: function((string|number|boolean),...(function((string)):string)):!Text,
 *  attr: function(string,*)
 * }}
 */
npf.ui.Component.IncrementalDom;


/** @inheritDoc */
npf.ui.Component.prototype.enterDocument = function() {
  npf.ui.Component.base(this, 'enterDocument');

  if (this.eventHandlers_) {
    goog.array.forEach(this.eventHandlers_, function(handler) {
      this.listenEventHandler(handler);
    }, this);
  }
};

/** @inheritDoc */
npf.ui.Component.prototype.exitDocument = function() {
  if (this.eventHandlers_) {
    goog.array.forEach(this.eventHandlers_, function(handler) {
      this.unlistenEventHandler(handler);
    }, this);
  }

  npf.ui.Component.base(this, 'exitDocument');

  if (this.disposeOnExitDocument_) {
    goog.array.forEach(this.disposeOnExitDocument_, function(obj) {
      obj.dispose();
    }, this);
  }

  this.disposeOnExitDocument_ = null;
};

/** @inheritDoc */
npf.ui.Component.prototype.disposeInternal = function() {
  npf.ui.Component.base(this, 'disposeInternal');

  this.disposeOnExitDocument_ = null;
  this.idsCache_ = null;
  this.eventHandlers_ = null;
  this.incrementalUpdateWrapper_ = null;
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

/**
 * @param {Node|string} element
 * @param {string} eventType
 * @param {function(this:T,goog.events.BrowserEvent)} listener
 * @param {boolean=} opt_capture
 * @param {T=} opt_scope
 * @return {!npf.ui.Component}
 * @template T
 */
npf.ui.Component.prototype.addBrowserEventHandler = function(element, eventType,
    listener, opt_capture, opt_scope) {
  this.addEventHandler(this.listenBrowserEvent_, this.unlistenBrowserEvent_,
    element, eventType, listener, opt_capture, opt_scope);

  return this;
};

/**
 * @param {function(this:npf.ui.Component,npf.ui.Component.EventHandler)} listen
 * @param {function(this:npf.ui.Component,npf.ui.Component.EventHandler)}
 *    unlisten
 * @param {Node|string} element
 * @param {string} eventType
 * @param {function(this:T,goog.events.BrowserEvent)} listener
 * @param {boolean=} opt_capture
 * @param {T=} opt_scope
 * @return {!npf.ui.Component}
 * @template T
 */
npf.ui.Component.prototype.addEventHandler = function(listen, unlisten, element,
    eventType, listener, opt_capture, opt_scope) {
  if (!this.eventHandlers_) {
    this.eventHandlers_ = [];
  }

  /** @type {boolean} */
  var capture = !!opt_capture;
  var scope = opt_scope || null;
  /** @type {npf.ui.Component.EventHandler} */
  var handler = goog.array.find(this.eventHandlers_, function(handler) {
    return handler.element === element &&
      handler.eventType == eventType &&
      handler.listener === listener &&
      handler.capture == capture &&
      handler.scope === scope;
  });

  if (!handler) {
    handler = {
      capture: capture,
      element: element,
      eventType: eventType,
      listen: listen,
      listener: listener,
      scope: scope,
      unlisten: unlisten
    };
    this.eventHandlers_.push(handler);

    if (this.isInDocument()) {
      this.listenEventHandler(handler);
    }
  }

  return this;
};

/**
 * @param {Node|string} element
 * @param {string} eventType
 * @param {function(this:T,goog.events.BrowserEvent)} listener
 * @param {boolean=} opt_capture
 * @param {T=} opt_scope
 * @return {!npf.ui.Component}
 * @template T
 */
npf.ui.Component.prototype.removeEventHandler = function(element, eventType,
    listener, opt_capture, opt_scope) {
  if (this.eventHandlers_) {
    /** @type {boolean} */
    var capture = !!opt_capture;
    var scope = opt_scope || null;
    /** @type {number} */
    var index = goog.array.findIndex(this.eventHandlers_, function(handler) {
      return handler.element === element &&
        handler.eventType == eventType &&
        handler.listener === listener &&
        handler.capture == capture &&
        handler.scope === scope;
    });

    if (-1 < index) {
      if (this.isInDocument()) {
        /** @type {npf.ui.Component.EventHandler} */
        var handler = this.eventHandlers_[index];
        this.unlistenEventHandler(handler);
      }

      goog.array.removeAt(this.eventHandlers_, index);
    }
  }

  return this;
};

/**
 * @param {npf.ui.Component.EventHandler} handler
 * @private
 */
npf.ui.Component.prototype.listenBrowserEvent_ = function(handler) {
  /** @type {!Array.<Node>} */
  var elements = this.getEventHandlerElements(handler.element);

  goog.array.forEach(elements, function(element) {
    this.getHandler().listenWithScope(element, handler.eventType,
      handler.listener, handler.capture, handler.scope);
  }, this);
};

/**
 * @param {npf.ui.Component.EventHandler} handler
 * @private
 */
npf.ui.Component.prototype.unlistenBrowserEvent_ = function(handler) {
  /** @type {!Array.<Node>} */
  var elements = this.getEventHandlerElements(handler.element);

  goog.array.forEach(elements, function(element) {
    this.getHandler().unlisten(element, handler.eventType,
      handler.listener, handler.capture, handler.scope);
  }, this);
};

/**
 * @param {npf.ui.Component.EventHandler} handler
 * @protected
 */
npf.ui.Component.prototype.listenEventHandler = function(handler) {
  handler.listen.call(this, handler);
};

/**
 * @param {npf.ui.Component.EventHandler} handler
 * @protected
 */
npf.ui.Component.prototype.unlistenEventHandler = function(handler) {
  handler.unlisten.call(this, handler);
};

/**
 * @param {Node|string} element
 * @return {!Array.<Node>}
 * @protected
 */
npf.ui.Component.prototype.getEventHandlerElements = function(element) {
  if (goog.isString(element)) {
    return goog.array.toArray(this.getElementsByClass(element));
  } else if (element) {
    return [element];
  }

  return [];
};

/**
 * @param {string} key
 * @return {string}
 * @protected
 */
npf.ui.Component.prototype.getIdByKey = function(key) {
  if (!this.idsCache_) {
    this.idsCache_ = {};
  }

  if (!this.idsCache_[key]) {
    this.idsCache_[key] = goog.ui.IdGenerator.getInstance().getNextUniqueId();
  }

  return this.idsCache_[key];
};

/**
 * @protected
 */
npf.ui.Component.prototype.incrementalPatch = function() {
  /** @type {Element} */
  var element = this.getElement();

  if (element) {
    if (!this.incrementalUpdateWrapper_) {
      var self = this;
      this.incrementalUpdateWrapper_ = function(data) {
        self.incrementalUpdate({
          elementOpen: npf.dom.incremental.elementOpen,
          elementOpenStart: npf.dom.incremental.elementOpenStart,
          elementOpenEnd: npf.dom.incremental.elementOpenEnd,
          elementClose: npf.dom.incremental.elementClose,
          elementVoid: npf.dom.incremental.elementVoid,
          elementPlaceholder: npf.dom.incremental.elementPlaceholder,
          text: npf.dom.incremental.text,
          attr: npf.dom.incremental.attr
        }, data);
      };
    }

    npf.dom.incremental.patch(element,
      /** @type {function(Object)} */ (this.incrementalUpdateWrapper_),
      this.getIncrementalData());
  }
};

/**
 * @param {npf.ui.Component.IncrementalDom} dom
 * @param {Object} data
 * @protected
 */
npf.ui.Component.prototype.incrementalUpdate = goog.nullFunction;

/**
 * @return {Object}
 * @protected
 */
npf.ui.Component.prototype.getIncrementalData = function() {
  return null;
};
