goog.provide('npf.graphics.blend.functions');


/**
 * @param {number} a
 * @param {number} b
 * @return {number}
 */
npf.graphics.blend.functions.add = function(a, b) {
  return Math.min(255, a + b);
};

/**
 * @param {number} a
 * @param {number} b
 * @return {number}
 */
npf.graphics.blend.functions.average = function(a, b) {
  return (a + b) / 2;
};

/**
 * @param {number} a
 * @param {number} b
 * @return {number}
 */
npf.graphics.blend.functions.colorBurn = function(a, b) {
  return b == 0 ? b : Math.max(0, (255 - ((255 - a) << 8 ) / b));
};

/**
 * @param {number} a
 * @param {number} b
 * @return {number}
 */
npf.graphics.blend.functions.colorDodge = function(a, b) {
  return b == 255 ? b : Math.min(255, ((a << 8 ) / (255 - b)));
};

/**
 * @param {number} a
 * @param {number} b
 * @return {number}
 */
npf.graphics.blend.functions.darken = function(a, b) {
  return (b > a) ? a : b;
};

/**
 * @param {number} a
 * @param {number} b
 * @return {number}
 */
npf.graphics.blend.functions.difference = function(a, b) {
  return Math.abs(a - b);
};

/**
 * @param {number} a
 * @param {number} b
 * @return {number}
 */
npf.graphics.blend.functions.exclusion = function(a, b) {
  return a + b - 2 * a * b / 255;
};

/**
 * @param {number} a
 * @param {number} b
 * @return {number}
 */
npf.graphics.blend.functions.glow = function(a, b) {
  return npf.graphics.blend.functions.reflect(b, a);
};

/**
 * @param {number} a
 * @param {number} b
 * @return {number}
 */
npf.graphics.blend.functions.hardLight = function(a, b) {
  return npf.graphics.blend.functions.overlay(b, a);
};

/**
 * @param {number} a
 * @param {number} b
 * @return {number}
 */
npf.graphics.blend.functions.hardMix = function(a, b) {
  return npf.graphics.blend.functions.vividLight(a, b) < 128 ? 0 : 255;
};

/**
 * @param {number} a
 * @param {number} b
 * @return {number}
 */
npf.graphics.blend.functions.lighten = function(a, b) {
  return (b > a) ? b : a;
};

/**
 * @param {number} a
 * @param {number} b
 * @return {number}
 */
npf.graphics.blend.functions.linearBurn = function(a, b) {
  return npf.graphics.blend.functions.substract(a, b);
};

/**
 * @param {number} a
 * @param {number} b
 * @return {number}
 */
npf.graphics.blend.functions.linearDodge = function(a, b) {
  return npf.graphics.blend.functions.add(a, b);
};

/**
 * @param {number} a
 * @param {number} b
 * @return {number}
 */
npf.graphics.blend.functions.linearLight = function(a, b) {
  return b < 128
    ? npf.graphics.blend.functions.linearBurn(a, 2 * b)
    : npf.graphics.blend.functions.linearDodge(a, (2 * (b - 128)));
};

/**
 * @param {number} a
 * @param {number} b
 * @return {number}
 */
npf.graphics.blend.functions.multiply = function(a, b) {
  return (a * b) / 255;
};

/**
 * @param {number} a
 * @param {number} b
 * @return {number}
 */
npf.graphics.blend.functions.overlay = function(a, b) {
  return b < 128
    ? (2 * a * b / 255)
    : (255 - 2 * (255 - a) * (255 - b) / 255);
};

/**
 * @param {number} a
 * @param {number} b
 * @return {number}
 */
npf.graphics.blend.functions.negation = function(a, b) {
  return 255 - Math.abs(255 - a - b);
};

/**
 * @param {number} a
 * @param {number} b
 * @return {number}
 */
npf.graphics.blend.functions.normal = function(a, b) {
  return a;
};

/**
 * @param {number} a
 * @param {number} b
 * @return {number}
 */
npf.graphics.blend.functions.phoenix = function(a, b) {
  return Math.min(a, b) - Math.max(a, b) + 255;
};

/**
 * @param {number} a
 * @param {number} b
 * @return {number}
 */
npf.graphics.blend.functions.pinLight = function(a, b) {
  return b < 128
    ? npf.graphics.blend.functions.darken(a, 2 * b)
    : npf.graphics.blend.functions.lighten(a, (2 * (b - 128)));
};

/**
 * @param {number} a
 * @param {number} b
 * @return {number}
 */
npf.graphics.blend.functions.reflect = function(a, b) {
  return b == 255 ? b : Math.min(255, (a * a / (255 - b)));
};

/**
 * @param {number} a
 * @param {number} b
 * @return {number}
 */
npf.graphics.blend.functions.screen = function(a, b) {
  return 255 - (((255 - a) * (255 - b)) >> 8);
};

/**
 * @param {number} a
 * @param {number} b
 * @return {number}
 */
npf.graphics.blend.functions.softLight = function(a, b) {
  return b < 128
    ? (2 * ((a >> 1) + 64)) * (b / 255)
    : 255 - (2 * (255 - (( a >> 1) + 64)) * (255 - b) / 255);
};

/**
 * @param {number} a
 * @param {number} b
 * @return {number}
 */
npf.graphics.blend.functions.substract = function(a, b) {
  return (a + b < 255) ? 0 : a + b - 255;
};

/**
 * @param {number} a
 * @param {number} b
 * @return {number}
 */
npf.graphics.blend.functions.vividLight = function(a, b) {
  return b < 128
    ? npf.graphics.blend.functions.colorBurn(a, 2 * b)
    : npf.graphics.blend.functions.colorDodge(a, (2 * (b - 128)));
};
