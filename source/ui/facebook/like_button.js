goog.provide('npf.ui.facebook.LikeButton');
goog.provide('npf.ui.facebook.LikeButton.Action');
goog.provide('npf.ui.facebook.LikeButton.ColorScheme');
goog.provide('npf.ui.facebook.LikeButton.FontFamily');
goog.provide('npf.ui.facebook.LikeButton.Layout');

goog.require('npf.ui.Component');


/**
 * @param {goog.dom.DomHelper=} opt_domHelper
 * @constructor
 * @extends {npf.ui.Component}
 */
npf.ui.facebook.LikeButton = function(opt_domHelper) {
  goog.base(this, opt_domHelper);
};
goog.inherits(npf.ui.facebook.LikeButton, npf.ui.Component);


/**
 * @enum {string}
 */
npf.ui.facebook.LikeButton.Action = {
  LIKE: 'like',
  RECOMMEND: 'recommend'
};

/**
 * @enum {string}
 */
npf.ui.facebook.LikeButton.ColorScheme = {
  DARK: 'dark',
  LIGHT: 'light'
};

/**
 * @enum {string}
 */
npf.ui.facebook.LikeButton.Layout = {
  BOX_COUNT: 'box_count',       // Displays the total number of likes above
                                // the button. Minimum width: 55 pixels.
                                // Default width: 55 pixels. Height: 65 pixels.
  BUTTON_COUNT: 'button_count', // Displays the total number of likes to the
                                // right of the button. Minimum width: 90 pixels.
                                // Default width: 90 pixels. Height: 20 pixels.
  STANDARD: 'standard' // Displays social text to the right of the button and
                       // friends' profile photos below.
                       // Minimum width: 225 pixels. Minimum increases by 40px
                       // if action is 'recommend' by and increases by 60px
                       // if send is 'true'. Default width: 450 pixels.
                       // Height: 35 pixels (without photos) or
                       // 80 pixels (with photos).
};

/**
 * @enum {string}
 */
npf.ui.facebook.LikeButton.FontFamily = {
  ARIAL: 'arial',
  LUCIDA_GRANDE: 'lucida grande',
  SEGOE_UI: 'segoe ui',
  TAHOMA: 'tahoma',
  TREBUCHET_MS: 'trebuchet ms',
  VERDANA: 'verdana'
};

/**
 * @type {string}
 * @const
 */
npf.ui.facebook.LikeButton.CSS_CLASS = 'fb-like';

/**
 * The URL to like. Defaults to the current page
 * @type {string}
 */
npf.ui.facebook.LikeButton.prototype.pageUrl = '';

/**
 * Specifies whether to include a Send button with the Like button
 * @type {boolean}
 */
npf.ui.facebook.LikeButton.prototype.send = false;

/**
 * @type {npf.ui.facebook.LikeButton.Layout}
 */
npf.ui.facebook.LikeButton.prototype.layout =
  npf.ui.facebook.LikeButton.Layout.STANDARD;

/**
 * Specifies whether to display profile photos below the button
 * @type {boolean}
 */
npf.ui.facebook.LikeButton.prototype.showFaces = false;

/**
 * The width of the Like button
 * @type {number}
 */
npf.ui.facebook.LikeButton.prototype.width = 450;

/**
 * The verb to display on the button
 * @type {npf.ui.facebook.LikeButton.Action}
 */
npf.ui.facebook.LikeButton.prototype.action =
  npf.ui.facebook.LikeButton.Action.LIKE;

/**
 * The verb to display on the button
 * @type {npf.ui.facebook.LikeButton.ColorScheme}
 */
npf.ui.facebook.LikeButton.prototype.colorScheme =
  npf.ui.facebook.LikeButton.ColorScheme.LIGHT;

/**
 * The verb to display on the button
 * @type {string}
 */
npf.ui.facebook.LikeButton.prototype.fontFamily = '';


/** @inheritDoc */
npf.ui.facebook.LikeButton.prototype.createDom = function() {
  /** @type {!Element} */
  var element = this.getDomHelper().createDom(
    goog.dom.TagName.DIV, this.getAttrs());
  this.setElementInternal(element);
};

/**
 * @return {!Object}
 * @protected
 */
npf.ui.facebook.LikeButton.prototype.getAttrs = function() {
  /** @type {!Object} */
  var attrs = {
    'class': npf.ui.facebook.LikeButton.CSS_CLASS,
    'data-width': this.width,
    'data-layout': this.layout,
    'data-action': this.action,
    'data-colorscheme': this.colorScheme
  };

  if (this.pageUrl) {
    attrs['data-href'] = this.pageUrl;
  }

  if (this.send) {
    attrs['data-send'] = 'true';
  }

  if (this.showFaces) {
    attrs['data-show-faces'] = 'true';
  }

  if (this.fontFamily) {
    attrs['data-font'] = this.fontFamily;
  }

  return attrs;
};
