goog.provide('npf.graphics.ImageOrientation');

goog.require('goog.dom');
goog.require('goog.dom.TagName');
goog.require('goog.fs.url');
goog.require('goog.math');
goog.require('npf.fs.arrayBuffer');
goog.require('npf.net.ImageLoader');


/**
 * @param {!Blob} blob
 * @param {goog.dom.DomHelper=} opt_domHelper
 * @constructor
 * @struct
 */
npf.graphics.ImageOrientation = function(blob, opt_domHelper) {

  /**
   * @private {!Blob}
   */
  this._blob = blob;

  /**
   * @private {!goog.dom.DomHelper}
   */
  this._domHelper = opt_domHelper || goog.dom.getDomHelper();
};

/**
 * @param {function(this:SCOPE,!Image,HTMLCanvasElement)} callback
 * @param {SCOPE=} opt_scope
 * @template SCOPE
 */
npf.graphics.ImageOrientation.prototype.fix = function(callback, opt_scope) {
  /** @type {string} */
  var url = goog.fs.url.createObjectUrl(this._blob);
  var imageLoader = new npf.net.ImageLoader(url);
  imageLoader.load(function(image) {
    this.getOrientation(function(orientation) {
      /** @type {HTMLCanvasElement} */
      var canvasElement = null;

      if (orientation && 1 < orientation) {
        canvasElement = /** @type {!HTMLCanvasElement} */ (
          this._domHelper.createDom(goog.dom.TagName.CANVAS, {
            'height': 5 > orientation ? image.height : image.width,
            'width': 5 > orientation ? image.width : image.height
          })
        );
        var ctx = /** @type {!CanvasRenderingContext2D} */ (
          canvasElement.getContext('2d'));

        switch (orientation) {
          case 2:
            this._flipImage(ctx, image.width);
            break;
          case 3:
            this._rotateImage(ctx, 2, image.width, image.height);
            break;
          case 4:
            this._flopImage(ctx, image.height);
            break;
          case 5:
            this._rotateImage(ctx, 1, image.width, image.height);
            this._flopImage(ctx, image.height);
            break;
          case 6:
            this._rotateImage(ctx, 1, image.width, image.height);
            break;
          case 7:
            this._rotateImage(ctx, 1, image.width, image.height);
            this._flipImage(ctx, image.width);
            break;
          case 8:
            this._rotateImage(ctx, 3, image.width, image.height);
            break;
        }

        ctx.drawImage(image, 0, 0, image.width, image.height);
      }

      callback.call(opt_scope, /** @type {!Image} */ (image), canvasElement);
    }, this);
  }, this);
};

/**
 * @param {!DataView} dataView
 * @param {number} start
 * @return {number?}
 * @private
 */
npf.graphics.ImageOrientation.prototype._readExifData = function(dataView,
    start) {
  if ('Exif' == this._getString(dataView, start, 4)) {
    /** @type {number} */
    var tiffOffset = start + 6;
    /** @type {number} */
    var tiffOffset16 = dataView.getUint16(tiffOffset);

    if (0x4949 == tiffOffset16 || 0x4D4D == tiffOffset16) {
      /** @type {boolean} */
      var bigEnd = 0x4D4D == tiffOffset16;

      if (0x002A == dataView.getUint16(tiffOffset + 2, !bigEnd)) {
        /** @type {number} */
        var firstIFDOffset = dataView.getUint32(tiffOffset + 4, !bigEnd);

        if (0x00000008 <= firstIFDOffset) {
          var dirStart = tiffOffset + firstIFDOffset;
          /** @type {number} */
          var entries = dataView.getUint16(dirStart, !bigEnd);

          for (var i = 0; i < entries; i++) {
            /** @type {number} */
            var entryOffset = dirStart + i * 12 + 2;

            if (0x0112 == dataView.getUint16(entryOffset, !bigEnd)) {
              return 3 == dataView.getUint16(entryOffset + 2, !bigEnd) &&
                1 == dataView.getUint32(entryOffset + 4, !bigEnd) ?
                  dataView.getUint16(entryOffset + 8, !bigEnd) : null;
            }
          }
        }
      }
    }
  }

  return null;
};

