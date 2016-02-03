goog.provide('npf.history.Html5History');
goog.provide('npf.history.Html5History.TokenTransformer');

goog.require('goog.dom');
goog.require('goog.dom.TagName');
goog.require('goog.dom.classlist');
goog.require('goog.events');
goog.require('goog.events.EventTarget');
goog.require('goog.events.EventType');
goog.require('goog.history.Event');
goog.require('goog.history.Html5History.TokenTransformer');
goog.require('npf.userAgent.history');


/**
 * @param {goog.dom.DomHelper=} opt_domHelper
 * @param {npf.history.Html5History.TokenTransformer=} opt_transformer
 * @constructor
 * @struct
 * @extends {goog.events.EventTarget}
 */
npf.history.Html5History = function(opt_domHelper, opt_transformer) {
  npf.history.Html5History.base(this, 'constructor');

  /**
   * @private {goog.dom.DomHelper}
   */
  this.domHelper_ = opt_domHelper || goog.dom.getDomHelper();

  /**
   * Status of when the object is active and dispatching events.
   * @private {boolean}
   */
  this.enabled_ = false;

  /**
   * @private {boolean}
   */
  this.linksHandleEnabled_ = false;

  /**
   * If useFragment is false the path will be used, the path prefix will be
   * prepended to all tokens. Defaults to '/'.
   * @private {string}
   */
  this.pathPrefix_ = '/';

  /**
   * The token transformer that is used to create URL from the token
   * when storing token without using hash fragment.
   * @type {npf.history.Html5History.TokenTransformer}
   * @private
   */
  this.transformer_ = opt_transformer ||
    new npf.history.Html5History.TokenTransformer();

  /**
   * Whether to use the fragment to store the token, defaults to true.
   * @private {boolean}
   */
  this.useFragment_ = false;
};
goog.inherits(npf.history.Html5History, goog.events.EventTarget);


/**
 * @type {string}
 */
npf.history.Html5History.EXTERNAL_CSS_CLASS = goog.getCssName('external');

/**
 * Returns whether Html5History is supported.
 * @return {boolean} Whether html5 history is supported.
 */
npf.history.Html5History.isSupported = npf.userAgent.history.isSupported;


/** @inheritDoc */
npf.history.Html5History.prototype.disposeInternal = function() {
  this.setUseFragment(false);
  this.setEnabled(false);

  npf.history.Html5History.base(this, 'disposeInternal');

  this.domHelper_ = null;
};

/**
 * @return {boolean}
 */
npf.history.Html5History.prototype.isEnabled = function() {
  return this.enabled_;
};

/**
 * Starts or stops the History. When enabled, the History object
 * will immediately fire an event for the current location. The caller can set
 * up event listeners between the call to the constructor and the call to
 * setEnabled.
 * @param {boolean} enable Whether to enable history.
 */
npf.history.Html5History.prototype.setEnabled = function(enable) {
  if (this.enabled_ != enable) {
    this.enabled_ = enable;
    this.applyEnabled(this.enabled_);

    if (enable) {
      this.dispatchEvent(new goog.history.Event(this.getToken(), false));
    }
  }
};

/**
 * @param {boolean} enable
 * @protected
 */
npf.history.Html5History.prototype.applyEnabled = function(enable) {
  /** @type {!Window} */
  var win = this.domHelper_.getWindow();
  /** @type {Element} */
  var bodyElement = this.domHelper_.getDocument().body;

  if (enable) {
    goog.events.listen(win, goog.events.EventType.POPSTATE,
      this.onHistoryEvent_, false, this);
    goog.events.listen(bodyElement, goog.events.EventType.CLICK,
      this.onBodyClick, false, this);
  } else {
    goog.events.unlisten(win, goog.events.EventType.POPSTATE,
      this.onHistoryEvent_, false, this);
    goog.events.unlisten(bodyElement, goog.events.EventType.CLICK,
      this.onBodyClick, false, this);
  }
};

/**
 * @return {goog.dom.DomHelper}
 */
npf.history.Html5History.prototype.getDomHelper = function() {
  return this.domHelper_;
};

/**
 * Gets the path prefix.
 * @return {string} The path prefix.
 */
npf.history.Html5History.prototype.getPathPrefix = function() {
  return this.pathPrefix_;
};

/**
 * Sets the path prefix to use if storing tokens in the path. The path
 * prefix should start and end with slash.
 * @param {string} pathPrefix Sets the path prefix.
 */
npf.history.Html5History.prototype.setPathPrefix = function(pathPrefix) {
  this.pathPrefix_ = pathPrefix;
};

/**
 * Returns the current token.
 * @return {string} The current token.
 */
