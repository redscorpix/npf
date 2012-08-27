goog.provide('npf.pages.Page');
goog.provide('npf.pages.Page.EventType');

goog.require('goog.events');
goog.require('goog.events.EventHandler');
goog.require('goog.events.EventTarget');
goog.require('npf.Router');
goog.require('npf.pages.Request');


/**
 * @param {npf.pages.Manager} manager
 * @constructor
 * @extends {goog.events.EventTarget}
 */
npf.pages.Page = function(manager) {
  goog.base(this);

  this.manager_ = manager;
  this.helpersMap_ = {};

  this.handler_ = new goog.events.EventHandler();
  this.registerDisposable(this.handler_);
};
goog.inherits(npf.pages.Page, goog.events.EventTarget);


/**
 * @enum {string}
 */
npf.pages.Page.EventType = {
  /**
   * status (goog.net.HttpStatus)
   */
  ERROR: goog.events.getUniqueId('error'),
  /**
   * title (string)
   */
  TITLE_CHANGE: goog.events.getUniqueId('titleChange')
};

/**
 * @type {npf.pages.Manager}
 * @private
 */
npf.pages.Page.prototype.manager_;

/**
 * @type {!Object.<string,goog.Disposable>}
 * @private
 */
npf.pages.Page.prototype.helpersMap_;

/**
 * @type {!goog.events.EventHandler}
 * @private
 */
npf.pages.Page.prototype.handler_;

/**
 * @type {boolean}
 * @private
 */
npf.pages.Page.prototype.loaded_ = false;

/**
 * @type {string}
 * @private
 */
npf.pages.Page.prototype.title_ = '';


/** @inheritDoc */
npf.pages.Page.prototype.disposeInternal = function() {
  this.unload();

  goog.base(this, 'disposeInternal');

  delete this.manager_;
  delete this.helpersMap_;
  delete this.handler_;
  delete this.loaded_;
  delete this.title_;
};

/**
 * @param {npf.pages.Request} request
 */
npf.pages.Page.prototype.load = function(request) {
  if (!this.loaded_) {
    this.loaded_ = true;

    try {
      this.loadInternal(request);
    } catch (e) {
      if (goog.DEBUG && window.console) {
        window.console.error(e.stack);
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
  this.initHelpers(request);
};

npf.pages.Page.prototype.unload = function() {
  if (!this.loaded_) {
    return;
  }

  this.loaded_ = false;
  this.handler_.removeAll();

  try {
    this.unloadInternal();
  } catch (e) {
    if (goog.DEBUG && window.console) {
      window.console.error(e.stack);
    }

    throw e;
  }
};

/**
 * @protected
 */
npf.pages.Page.prototype.unloadInternal = function() {
  this.removeHelpers();
};

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
 * @return {!goog.events.EventHandler}
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
  var parentContainer = this.manager_.getParentContainer() || document.body;

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
  if (this.title_ == title) {
    return;
  }

  this.title_ = title;
  this.dispatchTitleChangeEvent(this.title_);
};

/**
 * @return {Array.<string>}
 */
npf.pages.Page.prototype.getUsingHelperTypes = function() {
  return null;
};

/**
 * @return {!Object.<string,goog.Disposable>}
 */
npf.pages.Page.prototype.getHelpersMap = function() {
  return this.helpersMap_;
};

/**
 * @param {string} type
 * @return {goog.Disposable}
 */
npf.pages.Page.prototype.getHelper = function(type) {
  return this.helpersMap_[type] || null;
};

/**
 * @param {goog.Disposable} helper
 * @param {string} type
 */
npf.pages.Page.prototype.setHelper = function(helper, type) {
  this.helpersMap_[type] = helper;
};

/**
 * @param {npf.pages.Request} request
 * @protected
 */
npf.pages.Page.prototype.initHelpers = function(request) {};

/**
 * @protected
 */
npf.pages.Page.prototype.removeHelpers = function() {
  this.helpersMap_ = {};
};

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
 * @param {Object.<string,number|string>=} opt_optionsMap
 * @param {string|goog.Uri.QueryData|Object.<string,string>=} opt_query
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
  return this.manager_ ? this.manager_.getRequest() : null;
};

/**
 * @param {number=} opt_index
 * @return {npf.pages.Request}
 */
npf.pages.Page.prototype.getRequestFromHistory = function(opt_index) {
  return this.manager_ ? this.manager_.getRequestFromHistory(opt_index) : null;
};

/**
 * @param {goog.net.HttpStatus} status
 * @protected
 */
npf.pages.Page.prototype.dispatchErrorEvent = function(status) {
  this.dispatchEvent({
    type: npf.pages.Page.EventType.ERROR,
    status: status
  });
};

/**
 * @param {string} title
 * @protected
 */
npf.pages.Page.prototype.dispatchTitleChangeEvent = function(title) {
  this.dispatchEvent({
    type: npf.pages.Page.EventType.TITLE_CHANGE,
    title: title
  });
};
