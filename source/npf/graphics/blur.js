goog.provide('npf.graphics.Blur');
goog.provide('npf.graphics.Blur.BlurStack');

goog.require('goog.math.Rect');
goog.require('npf.graphics.Effect');


/**
 * StackBlur - a fast almost Gaussian Blur For Canvas
 * Version: 0.5
 * Author: Mario Klingemann
 * Contact: mario@quasimondo.com
 * Website: http://www.quasimondo.com/StackBlurForCanvas/StackBlurDemo.html
 * Twitter: @quasimondo
 * @constructor
 * @extends {npf.graphics.Effect}
 */
npf.graphics.Blur = function(source, destination) {
  goog.base(this, source, destination);
};
goog.inherits(npf.graphics.Blur, npf.graphics.Effect);


/**
 * @param {HTMLCanvasElement|Image|HTMLImageElement} source Canvas or loaded image.
 * @param {Object.<number|string>=} opt_attrs
 * @param {goog.dom.DomHelper=} opt_domHelper
 * @return {!npf.graphics.Blur}
 */
npf.graphics.Blur.create = function(source, opt_attrs, opt_domHelper) {
  /** @type {!HTMLCanvasElement} */
  var dest = npf.graphics.Effect.createCanvasElement(opt_attrs, opt_domHelper);

  return new npf.graphics.Blur(source, dest);
};


/**
 * @param {number} radius
 * @param {boolean=} opt_blurAlphaChannel
 * @param {goog.math.Rect=} opt_rect
 */
npf.graphics.Blur.prototype.convert = function(radius, opt_blurAlphaChannel,
    opt_rect) {
  if (this.drawImage(this.source, this.destination)) {
    /** @type {!goog.math.Rect} */
    var rect = opt_rect ||
      new goog.math.Rect(0, 0, this.source.width, this.source.height);

    if (opt_blurAlphaChannel) {
      return this._stackBlurRgba(rect, radius);
    } else {
      return this._stackBlurRgb(rect, radius);
    }
  }

  return false;
};

/**
 * @param {goog.math.Rect} rect
 * @param {number} radius
 * @return {boolean}
 * @private
 */
