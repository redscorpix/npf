goog.provide('npf.pages.Page');
goog.provide('npf.pages.Page.EventType');
goog.provide('npf.pages.PageErrorEvent');

goog.require('goog.dom');
goog.require('goog.events');
goog.require('goog.events.Event');
goog.require('goog.events.EventHandler');
goog.require('goog.events.EventTarget');
goog.require('npf.Router');
goog.require('npf.pages.Request');


/**
 * @param {npf.pages.Manager} manager
 * @param {string} type
 * @param {goog.dom.DomHelper=} opt_domHelper
 * @constructor
 * @struct
 * @extends {goog.events.EventTarget}
 */
npf.pages.Page = function(manager, type, opt_domHelper) {
  npf.pages.Page.base(this, 'constructor');

  /**
   * @private {goog.dom.DomHelper}
   */
  this.domHelper_ = opt_domHelper || goog.dom.getDomHelper();

  /**
   * @private {npf.pages.Manager}
   */
  this.manager_ = manager;

  /**
   * @private {npf.pages.Request}
   */
  this.request_ = null;

  /**
   * @private {string}
   */
  this.type_ = type;

  /**
   * @private {goog.events.EventHandler.<!npf.pages.Page>}
   */
  this.handler_ = new goog.events.EventHandler(this);
  this.registerDisposable(this.handler_);

  /**
   * @private {boolean}
   */
  this.loaded_ = false;

  /**
   * @private {string}
   */
  this.title_ = '';
};
goog.inherits(npf.pages.Page, goog.events.EventTarget);


/**
 * @enum {string}
 */
npf.pages.Page.EventType = {
  /**
   * npf.pages.PageErrorEvent
   */
  ERROR: goog.events.getUniqueId('error'),

  TITLE_CHANGE: goog.events.getUniqueId('titleChange')
};


/** @inheritDoc */
npf.pages.Page.prototype.disposeInternal = function() {
  this.unload();

  npf.pages.Page.base(this, 'disposeInternal');

  this.domHelper_ = null;
  this.handler_ = null;
  this.manager_ = null;
  this.request_ = null;
};

/**
 * @param {npf.pages.Request} request
 * @throws {Error}
 */
npf.pages.Page.prototype.load = function(request) {
  if (!this.loaded_) {
    this.loaded_ = true;

    try {
      this.loadInternal(request);
    } catch (e) {
      if (goog.DEBUG && goog.global.console) {
        goog.global.console.error(e.stack);
      }

      throw e;
    }
  }
};

/**
 * @param {npf.pages.Request} request
 * @protected
 */
npf.pages.Page.prototype.loadInternal = function(request) {
  this.request_ = request;
  this.initHelpers(request);
};

/**
 * @throws {Error}
 */
npf.pages.Page.prototype.unload = function() {
  if (!this.loaded_) {
    return;
  }

  this.loaded_ = false;
  this.handler_.removeAll();

  try {
    this.unloadInternal();
  } catch (e) {
    if (goog.DEBUG && goog.global.console) {
      goog.global.console.error(e.stack);
    }

    throw e;
  }
};

/**
 * @protected
 */
npf.pages.Page.prototype.unloadInternal = goog.nullFunction;

/**
 * @param {npf.pages.Request} request
 * @return {boolean}
 */
npf.pages.Page.prototype.processUrl = function(request) {
  return false;
};

/**
 * @return {boolean}
 */
npf.pages.Page.prototype.isLoaded = function() {
  return this.loaded_;
};

/**
 * @return {goog.dom.DomHelper}
 */
npf.pages.Page.prototype.getDomHelper = function() {
  return this.domHelper_;
};

/**
 * @param {goog.dom.DomHelper} domHelper
 */
npf.pages.Page.prototype.setDomHelper = function(domHelper) {
  this.domHelper_ = domHelper;
};

/**
 * @return {goog.events.EventHandler.<!npf.pages.Page>}
 */
npf.pages.Page.prototype.getHandler = function() {
  return this.handler_;
};

/**
 * @return {Element|goog.ui.Component}
 */
npf.pages.Page.prototype.getParentContainer = function() {
  return this.manager_ ? this.manager_.getParentContainer() : null;
};

/**
 * @param {goog.ui.Component} container
 * @param {boolean=} opt_render only for container-component
 */
npf.pages.Page.prototype.appendToParentContainer = function(container,
    opt_render) {
  var parentContainer = this.manager_.getParentContainer() ||
    container.getDomHelper().getDocument().body;

  if (parentContainer.getElement) {
    parentContainer.addChild(container, opt_render);
  } else {
    container.render(/** @type {Element} */ (parentContainer));
  }
};

/**
 * @param {goog.ui.Component} container
 * @param {boolean=} opt_unrender only for container-component
 */
npf.pages.Page.prototype.removeFromParentContainer = function(container,
    opt_unrender) {
  var parentContainer = this.manager_.getParentContainer();

  if (parentContainer && parentContainer.getElement) {
    parentContainer.removeChild(container, opt_unrender);
  } else {
    goog.dom.removeNode(container.getElement());
  }
};

