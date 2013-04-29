goog.provide('npf.ui.twitter.MentionButton');

goog.require('goog.Uri');
goog.require('npf.ui.twitter.Button');


/**
 * @param {string} screenName
 * @param {goog.dom.DomHelper} opt_domHelper
 * @constructor
 * @extends {npf.ui.twitter.Button}
 */
npf.ui.twitter.MentionButton = function(screenName, opt_domHelper) {
  goog.base(this, opt_domHelper);

  var uri = new goog.Uri(npf.ui.twitter.MentionButton.SHARE_URL);
  uri.getQueryData().set('screen_name', screenName);

  this.screenName = screenName;
  this.cssClass = npf.ui.twitter.MentionButton.CSS_CLASS;
  this.shareUrl = uri.toString();
};
goog.inherits(npf.ui.twitter.MentionButton, npf.ui.twitter.Button);


/**
 * @type {string}
 * @const
 */
npf.ui.twitter.MentionButton.CSS_CLASS = 'twitter-mention-button';

/**
 * @type {string}
 * @const
 */
npf.ui.twitter.MentionButton.SHARE_URL = 'https://twitter.com/intent/tweet';