npf.graphics.Blur.prototype._stackBlurRgba = function(rect, radius) {
  /** @type {ImageData} */
  var imageData = this.getImageData(this.destination, rect);

  if (!imageData) {
    return false;
  }

  /** @type {CanvasPixelArray} */
  var pixels = imageData.data;
  /** @type {number} */
  var x;
  /** @type {number} */
  var y;
  /** @type {number} */
  var i;
  /** @type {number} */
  var p;
  /** @type {number} */
  var rSum;
  /** @type {number} */
  var gSum;
  /** @type {number} */
  var bSum;
  /** @type {number} */
  var aSum;
  /** @type {number} */
  var rOutSum;
  /** @type {number} */
  var gOutSum;
  /** @type {number} */
  var bOutSum;
  /** @type {number} */
  var aOutSum;
  /** @type {number} */
  var rInSum;
  /** @type {number} */
  var gInSum;
  /** @type {number} */
  var bInSum;
  /** @type {number} */
  var aInSum;
  /** @type {number} */
  var pr;
  /** @type {number} */
  var pg;
  /** @type {number} */
  var pb;
  /** @type {number} */
  var pa;
  /** @type {number} */
  var rbs;
  /** @type {number} */
  var div = radius + radius + 1;
  /** @type {number} */
  var widthMinus1 = rect.width - 1;
  /** @type {number} */
  var heightMinus1 = rect.height - 1;
  /** @type {number} */
  var radiusPlus1 = radius + 1;
  /** @type {number} */
  var sumFactor = radiusPlus1 * (radiusPlus1 + 1) / 2;
  /** @type {npf.graphics.Blur.BlurStack} */
  var stackStart = new npf.graphics.Blur.BlurStack();
  /** @type {npf.graphics.Blur.BlurStack} */
  var stack = stackStart;
  /** @type {npf.graphics.Blur.BlurStack} */
  var stackEnd = null;

  for (i = 1; i < div; i++) {
    stack = stack.next = new npf.graphics.Blur.BlurStack();

    if (i == radiusPlus1) {
      stackEnd = stack;
    }
  }

  stack.next = stackStart;

  /** @type {npf.graphics.Blur.BlurStack} */
  var stackIn = null;
  /** @type {npf.graphics.Blur.BlurStack} */
  var stackOut = null;
  /** @type {number} */
  var yw = 0;
  /** @type {number} */
  var yi = 0;
  /** @type {number} */
  var mulSum = npf.graphics.Blur.mulTable[radius];
  /** @type {number} */
  var shgSum = npf.graphics.Blur.ShgTable[radius];

  for (y = 0; y < rect.height; y++) {
    rInSum = 0;
    gInSum = 0;
    bInSum = 0;
    aInSum = 0;
    rSum = 0;
    gSum = 0;
    bSum = 0;
    aSum = 0;

    pr = pixels[yi];
    pg = pixels[yi+1];
    pb = pixels[yi+2];
    pa = pixels[yi+3];

    rOutSum = radiusPlus1 * pr;
    gOutSum = radiusPlus1 * pg;
    bOutSum = radiusPlus1 * pb;
    aOutSum = radiusPlus1 * pa;

    rSum += sumFactor * pr;
    gSum += sumFactor * pg;
    bSum += sumFactor * pb;
    aSum += sumFactor * pa;

    stack = stackStart;

    for (i = 0; i < radiusPlus1; i++) {
      stack.r = pr;
      stack.g = pg;
      stack.b = pb;
      stack.a = pa;
      stack = stack.next;
    }

    for (i = 1; i < radiusPlus1; i++) {
      p = yi + ((widthMinus1 < i ? widthMinus1 : i) << 2);
      rbs = radiusPlus1 - i;
      pr = pixels[p];
      pg = pixels[p+1];
      pb = pixels[p+2];
      pa = pixels[p+3];
      stack.r = pr;
      stack.g = pg;
      stack.b = pb;
      stack.a = pa;
      rSum += pr * rbs;
      gSum += pg * rbs;
      bSum += pb * rbs;
      aSum += pa * rbs;

      rInSum += pr;
      gInSum += pg;
      bInSum += pb;
      aInSum += pa;

      stack = stack.next;
    }

    stackIn = stackStart;
    stackOut = stackEnd;

    for (x = 0; x < rect.width; x++) {
      pa = (aSum * mulSum) >> shgSum;
      pixels[yi+3] = pa;

      if (0 != pa) {
        pa = 255 / pa;
        pixels[yi] = ((rSum * mulSum) >> shgSum) * pa;
        pixels[yi+1] = ((gSum * mulSum) >> shgSum) * pa;
        pixels[yi+2] = ((bSum * mulSum) >> shgSum) * pa;
      } else {
        pixels[yi] = 0;
        pixels[yi+1] = 0;
        pixels[yi+2] = 0;
      }

      rSum -= rOutSum;
      gSum -= gOutSum;
      bSum -= bOutSum;
      aSum -= aOutSum;

      rOutSum -= stackIn.r;
      gOutSum -= stackIn.g;
      bOutSum -= stackIn.b;
      aOutSum -= stackIn.a;

      p = (yw + ((p = x + radius + 1) < widthMinus1 ? p : widthMinus1)) << 2;

      stackIn.r = pixels[p];
      stackIn.g = pixels[p+1];
      stackIn.b = pixels[p+2];
      stackIn.a = pixels[p+3];

      rInSum += stackIn.r;
      gInSum += stackIn.g;
      bInSum += stackIn.b;
      aInSum += stackIn.a;

      rSum += rInSum;
      gSum += gInSum;
      bSum += bInSum;
      aSum += aInSum;

      stackIn = stackIn.next;

      pr = stackOut.r;
      pg = stackOut.g;
      pb = stackOut.b;
      pa = stackOut.a;

      rOutSum += pr;
      gOutSum += pg;
      bOutSum += pb;
      aOutSum += pa;

      rInSum -= pr;
      gInSum -= pg;
      bInSum -= pb;
      aInSum -= pa;

      stackOut = stackOut.next;

      yi += 4;
    }

    yw += rect.width;
  }

  for (x = 0; x < rect.width; x++) {
    gInSum = 0;
    bInSum = 0;
    aInSum = 0;
    rInSum = 0;
    gSum = 0;
    bSum = 0;
    aSum = 0;
    rSum = 0;

    yi = x << 2;
    pr = pixels[yi];
    pg = pixels[yi+1];
    pb = pixels[yi+2];
    pa = pixels[yi+3];
    rOutSum = radiusPlus1 * pr;
    gOutSum = radiusPlus1 * pg;
    bOutSum = radiusPlus1 * pb;
    aOutSum = radiusPlus1 * pa;

    rSum += sumFactor * pr;
    gSum += sumFactor * pg;
    bSum += sumFactor * pb;
    aSum += sumFactor * pa;

    stack = stackStart;

    for (i = 0; i < radiusPlus1; i++) {
      stack.r = pr;
      stack.g = pg;
      stack.b = pb;
      stack.a = pa;
      stack = stack.next;
    }

    /** @type {number} */
    var yp = rect.width;

    for (i = 1; i <= radius; i++) {
      yi = (yp + x) << 2;

      rbs = radiusPlus1 - i;
      pr = pixels[yi];
      pg = pixels[yi + 1];
      pb = pixels[yi + 2];
      pa = pixels[yi + 3];
      stack.r = pr;
      stack.g = pg;
      stack.b = pb;
      stack.a = pa;
      rSum += pr * rbs;
      gSum += pg * rbs;
      bSum += pb * rbs;
      aSum += pa * rbs;

      rInSum += pr;
      gInSum += pg;
      bInSum += pb;
      aInSum += pa;

      stack = stack.next;

      if (i < heightMinus1) {
        yp += rect.width;
      }
    }

    yi = x;
    stackIn = stackStart;
    stackOut = stackEnd;

    for (y = 0; y < rect.height; y++) {
      p = yi << 2;
      pa = (aSum * mulSum) >> shgSum;
      pixels[p+3] = pa;

      if (pa > 0) {
        pa = 255 / pa;
        pixels[p] = ((rSum * mulSum) >> shgSum) * pa;
        pixels[p + 1] = ((gSum * mulSum) >> shgSum) * pa;
        pixels[p + 2] = ((bSum * mulSum) >> shgSum) * pa;
      } else {
        pixels[p] = 0;
        pixels[p + 1] = 0;
        pixels[p + 2] = 0;
      }

      rSum -= rOutSum;
      gSum -= gOutSum;
      bSum -= bOutSum;
      aSum -= aOutSum;

      rOutSum -= stackIn.r;
      gOutSum -= stackIn.g;
      bOutSum -= stackIn.b;
      aOutSum -= stackIn.a;

      p = (
        x + (
          (
            (p = y + radiusPlus1) < heightMinus1 ? p : heightMinus1
          ) * rect.width
        )
      ) << 2;

      rSum += (rInSum += (stackIn.r = pixels[p]));
      gSum += (gInSum += (stackIn.g = pixels[p+1]));
      bSum += (bInSum += (stackIn.b = pixels[p+2]));
      aSum += (aInSum += (stackIn.a = pixels[p+3]));

      stackIn = stackIn.next;

      rOutSum += (pr = stackOut.r);
      gOutSum += (pg = stackOut.g);
      bOutSum += (pb = stackOut.b);
      aOutSum += (pa = stackOut.a);

      rInSum -= pr;
      gInSum -= pg;
      bInSum -= pb;
      aInSum -= pa;

      stackOut = stackOut.next;

      yi += rect.width;
    }
  }

  this.destination.getContext('2d').putImageData(
    imageData, rect.left, rect.top);

  return true;
};

