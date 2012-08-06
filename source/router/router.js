goog.provide('npf.Router');

goog.require('goog.Uri');
goog.require('goog.array');
goog.require('goog.events');
goog.require('goog.events.EventTarget');
goog.require('goog.history.Html5History');
goog.require('npf.History');


/**
 * @param {goog.History|npf.History=} opthistory_
 * @constructor
 * @extends {goog.events.EventTarget}
 */
npf.Router = function(opthistory_) {
  goog.base(this);

  this.history_ = opthistory_ || new npf.History();
  this.registerDisposable(this.history_);

  goog.events.listen(this.history_, goog.history.EventType.NAVIGATE,
  	this.onNavigate_, false, this);

  this.routesMap_ = {};
  this.namedRoutes_ = [];
};
goog.inherits(npf.Router, goog.events.EventTarget);


/**
 * @enum {string}
 */
npf.Router.EventType = {
  /**
   * token (string)
   * uri (!goog.Uri)
   * route (?npf.router.Route)
   * name (string)
   * options (?Object.<string,string>)
   */
  NAVIGATE: goog.events.getUniqueId('navigate')
};

/**
 * @typedef {{
 *   route: npf.router.Route,
 *   name: string
 * }}
 */
npf.Router.NamedRoute;

/**
 * Проверяет, на корневую ли страницу зашел пользователь.
 * Осуществляет редирект, если требуется.
 * @return {boolean} false, если произошла перезагрузка страницы.
 */
npf.Router.normalizeRootPath = function() {
  /** @type {string} */
  var hash = window.location.hash;
  /** @type {string} */
  var path = '';

  if (npf.History.isHtml5HistorySupported) {
    if (hash && 1 < hash.length && '/' == hash.charAt(1)) {
      path = window.location.hash.substr(1);
    }
  } else {
    if (!('/' == window.location.pathname && !window.location.search)) {
      // Если был хэш, то идем на корневую и подставляем якорь.
      if (hash) {
        path = '/' + hash;
      } else {
        // Делаем редирект на корневую плюс якорь с этим путем.
        path = '/#' + window.location.pathname + window.location.search;
      }
    }
  }

  if ('' != path) {
    window.location.href = path;

    return false;
  }

  return true;
};

/**
 * @type {goog.History|npf.History}
 * @private
 */
npf.Router.prototype.history_;

/**
 * @type {!Object.<string,npf.router.Route>}
 * @private
 */
npf.Router.prototype.routesMap_;

/**
 * @type {!Array.<npf.Router.NamedRoute>}
 * @private
 */
npf.Router.prototype.namedRoutes_;

/**
 * @type {string}
 * @private
 */
npf.Router.prototype.currentRouteName_ = '';

/**
 * @type {boolean}
 * @private
 */
npf.Router.prototype.enabled_ = false;

/**
 * @type {boolean}
 * @private
 */
npf.Router.prototype.slashSuffixEnabled_ = true;


/** @inheritDoc */
npf.Router.prototype.disposeInternal = function() {
  goog.events.unlisten(this.history_, goog.history.EventType.NAVIGATE,
  	this.onNavigate_, false, this);
  this.setEnabled(false);

  goog.base(this, 'disposeInternal');

  delete this.history_;
  delete this.routesMap_;
  delete this.namedRoutes_;
  delete this.currentRouteName_;
  delete this.enabled_;
  delete this.slashSuffixEnabled_;
};

/**
 * @return {!Array.<npf.router.Route>}
 */
npf.Router.prototype.getRoutes = function() {
  return goog.array.map(this.namedRoutes_, function(namedRoute, i) {
    return namedRoute.route;
  }, this);
};

/**
 * @return {!Array.<string>}
 */
npf.Router.prototype.getRouteNames = function() {
  return goog.array.map(this.namedRoutes_, function(namedRoute, i) {
    return namedRoute.name;
  }, this);
};

/**
 * @param {string} name
 * @return {npf.router.Route?}
 */
npf.Router.prototype.getRoute = function(name) {
  return this.routesMap_[name] || null;
};

/**
 * @param {number} index
 * @return {npf.router.Route?}
 */
npf.Router.prototype.getRouteAt = function(index) {
  return this.namedRoutes_[index] ? this.namedRoutes_[index].route : null;
};

/**
 * @param {number} index
 * @return {string?}
 */
npf.Router.prototype.getRouteNameAt = function(index) {
  return this.namedRoutes_[index] ? this.namedRoutes_[index].name : null;
};

/**
 * @param {function(npf.router.Route,string,number)} func
 * @param {Object=} opt_scope
 */
npf.Router.prototype.forEach = function(func, opt_scope) {
  goog.array.forEach(this.namedRoutes_, function(namedRoute, index) {
    func.call(opt_scope, namedRoute.route, namedRoute.name, index);
  }, this);
};

/**
 * @return {number}
 */
npf.Router.prototype.getRouteCount = function() {
  return this.namedRoutes_.length;
};

/**
 * @param {npf.router.Route} route
 * @param {string} name
 * @return {number}
 */
npf.Router.prototype.addRoute = function(route, name) {
  this.removeRoute(name);

  /** @type {number} */
  var index = this.getRouteCount();

  this.addRouteAt(route, name, index);

  return index;
};

/**
 * @param {npf.router.Route} route
 * @param {string} name
 * @param {number} index
 */