/**
 * @param {!CanvasRenderingContext2D} ctx
 * @param {number} width
 * @private
 */
npf.graphics.ImageOrientation.prototype._flipImage = function(ctx, width) {
  ctx.translate(width, 0);
  ctx.scale(-1, 1);
};

/**
 * @param {!CanvasRenderingContext2D} ctx
 * @param {number} height
 * @private
 */
npf.graphics.ImageOrientation.prototype._flopImage = function(ctx, height) {
  ctx.translate(0, height);
  ctx.scale(1, -1);
};

/**
 * @param {!CanvasRenderingContext2D} ctx
 * @param {number} rotate
 * @param {number} width
 * @param {number} height
 * @private
 */
npf.graphics.ImageOrientation.prototype._rotateImage = function(ctx, rotate,
    width, height) {
  rotate = (rotate % 4 + 4) % 4;

  /** @type {number} */
  var x = 1 < rotate ? -width : 0;
  /** @type {number} */
  var y = 3 > rotate ? -height : 0;
  ctx.rotate(goog.math.toRadians(rotate * 90));
  ctx.translate(x, y);
};

/**
 * Value | 0th Row     | 0th Column
 * ------+-------------+-----------
 *   1   | top         | left side
 *   2   | top         | right side
 *   3   | bottom      | right side
 *   4   | bottom      | left side
 *   5   | left side   | top
 *   6   | right side  | top
 *   7   | right side  | bottom
 *   8   | left side   | bottom
 *
 * For convenience, here is what the letter F would look like if it were
 * tagged correctly and displayed by a program that ignores the orientation
 * tag:
 *
 *   1        2       3      4        5            6           7          8
 *
 * 888888  888888      88  88     8888888888  88                  88  8888888888
 * 88          88      88  88     88  88      88  88          88  88      88  88
 * 8888      8888    8888  8888   88          8888888888  8888888888          88
 * 88          88      88  88
 * 88          88  888888  888888
 *
 * @param {function(this:SCOPE,number?)} callback
 * @param {SCOPE=} opt_scope
 * @template SCOPE
 */
npf.graphics.ImageOrientation.prototype.getOrientation = function(callback,
    opt_scope) {
  npf.fs.arrayBuffer.getFromBlob(this._blob, function(buffer) {
    /** @type {number?} */
    var orientation = null;

    if (buffer) {
      orientation = this._getOrientation(buffer);
    }

    callback.call(opt_scope, orientation);
  }, this);
};

/**
 * @param {!ArrayBuffer} buffer
 * @return {number?}
 * @private
 */
npf.graphics.ImageOrientation.prototype._getOrientation = function(buffer) {
  var dataView = new DataView(buffer);

  if (0xFF != dataView.getUint8(0) || 0xD8 != dataView.getUint8(1)) {
    return null;
  }

  /** @type {number} */
  var offset = 2;

  while (offset < buffer.byteLength) {
    if (0xFF != dataView.getUint8(offset)) {
      return null;
    }

    if (225 == dataView.getUint8(offset + 1)) {
      /** @type {number?} */
      var value = this._readExifData(dataView, offset + 4);

      return goog.isNumber(value) && 0 < value && value < 9 ? value : null;
    } else {
      offset += 2 + dataView.getUint16(offset + 2);
    }
  }

  return null;
};

/**
 * @param {!DataView} dataView
 * @param {number} start
 * @param {number} length
 * @return {string}
 * @private
 */
npf.graphics.ImageOrientation.prototype._getString = function(dataView, start,
    length) {
  /** @type {string} */
  var outstr = '';
  /** @type {number} */
  var finish = start + length;

  for (var i = start; i < finish; i++) {
    outstr += String.fromCharCode(dataView.getUint8(i));
  }

  return outstr;
};