/**
 * @param {goog.math.Rect} rect
 * @param {number} radius
 * @return {boolean}
 * @private
 */
npf.graphics.Blur.prototype._stackBlurRgb = function(rect, radius) {
  /** @type {ImageData} */
  var imageData = this.getImageData(this.destination, rect);

  if (!imageData) {
    return false;
  }

  /** @type {CanvasPixelArray} */
  var pixels = imageData.data;
  /** @type {number} */
  var x;
  /** @type {number} */
  var y;
  /** @type {number} */
  var i;
  /** @type {number} */
  var p;
  /** @type {number} */
  var yp;
  /** @type {number} */
  var yi;
  /** @type {number} */
  var yw;
  /** @type {number} */
  var rSum;
  /** @type {number} */
  var gSum;
  /** @type {number} */
  var bSum;
  /** @type {number} */
  var rOutSum;
  /** @type {number} */
  var gOutSum;
  /** @type {number} */
  var bOutSum;
  /** @type {number} */
  var rInSum;
  /** @type {number} */
  var gInSum;
  /** @type {number} */
  var bInSum;
  /** @type {number} */
  var pr;
  /** @type {number} */
  var pg;
  /** @type {number} */
  var pb;
  /** @type {number} */
  var rbs;
  /** @type {number} */
  var div = radius + radius + 1;
  /** @type {number} */
  var widthMinus1 = rect.width - 1;
  /** @type {number} */
  var heightMinus1 = rect.height - 1;
  /** @type {number} */
  var radiusPlus1 = radius + 1;
  /** @type {number} */
  var sumFactor = radiusPlus1 * (radiusPlus1 + 1) / 2;
  /** @type {npf.graphics.Blur.BlurStack} */
  var stackStart = new npf.graphics.Blur.BlurStack();
  /** @type {npf.graphics.Blur.BlurStack} */
  var stack = stackStart;
  /** @type {npf.graphics.Blur.BlurStack} */
  var stackEnd = null

  for (i = 1; i < div; i++) {
    stack = stack.next = new npf.graphics.Blur.BlurStack();

    if (i == radiusPlus1) {
      stackEnd = stack;
    }
  }

  stack.next = stackStart;

  /** @type {npf.graphics.Blur.BlurStack} */
  var stackIn = null;
  /** @type {npf.graphics.Blur.BlurStack} */
  var stackOut = null;

  yw = 0;
  yi = 0;

  /** @type {number} */
  var mulSum = npf.graphics.Blur.mulTable[radius];
  /** @type {number} */
  var shgSum = npf.graphics.Blur.ShgTable[radius];

  for (y = 0; y < rect.height; y++) {
    rInSum = 0;
    gInSum = 0;
    bInSum = 0;
    rSum = 0;
    gSum = 0;
    bSum = 0;

    rOutSum = radiusPlus1 * (pr = pixels[yi]);
    gOutSum = radiusPlus1 * (pg = pixels[yi+1]);
    bOutSum = radiusPlus1 * (pb = pixels[yi+2]);

    rSum += sumFactor * pr;
    gSum += sumFactor * pg;
    bSum += sumFactor * pb;

    stack = stackStart;

    for (i = 0; i < radiusPlus1; i++) {
      stack.r = pr;
      stack.g = pg;
      stack.b = pb;
      stack = stack.next;
    }

    for (i = 1; i < radiusPlus1; i++) {
      p = yi + ((widthMinus1 < i ? widthMinus1 : i) << 2);
      rbs = radiusPlus1 - i;
      rSum += (stack.r = (pr = pixels[p])) * rbs;
      gSum += (stack.g = (pg = pixels[p + 1])) * rbs;
      bSum += (stack.b = (pb = pixels[p + 2])) * rbs;

      rInSum += pr;
      gInSum += pg;
      bInSum += pb;

      stack = stack.next;
    }

    stackIn = stackStart;
    stackOut = stackEnd;

    for (x = 0; x < rect.width; x++) {
      pixels[yi]   = (rSum * mulSum) >> shgSum;
      pixels[yi+1] = (gSum * mulSum) >> shgSum;
      pixels[yi+2] = (bSum * mulSum) >> shgSum;

      rSum -= rOutSum;
      gSum -= gOutSum;
      bSum -= bOutSum;

      rOutSum -= stackIn.r;
      gOutSum -= stackIn.g;
      bOutSum -= stackIn.b;

      p =  (yw + ((p = x + radius + 1) < widthMinus1 ? p : widthMinus1)) << 2;

      rInSum += (stackIn.r = pixels[p]);
      gInSum += (stackIn.g = pixels[p+1]);
      bInSum += (stackIn.b = pixels[p+2]);

      rSum += rInSum;
      gSum += gInSum;
      bSum += bInSum;

      stackIn = stackIn.next;

      rOutSum += (pr = stackOut.r);
      gOutSum += (pg = stackOut.g);
      bOutSum += (pb = stackOut.b);

      rInSum -= pr;
      gInSum -= pg;
      bInSum -= pb;

      stackOut = stackOut.next;

      yi += 4;
    }

    yw += rect.width;
  }

  for (x = 0; x < rect.width; x++) {
    gInSum = 0;
    bInSum = 0;
    rInSum = 0;
    gSum = 0;
    bSum = 0;
    rSum = 0;

    yi = x << 2;
    rOutSum = radiusPlus1 * (pr = pixels[yi]);
    gOutSum = radiusPlus1 * (pg = pixels[yi+1]);
    bOutSum = radiusPlus1 * (pb = pixels[yi+2]);

    rSum += sumFactor * pr;
    gSum += sumFactor * pg;
    bSum += sumFactor * pb;

    stack = stackStart;

    for (i = 0; i < radiusPlus1; i++) {
      stack.r = pr;
      stack.g = pg;
      stack.b = pb;
      stack = stack.next;
    }

    yp = rect.width;

    for (i = 1; i <= radius; i++) {
      yi = (yp + x) << 2;

      rSum += (stack.r = (pr = pixels[yi])) * (rbs = radiusPlus1 - i);
      gSum += (stack.g = (pg = pixels[yi+1])) * rbs;
      bSum += (stack.b = (pb = pixels[yi+2])) * rbs;

      rInSum += pr;
      gInSum += pg;
      bInSum += pb;

      stack = stack.next;

      if (i < heightMinus1) {
        yp += rect.width;
      }
    }

    yi = x;
    stackIn = stackStart;
    stackOut = stackEnd;

    for (y = 0; y < rect.height; y++) {
      p = yi << 2;
      pixels[p] = (rSum * mulSum) >> shgSum;
      pixels[p+1] = (gSum * mulSum) >> shgSum;
      pixels[p+2] = (bSum * mulSum) >> shgSum;

      rSum -= rOutSum;
      gSum -= gOutSum;
      bSum -= bOutSum;

      rOutSum -= stackIn.r;
      gOutSum -= stackIn.g;
      bOutSum -= stackIn.b;

      p = (x + (((p = y + radiusPlus1) < heightMinus1
         ? p : heightMinus1) * rect.width)) << 2;

      rSum += (rInSum += (stackIn.r = pixels[p]));
      gSum += (gInSum += (stackIn.g = pixels[p+1]));
      bSum += (bInSum += (stackIn.b = pixels[p+2]));

      stackIn = stackIn.next;

      rOutSum += (pr = stackOut.r);
      gOutSum += (pg = stackOut.g);
      bOutSum += (pb = stackOut.b);

      rInSum -= pr;
      gInSum -= pg;
      bInSum -= pb;

      stackOut = stackOut.next;

      yi += rect.width;
    }
  }

  this.destination.getContext('2d').putImageData(
    imageData, rect.left, rect.top);

  return true;
};


