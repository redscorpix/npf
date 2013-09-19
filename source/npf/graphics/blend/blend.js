goog.provide('npf.graphics.Blend');
goog.provide('npf.graphics.Blend.Mode');

goog.require('goog.dom');
goog.require('goog.dom.TagName');
goog.require('goog.math');
goog.require('npf.graphics.Effect');
goog.require('npf.graphics.blend.functions');


/**
 * JavaScript implementation of common blending modes, based on
 * http://stackoverflow.com/questions/5919663/how-does-photoshop-blend-two-images-together
 * @param {HTMLCanvasElement|Image|HTMLImageElement} source1 Canvas or loaded
 *                                                           image.
 * @param {HTMLCanvasElement|Image|HTMLImageElement} source2 Canvas or loaded
 *                                                           image.
 * @param {HTMLCanvasElement} destination
 * @constructor
 * @extends {npf.graphics.Effect}
 */
npf.graphics.Blend = function(source1, source2, destination) {
  goog.base(this, source1, destination);

  /**
   * @type {HTMLCanvasElement|Image|HTMLImageElement}
   */
  this.source2 = source2;
};
goog.inherits(npf.graphics.Blend, npf.graphics.Effect);


/**
 * @enum {number}
 */
npf.graphics.Blend.Mode = {
  ADD: 1,
  AVERAGE: 2,
  COLOR_BURN: 3,
  COLOR_DODGE: 4,
  DARKEN: 5,
  DIFFERENCE: 6,
  EXCLUSION: 7,
  GLOW: 8,
  HARD_LIGHT: 9,
  HARD_MIX: 10,
  LIGHTEN: 11,
  LINEAR_BURN: 12,
  LINEAR_DODGE: 13,
  LINEAR_LIGHT: 14,
  MULTIPLY: 16,
  NEGATION: 17,
  NORMAL: 15,
  OVERLAY: 18,
  PHOENIX: 19,
  PIN_LIGHT: 20,
  REFLECT: 21,
  SOFT_LIGHT: 22,
  SCREEN: 23,
  SUBSTRACT: 24,
  VIVID_LIGHT: 25
};


/**
 * @param {HTMLCanvasElement|Image|HTMLImageElement} source1 Canvas or loaded
 *                                                           image.
 * @param {HTMLCanvasElement|Image|HTMLImageElement} source2 Canvas or loaded
 *                                                           image.
 * @param {Object.<number|string>=} opt_attrs
 * @param {goog.dom.DomHelper=} opt_domHelper
 * @return {!npf.graphics.Blend}
 */
npf.graphics.Blend.create = function(source1, source2, opt_attrs,
    opt_domHelper) {
  /** @type {!HTMLCanvasElement} */
  var dest = npf.graphics.Effect.createCanvasElement(opt_attrs, opt_domHelper);

  return new npf.graphics.Blend(source1, source2, dest);
};

/**
 * @param {npf.graphics.Blend.Mode} mode
 * @return {function(number,number):number}
 */
