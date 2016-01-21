goog.provide('npf.userAgent.flash');

goog.require('goog.dom');
goog.require('goog.dom.TagName');
goog.require('goog.userAgent');
goog.require('npf.userAgent.utils');


/**
 * Detects Flash support as well as Flash-blocking plugins.
 * @param {function(this:SCOPE,boolean,boolean)} callback
 * @param {SCOPE=} opt_scope
 * @template SCOPE
 */
npf.userAgent.flash.isSupported = function(callback, opt_scope) {
  /** @type {!goog.dom.DomHelper} */
  var domHelper = goog.dom.getDomHelper();
  /** @type {boolean} */
  var activex = false;

  // we wrap activex in a try/catch because when Flash is disabled through
  // ActiveX controls, it throws an error.
  try {
    // Pan is an API that exists for Flash objects.
    activex = 'ActiveXObject' in goog.global &&
      'Pan' in new goog.global['ActiveXObject']('ShockwaveFlash.ShockwaveFlash');
  } catch (e) {}

  /** @type {Object} */
  var navigator = goog.userAgent.getNavigator();
  /** @type {boolean} */
  var easyDetect = !(('plugins' in navigator &&
    'Shockwave Flash' in navigator.plugins) || activex);

  if (easyDetect || npf.userAgent.utils.isSvg(domHelper)) {
    callback.call(opt_scope, false, false);
  } else {
    // Flash seems to be installed, but it might be blocked. We have to
    // actually create an element to see what happens to it.
    var embed = domHelper.createDom(goog.dom.TagName.EMBED, {
      'type': 'application/x-shockwave-flash'
    });
    /** @type {!(HTMLElement|SVGElement)} */
    var body = npf.userAgent.utils.getBody(domHelper);
    // Need to do this in the body (fake or otherwise) otherwise IE8 complains
    body.appendChild(embed);
    domHelper.getDocument().documentElement.appendChild(body);

    // Pan doesn't exist in the embed if its IE (its on the ActiveXObjeect)
    // so this check is for all other browsers.
    if (!('Pan' in embed) && !activex) {
      npf.userAgent.flash.removeEmbed_(embed);
      callback.call(opt_scope, true, true);
      npf.userAgent.flash.removeFakeBody_(body);

      return;
    }

    var blockedDetect = function() {
      // if we used a fake body originally, we need to restart this test, since
      // we haven't been attached to the DOM, and therefore none of the blockers
      // have had time to work.
      if (!domHelper.getDocument().documentElement.contains(body)) {
        body = domHelper.getDocument().body || body;
        embed = domHelper.createDom(goog.dom.TagName.EMBED, {
          'type': 'application/x-shockwave-flash'
        });
        body.appendChild(embed);

        return setTimeout(blockedDetect, 1000);
      }

      /** @type {boolean} */
      var blocked = true;

      if (domHelper.getDocument().documentElement.contains(embed)) {
        if (!embed.style.cssText) {
          blocked = false;
        }

        npf.userAgent.flash.removeEmbed_(embed);
      }

      callback.call(opt_scope, true, blocked);

      npf.userAgent.flash.removeFakeBody_(body);
    };

    // If we have got this far, there is still a chance a userland plugin
    // is blocking us (either changing the styles, or automatically removing
    // the element). Both of these require us to take a step back for a moment
    // to allow for them to get time of the thread, hence a setTimeout.
    //
    setTimeout(blockedDetect, 10);
  }
};

/**
 * @param {Node} embed
 * @private
 */
npf.userAgent.flash.removeEmbed_ = function(embed) {
  /** @type {HTMLBodyElement} */
  var body = goog.dom.getDomHelper(embed).getDocument().body;

  if (embed && body.contains(embed)) {
    // in case embed has been wrapped, as with ClickToPlugin
    while (embed.parentNode !== body) {
      embed = embed.parentNode;
    }

    goog.dom.removeNode(embed);
  }
};

/**
 * @param {!(HTMLElement|SVGElement)} body
 * @private
 */
npf.userAgent.flash.removeFakeBody_ = function(body) {
  // If we’re rockin’ an attached fake body, clean it up
  if (body['fake']) {
    goog.dom.removeNode(body);
  }
};
