goog.provide('npf.net.FileInput');

goog.require('goog.dom');
goog.require('goog.dom.TagName');
goog.require('goog.dom.forms');
goog.require('goog.events');
goog.require('goog.events.BrowserEvent');
goog.require('goog.events.EventHandler');
goog.require('goog.events.EventTarget');
goog.require('goog.events.EventType');
goog.require('goog.style');


/**
 * @param {Element} buttonElement
 * @param {Element=} opt_parentElement
 * @constructor
 * @extends {goog.events.EventTarget}
 */
npf.net.FileInput = function(buttonElement, opt_parentElement) {
  goog.base(this);

  /**
   * @private {Element}
   */
  this.buttonElement_ = buttonElement;

  /**
   * @private {Element}
   */
  this.parentElement_ = opt_parentElement || this.buttonElement_;

  /**
   * @private {goog.dom.DomHelper}
   */
  this.domHelper_ = goog.dom.getDomHelper(this.parentElement_);

  /**
   * If disabled clicking on button won't do anything
   * @private {boolean}
   */
  this.enabled_ = false;

  /**
   * @private {string}
   */
  this.ext_ = '';

  /**
   * @private {string}
   */
  this.fileName_ = '';

  /**
   * @private {Element}
   */
  this.element_ = this.createElement_();

  /**
   * @private {HTMLInputElement}
   */
  this.inputElement_ = this.createInputElement_();
  goog.dom.appendChild(this.element_, this.inputElement_);
  goog.dom.appendChild(this.parentElement_, this.element_);

  /**
   * @private {goog.events.EventHandler}
   */
  this.handler_ = new goog.events.EventHandler(this);
  this.registerDisposable(this.handler_);
};
goog.inherits(npf.net.FileInput, goog.events.EventTarget);


/**
 * @enum {string}
 */
npf.net.FileInput.EventType = {
  CLICK: goog.events.getUniqueId('click'),
  CHANGE: goog.events.getUniqueId('change')
};

/**
 * Get file name from path.
 * @param {string} file path to file
 * @return {string}
 */
npf.net.FileInput.fileFromPath = function(file) {
  return file.replace(/.*(\/|\\)/, "");
};

/**
 * Get file extension lowercase.
 * @param {string} file name
 * @return file extenstion
 */
npf.net.FileInput.getExt = function(file) {
  return (-1 !== file.indexOf('.')) ? file.replace(/.*[.]/, '') : '';
};


/** @inheritDoc */
npf.net.FileInput.prototype.disposeInternal = function() {
  this.setEnabled(false);
  goog.dom.removeNode(this.element_);

  goog.base(this, 'disposeInternal');

  this.buttonElement_ = null;
  this.domHelper_ = null;
  this.element_ = null;
  this.handler_ = null;
  this.inputElement_ = null;
  this.parentElement_ = null;
};

/**
 * @return {Element}
 */
npf.net.FileInput.prototype.getElement = function() {
  return this.element_;
};

/**
 * @return {boolean}
 */
npf.net.FileInput.prototype.isEnabled = function() {
  return this.enabled_;
};

/**
 * @param {boolean} enable
 */
npf.net.FileInput.prototype.setEnabled = function(enable) {
  if (this.enabled_ != enable) {
    this.enabled_ = enable;

    // We use visibility instead of display to fix problem with Safari 4
    // The problem is that the value of input doesn't change if it
    // has display none when user selects a file
    this.inputElement_.style.visibility = this.enabled_ ? '' : 'hidden';

    if (this.enabled_) {
      this.handler_.
        listen(this.buttonElement_, goog.events.EventType.MOUSEOVER,
          this.onMouseOver_).
        listen(this.element_, goog.events.EventType.CLICK, this.onClick_).
        listen(this.inputElement_, goog.events.EventType.CHANGE,
          this.onChange_).
        listen(this.inputElement_, goog.events.EventType.MOUSEOUT,
          this.onMouseOut_);
    } else {
      this.handler_.removeAll();
    }
  }
};

/**
 * @return {string}
 */
npf.net.FileInput.prototype.getExt = function() {
  return this.ext_;
};

/**
 * @return {string}
 */
npf.net.FileInput.prototype.getFileName = function() {
  return this.fileName_;
};

/**
 * @return {HTMLInputElement}
 */
npf.net.FileInput.prototype.getInputElement = function() {
  return this.inputElement_;
};

/**
 * @return {!HTMLInputElement}
 * @private
 */
npf.net.FileInput.prototype.createInputElement_ = function() {
  var inputElement = /** @type {!HTMLInputElement} */ (
    this.domHelper_.createDom(goog.dom.TagName.INPUT, {
      'type': 'file'
    })
  );
  inputElement.style.cssText = 'cursor:pointer;font-size:480px;margin:0;'+
    'padding:0;position:absolute;right:0';

  return inputElement;
};

/**
 * @return {!Element}
 * @private
 */
npf.net.FileInput.prototype.createElement_ = function() {
  /** @type {!Element} */
  var element = this.domHelper_.createDom(goog.dom.TagName.DIV);
  element.style.cssText = 'direction:ltr;display:block;margin:0;opacity:0;' +
    'overflow:hidden;padding:0;position:absolute;z-index:2147483583';

  return element;
};

/**
 * @param {goog.events.BrowserEvent} evt
 * @private
 */
npf.net.FileInput.prototype.onChange_ = function(evt) {
  var value = /** @type {string} */ (
    goog.dom.forms.getValue(this.inputElement_));

  // Get filename from input, required as some browsers have path instead of it.

  /** @type {string} */
  this.fileName_ = npf.net.FileInput.fileFromPath(value);
  this.ext_ = npf.net.FileInput.getExt(this.fileName_);

  var event = new goog.events.BrowserEvent(evt.getBrowserEvent());
  event.type = npf.net.FileInput.EventType.CHANGE;
  this.dispatchEvent(event);
};

/**
 * @param {goog.events.BrowserEvent} evt
 * @private
 */
npf.net.FileInput.prototype.onClick_ = function(evt) {
  goog.dom.forms.setValue(this.inputElement_, '');

  var event = new goog.events.BrowserEvent(evt.getBrowserEvent());
  event.type = npf.net.FileInput.EventType.CLICK;
  this.dispatchEvent(event);
};

/**
 * @param {goog.events.BrowserEvent} evt
 * @private
 */
npf.net.FileInput.prototype.onMouseOut_ = function(evt) {
  // We use visibility instead of display to fix problem with Safari 4
  // The problem is that the value of input doesn't change if it
  // has display none when user selects a file
  this.element_.style.visibility = 'hidden';
};

/**
 * @param {goog.events.BrowserEvent} evt
 * @private
 */
npf.net.FileInput.prototype.onMouseOver_ = function(evt) {
  /** @type {!goog.math.Coordinate} */
  var offset = goog.style.getRelativePosition(
    this.buttonElement_, this.parentElement_);
  goog.style.setStyle(this.element_, {
    'height': this.buttonElement_.offsetHeight + 'px',
    'left': offset.x + 'px',
    'position': 'absolute',
    'top': offset.y + 'px',
    'visibility': 'visible',
    'width': this.buttonElement_.offsetWidth + 'px'
  });
};