npf.graphics.Blend.getBlendFunction = function(mode) {
  switch (mode) {
    case npf.graphics.Blend.Mode.ADD:
      return npf.graphics.blend.functions.add;

    case npf.graphics.Blend.Mode.AVERAGE:
      return npf.graphics.blend.functions.average;

    case npf.graphics.Blend.Mode.COLOR_BURN:
      return npf.graphics.blend.functions.colorBurn;

    case npf.graphics.Blend.Mode.COLOR_DODGE:
      return npf.graphics.blend.functions.colorDodge;

    case npf.graphics.Blend.Mode.DARKEN:
      return npf.graphics.blend.functions.darken;

    case npf.graphics.Blend.Mode.DIFFERENCE:
      return npf.graphics.blend.functions.difference;

    case npf.graphics.Blend.Mode.EXCLUSION:
      return npf.graphics.blend.functions.exclusion;

    case npf.graphics.Blend.Mode.GLOW:
      return npf.graphics.blend.functions.glow;

    case npf.graphics.Blend.Mode.HARD_LIGHT:
      return npf.graphics.blend.functions.hardLight;

    case npf.graphics.Blend.Mode.HARD_MIX:
      return npf.graphics.blend.functions.hardMix;

    case npf.graphics.Blend.Mode.LIGHTEN:
      return npf.graphics.blend.functions.lighten;

    case npf.graphics.Blend.Mode.LINEAR_BURN:
      return npf.graphics.blend.functions.linearBurn;

    case npf.graphics.Blend.Mode.LINEAR_DODGE:
      return npf.graphics.blend.functions.linearDodge;

    case npf.graphics.Blend.Mode.LINEAR_LIGHT:
      return npf.graphics.blend.functions.linearLight;

    case npf.graphics.Blend.Mode.MULTIPLY:
      return npf.graphics.blend.functions.multiply;

    case npf.graphics.Blend.Mode.NEGATION:
      return npf.graphics.blend.functions.negation;

    case npf.graphics.Blend.Mode.NORMAL:
      return npf.graphics.blend.functions.normal;

    case npf.graphics.Blend.Mode.OVERLAY:
      return npf.graphics.blend.functions.overlay;

    case npf.graphics.Blend.Mode.PHOENIX:
      return npf.graphics.blend.functions.phoenix;

    case npf.graphics.Blend.Mode.PIN_LIGHT:
      return npf.graphics.blend.functions.pinLight;

    case npf.graphics.Blend.Mode.REFLECT:
      return npf.graphics.blend.functions.reflect;

    case npf.graphics.Blend.Mode.SOFT_LIGHT:
      return npf.graphics.blend.functions.softLight;

    case npf.graphics.Blend.Mode.SCREEN:
      return npf.graphics.blend.functions.screen;

    case npf.graphics.Blend.Mode.SUBSTRACT:
      return npf.graphics.blend.functions.substract;

    case npf.graphics.Blend.Mode.VIVID_LIGHT:
      return npf.graphics.blend.functions.vividLight;

  }
};

/**
 * @param {npf.graphics.Blend.Mode=} opt_mode Blending mode. Defaults
 *                                   to npf.graphics.Blend.Mode.NORMAL.
 * @param {number=} opt_alpha Blending opacity. Defaults to 1.
 * @return {boolean}
 */
npf.graphics.Blend.prototype.blend = function(opt_mode, opt_alpha) {
  /** @type {number} */
  var alpha = goog.isDef(opt_alpha) ? goog.math.clamp(opt_alpha, 0, 1) : 1;
  /** @type {number} */
  var alpha1 = 1 - alpha;
  /** @type {number} */
  var width =  Math.min(this.source.width, this.source2.width);
  /** @type {number} */
  var height = Math.min(this.source.height, this.source2.height);
  /** @type {ImageData} */
  var imageData1 = this.getImageData(this.source);
  /** @type {ImageData} */
  var imageData2 = this.getImageData(this.source2);

  if (imageData1 && imageData2) {
    var pixels1 = /** @type {Uint8ClampedArray} */ (imageData1.data);
    var pixels2 = /** @type {Uint8ClampedArray} */ (imageData2.data);
    /** @type {function(number,number):number} */
    var blendFunction = npf.graphics.Blend.getBlendFunction(this.mode);

    // Blend images.
    for (var i = 0, il = pixels1.length; i < il; i += 4) {
      /** @type {number} */
      var oR = pixels1[i];
      /** @type {number} */
      var oG = pixels1[i + 1];
      /** @type {number} */
      var oB = pixels1[i + 2];

      // Calculate blended color.

      /** @type {number} */
      var r = blendFunction(pixels2[i], oR);
      /** @type {number} */
      var g = blendFunction(pixels2[i + 1], oG);
      /** @type {number} */
      var b = blendFunction(pixels2[i + 2], oB);

      // alpha compositing
      pixels1[i] =     r * alpha + oR * alpha1;
      pixels1[i + 1] = g * alpha + oG * alpha1;
      pixels1[i + 2] = b * alpha + oB * alpha1;
    }

    this.destination.width = width;
    this.destination.height = height;
    this.destination.getContext('2d').putImageData(imageData1, 0, 0);

    return true;
  }

  return false;
};
