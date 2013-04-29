goog.provide('npf.ui.richScrollBar.SizeMonitor');
goog.provide('npf.ui.richScrollBar.SizeMonitor.EventType');

goog.require('goog.dom');
goog.require('goog.events');
goog.require('goog.events.EventTarget');
goog.require('goog.events.EventType');
goog.require('goog.userAgent');


/**
 * @param {Element} parentElement DOM element for monitoring
 * @param {goog.dom.DomHelper=} opt_domHelper
 * @constructor
 * @extends {goog.events.EventTarget}
 */
npf.ui.richScrollBar.SizeMonitor = function(parentElement, opt_domHelper) {
  goog.base(this);

  var dom = opt_domHelper || goog.dom.getDomHelper();

  /**
   * Offscreen iframe which we use to detect resize events.
   * @type {Element}
   * @private
   */
  this.sizeElement_ = dom.createDom(goog.userAgent.IE ? 'div' : 'iframe', {
    'style' : 'position:absolute;width:100%;height:100%;top:-10000px;border:0'
  });
  var p = parentElement;
  goog.dom.appendChild(p, this.sizeElement_);

  /**
   * The object that we listen to resize events on.
   * @type {Element|Window}
   * @private
   */
  var resizeTarget = this.resizeTarget_ = goog.userAgent.IE
      ? this.sizeElement_
      : goog.dom.getFrameContentWindow(/** @type {HTMLIFrameElement} */ (this.sizeElement_));

  // We need to open and close the document to get Firefox 2 to work. We must
  // not do this for IE in case we are using HTTPS since accessing the document
  // on an about:blank iframe in IE using HTTPS raises a Permission Denied
  // error. Additionally, firefox shows this frame in tab order by default,
  // suppress it by using a tabindex of -1.
  if (goog.userAgent.GECKO) {
    this.sizeElement_.tabIndex = -1;
    var doc = resizeTarget.document;
    doc.open();
    doc.close();
  }

  // Listen to resize event on the window inside the iframe.
  goog.events.listen(resizeTarget, goog.events.EventType.RESIZE,
    this.handleResize_, false, this);

  /**
   * @type {number}
   * @private
   */
  this.lastWidth_ = this.sizeElement_.offsetWidth;

  /**
   * @type {number}
   * @private
   */
  this.lastHeight_ = this.sizeElement_.offsetHeight;
};
goog.inherits(npf.ui.richScrollBar.SizeMonitor, goog.events.EventTarget);


/**
 * The event types that the FontSizeMonitor fires.
 * @enum {string}
 */
npf.ui.richScrollBar.SizeMonitor.EventType = {
  CHANGE : goog.events.getUniqueId('change')
};


/** @inheritDoc */
npf.ui.richScrollBar.SizeMonitor.prototype.disposeInternal = function() {
  goog.base(this, 'disposeInternal');

  goog.events.unlisten(this.resizeTarget_, goog.events.EventType.RESIZE,
    this.handleResize_, false, this);
  this.resizeTarget_ = null;

  // Firefox 2 crashes if the iframe is removed during the unload phase.
  if (!goog.userAgent.GECKO || goog.userAgent.isVersion('1.9')) {
    goog.dom.removeNode(this.sizeElement_);
  }

  this.sizeElement_ = null;
};

/**
 * Handles the onresize event of the iframe and dispatches a change event in case its size really
 * changed.
 * @param {goog.events.BrowserEvent} e The event object.
 * @private
 */
npf.ui.richScrollBar.SizeMonitor.prototype.handleResize_ = function(e) {
  var currentWidth = this.sizeElement_.offsetWidth;
  var currentHeight = this.sizeElement_.offsetHeight;

  if (this.lastWidth_ != currentWidth || this.lastHeight_ != currentHeight) {
    this.lastWidth_ = currentWidth;
    this.lastHeight_ = currentHeight;
    this.dispatchEvent(npf.ui.richScrollBar.SizeMonitor.EventType.CHANGE);
  }
};
