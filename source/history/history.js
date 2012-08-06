goog.provide('npf.History');
goog.provide('npf.History.EventType');

goog.require('goog.History');
goog.require('goog.Uri');
goog.require('goog.dom');
goog.require('goog.dom.TagName');
goog.require('goog.dom.classes');
goog.require('goog.events');
goog.require('goog.events.EventTarget');
goog.require('goog.history.EventType');
goog.require('goog.history.Html5History');
goog.require('npf.events.TapHandler');
goog.require('npf.history.TokenTransformer');



/**
 * @constructor
 * @extends {goog.events.EventTarget}
 */
npf.History = function() {
  goog.base(this);

  if (npf.History.isHtml5HistorySupported) {
    this.html5History_ = new goog.history.Html5History(null,
      new npf.history.TokenTransformer());
    this.html5History_.setPathPrefix('');
    this.html5History_.setParentEventTarget(this);
    this.html5History_.setUseFragment(false);
    this.registerDisposable(this.html5History_);
  } else {
    this.history_ = new goog.History();
    this.history_.setParentEventTarget(this);
    this.registerDisposable(this.history_);
  }
};
goog.inherits(npf.History, goog.events.EventTarget);


/**
 * @define {boolean}
 */
npf.History.ASSUME_HTML5 = false;

/**
 * @enum {string}
 */
npf.History.EventType = {
  NAVIGATE: goog.history.EventType.NAVIGATE
};

/**
 * @type {string}
 */
npf.History.EXTERNAL_CSS_CLASS = goog.getCssName('external');

/**
 * @type {boolean}
 */
npf.History.isHtml5HistorySupported =
  npf.History.ASSUME_HTML5 || goog.history.Html5History.isSupported();

/**
 * @type {goog.History}
 * @private
 */
npf.History.prototype.history_ = null;

/**
 * @type {goog.history.Html5History}
 * @private
 */
npf.History.prototype.html5History_ = null;

/**
 * @type {boolean}
 * @private
 */
npf.History.prototype.isLinksHandlerEnabled_ = false;

/**
 * @type {npf.events.TapHandler}
 * @private
 */
npf.History.prototype.tapHandler_ = null;


/** @inheritDoc */
npf.History.prototype.disposeInternal = function() {
  this.setLinksHandlerEnabled(false);

  goog.base(this, 'disposeInternal');

  delete this.history_;
  delete this.html5History_;
  delete this.isLinksHandlerEnabled_;
  delete this.tapHandler_;
};

/**
 * @param {boolean} enable
 */
npf.History.prototype.setEnabled = function(enable) {
  if (this.history_) {
    this.history_.setEnabled(enable);
  } else if (this.html5History_) {
    this.html5History_.setEnabled(enable);
  }

  this.setLinksHandlerEnabled(enable);
};

/**
 * @return {string}
 */
npf.History.prototype.getToken = function() {
  if (this.history_) {
    return this.history_.getToken();
  }  else {
    return this.html5History_.getToken();
  }
};

/**
 * @param {string} token
 * @param {string=} opt_title
 */
npf.History.prototype.setToken = function(token, opt_title) {
  if (this.history_) {
    return this.history_.setToken(token, opt_title);
  } else {
    return this.html5History_.setToken(token, opt_title);
  }
};

/**
 * @param {string} token
 * @param {string=} opt_title
 */
npf.History.prototype.replaceToken = function(token, opt_title) {
  if (this.history_) {
    return this.history_.replaceToken(token, opt_title);
  } else {
    return this.html5History_.replaceToken(token, opt_title);
  }
};

/**
 * @return {boolean}
 */
npf.History.prototype.isHtml5Used = function() {
  return !this.history_;
};

/**
 * @return {boolean}
 */
npf.History.prototype.isLinksHandlerEnabled = function() {
  return this.isLinksHandlerEnabled_;
};

/**
 * @param {boolean} enable
 */
npf.History.prototype.setLinksHandlerEnabled = function(enable) {
  if (this.isLinksHandlerEnabled_ == enable) {
    return;
  }

  this.isLinksHandlerEnabled_ = enable;

  if (this.isLinksHandlerEnabled_) {
    this.tapHandler_ = new npf.events.TapHandler(document.body);
    goog.events.listen(this.tapHandler_, npf.events.TapHandler.EventType.TAP,
      this.onTap_, false, this);
  } else {
    goog.events.unlisten(this.tapHandler_, npf.events.TapHandler.EventType.TAP,
      this.onTap_, false, this);
    this.tapHandler_.dispose();
    this.tapHandler_ = null;
  }
};

/**
 * @param {goog.events.BrowserEvent} evt
 * @private
 */
npf.History.prototype.onTap_ = function(evt) {
  /** @type {Node} */
  var targetElement = evt ? evt.target : null;

  if (targetElement && !evt.getBrowserEvent()['defaultPrevented']) {
    var element =
      /** @type {Element} */ (goog.dom.getAncestorByTagNameAndClass(targetElement,
      goog.dom.TagName.A));

    if (element && this.isInnerHandler(element)) {
      var uri = goog.Uri.parse(element.href);
      /** @type {string} */
      var token = uri.getPath();

      if (uri.hasQuery()) {
        token += '?' + uri.getQuery();
      }

      this.setToken(token);
      evt.preventDefault();
    }
  }
};

/**
 * @param {!Element} linkElement
 * @return {boolean}
 * @protected
 */
npf.History.prototype.isInnerHandler = function(linkElement) {
  return !goog.dom.classes.has(linkElement, npf.History.EXTERNAL_CSS_CLASS);
};
