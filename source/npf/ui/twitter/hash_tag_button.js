goog.provide('npf.ui.twitter.HashTagButton');

goog.require('goog.Uri');
goog.require('npf.ui.twitter.Button');


/**
 * @param {string} buttonHashTag
 * @param {goog.dom.DomHelper} opt_domHelper
 * @constructor
 * @extends {npf.ui.twitter.Button}
 */
npf.ui.twitter.HashTagButton = function(buttonHashTag, opt_domHelper) {
  goog.base(this, opt_domHelper);

  var uri = new goog.Uri(npf.ui.twitter.HashTagButton.SHARE_URL);
  uri.getQueryData().set('button_hashtag', buttonHashTag);

  this.cssClass = npf.ui.twitter.HashTagButton.CSS_CLASS;
  this.shareUrl = uri.toString();
};
goog.inherits(npf.ui.twitter.HashTagButton, npf.ui.twitter.Button);


/**
 * @type {string}
 * @const
 */
npf.ui.twitter.HashTagButton.CSS_CLASS = 'twitter-hashtag-button';

/**
 * @type {string}
 * @const
 */
npf.ui.twitter.HashTagButton.SHARE_URL = 'https://twitter.com/intent/tweet';