npf.history.Html5History.prototype.getToken = function() {
  /** @type {!Window} */
  var win = this.domHelper_.getWindow();

  if (this.useFragment_) {
    /** @type {number} */
    var index = win.location.href.indexOf('#');

    return 0 > index ? '' : win.location.href.substring(index + 1);
  }

  return this.transformer_ ?
    this.transformer_.retrieveToken(this.pathPrefix_, win.location) :
    win.location.pathname.substr(this.pathPrefix_.length);
};

/**
 * Sets the history state.
 * @param {string} token The history state identifier.
 * @param {string=} opt_title Optional title to associate with history entry.
 */
npf.history.Html5History.prototype.setToken = function(token, opt_title) {
  if (this.getToken() != token) {
    /** @type {string} */
    var title = opt_title || this.domHelper_.getDocument().title || '';

    // Per externs/gecko_dom.js document.title can be null.
    this.domHelper_.getWindow().history.pushState(
      null, title, this.getUrl_(token));
    this.dispatchEvent(new goog.history.Event(token, false));
  }
};

/**
 * Replaces the current history state without affecting the rest of the history
 * stack.
 * @param {string} token The history state identifier.
 * @param {string=} opt_title Optional title to associate with history entry.
 */
npf.history.Html5History.prototype.replaceToken = function(token, opt_title) {
  /** @type {string} */
  var title = opt_title || this.domHelper_.getDocument().title || '';

  // Per externs/gecko_dom.js document.title can be null.
  this.domHelper_.getWindow().history.replaceState(
    null, title, this.getUrl_(token));
  this.dispatchEvent(new goog.history.Event(token, false));
};

/**
 * @param {!Element} element
 * @return {string?}
 * @protected
 */
npf.history.Html5History.prototype.getTokenByElement = function(element) {
  var linkElement = /** @type {Element} */ (
    this.domHelper_.getAncestorByTagNameAndClass(element, goog.dom.TagName.A));

  if (
    linkElement &&
    '_blank' != linkElement.getAttribute('target') &&
    !goog.dom.classlist.contains(
      linkElement, npf.history.Html5History.EXTERNAL_CSS_CLASS)
  ) {
    return linkElement.href;
  }

  return null;
};

/**
 * Gets the URL to set when calling history.pushState
 * @param {string} token The history token.
 * @return {string} The URL.
 * @private
 */
npf.history.Html5History.prototype.getUrl_ = function(token) {
  if (this.useFragment_) {
    return '#' + token;
  } else {
    /** @type {!Window} */
    var win = this.domHelper_.getWindow();

    return this.transformer_ ?
      this.transformer_.createUrl(token, this.pathPrefix_, win.location) :
      this.pathPrefix_ + token + win.location.search;
  }
};

/**
 * Sets whether to use the fragment to store tokens.
 * @param {boolean} useFragment Whether to use the fragment.
 */
npf.history.Html5History.prototype.setUseFragment = function(useFragment) {
  if (this.useFragment_ != useFragment) {
    this.useFragment_ = useFragment;

    /** @type {!Window} */
    var win = this.domHelper_.getWindow();

    if (useFragment) {
      goog.events.listen(win, goog.events.EventType.HASHCHANGE,
        this.onHistoryEvent_, false, this);
    } else {
      goog.events.unlisten(win, goog.events.EventType.HASHCHANGE,
        this.onHistoryEvent_, false, this);
    }
  }
};

/**
 * @param {goog.events.BrowserEvent} evt
 * @protected
 */
npf.history.Html5History.prototype.onBodyClick = function(evt) {
  var targetElement = /** @type {Element} */ (evt.target);

  if (
    this.isEnabled() &&
    targetElement &&
    !evt.getBrowserEvent().defaultPrevented &&
    !(evt.metaKey || evt.ctrlKey)
  ) {
    /** @type {string?} */
    var token = this.getTokenByElement(targetElement);

    if (token) {
      this.setToken(token);
      evt.preventDefault();
    }
  }
};

/**
 * Handles history events dispatched by the browser.
 * @param {goog.events.BrowserEvent} e The browser event object.
 * @private
 */
npf.history.Html5History.prototype.onHistoryEvent_ = function(e) {
  this.dispatchEvent(new goog.history.Event(this.getToken(), true));
};


/**
 * A token transformer that can create a URL from a history
 * token. This is used by {@code goog.history.Html5History} to create
 * URL when storing token without the hash fragment.
 *
 * Given a {@code window.location} object containing the location
 * created by {@code createUrl}, the token transformer allows
 * retrieval of the token back via {@code retrieveToken}.
 *
 * @constructor
 * @implements {goog.history.Html5History.TokenTransformer}
 */
npf.history.Html5History.TokenTransformer = function() {};


/** @inheritDoc */
npf.history.Html5History.TokenTransformer.prototype.retrieveToken = function(
    pathPrefix, location) {
  return location.pathname + location.search;
};


/** @inheritDoc */
npf.history.Html5History.TokenTransformer.prototype.createUrl = function(
    token, pathPrefix, location) {
  return token;
};
