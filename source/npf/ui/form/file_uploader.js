goog.provide('npf.ui.form.FileUploader');

goog.require('npf.events.FileDropHandler');
goog.require('npf.events.FileDropHandler.EventType');
goog.require('npf.net.FileInput');
goog.require('npf.net.FileInput.EventType');
goog.require('npf.ui.form.Field');
goog.require('npf.ui.form.FileSizeValidator');
goog.require('npf.ui.form.FileTypeValidator');
goog.require('npf.ui.form.FileUploaderRenderer');


/**
 * @param {string} name
 * @param {npf.ui.form.FileUploaderRenderer=} opt_renderer
 * @param {goog.dom.DomHelper=} opt_domHelper
 * @constructor
 * @struct
 * @extends {npf.ui.form.Field}
 */
npf.ui.form.FileUploader = function(name, opt_renderer, opt_domHelper) {
  /** @type {!npf.ui.form.FileUploaderRenderer} */
  var renderer = opt_renderer || npf.ui.form.FileUploaderRenderer.getInstance();
  npf.ui.form.FileUploader.base(
    this, 'constructor', name, renderer, opt_domHelper);

  /**
   * @private {npf.ui.StatedComponent}
   */
  this.dropArea_ = null;

  /**
   * @private {number}
   */
  this.dropAreaHideTimeoutId_ = 0;

  /**
   * @private {npf.net.FileInput}
   */
  this.fileInput_ = null;

  this.addClassName(renderer.getFieldCssClass());
  this.setValue(null);
};
goog.inherits(npf.ui.form.FileUploader, npf.ui.form.Field);


/** @inheritDoc */
npf.ui.form.FileUploader.prototype.createDom = function() {
  npf.ui.form.FileUploader.base(this, 'createDom');

  this.dropArea_ = this.appendDropArea();

  if (this.dropArea_) {
    this.dropArea_.setVisible(false);
  }

  this.fileInput_ = this.createFileInput();
  this.registerDisposable(this.fileInput_);
};

/** @inheritDoc */
npf.ui.form.FileUploader.prototype.enterDocument = function() {
  npf.ui.form.FileUploader.base(this, 'enterDocument');

  var fileDropHandler = new npf.events.FileDropHandler(
    this.getDomHelper().getDocument());
  this.disposeOnExitDocument(fileDropHandler);

  if (this.fileInput_) {
    this.fileInput_.setEnabled(true);
  }

  this.getHandler().
    listen(fileDropHandler, npf.events.FileDropHandler.EventType.DRAG_ENTER,
      this.onDragEnter).
    listen(fileDropHandler, npf.events.FileDropHandler.EventType.DRAG_OVER,
      this.onDragOver).
    listen(fileDropHandler, npf.events.FileDropHandler.EventType.DRAG_LEAVE,
      this.onDragLeave).
    listen(fileDropHandler, npf.events.FileDropHandler.EventType.DROP,
      this.onDrop);

  if (this.fileInput_) {
    this.getHandler().listen(
      this.fileInput_, npf.net.FileInput.EventType.CHANGE, this.onFileSelect_);
  }
};

/** @inheritDoc */
npf.ui.form.FileUploader.prototype.exitDocument = function() {
  if (this.fileInput_) {
    this.fileInput_.setEnabled(false);
  }

  if (this.dropArea_) {
    this.dropArea_.setVisible(false);
    clearTimeout(this.dropAreaHideTimeoutId_);
  }

  npf.ui.form.FileUploader.base(this, 'exitDocument');
};

/** @inheritDoc */
npf.ui.form.FileUploader.prototype.disposeInternal = function() {
  npf.ui.form.FileUploader.base(this, 'disposeInternal');

  this.dropArea_ = null;
  this.fileInput_ = null;
};

/** @inheritDoc */
npf.ui.form.FileUploader.prototype.isEmpty = function() {
  return !this.getValue();
};

/**
 * @return {File}
 * @override
 */
