goog.provide('npf.events.Clipboard');
goog.provide('npf.events.Clipboard.Action');
goog.provide('npf.events.Clipboard.EventType');

goog.require('goog.dom');
goog.require('goog.dom.TagName');
goog.require('goog.events');
goog.require('goog.events.EventTarget');
goog.require('goog.events.EventType');
goog.require('npf.events.ClickHandler');


/**
 * @param {!Element|string} inputElement
 * @param {Element=} opt_handleElement
 * @param {npf.events.Clipboard.Action=} opt_action
 * @param {goog.dom.DomHelper=} opt_domHelper
 * @constructor
 * @struct
 * @extends {goog.events.EventTarget}
 */
npf.events.Clipboard = function(inputElement, opt_handleElement, opt_action,
    opt_domHelper) {
  npf.events.Clipboard.base(this, 'constructor');

  /**
   * @type {npf.events.Clipboard.Action}
   */
  this.action = opt_action || npf.events.Clipboard.Action.COPY;

  /**
   * @private {npf.events.ClickHandler}
   */
  this.clickHandler_ = opt_handleElement ?
    new npf.events.ClickHandler(opt_handleElement) : null;

  /**
   * @private {goog.dom.DomHelper}
   */
  this.domHelper_ = opt_domHelper || goog.dom.getDomHelper();

  /**
   * @private {Element}
   */
  this.fakeElement_ = null;

  /**
   * @private {Element}
   */
  this.inputElement_ = null;

  /**
   * @private {string}
   */
  this.selectedText_ = '';

  /**
   * @private {string?}
   */
  this.text_ = null;

  if (goog.isString(inputElement)) {
    this.text_ = inputElement;
  } else {
    this.inputElement_ = inputElement;
  }

  if (this.clickHandler_) {
    this.clickHandler_.listen(
      goog.events.EventType.CLICK, this.onClick_, false, this);
  }
};
goog.inherits(npf.events.Clipboard, goog.events.EventTarget);


/**
 * @enum {string}
 */
npf.events.Clipboard.Action = {
  COPY: 'copy',
  CUT: 'cut'
};

/**
 * @enum {string}
 */
npf.events.Clipboard.EventType = {
  COPY: goog.events.getUniqueId('copy'),
  ERROR: goog.events.getUniqueId('error')
};


/** @inheritDoc */
npf.events.Clipboard.prototype.disposeInternal = function() {
  goog.dispose(this.clickHandler_);

  if (this.fakeElement_) {
    this.domHelper_.removeNode(this.fakeElement_);
    this.fakeElement_ = null;
  }

  npf.events.Clipboard.base(this, 'disposeInternal');

  this.clickHandler_ = null;
  this.domHelper_ = null;
  this.inputElement_ = null;
};

npf.events.Clipboard.prototype.copy = function() {
  if (this.inputElement_) {
    if (
      goog.dom.TagName.INPUT == this.inputElement_.nodeName ||
      goog.dom.TagName.TEXTAREA == this.inputElement_.nodeName
    ) {
      this.inputElement_.select();
      this.selectedText_ = this.inputElement_.value;
    } else {
      var range = this.domHelper_.getDocument().createRange();
      var selection = this.domHelper_.getWindow().getSelection();

      range.selectNodeContents(this.inputElement_);
      selection.addRange(range);
      this.selectedText_ = selection.toString();
    }
  } else {
    this.selectedText_ = /** @type {string} */ (this.text_);

    if (!this.fakeElement_) {
      /** @type {Element} */
      var bodyElement = this.domHelper_.getDocument().body;
      this.fakeElement_ = this.domHelper_.createDom(goog.dom.TagName.INPUT, {
        'readonly': true,
        'style': 'left:-9999px;position:absolute',
        'value': this.selectedText_
      });
      this.domHelper_.appendChild(bodyElement, this.fakeElement_);
    }

    this.fakeElement_.select();
  }

  /** @type {boolean} */
  var success = false;

  try {
    success = this.domHelper_.getDocument().execCommand(this.action);
  } catch (e) { }

  /** @type {npf.events.Clipboard.EventType} */
  var eventType = success ?
    npf.events.Clipboard.EventType.COPY : npf.events.Clipboard.EventType.ERROR;
  this.dispatchEvent(eventType);
};

/**
 * @return {string}
 */
npf.events.Clipboard.prototype.getSelectedText = function() {
  return this.selectedText_;
};

/**
 * Removes current selection and focus from `target` element.
 */
npf.events.Clipboard.prototype.clearSelection = function() {
  if (this.inputElement_) {
    this.inputElement_.blur();
  }

  this.domHelper_.getWindow().getSelection().removeAllRanges();
  this.selectedText_ = '';
};

/**
 * Defines a new `ClipboardAction` on each click event.
 * @param {goog.events.BrowserEvent} evt
 * @private
 */
npf.events.Clipboard.prototype.onClick_ = function(evt) {
  this.copy();
};
