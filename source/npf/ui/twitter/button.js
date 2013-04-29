goog.provide('npf.ui.twitter.Button');
goog.provide('npf.ui.twitter.Button.Position');
goog.provide('npf.ui.twitter.Button.Size');

goog.require('goog.dom');
goog.require('goog.dom.TagName');
goog.require('npf.ui.Component');


/**
 * @param {goog.dom.DomHelper=} opt_domHelper
 * @constructor
 * @extends {npf.ui.Component}
 */
npf.ui.twitter.Button = function(opt_domHelper) {
  goog.base(this, opt_domHelper);

  this.related = [];
  this.hashTags = [];
};
goog.inherits(npf.ui.twitter.Button, npf.ui.Component);


/**
 * @enum {string}
 */
npf.ui.twitter.Button.Position = {
  HORIZONTAL: 'horizontal',
  NONE: 'none',
  VERTICAL: 'vertical'
};

/**
 * @enum {string}
 */
npf.ui.twitter.Button.Size = {
  LARGE: 'large',
  MEDIUM: 'medium'
};

/**
 * @type {string}
 * @const
 */
npf.ui.twitter.Button.CONTENT = 'Tweet';

/**
 * @type {string}
 * @const
 */
npf.ui.twitter.Button.CSS_CLASS = 'twitter-share-button';

/**
 * @type {string}
 * @const
 */
npf.ui.twitter.Button.SHARE_URL = 'https://twitter.com/share';

/**
 * @type {string}
 * @const
 */
npf.ui.twitter.Button.WIDGETS_SRC = 'https://platform.twitter.com/widgets.js';

/**
 * @type {string}
 */
npf.ui.twitter.Button.prototype.content = npf.ui.twitter.Button.CONTENT;

/**
 * URL of the page to share
 * Default is HTTP Referrer
 * @type {string}
 */
npf.ui.twitter.Button.prototype.pageUrl = '';

/**
 * Screen name of the user to attribute the Tweet to
 * @type {string}
 */
npf.ui.twitter.Button.prototype.via = '';

/**
 * Default Tweet text
 * Default is content of the <title> tag
 * @type {string}
 */
npf.ui.twitter.Button.prototype.text = '';

/**
 * Related accounts
 * @type {Array.<string>}
 */
npf.ui.twitter.Button.prototype.related;

/**
 * Count box position
 * @type {npf.ui.twitter.Button.Position}
 */
npf.ui.twitter.Button.prototype.countPosition =
  npf.ui.twitter.Button.Position.HORIZONTAL;

/**
 * The language for the Tweet Button
 * @type {string}
 */
npf.ui.twitter.Button.prototype.lang = 'en';

/**
 * URL to which your shared URL resolves
 * Default is the url being shared
 * @type {string}
 */
npf.ui.twitter.Button.prototype.countUrl = '';

/**
 * Hashtags appended to tweet text
 * @type {Array.<string>}
 */
npf.ui.twitter.Button.prototype.hashTags;

/**
 * The size of the rendered button
 * @type {npf.ui.twitter.Button.Size}
 */
npf.ui.twitter.Button.prototype.size = npf.ui.twitter.Button.Size.MEDIUM;

/**
 * @type {boolean}
 */
npf.ui.twitter.Button.prototype.dnt = false;

/**
 * @type {string}
 * @protected
 */
npf.ui.twitter.Button.prototype.cssClass = npf.ui.twitter.Button.CSS_CLASS;

/**
 * @type {string}
 * @protected
 */
npf.ui.twitter.Button.prototype.shareUrl = npf.ui.twitter.Button.SHARE_URL;


/** @inheritDoc */
npf.ui.twitter.Button.prototype.createDom = function() {
  /** @type {!Element} */
  var element = this.getDomHelper().createDom(
    goog.dom.TagName.A, this.getAttrs(), this.content);
  this.setElementInternal(element);
};

/** @inheritDoc */
npf.ui.twitter.Button.prototype.enterDocument = function() {
  goog.base(this, 'enterDocument');

  /** @type {!Element} */
  var scriptElement = this.getDomHelper().createDom(goog.dom.TagName.SCRIPT, {
    'src': npf.ui.twitter.Button.WIDGETS_SRC
  });
  goog.dom.appendChild(this.getDomHelper().getDocument().body, scriptElement);
};

/** @inheritDoc */
npf.ui.twitter.Button.prototype.disposeInternal = function() {
  goog.base(this, 'disposeInternal');

  this.related = null;
  this.hashTags = null;
};

/**
 * @return {!Object.<string,string>}
 * @protected
 */
npf.ui.twitter.Button.prototype.getAttrs = function() {
  /** @type {!Object.<string,string>} */
  var attrs = {
    'href': this.shareUrl,
    'class': this.cssClass,
    'data-count': this.countPosition,
    'data-lang': this.lang,
    'data-size': this.size
  };

  if (this.pageUrl) {
    attrs['data-url'] = this.pageUrl;
  }

  if (this.via) {
    attrs['data-via'] = this.via;
  }

  if (this.text) {
    attrs['data-text'] = this.text;
  }

  if (this.related.length) {
    attrs['data-related'] = this.related.join(',');
  }

  if (this.countUrl) {
    attrs['data-counturl'] = this.countUrl;
  }

  if (this.hashTags.length) {
    attrs['data-hashtags'] = this.hashTags.join(',');
  }

  if (this.dnt) {
    attrs['data-dnt'] = 'true';
  }

  return attrs;
};