/**
 * @constructor
 */
npf.graphics.Blur.BlurStack = function() {
  /**
   * @type {number}
   */
  this.r = 0;

  /**
   * @type {number}
   */
  this.g = 0;

  /**
   * @type {number}
   */
  this.b = 0;

  /**
   * @type {number}
   */
  this.a = 0;

  /**
   * @type {npf.graphics.Blur.BlurStack}
   */
  this.next = null;
};


/**
 * @type {Array.<number>}
 */
npf.graphics.Blur.mulTable = [
  512,512,456,512,328,456,335,512,405,328,271,456,388,335,292,512,
  454,405,364,328,298,271,496,456,420,388,360,335,312,292,273,512,
  482,454,428,405,383,364,345,328,312,298,284,271,259,496,475,456,
  437,420,404,388,374,360,347,335,323,312,302,292,282,273,265,512,
  497,482,468,454,441,428,417,405,394,383,373,364,354,345,337,328,
  320,312,305,298,291,284,278,271,265,259,507,496,485,475,465,456,
  446,437,428,420,412,404,396,388,381,374,367,360,354,347,341,335,
  329,323,318,312,307,302,297,292,287,282,278,273,269,265,261,512,
  505,497,489,482,475,468,461,454,447,441,435,428,422,417,411,405,
  399,394,389,383,378,373,368,364,359,354,350,345,341,337,332,328,
  324,320,316,312,309,305,301,298,294,291,287,284,281,278,274,271,
  268,265,262,259,257,507,501,496,491,485,480,475,470,465,460,456,
  451,446,442,437,433,428,424,420,416,412,408,404,400,396,392,388,
  385,381,377,374,370,367,363,360,357,354,350,347,344,341,338,335,
  332,329,326,323,320,318,315,312,310,307,304,302,299,297,294,292,
  289,287,285,282,280,278,275,273,271,269,267,265,263,261,259
];

/**
 * @type {Array.<number>}
 */
npf.graphics.Blur.ShgTable = [
  9, 11, 12, 13, 13, 14, 14, 15, 15, 15, 15, 16, 16, 16, 16, 17,
  17, 17, 17, 17, 17, 17, 18, 18, 18, 18, 18, 18, 18, 18, 18, 19,
  19, 19, 19, 19, 19, 19, 19, 19, 19, 19, 19, 19, 19, 20, 20, 20,
  20, 20, 20, 20, 20, 20, 20, 20, 20, 20, 20, 20, 20, 20, 20, 21,
  21, 21, 21, 21, 21, 21, 21, 21, 21, 21, 21, 21, 21, 21, 21, 21,
  21, 21, 21, 21, 21, 21, 21, 21, 21, 21, 22, 22, 22, 22, 22, 22,
  22, 22, 22, 22, 22, 22, 22, 22, 22, 22, 22, 22, 22, 22, 22, 22,
  22, 22, 22, 22, 22, 22, 22, 22, 22, 22, 22, 22, 22, 22, 22, 23,
  23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23,
  23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23,
  23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23,
  23, 23, 23, 23, 23, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24,
  24, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24,
  24, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24,
  24, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24,
  24, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24
];