npf.Router.prototype.addRouteAt = function(route, name, index) {
  this.removeRoute(name);
  this.routesMap_[name] = route;
  this.namedRoutes_.splice(index, 0, {
    route: route,
    name: name
  });
};

/**
 * @param {string} name
 * @return {npf.router.Route?}
 */
npf.Router.prototype.removeRoute = function(name) {
  /** @type {npf.router.Route} */
  var route = null;

  if (this.routesMap_[name]) {
    var index = -1;

    goog.array.every(this.namedRoutes_, function(namedRoute, i) {
      if (namedRoute.name == name) {
        index = i;

        return false;
      }

      return true;
    }, this);

    if (-1 < index) {
      this.namedRoutes_.splice(index, 1);
    }

    route = this.routesMap_[name];

    delete this.routesMap_[name];
  }

  return route;
};

/**
 * @param {string|npf.router.Route} routeName
 * @param {Object.<string,number|string>=} opt_optionsMap
 * @param {string|goog.Uri.QueryData|Object.<string,string>=} opt_query
 * @param {boolean=} opt_replace
 */
npf.Router.prototype.navigateRoute = function(routeName, opt_optionsMap,
																							opt_query, opt_replace) {
  /** @type {npf.router.Route} */
  var route = goog.isString(routeName) ? this.getRoute(routeName) : routeName;

  if (route) {
    /** @type {string} */
    var token = route.getToken(opt_optionsMap, opt_query);
    this.navigate(token, opt_replace);
  }
};

/**
 * @param {string|goog.Uri} token
 * @param {boolean=} opt_replace
 */
npf.Router.prototype.navigate = function(token, opt_replace) {
  /** @type {goog.Uri} */
  var uri = goog.Uri.parse(token);

  if (this.slashSuffixEnabled_) {
    /** @type {string} */
    var uriPath = uri.getPath();

    if (uriPath && '/' != uriPath.charAt(uriPath.length - 1)) {
      uri.setPath(uriPath + '/');
    }
  }

  if (opt_replace) {
    this.history_.replaceToken(uri.toString());
  } else {
    this.history_.setToken(uri.toString());
  }
};

/**
 * @return {npf.router.Route?}
 */
npf.Router.prototype.getCurrentRoute = function() {
  return '' == this.currentRouteName_ ? null :
  	this.getRoute(this.currentRouteName_);
};

/**
 * @return {string}
 */
npf.Router.prototype.getCurrentRouteName = function() {
  return this.currentRouteName_;
};

/**
 * @return {boolean}
 */
npf.Router.prototype.isEnabled = function() {
  return this.enabled_;
};

/**
 * @param {boolean} enable
 */
npf.Router.prototype.setEnabled = function(enable) {
  if (this.enabled_ != enable) {
    this.enabled_ = enable;
    this.history_.setEnabled(enable);
    this.setEnabledInternal(this.enabled_);
  }
};

/**
 * @param {boolean} enable
 * @protected
 */
npf.Router.prototype.setEnabledInternal = function(enable) {
  if (enable) {
    /** @type {string} */
    var token = this.history_.getToken();
    this.onNavigate(token);
  }
};

/**
 * @param {goog.events.Event} evt
 * @private
 */
npf.Router.prototype.onNavigate_ = function(evt) {
  var token = evt.token;
  this.onNavigate(token);
};

/**
 * @param {string} token
 * @protected
 */
npf.Router.prototype.onNavigate = function(token) {
  /** @type {goog.Uri} */
  var uri = new goog.Uri(token);

  if (this.slashSuffixEnabled_) {
    /** @type {string} */
    var uriPath = uri.getPath();

    if (uriPath && '/' != uriPath.charAt(uriPath.length - 1)) {
      uri.setPath(uriPath + '/');
      this.navigate(uri, true);

      return;
    }
  }

  var info = this.parseToken(token);

  this.dispatchEvent({
    type: npf.Router.EventType.NAVIGATE,
    route: info.route,
    name: info.name,
    token: token,
    uri: info.uri,
    options: info.options
  });
};

/**
 * @param {string|goog.Uri} token
 * @return {{route:?npf.router.Route,name:string,uri:!goog.Uri,options:?Object.<string,string>}}
 */
npf.Router.prototype.parseToken = function(token) {
  /** @type {!goog.Uri} */
  var uri = goog.Uri.parse(token);
  /** @type {string} */
  var name = '';
  /** @type {Object.<string,string>} */
  var options = null;

  for (var i = this.namedRoutes_.length - 1; i >= 0; i--) {
    /** @type {npf.Router.NamedRoute} */
    var namedRoute = this.namedRoutes_[i];

    var matches = namedRoute.route.getOptions(uri);

    if (matches) {
      name = namedRoute.name;
      options = matches;

      break;
    }
  }

  this.currentRouteName_ = name;

  var route = '' == name ? null : this.getRoute(name);

  return {
    route: route,
    name: name,
    uri: uri,
    options: options
  };
};

/**
 * @return {goog.Uri}
 */
npf.Router.prototype.getUri = function() {
  return new goog.Uri(this.getToken());
};

/**
 * @return {string}
 */
npf.Router.prototype.getToken = function() {
  return this.history_.getToken();
};

/**
 * @return {boolean}
 */
npf.Router.prototype.isSlashSuffixEnabled = function() {
  return this.slashSuffixEnabled_;
};

/**
 * @param {boolean} enable
 */
npf.Router.prototype.setSlashSuffixEnabled = function(enable) {
  this.slashSuffixEnabled_ = enable;
};