npf.ui.form.FileUploader.prototype.getValue = function() {
  return /** @type {File} */ (npf.ui.form.FileUploader.base(this, 'getValue'));
};

/** @inheritDoc */
npf.ui.form.FileUploader.prototype.setValue = function(value, opt_noRender,
    opt_force) {
  if (!(goog.isNull(value) || value instanceof File)) {
    throw Error(npf.ui.form.Field.Error.TYPE_INVALID);
  }

  npf.ui.form.FileUploader.base(
    this, 'setValue', value, opt_noRender, opt_force);
};

/**
 * @return {npf.ui.StatedComponent}
 * @protected
 */
npf.ui.form.FileUploader.prototype.appendDropArea = function() {
  return null;
};

/**
 * @return {npf.ui.StatedComponent}
 */
npf.ui.form.FileUploader.prototype.getDropArea = function() {
  return this.dropArea_;
};

/**
 * @return {npf.net.FileInput}
 */
npf.ui.form.FileUploader.prototype.createFileInput = function() {
  return new npf.net.FileInput(this.getContentElement());
};

/**
 * @return {npf.net.FileInput}
 */
npf.ui.form.FileUploader.prototype.getFileInput = function() {
  return this.fileInput_;
};

/**
 * @param {goog.events.BrowserEvent} evt
 * @protected
 */
npf.ui.form.FileUploader.prototype.onDragEnter = function(evt) {
  if (this.dropArea_) {
    clearTimeout(this.dropAreaHideTimeoutId_);
    this.dropArea_.setVisible(true);
  }
};

/**
 * @param {goog.events.BrowserEvent} evt
 * @protected
 */
npf.ui.form.FileUploader.prototype.onDragOver = function(evt) {
  if (this.dropArea_) {
    clearTimeout(this.dropAreaHideTimeoutId_);
    this.dropArea_.setVisible(true);
  }
};

/**
 * @param {goog.events.BrowserEvent} evt
 * @protected
 */
npf.ui.form.FileUploader.prototype.onDragLeave = function(evt) {
  if (this.dropArea_) {
    var dropArea = this.dropArea_;
    this.dropAreaHideTimeoutId_ = setTimeout(function() {
      dropArea_.setVisible(false);
    }, 100);
  }
};

/**
 * @param {goog.events.BrowserEvent} evt
 * @protected
 */
npf.ui.form.FileUploader.prototype.onDrop = function(evt) {
  if (this.dropArea_) {
    clearTimeout(this.dropAreaHideTimeoutId_);
    this.dropArea_.setVisible(false);
  }

  /** @type {DataTransfer} */
  var dataTransfer = evt.getBrowserEvent().dataTransfer;

  if (dataTransfer.files && dataTransfer.files[0]) {
    this.setValue(dataTransfer.files[0]);
  }
};

/**
 * @param {goog.events.BrowserEvent} evt
 * @private
 */
npf.ui.form.FileUploader.prototype.onFileSelect_ = function(evt) {
  var inputElement = /** @type {HTMLInputElement} */ (evt.target);
  this.onFileSelect(inputElement);
};

/**
 * @param {HTMLInputElement} inputElement
 * @protected
 */
npf.ui.form.FileUploader.prototype.onFileSelect = function(inputElement) {
  if (inputElement.files && inputElement.files[0]) {
    this.setValue(inputElement.files[0]);
  }
};

/**
 * @param {string} errorMessage
 * @param {number=} opt_maxSize
 * @param {number=} opt_minSize
 */
npf.ui.form.FileUploader.prototype.addFileSizeValidator = function(errorMessage,
    opt_maxSize, opt_minSize) {
  var validator = new npf.ui.form.FileSizeValidator(
    errorMessage, opt_maxSize, opt_minSize);
  this.addValidator(validator);
};

/**
 * @param {string} errorMessage
 * @param {Array.<string>} types
 */
npf.ui.form.FileUploader.prototype.addFileTypeValidator = function(errorMessage,
    types) {
  var validator = new npf.ui.form.FileTypeValidator(errorMessage, types);
  this.addValidator(validator);
};