/**
 * @return {string}
 */
npf.pages.Page.prototype.getTitle = function() {
  return this.title_;
};

/**
 * @param {string} title
 */
npf.pages.Page.prototype.setTitle = function(title) {
  if (this.title_ != title) {
    this.title_ = title;
    this.dispatchTitleChangeEvent();
  }
};

/**
 * @return {Array.<string>}
 */
npf.pages.Page.prototype.getUsingHelperTypes = function() {
  return null;
};

/**
 * @return {Object.<goog.Disposable>}
 */
npf.pages.Page.prototype.getHelpersMap = function() {
  return this.getManager().getHelpersMap();
};

/**
 * @param {string} type
 * @return {goog.Disposable}
 */
npf.pages.Page.prototype.getHelper = function(type) {
  return this.getManager().getHelper(type);
};

/**
 * @param {npf.pages.Request} request
 * @protected
 */
npf.pages.Page.prototype.initHelpers = goog.nullFunction;

/**
 * @return {npf.pages.Manager}
 */
npf.pages.Page.prototype.getManager = function() {
  return this.manager_;
};

/**
 * @param {npf.pages.Manager} manager
 */
npf.pages.Page.prototype.setManager = function(manager) {
  this.manager_ = manager;
};

/**
 * @return {Array.<npf.router.Route>}
 */
npf.pages.Page.prototype.getRoutes = function() {
  /** @type {npf.Router} */
  var router = this.getRouter();

  return router ? router.getRoutes() : null;
};

/**
 * @return {Array.<string>}
 */
npf.pages.Page.prototype.getRouteNames = function() {
  /** @type {npf.Router} */
  var router = this.getRouter();

  return router ? router.getRouteNames() : null;
};

/**
 * @param {string} name
 * @return {npf.router.Route}
 */
npf.pages.Page.prototype.getRoute = function(name) {
  /** @type {npf.Router} */
  var router = this.getRouter();

  return router ? router.getRoute(name) : null;
};

/**
 * @param {number} index
 * @return {npf.router.Route}
 */
npf.pages.Page.prototype.getRouteAt = function(index) {
  /** @type {npf.Router} */
  var router = this.getRouter();

  return router ? router.getRouteAt(index) : null;
};

/**
 * @param {number} index
 * @return {string?}
 */
npf.pages.Page.prototype.getRouteNameAt = function(index) {
  /** @type {npf.Router} */
  var router = this.getRouter();

  return router ? router.getRouteNameAt(index) : null;
};

/**
 * @param {string|npf.router.Route} routeName
 * @param {Object.<number|string>=} opt_optionsMap
 * @param {string|goog.Uri.QueryData|Object.<string>=} opt_query
 * @param {boolean=} opt_replace
 */
npf.pages.Page.prototype.navigateRoute = function(routeName, opt_optionsMap,
    opt_query, opt_replace) {
  /** @type {npf.Router} */
  var router = this.getRouter();

  if (router) {
    router.navigateRoute(routeName, opt_optionsMap, opt_query, opt_replace);
  }
};

/**
 * @param {string|goog.Uri} token
 * @param {boolean=} opt_replace
 */
npf.pages.Page.prototype.navigate = function(token, opt_replace) {
  /** @type {npf.Router} */
  var router = this.getRouter();

  if (router) {
    router.navigate(token, opt_replace);
  }
};

/**
 * @return {npf.Router}
 */
npf.pages.Page.prototype.getRouter = function() {
  return this.manager_ ? this.manager_.getRouter() : null;
};

/**
 * @return {npf.pages.Request}
 */
npf.pages.Page.prototype.getRequest = function() {
  return this.request_;
};

/**
 * @param {number=} opt_index
 * @return {npf.pages.Request}
 */
npf.pages.Page.prototype.getRequestFromHistory = function(opt_index) {
  return this.manager_ ? this.manager_.getRequestFromHistory(opt_index) : null;
};

/**
 * @return {string}
 */
npf.pages.Page.prototype.getType = function() {
  return this.type_;
};

/**
 * @param {goog.net.HttpStatus} status
 * @protected
 */
npf.pages.Page.prototype.dispatchErrorEvent = function(status) {
  var event = new npf.pages.PageErrorEvent(status);
  this.dispatchEvent(event);
};

/**
 * @protected
 */
npf.pages.Page.prototype.dispatchTitleChangeEvent = function() {
  this.dispatchEvent(npf.pages.Page.EventType.TITLE_CHANGE);
};


/**
 * @param {goog.net.HttpStatus} status
 * @constructor
 * @struct
 * @extends {goog.events.Event}
 */
npf.pages.PageErrorEvent = function(status) {
  npf.pages.PageErrorEvent.base(
    this, 'constructor', npf.pages.Page.EventType.ERROR);

  /**
   * @type {goog.net.HttpStatus}
   */
  this.status = status;
};
goog.inherits(npf.pages.PageErrorEvent, goog.events.Event);
