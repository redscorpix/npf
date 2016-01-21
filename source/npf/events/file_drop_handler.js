goog.provide('npf.events.FileDropHandler');
goog.provide('npf.events.FileDropHandler.EventType');

goog.require('goog.array');
goog.require('goog.dom');
goog.require('goog.events.BrowserEvent');
goog.require('goog.events.EventHandler');
goog.require('goog.events.EventTarget');
goog.require('goog.events.EventType');


/**
 * @param {Element|Document} element The element or document to listen on.
 * @param {boolean=} opt_preventDropOutside Whether to prevent a drop on the
 *     area outside the {@code element}. Default false.
 * @constructor
 * @struct
 * @extends {goog.events.EventTarget}
 */
npf.events.FileDropHandler = function(element, opt_preventDropOutside) {
  npf.events.FileDropHandler.base(this, 'constructor');

  /**
   * Whether the drag event contains files. It is initialized only in the
   * dragenter event. It is used in all the drag events to prevent default actions
   * only if the drag contains files. Preventing default actions is necessary to
   * go from dragenter to dragover and from dragover to drop. However we do not
   * always want to prevent default actions, e.g. when the user drags text or
   * links on a text area we should not prevent the browser default action that
   * inserts the text in the text area. It is also necessary to stop propagation
   * when handling drag events on the element to prevent them from propagating
   * to the document.
   * @private
   * @type {boolean}
   */
  this.dndContainsFiles_ = false;

  /**
   * @private {goog.events.EventHandler.<!npf.events.FileDropHandler>}
   */
  this.handler_ = new goog.events.EventHandler(this);
  this.registerDisposable(this.handler_);

  var doc = opt_preventDropOutside ?
    goog.dom.getOwnerDocument(element) : element;

  this.handler_.
    listen(doc, goog.events.EventType.DRAGENTER, this.onDocDragEnter_).
    listen(element, goog.events.EventType.DRAGLEAVE, this.onElementDragLeave_).
    listen(element, goog.events.EventType.DRAGOVER, this.onElementDragOver_).
    listen(element, goog.events.EventType.DROP, this.onElementDrop_);

  if (doc != element) {
    this.handler_.listen(doc, goog.events.EventType.DRAGOVER,
      this.onDocDragOver_);
  }
};
goog.inherits(npf.events.FileDropHandler, goog.events.EventTarget);


/**
 * @enum {string}
 */
npf.events.FileDropHandler.EventType = {
  DRAG_ENTER: goog.events.EventType.DRAGENTER,
  DRAG_LEAVE: goog.events.EventType.DRAGLEAVE,
  DRAG_OVER: goog.events.EventType.DRAGOVER,
  DROP: goog.events.EventType.DROP
};


/** @inheritDoc */
npf.events.FileDropHandler.prototype.disposeInternal = function() {
  npf.events.FileDropHandler.base(this, 'disposeInternal');

  this.handler_ = null;
};

/**
 * @param {goog.events.BrowserEvent} evt
 * @private
 */
npf.events.FileDropHandler.prototype.onDocDragEnter_ = function(evt) {
  /** @type {DataTransfer} */
  var dataTransfer = evt.getBrowserEvent().dataTransfer;

  // Check whether the drag event contains files.
  this.dndContainsFiles_ = !!(
    dataTransfer &&
    (
      (dataTransfer.types &&
        (
          goog.array.contains(dataTransfer.types, 'Files') ||
          goog.array.contains(dataTransfer.types, 'public.file-url')
        )
      ) ||
      (dataTransfer.files && 0 < dataTransfer.files.length)
    )
  );

  if (this.dndContainsFiles_) {
    // Prevent default actions.
    evt.preventDefault();

    var event = new goog.events.BrowserEvent(evt.getBrowserEvent());
    event.type = npf.events.FileDropHandler.EventType.DRAG_ENTER;
    this.dispatchEvent(event);
  }
};

/**
 * @param {goog.events.BrowserEvent} evt
 * @private
 */
npf.events.FileDropHandler.prototype.onElementDragLeave_ = function(evt) {
  if (this.dndContainsFiles_) {
    var event = new goog.events.BrowserEvent(evt.getBrowserEvent());
    event.type = npf.events.FileDropHandler.EventType.DRAG_LEAVE;
    this.dispatchEvent(event);
  }
};

/**
 * @param {goog.events.BrowserEvent} evt
 * @private
 */
npf.events.FileDropHandler.prototype.onDocDragOver_ = function(evt) {
  if (this.dndContainsFiles_) {
    // Prevent default actions.
    evt.preventDefault();

    // Disable the drop on the document outside the drop zone.

    /** @type {DataTransfer} */
    var dataTransfer = evt.getBrowserEvent().dataTransfer;
    dataTransfer.dropEffect = 'none';
  }
};

/**
 * @param {goog.events.BrowserEvent} evt
 * @private
 */
npf.events.FileDropHandler.prototype.onElementDragOver_ = function(evt) {
  if (this.dndContainsFiles_) {
    // Prevent default actions and stop the event from propagating further to
    // the document. Both lines are needed! (See comment above).
    evt.preventDefault();
    evt.stopPropagation();

    /** @type {DataTransfer} */
    var dataTransfer = evt.getBrowserEvent().dataTransfer;

    if (dataTransfer) {
      // IE bug #811625 (https://goo.gl/UWuxX0) will throw error SCRIPT65535
      // when attempting to set property effectAllowed on IE10+.
      // See more: https://github.com/google/closure-library/issues/485.
      try {
        dataTransfer.effectAllowed = 'copy';
      } catch (e) {}

      dataTransfer.dropEffect = 'copy';
    }

    var event = new goog.events.BrowserEvent(evt.getBrowserEvent());
    event.type = npf.events.FileDropHandler.EventType.DRAG_OVER;
    this.dispatchEvent(event);
  }
};

/**
 * @param {goog.events.BrowserEvent} evt
 * @private
 */
npf.events.FileDropHandler.prototype.onElementDrop_ = function(evt) {
  // If the drag and drop event contains files.
  if (this.dndContainsFiles_) {
    // Prevent default actions and stop the event from propagating further to
    // the document. Both lines are needed! (See comment above).
    evt.preventDefault();
    evt.stopPropagation();

    var event = new goog.events.BrowserEvent(evt.getBrowserEvent());
    event.type = npf.events.FileDropHandler.EventType.DROP;
    this.dispatchEvent(event);
  }
};
